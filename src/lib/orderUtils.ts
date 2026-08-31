import { BottleSize, orderConfig } from "./orderConfig";
import { formatPrice } from "./utils";

export type PersonalizationType = "Name" | "Initials" | "Short Message";

export type OrderTotals = {
  unitPrice: number;
  subtotal: number;
  personalizationCharge: number;
  shipping: number;
  gst: number;
  discount: number;
  grandTotal: number;
};

export type InvoiceDetails = {
  invoiceNumber: string;
  invoiceDate: string;
  customerName: string;
  customerPhone: string;
  deliveryAddress?: string;
  productName: string;
  bottleSize: BottleSize;
  quantity: number;
  personalizationType: PersonalizationType;
  personalizationText: string;
  totals: OrderTotals;
};

export function calculateOrderTotals({
  bottleSize,
  quantity,
  hasPersonalization,
  unitPrice: unitPriceOverride,
}: {
  bottleSize: BottleSize;
  quantity: number;
  hasPersonalization: boolean;
  unitPrice?: number;
}): OrderTotals {
  const unitPrice = unitPriceOverride ?? orderConfig.bottlePrices[bottleSize];
  const subtotal = unitPrice * quantity;
  const personalizationCharge = hasPersonalization
    ? orderConfig.personalizationCharge
    : 0;
  const shipping = orderConfig.shippingCharge;
  const discount = orderConfig.discount;
  const taxableAmount = Math.max(
    0,
    subtotal + personalizationCharge + shipping - discount
  );
  const gst = Math.round((taxableAmount * orderConfig.gstPercentage) / 100);

  return {
    unitPrice,
    subtotal,
    personalizationCharge,
    shipping,
    gst,
    discount,
    grandTotal: taxableAmount + gst,
  };
}

export function createInvoiceNumber() {
  const stamp = Date.now().toString().slice(-8);
  return `SFH-${stamp}`;
}

export function buildWhatsAppUrl(invoice: InvoiceDetails) {
  const personalization =
    invoice.personalizationText.trim() || "No personalization";
  const message = `Hello!

I would like to place the following order.

Invoice Number:
${invoice.invoiceNumber}

Invoice Total:
${formatPrice(invoice.totals.grandTotal)}

Customer Name:
${invoice.customerName}

Order Details:

• Perfume: ${invoice.productName}
• Size: ${invoice.bottleSize}
• Quantity: ${invoice.quantity}
• Bottle Personalization: ${personalization}

Please confirm my order and share the payment details.

Thank you.`;

  return `https://wa.me/${orderConfig.whatsappNumber}?text=${encodeURIComponent(
    message
  )}`;
}

export function invoiceHtml(invoice: InvoiceDetails) {
  const personalization =
    invoice.personalizationText.trim() || "No personalization";

  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    body { margin: 0; padding: 32px; color: #1d1d1f; font-family: Arial, sans-serif; background: #f5f5f7; }
    .invoice { max-width: 820px; margin: 0 auto; background: #fff; border: 1px solid #eee; border-radius: 18px; overflow: hidden; }
    .header { display: flex; align-items: center; gap: 18px; padding: 28px; color: #fff; background: #111; }
    .logo { width: 64px; height: 64px; border-radius: 16px; object-fit: cover; }
    .content { padding: 28px; }
    h1, h2, p { margin: 0; }
    h1 { font-size: 26px; }
    h2 { font-size: 16px; margin-bottom: 12px; }
    .muted { color: #6e6e73; }
    .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin: 22px 0; }
    .box { border: 1px solid #eee; border-radius: 14px; padding: 16px; }
    table { width: 100%; border-collapse: collapse; margin-top: 18px; }
    th, td { padding: 12px 0; border-bottom: 1px solid #eee; text-align: left; font-size: 14px; }
    th:last-child, td:last-child { text-align: right; }
    .total { font-size: 22px; font-weight: 700; }
    .status { display: inline-block; padding: 6px 10px; border-radius: 999px; background: #fff7ed; color: #bf4800; font-weight: 700; font-size: 12px; }
    @media print { body { background: #fff; padding: 0; } .invoice { border: 0; border-radius: 0; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <img class="logo" src="/logo.png" alt="Smells From Heaven logo" />
      <div>
        <h1>Smells From Heaven</h1>
        <p>Where Every Smell Is A Heavenly Delight</p>
      </div>
    </div>
    <div class="content">
      <div class="grid">
        <div class="box">
          <h2>Invoice</h2>
          <p><strong>${invoice.invoiceNumber}</strong></p>
          <p class="muted">${invoice.invoiceDate}</p>
        </div>
        <div class="box">
          <h2>Status</h2>
          <p><span class="status">Payment Status: Pending</span></p>
          <p style="margin-top: 8px;"><span class="status">Order Status: Awaiting Confirmation</span></p>
        </div>
        <div class="box">
          <h2>Customer</h2>
          <p><strong>${escapeHtml(invoice.customerName)}</strong></p>
          <p class="muted">${escapeHtml(invoice.customerPhone)}</p>
          <p class="muted">${escapeHtml(invoice.deliveryAddress || "Address not provided")}</p>
        </div>
        <div class="box">
          <h2>Order</h2>
          <p><strong>${escapeHtml(invoice.productName)}</strong></p>
          <p class="muted">${invoice.bottleSize} x ${invoice.quantity}</p>
          <p class="muted">Personalization: ${escapeHtml(personalization)}</p>
        </div>
      </div>
      <table>
        <tbody>
          <tr><td>Unit Price</td><td>${formatPrice(invoice.totals.unitPrice)}</td></tr>
          <tr><td>Quantity</td><td>${invoice.quantity}</td></tr>
          <tr><td>Personalization Charge</td><td>${formatPrice(invoice.totals.personalizationCharge)}</td></tr>
          <tr><td>Shipping</td><td>${formatPrice(invoice.totals.shipping)}</td></tr>
          <tr><td>GST</td><td>${formatPrice(invoice.totals.gst)}</td></tr>
          <tr><td>Discount</td><td>-${formatPrice(invoice.totals.discount)}</td></tr>
          <tr><td class="total">Grand Total</td><td class="total">${formatPrice(invoice.totals.grandTotal)}</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</body>
</html>`;
}

export function printInvoice(invoice: InvoiceDetails) {
  const popup = window.open("", "_blank", "width=900,height=1100");
  if (!popup) return;
  popup.document.write(invoiceHtml(invoice));
  popup.document.close();
  popup.focus();
  popup.print();
}

export async function downloadInvoicePdf(invoice: InvoiceDetails) {
  const logo = await fetch("/logo.png").then((response) =>
    response.arrayBuffer()
  );
  const pdf = buildSimpleInvoicePdf(invoice, new Uint8Array(logo));
  const url = URL.createObjectURL(new Blob([pdf], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${invoice.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildSimpleInvoicePdf(invoice: InvoiceDetails, logoBytes: Uint8Array) {
  const lines = [
    "Smells From Heaven",
    "Where Every Smell Is A Heavenly Delight",
    `Invoice Number: ${invoice.invoiceNumber}`,
    `Invoice Date: ${invoice.invoiceDate}`,
    "",
    `Customer Name: ${invoice.customerName}`,
    `Customer Phone: ${invoice.customerPhone}`,
    `Delivery Address: ${invoice.deliveryAddress || "Address not provided"}`,
    "",
    `Perfume Name: ${invoice.productName}`,
    `Bottle Size: ${invoice.bottleSize}`,
    `Quantity: ${invoice.quantity}`,
    `Bottle Personalization: ${
      invoice.personalizationText || "No personalization"
    }`,
    "",
    `Unit Price: ${formatPrice(invoice.totals.unitPrice)}`,
    `Personalization Charge: ${formatPrice(
      invoice.totals.personalizationCharge
    )}`,
    `Shipping: ${formatPrice(invoice.totals.shipping)}`,
    `GST: ${formatPrice(invoice.totals.gst)}`,
    `Discount: -${formatPrice(invoice.totals.discount)}`,
    `Grand Total: ${formatPrice(invoice.totals.grandTotal)}`,
    "",
    "Payment Status: Pending",
    "Order Status: Awaiting Confirmation",
  ];

  const content = [
    "q 64 0 0 64 48 752 cm /Logo Do Q",
    "BT",
    "/F1 12 Tf",
    "48 720 Td",
    ...lines.map((line, index) =>
      index === 0
        ? `/F1 20 Tf (${escapePdf(line)}) Tj /F1 12 Tf 0 -24 Td`
        : `(${escapePdf(line)}) Tj 0 -18 Td`
    ),
    "ET",
  ].join("\n");

  const objects: (string | Uint8Array)[] = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> /XObject << /Logo 5 0 R >> >> /Contents 6 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    concatBytes(
      textBytes(
        `<< /Type /XObject /Subtype /Image /Width 512 /Height 512 /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${logoBytes.length} >>\nstream\n`
      ),
      logoBytes,
      textBytes("\nendstream")
    ),
    `<< /Length ${textBytes(content).length} >>\nstream\n${content}\nendstream`,
  ];

  return buildPdf(objects);
}

function buildPdf(objects: (string | Uint8Array)[]) {
  const chunks: Uint8Array[] = [textBytes("%PDF-1.4\n")];
  const offsets: number[] = [];
  let length = chunks[0].length;

  objects.forEach((object, index) => {
    offsets.push(length);
    const body =
      typeof object === "string"
        ? textBytes(`${index + 1} 0 obj\n${object}\nendobj\n`)
        : concatBytes(
            textBytes(`${index + 1} 0 obj\n`),
            object,
            textBytes("\nendobj\n")
          );
    chunks.push(body);
    length += body.length;
  });

  const xrefOffset = length;
  const xref = [
    "xref",
    `0 ${objects.length + 1}`,
    "0000000000 65535 f ",
    ...offsets.map((offset) => `${offset.toString().padStart(10, "0")} 00000 n `),
    "trailer",
    `<< /Size ${objects.length + 1} /Root 1 0 R >>`,
    "startxref",
    String(xrefOffset),
    "%%EOF",
  ].join("\n");
  chunks.push(textBytes(xref));
  return concatBytes(...chunks);
}

function textBytes(value: string) {
  return new TextEncoder().encode(value);
}

function concatBytes(...parts: Uint8Array[]) {
  const length = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(length);
  let offset = 0;
  parts.forEach((part) => {
    output.set(part, offset);
    offset += part.length;
  });
  return output;
}

function escapePdf(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
