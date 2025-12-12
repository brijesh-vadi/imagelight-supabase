import ManufacturerSidebar from "@/components/role/manufacturer/shared/ManufacturerSidebar";

export default function ManufacturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <ManufacturerSidebar />

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
