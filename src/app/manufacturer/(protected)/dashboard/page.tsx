import { getManufacturerProfile } from "@/actions/manufacturer/auth.action";
import ManufacturerOnboardModal from "@/components/role/manufacturer/view/onboard/ManufacturerOnboardModal";
import { getSession } from "@/lib/supabase/session";

const ManufacturerDashboardPage = async () => {
  const session = await getSession();

  const { data: manufacturer } = await getManufacturerProfile(session?.userId!);

  if (!manufacturer?.is_onboarded) {
    return <ManufacturerOnboardModal userId={manufacturer?.id ?? ""} />;
  }
  return (
    <>
      <div>ManufacturerDashboardPage</div>
    </>
  );
};

export default ManufacturerDashboardPage;
