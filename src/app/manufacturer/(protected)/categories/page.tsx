import { getCategories } from "@/actions/manufacturer/category.action";
import ManufacturerAddCategoryModal from "@/components/role/manufacturer/view/categories/ManufacturerAddCategoryModal";
import ManufacturerCategoriesTable from "@/components/role/manufacturer/view/categories/ManufacturerCategoriesTable";

export const dynamic = "force-dynamic";

const ManufacturerCategoriesPage = async () => {
  const { data: categories } = await getCategories();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="">
          <h1 className="font-semibold text-2xl text-primary">Categories</h1>
          <p className="text-muted-foreground text-sm">
            Manage product categories to organize your inventory
          </p>
        </div>
        <ManufacturerAddCategoryModal />
      </div>

      {/* table */}
      {categories?.length === 0 ? (
        <p className="text-center font-medium">No categories found.</p>
      ) : (
        <ManufacturerCategoriesTable categories={categories || []} />
      )}
    </div>
  );
};

export default ManufacturerCategoriesPage;
