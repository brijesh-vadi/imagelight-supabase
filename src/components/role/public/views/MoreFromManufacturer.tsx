"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getProductsByManufacturer } from "@/actions/public/product.action";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatPrice, shortenText } from "@/lib/utils";
import type { Product } from "@/types";

interface Props {
  initialProducts: Product[];
  manufacturerId: string;
  excludeProductId: string;
  manufacturerName: string;
  initialTotalPages: number;
}

export default function MoreFromManufacturer({
  initialProducts,
  manufacturerId,
  excludeProductId,
  manufacturerName,
  initialTotalPages,
}: Props) {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["manufacturer-products", manufacturerId, excludeProductId, page],
    queryFn: async () => {
      const response = await getProductsByManufacturer(
        manufacturerId,
        excludeProductId,
        page,
        8,
      );
      return response.data;
    },
    initialData:
      page === 1
        ? {
            products: initialProducts,
            total: 0,
            totalPages: initialTotalPages,
          }
        : undefined,
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 0;

  if (initialProducts.length === 0 && products.length === 0) {
    return null;
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      document.getElementById("more-products")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={page === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }
    } else {
      items.push(
        <PaginationItem key={1}>
          <PaginationLink
            onClick={() => handlePageChange(1)}
            isActive={page === 1}
            className="cursor-pointer"
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );

      if (page > 3) {
        items.push(
          <PaginationItem key="ellipsis-1">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);

      for (let i = start; i <= end; i++) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              onClick={() => handlePageChange(i)}
              isActive={page === i}
              className="cursor-pointer"
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      }

      if (page < totalPages - 2) {
        items.push(
          <PaginationItem key="ellipsis-2">
            <PaginationEllipsis />
          </PaginationItem>,
        );
      }

      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            onClick={() => handlePageChange(totalPages)}
            isActive={page === totalPages}
            className="cursor-pointer"
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  };

  return (
    <section
      id="more-products"
      className="py-6 sm:py-8 md:py-10 lg:py-12 border-t"
    >
      <div className="container mx-auto px-3 sm:px-4 md:px-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 w-fit mx-auto sm:w-full">
          More from {manufacturerName}
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card
                key={i}
                className="flex flex-col p-0 gap-0 h-full overflow-hidden"
              >
                <Skeleton className="aspect-square w-full" />
                <CardContent className="p-2 sm:p-3 md:p-4 flex flex-col flex-1 gap-1">
                  <div className="mb-2">
                    <Skeleton className="h-3 sm:h-4 w-full mb-1" />
                    <Skeleton className="h-3 sm:h-4 w-3/4" />
                  </div>
                  <div className="mb-2">
                    <Skeleton className="h-4 sm:h-5 w-16 sm:w-20" />
                  </div>
                  <Skeleton className="h-5 sm:h-6 w-20 sm:w-24" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            {products.map((product) => {
              const allImages = [
                product.primary_image,
                ...(product.images ?? []),
              ].filter(Boolean);

              return (
                <Link
                  href={`/products/${product.id}`}
                  key={product.id}
                  className="block"
                >
                  <Card className="group overflow-hidden hover:shadow-lg transition-shadow flex flex-col p-0 gap-0 h-full cursor-pointer">
                    <div className="relative aspect-square overflow-hidden bg-muted">
                      {allImages.length > 1 ? (
                        <Carousel
                          opts={{ loop: true }}
                          className="w-full h-full"
                        >
                          <CarouselContent>
                            {allImages.map((image, index) => (
                              <CarouselItem key={index}>
                                <div className="relative aspect-square">
                                  <Image
                                    src={image || "/placeholder.png"}
                                    alt={`${product.name} - ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-1 sm:left-2 h-6 w-6 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                          <CarouselNext className="right-1 sm:right-2 h-6 w-6 sm:h-8 sm:w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Carousel>
                      ) : (
                        <Image
                          src={product.primary_image || "/placeholder.png"}
                          alt={product.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        />
                      )}
                    </div>
                    <CardContent className="p-2 sm:p-3 md:p-4 flex flex-col flex-1 gap-0.5 sm:gap-1">
                      <div className="flex items-start justify-between gap-1 sm:gap-2 mb-1 sm:mb-2">
                        <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 flex-1">
                          {shortenText(product.name, 30)}
                        </h3>
                      </div>
                      {product.category && (
                        <div className="flex items-center gap-1 mb-1 sm:mb-2 flex-wrap">
                          <Badge
                            variant="secondary"
                            className="text-[10px] sm:text-xs px-1.5 sm:px-2 py-0 sm:py-0.5"
                          >
                            {product.category.name}
                          </Badge>
                        </div>
                      )}
                      <div className="mb-1 sm:mb-2">
                        <span className="font-bold text-sm sm:text-base md:text-lg text-primary">
                          {formatPrice(product.regular_price)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-6 sm:mt-8">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => page > 1 && handlePageChange(page - 1)}
                    className={
                      page === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>

                {renderPaginationItems()}

                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      page < totalPages && handlePageChange(page + 1)
                    }
                    className={
                      page === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}
