import { useMemo, useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Camera, Download, Pencil, Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { scanReceipt } from "@/lib/committee.functions";
import { downloadCsv, fmtDate, inr, toCsv } from "@/lib/committee-csv";

export type Offline = {
  id: string; collected_by: string; book_no: string; receipt_no: string; receipt_date: string;
  donor_name: string; amount: number; payment_type: string; payment_method: string; collection_date: string;
};

export const PAYMENT_TYPES = ["Donation", "Membership"];
export const METHODS = ["Cash", "Cheque", "UPI"] as const;
export const OFFLINE_HEADER = ["Serial No.", "Collected By", "Book No.", "Receipt No.", "Receipt Date", "Name of the Donor", "Amount", "Type of Payment", "Cash/Cheque/UPI", "Date of Collection"];

const year = new Date().getFullYear();
const cmpBook = (a: string, b: string) => a.localeCompare(b, undefined, { numeric: true });

export function totals(rows: Offline[]) {
  const sum = (f: (r: Offline) => boolean) => rows.filter(f).reduce((n, r) => n + Number(r.amount), 0);
  return {
    total: sum(() => true), cash: sum((r) => r.payment_method === "Cash"),
    upi: sum((r) => r.payment_method === "UPI"), cheque: sum((r) => r.payment_method === "Cheque"),
    count: rows.length, books: new Set(rows.map((r) => r.book_no)).size,
  };
}

export function exportOffline(rows: Offline[], filename: string) {
  const sorted = [...rows].sort((a, b) => cmpBook(a.book_no, b.book_no) || cmpBook(a.receipt_no, b.receipt_no));
  downloadCsv(filename, toCsv(OFFLINE_HEADER, sorted.map((r, i) => [
    i + 1, r.collected_by, r.book_no, r.receipt_no, fmtDate(r.receipt_date), r.donor_name,
    Number(r.amount), r.payment_type, r.payment_method, fmtDate(r.collection_date),
  ])));
}

type SortKey = "collection_date" | "amount" | "receipt_no" | "donor_name";

export function OfflineSection({ rows, reload }: { rows: Offline[]; reload: () => Promise<void> }) {
  const [book, setBook] = useState<string>("all");
  const [q, setQ] = useState("");
  const [method, setMethod] = useState("all");
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "receipt_no", dir: 1 });
  const [editing, setEditing] = useState<Partial<Offline> | null>(null);
  const [scanImage, setScanImage] = useState<string | null>(null);
  const [uncertain, setUncertain] = useState<string[]>([]);
  const [scanning, setScanning] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const scan = useServerFn(scanReceipt);

  const books = useMemo(() => [...new Set(rows.map((r) => r.book_no))].sort(cmpBook), [rows]);
  const inBook = useMemo(() => (book === "all" ? rows : rows.filter((r) => r.book_no === book)), [rows, book]);
  const t = totals(inBook);
  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const list = inBook.filter((r) => (method === "all" || r.payment_method === method) &&
      (!s || [r.donor_name, r.receipt_no, r.book_no, r.collected_by, r.payment_type, String(r.amount)].some((v) => v.toLowerCase().includes(s))));
    return list.sort((a, b) => {
      const k = sort.key;
      const c = k === "amount" ? Number(a.amount) - Number(b.amount) : k === "receipt_no" ? cmpBook(a.receipt_no, b.receipt_no) : String(a[k]).localeCompare(String(b[k]));
      return c * sort.dir;
    });
  }, [inBook, q, method, sort]);

  const sortBtn = (key: SortKey, label: string) => (
    <button type="button" className="font-semibold" onClick={() => setSort((s) => ({ key, dir: s.key === key ? (s.dir === 1 ? -1 : 1) : 1 }))}>
      {label}{sort.key === key ? (sort.dir === 1 ? " ↑" : " ↓") : ""}
    </button>
  );

  async function onPhoto(file: File | undefined) {
    if (!file) return;
    const dataUrl = await shrink(file);
    setScanImage(dataUrl);
    setUncertain([]);
    setEditing({ book_no: "" });
    setScanning(true);
    try {
      const res = await scan({ data: { image: dataUrl } });
      if (res.ok) {
        const f = res.fields;
        setEditing({
          book_no: "", collected_by: f.collected_by ?? "", receipt_no: f.receipt_no ?? "", receipt_date: f.receipt_date ?? "",
          donor_name: f.donor_name ?? "", ...(f.amount != null ? { amount: f.amount } : {}), payment_type: f.payment_type ?? "", payment_method: f.payment_method ?? "",
          collection_date: f.collection_date ?? "",
        });
        setUncertain(f.uncertain ?? []);
        toast.success("Details read — please check every field and enter the Book No.");
      } else toast.error(res.error);
    } catch { toast.error("Could not read the photo. Please fill the form manually."); }
    setScanning(false);
  }

  const bookSlug = book === "all" ? "all" : `book-${book.replace(/[^a-z0-9]+/gi, "-")}`;
  const methodSlug = method === "all" ? "" : `-${method.toLowerCase()}`;

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-2">
        <Button size="lg" onClick={() => { setScanImage(null); setUncertain([]); setEditing({ book_no: book === "all" ? "" : book }); }}><Plus className="mr-2 h-4 w-4" />Add Offline Donation</Button>
        <Button size="lg" variant="outline" onClick={() => fileRef.current?.click()}><Camera className="mr-2 h-4 w-4" />Scan Receipt / Upload Photo</Button>
        <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => { onPhoto(e.target.files?.[0]); e.target.value = ""; }} />
      </div>

      <div className="flex flex-wrap gap-2">
        {["all", ...books].map((b) => (
          <Button key={b} size="sm" variant={book === b ? "default" : "outline"} onClick={() => setBook(b)}>
            {b === "all" ? "All Offline Donations" : `Book No. ${b}`}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
        <Stat label={book === "all" ? "Total collected" : `Book ${book} total`} value={inr(t.total)} />
        <Stat label="Receipts" value={String(t.count)} />
        <Stat label="Cash" value={inr(t.cash)} />
        <Stat label="UPI" value={inr(t.upi)} />
        <Stat label="Cheque" value={inr(t.cheque)} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative min-w-[14rem] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search donor, receipt, book, collector…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value={method} onChange={(e) => setMethod(e.target.value)} aria-label="Payment method filter">
          <option value="all">All methods</option>{METHODS.map((m) => <option key={m}>{m}</option>)}
        </select>
        <Button variant="outline" disabled={!shown.length} onClick={() => exportOffline(shown, `nbsc-offline-donations-${bookSlug}${methodSlug}-${year}.csv`)}>
          <Download className="mr-2 h-4 w-4" />{book === "all" && method === "all" && !q ? "Download all" : "Download shown"}
        </Button>
        {books.length > 0 && (
          <select className="h-10 rounded-md border border-input bg-background px-3 text-sm" value="" aria-label="Download a book"
            onChange={(e) => { const b = e.target.value; if (b) exportOffline(rows.filter((r) => r.book_no === b), `nbsc-offline-donations-book-${b}-${year}.csv`); }}>
            <option value="">Download by book…</option>{books.map((b) => <option key={b} value={b}>Book No. {b}</option>)}
          </select>
        )}
      </div>

      {shown.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
          {inBook.length === 0 ? (book === "all" ? "No offline receipts recorded yet." : `No receipts in Book No. ${book} yet.`) : "No receipts match your search."}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-border bg-card">
          <table className="w-full min-w-[60rem] text-sm">
            <thead className="bg-muted text-left text-muted-foreground">
              <tr className="[&>th]:px-3 [&>th]:py-2">
                <th>Serial No.</th><th>Collected By</th><th>Book No.</th><th>{sortBtn("receipt_no", "Receipt No.")}</th><th>Receipt Date</th>
                <th>{sortBtn("donor_name", "Name of the Donor")}</th><th className="text-right">{sortBtn("amount", "Amount")}</th><th>Type of Payment</th>
                <th>Cash/Cheque/UPI</th><th>{sortBtn("collection_date", "Date of Collection")}</th><th />
              </tr>
            </thead>
            <tbody>
              {shown.map((r, i) => (
                <tr key={r.id} className="border-t border-border text-foreground [&>td]:px-3 [&>td]:py-2">
                  <td>{i + 1}</td><td>{r.collected_by}</td><td>{r.book_no}</td><td>{r.receipt_no}</td><td>{fmtDate(r.receipt_date)}</td>
                  <td>{r.donor_name}</td><td className="text-right font-semibold">{inr(Number(r.amount))}</td><td>{r.payment_type}</td>
                  <td>{r.payment_method}</td><td>{fmtDate(r.collection_date)}</td>
                  <td><Button size="sm" variant="ghost" aria-label="Edit receipt" onClick={() => { setScanImage(null); setUncertain([]); setEditing(r); }}><Pencil className="h-4 w-4" /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={editing !== null} onOpenChange={(o) => { if (!o) setEditing(null); }}>
        <DialogContent className="max-h-[92svh] max-w-3xl overflow-y-auto">
          <DialogHeader><DialogTitle>{editing?.id ? "Edit receipt" : scanImage ? "Check scanned receipt" : "Add offline donation"}</DialogTitle></DialogHeader>
          {editing && (
            <div className={scanImage ? "grid gap-4 md:grid-cols-[14rem_1fr]" : ""}>
              {scanImage && (
                <div className="space-y-2">
                  <img src={scanImage} alt="Receipt photo" className="w-full rounded-lg border border-border" />
                  <Button size="sm" variant="outline" className="w-full" onClick={() => fileRef.current?.click()}>Retake / replace</Button>
                  {scanning && <p className="text-sm text-muted-foreground">Reading the photo…</p>}
                </div>
              )}
              <ReceiptForm key={JSON.stringify(editing)} initial={editing} rows={rows} uncertain={uncertain} scanned={!!scanImage} busy={scanning}
                onCancel={() => setEditing(null)} onSaved={async () => { setEditing(null); await reload(); }} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ReceiptForm({ initial, rows, uncertain, scanned, busy, onCancel, onSaved }: {
  initial: Partial<Offline>; rows: Offline[]; uncertain: string[]; scanned: boolean; busy: boolean;
  onCancel: () => void; onSaved: () => Promise<void>;
}) {
  const [f, setF] = useState({
    collected_by: initial.collected_by ?? "", book_no: initial.book_no ?? "", receipt_no: initial.receipt_no ?? "",
    receipt_date: initial.receipt_date ?? "", donor_name: initial.donor_name ?? "", amount: initial.amount != null ? String(initial.amount) : "",
    payment_type: initial.payment_type ?? "", payment_method: initial.payment_method ?? "", collection_date: initial.collection_date ?? "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const set = (k: keyof typeof f) => (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value });
  const flag = (k: string) => (scanned && (!f[k as keyof typeof f] || uncertain.includes(k)) ? "ring-2 ring-destructive/50" : "");

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError("");
    const v = Object.fromEntries(Object.entries(f).map(([k, x]) => [k, x.trim()])) as typeof f;
    if (Object.values(v).some((x) => !x)) return setError("Please fill in every field.");
    const amount = Number(v.amount.replace(/[₹,\s]/g, ""));
    if (!Number.isFinite(amount) || amount <= 0) return setError("Amount must be greater than zero.");
    if (!METHODS.includes(v.payment_method as (typeof METHODS)[number])) return setError("Choose Cash, Cheque or UPI.");
    const dup = rows.find((r) => r.book_no === v.book_no && r.receipt_no === v.receipt_no && r.id !== initial.id);
    if (dup) return setError(`Receipt No. ${v.receipt_no} is already recorded in Book No. ${v.book_no}.`);
    setSaving(true);
    const row = { ...v, amount };
    const { error: err } = initial.id
      ? await supabase.from("offline_donations").update(row).eq("id", initial.id)
      : await supabase.from("offline_donations").insert(row);
    setSaving(false);
    if (err) return setError(err.code === "23505" ? `Receipt No. ${v.receipt_no} is already recorded in Book No. ${v.book_no}.` : "Could not save. Please try again.");
    toast.success(initial.id ? "Receipt updated" : "Donation saved");
    await onSaved();
  }

  const field = (k: keyof typeof f, label: string, input: React.ReactNode) => (
    <label className="grid gap-1 text-sm"><span className="font-medium text-foreground">{label} *</span>{input}</label>
  );

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      {field("book_no", "Book No.", <Input className={scanned ? "ring-2 ring-primary" : ""} value={f.book_no} onChange={set("book_no")} placeholder="e.g. 64" required autoFocus={scanned} />)}
      {field("receipt_no", "Receipt No.", <Input className={flag("receipt_no")} value={f.receipt_no} onChange={set("receipt_no")} placeholder="As printed" required />)}
      {field("collected_by", "Collected By", <Input className={flag("collected_by")} value={f.collected_by} onChange={set("collected_by")} required />)}
      {field("donor_name", "Name of the Donor", <Input className={flag("donor_name")} value={f.donor_name} onChange={set("donor_name")} required />)}
      {field("amount", "Amount (INR)", <Input className={flag("amount")} inputMode="decimal" value={f.amount} onChange={set("amount")} required />)}
      {field("payment_type", "Type of Payment", (
        <select className={`h-10 rounded-md border border-input bg-background px-3 ${flag("payment_type")}`} value={f.payment_type} onChange={set("payment_type")} required>
          <option value="">Choose…</option>
          {[...new Set([...PAYMENT_TYPES, ...(f.payment_type ? [f.payment_type] : [])])].map((t) => <option key={t}>{t}</option>)}
        </select>
      ))}
      {field("payment_method", "Payment Method", (
        <select className={`h-10 rounded-md border border-input bg-background px-3 ${flag("payment_method")}`} value={f.payment_method} onChange={set("payment_method")} required>
          <option value="">Choose…</option>{METHODS.map((m) => <option key={m}>{m}</option>)}
        </select>
      ))}
      {field("receipt_date", "Receipt Date", <Input className={flag("receipt_date")} type="date" value={f.receipt_date} onChange={set("receipt_date")} required />)}
      {field("collection_date", "Date of Collection", <Input className={flag("collection_date")} type="date" value={f.collection_date} onChange={set("collection_date")} required />)}
      {scanned && <p className="text-xs text-muted-foreground sm:col-span-2">Highlighted fields were missing or unclear in the photo. Book No. must always be entered by hand.</p>}
      {error && <p className="text-sm text-destructive sm:col-span-2">{error}</p>}
      <div className="flex justify-end gap-2 sm:col-span-2">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving || busy}>{saving ? "Saving…" : initial.id ? "Save changes" : scanned ? "Confirm & Save Donation" : "Save Donation"}</Button>
      </div>
    </form>
  );
}

export function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

async function shrink(file: File): Promise<string> {
  const img = await createImageBitmap(file);
  const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
  const c = document.createElement("canvas");
  c.width = Math.round(img.width * scale); c.height = Math.round(img.height * scale);
  c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
  return c.toDataURL("image/jpeg", 0.85);
}
