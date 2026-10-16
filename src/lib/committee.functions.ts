import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const scanInput = z.object({
  image: z.string().startsWith("data:image/").max(12_000_000),
});

export type ScannedReceipt = {
  collected_by?: string;
  receipt_no?: string;
  receipt_date?: string;
  donor_name?: string;
  amount?: number;
  payment_type?: string;
  payment_method?: "Cash" | "Cheque" | "UPI";
  collection_date?: string;
  uncertain?: string[];
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

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content:
              "You read photographs of handwritten or printed Indian donation receipt-book entries. Extract only what is legible. Never guess. Never return a book number. Dates as YYYY-MM-DD (receipts are usually DD/MM/YYYY). Amount as a plain number in rupees.",
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Extract the receipt fields." },
              { type: "image_url", image_url: { url: data.image } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "receipt",
              parameters: {
                type: "object",
                properties: {
                  collected_by: { type: "string" },
                  receipt_no: { type: "string" },
                  receipt_date: { type: "string" },
                  donor_name: { type: "string" },
                  amount: { type: "number" },
                  payment_type: { type: "string", enum: ["Donation", "Membership"] },
                  payment_method: { type: "string", enum: ["Cash", "Cheque", "UPI"] },
                  collection_date: { type: "string" },
                  uncertain: { type: "array", items: { type: "string" }, description: "Field names you are unsure about" },
                },
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "receipt" } },
      }),
    });
    if (res.status === 429) return { ok: false, error: "Too many scans right now — try again in a moment." };
    if (res.status === 402) return { ok: false, error: "Scanning credits have run out." };
    if (!res.ok) return { ok: false, error: "Could not read the photo. Please fill the form manually." };

    try {
      const json = (await res.json()) as { choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[] } }[] };
      const raw = JSON.parse(json.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments ?? "{}") as Record<string, unknown>;
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
          collection_date: date(raw.collection_date),
          uncertain: Array.isArray(raw.uncertain) ? raw.uncertain.filter((x): x is string => typeof x === "string") : [],
        },
      };
    } catch {
      return { ok: false, error: "Could not read the photo. Please fill the form manually." };
    }
  });
