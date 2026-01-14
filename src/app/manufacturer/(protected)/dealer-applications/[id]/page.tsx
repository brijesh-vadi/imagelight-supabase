import DealerApplicationPage from "@/components/role/manufacturer/view/dealer-applications/DealerApplicationPage";

interface Props {
  params: Promise<{ id: string }>;
}

const DealerDetailsPage = async ({ params }: Props) => {
  const { id } = await params;

  return <DealerApplicationPage dealerId={id} />;
};

export default DealerDetailsPage;
