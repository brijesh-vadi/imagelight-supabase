import DealerOrdersView from "@/components/role/dealer/views/orders/DealerOrdersView";

export default async function DealerOrdersPage() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">My Orders</h1>
          <p className="text-muted-foreground text-sm">
            Monitor order progress and stay informed about delivery and
            fulfillment updates.
          </p>
        </div>
      </div>
      <DealerOrdersView />
    </div>
  );
}
