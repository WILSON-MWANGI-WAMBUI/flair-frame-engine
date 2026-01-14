-- Add shipping_info and payment_method columns to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS shipping_info jsonb,
ADD COLUMN IF NOT EXISTS payment_method text;

-- Add admin policy to view all orders
CREATE POLICY "Admins can view all orders" 
ON public.orders 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));