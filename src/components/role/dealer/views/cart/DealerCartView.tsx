"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  type CartItem,
  clearCart,
  removeFromCart,
  updateCartItemQuantity,
} from "@/actions/dealer/cart.action";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { formatPrice } from "@/lib/utils";

interface Props {
  initialCartItems: CartItem[];
}

const DealerCartView = ({ initialCartItems }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [cartItems, setCartItems] = useState(initialCartItems);
  const [showClearDialog, setShowClearDialog] = useState(false);
  const [itemToRemove, setItemToRemove] = useState<string | null>(null);

  const updateQuantityMutation = useMutation({
    mutationFn: ({
      cartItemId,
      quantity,
    }: {
      cartItemId: string;
      quantity: number;
    }) => updateCartItemQuantity(cartItemId, quantity),
    onSuccess: (result, variables) => {
      if (result.success) {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === variables.cartItemId
              ? { ...item, quantity: variables.quantity }
              : item,
          ),
        );
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        router.refresh();
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to update quantity");
    },
  });

  const removeItemMutation = useMutation({
    mutationFn: (cartItemId: string) => removeFromCart(cartItemId),
    onSuccess: (result, cartItemId) => {
      if (result.success) {
        setCartItems((prev) => prev.filter((item) => item.id !== cartItemId));
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        setItemToRemove(null);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to remove item");
      setItemToRemove(null);
    },
  });

  const clearCartMutation = useMutation({
    mutationFn: () => clearCart(),
    onSuccess: (result) => {
      if (result.success) {
        setCartItems([]);
        toast.success(result.message);
        queryClient.invalidateQueries({ queryKey: ["cart"] });
        setShowClearDialog(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    },
    onError: () => {
      toast.error("Failed to clear cart");
    },
  });

  const handleUpdateQuantity = (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateQuantityMutation.mutate({ cartItemId, quantity: newQuantity });
  };

  const handleRemoveItem = () => {
    if (itemToRemove) {
      removeItemMutation.mutate(itemToRemove);
    }
  };

  const handleClearCart = () => {
    clearCartMutation.mutate();
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + item.product.dealer_price * item.quantity;
    }, 0);
  };

  const calculateItemTotal = (item: CartItem) => {
    return item.product.dealer_price * item.quantity;
  };

  if (cartItems.length === 0) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="border-b pb-4">
          <h1 className="font-semibold text-2xl text-primary">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm">
            Review and manage items in your cart
          </p>
        </div>

        {/* Empty State */}
        <Card className="shadow-none border-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">Your cart is empty</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Add products to your cart to get started
            </p>
            <Button onClick={() => router.push("/dealer/products")}>
              Browse Products
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm">
            {cartItems.length} {cartItems.length === 1 ? "item" : "items"} in
            your cart
          </p>
        </div>
        <Button onClick={() => setShowClearDialog(true)}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <Card key={item.id}>
              <CardContent className="">
                <div className="flex gap-4">
                  {/* Product Image */}
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={item.product.primary_image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg line-clamp-1">
                          {item.product.name}
                        </h3>
                        <p className="text-muted-foreground text-sm line-clamp-2 mt-1">
                          {item.product.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm text-muted-foreground">
                            SKU: {item.product.sku}
                          </span>
                          {item.product.category && (
                            <span className="text-sm text-muted-foreground">
                              Category: {item.product.category.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setItemToRemove(item.id)}
                        disabled={
                          removeItemMutation.isPending ||
                          updateQuantityMutation.isPending
                        }
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>

                    <Separator className="my-3" />

                    {/* Price and Quantity */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Price:
                        </span>
                        <span className="font-semibold">
                          {formatPrice(item.product.dealer_price)}
                        </span>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2">
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity - 1)
                          }
                          disabled={
                            item.quantity <= 1 ||
                            updateQuantityMutation.isPending
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          size="icon"
                          className="h-8 w-8 rounded-full"
                          onClick={() =>
                            handleUpdateQuantity(item.id, item.quantity + 1)
                          }
                          disabled={updateQuantityMutation.isPending}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          Total:
                        </span>
                        <span className="font-semibold text-lg">
                          {formatPrice(calculateItemTotal(item))}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card className="sticky top-4 p-0">
            <CardContent className="p-4 space-y-4">
              <h2 className="font-semibold text-xl">Order Summary</h2>
              <Separator />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">
                    {formatPrice(calculateTotal())}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">{cartItems.length}</span>
                </div>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-semibold text-xl text-primary">
                  {formatPrice(calculateTotal())}
                </span>
              </div>

              <Button className="w-full" size="lg">
                Proceed to Checkout
              </Button>

              <Button
                variant="outline"
                className="w-full"
                onClick={() => router.push("/dealer/products")}
              >
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Clear Cart Dialog */}
      <AlertDialog open={showClearDialog} onOpenChange={setShowClearDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear Cart?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove all items from your cart. This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={clearCartMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearCart}
              disabled={clearCartMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Clear Cart {clearCartMutation.isPending && <Spinner />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Remove Item Dialog */}
      <AlertDialog
        open={itemToRemove !== null}
        onOpenChange={(open) => !open && setItemToRemove(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Item?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove this item from your cart?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={removeItemMutation.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveItem}
              disabled={removeItemMutation.isPending}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Remove {removeItemMutation.isPending && <Spinner />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DealerCartView;
