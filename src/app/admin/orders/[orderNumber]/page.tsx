import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminOrderDetailsClient from "@/components/admin/AdminOrderDetailsClient";

export default async function AdminOrderDetailsPage({ params }: { params: Promise<{ orderNumber: string }> }) {
  if (!(await getAdminSession())) redirect("/admin/login");
  const { orderNumber } = await params;
  return <AdminOrderDetailsClient orderNumber={decodeURIComponent(orderNumber)} />;
}
