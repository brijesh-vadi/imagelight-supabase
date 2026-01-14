import { getDealerProfile } from "@/actions/dealer/auth.action";
import DealerOnboardModal from "@/components/role/dealer/views/onboard/DealerOnboardModal";
import DealerPasswordResetModal from "@/components/role/dealer/views/reset-password/DealerPasswordResetModal";
import { getSession } from "@/lib/supabase/session";
import { Role } from "@/types";

const DealerDashboardPage = async () => {
  const session = await getSession(Role.DEALER);

  if (!session) return;

  const { data: dealer } = await getDealerProfile(session?.userId);

  if (!dealer) return;

  if (dealer?.is_added_by_manufacturer) {
    return <DealerPasswordResetModal dealerId={dealer.id} />;
  }

  if (!dealer?.is_onboarded) {
    return <DealerOnboardModal userId={dealer?.id ?? ""} dealer={dealer} />;
  }

  if (!session) return;

  return (
    <>
      <div>DealerDashboardPage</div>
    </>
  );
};

export default DealerDashboardPage;
