"use client";

import ProductSearchInput from "@/components/role/manufacturer/view/products/ProductSearchInput";
import { Combobox } from "@/components/ui/combobox";
import { useCategories } from "@/lib/react-query/hooks/useCategories";
import { useUnits } from "@/lib/react-query/hooks/useUnits";

interface Props {
  search: string;
  categoryId: string;
  unitId: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onUnitChange: (value: string) => void;
}

const DealerProductFilters = ({
  search,
  categoryId,
  unitId,
  onSearchChange,
  onCategoryChange,
  onUnitChange,
}: Props) => {
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();
  const { data: units = [], isLoading: unitsLoading } = useUnits();

  const categoryOptions = [
    { id: "", name: "All" },
    ...categories.map((cat) => ({ id: cat.id, name: cat.name })),
  ];

  const unitOptions = [
    { id: "", name: "All" },
    ...units.map((unit) => ({ id: unit.id, name: unit.name })),
  ];

  return (
    <div className="flex items-center justify-between gap-4">
      {/* Search - takes more space */}
      <div className="flex-1 max-w-md">
        <ProductSearchInput value={search} onChange={onSearchChange} />
      </div>

      {/* Filters - equal width comboboxes */}
      <div className="flex items-center gap-2">
        <div className="w-52">
          <Combobox
            options={categoryOptions}
            value={categoryId}
            onValueChange={onCategoryChange}
            placeholder="Categories"
            searchPlaceholder="Search categories..."
            emptyText="No categories found."
            disabled={categoriesLoading}
            valueKey="id"
          />
        </div>

        <div className="w-52">
          <Combobox
            options={unitOptions}
            value={unitId}
            onValueChange={onUnitChange}
            placeholder="Units"
            searchPlaceholder="Search units..."
            emptyText="No units found."
            disabled={unitsLoading}
            valueKey="id"
          />
        </div>
      </div>
    </div>
  );
};
export default DealerProductFilters;
