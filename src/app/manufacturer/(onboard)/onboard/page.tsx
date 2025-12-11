import ManufacturerOnboardDialog from "@/components/role/manufacturer/view/onboard/ManufacturerOnboardDialog";
import { getSession } from "@/lib/supabase/session";

const ManufacturerOnboardPage = async () => {
  const session = await getSession();
  return (
    <div className="flex h-screen items-center justify-center bg-muted/30 p-4">
      <ManufacturerOnboardDialog userId={session?.userId ?? ""} />
    </div>
  );
};

export default ManufacturerOnboardPage;
