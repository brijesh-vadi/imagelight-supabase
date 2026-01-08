import { Package } from "lucide-react";
import Link from "next/link";
import { getManufacturerOrders } from "@/actions/manufacturer/order.action";
import ManufacturerOrdersView from "@/components/role/manufacturer/view/orders/ManufacturerOrdersView";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default async function ManufacturerOrdersPage() {
  const result = await getManufacturerOrders();

  const orders = result.success && result.data ? result.data.orders : [];

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <div className="border-b pb-4">
          <h1 className="font-semibold text-2xl text-primary">My Orders</h1>
          <p className="text-muted-foreground text-sm">
            View and track your orders
          </p>
        </div>

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
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">My Orders</h1>
          <p className="text-muted-foreground text-sm">
            Review dealer orders, monitor order status, and manage dispatch and
            fulfillment
          </p>
        </div>
      </div>
      <ManufacturerOrdersView orders={orders} />
    </div>
  );
}
