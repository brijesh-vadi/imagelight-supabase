"use client";

import {
  Box,
  LayoutDashboard,
  LogOut,
  Package,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { destroySession } from "@/lib/supabase/session";
import { type Manufacturer, Role } from "@/types";

const navItems = [
  {
    label: "Dashboard",
    href: "/manufacturer/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Dealer Applications",
    href: "/manufacturer/dealer-applications",
    icon: Users,
  },
  {
    label: "Units",
    href: "/manufacturer/units",
    icon: Box,
  },
  {
    label: "Products",
    href: "/manufacturer/products",
    icon: Package,
  },
  {
    label: "Orders",
    href: "/manufacturer/orders",
    icon: Package,
  },
];

const ManufacturerSidebar = ({
  manufacturer,
}: {
  manufacturer: Manufacturer | undefined;
}) => {
  const pathname = usePathname();
  const router = useRouter();

  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await destroySession(Role.MANUFACTURER);
    router.push("/manufacturer/sign-in");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-primary flex-shrink-0 border-r border-primary-foreground/10">
      {/* Logo/Brand Section */}
      <div className="p-4 border-b border-primary-foreground/10">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={manufacturer?.company_logo}
              alt={manufacturer?.company_name}
              className="object-cover"
            />
            <AvatarFallback className="uppercase text-sm bg-primary-foreground/20">
              {manufacturer?.company_name?.[0]}
              {manufacturer?.company_name?.[1]}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-primary-foreground truncate">
              {manufacturer?.company_name}
            </p>
            <p className="text-xs text-primary-foreground/60">Manufacturer</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-primary-foreground text-primary shadow-sm"
                    : "text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground"
                }
              `}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Section */}
      <div className="border-t border-primary-foreground/10 p-3 space-y-3">
        {/* Profile Link */}
        <Link
          href="/manufacturer/profile"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-primary-foreground transition-all"
        >
          <Settings className="h-5 w-5 flex-shrink-0" />
          <span>Settings</span>
        </Link>

        {/* Sign Out Button */}
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-primary-foreground/80 hover:bg-primary-foreground/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5 flex-shrink-0" />
          <span>Sign out</span>
          {isSigningOut && <Spinner className="ml-auto h-4 w-4" />}
        </Button>
      </div>
    </aside>
  );
};

export default ManufacturerSidebar;
