import { notFound } from "next/navigation";
import { getManufacturerProductById } from "@/actions/manufacturer/product.action";
import ManufacturerProductDetailsView from "@/components/role/manufacturer/view/products/ManufacturerProductDetailsView";
import BackButton from "@/components/widgets/BackButton";

interface Props {
  params: Promise<{ id: string }>;
}

const ManufacturerProductDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  const { data: product } = await getManufacturerProductById(id);

  if (!product) notFound();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 border-b pb-4">
        <BackButton />
        <div>
          <h1 className="font-semibold text-2xl text-primary">
            Product Overview
          </h1>
          <p className="text-muted-foreground text-sm">
            Review product information, pricing, stock status, and manage
            availability from one place.
          </p>
        </div>
      </div>

      <ManufacturerProductDetailsView product={product} />
    </div>
  );
};

export default ManufacturerProductDetailsPage;
