import { getManufacturerProfile } from "@/actions/manufacturer/auth.action";
import { getManufacturerApplicationStatus } from "@/actions/manufacturer/onboard.action";
import ManufacturerApplicationStatus from "@/components/role/manufacturer/view/onboard/ManufacturerApplicationStatus";
import ManufacturerOnboardModal from "@/components/role/manufacturer/view/onboard/ManufacturerOnboardModal";
import { getSession } from "@/lib/supabase/session";
import type { ApplicationHistoryEntry, ApplicationStatus } from "@/types";

const ManufacturerDashboardPage = async () => {
  const session = await getSession();

  if (!session) return;

  const { data: manufacturer } = await getManufacturerProfile(session?.userId);

  const { data: applicationStatusData } =
    await getManufacturerApplicationStatus(session.userId);

  if (!manufacturer?.is_onboarded) {
    return <ManufacturerOnboardModal userId={manufacturer?.id ?? ""} />;
  }

  const currentStatus: ApplicationStatus =
    applicationStatusData?.currentStatus ?? "PENDING";

  const history: ApplicationHistoryEntry[] =
    applicationStatusData?.history ?? [];
  if (
    !applicationStatusData ||
    applicationStatusData.currentStatus !== "APPROVED"
  ) {
    return (
      <ManufacturerApplicationStatus
        manufacturer={manufacturer}
        currentStatus={currentStatus}
        history={history}
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
