import { getUnits } from "@/actions/manufacturer/unit.action";
import ManufacturerAddUnitModal from "@/components/role/manufacturer/view/units/ManufacturerAddUnitModal";
import ManufacturerUnitTable from "@/components/role/manufacturer/view/units/ManufacturerUnitTable";

const ManufacturerUnitsPage = async () => {
  const units = await getUnits();
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

      {/* table */}
      {units.data?.length === 0 ? (
        <p className="text-center font-medium">No units found.</p>
      ) : (
        <ManufacturerUnitTable units={units.data || []} />
      )}
    </div>
  );
};

export default ManufacturerUnitsPage;
