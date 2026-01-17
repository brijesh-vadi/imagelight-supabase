import { Package } from "lucide-react";
import { getManufacturerOrders } from "@/actions/manufacturer/order.action";
import ManufacturerOrdersView from "@/components/role/manufacturer/view/orders/ManufacturerOrdersView";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function ManufacturerOrdersPage() {
  const result = await getManufacturerOrders();

  const orders = result.success && result.data ? result.data.orders : [];

  if (orders.length === 0) {
    return (
      <div className="space-y-4 md:space-y-6">
        <Card className="shadow-none border-none">
          <CardContent className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
            <Package className="h-12 w-12 md:h-16 md:w-16 text-muted-foreground mb-3 md:mb-4" />
            <h3 className="font-semibold text-lg md:text-xl mb-2">
              No orders yet
            </h3>
            <p className="text-muted-foreground text-xs md:text-sm mb-6 text-center">
              Orders from dealers will be visible here dealers start placing
              orders
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between border-b pb-3 md:pb-4">
        <div className="flex-1 min-w-0">
          <h1 className="font-semibold text-xl md:text-2xl text-primary">
            My Orders
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Review dealer orders, monitor order status, and manage dispatch and
            fulfillment
          </p>
        </div>
      </div>
      <ManufacturerOrdersView orders={orders} />
    </div>
  );
}
