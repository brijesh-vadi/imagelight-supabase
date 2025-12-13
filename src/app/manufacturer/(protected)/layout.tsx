import { getManufacturerProfile } from "@/actions/manufacturer/auth.action";
import ManufacturerSidebar from "@/components/role/manufacturer/shared/ManufacturerSidebar";
import { getSession } from "@/lib/supabase/session";

export default async function ManufacturerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const { data: manufacturer } = await getManufacturerProfile(
    session?.userId ?? "",
  );

  return (
    <div>
      {manufacturer?.is_onboarded && manufacturer?.is_verified && (
        <div className="flex h-screen overflow-hidden bg-background text-foreground">
          <ManufacturerSidebar manufacturer={manufacturer} />
        </div>
      )}
      <main className="flex-1 overflow-y-auto p-4">{children}</main>
    </div>

    // <div className="flex h-screen overflow-hidden bg-background text-foreground">
    //   {manufacturer?.is_onboarded && manufacturer.is_verified && (
    //     <ManufacturerSidebar manufacturer={manufacturer} />
    //   )}

    //   <main className="flex-1 overflow-y-auto p-4">{children}</main>
    // </div>
  );
}
