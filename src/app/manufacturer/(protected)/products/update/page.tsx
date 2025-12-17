import { notFound } from "next/navigation";
import { getManufacturerProductById } from "@/actions/manufacturer/product.action";

interface Props {
  searchParams: Promise<{ id?: string }>;
}

const ManufacturerProductUpdatePage = async ({ searchParams }: Props) => {
  const { id } = await searchParams;

  if (!id) {
    notFound();
  }

  const { data: product } = await getManufacturerProductById(id);

  if (!product) notFound();

  console.log("product", product);
  return (
    <>
      <div>ManufacturerProductUpdatePage</div>
    </>
  );
};

export default ManufacturerProductUpdatePage;
