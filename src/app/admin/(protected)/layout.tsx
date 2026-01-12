import { redirect } from "next/navigation";
import AdminSidebar from "@/components/role/admin/shared/AdminSidebar";
import { getSession } from "@/lib/supabase/session";
import { Role } from "@/types";

export default async function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(Role.ADMIN);

  if (!session) {
    redirect("/admin/sign-in");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <main className="overflow-auto flex-1 p-4 relative">{children}</main>
    </div>
  );
}
