"use client";

import { Minus, Plus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import {
  addToCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/actions/dealer/cart.action";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCartItems } from "@/hooks/dealer/useCartItems";

interface AddToCartButtonProps {
  productId: string;
  variant?: "default" | "compact";
  disabled?: boolean;
}

const AddToCartButton = ({
  productId,
  variant = "default",
  disabled = false,
}: AddToCartButtonProps) => {
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { data, refetch } = useCartItems();

  const cartItems = data?.data;

  const cartItem = cartItems?.find((item) => item?.productId === productId);
  const isInCart = !!cartItem;
  const currentQuantity = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    try {
      const result = await addToCart(productId, 1);
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

  if (variant === "compact") {
    return !isInCart ? (
      <Button
        onClick={handleAddToCart}
        disabled={isAddingToCart || disabled}
        className="w-fit mx-auto"
      >
        <ShoppingCart className="h-4 w-4 mr-2" />
        Add To Cart {isAddingToCart && <Spinner className="w-4 h-4" />}
      </Button>
    ) : (
      <div className="flex items-center justify-between gap-10 bg-primary px-3 py-1 rounded-md mx-auto h-9">
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
    );
  }

  return (
    <div className="flex items-center gap-4">
      {!isInCart ? (
        <Button
          onClick={handleAddToCart}
          disabled={isAddingToCart || disabled}
          size="lg"
          className="w-fit"
        >
          <ShoppingCart className="h-5 w-5 mr-2" />
          Add To Cart {isAddingToCart && <Spinner className="w-4 h-4" />}
        </Button>
      ) : (
        <div className="flex items-center justify-between gap-2 bg-primary px-4 py-2 rounded-md w-fit h-10">
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleUpdateQuantity(currentQuantity - 1)}
            disabled={isUpdating}
            className="h-6 w-6 rounded-full"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="font-semibold text-lg text-white min-w-8 text-center">
            {currentQuantity}
          </span>
          <Button
            variant="secondary"
            size="icon"
            onClick={() => handleUpdateQuantity(currentQuantity + 1)}
            disabled={isUpdating}
            className="h-6 w-6 rounded-full"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default AddToCartButton;
