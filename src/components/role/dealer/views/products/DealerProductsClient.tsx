"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { useDealerProducts } from "@/hooks/dealer/useDealerProducts";
import DealerProductListView from "./DealerProductListView";
import DealerProductFilters from "./DealerProductsFilter";

interface Props {
  initialPage?: number;
  initialSearch?: string;
  limit: number;
}

const DealerProductsClient = ({
  initialPage = 1,
  initialSearch = "",
  limit,
}: Props) => {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");

  const { data, isLoading, isError } = useDealerProducts({
    page,
    limit,
    search,
    categoryId,
    unitId,
  });

  if (!data?.data && !isLoading) return;

  const handleSearchChange = (newSearch: string) => {
    setSearch(newSearch);
    setPage(1);
  };

  const handleCategoryChange = (value: string) => {
    setCategoryId(value);
    setPage(1);
  };

  const handleUnitChange = (value: string) => {
    setUnitId(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="font-semibold text-2xl text-primary">Products</h1>
        <p className="text-muted-foreground text-sm">
          Manage and organize all your products, including details, pricing, and
          categories.
        </p>
      </div>

      {/* Search and Filters */}
      <DealerProductFilters
        search={search}
        categoryId={categoryId}
        unitId={unitId}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onUnitChange={handleUnitChange}
      />

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center min-h-175">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {/* Products List */}
      {!isLoading && !isError && data && (
        <DealerProductListView
          products={data?.data?.products ?? []}
          total={data?.data?.total ?? 0}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default DealerProductsClient;
