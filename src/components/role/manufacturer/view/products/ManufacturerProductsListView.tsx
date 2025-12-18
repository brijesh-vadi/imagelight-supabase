"use client";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { Product } from "@/types";
import ManufacturerProductCard from "./ManufacturerProductCard";

interface Props {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  onPageChange?: (page: number) => void;
}

const ManufacturerProductsListView = ({
  products,
  limit,
  page,
  total,
  onPageChange,
}: Props) => {
  const totalPages = Math.ceil(total / limit);

  const goToPage = (p: number) => {
    if (onPageChange) {
      onPageChange(p);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-7.8rem)] flex-col">
      <div className="flex-1 pb-6">
        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ManufacturerProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            No products found
          </div>
        )}
      </div>
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && goToPage(page - 1)}
                className={
                  page <= 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1;
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    onClick={() => goToPage(p)}
                    isActive={p === page}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && goToPage(page + 1)}
                className={
                  page >= totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
};

export default ManufacturerProductsListView;
