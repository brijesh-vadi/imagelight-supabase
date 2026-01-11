import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getProductsByManufacturer,
  getPublicProductById,
} from "@/actions/public/product.action";
import MoreFromManufacturer from "@/components/role/public/views/MoreFromManufacturer";
import ProductImageGallery from "@/components/role/public/views/ProductImageGallery";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const response = await getPublicProductById(id);

  if (!response.success || !response.data?.product) {
    notFound();
  }

  const product = response.data.product;
  const allImages = [product.primary_image, ...(product.images ?? [])].filter(
    Boolean,
  );

  // Fetch initial products from the same manufacturer
  const moreProductsResponse = product.manufacturer?.id
    ? await getProductsByManufacturer(product.manufacturer.id, product.id, 1, 8)
    : null;

  const moreProducts = moreProductsResponse?.data?.products ?? [];
  const totalPages = moreProductsResponse?.data?.totalPages ?? 0;

  return (
    <>
      {/* Header */}
      <div className="container mx-auto p-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Products
        </Link>
      </div>

      {/* Product Detail */}
      <section className="py-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
            {/* Left: Images */}
            <ProductImageGallery
              images={allImages}
              productName={product.name}
            />

            {/* Right: Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                {product.category && (
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="secondary">{product.category.name}</Badge>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm text-muted-foreground">
                      Retail Price
                    </span>
                    <span className="text-3xl font-bold text-primary">
                      {formatPrice(product.regular_price)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground italic">
                  Apply for dealership to see wholesale prices
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Stock</p>
                  <p className="font-medium">
                    {product.in_stock
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">
                    Min. Order
                  </p>
                  <p className="font-medium">
                    {product.min_order_quantity} {product.unit?.name}
                  </p>
                </div>
              </div>

              <Separator />

              {product.manufacturer && (
                <div>
                  <h3 className="font-semibold mb-2">Manufacturer</h3>
                  <div className="flex items-center gap-3">
                    {product.manufacturer.company_logo && (
                      <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted">
                        <Image
                          src={product.manufacturer.company_logo}
                          alt={product.manufacturer.company_name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">
                        {product.manufacturer.company_name}
                      </p>
                      {(product.manufacturer.city ||
                        product.manufacturer.state) && (
                        <p className="text-sm text-muted-foreground">
                          {[
                            product.manufacturer.city,
                            product.manufacturer.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <Separator />

              <div className="space-y-3">
                <Button asChild size="lg" className="w-full">
                  <Link href="/dealer/sign-up">Apply for Dealership</Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground">
                  Get verified as a dealer to place bulk orders at wholesale
                  prices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* More from Manufacturer */}
      {product.manufacturer && moreProducts.length > 0 && (
        <MoreFromManufacturer
          initialProducts={moreProducts}
          manufacturerId={product.manufacturer.id}
          excludeProductId={product.id}
          manufacturerName={product.manufacturer.company_name}
          initialTotalPages={totalPages}
        />
      )}
    </>
  );
}
