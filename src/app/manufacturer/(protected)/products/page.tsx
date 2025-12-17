import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories } from "@/actions/manufacturer/category.action";
import {
  getManufacturerProductById,
  getManufacturerProducts,
} from "@/actions/manufacturer/product.action";
import { getUnits } from "@/actions/manufacturer/unit.action";
import ManufacturerAddProductForm from "@/components/role/manufacturer/view/products/ManufacturerAddProductForm";
import ManufacturerProductsListView from "@/components/role/manufacturer/view/products/ManufacturerProductsListView";
import ManufacturerUpdateProductForm from "@/components/role/manufacturer/view/products/ManufacturerUpdateProductForm";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/widgets/BackButton";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    page?: string;
    "add-product"?: string;
    "update-id"?: string;
  }>;
}

const LIMIT = 9;

const ManufacturerProductsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const isAddMode = params["add-product"] !== undefined;
  const updateId = params["update-id"];

  if (isAddMode || updateId) {
    const [units, categories] = await Promise.all([
      getUnits(),
      getCategories(),
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

  const { data } = await getManufacturerProducts({
    page,
    limit: 9,
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage and organize all your products, including details, pricing,
            and categories.
          </p>
        </div>
        <Button asChild>
          <Link href="/manufacturer/products?add-product">Add Product</Link>
        </Button>
      </div>

      <ManufacturerProductsListView
        products={data?.products ?? []}
        total={data?.total ?? 0}
        page={page}
        limit={LIMIT}
      />
    </div>
  );
};

export default ManufacturerProductsPage;
