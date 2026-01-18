import ManufacturerOrdersView from "@/components/role/manufacturer/view/orders/ManufacturerOrdersView";

export default async function ManufacturerOrdersPage() {
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
      <ManufacturerOrdersView />
    </div>
  );
}
