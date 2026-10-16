import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const scanInput = z.object({
  image: z.string().startsWith("data:image/").max(12_000_000),
});

export type ScannedReceipt = {
  collected_by?: string | undefined;
  receipt_no?: string | undefined;
  receipt_date?: string | undefined;
  donor_name?: string | undefined;
  amount?: number | undefined;
  payment_type?: string | undefined;
  payment_method?: "Cash" | "Cheque" | "UPI" | undefined;
  upi_transaction_id?: string | undefined;
  uncertain?: string[] | undefined;
};

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const scanReceipt = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data) => scanInput.parse(data))
  .handler(async ({ data, context }): Promise<{ ok: true; fields: ScannedReceipt } | { ok: false; error: string }> => {
    const { data: isCommittee } = await context.supabase.rpc("has_role", { _user_id: context.userId, _role: "committee" });
    if (!isCommittee) return { ok: false, error: "Not allowed." };
    const key = process.env["LOVABLE_API_KEY"];
    if (!key) return { ok: false, error: "Receipt scanning is not configured." };

    const props = {
      collected_by: { type: ["string", "null"] },
      receipt_no: { type: ["string", "null"] },
      receipt_date: { type: ["string", "null"], description: "YYYY-MM-DD" },
      donor_name: { type: ["string", "null"] },
      amount: { type: ["number", "null"] },
      payment_type: { type: ["string", "null"], enum: ["Donation", "Membership", null] },
      payment_method: { type: ["string", "null"], enum: ["Cash", "Cheque", "UPI", null] },
      upi_transaction_id: { type: ["string", "null"], description: "UPI transaction / reference ID printed on the receipt (e.g. UPI/Ref No., txn ID). Null when absent." },
      uncertain: { type: "array", items: { type: "string" } },
    };
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 55_000);
    let res: Response;
    try {
      res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
      signal: ctrl.signal,
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Lovable-API-Key": key, "X-Lovable-AIG-SDK": "fetch", "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-6-astra",
        stream: true,
        store: false,
        reasoning: { effort: "low" },
        instructions:
          "You read photographs of handwritten or printed Indian donation receipt-book entries. Extract only what is legible; use null when unsure or absent. Never return a book number. Dates as YYYY-MM-DD (receipts are usually DD/MM/YYYY). Amount as a plain number in rupees. If the receipt shows a UPI transaction or reference ID, read it exactly. List unsure field names in uncertain.",
        input: [
          {
            role: "user",
            content: [
              { type: "input_text", text: "Extract the receipt fields as JSON." },
              { type: "input_image", image_url: data.image },
            ],
          },
        ],
        text: {
          format: {
            type: "json_schema",
            name: "receipt",
            strict: true,
            schema: { type: "object", properties: props, required: Object.keys(props), additionalProperties: false },
          },
        },
      }),
      });
    } catch {
      clearTimeout(timer);
      return { ok: false, error: "Reading took too long. Please fill the form manually." };
    }
    if (res.status === 429) { clearTimeout(timer); return { ok: false, error: "Too many scans right now — try again in a moment." }; }
    if (res.status === 402) { clearTimeout(timer); return { ok: false, error: "Scanning credits have run out." }; }
    if (!res.ok || !res.body) { clearTimeout(timer); return { ok: false, error: "Could not read the photo. Please fill the form manually." }; }

    try {
      let text = "";
      let buf = "";
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split("\n");
        buf = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data:")) continue;
          const payload = line.slice(5).trim();
          if (!payload || payload === "[DONE]") continue;
          try {
            const ev = JSON.parse(payload) as { type?: string; delta?: string };
            if (ev.type === "response.output_text.delta" && ev.delta) text += ev.delta;
          } catch { /* ignore partial */ }
        }
      }
      const raw = JSON.parse(text || "{}") as { [k: string]: unknown; amount?: unknown; payment_method?: unknown; payment_type?: unknown; upi_transaction_id?: unknown; uncertain?: unknown; collected_by?: unknown; receipt_no?: unknown; receipt_date?: unknown; donor_name?: unknown };
      const str = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim().slice(0, 120) : undefined);
      const date = (v: unknown) => (isoDate.safeParse(v).success ? (v as string) : undefined);
      const amount = typeof raw.amount === "number" && raw.amount > 0 && raw.amount < 1e8 ? raw.amount : undefined;
      const method = ["Cash", "Cheque", "UPI"].includes(raw.payment_method as string) ? (raw.payment_method as ScannedReceipt["payment_method"]) : undefined;
      const type = ["Donation", "Membership"].includes(raw.payment_type as string) ? (raw.payment_type as string) : undefined;
      return {
        ok: true,
        fields: {
          collected_by: str(raw.collected_by),
          receipt_no: str(raw.receipt_no),
          receipt_date: date(raw.receipt_date),
          donor_name: str(raw.donor_name),
          amount,
          payment_type: type,
          payment_method: method,
          upi_transaction_id: str(raw.upi_transaction_id),
          uncertain: Array.isArray(raw.uncertain) ? raw.uncertain.filter((x): x is string => typeof x === "string") : [],
        },
      };
    } catch {
      return { ok: false, error: "Could not read the photo. Please fill the form manually." };
    }
  });
