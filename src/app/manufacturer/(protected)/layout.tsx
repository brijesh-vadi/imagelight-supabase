import { redirect } from "next/navigation";
import { getManufacturerProfile } from "@/actions/manufacturer/auth.action";
import ManufacturerSidebar from "@/components/role/manufacturer/shared/ManufacturerSidebar";
import ManufacturerSidebarCompact from "@/components/role/manufacturer/shared/ManufacturerSidebarCompact";
import { getSession } from "@/lib/supabase/session";
import { Role } from "@/types";

export const dynamic = "force-dynamic";

export default async function ManufacturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(Role.MANUFACTURER);

  if (!session) {
    redirect("/manufacturer/sign-in");
  }

  const { data: manufacturer } = await getManufacturerProfile(session.userId);

  return (
    <div className="h-screen overflow-hidden">
      {manufacturer?.is_onboarded && manufacturer?.is_verified ? (
        <div className="flex h-full overflow-hidden bg-background text-foreground">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            <ManufacturerSidebar manufacturer={manufacturer} />
          </div>

          {/* Mobile Sidbar */}
          <div className="lg:hidden">
            <ManufacturerSidebarCompact manufacturer={manufacturer} />
          </div>

          <main className="flex-1 overflow-auto p-4">{children}</main>
        </div>
      ) : (
        <main className="overflow-hidden p-4 relative">{children}</main>
      )}
    </div>
  );
}
