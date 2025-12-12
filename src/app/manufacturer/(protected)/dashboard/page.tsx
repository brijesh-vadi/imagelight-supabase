import ManufacturerOnboardModal from "@/components/role/manufacturer/view/onboard/ManufacturerOnboardModal";
import { getSession } from "@/lib/supabase/session";

const ManufacturerDashboardPage = async () => {
  const session = await getSession();

  if (!session?.isOnboarded) {
    return <ManufacturerOnboardModal userId={session?.userId ?? ""} />;
  }
  return (
    <>
      <div>ManufacturerDashboardPage</div>
    </>
  );
};

export default ManufacturerDashboardPage;
