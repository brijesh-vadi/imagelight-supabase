"use client";

import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { deleteProduct } from "@/actions/manufacturer/product.action";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DeleteDialog } from "@/components/widgets/DeleteDialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/widgets/EmblaCarousel";
import { formatPrice, shortenText } from "@/lib/utils";
import type { Product } from "@/types";
import ProductActionDropdown from "./ProductActionDropdown";

interface ProductCardProps {
  product: Product;
}

const ManufacturerProductCard = ({ product }: ProductCardProps) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const allImages = [product.primary_image, ...(product.images ?? [])];

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;

    setIsDeleting(true);
    const response = await deleteProduct(productToDelete.id);
    setIsDeleting(false);

    if (response.success) {
      toast.success(response.message);
      setProductToDelete(null);
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } else {
      toast.error(response.message);
    }
  };

  return (
    <>
      <Card className="group overflow-hidden p-0 transition-all gap-4">
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
              {shortenText(product.name, 28)}
            </h3>
            <ProductActionDropdown
              onDetail={() =>
                router.push(`/manufacturer/products/${product?.id}`)
              }
              onUpdate={() =>
                router.push(`/manufacturer/products?update-id=${product?.id}`)
              }
              onDelete={() => setProductToDelete(product)}
            />
          </div>

          {/* Description */}
          <p className="line-clamp-2 text-muted-foreground text-xs">
            {shortenText(product.description, 75)}
          </p>

          {/* Dealer Price */}
          <div className="flex items-start gap-6 bg-muted p-2 rounded-md">
            {/* Dealer Price */}
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Dealer Price
              </Label>
              <span className="text-lg font-semibold">
                {formatPrice(product.dealer_price)}
              </span>
            </div>

            {/* Separator */}
            <Separator orientation="vertical" className="h-12" />

            {/* Regular Price */}
            <div className="flex flex-col gap-1 flex-1">
              <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                Regular Price
              </Label>
              <span className="text-lg font-semibold">
                {formatPrice(product.regular_price)}
              </span>
            </div>
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            <Label>Stock :</Label>
            <span className="text-muted-foreground text-sm">
              {product.stock}
            </span>
          </div>

          {/* Min.Order Quantity */}
          <div className="flex items-center gap-2">
            <Label>Min. order quantity :</Label>
            <span className="text-muted-foreground text-sm">
              {product.min_order_quantity}
            </span>
          </div>

          {/* Category */}
          <div className="flex items-center gap-2">
            <Label>Category :</Label>
            <div className="flex items-center gap-1">
              {product.category?.parent && (
                <>
                  <Badge variant="outline">
                    <span className="text-xs">
                      {product.category.parent.name}
                    </span>
                  </Badge>
                  <span className="text-muted-foreground">/</span>
                </>
              )}
              <Badge variant="secondary">
                <span className="text-xs">
                  {product.category?.name || "N/A"}
                </span>
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
      <DeleteDialog
        open={!!productToDelete}
        title={productToDelete?.name ?? ""}
        description="This action cannot be undone. This will permanently delete the product from the system."
        isDeleting={isDeleting}
        onConfirmAction={handleDeleteProduct}
        onCancelAction={() => setProductToDelete(null)}
      />
    </>
  );
};

export default ManufacturerProductCard;
