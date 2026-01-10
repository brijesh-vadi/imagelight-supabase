import { notFound } from "next/navigation";
import { getAdminCategories } from "@/actions/admin/category.action";
import { getManufacturerProductById } from "@/actions/manufacturer/product.action";
import { getUnits } from "@/actions/manufacturer/unit.action";
import ManufacturerAddProductForm from "@/components/role/manufacturer/view/products/ManufacturerAddProductForm";
import ManufacturerProductsClient from "@/components/role/manufacturer/view/products/ManufacturerProductsClient";
import ManufacturerUpdateProductForm from "@/components/role/manufacturer/view/products/ManufacturerUpdateProductForm";
import BackButton from "@/components/widgets/BackButton";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
    "add-product"?: string;
    "update-id"?: string;
  }>;
}

const LIMIT = 9;

const ManufacturerProductsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const search = params.search || "";
  const isAddMode = params["add-product"] !== undefined;
  const updateId = params["update-id"];

  if (isAddMode || updateId) {
    const [units, categories] = await Promise.all([
      getUnits(),
      getAdminCategories(),
    ]);

    let product = null;
    if (updateId) {
      const { data: productData } = await getManufacturerProductById(updateId);
      if (!productData) notFound();
      product = productData;
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 border-b pb-4">
          <BackButton />
          <div>
            <h1 className="font-semibold text-2xl text-primary">
              {updateId ? "Update Product" : "Add Product"}
            </h1>
            <p className="text-muted-foreground text-sm">
              {updateId
                ? "Update your product details, pricing, images, and category information."
                : "Create a new product by adding its details, pricing, images, and category information."}
            </p>
          </div>
        </div>
        {isAddMode && (
          <ManufacturerAddProductForm
            categories={categories?.data ?? []}
            units={units?.data ?? []}
          />
        )}
        {updateId && (
          <ManufacturerUpdateProductForm
            product={product!}
            categories={categories?.data ?? []}
            units={units?.data ?? []}
          />
        )}
      </div>
    );
  }

  return (
    <ManufacturerProductsClient
      initialPage={page}
      initialSearch={search}
      limit={LIMIT}
    />
  );
};

export default ManufacturerProductsPage;
