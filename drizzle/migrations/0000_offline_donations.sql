CREATE TABLE public.offline_donations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  collected_by text NOT NULL,
  book_no text NOT NULL,
  receipt_no text NOT NULL,
  receipt_date date NOT NULL,
  donor_name text NOT NULL,
  amount numeric(12,2) NOT NULL CHECK (amount > 0),
  payment_type text NOT NULL,
  payment_method text NOT NULL CHECK (payment_method IN ('Cash','Cheque','UPI')),
  collection_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid DEFAULT auth.uid(),
  updated_by uuid DEFAULT auth.uid(),
  CONSTRAINT offline_donations_book_receipt_key UNIQUE (book_no, receipt_no)
);
GRANT SELECT, INSERT, UPDATE ON public.offline_donations TO authenticated;
GRANT ALL ON public.offline_donations TO service_role;
ALTER TABLE public.offline_donations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Committee can view offline donations" ON public.offline_donations FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'committee'));
CREATE POLICY "Committee can add offline donations" ON public.offline_donations FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'committee'));
CREATE POLICY "Committee can edit offline donations" ON public.offline_donations FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'committee')) WITH CHECK (public.has_role(auth.uid(), 'committee'));
CREATE OR REPLACE FUNCTION public.offline_donations_touch()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  NEW.updated_at := now();
  NEW.updated_by := auth.uid();
  IF TG_OP = 'UPDATE' THEN
    NEW.created_at := OLD.created_at;
    NEW.created_by := OLD.created_by;
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER offline_donations_touch BEFORE INSERT OR UPDATE ON public.offline_donations FOR EACH ROW EXECUTE FUNCTION public.offline_donations_touch();