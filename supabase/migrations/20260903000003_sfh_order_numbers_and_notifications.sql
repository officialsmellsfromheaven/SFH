-- Lifetime order numbers are allocated by PostgreSQL, never by the client.
CREATE SEQUENCE IF NOT EXISTS public.sfh_order_number_sequence AS BIGINT;

DO $$
DECLARE
  highest_sequence BIGINT;
BEGIN
  SELECT MAX((regexp_match(order_number, '^SFH-[0-9]{2}-[0-9]{4}-([0-9]+)$'))[1]::BIGINT)
    INTO highest_sequence
  FROM public.orders;

  IF highest_sequence IS NULL THEN
    PERFORM setval('public.sfh_order_number_sequence', 1, false);
  ELSE
    PERFORM setval('public.sfh_order_number_sequence', highest_sequence, true);
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.next_sfh_order_number(p_created_at TIMESTAMPTZ DEFAULT now())
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  sequence_number BIGINT;
BEGIN
  sequence_number := nextval('public.sfh_order_number_sequence');
  RETURN 'SFH-' || to_char(p_created_at AT TIME ZONE 'Asia/Kolkata', 'YY-MMDD') || '-' ||
    CASE WHEN sequence_number < 1000 THEN lpad(sequence_number::TEXT, 3, '0') ELSE sequence_number::TEXT END;
END;
$$;

REVOKE ALL ON FUNCTION public.next_sfh_order_number(TIMESTAMPTZ) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.next_sfh_order_number(TIMESTAMPTZ) TO service_role;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS checkout_id TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS orders_checkout_id_unique_idx
  ON public.orders(checkout_id)
  WHERE checkout_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_unique_idx
  ON public.orders(order_number);

CREATE TABLE IF NOT EXISTS public.order_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  notification_type TEXT NOT NULL CHECK (notification_type IN (
    'ORDER_CONFIRMED_CUSTOMER',
    'ORDER_CONFIRMED_ADMIN',
    'ORDER_PROCESSING_CUSTOMER',
    'ORDER_SHIPPED_CUSTOMER',
    'ORDER_DELIVERED_CUSTOMER',
    'ORDER_CANCELLED_CUSTOMER'
  )),
  recipient_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'SENT', 'FAILED', 'SKIPPED')),
  provider_message_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  claimed_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  UNIQUE (order_id, notification_type)
);

CREATE INDEX IF NOT EXISTS order_notifications_order_id_idx
  ON public.order_notifications(order_id);

ALTER TABLE public.order_notifications ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.claim_order_notification(
  p_order_id UUID,
  p_order_number TEXT,
  p_notification_type TEXT,
  p_recipient_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  claimed BOOLEAN;
BEGIN
  INSERT INTO public.order_notifications (
    order_id, order_number, notification_type, recipient_email, status, claimed_at
  )
  VALUES (
    p_order_id, p_order_number, p_notification_type, p_recipient_email, 'PROCESSING', now()
  )
  ON CONFLICT (order_id, notification_type) DO UPDATE
    SET status = 'PROCESSING', recipient_email = EXCLUDED.recipient_email,
        claimed_at = now(), error_message = NULL
    WHERE order_notifications.status IN ('PENDING', 'FAILED', 'SKIPPED')
       OR order_notifications.status = 'PROCESSING'
          AND order_notifications.claimed_at < now() - INTERVAL '10 minutes'
  RETURNING TRUE INTO claimed;

  RETURN COALESCE(claimed, FALSE);
END;
$$;

REVOKE ALL ON FUNCTION public.claim_order_notification(UUID, TEXT, TEXT, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.claim_order_notification(UUID, TEXT, TEXT, TEXT) TO service_role;
