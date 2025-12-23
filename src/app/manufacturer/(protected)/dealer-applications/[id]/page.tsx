import { notFound } from "next/navigation";
import { getDealerById } from "@/actions/manufacturer/dealer-applications.action";
import DealerApplicationPage from "@/components/role/manufacturer/view/dealer-applications/DealerApplicationPage";

interface Props {
  params: Promise<{ id: string }>;
}

const DealerDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  const { data: dealer } = await getDealerById(id);

  if (!dealer) notFound();

  return <DealerApplicationPage initialDealer={dealer} dealerId={id} />;
};

export default DealerDetailsPage;
