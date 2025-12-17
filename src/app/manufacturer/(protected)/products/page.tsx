import Link from "next/link";
import { getManufacturerProducts } from "@/actions/manufacturer/product.action";
import ManufacturerProductsListView from "@/components/role/manufacturer/view/products/ManufacturerProductsListView";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

const LIMIT = 9;

const ManufacturerProductsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const page = Number(params.page ?? 1);

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
          <Link href="/manufacturer/products/add">Add Product</Link>
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
