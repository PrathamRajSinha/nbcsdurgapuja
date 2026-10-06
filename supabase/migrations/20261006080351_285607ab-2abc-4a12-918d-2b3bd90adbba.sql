CREATE TABLE public.donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id text UNIQUE NOT NULL,
  donation_type text NOT NULL CHECK (donation_type IN ('committee','sankalpa')),
  amount integer NOT NULL CHECK (amount > 0),
  name text NOT NULL,
  names text,
  gotra text,
  note text,
  phone text NOT NULL,
  email text,
  upi_transaction_id text NOT NULL,
  payment_status text NOT NULL DEFAULT 'PENDING_VERIFICATION' CHECK (payment_status IN ('PENDING_VERIFICATION','VERIFIED','REJECTED')),
  created_at timestamptz NOT NULL DEFAULT now(),
  verified_at timestamptz
);

GRANT INSERT ON public.donations TO anon, authenticated;
GRANT ALL ON public.donations TO service_role;

ALTER TABLE public.donations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a donation record"
  ON public.donations
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);