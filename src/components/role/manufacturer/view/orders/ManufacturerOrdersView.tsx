"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  cancelManufacturerOrder,
  cancelManufacturerOrderItem,
} from "@/actions/manufacturer/order.action";
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
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/types";
import ManufacturerOrderActionsDropdown from "./ManufacturerOrderActionsDropdown";
import ManufacturerOrderItemActionDropdown from "./ManufacturerOrderItemActionDropdown";

interface Props {
  orders: Order[];
}

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

const ManufacturerOrdersView = ({ orders }: Props) => {
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
      let result;

      if (selectedItemId) {
        result = await cancelManufacturerOrderItem(selectedItemId);
      } else if (selectedOrderId) {
        result = await cancelManufacturerOrder(selectedOrderId);
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

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden p-0 flex flex-col">
          <CardContent className="p-0 flex flex-col flex-1">
            {/* Dealer Info */}
            {order.dealer && (
              <div className="bg-muted p-3 md:p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 md:gap-3">
                  <Avatar className="h-8 w-8 md:h-10 md:w-10 border">
                    <AvatarImage
                      src={order?.dealer?.company_logo}
                      alt={order?.dealer?.company_name}
                    />
                    <AvatarFallback className="text-xs md:text-sm">
                      {order?.dealer?.company_name[0]}
                      {order?.dealer?.company_name[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">Dealer</p>
                    <p className="font-semibold text-sm md:text-base">
                      {order?.dealer?.company_name}
                    </p>
                  </div>
                </div>
                <ManufacturerOrderActionsDropdown
                  onDetail={() =>
                    router.push(`/manufacturer/orders/${order.id}`)
                  }
                  onCancel={
                    order.status !== "CANCELLED" &&
                    order.status !== "DELIVERED" &&
                    order.status !== "REJECTED"
                      ? () => handleCancelOrder(order.id)
                      : undefined
                  }
                />
              </div>
            )}

            {/* Order Items - Show only first item */}
            {order.order_items && order.order_items.length > 0 && (
              <div className="p-3 md:p-4 space-y-3 flex-1">
                <div className="flex flex-row items-center justify-between gap-2">
                  <p className="text-xs md:text-sm font-medium">
                    Order Items ({order.order_items.length})
                  </p>
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getOrderStatusColor(order.status)} text-xs`}
                    >
                      {order.status}
                    </Badge>
                    <Badge
                      className={`${getPaymentStatusColor(order.payment_status)} text-xs`}
                    >
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-3 max-h-45 overflow-y-auto">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex flex-col gap-2  md:flex-row md:items-center md:gap-4 p-2 md:p-3 rounded-lg ${
                        item.status === "CANCELLED"
                          ? "bg-muted/30 opacity-60"
                          : "bg-muted/50"
                      }`}
                    >
                      {/* Mobile: Image + Name row */}
                      <div className="flex items-center gap-3 md:hidden">
                        {/* Product Image - Mobile only */}
                        {item.product && (
                          <div className="w-16 h-16 shrink-0 relative">
                            <div className="relative aspect-square overflow-hidden rounded border bg-background">
                              <Image
                                src={item.product.primary_image}
                                alt={item.product.name}
                                fill
                                priority
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                          </div>
                        )}

                        {/* Mobile: Product Name + Action */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="font-semibold text-sm line-clamp-2">
                              {item.product?.name}
                            </h4>
                            {item.status !== "CANCELLED" &&
                              order.status !== "PENDING" &&
                              order.status !== "CANCELLED" &&
                              order.status !== "DELIVERED" &&
                              order.status !== "REJECTED" && (
                                <ManufacturerOrderItemActionDropdown
                                  onCancel={() => handleCancelItem(item.id)}
                                  onDetail={() =>
                                    router.push(
                                      `/manufacturer/products/${item.product?.id}`,
                                    )
                                  }
                                />
                              )}
                          </div>
                          {item.status === "CANCELLED" && (
                            <Badge
                              variant="destructive"
                              className="text-xs mt-1"
                            >
                              {item.cancelled_by === "DEALER"
                                ? `Cancelled by ${order.dealer?.company_name}`
                                : "Cancelled by you"}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Desktop: Product Images Carousel */}
                      {item.product && (
                        <div className="hidden md:block w-32 shrink-0 relative">
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

                      {/* Mobile: Details row */}
                      <div className="flex items-center justify-between gap-2 text-xs md:hidden">
                        <span className="font-medium">
                          Qty:{" "}
                          <span className="text-muted-foreground">
                            {item.quantity}
                          </span>
                        </span>
                        <span className="font-medium">
                          Price:{" "}
                          <span className="text-muted-foreground">
                            {formatPrice(item.price)}
                          </span>
                        </span>
                        <span className="font-medium">
                          Subtotal:{" "}
                          <span className="text-muted-foreground">
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

                      {/* Desktop: Product Details */}
                      <div className="hidden md:flex flex-1 flex-col min-w-0 gap-2 w-full">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <h4 className="font-semibold text-base">
                              {item.product?.name}
                            </h4>
                          </div>
                          {item.status !== "CANCELLED" &&
                            order.status !== "PENDING" &&
                            order.status !== "CANCELLED" &&
                            order.status !== "DELIVERED" &&
                            order.status !== "REJECTED" && (
                              <ManufacturerOrderItemActionDropdown
                                onCancel={() => handleCancelItem(item.id)}
                                onDetail={() =>
                                  router.push(
                                    `/manufacturer/products/${item.product?.id}`,
                                  )
                                }
                              />
                            )}
                        </div>
                        <div className="flex items-center justify-between">
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
                          {item.status === "CANCELLED" && (
                            <Badge
                              variant="destructive"
                              className="text-xs shrink-0 hidden md:inline-flex"
                            >
                              {item.cancelled_by === "DEALER"
                                ? `Cancelled by ${order.dealer?.company_name}`
                                : "Cancelled by you"}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-3 md:p-4 bg-muted/50 mt-auto">
              <div className="grid grid-cols-2 md:flex md:items-center md:justify-between gap-3 md:gap-0 md:h-10">
                <div>
                  <p className="text-xs text-muted-foreground">Order Number</p>
                  <p className="font-semibold text-xs md:text-sm">
                    {order.order_number}
                  </p>
                </div>
                <Separator orientation="vertical" className="hidden md:block" />
                <div>
                  <p className="text-xs text-muted-foreground">
                    Invoice Number
                  </p>
                  <p className="font-semibold text-xs md:text-sm">
                    {order.invoice_number}
                  </p>
                </div>
                <Separator orientation="vertical" className="hidden md:block" />
                <div>
                  <p className="text-xs text-muted-foreground">Order Date</p>
                  <p className="font-semibold text-xs md:text-sm">
                    {formatDate(order.created_at)}
                  </p>
                </div>
                <Separator orientation="vertical" className="hidden md:block" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-semibold text-xs md:text-sm text-primary">
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
          <AlertDialogHeader className="gap-1">
            <AlertDialogTitle className="text-left">
              {selectedItemId ? "Cancel Order Item?" : "Cancel Order?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-left">
              {selectedItemId
                ? "Are you sure you want to cancel this item? The order total will be recalculated. If this is the last item, the entire order will be rejected."
                : "Are you sure you want to cancel this order? The order status will be changed to REJECTED."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex flex-row items-center! justify-end! w-full ">
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

export default ManufacturerOrdersView;
