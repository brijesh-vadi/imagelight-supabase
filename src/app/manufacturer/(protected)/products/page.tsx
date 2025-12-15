import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

const ManufacturerProductsPage = async () => {
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

      {/* Products Grid */}
      {/*<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.data?.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            categories={categories.data || []}
            units={units.data || []}
          />
        ))}
      </div>*/}
    </div>
  );
};

export default ManufacturerProductsPage;
