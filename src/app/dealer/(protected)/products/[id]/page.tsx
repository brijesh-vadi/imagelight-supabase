import { notFound } from "next/navigation";
import { getDealerProductById } from "@/actions/dealer/product.action";
import AddToCartButton from "@/components/role/dealer/views/products/AddToCartButton";
import DealerProductDetailsView from "@/components/role/dealer/views/products/DealerProductDetailsView";
import BackButton from "@/components/widgets/BackButton";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DealerProductDetailsPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const { data: product } = await getDealerProductById(id);

  const isOutOfStock = !product?.in_stock || product?.stock === 0;

  if (!product) notFound();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="font-semibold text-2xl text-primary">
              Product Overview
            </h1>
            <p className="text-muted-foreground text-sm">
              Review detailed product information, pricing, current stock
              status, and manage availability from one place.
            </p>
          </div>
        </div>
        <AddToCartButton
          productId={product.id}
          variant="default"
          disabled={isOutOfStock}
        />
      </div>

      <DealerProductDetailsView product={product} />
    </div>
  );
};

export default DealerProductDetailsPage;
