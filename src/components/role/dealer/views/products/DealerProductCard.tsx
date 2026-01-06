"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/actions/dealer/cart.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/widgets/EmblaCarousel";
import { useCart } from "@/lib/react-query/hooks/useCart";
import { formatPrice, shortenText } from "@/lib/utils";
import type { Product } from "@/types";

interface ProductCardProps {
  product: Product;
}

const DealerProductCard = ({ product }: ProductCardProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data: cartItems, refetch } = useCart();

  const allImages = [product.primary_image, ...(product.images ?? [])];

  const cartItem = cartItems?.find((item) => item.product_id === product.id);
  const isInCart = !!cartItem;
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const result = await addToCart(product.id, 1);
      if (result.success) {
        toast.success(result.message);
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleUpdateQuantity = async (newQuantity: number) => {
    if (!cartItem) return;

    if (newQuantity < 1) {
      setIsUpdating(true);
      try {
        const result = await removeFromCart(cartItem.id);
        if (result.success) {
          toast.success("Removed from cart");
          refetch();
        } else {
          toast.error(result.message);
        }
      } catch (error) {
        toast.error("Failed to remove from cart");
      } finally {
        setIsUpdating(false);
      }
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateCartItemQuantity(cartItem.id, newQuantity);
      if (result.success) {
        refetch();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update quantity");
    } finally {
      setIsUpdating(false);
    }
  };

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
          {/*<ProductActionDropdown
              onDetail={() =>
                router.push(`/manufacturer/products/${product?.id}`)
              }
              onUpdate={() =>
                router.push(`/manufacturer/products?update-id=${product?.id}`)
              }
              onDelete={() => setProductToDelete(product)}
            />*/}
        </div>

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
          <span className="text-muted-foreground text-sm">{product.stock}</span>
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
          <Badge variant="secondary">
            <span className="text-xs">{product.category?.name}</span>
          </Badge>
        </div>

        {/* Add to Cart or Quantity Controls */}
        {!isInCart ? (
          <Button
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            className="w-fit mx-auto"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            Add To Cart {isAddingToCart && <Spinner className="w-4 h-4" />}
          </Button>
        ) : (
          <div className="flex items-center justify-between gap-2 bg-primary px-3 py-1 rounded-md w-1/2 mx-auto h-9">
            <Button
              variant="secondary"
              size="icon"
              onClick={() => handleUpdateQuantity(currentQuantity - 1)}
              disabled={isUpdating}
              className="h-5 w-5 rounded-full"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="font-semibold text-base text-white">
              {currentQuantity}
            </span>
            <Button
              variant="secondary"
              size="icon"
              onClick={() => handleUpdateQuantity(currentQuantity + 1)}
              disabled={isUpdating}
              className="h-5 w-5 rounded-full"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DealerProductCard;
