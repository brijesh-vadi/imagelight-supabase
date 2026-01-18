import DealerProductsClient from "@/components/role/dealer/views/products/DealerProductsClient";

interface Props {
  searchParams: Promise<{
    page?: string;
    search?: string;
  }>;
}

const LIMIT = 9;

const DealerProductsPage = async ({ searchParams }: Props) => {
  const params = await searchParams;

  const page = Number(params.page ?? 1);
  const search = params.search || "";

  return (
    <div className="space-y-6">
      <DealerProductsClient
        limit={LIMIT}
        initialPage={page}
        initialSearch={search}
      />
    </div>
  );
};

export default DealerProductsPage;
