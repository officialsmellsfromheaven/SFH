import { getAdminSession } from "@/lib/admin-auth";
import { fetchAdminOrder } from "@/lib/admin-orders";
import { buildPdf } from "@/app/api/orders/[orderNumber]/invoice/route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orderNumber: string }> | { orderNumber: string } },
) {
  if (!(await getAdminSession())) return new Response("Unauthorized", { status: 401 });
  const { orderNumber: rawOrderNumber } = await Promise.resolve(params);
  let orderNumber: string;
  try {
    orderNumber = decodeURIComponent(rawOrderNumber).trim();
  } catch {
    return new Response("Not found", { status: 404 });
  }
  try {
    const result = await fetchAdminOrder(orderNumber);
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
  } catch (error) {
    console.error("Admin invoice generation failed:", error);
    return new Response("Unable to generate invoice", { status: 500 });
  }
}
