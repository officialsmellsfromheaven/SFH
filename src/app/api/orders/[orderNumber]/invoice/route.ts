import { jsPDF } from "jspdf";
import { fetchSecureOrder, type HistoricalOrderItem } from "@/lib/order-server";
import { orderConfig } from "@/lib/orderConfig";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 42;

function numberValue(value: unknown, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function money(value: unknown) {
  return `INR ${numberValue(value).toFixed(2)}`;
}

function pricingRule(item: HistoricalOrderItem) {
  return item.pricing_rule && typeof item.pricing_rule === "object" ? item.pricing_rule : {};
}

function itemName(item: HistoricalOrderItem) {
  return item.item_type === "combo"
    ? item.combo_name || "Custom Combo"
    : item.product_name || "Perfume";
}

export function buildPdf(order: NonNullable<Awaited<ReturnType<typeof fetchSecureOrder>>>["order"], items: HistoricalOrderItem[]) {
  const pdf = new jsPDF({ unit: "pt", format: "a4" });
  let y = MARGIN;

  const write = (value: string, options: { size?: number; bold?: boolean; color?: [number, number, number]; gap?: number } = {}) => {
    const size = options.size ?? 10;
    const lineHeight = size + 4;
    const lines = pdf.splitTextToSize(value, PAGE_WIDTH - MARGIN * 2);
    if (y + lines.length * lineHeight > PAGE_HEIGHT - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
    pdf.setFont("helvetica", options.bold ? "bold" : "normal");
    pdf.setFontSize(size);
    pdf.setTextColor(...(options.color ?? [47, 47, 38]));
    pdf.text(lines, MARGIN, y);
    y += lines.length * lineHeight + (options.gap ?? 4);
  };

  pdf.setFillColor(23, 23, 23);
  pdf.rect(0, 0, PAGE_WIDTH, 108, "F");
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(23);
  pdf.text("Smells From Heaven", MARGIN, 48);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10);
  pdf.setTextColor(242, 195, 139);
  pdf.text("Where every smell is a heavenly delight", MARGIN, 68);
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.text(`Invoice ${order.order_number}`, PAGE_WIDTH - MARGIN - 130, 48);
  pdf.text(new Date(order.created_at).toLocaleDateString("en-IN"), PAGE_WIDTH - MARGIN - 130, 66);
  y = 140;

  const boxWidth = (PAGE_WIDTH - MARGIN * 2 - 14) / 2;
  const boxHeight = 102;
  pdf.setDrawColor(229, 224, 216);
  pdf.roundedRect(MARGIN, y, boxWidth, boxHeight, 8, 8);
  pdf.roundedRect(MARGIN + boxWidth + 14, y, boxWidth, boxHeight, 8, 8);
  pdf.setTextColor(47, 47, 47);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(10);
  pdf.text("CUSTOMER", MARGIN + 12, y + 20);
  pdf.text("ORDER", MARGIN + boxWidth + 26, y + 20);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text(pdf.splitTextToSize(
    `${order.customer_name}\n${order.customer_email}\n${order.customer_phone}\n${order.address_line1}, ${order.city}, ${order.state} - ${order.pincode}`,
    boxWidth - 24,
  ), MARGIN + 12, y + 38);
  pdf.text(
    pdf.splitTextToSize(
      `Order number: ${order.order_number}\nPayment: ${order.payment_status}\nStatus: ${order.order_status}`,
      boxWidth - 24,
    ),
    MARGIN + boxWidth + 26,
    y + 38,
  );
  y += boxHeight + 30;

  write("ORDER ITEMS", { size: 11, bold: true, color: [191, 72, 0], gap: 9 });
  pdf.setDrawColor(220, 215, 208);
  pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
  y += 17;

  for (const item of items) {
    const rule = pricingRule(item);
    const quantity = numberValue(item.quantity, 1);
    const personalizationText = String(rule.personalization_text ?? "").trim();
    const personalizationCharge = numberValue(rule.personalization_charge);
    const details = [
      item.item_type === "combo"
        ? `${quantity} selected bottles | ${money(item.unit_price)} combo price at time of order`
        : `${quantity} x ${money(item.unit_price)} (price at time of order)`,
      item.bottle_size ? `${item.bottle_size}ml` : "",
      item.item_type === "combo" && item.selected_product_names?.length
        ? `Selected: ${item.selected_product_names.join(", ")}`
        : "",
      personalizationText || personalizationCharge > 0
        ? `Personalization: ${String(rule.personalization_type ?? "Name")}${personalizationText ? ` - "${personalizationText}"` : ""}${personalizationCharge > 0 ? ` (${money(personalizationCharge)})` : ""}`
        : "",
    ].filter(Boolean);
    const itemLines = pdf.splitTextToSize(
      `${itemName(item)}\n${details.join(" | ")}`,
      PAGE_WIDTH - MARGIN * 2 - 115,
    );
    const itemHeight = Math.max(30, itemLines.length * 13 + 12);
    if (y + itemHeight > PAGE_HEIGHT - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
    pdf.setTextColor(47, 47, 47);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(10);
    pdf.text(itemLines, MARGIN, y);
    pdf.setFont("helvetica", "bold");
    pdf.text(money(item.total_price), PAGE_WIDTH - MARGIN - 88, y);
    y += itemHeight;
    pdf.setDrawColor(239, 236, 232);
    pdf.line(MARGIN, y, PAGE_WIDTH - MARGIN, y);
    y += 12;
  }

  y += 8;
  write("PRICING", { size: 11, bold: true, color: [191, 72, 0], gap: 9 });
  const personalizationTotal = items.reduce(
    (total, item) => total + numberValue(pricingRule(item).personalization_charge),
    0,
  );
  const totals: Array<[string, string]> = [
    ["Subtotal", money(order.subtotal)],
    ...(personalizationTotal > 0
      ? [["Personalization", money(personalizationTotal)] as [string, string]]
      : []),
    ...(numberValue(order.discount_amount) > 0
      ? [["Discount", `-${money(order.discount_amount)}`] as [string, string]]
      : []),
    ...(numberValue(order.shipping_amount) > 0
      ? [["Shipping", money(order.shipping_amount)] as [string, string]]
      : [["Shipping", "FREE"] as [string, string]]),
    [`GST (${orderConfig.gstPercentage}%)`, money(order.gst_amount)],
  ];
  for (const [label, value] of totals) {
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);
    pdf.setTextColor(76, 76, 76);
    pdf.text(label, MARGIN, y);
    pdf.setFont("helvetica", "bold");
    pdf.setTextColor(47, 47, 47);
    pdf.text(value, PAGE_WIDTH - MARGIN - 88, y);
    y += 19;
  }
  pdf.setDrawColor(191, 72, 0);
  pdf.line(MARGIN, y - 5, PAGE_WIDTH - MARGIN, y - 5);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(13);
  pdf.setTextColor(23, 23, 23);
  pdf.text("Grand Total", MARGIN, y + 15);
  pdf.text(money(order.total_amount), PAGE_WIDTH - MARGIN - 88, y + 15);
  return pdf.output("arraybuffer");
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> | { orderNumber: string } },
) {
  const { orderNumber: rawOrderNumber } = await Promise.resolve(params);
  let orderNumber = rawOrderNumber;
  try {
    orderNumber = decodeURIComponent(rawOrderNumber).trim();
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const queryToken = searchParams.get("token") ?? "";
  const authorization = request.headers.get("authorization") ?? "";
  const headerToken = authorization.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  const result = await fetchSecureOrder(orderNumber, queryToken || headerToken);

  if (!result) return new Response("Not found", { status: 404 });

  const pdf = buildPdf(result.order, result.items);
  return new Response(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="SFH-Invoice-${result.order.order_number}.pdf"`,
      "Cache-Control": "private, no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
