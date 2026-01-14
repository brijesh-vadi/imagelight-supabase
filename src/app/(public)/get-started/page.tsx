import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock,
  FileText,
  Globe,
  Package,
  Shield,
  ShoppingBag,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function GetStartedPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="py-10 sm:py-14 md:py-16 lg:py-20 bg-linear-to-b from-primary/5 via-primary/3 to-background">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 md:mb-16">
            <h1 className="font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-4 sm:mb-6 tracking-tight">
              Choose Your Path
            </h1>
            <p className="text-muted-foreground text-base sm:text-lg md:text-xl leading-relaxed px-2">
              Join our platform and transform the way you do business
            </p>
          </div>

          {/* Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {/* Manufacturer Card */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="text-center pb-4 sm:pb-6 relative px-4 sm:px-6">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Package className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl mb-2">
                  I'm a Manufacturer
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Showcase your products and connect with dealers nationwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8 relative px-4 sm:px-6">
                <div className="space-y-3 sm:space-y-4 lg:min-h-70">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg">
                      Key Features
                    </h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Create and manage unlimited product catalogs with images
                        and descriptions
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Set dealer-specific pricing and minimum order quantities
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Real-time inventory management and stock tracking
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Accept or reject orders with full control over your
                        business
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Update order status from processing to delivery
                      </span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="space-y-3 sm:space-y-4 lg:min-h-70">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg">
                      Benefits
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-linear-to-r from-green-500/5 to-transparent border border-green-500/10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                        <BarChart3 className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm mb-0.5">
                          Expand Your Reach
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Connect with verified dealers across regions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-linear-to-r from-blue-500/5 to-transparent border border-blue-500/10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm mb-0.5">
                          Save Time
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Automated order management and tracking
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-linear-to-r from-purple-500/5 to-transparent border border-purple-500/10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm mb-0.5">
                          Secure Transactions
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          All dealers are verified by our admin team
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 sm:space-y-3">
                  <Button
                    asChild
                    className="w-full h-11 sm:h-12 text-sm sm:text-base shadow-lg hover:shadow-xl transition-shadow"
                    size="lg"
                  >
                    <Link href="/manufacturer/sign-up">
                      Sign Up as Manufacturer
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>

                  <p className="text-center text-xs sm:text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link
                      href="/manufacturer/sign-in"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Dealer Card */}
            <Card className="border-2 hover:border-primary/50 transition-all hover:shadow-xl group relative overflow-hidden">
              <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="text-center pb-4 sm:pb-6 relative px-4 sm:px-6">
                <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary to-primary/80 flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-primary-foreground" />
                </div>
                <CardTitle className="text-2xl sm:text-3xl mb-2">
                  I'm a Dealer
                </CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Access wholesale products from verified manufacturers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 sm:space-y-8 relative px-4 sm:px-6">
                <div className="space-y-3 sm:space-y-4 lg:min-h-70">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg">
                      Key Features
                    </h3>
                  </div>
                  <ul className="space-y-2 sm:space-y-3">
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Browse products from multiple verified manufacturers in
                        one place
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Place bulk orders instantly with real-time inventory
                        visibility
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Track order status from placement to delivery
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Cancel orders or individual items when needed
                      </span>
                    </li>
                    <li className="flex items-start gap-2 sm:gap-3 text-xs sm:text-sm group/item">
                      <div className="w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-primary" />
                      </div>
                      <span className="text-foreground/80">
                        Access detailed product information and specifications
                      </span>
                    </li>
                  </ul>
                </div>

                <Separator />

                <div className="space-y-3 sm:space-y-4 lg:min-h-70">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-base sm:text-lg">
                      Benefits
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3 sm:gap-4">
                    <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-linear-to-r from-green-500/5 to-transparent border border-green-500/10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                        <Users className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm mb-0.5">
                          Multiple Suppliers
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Access products from various manufacturers
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-linear-to-r from-blue-500/5 to-transparent border border-blue-500/10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm mb-0.5">
                          Quick Ordering
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          Place orders in minutes, not hours
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-lg bg-linear-to-r from-purple-500/5 to-transparent border border-purple-500/10">
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                        <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-xs sm:text-sm mb-0.5">
                          Verified Manufacturers
                        </p>
                        <p className="text-[10px] sm:text-xs text-muted-foreground">
                          All suppliers are admin-verified
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 sm:space-y-3">
                  <Button
                    asChild
                    className="w-full h-11 sm:h-12 text-sm sm:text-base shadow-lg hover:shadow-xl transition-shadow"
                    size="lg"
                  >
                    <Link href="/dealer/sign-up">
                      Sign Up as Dealer
                      <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                    </Link>
                  </Button>

                  <p className="text-center text-xs sm:text-sm text-muted-foreground">
                    Already registered?{" "}
                    <Link
                      href="/dealer/sign-in"
                      className="text-primary hover:underline font-medium"
                    >
                      Sign In
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-secondary/30">
        <div className="container mx-auto px-3 sm:px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12">
              Why Choose Our Platform?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Shield className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  Verified Users
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground px-2">
                  All manufacturers and dealers are verified by our admin team
                  for your security
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <FileText className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  Digital Invoicing
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground px-2">
                  Automatic invoice generation and order tracking for seamless
                  business operations
                </p>
              </div>
              <div className="text-center">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-linear-to-br from-primary/20 to-primary/10 flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <Globe className="h-7 w-7 sm:h-8 sm:w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-2">
                  24/7 Access
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground px-2">
                  Your business never sleeps. Access the platform anytime,
                  anywhere
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
