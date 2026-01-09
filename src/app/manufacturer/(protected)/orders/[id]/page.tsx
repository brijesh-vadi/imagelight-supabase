import { notFound } from "next/navigation";
import { getManufacturerOrderById } from "@/actions/manufacturer/order.action";
import ManufacturerOrderDetailsView from "@/components/role/manufacturer/view/orders/ManufacturerOrderDetailsView";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ManufacturerOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const result = await getManufacturerOrderById(id);

  if (!result.success || !result.data) {
    notFound();
  }

  return <ManufacturerOrderDetailsView order={result.data.order} />;
}
