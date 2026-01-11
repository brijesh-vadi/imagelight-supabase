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
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-bold text-4xl md:text-5xl lg:text-6xl tracking-tight mb-4">
              Premium Sarees
              <span className="text-primary"> Wholesale</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-6 max-w-2xl mx-auto">
              Connect directly with verified saree manufacturers. Browse our
              collection and place bulk orders.
            </p>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 border-b bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Badge
              variant={selectedCategory === "all" ? "default" : "outline"}
              className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm"
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
                className="cursor-pointer whitespace-nowrap px-4 py-2 text-sm"
                onClick={() => handleCategoryChange(category.id)}
              >
                {category.name}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section id="products-section" className="py-12">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card
                  key={i}
                  className="flex flex-col p-0 gap-0 h-full overflow-hidden"
                >
                  <Skeleton className="aspect-square w-full" />
                  <CardContent className="p-4 flex flex-col flex-1 gap-1">
                    <div className="mb-2">
                      <Skeleton className="h-4 w-full mb-1" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                    <div className="mb-2">
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-6 w-24" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">
                No products available in this category
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">{products.map((product) => {
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
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            <CarouselPrevious className="left-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <CarouselNext className="right-2 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Carousel>
                        ) : (
                          <Image
                            src={product.primary_image || "/placeholder.png"}
                            alt={product.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        )}
                      </div>
                      <CardContent className="p-4 flex flex-col flex-1 gap-1">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-sm line-clamp-2 flex-1">
                            {shortenText(product.name, 30)}
                          </h3>
                        </div>
                        {product.category && (
                          <div className="flex items-center gap-1 mb-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {product.category.name}
                            </Badge>
                          </div>
                        )}
                        <div className="mb-2">
                          <span className="font-bold text-lg text-primary">
                            {formatPrice(product.regular_price)}
                          </span>
                        </div>
                        <div className="flex flex-col gap-4">
                          {product.manufacturer && (
                            <div className="flex items-center gap-2">
                              <Avatar className="h-5 w-5">
                                <AvatarImage
                                  src={product.manufacturer.company_logo}
                                  alt={`${product.manufacturer.company_logo} logo`}
                                  className="object-cover"
                                />
                                <AvatarFallback className="text-lg">
                                  {product.manufacturer?.company_name?.[0]}
                                  {product.manufacturer?.company_name?.[1]}
                                </AvatarFallback>
                              </Avatar>
                              <p className="text-xs text-muted-foreground">
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
              <div className="mt-8">
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

      <section className="py-16 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-bold text-3xl mb-4">
              Why Choose Our Platform?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              We provide a secure, efficient, and user-friendly environment for
              B2B commerce
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Verified Users</h3>
                <p className="text-sm text-muted-foreground">
                  All manufacturers and dealers are verified by our admin team
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Fast & Easy</h3>
                <p className="text-sm text-muted-foreground">
                  Simple onboarding process and intuitive interface
                </p>
              </div>
              <div className="text-center">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Growing Network</h3>
                <p className="text-sm text-muted-foreground">
                  Join a thriving community of manufacturers and dealers
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">
            Start Your Saree Business Today
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join as a manufacturer to showcase your sarees or as a dealer to
            access wholesale prices.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link href="/manufacturer/sign-up">Join as Manufacturer</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/dealer/sign-up">Join as Dealer</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
