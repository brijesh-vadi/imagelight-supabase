import type React from "react";

export default function DealerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Left Side - Info Section */}
        <div className="flex w-1/2 items-center justify-center bg-muted p-8">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <h1 className="font-bold text-4xl text-foreground">
                Partner with Top Brands
              </h1>
              <p className="text-lg text-muted-foreground">
                Access premium products from verified manufacturers and grow
                your dealership business
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <span className="font-semibold text-primary-foreground text-sm">
                    1
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Quick Setup</h3>
                  <p className="text-muted-foreground text-sm">
                    Register your dealership in minutes and get instant access
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <span className="font-semibold text-primary-foreground text-sm">
                    2
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Browse Premium Products
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Explore products from top manufacturers across categories
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary">
                  <span className="font-semibold text-primary-foreground text-sm">
                    3
                  </span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">
                    Place Orders Easily
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Streamline your ordering process and track deliveries in
                    real-time
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-muted-foreground text-sm">
                Join hundreds of dealers already expanding their business with
                ImageLight
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section */}
        <div className="flex w-1/2 items-center justify-center p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
