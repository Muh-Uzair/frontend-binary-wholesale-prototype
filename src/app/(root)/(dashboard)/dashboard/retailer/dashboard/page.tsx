"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  ShoppingCart,
  DollarSign,
  Clock,
  Package,
  AlertCircle,
  ArrowUpRight,
} from "lucide-react";

// Dummy stats for retailer dashboard
const retailerStats = [
  {
    title: "Total Orders",
    value: "184",
    description: "+15 this month",
    icon: ShoppingCart,
    trend: "up",
  },
  {
    title: "Pending Payments",
    value: "₹285,000",
    description: "5 invoices due",
    icon: DollarSign,
    trend: "warning",
  },
  {
    title: "Pending Orders",
    value: "12",
    description: "Awaiting delivery",
    icon: Clock,
    trend: "neutral",
  },
  {
    title: "Low Stock Items",
    value: "7",
    description: "Restock needed",
    icon: Package,
    trend: "down",
  },
];

// Dummy data for recent orders bar chart (last 7 days)
const recentOrdersData = [
  { name: "Mon", orders: 8 },
  { name: "Tue", orders: 12 },
  { name: "Wed", orders: 9 },
  { name: "Thu", orders: 15 },
  { name: "Fri", orders: 11 },
  { name: "Sat", orders: 18 },
  { name: "Sun", orders: 6 },
];

export default function DashboardRetailerDashboard() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, Retailer
        </h1>
        <p className="text-muted-foreground">
          Your quick overview of orders, payments and inventory status.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {retailerStats.map((stat, index) => (
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
                {stat.trend === "warning" && (
                  <AlertCircle className="h-3 w-3 text-amber-500" />
                )}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Orders Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders (Last 7 Days)</CardTitle>
          <CardDescription>Your daily order volume this week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={recentOrdersData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="orders" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions & Alerts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Pending Payments Card */}
        <Card>
          <CardHeader>
            <CardTitle>Pending Payments</CardTitle>
            <CardDescription>Overdue invoices</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Invoice #INV-4567</p>
                <p className="text-sm text-muted-foreground">
                  Due 3 days ago • ₹85,000
                </p>
              </div>
              <Button variant="outline" size="sm">
                Pay Now
              </Button>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Invoice #INV-4589</p>
                <p className="text-sm text-muted-foreground">
                  Due tomorrow • ₹120,000
                </p>
              </div>
              <Button variant="outline" size="sm">
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Low Stock Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Low Stock Alerts</CardTitle>
            <CardDescription>Items that need restocking soon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Cooking Oil 5L</p>
                  <p className="text-sm text-muted-foreground">
                    Only 18 units left
                  </p>
                </div>
              </div>
              <Badge variant="outline">Low</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-amber-500" />
                <div>
                  <p className="font-medium">Fairness Cream 50g</p>
                  <p className="text-sm text-muted-foreground">
                    Only 9 units left
                  </p>
                </div>
              </div>
              <Badge variant="outline">Critical</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Links */}
      <div className="flex flex-wrap gap-4">
        <Button variant="outline" className="flex-1">
          View All Orders
        </Button>
        <Button variant="outline" className="flex-1">
          Browse Products
        </Button>
        <Button variant="outline" className="flex-1">
          Make New Order
        </Button>
        <Button variant="outline" className="flex-1">
          Payment History
        </Button>
      </div>
    </div>
  );
}
