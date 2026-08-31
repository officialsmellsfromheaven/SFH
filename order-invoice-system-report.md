# Smells From Heaven — Order & Invoice System Scan

Generated: 2026-08-24 18:11:08

## SAFE SCAN ONLY

No existing application files were modified.

## Checkout candidates

- `frontend\scripts\setup_order_invoice_system.py`
- `frontend\work\combo-ui-fix-report.md`
- `frontend\work\filesystem-only-backup\20260824-112530\src\lib\data.ts`
- `frontend\src\app\page.tsx`
- `frontend\src\components\Footer.tsx`
- `frontend\src\components\NewsletterForm.tsx`
- `frontend\src\lib\data.ts`
- `frontend\src\lib\orderUtils.ts`
- `frontend\src\components\home\TestimonialsSection.tsx`
- `frontend\src\components\home\WhyChooseUsSection.tsx`
- `frontend\src\app\about\page.tsx`
- `frontend\src\app\account\page.tsx`
- `frontend\src\app\checkout\page.tsx`
- `frontend\src\app\contact\page.tsx`
- `frontend\src\app\offers\page.tsx`
- `frontend\src\app\subscription\page.tsx`
- `frontend\src\app\product\[id]\page.tsx`
- `backend\main.py`
- `backend\models.py`
- `backend\schemas.py`

## Cart candidates

- `frontend\scripts\setup_order_invoice_system.py`
- `frontend\src\components\Navbar.tsx`
- `frontend\src\lib\store.ts`
- `frontend\src\lib\combo\combo-utils.ts`
- `frontend\src\components\combo\ComboBuilder.tsx`
- `frontend\src\app\cart\page.tsx`
- `frontend\src\app\checkout\page.tsx`

## Combo candidates

- `frontend\config\combos.json`
- `frontend\scripts\create_combo_config.py`
- `frontend\scripts\fix_dynamic_combo_discount_display.py`
- `frontend\scripts\setup_order_invoice_system.py`
- `frontend\work\combo-right-scroll-fix-report.md`
- `frontend\work\combo-ui-fix-report.md`
- `frontend\src\app\globals.css`
- `frontend\src\app\page.tsx`
- `frontend\src\lib\store.ts`
- `frontend\src\lib\combo\combo-config.ts`
- `frontend\src\lib\combo\combo-pricing.ts`
- `frontend\src\lib\combo\combo-utils.ts`
- `frontend\src\components\combo\ComboBuilder.tsx`
- `frontend\src\components\combo\ComboCard.tsx`
- `frontend\src\components\combo\ComboProductSelector.tsx`
- `frontend\src\components\combo\ComboSection.tsx`
- `frontend\src\components\combo\ComboSummary.tsx`
- `frontend\src\app\cart\page.tsx`
- `frontend\src\app\checkout\page.tsx`

## Whatsapp candidates

- `frontend\scripts\setup_order_invoice_system.py`
- `frontend\work\filesystem-only-backup\20260824-112530\src\lib\data.ts`
- `frontend\src\components\FloatingWhatsAppButton.tsx`
- `frontend\src\components\Footer.tsx`
- `frontend\src\components\Navbar.tsx`
- `frontend\src\components\ProductCard.tsx`
- `frontend\src\components\Providers.tsx`
- `frontend\src\lib\data.ts`
- `frontend\src\lib\orderConfig.ts`
- `frontend\src\lib\orderUtils.ts`
- `frontend\src\components\home\TrustSection.tsx`
- `frontend\src\components\home\WhyChooseUsSection.tsx`
- `frontend\src\app\account\page.tsx`
- `frontend\src\app\cart\page.tsx`
- `frontend\src\app\checkout\page.tsx`
- `frontend\src\app\contact\page.tsx`
- `frontend\src\app\faq\page.tsx`
- `frontend\src\app\offers\page.tsx`
- `frontend\src\app\product\[id]\page.tsx`

## Invoice candidates

- `frontend\package-lock.json`
- `frontend\scripts\setup_order_invoice_system.py`
- `frontend\src\lib\orderUtils.ts`
- `frontend\src\app\product\[id]\page.tsx`

## Backend candidates

- `frontend\AGENTS.md`
- `frontend\next-env.d.ts`
- `frontend\package-lock.json`
- `frontend\README.md`
- `frontend\scripts\setup_order_invoice_system.py`
- `frontend\work\filesystem-only-backup\20260824-112530\src\lib\data.ts`
- `frontend\src\lib\data.ts`
- `frontend\src\components\home\TrustSection.tsx`
- `frontend\src\app\subscription\page.tsx`
- `frontend\src\app\product\[id]\page.tsx`
- `backend\auth.py`
- `backend\main.py`

## Required final behaviour

1. Checkout collects Name, Mobile, Email, Address, City, State and Pincode.
2. Product and Combo orders use the same order pipeline.
3. Create one immutable invoice number per order.
4. Invoice format: SFH-DDMMYYYY-XX.
5. XX is a global lifetime sequence and never resets daily.
6. Save order.json.
7. Append orders.csv.
8. Generate invoice.pdf.
9. Generate whatsapp-message.txt.
10. Open WhatsApp only after the order is safely saved.
11. Prevent duplicate orders from repeated clicks.
12. Use existing dynamic pricing; never hard-code prices.
