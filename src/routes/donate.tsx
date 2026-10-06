import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Check, Download, Heart, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/site-chrome";
import { FallingPetals, LotusAccent, WaterRibbon } from "@/components/festival-art";
import { donation } from "@/lib/site-content";
import { submitDonation } from "@/lib/donations.functions";

type ContributionType = "committee" | "sankalpa";

const TYPE_LABEL: Record<ContributionType, string> = {
  committee: "a donation to NBCS",
  sankalpa: "a Sankalpa offering",
};

const UPI_APPS = [
  { id: "gpay", label: "Google Pay", scheme: "tez://upi/pay?" },
  { id: "phonepe", label: "PhonePe", scheme: "phonepe://pay?" },
  { id: "paytm", label: "Paytm", scheme: "paytmmp://pay?" },
  { id: "upi", label: "Other UPI apps", scheme: "upi://pay?" },
] as const;

function formatINR(value: number) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function makeAttemptRef(type: ContributionType) {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let id = "";
  for (let i = 0; i < 6; i++) id += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `NBCS-${type === "committee" ? "COMMITTEE" : "SANKALPA"}-${id}`;
}

function buildUpiUri(scheme: string, amount: number, ref: string) {
  const query = new URLSearchParams({
    ver: "01",
    mode: "01",
    pa: donation.upiId,
    pn: donation.payeeName,
    mc: "8661",
    am: String(amount),
    cu: "INR",
    tr: ref,
  });
  return `${scheme}${query.toString()}`;
}

function legacyCopy(text: string) {
  const area = document.createElement("textarea");
  area.value = text;
  area.setAttribute("readonly", "");
  area.style.position = "fixed";
  area.style.opacity = "0";
  document.body.appendChild(area);
  area.select();
  document.execCommand("copy");
  document.body.removeChild(area);
}

export const Route = createFileRoute("/donate")({
  head: () => ({
    meta: [
      { title: "Donate & Sankalpa | NBCS" },
      { name: "description", content: "Support North Bangalore Cultural Samithi — donate to the committee or make a devotional Sankalpa offering via UPI." },
      { property: "og:title", content: "Donate & Sankalpa | NBCS" },
      { property: "og:description", content: "Give with devotion — support NBCS or make a Sankalpa offering via UPI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: DonationPage,
});

function DonationPage() {
  const [type, setType] = useState<ContributionType>("committee");
  const [preset, setPreset] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef<number | null>(null);

  const [form, setForm] = useState({ name: "", names: "", gotra: "", upiTransactionId: "", phone: "", email: "", note: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const customValue = Number(custom.replace(/[^0-9]/g, ""));
  const amount = preset ?? (custom && customValue >= 1 ? customValue : null);
  // A fresh payment reference for every attempt — changing the type or amount starts a new one.
  const attemptRef = useMemo(() => makeAttemptRef(type), [type, amount]);

  function selectPreset(value: number) {
    setPreset((current) => (current === value ? null : value));
    setCustom("");
  }

  function copyUpiId() {
    const mark = () => {
      setCopied(true);
      if (copyTimer.current) window.clearTimeout(copyTimer.current);
      copyTimer.current = window.setTimeout(() => setCopied(false), 2200);
    };
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(donation.upiId).then(mark).catch(() => {
        legacyCopy(donation.upiId);
        mark();
      });
    } else {
      legacyCopy(donation.upiId);
      mark();
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (!amount) {
      setFormError("Please choose an amount first.");
      return;
    }
    if (!form.name.trim() || !form.upiTransactionId.trim() || !form.phone.trim()) {
      setFormError("Please fill in your name, the UPI transaction ID and your mobile number.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await submitDonation({
        data: {
          donationType: type,
          amount,
          name: form.name,
          names: form.names,
          gotra: type === "sankalpa" ? form.gotra : "",
          upiTransactionId: form.upiTransactionId,
          phone: form.phone,
          email: form.email,
          note: form.note,
        },
      });
      setReference(result.referenceId);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setFormError("Your details could not be sent just now. Please check them and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetAll() {
    setType("committee");
    setPreset(null);
    setCustom("");
    setShowForm(false);
    setForm({ name: "", names: "", gotra: "", upiTransactionId: "", phone: "", email: "", note: "" });
    setFormError(null);
    setReference(null);
    window.scrollTo({ top: 0 });
  }

  if (reference) {
    return (
      <PageShell>
        <main className="donate-page">
          <FallingPetals />
          <LotusAccent className="donate-corner-lotus" />
          <section className="donate-thanks">
            <p className="eyebrow donate-eyebrow">Submitted for verification</p>
            <h1>Thank you for<br /><em>your contribution.</em></h1>
            <p className="donate-thanks-sub">Your details have been received and are awaiting verification by the committee.</p>
            <p className="donate-ref">Reference ID <strong>{reference}</strong></p>
            <p className="donate-fineprint">Please keep this reference ID safe — it helps us find your contribution if you ever have a question.</p>
            <div className="donate-thanks-actions">
              <Button variant="festival" size="xl" asChild><Link to="/">Back to NBCS <ArrowRight /></Link></Button>
              <Button variant="ink" size="xl" onClick={resetAll}>Donate again</Button>
            </div>
          </section>
          <WaterRibbon className="donate-water" />
        </main>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <main className="donate-page">
        <FallingPetals />
        <LotusAccent className="donate-corner-lotus" />

        <header className="donate-head donate-rise">
          <p className="eyebrow donate-eyebrow">Seva · Offering</p>
          <h1>Give with<br /><em>devotion.</em></h1>
          <p className="lead">Your contribution helps us continue the traditions, celebrations and community that bring North Bangalore together.</p>
        </header>

        <section className="donate-step donate-rise" aria-labelledby="donate-type-heading" style={{ animationDelay: ".08s" }}>
          <h2 id="donate-type-heading"><span>Step one</span>Choose your offering</h2>
          <div className="donate-choices">
            <button type="button" className={`donate-choice ${type === "committee" ? "is-active" : ""}`} aria-pressed={type === "committee"} onClick={() => setType("committee")}>
              <strong>Donate to NBCS</strong>
              <span>Support the committee and its cultural activities.</span>
              <em>{type === "committee" ? <><Check /> Selected</> : "Select"}</em>
            </button>
            <button type="button" className={`donate-choice ${type === "sankalpa" ? "is-active" : ""}`} aria-pressed={type === "sankalpa"} onClick={() => setType("sankalpa")}>
              <strong>Sankalpa</strong>
              <span>Make a devotional Sankalpa offering.</span>
              <em>{type === "sankalpa" ? <><Check /> Selected</> : "Select"}</em>
            </button>
          </div>
        </section>

        <section className="donate-step donate-rise" aria-labelledby="donate-amount-heading" style={{ animationDelay: ".16s" }}>
          <h2 id="donate-amount-heading"><span>Step two</span>Choose your amount</h2>
          <div className="donate-amounts">
            {donation.presets.map((value) => (
              <button key={value} type="button" className={`donate-amount ${preset === value ? "is-active" : ""}`} aria-pressed={preset === value} onClick={() => selectPreset(value)}>
                ₹{formatINR(value)}
              </button>
            ))}
            <label className="donate-custom">
              <span>Custom amount</span>
              <span className="rupee">₹</span>
              <input
                inputMode="numeric"
                autoComplete="off"
                placeholder="e.g. 751"
                value={custom}
                onChange={(event) => {
                  setPreset(null);
                  setCustom(event.target.value.replace(/[^0-9]/g, "").slice(0, 7));
                }}
                aria-label="Custom amount in rupees"
              />
            </label>
          </div>
          {!amount && <p className="donate-hint">Choose an amount to unlock the payment options below.</p>}
        </section>

        <section className="donate-pay donate-rise" aria-label="Payment" style={{ animationDelay: ".24s" }}>
          <div className="donate-qr">
            <div className="donate-qr-frame">
              <img src={donation.qrUrl} alt={`UPI QR code for ${donation.bankName} — scan with any UPI app to pay`} />
            </div>
            <p className="donate-qr-caption">Scan with any UPI app</p>
            <p className="donate-upi-row">
              <span>UPI ID</span>
              <strong>{donation.upiId}</strong>
              <button type="button" className={`donate-copy ${copied ? "is-copied" : ""}`} onClick={copyUpiId} aria-label={copied ? "UPI ID copied" : "Copy UPI ID"} aria-live="polite">
                {copied ? "Copied ✓" : "Copy"}
              </button>
            </p>
            <a className="donate-qr-download" href={donation.qrUrl} download={donation.qrDownloadName}>
              <Download /> Download QR
            </a>
          </div>

          <div className="donate-actions">
            <p className="donate-pay-status">
              {amount
                ? <>Paying <strong>₹{formatINR(amount)}</strong> as {TYPE_LABEL[type]}.</>
                : "Your selected amount will appear here."}
            </p>
            <h3>Or pay directly</h3>
            <div className="donate-apps">
              {UPI_APPS.map((app) => (
                <a
                  key={app.id}
                  className={`donate-app ${amount ? "" : "is-disabled"}`}
                  href={amount ? buildUpiUri(app.scheme, amount, attemptRef) : undefined}
                  aria-disabled={amount ? undefined : true}
                  onClick={(event) => { if (!amount) event.preventDefault(); }}
                >
                  <Smartphone /> {app.label}
                </a>
              ))}
            </div>
            <p className="donate-fineprint">
              {amount
                ? "This opens your UPI app with the amount filled in. The website never sees your UPI PIN or bank details."
                : "Choose an amount above to enable direct payment."}
            </p>
          </div>
        </section>

        <WaterRibbon className="donate-water" />

        <section className="donate-paid">
          <h2>Already paid?</h2>
          <p className="donate-paid-copy">Tell us about your payment so the committee can thank you personally.</p>
          {showForm ? (
            <Button variant="ink" size="xl" onClick={() => document.querySelector(".donate-form")?.scrollIntoView({ behavior: "smooth", block: "start" })}>Go to the form <ArrowRight /></Button>
          ) : (
            <Button variant="festival" size="xl" onClick={() => setShowForm(true)}>I've Completed the Payment <ArrowRight /></Button>
          )}
        </section>

        {showForm && (
          <form className="donate-form donate-rise" onSubmit={handleSubmit} noValidate>
            <h2>Donor details</h2>
            <p>
              {type === "sankalpa"
                ? "Share your Sankalpa details — your name(s) and gotra are used for the offering."
                : "Share your details so the committee can acknowledge your donation."}
            </p>

            <div className="donate-field">
              <label htmlFor="donate-name">Name <span className="req">*</span></label>
              <input id="donate-name" name="name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div className={`donate-field ${type === "sankalpa" ? "is-devotional" : ""}`}>
              <label htmlFor="donate-names">Name(s) {type === "sankalpa" && <span className="req">*</span>}</label>
              {type === "sankalpa" && <p className="field-note">Name(s) the Sankalpa is made for.</p>}
              <input id="donate-names" name="names" value={form.names} onChange={(e) => setForm({ ...form, names: e.target.value })} />
            </div>
            {type === "sankalpa" && (
              <div className="donate-field is-devotional">
                <label htmlFor="donate-gotra">Gotra</label>
                <p className="field-note">Your family gotra, if you know it.</p>
                <input id="donate-gotra" name="gotra" value={form.gotra} onChange={(e) => setForm({ ...form, gotra: e.target.value })} />
              </div>
            )}
            <div className="donate-field">
              <label htmlFor="donate-utr">UPI Transaction ID <span className="req">*</span></label>
              <input id="donate-utr" name="upiTransactionId" autoComplete="off" placeholder="From your UPI app, e.g. 4052xxxxxx" value={form.upiTransactionId} onChange={(e) => setForm({ ...form, upiTransactionId: e.target.value })} required />
            </div>
            <div className="donate-field">
              <label htmlFor="donate-phone">Mobile Number <span className="req">*</span></label>
              <input id="donate-phone" name="phone" type="tel" autoComplete="tel" placeholder="+91" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </div>
            <div className="donate-field">
              <label htmlFor="donate-email">Email</label>
              <input id="donate-email" name="email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div className="donate-field is-wide">
              <label htmlFor="donate-note">Note</label>
              <textarea id="donate-note" name="note" value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} />
            </div>

            {formError && <p className="donate-form-error" role="alert">{formError}</p>}
            <p className="donate-form-note">Amount: {amount ? `₹${formatINR(amount)}` : "not chosen yet"} · Type: {TYPE_LABEL[type]}.</p>

            <div className="donate-submit">
              <Button variant="donate" size="xl" type="submit" disabled={submitting || !amount}>
                <Heart /> {submitting ? "Sending…" : "Submit for verification"}
              </Button>
            </div>
          </form>
        )}
      </main>
    </PageShell>
  );
}
