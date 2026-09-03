-- Keep the values charged at checkout available even when the product catalog changes.
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS reference_price NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS savings NUMERIC(12, 2) NOT NULL DEFAULT 0;

-- Pricing rules contain the personalization type, text, and charge for each line.
ALTER TABLE public.order_items
  ADD COLUMN IF NOT EXISTS pricing_rule JSONB;
