import { jsPDF } from "jspdf";
import type { CartItem } from "@/lib/store";

export type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
};

const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN = 14;
const CONTENT_W = PAGE_W - MARGIN * 2;
const GOLD = [171, 126, 48] as const;
const TEXT = [32, 32, 32] as const;
const BORDER = [205, 205, 205] as const;

function money(v: number) {
  return `₹${Math.round(v).toLocaleString("en-IN")}`;
}

function raw(item: CartItem, key: string): unknown {
  return (item as unknown as Record<string, unknown>)[key];
}

function text(v: unknown, fallback = "") {
  return v == null || v === "" ? fallback : String(v);
}

function number(v: unknown) {
  return typeof v === "number" ? v : Number(v || 0);
}

function getBase64(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

async function setupUnicodeFont(pdf: jsPDF) {
  try {
    const response = await fetch("/fonts/segoeui.ttf");
    if (!response.ok) throw new Error("font unavailable");
    const base64 = getBase64(await response.arrayBuffer());
    pdf.addFileToVFS("SegoeUI.ttf", base64);
    pdf.addFont("SegoeUI.ttf", "SegoeUI", "normal");

    const boldResponse = await fetch("/fonts/segoeuib.ttf");
    if (!boldResponse.ok) throw new Error("Bold Unicode font unavailable");

    const boldBase64 = getBase64(await boldResponse.arrayBuffer());

    pdf.addFileToVFS("SegoeUIBold.ttf", boldBase64);
    pdf.addFont("SegoeUIBold.ttf", "SegoeUI", "bold");

    pdf.setFont("SegoeUI", "normal");
    return true;
  } catch {
    pdf.setFont("helvetica", "normal");
    return false;
  }
}

async function loadWatermark() {
  const img = new Image();
  img.src = "/images/watermark%20logo.png";

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Watermark logo could not be loaded."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth || img.width;
  canvas.height = img.naturalHeight || img.height;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not prepare watermark.");

  ctx.drawImage(img, 0, 0);

  return {
    data: canvas.toDataURL("image/png"),
    width: canvas.width,
    height: canvas.height,
  };
}

function drawWatermark(
  pdf: jsPDF,
  image: { data: string; width: number; height: number },
) {
  /*
   * IMPORTANT:
   * Do NOT rely on jsPDF GState opacity.
   *
   * Some jsPDF/browser combinations render the watermark much
   * darker than expected. Instead, bake the opacity directly
   * into a transparent canvas before adding it to the PDF.
   */

  const maxW = CONTENT_W * 0.70;
  const maxH = PAGE_H * 0.64;

  const ratio = image.width / image.height;

  let w = maxW;
  let h = w / ratio;

  if (h > maxH) {
    h = maxH;
    w = h * ratio;
  }

  const x = (PAGE_W - w) / 2;
  const y = (PAGE_H - h) / 2;

  const img = new Image();
  img.src = image.data;

  const canvas = document.createElement("canvas");

  canvas.width = Math.max(1, Math.round(w * 8));
  canvas.height = Math.max(1, Math.round(h * 8));

  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not create watermark canvas.");
  }

  /*
   * VERY SUBTLE WATERMARK
   *
   * Target reference has a soft background watermark.
   * Keep it intentionally faint.
   */
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.globalAlpha = 0.060;

  ctx.drawImage(
    img,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  ctx.globalAlpha = 1;

  const watermarkData = canvas.toDataURL("image/png");

  /*
   * Add watermark BEFORE ALL invoice text.
   * No jsPDF transparency state is used.
   */
  pdf.addImage(
    watermarkData,
    "PNG",
    x,
    y,
    w,
    h,
    undefined,
    "FAST",
  );
}

function section(pdf: jsPDF, title: string, y: number) {
  pdf.setFont("SegoeUI", "bold");
  pdf.setFontSize(9.5);
  pdf.setTextColor(...TEXT);
  pdf.text(title, MARGIN, y);
  return y + 6;
}

function field(pdf: jsPDF, label: string, value: string, y: number, labelWidth = 32) {
  pdf.setFont("SegoeUI", "bold");
  pdf.setFontSize(8.7);
  pdf.setTextColor(...TEXT);
  pdf.text(label, MARGIN, y);

  pdf.setFont("SegoeUI", "normal");
  const x = MARGIN + labelWidth;
  const lines = pdf.splitTextToSize(value || "-", PAGE_W - MARGIN - x);
  pdf.text(lines, x, y);

  return y + Math.max(4.4, lines.length * 4.2);
}

export function getInvoiceNumber() {
  const key = "sfh-invoice-sequence";
  const now = new Date();
  const date =
    String(now.getDate()).padStart(2, "0") +
    String(now.getMonth() + 1).padStart(2, "0") +
    now.getFullYear();

  const next = Number(window.localStorage.getItem(key) || "0") + 1;
  window.localStorage.setItem(key, String(next));

  return `SFH-${date}-${String(next).padStart(2, "0")}`;
}

export function buildWhatsAppMessage(
  customer: CustomerDetails,
  items: CartItem[],
  invoiceNumber: string,
) {
  const lines = [
    "Hello! I would like to place my order on WhatsApp.",
    "",
    `Invoice Number: ${invoiceNumber}`,
    "",
    "CUSTOMER DETAILS",
    `Name: ${customer.name}`,
    `Mobile: ${customer.phone}`,
    `Email: ${customer.email}`,
    `Address: ${customer.address}, ${customer.city}, ${customer.state} - ${customer.pincode}`,
    "",
    "ORDER DETAILS",
  ];

  for (const item of items) {
    if (raw(item, "type") === "combo") {
      const selected = Array.isArray(raw(item, "selectedProductNames"))
        ? (raw(item, "selectedProductNames") as unknown[]).map(String).join(", ")
        : text(raw(item, "selectedProductNames"), "None");

      lines.push(
        `Combo: ${text(raw(item, "comboName"), "Custom Combo")}`,
        `Bottle Size: ${text(raw(item, "bottleSize"), "-")}ml`,
        `Quantity: ${text(raw(item, "quantity"), "0")}`,
        `Selected Perfumes: ${selected}`,
        `Reference Price: ${money(number(raw(item, "referencePrice")))}`,
        `Combo Price: ${money(number(raw(item, "comboPrice")))}`,
        `You Save: ${money(number(raw(item, "savings")))}`,
        "",
      );
    } else {
      lines.push(
        `Product: ${text(raw(item, "productName"), "Perfume")}`,
        `Price: ${money(number(raw(item, "referencePrice")))}`,
        "",
      );
    }
  }

  const total = items.reduce(
    (sum, item) =>
      sum +
      (raw(item, "type") === "combo"
        ? number(raw(item, "comboPrice"))
        : number(raw(item, "referencePrice"))),
    0,
  );

  lines.push(`ORDER TOTAL: ${money(total)}`, "", "Please confirm my order and share the payment details.", "Thank you!");
  return lines.join("\n");
}

export async function generateCustomerInvoicePdf(
  customer: CustomerDetails,
  items: CartItem[],
  invoiceNumber: string,
) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  await setupUnicodeFont(pdf);
  const watermark = await loadWatermark();

  // Draw watermark before all invoice content.
  drawWatermark(pdf, watermark);

  let y = 17;

  // HEADER
  pdf.setFont("SegoeUI", "bold");
  pdf.setFontSize(18);
  pdf.setTextColor(...GOLD);
  pdf.text("SMELLS FROM HEAVEN", PAGE_W / 2, y, { align: "center" });

  pdf.setFont("SegoeUI", "normal");
  pdf.setFontSize(6.7);
  pdf.text("CRAFTED IN HEAVEN. WORN BY LEGENDS.", PAGE_W / 2, y + 5.5, { align: "center" });

  y += 13;
  pdf.setDrawColor(...BORDER);
  pdf.setLineWidth(0.25);
  pdf.line(MARGIN + 10, y, PAGE_W - MARGIN - 10, y);
  y += 7;

  // INVOICE META
  pdf.setFont("SegoeUI", "bold");
  pdf.setFontSize(8);
  pdf.setTextColor(...TEXT);
  pdf.text("Invoice Number", MARGIN, y);
  pdf.setFont("SegoeUI", "normal");
  pdf.text(`: ${invoiceNumber}`, MARGIN + 31, y);

  pdf.setFont("SegoeUI", "bold");
  pdf.text("Invoice Date", 124, y);
  pdf.setFont("SegoeUI", "normal");
  pdf.text(`: ${new Date().toLocaleDateString("en-IN")}`, 151, y);
  y += 9;

  // CUSTOMER
  y = section(pdf, "CUSTOMER DETAILS", y);
  y = field(pdf, "Name", customer.name, y);
  y = field(pdf, "Mobile", customer.phone, y);
  y = field(pdf, "Email", customer.email, y);
  y = field(pdf, "Address", customer.address, y);
  y = field(pdf, "City", customer.city, y);
  y = field(pdf, "State", customer.state, y);
  y = field(pdf, "Pincode", customer.pincode, y);
  y += 3;

  // ORDER DETAILS
  y = section(pdf, "ORDER DETAILS", y);

  for (const item of items) {
    const combo = raw(item, "type") === "combo";

    if (combo) {
      y = field(pdf, "Combo Name", text(raw(item, "comboName"), "Custom Combo"), y);
      y = field(pdf, "Bottle Size", `${text(raw(item, "bottleSize"), "-")}ml`, y);
      y = field(pdf, "Quantity", text(raw(item, "quantity"), "0"), y);

      const selected = Array.isArray(raw(item, "selectedProductNames"))
        ? (raw(item, "selectedProductNames") as unknown[]).map(String).join(", ")
        : text(raw(item, "selectedProductNames"), "None");

      y = field(pdf, "Selected Perfumes", selected, y);
    } else {
      y = field(pdf, "Product Name", text(raw(item, "productName"), "Perfume"), y);
      const brand = text(raw(item, "brand"));
      if (brand) y = field(pdf, "Brand", brand, y);

      const size = raw(item, "size") ?? raw(item, "bottleSize");
      if (size != null) y = field(pdf, "Size", `${text(size)}ml`, y);

      y = field(pdf, "Quantity", text(raw(item, "quantity"), "1"), y);
    }

    y += 2;
  }

  // PRICE SUMMARY — flow based, directly after order details.
  y += 2;

  const referenceTotal = items.reduce(
    (sum, item) => sum + number(raw(item, "referencePrice")),
    0,
  );

  const finalTotal = items.reduce(
    (sum, item) =>
      sum +
      (raw(item, "type") === "combo"
        ? number(raw(item, "comboPrice"))
        : number(raw(item, "referencePrice"))),
    0,
  );

  const savingsTotal = items.reduce(
    (sum, item) =>
      sum + (raw(item, "type") === "combo" ? number(raw(item, "savings")) : 0),
    0,
  );

  const boxX = MARGIN;
  const boxW = CONTENT_W;
  const boxH = 46;
  const boxY = y;

  pdf.setDrawColor(150, 150, 150);
  pdf.setLineWidth(0.35);
  pdf.roundedRect(boxX, boxY, boxW, boxH, 3, 3);

  pdf.setFont("SegoeUI", "bold");
  pdf.setFontSize(9);
  pdf.setTextColor(...TEXT);
  pdf.text("PRICE SUMMARY", boxX + 7, boxY + 8);

  const left = boxX + 7;
  const right = boxX + boxW - 7;

  pdf.setFont("SegoeUI", "normal");
  pdf.setFontSize(9);

  pdf.text("Reference Price", left, boxY + 17);
  pdf.text(money(referenceTotal), right, boxY + 17, { align: "right" });

  pdf.text("Combo Price", left, boxY + 25);
  pdf.text(money(finalTotal), right, boxY + 25, { align: "right" });

  pdf.setTextColor(35, 125, 65);
  pdf.text("You Save", left, boxY + 33);
  pdf.text(money(savingsTotal), right, boxY + 33, { align: "right" });

  pdf.setDrawColor(...BORDER);
  pdf.line(left, boxY + 37, right, boxY + 37);

  pdf.setTextColor(...TEXT);
  pdf.setFont("SegoeUI", "bold");
  pdf.setFontSize(10.5);
  pdf.text("ORDER TOTAL", left, boxY + 43);
  pdf.text(money(finalTotal), right, boxY + 43, { align: "right" });

  y = boxY + boxH + 9;

  // FOOTER
  pdf.setFont("SegoeUI", "normal");
  pdf.setFontSize(8);
  pdf.setTextColor(...TEXT);
  pdf.text("Thank you for shopping with us!", PAGE_W / 2, y, { align: "center" });

  pdf.setFont("SegoeUI", "bold");
  pdf.setTextColor(...GOLD);
  pdf.text("— Smells From Heaven —", PAGE_W / 2, y + 5, { align: "center" });

  const filename = `Smells-From-Heaven-Invoice-${invoiceNumber}.pdf`;
  pdf.save(filename);
  return filename;
}

// Existing checkout can continue calling this function.
export async function printCustomerInvoice(
  customer: CustomerDetails,
  items: CartItem[],
  invoiceNumber: string,
) {
  return generateCustomerInvoicePdf(customer, items, invoiceNumber);
}
