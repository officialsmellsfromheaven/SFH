import "server-only";

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import type { HistoricalOrder, HistoricalOrderItem } from "@/lib/order-server";

export type OrderNotificationType =
  | "ORDER_CONFIRMED_CUSTOMER"
  | "ORDER_CONFIRMED_ADMIN"
  | "ORDER_PROCESSING_CUSTOMER"
  | "ORDER_SHIPPED_CUSTOMER"
  | "ORDER_DELIVERED_CUSTOMER"
  | "ORDER_CANCELLED_CUSTOMER";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = supabaseUrl && serviceRoleKey
  ? createClient(supabaseUrl, serviceRoleKey, { auth: { persistSession: false } })
  : null;

let resend: Resend | null = null;

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || !process.env.RESEND_FROM_EMAIL) throw new Error("Resend email configuration is incomplete.");
  resend ??= new Resend(apiKey);
  return resend;
}

function validEmail(value: unknown): value is string {
  return typeof value === "string" && /^\S+@\S+\.\S+$/.test(value.trim());
}

function escapeHtml(value: unknown) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[character] ?? character));
}

function money(value: unknown) {
  return `₹${Number(value ?? 0).toFixed(2)}`;
}

function itemRows(items: HistoricalOrderItem[]) {
  return items.map((item) => {
    const rule = item.pricing_rule && typeof item.pricing_rule === "object" ? item.pricing_rule : {};
    const personalization = rule.personalization_type
      ? `<div style="color:#666;font-size:13px">Personalization: ${escapeHtml(rule.personalization_type)}${rule.personalization_text ? ` — ${escapeHtml(rule.personalization_text)}` : ""}${Number(rule.personalization_charge ?? 0) ? ` (${money(rule.personalization_charge)})` : ""}</div>`
      : "";
    return `<tr><td style="padding:12px 0;border-bottom:1px solid #eee"><strong>${escapeHtml(item.product_name ?? item.combo_name ?? "Order item")}</strong><div style="color:#666;font-size:13px">${item.bottle_size ? `${escapeHtml(item.bottle_size)}ml · ` : ""}Qty: ${escapeHtml(item.quantity ?? 1)}</div>${personalization}</td><td style="padding:12px 0;border-bottom:1px solid #eee;text-align:right">${money(item.total_price)}</td></tr>`;
  }).join("");
}

function renderEmail(order: HistoricalOrder, items: HistoricalOrderItem[], statusMessage: string, detailsUrl?: string) {
  const personalizationTotal = items.reduce((sum, item) => {
    const rule = item.pricing_rule && typeof item.pricing_rule === "object" ? item.pricing_rule : {};
    return sum + Number(rule.personalization_charge ?? 0);
  }, 0);
  return `<!doctype html><html><body style="margin:0;background:#f7f3ee;color:#29251f;font-family:Arial,sans-serif"><div style="max-width:620px;margin:24px auto;background:#fff;padding:32px;border:1px solid #eadfd2"><div style="color:#bf4800;font-size:22px;font-weight:700">Smells From Heaven</div><p style="color:#8c6b4f">Your fragrance journey begins.</p><h1 style="font-size:24px">${escapeHtml(statusMessage)}</h1><p>Dear ${escapeHtml(order.customer_name)},</p><p>Order number: <strong>${escapeHtml(order.order_number)}</strong></p><table style="width:100%;border-collapse:collapse">${itemRows(items)}</table><div style="margin-top:20px;line-height:1.8"><div>Subtotal: ${money(order.subtotal)}</div>${personalizationTotal ? `<div>Personalization: ${money(personalizationTotal)}</div>` : ""}${Number(order.discount_amount) ? `<div>Discount: -${money(order.discount_amount)}</div>` : ""}<div>Shipping: ${Number(order.shipping_amount) ? money(order.shipping_amount) : "FREE"}</div><div>GST: ${money(order.gst_amount)}</div><strong style="font-size:18px">Total: ${money(order.total_amount)}</strong></div>${detailsUrl ? `<p style="margin-top:24px"><a href="${escapeHtml(detailsUrl)}" style="background:#bf4800;color:#fff;padding:12px 18px;text-decoration:none;border-radius:24px">View order details</a></p>` : ""}<p style="margin-top:28px;color:#666">Payment: ${escapeHtml(order.payment_status)}<br/>Order status: ${escapeHtml(order.order_status)}</p><p style="color:#8c6b4f">With warmth,<br/>Smells From Heaven</p></div></body></html>`;
}

function subjectFor(type: OrderNotificationType, orderNumber: string) {
  const text: Record<OrderNotificationType, string> = {
    ORDER_CONFIRMED_CUSTOMER: "is confirmed",
    ORDER_CONFIRMED_ADMIN: "New SFH Order",
    ORDER_PROCESSING_CUSTOMER: "is being prepared",
    ORDER_SHIPPED_CUSTOMER: "has shipped",
    ORDER_DELIVERED_CUSTOMER: "has been delivered",
    ORDER_CANCELLED_CUSTOMER: "has been cancelled",
  };
  return type === "ORDER_CONFIRMED_ADMIN"
    ? `${text[type]} — ${orderNumber}`
    : `Your Smells From Heaven order ${text[type]} — ${orderNumber}`;
}

export async function sendOrderNotification(orderId: string, type: OrderNotificationType, detailsUrl?: string) {
  if (!supabase) throw new Error("Email service is not configured.");
  const { data: order, error: orderError } = await supabase.from("orders").select("id, order_number, customer_name, customer_email, customer_phone, address_line1, city, state, pincode, subtotal, discount_amount, shipping_amount, gst_amount, total_amount, payment_status, order_status, created_at, razorpay_order_id, razorpay_payment_id").eq("id", orderId).single();
  if (orderError || !order) throw orderError ?? new Error("Order not found.");
  const { data: items, error: itemsError } = await supabase.from("order_items").select("item_type, product_id, product_name, combo_name, bottle_size, quantity, unit_price, total_price, reference_price, discount_amount, savings, pricing_rule, selected_product_names, selected_product_images").eq("order_id", orderId).order("id", { ascending: true });
  if (itemsError) throw itemsError;

  const isAdmin = type === "ORDER_CONFIRMED_ADMIN";
  const recipient = isAdmin ? process.env.ADMIN_NOTIFICATION_EMAIL?.trim() ?? "" : String(order.customer_email ?? "").trim();
  const validRecipient = validEmail(recipient);
  const claimed = await supabase.rpc("claim_order_notification", {
    p_order_id: orderId, p_order_number: order.order_number, p_notification_type: type, p_recipient_email: recipient,
  });
  if (claimed.error) throw claimed.error;
  if (!claimed.data) return;
  if (!validRecipient) {
    await supabase.from("order_notifications").update({ status: "SKIPPED", error_message: "Recipient email is missing or invalid." }).eq("order_id", orderId).eq("notification_type", type);
    console.info(`[Email] ${type} skipped for ${order.order_number}`);
    return;
  }

  const statusMessage: Record<OrderNotificationType, string> = {
    ORDER_CONFIRMED_CUSTOMER: "Your order is confirmed",
    ORDER_CONFIRMED_ADMIN: "A new order has been confirmed",
    ORDER_PROCESSING_CUSTOMER: "Your order is being prepared",
    ORDER_SHIPPED_CUSTOMER: "Your order has shipped",
    ORDER_DELIVERED_CUSTOMER: "Your order has been delivered",
    ORDER_CANCELLED_CUSTOMER: "Your order has been cancelled",
  };
  const adminAddress = `${order.address_line1}, ${order.city}, ${order.state} - ${order.pincode}`;
  const adminExtra = isAdmin ? `<p>Customer: ${escapeHtml(order.customer_name)} · ${escapeHtml(order.customer_email)} · ${escapeHtml(order.customer_phone)}<br/>Address: ${escapeHtml(adminAddress)}<br/>Razorpay order: ${escapeHtml(order.razorpay_order_id)}<br/>Razorpay payment: ${escapeHtml(order.razorpay_payment_id)}</p>` : "";
  try {
    const result = await getResend().emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "",
      to: recipient,
      subject: subjectFor(type, order.order_number),
      html: renderEmail(order as HistoricalOrder, (items ?? []) as HistoricalOrderItem[], statusMessage[type], isAdmin ? undefined : detailsUrl) + adminExtra,
    });
    if (result.error) throw new Error(result.error.message);
    await supabase.from("order_notifications").update({ status: "SENT", provider_message_id: result.data?.id ?? null, sent_at: new Date().toISOString() }).eq("order_id", orderId).eq("notification_type", type);
    console.info(`[Email] ${type} sent for ${order.order_number}`);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Resend request failed.";
    await supabase.from("order_notifications").update({ status: "FAILED", error_message: message.slice(0, 500) }).eq("order_id", orderId).eq("notification_type", type);
    console.error(`[Email] ${type} failed for ${order.order_number}`);
  }
}

export async function notifyOrder(orderId: string, types: OrderNotificationType[], detailsUrl?: string) {
  for (const type of types) await sendOrderNotification(orderId, type, detailsUrl);
}
