import ManufacturerAddUnitModal from "@/components/role/manufacturer/view/units/ManufacturerAddUnitModal";
import ManufacturerUnitTable from "@/components/role/manufacturer/view/units/ManufacturerUnitTable";

const ManufacturerUnitsPage = async () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="">
          <h1 className="font-semibold text-2xl text-primary">Units</h1>
          <p className="text-muted-foreground text-sm">
            Manage measurement units for your products
          </p>
        </div>
        <ManufacturerAddUnitModal />
      </div>

      <ManufacturerUnitTable />
    </div>
  );
};

export default ManufacturerUnitsPage;
