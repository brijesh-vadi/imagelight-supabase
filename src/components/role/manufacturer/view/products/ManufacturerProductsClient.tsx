"use client";

import { Loader2, Package } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useProducts } from "@/lib/react-query/hooks/useProducts";
import ManufacturerProductsListView from "./ManufacturerProductsListView";
import ProductFilters from "./ProductFilters";

interface Props {
  initialPage?: number;
  initialSearch?: string;
  limit: number;
}

export default function ManufacturerProductsClient({
  initialPage = 1,
  initialSearch = "",
  limit,
}: Props) {
  const [page, setPage] = useState(initialPage);
  const [search, setSearch] = useState(initialSearch);
  const [categoryId, setCategoryId] = useState<string>("");
  const [unitId, setUnitId] = useState<string>("");
  const [isActive, setIsActive] = useState<string>("");

  const { data, isLoading, isError, error } = useProducts({
    page,
    limit,
    search,
    categoryId,
    unitId,
    isActive,
  });

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

  const handleIsActiveChange = (value: string) => {
    setIsActive(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <div>
          <h1 className="font-semibold text-2xl text-primary">Products</h1>
          <p className="text-muted-foreground text-sm">
            Manage and organize all your products, including details, pricing,
            and categories.
          </p>
        </div>
        <Button asChild>
          <Link href="/manufacturer/products?add-product">Add Product</Link>
        </Button>
      </div>

      {/* Search and Filters */}
      <ProductFilters
        search={search}
        categoryId={categoryId}
        unitId={unitId}
        isActive={isActive}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
        onUnitChange={handleUnitChange}
        onIsActiveChange={handleIsActiveChange}
      />

      {data?.products.length === 0 && (
        <div className="flex items-center justify-center py-22">
          <div className="flex flex-col  mx-auto text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4 mx-auto" />
            <h3 className="font-semibold text-xl mb-2">No products added</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Start adding product to recieve your first order
            </p>
          </div>
        </div>
      )}

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
        <ManufacturerProductsListView
          products={data.products}
          total={data.total}
          page={page}
          limit={limit}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
