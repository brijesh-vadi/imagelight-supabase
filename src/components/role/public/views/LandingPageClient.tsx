"use client";

import { useQuery } from "@tanstack/react-query";
import { Shield, Users, Zap } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { getPublicProducts } from "@/actions/public/product.action";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { Category, Product } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";

interface Props {
  initialCategories: Category[];
  initialProducts: Product[];
  initialTotalPages: number;
  initialTotal: number;
}

export default function LandingPageClient({
  initialCategories,
  initialProducts,
  initialTotalPages,
  initialTotal,
}: Props) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["public-products", selectedCategory, page],
    queryFn: async () => {
      const response = await getPublicProducts(
        selectedCategory === "all" ? undefined : selectedCategory,
        page,
        12,
      );
      return response.data;
    },
    initialData:
      page === 1 && selectedCategory === "all"
        ? {
            products: initialProducts,
            total: initialTotal,
            totalPages: initialTotalPages,
          }
        : undefined,
  });

  const products = data?.products ?? [];
  const totalPages = data?.totalPages ?? 0;

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    setTimeout(() => {
      document.getElementById("products-section")?.scrollIntoView({
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
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 py-8 sm:py-10 md:py-12 lg:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl tracking-tight mb-3 sm:mb-4 leading-tight">
              Premium Sarees
              <span className="text-primary"> Wholesale</span>
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg lg:text-xl mb-4 sm:mb-6 max-w-2xl mx-auto px-2">
              Connect directly with verified saree manufacturers. Browse our
              collection and place bulk orders.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-4 sm:py-6 md:py-8 border-b bg-secondary/30">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shrink-0"
              onClick={() => handleCategoryChange("all")}
            >
              All Sarees
            </Badge>
            {initialCategories.map((category) => (
              <Badge
                key={category.id}
                variant={
                  selectedCategory === category.id ? "default" : "outline"
                }
                className="cursor-pointer whitespace-nowrap px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm shrink-0"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-6 sm:py-8 md:py-10 lg:py-12">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
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
          ) : products.length === 0 ? (
            <div className="text-center py-12 sm:py-16">
              <p className="text-muted-foreground text-base sm:text-lg px-4">
                No products available in this category
              </p>
            </div>
          ) : (
            <>
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
                            <h3 className="font-semibold text-xs sm:text-sm line-clamp-2 flex-1 h-10">
                              {shortenText(product.name, 40)}
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
                          <div className="mb-1 sm:mb-2 flex items-center gap-2">
                            <span className="font-bold text-sm sm:text-base md:text-lg text-primary">
                              {formatPrice(product.regular_price)}{" "}
                            </span>
                            <span className="text-xs font-normal text-muted-foreground">
                              (Retail Price)
                            </span>
                          </div>
                          <div className="flex flex-col gap-2 sm:gap-4">
                            {product.manufacturer && (
                              <div className="flex items-center gap-1 sm:gap-2">
                                <Avatar className="h-4 w-4 sm:h-5 sm:w-5">
                                  <AvatarImage
                                    src={product.manufacturer.company_logo}
                                    alt={`${product.manufacturer.company_logo} logo`}
                                    className="object-cover"
                                  />
                                  <AvatarFallback className="text-[10px] sm:text-xs">
                                    {product.manufacturer?.company_name?.[0]}
                                    {product.manufacturer?.company_name?.[1]}
                                  </AvatarFallback>
                                </Avatar>
                                <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">
                                  {product.manufacturer.company_name}
                                </p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>

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
            </>
          )}
        </div>
      </section>

      <section className="py-8 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-bold text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 px-2">
              We provide a secure, efficient, and user-friendly environment for
              B2B commerce
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
              <div className="text-center p-4 sm:p-0">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                  <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  Verified Users
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  All manufacturers and dealers are verified by our admin team
                </p>
              </div>
              <div className="text-center p-4 sm:p-0">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                  <Zap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  Fast & Easy
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Simple onboarding process and intuitive interface
                </p>
              </div>
              <div className="text-center p-4 sm:p-0">
                <div className="mx-auto w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10 flex items-center justify-center mb-2 sm:mb-3">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-sm sm:text-base mb-1 sm:mb-2">
                  Growing Network
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Join a thriving community of manufacturers and dealers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-3 sm:px-4 md:px-6 text-center">
          <h2 className="font-bold text-xl sm:text-2xl md:text-3xl lg:text-4xl mb-3 sm:mb-4">
            Start Your Saree Business Today
          </h2>
          <p className="text-primary-foreground/90 text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
            Join as a manufacturer to showcase your sarees or as a dealer to
            access wholesale prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center px-4 sm:px-0">
            <Button
              asChild
              size="default"
              variant="secondary"
              className="text-sm sm:text-base w-full sm:w-auto sm:min-w-50"
            >
              <Link href="/manufacturer/sign-up">Join as Manufacturer</Link>
            </Button>
            <Button
              asChild
              size="default"
              variant="outline"
              className="text-sm sm:text-base w-full sm:w-auto sm:min-w-50 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/dealer/sign-up">Join as Dealer</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
