import type React from "react";

export default function ManufacturerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="flex min-h-screen">
        {/* Left Side - Info Section - Hidden on mobile */}
        <div className="hidden md:flex md:w-1/2 items-center justify-center bg-muted p-8">
          <div className="max-w-md space-y-8">
            <div className="space-y-4">
              <h1 className="font-bold text-4xl text-foreground">
                Join ImageLight
              </h1>
              <p className="text-lg text-muted-foreground">
                Connect with verified dealers across India and grow your
                business
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
                  <h3 className="font-semibold text-foreground">
                    Easy Registration
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Create your account in minutes with basic company
                    information
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
                    Verified Dealers
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Connect with pre-verified dealers who are ready to work with
                    you
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
                    Manage Everything
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Manage products, categories, and dealer applications from
                    one dashboard
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <p className="text-muted-foreground text-sm">
                Join thousands of manufacturers already using ImageLight to
                expand their dealer network
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Form Section - Full width on mobile, half on desktop */}
        <div className="flex w-full md:w-1/2 items-center justify-center p-6 md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
