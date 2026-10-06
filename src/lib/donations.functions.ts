import { createServerFn } from "@tanstack/react-start";
import { randomInt } from "crypto";
import { z } from "zod";

const REF_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

const donationInput = z.object({
  donationType: z.enum(["committee", "sankalpa"]),
  amount: z.number().int().min(1).max(1_000_000),
  name: z.string().trim().min(1).max(120),
  names: z.string().trim().max(300).optional(),
  gotra: z.string().trim().max(60).optional(),
  upiTransactionId: z
    .string()
    .trim()
    .regex(/^[A-Za-z0-9-]{4,40}$/, "Enter the UPI transaction ID shown in your payment app"),
  phone: z.string().trim().regex(/^[+0-9][0-9\s-]{6,18}$/),
  email: z.union([z.string().trim().email().max(160), z.literal("")]).optional(),
  note: z.string().trim().max(500).optional(),
});

function makeReferenceId() {
  let id = "";
  for (let i = 0; i < 8; i++) id += REF_ALPHABET[randomInt(REF_ALPHABET.length)];
  return `NBCS-${id}`;
}

export const submitDonation = createServerFn({ method: "POST" })
  .inputValidator((data) => donationInput.parse(data))
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const db = supabaseAdmin as unknown as {
      from: (table: string) => {
        insert: (row: Record<string, unknown>) => Promise<{ error: { code?: string } | null }>;
      };
    };

    for (let attempt = 0; attempt < 5; attempt++) {
      const referenceId = makeReferenceId();
      const { error } = await db.from("donations").insert({
        reference_id: referenceId,
        donation_type: data.donationType,
        amount: data.amount,
        name: data.name,
        names: data.names || null,
        gotra: data.gotra || null,
        note: data.note || null,
        phone: data.phone,
        email: data.email || null,
        upi_transaction_id: data.upiTransactionId,
        payment_status: "PENDING_VERIFICATION",
      });
      if (!error) return { referenceId };
      if (error.code !== "23505") throw new Error("DONATION_SAVE_FAILED");
    }
    throw new Error("DONATION_SAVE_FAILED");
  });
