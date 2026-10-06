import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import type { User } from "@supabase/supabase-js";
import { LogOut, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageShell } from "@/components/site-chrome";

export const Route = createFileRoute("/committee-only")({
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
    <PageShell>
      <main className="mx-auto min-h-[70vh] max-w-5xl px-4 pb-20 pt-32">
        {!ready ? null : user ? <Dashboard /> : <Login />}
      </main>
    </PageShell>
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

function Dashboard() {
  const [rows, setRows] = useState<Donation[] | null>(null);
  const [q, setQ] = useState("");

  useEffect(() => {
    supabase.from("donations").select("*").order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Donation[]) ?? []));
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!rows || !s) return rows ?? [];
    return rows.filter((r) => [r.reference_id, r.phone, r.name, r.upi_transaction_id].some((v) => v?.toLowerCase().includes(s)));
  }, [rows, q]);

  const total = filtered.reduce((n, r) => n + r.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-foreground">Donation submissions</h1>
        <Button variant="outline" onClick={() => supabase.auth.signOut()}><LogOut className="mr-2 h-4 w-4" />Sign out</Button>
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
