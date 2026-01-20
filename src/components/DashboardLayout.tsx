"use client";

import React, { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation"; // <-- yeh add karo
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
  const pathname = usePathname(); // current URL mil jayegi

  console.log("user ------------------------------\n", user);

  // Helper function to check if link is active
  const isActive = (path: string) => {
    // exact match ya sub-paths ke liye startsWith use kar sakte ho
    return pathname === path || pathname.startsWith(path + "/");
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 antialiased">
      {/* Header - Top Bar */}
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

      {/* Main Content Area with Sidebar */}
      <div className="flex flex-1">
        {/* Sidebar - Left Fixed */}
        <aside className="hidden w-64 flex-shrink-0 border-r bg-white md:block">
          <nav className="mt-6 flex flex-col gap-2 px-3">
            <Link href="/dashboard/admin/dashboard">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive("/dashboard/admin/dashboard")
                    ? "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white"
                    : ""
                }`}
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
              </Button>
            </Link>

            <Link href="/dashboard/admin/products">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive("/dashboard/admin/products")
                    ? "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white"
                    : ""
                }`}
              >
                <Package className="h-5 w-5" />
                Products
              </Button>
            </Link>

            <Link href="/dashboard/admin/orders">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive("/dashboard/admin/orders")
                    ? "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white"
                    : ""
                }`}
              >
                <ShoppingCart className="h-5 w-5" />
                Orders
              </Button>
            </Link>

            <Link href="/dashboard/admin/retailers">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive("/dashboard/admin/retailers")
                    ? "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white"
                    : ""
                }`}
              >
                <Users className="h-5 w-5" />
                Retailers
              </Button>
            </Link>

            <Link href="/dashboard/admin/settings">
              <Button
                variant="ghost"
                className={`w-full justify-start gap-3 ${
                  isActive("/dashboard/admin/settings")
                    ? "bg-indigo-500 text-white hover:bg-indigo-500 hover:text-white"
                    : ""
                }`}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Button>
            </Link>

            {/* Spacer */}
            <div className="my-4 border-t" />

            {/* Logout button (no active state needed) */}
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
