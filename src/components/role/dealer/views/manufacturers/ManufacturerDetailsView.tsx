import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/widgets/EmblaCarousel";
import { formatPrice, shortenText } from "@/lib/utils";
import type { Manufacturer, Product } from "@/types";

interface Props {
  manufacturer: Manufacturer & { products?: Product[]; totalProducts?: number };
}

const ManufacturerDetailsView = ({ manufacturer }: Props) => {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-8">
        <Card className="p-0 gap-0 overflow-hidden">
          <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
            <CardTitle className="text-base">About</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex items-stretch gap-10">
              {/* Logo + Name */}
              <div className="flex items-center gap-4 max-w-105 shrink-0">
                <div className="relative h-16 w-16 overflow-hidden rounded-full border-2 border-primary/10">
                  {manufacturer?.company_logo ? (
                    <Avatar className="h-full w-full">
                      <AvatarImage
                        src={manufacturer.company_logo}
                        alt={`${manufacturer?.company_name} logo`}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-lg">
                        {manufacturer?.company_name?.[0]}
                        {manufacturer?.company_name?.[1]}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted font-semibold text-muted-foreground text-xl">
                      {manufacturer?.company_name?.charAt(0).toUpperCase() ||
                        "?"}
                    </div>
                  )}
                </div>

                <h1 className="font-medium text-xl text-primary">
                  {manufacturer?.company_name || "Unnamed Company"}
                </h1>
              </div>

              {/* Visible Vertical Separator */}
              <div className="w-px bg-border self-stretch" />

              {/* Description */}
              <div className="text-sm text-muted-foreground font-medium flex-1 min-w-0 wrap-break-word whitespace-normal">
                {manufacturer?.company_description ||
                  "No description available"}
              </div>
            </div>
          </CardContent>
        </Card>
        <div className="flex w-full gap-8">
          {/* Contact Information */}
          <Card className="p-0 gap-0 overflow-hidden w-1/2">
            <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
              <CardTitle className="flex items-center gap-2 text-md mx-auto">
                Contact Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm p-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between gap-4 font-medium">
                  <span>Contact Person</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.contact_person}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Email</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.email}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Mobile</span>
                  <span className="text-muted-foreground">
                    +91 {manufacturer?.mobile}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Website</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.website ?? "-"}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>Address</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.address}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business Information */}
          <Card className="p-0 gap-0 overflow-hidden w-1/2">
            <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
              <CardTitle className="text-base">Business Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm p-4">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between gap-4 font-medium">
                  <span>Business Type</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.business_type}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>City</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.city || "—"}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>State</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.state}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>PIN Code</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.pincode}
                  </span>
                </div>
                <div className="flex justify-between gap-4 font-medium">
                  <span>GST Number</span>
                  <span className="text-muted-foreground">
                    {manufacturer?.gst_number}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Card className="p-0 gap-0 overflow-hidden">
        <CardHeader className="px-4 py-2 bg-secondary text-center gap-0">
          <CardTitle className="flex items-center">
            <span className="flex-1 text-base text-center">Products</span>

            {manufacturer.totalProducts && manufacturer.totalProducts > 3 && (
              <Button size="sm" className="ml-auto">
                View All
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          {manufacturer?.products && manufacturer.products.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {manufacturer.products.map((product) => {
                const allImages = [
                  product.primary_image,
                  ...(product.images ?? []),
                ];
                return (
                  <Card
                    key={product.id}
                    className="group overflow-hidden p-0 transition-all gap-4"
                  >
                    <CardHeader className="gap-0 p-0 border-b pb-0!">
                      <div className="group relative">
                        <Carousel opts={{ loop: true }} className="w-full">
                          <div className="relative aspect-video overflow-hidden bg-muted">
                            <CarouselContent>
                              {allImages.map((image, index) => (
                                <CarouselItem key={`${image}`}>
                                  <div className="relative aspect-video overflow-hidden">
                                    <Image
                                      src={image}
                                      alt={product.name}
                                      fill
                                      priority={index === 0}
                                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                  </div>
                                </CarouselItem>
                              ))}
                            </CarouselContent>
                            {allImages.length > 1 && (
                              <>
                                <CarouselPrevious className="-translate-y-1/2 absolute top-1/2 left-2 z-10 h-8 w-8 border-0 bg-white/80 text-black opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100" />
                                <CarouselNext className="-translate-y-1/2 absolute top-1/2 right-2 z-10 h-8 w-8 border-0 bg-white/80 text-black opacity-0 shadow-md transition-opacity duration-200 hover:bg-white group-hover:opacity-100" />
                              </>
                            )}
                          </div>
                        </Carousel>
                      </div>
                    </CardHeader>

                    <CardContent className="px-4 pb-4 flex flex-col gap-3">
                      {/* Product Name */}
                      <div className="flex items-center justify-between">
                        <h3 className="line-clamp-2 font-semibold text-gray-900 text-xl leading-tight">
                          {shortenText(product.name, 30)}
                        </h3>
                      </div>

                      {/* Description */}
                      <p className="line-clamp-2 text-muted-foreground text-xs">
                        {shortenText(product.description, 50)}
                      </p>

                      {/* Dealer Price */}
                      <div className="flex items-start gap-6 bg-muted p-2 rounded-md">
                        {/* Dealer Price */}
                        <div className="flex flex-col gap-1 flex-1">
                          <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Dealer Price
                          </Label>
                          <span className="text-lg font-semibold">
                            {formatPrice(product.dealer_price)}
                          </span>
                        </div>

                        {/* Separator */}
                        <Separator orientation="vertical" className="h-12" />

                        {/* Regular Price */}
                        <div className="flex flex-col gap-1 flex-1">
                          <Label className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                            Regular Price
                          </Label>
                          <span className="text-lg font-semibold">
                            {formatPrice(product.regular_price)}
                          </span>
                        </div>
                      </div>

                      {/* Stock */}
                      <div className="flex items-center gap-2">
                        <Label>Stock :</Label>
                        <span className="text-muted-foreground text-sm">
                          {product.stock}
                        </span>
                      </div>

                      {/* Min.Order Quantity */}
                      <div className="flex items-center gap-2">
                        <Label>Min. order quantity :</Label>
                        <span className="text-muted-foreground text-sm">
                          {product.min_order_quantity}
                        </span>
                      </div>

                      {/* Category */}
                      <div className="flex items-center gap-2">
                        <Label>Category :</Label>
                        <Badge variant="secondary">
                          <span className="text-xs">
                            {product.category?.name}
                          </span>
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">
              No products added by this manufacturer
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ManufacturerDetailsView;
