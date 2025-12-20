import DealersListView from "@/components/role/manufacturer/view/dealer-applications/DealersListView";

const DealerApplicationsPage = async () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">
            Dealership Applications
          </h1>
          <p className="text-muted-foreground text-sm">
            Review, track, and manage dealership requests from dealers applying
            to work with your business.
          </p>
        </div>
      </div>
      <DealersListView />
    </div>
  );
};

export default DealerApplicationsPage;
