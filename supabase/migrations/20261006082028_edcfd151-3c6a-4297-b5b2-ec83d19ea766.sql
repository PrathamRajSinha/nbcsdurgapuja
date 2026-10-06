GRANT UPDATE (payment_status, verified_at) ON public.donations TO authenticated;
CREATE POLICY "Committee can verify donations" ON public.donations FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'committee'))
WITH CHECK (public.has_role(auth.uid(), 'committee'));