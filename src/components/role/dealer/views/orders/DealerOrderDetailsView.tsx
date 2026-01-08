"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cancelOrder } from "@/actions/dealer/order.action";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

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
  const [isCancelling, setIsCancelling] = useState(false);

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const result = await cancelOrder(order.id);
      if (result.success) {
        toast.success(result.message);
        setShowCancelDialog(false);
        router.refresh();
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/dealer/orders")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-semibold text-2xl text-primary">
              Order Details
            </h1>
            <p className="text-muted-foreground text-sm">
              Order #{order.order_number}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {order.status === "PENDING" && (
            <Button
              variant="destructive"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel Order
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Info */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Order Number</p>
                  <p className="font-semibold">{order.order_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Invoice Number</p>
                  <p className="font-semibold">{order.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Date</p>
                  <p className="font-semibold">{formatDate(order.created_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Last Updated</p>
                  <p className="font-semibold">{formatDate(order.updated_at)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Order Status</p>
                  <Badge className={getOrderStatusColor(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Payment Status</p>
                  <Badge className={getPaymentStatusColor(order.payment_status)}>
                    {order.payment_status}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Order Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {order.order_items?.map((item) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      {item.product && (
                        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded border">
                          <Image
                            src={item.product.primary_image}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold">
                          {item.product?.name || "Product"}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.product?.sku}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            Quantity: <span className="font-medium">{item.quantity}</span>
                          </span>
                          <span className="text-sm">
                            Price: <span className="font-medium">{formatPrice(item.price)}</span>
                          </span>
                          <span className="text-sm">
                            Subtotal:{" "}
                            <span className="font-semibold text-primary">
                              {formatPrice(item.subtotal)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Addresses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">
                  {order.shipping_address || "N/A"}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Billing Address</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">
                  {order.billing_address || "N/A"}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Notes */}
          {order.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm whitespace-pre-line">{order.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Manufacturer Info */}
          {order.manufacturer && (
            <Card>
              <CardHeader>
                <CardTitle>Manufacturer</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
                  <div>
                    <p className="text-muted-foreground">Email</p>
                    <p>{order.manufacturer.email}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Mobile</p>
                    <p>{order.manufacturer.mobile}</p>
                  </div>
                  {order.manufacturer.address && (
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p>
                        {order.manufacturer.address}, {order.manufacturer.city},{" "}
                        {order.manufacturer.state} - {order.manufacturer.pincode}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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

      {/* Cancel Order Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Order?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this order? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isCancelling}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelOrder}
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
