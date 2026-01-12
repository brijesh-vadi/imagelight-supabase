"use client";

import { Combobox } from "@/components/ui/combobox";
import { useUnits } from "@/hooks/manufacturer/useUnits";
import { useManufacturerUsedCategories } from "@/lib/react-query/hooks/useManufacturerUsedCategories";
import ProductSearchInput from "./ProductSearchInput";

interface Props {
  search: string;
  categoryId: string;
  unitId: string;
  isActive: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onUnitChange: (value: string) => void;
  onIsActiveChange: (value: string) => void;
}

export default function ProductFilters({
  search,
  categoryId,
  unitId,
  isActive,
  onSearchChange,
  onCategoryChange,
  onUnitChange,
  onIsActiveChange,
}: Props) {
  const { data: categories = [], isLoading: categoriesLoading } =
    useManufacturerUsedCategories();
  const { data: units = [], isLoading: unitsLoading } = useUnits();

  // Filter to show only child categories (exclude parent categories)
  const childCategories = categories.filter((cat) => cat.parent_id !== null);

  const categoryOptions = [
    { id: "", name: "All" },
    ...childCategories.map((cat) => ({ id: cat.id, name: cat.name })),
  ];

  const unitOptions = [
    { id: "", name: "All" },
    ...units.map((unit) => ({ id: unit.id, name: unit.name })),
  ];

  const statusOptions = [
    { id: "", name: "All" },
    { id: "true", name: "Active" },
    { id: "false", name: "Inactive" },
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

        <div className="w-40">
          <Combobox
            options={statusOptions}
            value={isActive}
            onValueChange={onIsActiveChange}
            placeholder="Status"
            searchPlaceholder="Search status..."
            emptyText="No status found."
            valueKey="id"
          />
        </div>
      </div>
    </div>
  );
}
