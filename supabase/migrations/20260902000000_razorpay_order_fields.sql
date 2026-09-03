ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT,
  ADD COLUMN IF NOT EXISTS razorpay_signature TEXT,
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ;

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_payment_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_payment_status_check
  CHECK (payment_status IN ('PENDING', 'PAID', 'FAILED', 'REFUNDED'));

ALTER TABLE public.orders
  DROP CONSTRAINT IF EXISTS orders_order_status_check;

ALTER TABLE public.orders
  ADD CONSTRAINT orders_order_status_check
  CHECK (order_status IN ('PAYMENT_PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'));

ALTER TABLE public.orders
  ALTER COLUMN payment_status SET DEFAULT 'PENDING';

ALTER TABLE public.orders
  ALTER COLUMN order_status SET DEFAULT 'PAYMENT_PENDING';

CREATE INDEX IF NOT EXISTS orders_razorpay_order_id_idx
  ON public.orders(razorpay_order_id);

CREATE INDEX IF NOT EXISTS orders_razorpay_payment_id_idx
  ON public.orders(razorpay_payment_id);
