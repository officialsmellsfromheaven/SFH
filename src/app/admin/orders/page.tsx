import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/admin-auth";
import AdminOrdersClient from "@/components/admin/AdminOrdersClient";

export default async function AdminOrdersPage() {
  if (!(await getAdminSession())) redirect("/admin/login");
  return <AdminOrdersClient />;
}
