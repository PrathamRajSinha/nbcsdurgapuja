import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { normMethod, parseCsv, parseDate } from "@/lib/committee-csv";

type Result = { kind: string; added: number; updated: number; skipped: string[] };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z/]/g, "");
const OFFLINE_COLS: Record<string, (h: string) => boolean> = {
  collected_by: (h) => h.includes("collected"),
  book_no: (h) => h.startsWith("book"),
  receipt_no: (h) => h.startsWith("receiptno") || h === "receipt" || h === "receiptnumber",
  receipt_date: (h) => h.includes("date") && !h.includes("collection"),
  donor_name: (h) => h.includes("donor") || h === "name",
  amount: (h) => h.startsWith("amount"),
  payment_type: (h) => h.includes("typeofpayment") || h === "paymenttype" || h === "type",
  payment_method: (h) => h.includes("cash/") || h.includes("method") || h === "mode" || h.includes("modeofpayment"),
  upi_transaction_id: (h) => h.includes("transactionid") || h.includes("utr"),
  collection_date: (h) => h.includes("collection"),
};

/** Upload a CSV: offline receipt sheets go into offline donations (matched by Book Detail + Receipt No.);
 *  website-donation exports update verification status for matching reference IDs. */
export function CsvImport({ onDone }: { onDone: () => Promise<void> }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function handle(file: File | undefined) {
    if (!file) return;
    setBusy(true); setResult(null);
    try {
      const rows = parseCsv(await file.text());
      const hi = rows.findIndex((r) => r.some((c) => /book/i.test(c)) || r.some((c) => /reference id/i.test(c)));
      if (hi < 0) throw new Error("Couldn't find a header row with Book Detail or Reference ID.");
      const headerRow = rows[hi];
      if (!headerRow) throw new Error("Could not read the CSV header.");
      const header = headerRow.map(norm);
      const body = rows.slice(hi + 1);
      setResult(header.includes("referenceid") ? await importWebsite(header, body) : await importOffline(header, body));
      await onDone();
    } catch (e) {
      setResult({ kind: "error", added: 0, updated: 0, skipped: [(e as Error).message] });
    }
    setBusy(false);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="font-semibold text-foreground">Upload CSV</p>
          <p className="text-sm text-muted-foreground">Receipt-book sheets are added to Offline Donations (existing Book Detail + Receipt No. are updated). Website-donation CSVs mark matching entries Verified.</p>
        </div>
        <Button variant="outline" disabled={busy} onClick={() => ref.current?.click()}><Upload className="mr-2 h-4 w-4" />{busy ? "Importing…" : "Upload CSV"}</Button>
        <input ref={ref} type="file" accept=".csv,text/csv" className="hidden" onChange={(e) => { handle(e.target.files?.[0]); e.target.value = ""; }} />
      </div>
      {result && (
        <div className="mt-3 text-sm">
          {result.kind !== "error" && <p className="text-foreground">{result.kind}: {result.added} added · {result.updated} updated · {result.skipped.length} skipped</p>}
          {result.skipped.length > 0 && (
            <ul className="mt-1 max-h-40 list-disc overflow-y-auto pl-5 text-destructive">{result.skipped.slice(0, 50).map((s, i) => <li key={i}>{s}</li>)}</ul>
          )}
        </div>
      )}
    </div>
  );
}

async function importOffline(header: string[], body: string[][]): Promise<Result> {
  const idx = Object.fromEntries(Object.entries(OFFLINE_COLS).map(([k, test]) => [k, header.findIndex(test)])) as Record<string, number>;
  const missing = Object.entries(idx).filter(([k, i]) => i < 0 && k !== "receipt_date" && k !== "collection_date" && k !== "upi_transaction_id").map(([k]) => k.replace("_", " "));
  if (missing.length) throw new Error(`Missing columns: ${missing.join(", ")}`);
  const skipped: string[] = [];
  const map = new Map<string, { book_no: string; receipt_no: string; [k: string]: unknown }>();
  body.forEach((r, n) => {
    const get = (k: string) => (r[idx[k] ?? -1] ?? "").trim();
    const line = `Row ${n + 2}`;
    const book = get("book_no"), receipt = get("receipt_no");
    if (!book && !receipt && !get("donor_name")) return;
    const amount = Number(get("amount").replace(/[₹,\s]|rs\.?/gi, ""));
    const method = normMethod(get("payment_method"));
    const rd = parseDate(get("receipt_date") || get("collection_date"));
    const problems = [
      !book && "Book Detail", !receipt && "Receipt No.", !get("collected_by") && "Collected By", !get("donor_name") && "donor name",
      !(amount > 0) && "amount", !get("payment_type") && "type of payment", !method && "Cash/Cheque/UPI", !rd && "date",
    ].filter(Boolean);
    if (problems.length) return void skipped.push(`${line}: missing or invalid ${problems.join(", ")}`);
    const key = `${book}|${receipt}`;
    if (map.has(key)) skipped.push(`${line}: Book ${book} receipt ${receipt} appears twice — kept the last one`);
    map.set(key, { collected_by: get("collected_by"), book_no: book, receipt_no: receipt, receipt_date: rd, donor_name: get("donor_name"), amount, payment_type: get("payment_type"), payment_method: method, collection_date: rd, ...((idx["upi_transaction_id"] ?? -1) >= 0 ? { upi_transaction_id: get("upi_transaction_id") || null } : {}) });
  });
  const rows = [...map.values()];
  const { data: existing } = await supabase.from("offline_donations").select("book_no, receipt_no");
  const have = new Set((existing ?? []).map((e) => `${e.book_no}|${e.receipt_no}`));
  const updated = rows.filter((r) => have.has(`${r.book_no}|${r.receipt_no}`)).length;
  for (let i = 0; i < rows.length; i += 500) {
    const { error } = await supabase.from("offline_donations").upsert(rows.slice(i, i + 500) as never, { onConflict: "book_no,receipt_no" });
    if (error) throw new Error("Could not save the rows. Please try again.");
  }
  return { kind: "Offline receipts", added: rows.length - updated, updated, skipped };
}

async function importWebsite(header: string[], body: string[][]): Promise<Result> {
  const ri = header.indexOf("referenceid");
  const si = header.findIndex((h) => h.includes("status"));
  if (si < 0) throw new Error("Missing column: Verification Status");
  const skipped: string[] = [];
  let updated = 0;
  for (const [n, r] of body.entries()) {
    const refId = (r[ri] ?? "").trim();
    const status = (r[si] ?? "").trim().toLowerCase();
    if (!refId || status !== "verified") continue;
    const { data, error } = await supabase.from("donations").update({ payment_status: "VERIFIED", verified_at: new Date().toISOString() })
      .eq("reference_id", refId).neq("payment_status", "VERIFIED").select("id");
    if (error) skipped.push(`Row ${n + 2}: could not update ${refId}`);
    else updated += data?.length ?? 0;
  }
  return { kind: "Website donations", added: 0, updated, skipped };
}
