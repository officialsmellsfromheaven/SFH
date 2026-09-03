import type { CartItem } from "@/lib/store";
import { products } from "@/lib/data";
import { createClient } from "@supabase/supabase-js";
import { verifyOrderAccessToken } from "@/lib/order-access";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export type HistoricalOrderItem = {
  item_type: string;
  product_id: string | null;
  product_name: string | null;
  combo_name: string | null;
  bottle_size: number | string | null;
  quantity: number | null;
  unit_price: number | null;
  total_price: number | null;
  reference_price: number | null;
  discount_amount: number | null;
  savings: number | null;
  pricing_rule: Record<string, unknown> | null;
  selected_product_names: string[] | null;
  selected_product_images: string[] | null;
};

export type HistoricalOrder = {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address_line1: string;
  city: string;
  state: string;
  pincode: string;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  gst_amount: number;
  total_amount: number;
  payment_status: string;
  order_status: string;
  created_at: string;
};

export type SecureOrderResult = {
  order: HistoricalOrder;
  items: HistoricalOrderItem[];
};

type CustomerValidationResult =
  | { valid: false; error: string; customer?: never }
  | { valid: true; customer: ReturnType<typeof sanitizeCustomer>; error?: never };

/**
 * Fetches an order using the same short-lived signed link used by the order
 * details page. The service-role client is deliberately kept on the server.
 */
export async function fetchSecureOrder(
  orderNumber: string,
  token: string,
): Promise<SecureOrderResult | null> {
  if (
    !supabaseUrl ||
    !serviceRoleKey ||
    !/^SFH-\d{8}-[A-Za-z0-9]{4,12}$/.test(orderNumber) ||
    !verifyOrderAccessToken(orderNumber, token)
  ) {
    return null;
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey);
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_email, customer_phone, address_line1, city, state, pincode, subtotal, discount_amount, shipping_amount, gst_amount, total_amount, payment_status, order_status, created_at",
    )
    .eq("order_number", orderNumber)
    .maybeSingle();

  if (orderError || !order) return null;

  const { data: items, error: itemsError } = await supabase
    .from("order_items")
    .select(
      "item_type, product_id, product_name, combo_name, bottle_size, quantity, unit_price, total_price, reference_price, discount_amount, savings, pricing_rule, selected_product_names, selected_product_images",
    )
    .eq("order_id", order.id)
    .order("id", { ascending: true });

  if (itemsError) return null;

  return {
    order: order as HistoricalOrder,
    items: (items ?? []) as HistoricalOrderItem[],
  };
}
import { calculateCartPricing } from "@/lib/orderTotals";
import { generateOrderId } from "@/lib/orderMessaging";

export type OrderCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type ServerOrderSummary = {
  subtotal: number;
  discountAmount: number;
  shippingAmount: number;
  gstAmount: number;
  personalizationCharge: number;
  totalAmount: number;
  orderItems: Array<Record<string, unknown>>;
};

export function sanitizeCustomer(customer: Partial<OrderCustomer> | null | undefined) {
  return {
    name: String(customer?.name ?? "").trim(),
    phone: String(customer?.phone ?? "").trim(),
    email: String(customer?.email ?? "").trim(),
    address: String(customer?.address ?? "").trim(),
    city: String(customer?.city ?? "").trim(),
    state: String(customer?.state ?? "").trim(),
    pincode: String(customer?.pincode ?? "").trim(),
  };
}

export function validateServerCustomer(
  customer: Partial<OrderCustomer> | null | undefined,
): CustomerValidationResult {
  const sanitized = sanitizeCustomer(customer);
  const required: Array<keyof typeof sanitized> = ["name", "phone", "email", "address", "city", "state", "pincode"];
  if (required.some((field) => !sanitized[field])) return { valid: false, error: "Please provide all required customer details." };
  if (!/^\S+@\S+\.\S+$/.test(sanitized.email)) return { valid: false, error: "Please enter a valid email address." };
  if (!/^\d{10}$/.test(sanitized.phone.replace(/\D/g, ""))) return { valid: false, error: "Please enter a valid 10-digit mobile number." };
  if (!/^\d{6}$/.test(sanitized.pincode)) return { valid: false, error: "Please enter a valid 6-digit pincode." };
  return { valid: true, customer: sanitized };
}

export function normalizeOrderNumber(value?: string | null) {
  return typeof value === "string" && /^SFH-\d{8}-[A-Za-z0-9]{4,12}$/.test(value.trim())
    ? value.trim()
    : generateOrderId();
}

export function calculateServerOrderSummary(items: CartItem[] = []): ServerOrderSummary {
  const totals = calculateCartPricing(items, products);
  const orderItems = totals.items.map(({ item, productPrice, personalizationType, personalizationText, personalizationCharge, lineTotal, quantity }) => {
    if (item.type === "combo") {
      return {
        item_type: "combo",
        combo_id: item.comboId,
        combo_name: item.comboName ?? "Custom Combo",
        bottle_size: item.bottleSize,
        quantity,
        unit_price: productPrice,
        total_price: lineTotal,
        reference_price: item.referencePrice ?? lineTotal,
        discount_amount: item.discountAmount ?? 0,
        savings: item.savings ?? 0,
        selected_product_ids: item.selectedProductIds ?? [],
        selected_product_names: item.selectedProductNames ?? [],
        selected_product_images: item.selectedProductImages ?? [],
        pricing_rule: item.pricingRule ?? null,
      };
    }
    const product = products.find((entry) => entry.id === item.productId);
    return {
      item_type: "product",
      product_id: product?.id,
      product_name: product?.name ?? item.productName ?? "Perfume",
      bottle_size: item.bottleSize,
      quantity,
      unit_price: productPrice,
      total_price: lineTotal,
      reference_price: productPrice * quantity,
      discount_amount: 0,
      savings: 0,
      selected_product_ids: null,
      selected_product_names: null,
      selected_product_images: null,
      pricing_rule: {
        personalization_charge: personalizationCharge,
        personalization_type: personalizationType ?? null,
        personalization_text: personalizationText || null,
      },
    };
  });

  return {
    subtotal: totals.subtotal,
    discountAmount: totals.discount,
    shippingAmount: totals.shipping,
    gstAmount: totals.gst,
    personalizationCharge: totals.personalizationTotal,
    totalAmount: totals.grandTotal,
    orderItems,
  };
}
