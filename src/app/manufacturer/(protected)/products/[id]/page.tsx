import Link from "next/link";
import ManufacturerProductDetailsView from "@/components/role/manufacturer/view/products/ManufacturerProductDetailsView";
import { Button } from "@/components/ui/button";
import BackButton from "@/components/widgets/BackButton";

interface Props {
  params: Promise<{ id: string }>;
}

const ManufacturerProductDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

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
              Review product information, pricing, stock status, and manage
              availability from one place.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href={`/manufacturer/products?update-id=${id}`}>
            Update Product
          </Link>
        </Button>
      </div>

      <ManufacturerProductDetailsView productId={id} />
    </div>
  );
};

export default ManufacturerProductDetailsPage;
