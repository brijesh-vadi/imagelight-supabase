"use client";

import {
  Building2,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { destroySession } from "@/lib/supabase/session";
import { type Dealer, Role } from "@/types";

const navItems = [
  {
    label: "Dashboard",
    href: "/dealer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Manufacturers",
    href: "/dealer/manufacturers",
    icon: Building2,
  },
  {
    label: "Orders",
    href: "/dealer/orders",
    icon: ClipboardList,
  },
  {
    label: "Products",
    href: "/dealer/products",
    icon: Package,
  },
  {
    label: "Cart",
    href: "/dealer/cart",
    icon: Package,
  },
];

const DealerSidebar = ({ dealer }: { dealer: Dealer }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await destroySession(Role.DEALER);
    router.push("/dealer/sign-in");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-primary">
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-foreground text-primary"
                  : "text-primary-foreground/70 hover:bg-primary-foreground/10 hover:text-primary-foreground"
              }`}
            >
              <item.icon className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4">
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium
                    bg-primary-foreground/10 hover:bg-primary-foreground/10 hover:text-destructive"
        >
          <LogOut /> Sign out {isSigningOut && <Spinner />}
        </Button>
      </div>
      <div className="border-t border-primary-foreground/10 p-4 flex items-center gap-3">
        <div className="flex items-center gap-4 w-full">
          {/*<Avatar>
            <AvatarImage
              src={dealer?.}
              alt={manufacturer?.company_name}
              className="object-cover"
            />
            <AvatarFallback className="uppercase">
              {manufacturer?.company_name[0]}
              {manufacturer?.company_name[1]}
            </AvatarFallback>
          </Avatar>*/}
          <span className="font-bold text-base text-primary-foreground tracking-tight">
            {dealer?.company_name}
          </span>
        </div>
        <Link href="/dealer/profile">
          <Settings className="text-muted" size={18} />
        </Link>
      </div>
    </aside>
  );
};

export default DealerSidebar;
