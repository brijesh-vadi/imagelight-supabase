import ManufacturerOnboardDialog from "@/components/role/manufacturer/view/onboard/ManufacturerOnboardDialog";
import { getSession } from "@/lib/supabase/session";

const ManufacturerDashboardPage = async () => {
  const session = await getSession();

  if (!session?.isOnboarded) {
    return <ManufacturerOnboardDialog userId={session?.userId ?? ""} />;
  }
  return (
    <>
      <div>ManufacturerDashboardPage</div>
    </>
  );
};

export default ManufacturerDashboardPage;
