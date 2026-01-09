"use client";

import Image from "next/image";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import BackButton from "@/components/widgets/BackButton";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/types";
import DealerOrderItemActionDropdown from "./DealerOrderItemActionDropdown";

interface Props {
  order: Order;
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

const DealerOrderDetailsView = ({ order }: Props) => {
  const router = useRouter();
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = () => {
    setSelectedItemId(null); // Clear item ID to indicate full order cancellation
    setShowCancelDialog(true);
  };

  const handleCancelItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setShowCancelDialog(true);
  };

  const confirmCancel = async () => {
    setIsCancelling(true);
    try {
      let result;

      if (selectedItemId) {
        // Cancel individual item
        result = await cancelOrderItem(selectedItemId);
      } else {
        // Cancel entire order
        result = await cancelOrder(order.id);
      }

      if (result.success) {
        toast.success(result.message);
        setShowCancelDialog(false);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <div>
            <h1 className="font-semibold text-2xl text-primary">
              Order Details
            </h1>
            <p className="text-muted-foreground text-sm">
              Review order information placed by the you, including items,
              quantities, and status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order.status === "PENDING" && (
            <Button variant="destructive" onClick={handleCancelOrder}>
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card className="p-0 gap-0 overflow-hidden">
            <CardHeader className="p-4 bg-secondary text-center gap-0">
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-muted-foreground font-normal">
                    Order Number
                  </Label>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-normal">
                    Invoice Number
                  </Label>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-normal">
                    Order Date
                  </Label>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground font-normal">
                    Last Updated
                  </Label>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
              </div>

              <Separator />

              <div className="w-full space-y-1">
                <Label className="text-muted-foreground font-normal">
                  Shipping Address
                </Label>
                <p className="font-medium">{order.shipping_address}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Payment Status
                  </p>
                  <Badge
                    className={getPaymentStatusColor(order.payment_status)}
                  >
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="p-0 gap-0 overflow-hidden">
            <CardHeader className="p-4 bg-secondary text-center gap-0">
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id}>
                    <div
                      className={`flex items-center gap-4 ${item.status === "CANCELLED" ? "opacity-60" : ""}`}
                    >
                      {item.product && (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border">
                          <Image
                            src={item.product.primary_image}
                            alt={item.product.name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div className="w-full">
                            <div className="flex items-center gap-2">
                              <h3 className="font-semibold">
                                {item.product?.name || "Product"}
                              </h3>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              SKU: {item.product?.sku}
                            </p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className="text-sm">
                                Quantity:{" "}
                                <span className="font-medium">
                                  {item.quantity}
                                </span>
                              </span>
                              <span className="text-sm">
                                Price:{" "}
                                <span className="font-medium">
                                  {formatPrice(item.price)}
                                </span>
                              </span>
                              <span className="text-sm">
                                Subtotal:{" "}
                                <span
                                  className={`font-semibold text-primary ${item.status === "CANCELLED" ? "line-through" : ""}`}
                                >
                                  {formatPrice(item.subtotal)}
                                </span>
                              </span>
                            </div>
                          </div>
                          {item.status !== "CANCELLED" &&
                            order.status !== "CANCELLED" &&
                            order.status !== "DELIVERED" &&
                            order.status !== "REJECTED" && (
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
                      </div>
                      {item.status === "CANCELLED" && (
                        <Badge variant="destructive" className="text-xs">
                          {item.cancelled_by === "MANUFACTURER"
                            ? `Cancelled By ${order.manufacturer?.company_name}`
                            : "Cancelled By You"}
                        </Badge>
                      )}
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="p-0 gap-0  overflow-hidden">
            <CardHeader className="p-4 bg-secondary text-center gap-0">
              <CardTitle>Notes</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              {order.notes ? (
                <p className="text-sm whitespace-pre-line">{order.notes}</p>
              ) : (
                <p className="text-sm whitespace-pre-line text-muted-foreground mx-auto w-fit">
                  No notes added by you
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Manufacturer Info */}
          {order.manufacturer && (
            <Card className="p-0 gap-0  overflow-hidden">
              <CardHeader className="p-4 bg-secondary text-center gap-0">
                <CardTitle>Manufacturer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
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
                    <p className="font-semibold">
                      {order.manufacturer.company_name}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium">{order.manufacturer.email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Mobile</Label>
                    <p className="font-medium">{order.manufacturer.email}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">GST Number</Label>
                    <p className="font-medium">
                      {order.manufacturer.gst_number}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">City</Label>
                    <p className="font-medium">{order.manufacturer.city}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">State</Label>
                    <p className="font-medium">{order.manufacturer.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card className="p-0 gap-0  overflow-hidden">
            <CardHeader className="p-4 bg-secondary text-center gap-0">
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">
                    {order.order_items?.length || 0}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-lg">Total</span>
                <span className="font-semibold text-xl text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

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
              Confirm {isCancelling && <Spinner />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DealerOrderDetailsView;
