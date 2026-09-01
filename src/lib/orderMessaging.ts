import type { CartItem } from "./store";
import { orderConfig } from "./orderConfig";
import { formatPrice } from "./utils";

export type WhatsAppCustomer = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

export type CartTotals = {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  personalizationCharge: number;
  finalTotal: number;
};

export function generateOrderId() {
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `SFH-${stamp}-${suffix}`;
}

function itemLineTotal(item: CartItem) {
  return item.type === "combo" ? item.comboPrice ?? 0 : item.referencePrice ?? 0;
}

function itemDiscount(item: CartItem) {
  return item.type === "combo" ? item.discountAmount ?? item.savings ?? 0 : 0;
}

export function calculateCartTotals(items: CartItem[]): CartTotals {
  const subtotal = items.reduce(
    (sum, item) => sum + itemLineTotal(item) + itemDiscount(item),
    0,
  );
  const discount = items.reduce((sum, item) => sum + itemDiscount(item), 0);

  return {
    subtotal,
    discount,
    shipping: 0,
    tax: 0,
    personalizationCharge: 0,
    finalTotal: subtotal - discount,
  };
}

export function buildWhatsAppOrderMessage(
  customer: WhatsAppCustomer,
  items: CartItem[],
  summary?: Partial<CartTotals>,
  orderId = generateOrderId(),
) {
  const totals = calculateCartTotals(items);
  const resolvedTotals = { ...totals, ...summary };
  const lines = [
    "SMELLS FROM HEAVEN",
    "ORDER",
    "",
    `Order ID: ${orderId}`,
    "",
    "CUSTOMER DETAILS",
    `Name: ${customer.name.trim()}`,
    `Phone: ${customer.phone.trim()}`,
    `Email: ${customer.email.trim()}`,
    "Address:",
    `${customer.address.trim()}, ${customer.city.trim()}, ${customer.state.trim()} - ${customer.pincode.trim()}`,
    "",
    "ORDER DETAILS",
  ];

  items.forEach((item, index) => {
    const name = item.type === "combo" ? item.comboName ?? "Custom Combo" : item.productName ?? "Perfume";
    const quantity = item.quantity ?? 1;
    const lineTotal = itemLineTotal(item);
    const unitPrice = quantity > 0 ? lineTotal / quantity : lineTotal;

    lines.push(
      `${index + 1}. ${name}`,
      `   Qty: ${quantity}`,
      `   Price: ${formatPrice(unitPrice)}`,
      `   Total: ${formatPrice(lineTotal)}`,
    );

    if (item.type === "combo" && item.selectedProductNames?.length) {
      lines.push(`   Selected Perfumes: ${item.selectedProductNames.join(", ")}`);
    }
    lines.push("");
  });

  lines.push(`Subtotal: ${formatPrice(resolvedTotals.subtotal)}`);
  if (resolvedTotals.discount > 0) lines.push(`Discount: -${formatPrice(resolvedTotals.discount)}`);
  if (resolvedTotals.shipping > 0) lines.push(`Shipping: ${formatPrice(resolvedTotals.shipping)}`);
  if (resolvedTotals.personalizationCharge > 0) {
    lines.push(`Personalization: ${formatPrice(resolvedTotals.personalizationCharge)}`);
  }
  if (resolvedTotals.tax > 0) lines.push(`Tax: ${formatPrice(resolvedTotals.tax)}`);
  lines.push(`Final Total: ${formatPrice(resolvedTotals.finalTotal)}`, "", "Please confirm my order.", "", "Thank you!", "Smells From Heaven");
  return lines.join("\n");
}

export function buildWhatsAppOrderUrl(
  customer: WhatsAppCustomer,
  items: CartItem[],
  summary?: Partial<CartTotals>,
  orderId?: string,
) {
  return `https://wa.me/${orderConfig.whatsappNumber}?text=${encodeURIComponent(
    buildWhatsAppOrderMessage(customer, items, summary, orderId),
  )}`;
}
