import {
  ArrowRight,
  CheckCircle2,
  Package,
  ShoppingCart,
  TrendingUp,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center relative w-32 h-32">
            <Image src="/vercel.svg" alt="Logo" fill className="dark:invert" />
          </Link>
          <Button asChild>
            <Link href="/get-started">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="font-bold text-4xl md:text-6xl lg:text-7xl tracking-tight mb-6">
              Connect Manufacturers
              <span className="text-primary"> & Dealers</span>
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl mb-8 max-w-2xl mx-auto">
              The modern B2B platform that streamlines wholesale operations,
              simplifies order management, and grows your business network.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl md:text-4xl mb-4">
              Everything You Need to Scale
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful features designed for modern B2B commerce
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Product Catalog</h3>
                <p className="text-muted-foreground">
                  Showcase your products with detailed descriptions, images, and
                  pricing. Easy catalog management for manufacturers.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <ShoppingCart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Smart Ordering</h3>
                <p className="text-muted-foreground">
                  Streamlined order placement with real-time inventory, bulk
                  ordering, and instant order tracking.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Order Management</h3>
                <p className="text-muted-foreground">
                  Complete order lifecycle management from acceptance to
                  delivery with status tracking and notifications.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">Network Growth</h3>
                <p className="text-muted-foreground">
                  Connect with verified manufacturers and dealers. Build lasting
                  business relationships.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">
                  Verified Partners
                </h3>
                <p className="text-muted-foreground">
                  All manufacturers and dealers are verified by our admin team
                  for secure transactions.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardContent className="pt-6">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl mb-2">
                  Flexible Cancellation
                </h3>
                <p className="text-muted-foreground">
                  Both parties can manage orders with item-level cancellation
                  and transparent communication.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-bold text-3xl md:text-4xl mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get started in minutes with our simple onboarding process
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* For Manufacturers */}
            <div>
              <h3 className="font-semibold text-2xl mb-6 text-primary">
                For Manufacturers
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Sign Up & Get Verified
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Register your company and submit verification documents
                      for admin approval.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Add Your Products</h4>
                    <p className="text-muted-foreground text-sm">
                      Create your product catalog with images, pricing, and
                      inventory details.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Receive & Manage Orders
                    </h4>
                    <p className="text-muted-foreground text-sm">
                      Accept orders, update status, and manage your dealer
                      network efficiently.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Dealers */}
            <div>
              <h3 className="font-semibold text-2xl mb-6 text-primary">
                For Dealers
              </h3>
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Create Your Account</h4>
                    <p className="text-muted-foreground text-sm">
                      Quick registration with business details and verification
                      process.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Browse & Order</h4>
                    <p className="text-muted-foreground text-sm">
                      Explore products from verified manufacturers and place
                      bulk orders instantly.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">Track & Receive</h4>
                    <p className="text-muted-foreground text-sm">
                      Monitor order status in real-time and manage your
                      inventory seamlessly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-bold text-3xl md:text-4xl mb-4">
            Ready to Transform Your B2B Business?
          </h2>
          <p className="text-primary-foreground/90 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of manufacturers and dealers already growing their
            business on our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" variant="secondary" className="text-base">
              <Link href="/manufacturer/sign-up">
                Get Started as Manufacturer
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="text-base bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
            >
              <Link href="/dealer/sign-up">Get Started as Dealer</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
