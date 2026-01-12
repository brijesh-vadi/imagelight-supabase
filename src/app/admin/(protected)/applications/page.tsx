import ApplicationsTable from "@/components/role/admin/view/applications/ApplicationTable";

const page = async () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">
            Manufacturer Applications
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Review,manage and approve manufacturer application requests
          </p>
        </div>
      </div>

      <ApplicationsTable />
    </div>
  );
};

export default page;
