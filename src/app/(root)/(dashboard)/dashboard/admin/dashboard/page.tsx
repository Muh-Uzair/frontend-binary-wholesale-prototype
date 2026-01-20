"use client";

import { useUserStore } from "@/store/userStore";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowUpRight,
  Package,
  Users,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

// Dummy data for cards
const stats = [
  {
    title: "Total Products",
    value: "1,248",
    description: "+12% from last month",
    icon: Package,
    trend: "up",
  },
  {
    title: "Active Retailers",
    value: "342",
    description: "+8 new this week",
    icon: Users,
    trend: "up",
  },
  {
    title: "Total Orders",
    value: "5,672",
    description: "+18% this month",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Revenue (PKR)",
    value: "₹4.8M",
    description: "+22% from last month",
    icon: DollarSign,
    trend: "up",
  },
];

// Dummy data for Bar Chart (Orders last 7 days)
const orderData = [
  { name: "Mon", orders: 120 },
  { name: "Tue", orders: 190 },
  { name: "Wed", orders: 150 },
  { name: "Thu", orders: 210 },
  { name: "Fri", orders: 180 },
  { name: "Sat", orders: 240 },
  { name: "Sun", orders: 130 },
];

// Dummy data for Pie Chart (Product Categories)
const categoryData = [
  { name: "Grocery", value: 65 },
  { name: "Beauty", value: 25 },
  { name: "Others", value: 10 },
];

const COLORS = ["#6366f1", "#a5b4fc", "#e0e7ff"];

export default function DashboardAdminDashboard() {
  const { user, isAuthenticated } = useUserStore();

  console.log("User:", user, "Authenticated:", isAuthenticated);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.fullName || "Admin"}
        </h1>
        <p className="text-muted-foreground">
          Here&apos;s what&apos;s happening in your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                {stat.description}
                {stat.trend === "up" && (
                  <ArrowUpRight className="h-3 w-3 text-green-500" />
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Orders Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Orders This Week</CardTitle>
            <CardDescription>Daily order volume (last 7 days)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={orderData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Category Pie Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Product Category Distribution</CardTitle>
            <CardDescription>Percentage breakdown of inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name }) => `${name} ${(30 * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Legend below chart */}
            <div className="flex justify-center gap-6 mt-4">
              {categoryData.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: COLORS[index] }}
                  />
                  <span className="text-sm">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Badges (optional extra touch) */}
      <div className="flex flex-wrap gap-3">
        <Badge variant="outline" className="px-4 py-2 text-base">
          Low Stock Items:{" "}
          <span className="font-bold text-red-600 ml-1">18</span>
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-base">
          Pending Orders:{" "}
          <span className="font-bold text-amber-600 ml-1">42</span>
        </Badge>
        <Badge variant="outline" className="px-4 py-2 text-base">
          New Retailers Today:{" "}
          <span className="font-bold text-green-600 ml-1">7</span>
        </Badge>
      </div>
    </div>
  );
}
