ALTER TABLE public.offline_donations ADD COLUMN upi_transaction_id text;
COMMENT ON COLUMN public.offline_donations.upi_transaction_id IS 'Optional UPI transaction reference for offline receipt-book donations.';
COMMENT ON COLUMN public.offline_donations.book_no IS 'Free-text book detail; displayed as Book Detail. Uniqueness remains paired with receipt_no.';