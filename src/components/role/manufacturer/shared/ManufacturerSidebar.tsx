"use client";

import {
  Box,
  Layers,
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
    label: "Categories",
    href: "/manufacturer/categories",
    icon: Layers,
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

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogOut = async () => {
    setIsLoggingOut(true);
    destroySession(Role.MANUFACTURER);
    router.refresh();
    setIsLoggingOut(false);
  };
  return (
    <aside className="flex h-screen w-64 flex-col bg-primary">
      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
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
          onClick={handleLogOut}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium
                    bg-primary-foreground/10 hover:bg-primary-foreground/10 hover:text-destructive"
        >
          <LogOut /> Log out {isLoggingOut && <Spinner />}
        </Button>
      </div>
      <div className="border-t border-primary-foreground/10 p-4 flex items-center gap-3">
        <div className="flex items-center gap-4 w-full">
          <Avatar>
            <AvatarImage
              src={manufacturer?.company_logo}
              alt={manufacturer?.company_name}
              className="object-cover"
            />
            <AvatarFallback className="uppercase">
              {manufacturer?.company_name[0]}
              {manufacturer?.company_name[1]}
            </AvatarFallback>
          </Avatar>
          <span className="font-bold text-base text-primary-foreground tracking-tight">
            {manufacturer?.company_name}
          </span>
        </div>
        <Link href="/manufacturer/profile">
          <Settings className="text-muted" size={18} />
        </Link>
      </div>
    </aside>
  );
};

export default ManufacturerSidebar;
