import { getManufacturerProfile } from "@/actions/manufacturer/auth.action";
import { getManufacturerApplication } from "@/actions/manufacturer/onboard.action";
import ManufacturerApplicationStatus from "@/components/role/manufacturer/view/onboard/ManufacturerApplicationStatus";
import ManufacturerOnboardModal from "@/components/role/manufacturer/view/onboard/ManufacturerOnboardModal";
import { getSession } from "@/lib/supabase/session";

const ManufacturerDashboardPage = async () => {
  const session = await getSession();

  const { data: manufacturer } = await getManufacturerProfile(session?.userId!);

  const { data: application } = await getManufacturerApplication(
    session?.userId!,
  );

  if (!manufacturer?.is_onboarded) {
    return <ManufacturerOnboardModal userId={manufacturer?.id ?? ""} />;
  }

  if (!application || application.status !== "APPROVED") {
    return (
      <ManufacturerApplicationStatus
        manufacturer={manufacturer}
        currentStatus={application?.status || "PENDING"}
      />
    );
  }
  return (
    <>
      <div>ManufacturerDashboardPage</div>
    </>
  );
};

export default ManufacturerDashboardPage;
