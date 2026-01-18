import DealerProductDetailsView from "@/components/role/dealer/views/products/DealerProductDetailsView";

interface PageProps {
  params: Promise<{ id: string }>;
}

const DealerProductDetailsPage = async ({ params }: PageProps) => {
  const { id: productId } = await params;

  return (
    <div className="space-y-6">
      <DealerProductDetailsView productId={productId} />
    </div>
  );
};

export default DealerProductDetailsPage;
