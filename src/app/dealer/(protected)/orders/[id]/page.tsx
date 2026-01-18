import DealerOrderDetailsView from "@/components/role/dealer/views/orders/DealerOrderDetailsView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DealerOrderDetailPage({ params }: Props) {
  const { id: orderId } = await params;

  return <DealerOrderDetailsView orderId={orderId} />;
}
