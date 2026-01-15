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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b pb-3 md:pb-4">
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <BackButton />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-xl md:text-2xl text-primary">
              Product Overview
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Review product information, pricing, stock status, and manage
              availability from one place.
            </p>
          </div>
        </div>
        <Button asChild className="hidden shrink-0 sm:block">
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
