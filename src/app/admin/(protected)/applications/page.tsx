import { getAllManufacturers } from "@/actions/admin/applications.action";
import ApplicationsTable from "@/components/role/admin/view/applications/ApplicationTable";

const page = async () => {
  const { data: manufacturers } = await getAllManufacturers({
    page: 1,
    limit: 10,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">
            Manufacturer Applications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Total: {manufacturers?.length} applications
          </p>
        </div>
      </div>

      {/* Manufacturers List */}
      <div className="space-y-4">
        {manufacturers?.length === 0 ? (
          <p className="text-center font-medium">No applications found.</p>
        ) : (
          <ApplicationsTable manufacturers={manufacturers ?? []} />
        )}
      </div>
    </div>
  );
};

export default page;
