import { getAdminCategories } from "@/actions/admin/category.action";
import AdminAddCategoryModal from "@/components/role/admin/view/categories/AdminAddCategoryModal";
import AdminCategoriesView from "@/components/role/admin/view/categories/AdminCategoriesView";

export const dynamic = "force-dynamic";

const AdminCategoriesPage = async () => {
  const { data: categories } = await getAdminCategories();

  const parentCategories = categories?.filter(
    (cate) => cate.parent_id === null,
  );

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
        <AdminAddCategoryModal parentCategories={parentCategories || []} />
      </div>

      {/* table */}
      {categories?.length === 0 ? (
        <p className="text-center font-medium">No categories found.</p>
      ) : (
        <AdminCategoriesView categories={categories || []} />
      )}
    </div>
  );
};

export default AdminCategoriesPage;
