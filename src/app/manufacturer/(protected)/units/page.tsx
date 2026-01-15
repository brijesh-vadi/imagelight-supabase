import ManufacturerAddUnitModal from "@/components/role/manufacturer/view/units/ManufacturerAddUnitModal";
import ManufacturerUnitTable from "@/components/role/manufacturer/view/units/ManufacturerUnitTable";

const ManufacturerUnitsPage = async () => {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 border-b pb-3 md:pb-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-xl md:text-2xl text-primary">
            Units
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm mt-1">
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
