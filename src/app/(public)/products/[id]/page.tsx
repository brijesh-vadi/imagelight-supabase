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

  const moreProductsResponse = product.manufacturer?.id
    ? await getProductsByManufacturer(product.manufacturer.id, product.id, 1, 8)
    : null;

  const moreProducts = moreProductsResponse?.data?.products ?? [];
  const totalPages = moreProductsResponse?.data?.totalPages ?? 0;

  return (
    <>
      {/* Header */}
      <div className="container mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xs sm:text-sm">
          <div className="bg-primary p-2 rounded-full">
            <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          Back to Products
        </Link>
      </div>

      {/* Product Detail */}
      <section className="py-0">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 md:gap-8 max-w-7xl mx-auto">
            {/* Left: Images */}
            <ProductImageGallery
              images={allImages}
              productName={product.name}
            />

            {/* Right: Product Info */}
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">
                  {product.name}
                </h1>
                {product.category && (
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <Badge variant="secondary" className="text-xs sm:text-sm">
                      {product.category.name}
                    </Badge>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <div className="flex items-baseline gap-2 mb-2">
                  <div className="flex flex-col gap-1">
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Retail Price
                    </span>
                    <span className="text-2xl sm:text-3xl font-bold text-primary">
                      {formatPrice(product.regular_price)}
                    </span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground italic">
                  Apply for dealership to see wholesale prices
                </p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-2 text-sm sm:text-base">
                  Description
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {product.description}
                </p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Stock
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {product.in_stock
                      ? `${product.stock} available`
                      : "Out of stock"}
                  </p>
                </div>
                <div>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Min. Order
                  </p>
                  <p className="font-medium text-sm sm:text-base">
                    {product.min_order_quantity} {product.unit?.name}
                  </p>
                </div>
              </div>

              <Separator />

              {product.manufacturer && (
                <div>
                  <h3 className="font-semibold mb-2 text-sm sm:text-base">
                    Manufacturer
                  </h3>
                  <div className="flex items-center gap-2 sm:gap-3">
                    {product.manufacturer.company_logo && (
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-full overflow-hidden bg-muted shrink-0">
                        <Image
                          src={product.manufacturer.company_logo}
                          alt={product.manufacturer.company_name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm sm:text-base">
                        {product.manufacturer.company_name}
                      </p>
                      {(product.manufacturer.city ||
                        product.manufacturer.state) && (
                        <p className="text-xs sm:text-sm text-muted-foreground">
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
                <Button
                  asChild
                  size="default"
                  className="w-full text-sm sm:text-base"
                >
                  <Link href="/dealer/sign-up">Apply for Dealership</Link>
                </Button>
                <p className="text-xs text-center text-muted-foreground px-2">
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
