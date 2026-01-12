import AdminCategoriesView from "@/components/role/admin/view/categories/AdminCategoriesView";

export const dynamic = "force-dynamic";

const AdminCategoriesPage = async () => {
  return (
    <div className="space-y-6">
      <AdminCategoriesView />
    </div>
  );
};

export default AdminCategoriesPage;
