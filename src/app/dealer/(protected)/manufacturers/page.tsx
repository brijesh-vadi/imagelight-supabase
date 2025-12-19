import ManufacturersListView from "@/components/role/dealer/views/manufacturers/ManufacturersListView";

const DealerManufacturersPage = async () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">Manufacturers</h1>
          <p className="text-muted-foreground text-sm">
            Browse manufacturers and explore their available products
          </p>
        </div>
      </div>
      <ManufacturersListView />
    </div>
  );
};

export default DealerManufacturersPage;
