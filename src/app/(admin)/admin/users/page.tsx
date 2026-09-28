import { redirect } from "next/navigation";

/** Users list lives on Overview — keep URL for old bookmarks. */
export default function AdminUsersRedirectPage() {
  redirect("/admin");
}
