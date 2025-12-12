import { getManufacturerProfile } from "@/actions/manufacturer/auth.action";
import ManufacturerSidebar from "@/components/role/manufacturer/shared/ManufacturerSidebar";
import { getSession } from "@/lib/supabase/session";

export default async function ManufacturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const response = await getManufacturerProfile(session?.userId ?? "");

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      {session?.isOnboarded && (
        <ManufacturerSidebar manufacturer={response?.data} />
      )}

      {/* Main content area */}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>
  );
}
