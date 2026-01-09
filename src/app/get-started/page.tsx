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
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function GetStartedPage() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur `supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center relative w-32 h-32">
            <Image src="/vercel.svg" alt="Logo" fill className="dark:invert" />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-linear-to-b from-primary/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="font-bold text-4xl md:text-5xl mb-4">
              Choose Your Path
            </h1>
            <p className="text-muted-foreground text-lg">
              Select the option that best describes your business to get started
              with our platform
            </p>
          </div>

          {/* Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Manufacturer Card */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Package className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">I'm a Manufacturer</CardTitle>
                <CardDescription className="text-base">
                  Showcase your products and connect with dealers nationwide
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Create and manage unlimited product catalogs with images
                        and descriptions
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Set dealer-specific pricing and minimum order quantities
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Real-time inventory management and stock tracking
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Accept or reject orders with full control over your
                        business
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Update order status from processing to delivery
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <BarChart3 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Expand Your Reach:</strong> Connect with
                        verified dealers across regions
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Save Time:</strong> Automated order management
                        and tracking
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Shield className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Secure Transactions:</strong> All dealers are
                        verified by our admin team
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <FileText className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Digital Invoicing:</strong> Automatic invoice
                        generation for every order
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Globe className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>24/7 Availability:</strong> Your catalog is
                        always accessible to dealers
                      </span>
                    </li>
                  </ul>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link href="/manufacturer/sign-up">
                    Sign Up as Manufacturer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already registered?{" "}
                  <Link
                    href="/manufacturer/sign-in"
                    className="text-primary hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </CardContent>
            </Card>

            {/* Dealer Card */}
            <Card className="border-2 hover:border-primary transition-all hover:shadow-lg">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <ShoppingBag className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">I'm a Dealer</CardTitle>
                <CardDescription className="text-base">
                  Access wholesale products from verified manufacturers
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Key Features
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Browse products from multiple verified manufacturers in
                        one place
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Place bulk orders instantly with real-time inventory
                        visibility
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Track order status from placement to delivery</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>Cancel orders or individual items when needed</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                      <span>
                        Access detailed product information and specifications
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-lg flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Benefits
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <Users className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Multiple Suppliers:</strong> Access products
                        from various manufacturers
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Clock className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Quick Ordering:</strong> Place orders in
                        minutes, not hours
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <Shield className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Verified Manufacturers:</strong> All suppliers
                        are admin-verified
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <FileText className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Order History:</strong> Access all past orders
                        and invoices anytime
                      </span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <BarChart3 className="h-5 w-5 text-cyan-500 shrink-0 mt-0.5" />
                      <span>
                        <strong>Competitive Pricing:</strong> Get wholesale
                        rates directly from manufacturers
                      </span>
                    </li>
                  </ul>
                </div>

                <Button asChild className="w-full" size="lg">
                  <Link href="/dealer/sign-up">
                    Sign Up as Dealer
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>

                <p className="text-center text-sm text-muted-foreground">
                  Already registered?{" "}
                  <Link
                    href="/dealer/sign-in"
                    className="text-primary hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
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
    </div>
  );
}
