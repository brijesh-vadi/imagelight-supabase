"use client";

import { Package } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
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
import { formatDate, formatPrice } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

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

  console.log("orders", orders);

  return (
    <div className="grid grid-cols-2 gap-8">
      {orders.map((order) => (
        <Card key={order.id} className="overflow-hidden p-0">
          <CardContent className="p-0">
            {/* Dealer Info */}
            {order.dealer && (
              <div className="bg-muted p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border">
                    <AvatarImage
                      src={order?.dealer?.company_logo}
                      alt={order?.dealer?.company_name}
                    />
                    <AvatarFallback>
                      {order?.dealer?.company_name[0]}
                      {order?.dealer?.company_name[1]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs text-muted-foreground">Dealer</p>
                    <p className="font-semibold">
                      {order?.dealer?.company_name}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 h-10">
                    <div>
                      <p className="text-xs text-muted-foreground">
                        Order Number
                      </p>
                      <p className="font-semibold text-sm">
                        {order.order_number}
                      </p>
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
                  </div>
                </div>
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
                <div className="space-y-3">
                  {order.order_items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-3 rounded-lg bg-muted/50"
                    >
                      {/* Product Images Carousel */}
                      {item.product && (
                        <div className="w-32 shrink-0">
                          <Carousel className="w-full">
                            <CarouselContent>
                              <CarouselItem>
                                <div className="relative aspect-square overflow-hidden rounded border bg-background">
                                  <Image
                                    src={item.product.primary_image}
                                    alt={item.product.name}
                                    fill
                                    priority
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
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-base line-clamp-1">
                          {item.product?.name || "Product"}
                        </h4>
                        <p className="text-sm text-muted-foreground mt-1">
                          SKU: {item.product?.sku}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-sm">
                            Qty:{" "}
                            <span className="font-medium">{item.quantity}</span>
                          </span>
                          <span className="text-sm">
                            Price:{" "}
                            <span className="font-medium">
                              {formatPrice(item.price)}
                            </span>
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
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="p-4 bg-muted/50 flex justify-between items-center">
              <div className="flex items-center gap-4 h-10">
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
              <Button onClick={() => router.push(`/dealer/orders/${order.id}`)}>
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ManufacturerOrdersView;
