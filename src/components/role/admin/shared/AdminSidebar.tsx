"use client";

import { FileText, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { destroySession } from "@/lib/supabase/session";
import { Role } from "@/types";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: FileText,
  },
];

const AdminSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    await destroySession(Role.ADMIN);
    router.push("/admin/sign-in");
    router.refresh();
  };

  return (
    <aside className="flex h-screen w-64 flex-col bg-primary">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-primary-foreground/10 px-6">
        <span className="font-bold text-xl text-primary-foreground tracking-tight">
          Admin Panel
        </span>
      </div>

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
      <div className="border-t border-primary-foreground/10 p-4">
        <Button
          onClick={handleSignOut}
          disabled={isSigningOut}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-sm font-medium
                    bg-primary-foreground/10 hover:bg-primary-foreground/10 hover:text-destructive"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
          {isSigningOut && <Spinner />}
        </Button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
