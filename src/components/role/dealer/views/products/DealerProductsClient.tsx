"use client";

import { Loader2 } from "lucide-react";
import { useState } from "react";
import { useDealerProducts } from "@/lib/react-query/hooks/useDealerProducts";
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

  const { data, isLoading, isError, error } = useDealerProducts({
    page,
    limit,
    search,
    categoryId,
    unitId,
  });

  console.log("data", data);

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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center">
          <p className="text-destructive text-sm">
            {error?.message || "Failed to load products"}
          </p>
        </div>
      )}

      {/* Products List */}
      {!isLoading && !isError && data && (
        <DealerProductListView
          products={data.products}
          total={data.total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
};

export default DealerProductsClient;
