import { redirect } from "next/navigation";
import { getDealerProfile } from "@/actions/dealer/auth.action";
import DealerSidebar from "@/components/role/dealer/shared/DealerSidebar";
import { getSession } from "@/lib/supabase/session";
import { Role } from "@/types";

export const dynamic = "force-dynamic";

export default async function DealerPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession(Role.DEALER);

  if (!session) {
    redirect("/dealer/sign-in");
  }

  const { data: dealer } = await getDealerProfile(session.userId);

  if (!dealer) {
    redirect("/dealer/sign-in");
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      {/* Sidebar */}
      <DealerSidebar dealer={dealer} />

      {/* Main content area */}
      <main className="flex-1 p-4 overflow-auto">{children}</main>
    </div>
  );
}
