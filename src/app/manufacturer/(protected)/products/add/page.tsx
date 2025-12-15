import { getCategories } from "@/actions/manufacturer/category.action";
import { getUnits } from "@/actions/manufacturer/unit.action";
import ManufacturerAddProductForm from "@/components/role/manufacturer/view/products/ManufacturerAddProductForm";
import BackButton from "@/components/widgets/BackButton";

export const dynamic = "force-dynamic";

const ManufacturerAddProductPage = async () => {
  const [units, categories] = await Promise.all([getUnits(), getCategories()]);
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <BackButton />
        <div>
          <h1 className="font-semibold text-2xl text-primary">Add Product</h1>
          <p className="text-muted-foreground text-sm">
            Create a new product by adding its details, pricing, images, and
            category information.
          </p>
        </div>
      </div>
      <ManufacturerAddProductForm
        categories={categories?.data ?? []}
        units={units?.data ?? []}
      />
    </div>
  );
};

export default ManufacturerAddProductPage;
