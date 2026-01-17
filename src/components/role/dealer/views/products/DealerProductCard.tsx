"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/widgets/EmblaCarousel";
import { formatPrice, shortenText } from "@/lib/utils";
import type { Product } from "@/types";
import AddToCartButton from "./AddToCartButton";
import DealerProductActionDropdown from "./DealerProductActionDropdown";

interface ProductCardProps {
  product: Product;
}

const DealerProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const allImages = [product.primary_image, ...(product.images ?? [])];

  return (
    <Card className="group overflow-hidden p-0 transition-all gap-4 h-fit">
      <CardHeader className="gap-0 p-0 border-b pb-0!">
        <div className="group relative">
          <Carousel opts={{ loop: true }} className="w-full">
            <div className="relative aspect-video overflow-hidden bg-muted">
              <CarouselContent>
                {allImages.map((image, index) => (
                  <CarouselItem key={`${image}`}>
                    <div className="relative aspect-video overflow-hidden">
                      <Image
                        src={image}
                        alt={product.name}
                        fill
                        priority={index === 0}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {allImages.length > 1 && (
                <>
                  <CarouselPrevious className="-translate-y-1/2 absolute top-1/2 left-2 z-10 h-8 w-8 border-0 bg-white/80 text-black opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100" />
                  <CarouselNext className="-translate-y-1/2 absolute top-1/2 right-2 z-10 h-8 w-8 border-0 bg-white/80 text-black opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100" />
                </>
              )}
            </div>
          </Carousel>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4 flex flex-col gap-3">
        {/* Product Name */}
        <div className="flex items-center justify-between">
          <h3 className="line-clamp-2 font-semibold text-gray-900 text-xl leading-tight">
            {shortenText(product.name, 30)}
          </h3>
          <DealerProductActionDropdown
            onDetail={() => router.push(`/dealer/products/${product?.id}`)}
          />
        </div>

        {/* Manufacturer Info */}
        {product.manufacturer && (
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full border">
              <Avatar className="h-full w-full">
                <AvatarImage
                  src={product.manufacturer.company_logo}
                  alt={`${product?.manufacturer.company_name} logo`}
                  className="object-cover"
                />
                <AvatarFallback className="text-lg">
                  {product?.manufacturer.company_name?.[0]}
                  {product?.manufacturer.company_name?.[1]}
                </AvatarFallback>
              </Avatar>
            </div>
            <span className="text-sm text-muted-foreground">
              {product.manufacturer.company_name}
            </span>
          </div>
        )}

        {/* Dealer Price */}
        <div className="flex items-start gap-6 bg-muted p-2 rounded-md">
          {/* Dealer Price */}
          <div className="flex flex-col gap-1 flex-1">
            <Label className="text-muted-foreground text-xs font-medium w-fit mx-auto">
              Dealer Price
            </Label>
            <span className="text-lg font-semibold  text-center">
              {formatPrice(product.dealer_price)}
            </span>
          </div>

          {/* Separator */}
          <Separator orientation="vertical" className="h-12! bg-border" />

          {/* Retail Price */}
          <div className="flex flex-col gap-1 flex-1">
            <Label className="text-muted-foreground text-xs font-medium w-fit mx-auto">
              Retail Price
            </Label>
            <span className="text-lg font-semibold  text-center">
              {formatPrice(product.regular_price)}
            </span>
          </div>
        </div>

        {/* Add to Cart */}
        <AddToCartButton productId={product.id} variant="compact" />
      </CardContent>
    </Card>
  );
};

export default DealerProductCard;
