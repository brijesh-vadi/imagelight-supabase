"use client";

import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  calculateSavingsPercentage,
  formatDate,
  formatPrice,
} from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  product: Product;
}

const ManufacturerProductDetailsView = ({ product }: Props) => {
  const allImages = [product.primary_image, ...(product.images ?? [])].filter(
    Boolean,
  );

  const isLowStock = product.stock > 0 && product.stock < 10;
  const isOutOfStock = !product.in_stock || product.stock === 0;

  return (
    <div className="flex items-start gap-10">
      {/* Image Gallery */}
      <div className="w-10/12 flex flex-col gap-6">
        <Carousel className="w-full">
          <CarouselContent>
            {allImages?.map((img, index) => (
              <CarouselItem key={index}>
                <div className="relative aspect-square w-full overflow-hidden rounded-md bg-muted">
                  <Image
                    src={img}
                    alt={`${product.name} - Image ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          {allImages.length > 1 && (
            <>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </>
          )}
        </Carousel>

        {/* Thumbnail previews (optional enhancement) */}
        {allImages.length > 1 && (
          <div className="grid grid-cols-4 gap-4">
            {allImages.map((img, index) => (
              <div
                key={index}
                className="relative aspect-square overflow-hidden rounded-md bg-muted cursor-pointer hover:opacity-80 transition"
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="(max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="space-y-8 w-full">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            {/* name */}
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>

            {/* description */}
            <div>
              <p className="text-muted-foreground leading-relaxed text-md">
                {product.description}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-muted rounded-md p-6 max-w-md w-full">
              <div className="flex items-center justify-between">
                {/* Regular Price - crossed out if dealer is lower */}
                <div className="text-center">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Regular Price
                  </Label>
                  <p className={"text-2xl font-semibold mt-1"}>
                    {formatPrice(product.regular_price)} / {product.unit?.name}
                  </p>
                </div>

                {/* Decorative separator with optional savings badge */}
                <div className="relative flex flex-col items-center">
                  {" "}
                  {/* ← Add "relative" here */}
                  <div className="flex h-16 items-center">
                    <Separator orientation="vertical" className="bg-border" />
                  </div>
                  {product.dealer_price < product.regular_price && (
                    <Badge
                      variant="secondary"
                      className="absolute mt-18 px-3 py-1 text-xs font-semibold bg-emerald-500 text-white"
                    >
                      Dealer Saves{" "}
                      {calculateSavingsPercentage(
                        product.regular_price,
                        product.dealer_price,
                      )}
                      %
                    </Badge>
                  )}
                </div>

                {/* Dealer Price - highlighted as primary */}
                <div className="text-center">
                  <Label className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Dealer Price
                  </Label>
                  <p className="text-2xl font-semibold text-primary mt-1">
                    {formatPrice(product.dealer_price)}/ {product.unit?.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mt-4">
              {isOutOfStock ? (
                <Badge variant="destructive" className="text-base px-4 py-1">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge variant="secondary" className="text-base px-4 py-1">
                  Only {product.stock} left
                </Badge>
              ) : (
                <Badge
                  variant="default"
                  className="text-base px-4 py-1 bg-green-600"
                >
                  In Stock
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <Card className="p-0 gap-0 overflow-hidden max-w-md w-full">
            <CardContent className="space-y-3 text-sm p-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between gap-4 font-medium">
                  <span>Unit</span>
                  <span className="text-muted-foreground">
                    {product.unit?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Category</span>
                  <span className="text-muted-foreground">
                    {product.category?.name}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>SKU</span>
                  <span className="text-muted-foreground">{product.sku}</span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Stock</span>
                  <span className="text-muted-foreground">{product.stock}</span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Minimum Order Qunatity</span>
                  <span className="text-muted-foreground">
                    {product.min_order_quantity}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Create At</span>
                  <span className="text-muted-foreground">
                    {formatDate(product.created_at)}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Updated At</span>
                  <span className="text-muted-foreground">
                    {formatDate(product.updated_at)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ManufacturerProductDetailsView;
