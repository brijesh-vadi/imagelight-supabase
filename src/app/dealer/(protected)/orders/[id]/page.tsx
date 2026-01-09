import { notFound } from "next/navigation";
import { getDealerOrderById } from "@/actions/dealer/order.action";
import DealerOrderDetailsView from "@/components/role/dealer/views/orders/DealerOrderDetailsView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function DealerOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getDealerOrderById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <DealerOrderDetailsView order={result.data.order} />;
}
