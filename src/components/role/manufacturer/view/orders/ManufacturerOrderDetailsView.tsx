"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import {
  acceptOrder,
  cancelManufacturerOrder,
  cancelManufacturerOrderItem,
  updateOrderStatus,
  updatePaymentStatus,
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import BackButton from "@/components/widgets/BackButton";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";
import ManufacturerOrderItemActionDropdown from "./ManufacturerOrderItemActionDropdown";

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

const ManufacturerOrderDetailsView = ({ order }: Props) => {
  const router = useRouter();
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isUpdatingPayment, setIsUpdatingPayment] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isAccepting, setIsAccepting] = useState(false);
  const [showAcceptDialog, setShowAcceptDialog] = useState(false);

  const handleAcceptOrder = () => {
    setShowAcceptDialog(true);
  };

  const confirmAcceptOrder = async () => {
    setIsAccepting(true);
    try {
      const result = await acceptOrder(order.id);
      if (result.success) {
        toast.success(result.message);
        setShowAcceptDialog(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to accept order");
    } finally {
      setIsAccepting(false);
    }
  };

  const handleUpdateOrderStatus = async (status: string) => {
    setIsUpdatingStatus(true);
    try {
      const result = await updateOrderStatus(order.id, status);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update order status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleUpdatePaymentStatus = async (paymentStatus: string) => {
    setIsUpdatingPayment(true);
    try {
      const result = await updatePaymentStatus(order.id, paymentStatus);
      if (result.success) {
        toast.success(result.message);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to update payment status");
    } finally {
      setIsUpdatingPayment(false);
    }
  };

  const handleCancelOrder = () => {
    setSelectedItemId(null);
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
        result = await cancelManufacturerOrderItem(selectedItemId);
      } else {
        result = await cancelManufacturerOrder(order.id);
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
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 border-b pb-3 md:pb-4">
        <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
          <BackButton />
          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-xl md:text-2xl text-primary">
              Order Details
            </h1>
            <p className="text-muted-foreground text-xs md:text-sm">
              Review order information placed by the dealer, including items,
              quantities, and status
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 w-fit mx-auto mt-2 sm:mt-0">
          {order.status === "PENDING" ? (
            <Button
              variant="default"
              onClick={handleAcceptOrder}
              size="sm"
              className="md:size-default"
            >
              Accept Order
            </Button>
          ) : (
            <Badge
              className={`${getOrderStatusColor(order.status)} text-xs md:text-sm`}
            >
              {order.status}
            </Badge>
          )}
          {order.status !== "CANCELLED" &&
            order.status !== "DELIVERED" &&
            order.status !== "REJECTED" && (
              <Button
                variant="destructive"
                onClick={handleCancelOrder}
                size="sm"
                className="md:size-default"
              >
                Reject Order
              </Button>
            )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Order Info */}
          <Card className="p-0 gap-0 overflow-hidden">
            <CardHeader className="p-3 md:p-4 bg-secondary text-center gap-0">
              <CardTitle className="text-sm md:text-base">
                Order Information
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4 flex flex-col gap-3 md:gap-4">
              <div className="grid grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
                <div className="space-y-1">
                  <Label className="text-muted-foreground font-normal">
                    Order Number
                  </Label>
                  <p className="font-medium">{order.order_number}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground font-normal">
                    Invoice Number
                  </Label>
                  <p className="font-medium">{order.invoice_number}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground font-normal">
                    Order Date
                  </Label>
                  <p className="font-medium">{formatDate(order.created_at)}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-muted-foreground font-normal">
                    Last Updated
                  </Label>
                  <p className="font-medium">{formatDate(order.updated_at)}</p>
                </div>
              </div>

              <Separator />

              <div className="w-full space-y-1 text-xs md:text-sm">
                <Label className="text-muted-foreground font-normal">
                  Shipping Address
                </Label>
                <p className="font-medium">{order.shipping_address}</p>
              </div>

              <Separator />

              {/* Status Updates */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground font-normal">
                    Order Status
                  </Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.status}
                      onValueChange={handleUpdateOrderStatus}
                      disabled={
                        order.status === "PENDING" ||
                        isUpdatingStatus ||
                        order.status === "CANCELLED" ||
                        order.status === "REJECTED" ||
                        order.status === "DELIVERED"
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PROCESSING">PROCESSING</SelectItem>
                        <SelectItem value="SHIPPED">SHIPPED</SelectItem>
                        <SelectItem value="DELIVERED">DELIVERED</SelectItem>
                      </SelectContent>
                    </Select>
                    {isUpdatingStatus && <Spinner className="w-4 h-4" />}
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-muted-foreground font-normal">
                    Payment Status
                  </Label>
                  <div className="flex items-center gap-2">
                    <Select
                      value={order.payment_status}
                      onValueChange={handleUpdatePaymentStatus}
                      disabled={
                        order.status === "PENDING" ||
                        isUpdatingPayment ||
                        order.status === "CANCELLED" ||
                        order.status === "REJECTED" ||
                        order.status === "DELIVERED"
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UNPAID">UNPAID</SelectItem>
                        <SelectItem value="PARTIALLY_PAID">
                          PARTIALLY PAID
                        </SelectItem>
                        <SelectItem value="PAID">PAID</SelectItem>
                        <SelectItem value="REFUNDED">REFUNDED</SelectItem>
                      </SelectContent>
                    </Select>
                    {isUpdatingPayment && <Spinner className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card className="p-0 gap-0 overflow-hidden">
            <CardHeader className="p-3 md:p-4 bg-secondary text-center gap-0">
              <CardTitle className="text-sm md:text-base">
                Order Items
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4">
              <div className="space-y-3 md:space-y-4">
                {order.order_items?.map((item, index) => (
                  <div key={item.id}>
                    <div
                      className={`flex flex-col gap-3 md:gap-4 ${item.status === "CANCELLED" ? "opacity-60" : ""}`}
                    >
                      {/* Mobile: Image + Product Name in Row */}
                      <div className="flex items-start gap-3 md:hidden">
                        {item.product && (
                          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded border">
                            <Image
                              src={item.product.primary_image}
                              alt={item.product.name}
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-2">
                          <h3 className="font-semibold text-sm">
                            {item.product?.name || "Product"}
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            SKU: {item.product?.sku}
                          </p>
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

                      {/* Desktop: Original Layout */}
                      <div className="hidden md:flex md:items-center gap-4">
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
                                <h3 className="font-semibold text-base">
                                  {item.product?.name || "Product"}
                                </h3>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                SKU: {item.product?.sku}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 mt-2 text-sm">
                                <span>
                                  Quantity:{" "}
                                  <span className="font-medium">
                                    {item.quantity}
                                  </span>
                                </span>
                                <span>
                                  Price:{" "}
                                  <span className="font-medium">
                                    {formatPrice(item.price)}
                                  </span>
                                </span>
                                <span>
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
                        </div>
                      </div>

                      {/* Mobile: Details in Row */}
                      <div className="flex flex-wrap items-center gap-2 text-xs md:hidden">
                        <span>
                          Quantity:{" "}
                          <span className="font-medium">{item.quantity}</span>
                        </span>
                        <span>
                          Price:{" "}
                          <span className="font-medium">
                            {formatPrice(item.price)}
                          </span>
                        </span>
                        <span>
                          Subtotal:{" "}
                          <span
                            className={`font-semibold text-primary ${item.status === "CANCELLED" ? "line-through" : ""}`}
                          >
                            {formatPrice(item.subtotal)}
                          </span>
                        </span>
                      </div>

                      {item.status === "CANCELLED" && (
                        <Badge variant="destructive" className="text-xs w-fit">
                          {item.cancelled_by === "DEALER"
                            ? `Cancelled By ${order.dealer?.company_name}`
                            : "Cancelled By You"}
                        </Badge>
                      )}
                    </div>
                    {index < (order.order_items?.length || 0) - 1 && (
                      <Separator className="mt-3 md:mt-4" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <Card className="p-0 gap-0 overflow-hidden">
            <CardHeader className="p-3 md:p-4 bg-secondary text-center gap-0">
              <CardTitle className="text-sm md:text-base">
                Notes From {order.dealer?.company_name}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-3 md:p-4">
              {order.notes ? (
                <p className="text-xs md:text-sm whitespace-pre-line">
                  {order.notes}
                </p>
              ) : (
                <p className="text-xs md:text-sm whitespace-pre-line text-muted-foreground mx-auto w-fit">
                  No notes from {order.dealer?.company_name}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-4 md:space-y-6">
          {/* Dealer Info */}
          {order.dealer && (
            <Card className="p-0 gap-0 overflow-hidden">
              <CardHeader className="p-3 md:p-4 bg-secondary text-center gap-0">
                <CardTitle className="text-sm md:text-base">
                  Dealer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 md:space-y-4 p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 md:h-12 md:w-12">
                    <AvatarImage
                      src={order.dealer.company_logo}
                      alt={order.dealer.company_name}
                    />
                    <AvatarFallback className="text-xs md:text-sm">
                      {order.dealer.company_name[0]}
                      {order.dealer.company_name[1]}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-semibold text-sm md:text-base">
                    {order.dealer.company_name}
                  </p>
                </div>
                <Separator />
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Email</Label>
                    <p className="font-medium text-right break-all">
                      {order.dealer.email}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">Mobile</Label>
                    <p className="font-medium">{order.dealer.mobile}</p>
                  </div>
                  {order.dealer.gst_number && (
                    <div className="flex items-center justify-between">
                      <Label className="text-muted-foreground">
                        GST Number
                      </Label>
                      <p className="font-medium">{order.dealer.gst_number}</p>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">City</Label>
                    <p className="font-medium">{order.dealer.city}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-muted-foreground">State</Label>
                    <p className="font-medium">{order.dealer.state}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card className="p-0 gap-0 overflow-hidden">
            <CardHeader className="p-3 md:p-4 bg-secondary text-center gap-0">
              <CardTitle className="text-sm md:text-base">
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4 p-3 md:p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs md:text-sm">
                  <span className="text-muted-foreground">Items</span>
                  <span className="font-medium">
                    {order.order_items?.length || 0}
                  </span>
                </div>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="font-semibold text-base md:text-lg">
                  Total
                </span>
                <span className="font-semibold text-lg md:text-xl text-primary">
                  {formatPrice(order.total_amount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Accept Order Dialog */}
      <AlertDialog open={showAcceptDialog} onOpenChange={setShowAcceptDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Accept Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Once accepted, you will be able to update order status, payment
              status, and cancel individual items if needed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isAccepting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmAcceptOrder}
              disabled={isAccepting}
            >
              Accept Order {isAccepting && <Spinner className="w-4 h-4" />}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Cancel Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedItemId ? "Cancel Order Item?" : "Cancel Order?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedItemId
                ? "Are you sure you want to cancel this item? The order total will be recalculated. If this is the last item, the entire order will be rejected."
                : "Are you sure you want to cancel this order? The order status will be changed to REJECTED."}
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

export default ManufacturerOrderDetailsView;
