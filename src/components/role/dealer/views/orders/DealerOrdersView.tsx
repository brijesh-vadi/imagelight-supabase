"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { cancelOrder, cancelOrderItem } from "@/actions/dealer/order.action";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useDealerOrders } from "@/hooks/dealer/useDealerOrders";
import { formatDate, formatPrice } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/types";
import DealerOrderActionsDropdown from "./DealerOrderActionsDropdown";
import DealerOrderItemActionDropdown from "./DealerOrderItemActionDropdown";

const getOrderStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "PENDING":
      return "bg-yellow-500";
    case "PROCESSING":
      return "bg-blue-500";
    case "SHIPPED":
      return "bg-purple-500";
    case "DELIVERED":
      return "bg-green-500";
    case "CANCELLED":
      return "bg-gray-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

const getPaymentStatusColor = (status: PaymentStatus) => {
  switch (status) {
    case "PAID":
      return "bg-green-500";
    case "UNPAID":
      return "bg-red-500";
    case "PARTIALLY_PAID":
      return "bg-yellow-500";
    case "REFUNDED":
      return "bg-blue-500";
    case "CANCELLED":
      return "bg-gray-500";
    default:
      return "bg-gray-500";
  }
};

const DealerOrdersView = () => {
  const { data, isLoading, isError } = useDealerOrders();

  const orders = data?.data?.orders ?? [];

  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    setSelectedItemId(null);
    setShowCancelDialog(true);
  };

  const handleCancelItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setSelectedOrderId(null);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      let result: any;

      if (selectedItemId) {
        result = await cancelOrderItem(selectedItemId);
      } else if (selectedOrderId) {
        result = await cancelOrder(selectedOrderId);
      } else {
        return;
      }

      if (result.success) {
        toast.success(result.message);
        setShowCancelDialog(false);
        setSelectedOrderId(null);
        setSelectedItemId(null);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to cancel");
    } finally {
      setIsCancelling(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-175">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card className="shadow-none border-none">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-xl mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Start shopping to place your first order
            </p>
            <Button asChild>
              <Link href="/dealer/products">Browse Products</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-8">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden p-0">
          <CardContent className="p-0">
            {/* Manufacturer Info */}
            {order.manufacturer && (
              <div className="bg-muted p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={order.manufacturer.company_logo}
                      alt={order.manufacturer.company_name}
                    />
                    <AvatarFallback>
                      {order.manufacturer.company_name[0]}
                      {order.manufacturer.company_name[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Manufacturer
                    </p>
                    <p className="font-semibold">
                      {order.manufacturer.company_name}
                    </p>
                  </div>
                </div>
                <DealerOrderActionsDropdown
                  onDetail={() => router.push(`/dealer/orders/${order.id}`)}
                  onCancel={
                    order.status === "PENDING"
                      ? () => handleCancelOrder(order.id)
                      : undefined
                  }
                />
              </div>
            )}

            {/* Order Items with Carousel */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">
                    Order Items ({order.order_items.length})
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge className={getOrderStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                    <Badge
                      className={getPaymentStatusColor(order.payment_status)}
                    >
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 max-h-45 overflow-y-auto pr-2">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-3 rounded-lg ${
                        item.status === "CANCELLED"
                          ? "bg-muted/30 opacity-60"
                          : "bg-muted/50"
                      }`}
                    >
                      {/* Product Images Carousel */}
                      {item.product && (
                        <div className="w-32 shrink-0 relative">
                          <Carousel className="w-full">
                            <CarouselContent>
                              <CarouselItem>
                                <div className="relative aspect-square overflow-hidden rounded border bg-background">
                                  <Image
                                    src={item.product.primary_image}
                                    alt={item.product.name}
                                    fill
                                    priority
                                    sizes="128px"
                                    className="object-cover"
                                  />
                                </div>
                              </CarouselItem>
                              {item.product?.images?.map((image, index) => (
                                <CarouselItem key={index}>
                                  <div className="relative aspect-square overflow-hidden rounded border bg-background">
                                    <Image
                                      src={image}
                                      alt={`${item.product?.name} - ${index + 1}`}
                                      fill
                                      sizes="128px"
                                      className="object-cover"
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            {item.product?.images &&
                              item.product.images.length > 0 && (
                                <>
                                  <CarouselPrevious className="left-1" />
                                  <CarouselNext className="right-1" />
                                </>
                              )}
                          </Carousel>
                        </div>
                      )}

                      {/* Product Details */}
                      <div className="flex-1 flex flex-col min-w-0 gap-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <h4 className="font-semibold text-base line-clamp-1">
                              {item.product?.name}
                            </h4>
                          </div>
                          {item.status !== "CANCELLED" &&
                            order.status === "PENDING" && (
                              <DealerOrderItemActionDropdown
                                onCancel={() => handleCancelItem(item.id)}
                                onDetail={() =>
                                  router.push(
                                    `/dealer/products/${item.product?.id}`,
                                  )
                                }
                              />
                            )}
                        </div>
                        <div className="flex flex-col items-start gap-2">
                          <span className="text-sm font-medium flex items-center gap-1">
                            Qty :
                            <span className="text-muted-foreground">
                              {item.quantity}
                            </span>
                          </span>
                          <span className="text-sm font-medium flex items-center gap-1">
                            Price :
                            <span className="text-muted-foreground">
                              {formatPrice(item.price)}
                            </span>
                          </span>
                          <span className="text-sm font-medium flex items-center gap-1">
                            Subtotal :
                            <span className=" text-muted-foreground">
                              {item.status === "CANCELLED" ? (
                                <span className="line-through">
                                  {formatPrice(item.subtotal)}
                                </span>
                              ) : (
                                formatPrice(item.subtotal)
                              )}
                            </span>
                          </span>
                        </div>
                      </div>

                      {item.status === "CANCELLED" && (
                        <Badge
                          variant="destructive"
                          className="text-xs shrink-0"
                        >
                          {item.cancelled_by === "MANUFACTURER"
                            ? `Cancelled By ${order.manufacturer?.company_name}`
                            : "Cancelled By You"}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 bg-muted/50 flex justify-between items-center">
              <div className="flex items-center justify-between h-10 w-full">
                <div>
                  <p className="text-xs text-muted-foreground">Order Number</p>
                  <p className="font-semibold text-sm">{order.order_number}</p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="font-semibold text-sm">
                    {order.invoice_number}
                  </p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="font-semibold text-sm">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <Separator orientation="vertical" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-sm text-primary">
                    {formatPrice(order.total_amount)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedItemId ? "Cancel Order Item?" : "Cancel Order?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItemId
                ? "Are you sure you want to cancel this item? The order total will be recalculated. If this is the last item, the entire order will be cancelled."
                : "Are you sure you want to cancel this order? This action cannot be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmCancel}
              disabled={isCancelling}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Confirm {isCancelling && <Spinner className="w-4 h-4" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DealerOrdersView;
