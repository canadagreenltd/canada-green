import { redirect } from "next/navigation";

export default function DashboardPaymentsNewRedirect() {
  redirect("/dashboard/billing");
}
