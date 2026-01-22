"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  LogOut,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useUserStore();
  const pathname = usePathname();

  // Helper to check if the current path is active
  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(path + "/");
  };

  // Define sidebar items based on user role
  const sidebarItems =
    user?.role === "admin"
      ? [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/admin/dashboard",
          },
          {
            label: "Products",
            icon: Package,
            href: "/dashboard/admin/products",
          },
          {
            label: "Orders",
            icon: ShoppingCart,
            href: "/dashboard/admin/orders",
          },
          {
            label: "Retailers",
            icon: Users,
            href: "/dashboard/admin/retailers",
          },
          {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/admin/settings",
          },
        ]
      : [
          {
            label: "Dashboard",
            icon: LayoutDashboard,
            href: "/dashboard/retailer/dashboard",
          },
          {
            label: "Products",
            icon: Package,
            href: "/dashboard/retailer/products",
          },
          {
            label: "Orders",
            icon: ShoppingCart,
            href: "/dashboard/retailer/orders",
          },
          {
            label: "Settings",
            icon: Settings,
            href: "/dashboard/retailer/settings",
          },
        ];

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 antialiased">
      {/* Header - Common for both roles */}
      <Link href={"/"}>
        <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded bg-primary text-white flex items-center justify-center font-bold">
                BW
              </div>
              <h1 className="text-xl font-semibold">Binary Wholesale</h1>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm">
                {user?.fullName || "User"}
              </Button>
            </div>
          </div>
        </header>
      </Link>

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - Role-based items */}
        <aside className="hidden w-64 flex-shrink-0 border-r bg-white md:block">
          <nav className="mt-6 flex flex-col gap-2 px-3">
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={`w-full justify-start gap-3 ${
                    isActive(item.href)
                      ? "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white"
                      : ""
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Button>
              </Link>
            ))}

            {/* Spacer */}
            <div className="my-4 border-t" />

            {/* Sign out - Common for both */}
            <Link href="/signin">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <LogOut className="h-5 w-5" />
                Sign out
              </Button>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
