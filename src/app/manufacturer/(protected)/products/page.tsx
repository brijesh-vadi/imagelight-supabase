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

const LIMIT = 12;

const ManufacturerProductsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const search = params.search || "";
  const isAddMode = params["add-product"] !== undefined;
  const updateId = params["update-id"];

  if (isAddMode || updateId) {
    return (
      <div className="space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 md:gap-4 border-b pb-3 md:pb-4">
          <BackButton />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-xl md:text-2xl text-primary">
              {updateId ? "Update Product" : "Add Product"}
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              {updateId
                ? "Update your product details, pricing, images, and category information."
                : "Create a new product by adding its details, pricing, images, and category information."}
            </p>
          </div>
        </div>
        {isAddMode && <ManufacturerAddProductForm />}
        {updateId && <ManufacturerUpdateProductForm productId={updateId} />}
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
