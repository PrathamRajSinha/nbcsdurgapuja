import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { Download, ExternalLink, LogOut, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { OfflineSection, Stat, totals, type Offline } from "@/components/committee/offline-donations";
import { CsvImport } from "@/components/committee/csv-import";
import { inr } from "@/lib/committee-csv";
import { membershipForm } from "@/lib/site-content";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/committee-only")({
  staticData: { sitemap: false },
  ssr: false,
  head: () => ({
    meta: [
      { title: "Committee only · NBCS" },
      { name: "description", content: "Private NBCS committee area." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Committee only · NBCS" },
      { property: "og:description", content: "Private NBCS committee area." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CommitteePage,
});

type Donation = {
  id: string; reference_id: string; donation_type: string; amount: number; name: string;
  names: string | null; gotra: string | null; phone: string; email: string | null;
  note: string | null; upi_transaction_id: string; created_at: string;
  payment_status: string; verified_at: string | null;
};

const toEmail = (u: string) =>
  `${u.trim().toLowerCase().replace(/[^a-z0-9._-]/g, "")}@committee.nbcs.local`;

function CommitteePage() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => { setUser(data.user); setReady(true); });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setUser(s?.user ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-svh bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <img src={logoAsset.url} alt="NBCS" className="h-10 w-10" />
            <div><p className="font-display text-lg leading-tight text-foreground">NBCS Committee</p><p className="text-xs text-muted-foreground">Donation management</p></div>
          </div>
          {user && <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>}
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 pb-20 pt-6">
        {!ready ? null : user ? <Committee /> : <div className="pt-16"><Login /></div>}
      </main>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true); setError("");
    const { error } = await supabase.auth.signInWithPassword({ email: toEmail(username), password });
    if (error) setError("Incorrect username or password.");
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-sm space-y-4 rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h1 className="font-display text-3xl text-foreground">Committee sign in</h1>
      <Input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="username" required />
      <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required />
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={busy}>{busy ? "Signing in…" : "Sign in"}</Button>
    </form>
  );
}

const TABS = ["Overview", "Website Donations", "Offline Donations", "Memberships"] as const;

function Committee() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Overview");
  const [web, setWeb] = useState<Donation[] | null>(null);
  const [off, setOff] = useState<Offline[] | null>(null);
  const loadWeb = async () => { const { data } = await supabase.from("donations").select("*").order("created_at", { ascending: false }); setWeb((data as Donation[]) ?? []); };
  const loadOff = async () => { const { data } = await supabase.from("offline_donations").select("*").order("created_at", { ascending: false }); setOff((data as Offline[]) ?? []); };
  const reload = async () => { await Promise.all([loadWeb(), loadOff()]); };
  useEffect(() => { reload(); }, []);

  return (
    <div className="space-y-6">
      <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Committee sections">
        {TABS.map((t) => <Button key={t} size="sm" variant={tab === t ? "default" : "outline"} className="shrink-0" onClick={() => setTab(t)}>{t}</Button>)}
      </nav>
      {web === null || off === null ? <p>Loading…</p> : (
        <>
          {tab === "Overview" && <Overview web={web} off={off} reload={reload} />}
          {tab === "Website Donations" && <Dashboard rows={web} setRows={setWeb} />}
          {tab === "Offline Donations" && <OfflineSection rows={off} reload={loadOff} />}
          {tab === "Memberships" && <Memberships off={off} />}
        </>
      )}
    </div>
  );
}

function Overview({ web, off, reload }: { web: Donation[]; off: Offline[]; reload: () => Promise<void> }) {
  const t = totals(off);
  const verified = web.filter((r) => r.payment_status === "VERIFIED");
  const books = [...new Set(off.map((r) => r.book_no))].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  return (
    <div className="space-y-6">
      <section className="space-y-3"><h2 className="font-display text-2xl text-foreground">Website (online)</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Verified website donations" value={inr(verified.reduce((n, r) => n + r.amount, 0))} />
          <Stat label="Verified entries" value={String(verified.length)} />
          <Stat label="Pending verification" value={String(web.length - verified.length)} />
        </div></section>
      <section className="space-y-3"><h2 className="font-display text-2xl text-foreground">Receipt books (offline)</h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
          <Stat label="Total offline collections" value={inr(t.total)} /><Stat label="Cash" value={inr(t.cash)} />
          <Stat label="UPI" value={inr(t.upi)} /><Stat label="Cheque" value={inr(t.cheque)} />
          <Stat label="Receipts recorded" value={String(t.count)} /><Stat label="Receipt books" value={String(t.books)} />
        </div>
        {books.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-border bg-card"><table className="w-full text-sm">
            <thead className="bg-muted text-left text-muted-foreground"><tr className="[&>th]:px-3 [&>th]:py-2"><th>Book No.</th><th>Receipts</th><th className="text-right">Total</th></tr></thead>
            <tbody>{books.map((b) => { const bt = totals(off.filter((r) => r.book_no === b)); return (
              <tr key={b} className="border-t border-border text-foreground [&>td]:px-3 [&>td]:py-2"><td>{b}</td><td>{bt.count}</td><td className="text-right">{inr(bt.total)}</td></tr>); })}</tbody>
          </table></div>
        )}</section>
      <CsvImport onDone={reload} />
    </div>
  );
}

function Memberships({ off }: { off: Offline[] }) {
  const m = off.filter((r) => r.payment_type === "Membership");
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-card p-4">
        <p className="font-semibold text-foreground">Membership sign-ups</p>
        <p className="text-sm text-muted-foreground">New members register through the Google Form linked from the website's "Become a member" button.</p>
        <Button asChild variant="outline" size="sm" className="mt-3"><a href={membershipForm.url} target="_blank" rel="noopener noreferrer">Open membership form <ExternalLink className="ml-2 h-4 w-4" /></a></Button>
      </div>
      <div className="grid grid-cols-2 gap-3"><Stat label="Membership receipts" value={String(m.length)} /><Stat label="Membership collections" value={inr(totals(m).total)} /></div>
      {m.length > 0 && <ul className="divide-y divide-border rounded-xl border border-border bg-card text-sm">{m.map((r) => (
        <li key={r.id} className="flex justify-between gap-2 p-3 text-foreground"><span>{r.donor_name} · Book {r.book_no} / {r.receipt_no}</span><span>{inr(Number(r.amount))}</span></li>))}</ul>}
    </div>
  );
}

function Dashboard({ rows, setRows }: { rows: Donation[]; setRows: React.Dispatch<React.SetStateAction<Donation[] | null>> }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!rows || !s) return rows ?? [];
    return rows.filter((r) => [r.reference_id, r.phone, r.name, r.upi_transaction_id].some((v) => v?.toLowerCase().includes(s)));
  }, [rows, q]);

  async function verify(id: string) {
    const verified_at = new Date().toISOString();
    const { error } = await supabase.from("donations").update({ payment_status: "VERIFIED", verified_at }).eq("id", id);
    if (error) { alert("Could not verify. Please try again."); return; }
    setRows((rs) => rs?.map((r) => (r.id === id ? { ...r, payment_status: "VERIFIED", verified_at } : r)) ?? rs);
  }

  const total = filtered.reduce((n, r) => n + r.amount, 0);

  function downloadCsv() {
    const esc = (v: string | number | null) => {
      const s = v == null ? "" : String(v);
      return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const header = ["Reference ID", "Type", "Amount (INR)", "Name", "Names", "Gotra", "Mobile", "Email", "UPI Transaction ID", "Submitted At", "Verification Status", "Verified At", "Note"];
    const lines = filtered.map((r) => [
      r.reference_id,
      r.donation_type === "sankalpa" ? "Sankalpa" : "Donation",
      r.amount,
      r.name,
      r.names,
      r.gotra,
      r.phone,
      r.email,
      r.upi_transaction_id,
      new Date(r.created_at).toLocaleString("en-IN"),
      r.payment_status === "VERIFIED" ? "Verified" : "Pending verification",
      r.verified_at ? new Date(r.verified_at).toLocaleString("en-IN") : "",
      r.note,
    ].map(esc).join(","));
    const csv = "\uFEFF" + [header.map(esc).join(","), ...lines].join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `nbcs-donations-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-foreground">Website donations</h1>
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" onClick={downloadCsv} disabled={filtered.length === 0}>
            <Download className="mr-2 h-4 w-4" />Download CSV
          </Button>
        </div>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder="Search reference ID, mobile, name or transaction ID" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <p className="text-sm text-muted-foreground">{filtered.length} entries · ₹{total.toLocaleString("en-IN")}</p>
      {rows === null ? <p>Loading…</p> : filtered.length === 0 ? <p className="text-muted-foreground">No submissions yet.</p> : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="rounded-xl border border-border bg-card p-4 text-sm">
              <div className="flex flex-wrap justify-between gap-2">
                <strong className="text-foreground">{r.name}</strong>
                <span className="font-semibold text-foreground">₹{r.amount.toLocaleString("en-IN")}</span>
              </div>
              <div className="mt-2 grid gap-1 text-muted-foreground sm:grid-cols-2">
                <span>Ref: {r.reference_id}</span>
                <span>Type: {r.donation_type === "sankalpa" ? "Sankalpa" : "Donation"}</span>
                <span>Mobile: {r.phone}</span>
                <span>UPI txn: {r.upi_transaction_id}</span>
                {r.email && <span>Email: {r.email}</span>}
                {r.gotra && <span>Gotra: {r.gotra}</span>}
                {r.names && <span>Names: {r.names}</span>}
                <span>{new Date(r.created_at).toLocaleString("en-IN")}</span>
              </div>
              {r.note && <p className="mt-2 text-muted-foreground">Note: {r.note}</p>}
              <div className="mt-3 flex flex-wrap items-center gap-3">
                {r.payment_status === "VERIFIED" ? (
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                    Verified{r.verified_at ? ` · ${new Date(r.verified_at).toLocaleString("en-IN")}` : ""}
                  </span>
                ) : (
                  <>
                    <span className="rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">Pending verification</span>
                    <Button size="sm" onClick={() => verify(r.id)}>Verify</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
