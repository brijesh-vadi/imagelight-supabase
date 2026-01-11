import {
  getPublicCategoriesWithProducts,
  getPublicProducts,
} from "@/actions/public/product.action";
import LandingPageClient from "@/components/role/public/views/LandingPageClient";

export default async function Home() {
  const [categoriesResponse, productsResponse] = await Promise.all([
    getPublicCategoriesWithProducts(),
    getPublicProducts(undefined, 1, 12),
  ]);

  const categories = categoriesResponse.data?.categories ?? [];
  const products = productsResponse.data?.products ?? [];
  const totalPages = productsResponse.data?.totalPages ?? 0;
  const total = productsResponse.data?.total ?? 0;

  return (
    <LandingPageClient
      initialCategories={categories}
      initialProducts={products}
      initialTotalPages={totalPages}
      initialTotal={total}
    />
  );
}
