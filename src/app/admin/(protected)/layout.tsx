import AdminSidebar from "@/components/role/admin/shared/AdminSidebar";

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content area */}
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
