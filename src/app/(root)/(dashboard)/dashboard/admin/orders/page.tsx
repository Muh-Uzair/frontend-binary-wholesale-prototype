"use client";

import React, { useState } from "react";
import { useUserStore } from "@/store/userStore";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// ────────────────────────────────────────────────
// Dummy orders — aligned with your Order schema
// ────────────────────────────────────────────────
const dummyOrders = [
  {
    _id: "ord_001",
    user: "u2", // reference to retailer/user
    orderItems: [
      {
        product: "prod_1",
        name: "Cooking Oil 5L",
        qty: 3,
        price: 1450,
        image: "https://example.com/oil.jpg",
      },
      {
        product: "prod_3",
        name: "Basmati Rice 10kg",
        qty: 2,
        price: 3200,
        image: "https://example.com/rice.jpg",
      },
    ],
    shippingAddress: {
      address: "House 45, Street 12, F-11/3",
      city: "Islamabad",
      postalCode: "44000",
      country: "Pakistan",
    },
    paymentMethod: "cash",
    totalPrice: 9750,
    isPaid: true,
    paidAt: new Date("2026-01-10T14:30:00Z"),
    isDelivered: false,
    status: "shipped",
    createdAt: new Date("2026-01-08T11:15:00Z"),
  },
  {
    _id: "ord_002",
    user: "u4",
    orderItems: [
      {
        product: "prod_2",
        name: "Fairness Cream 50g",
        qty: 10,
        price: 450,
        image: "https://example.com/cream.jpg",
      },
    ],
    shippingAddress: {
      address: "Shop #8, Blue Area",
      city: "Rawalpindi",
      postalCode: "46000",
      country: "Pakistan",
    },
    paymentMethod: "card",
    paymentResult: {
      id: "pay_789abc",
      status: "succeeded",
      update_time: "2026-01-15T09:22:11Z",
      email_address: "sana.malik.shop@yahoo.com",
    },
    totalPrice: 4500,
    isPaid: true,
    paidAt: new Date("2026-01-15T09:20:00Z"),
    isDelivered: true,
    deliveredAt: new Date("2026-01-18T16:45:00Z"),
    status: "delivered",
    createdAt: new Date("2026-01-14T17:40:00Z"),
  },
  {
    _id: "ord_003",
    user: "u1",
    orderItems: [
      {
        product: "prod_1",
        name: "Cooking Oil 5L",
        qty: 5,
        price: 1400,
        image: "https://example.com/oil.jpg",
      },
    ],
    shippingAddress: {
      address: "Plot 112, I-9 Industrial Area",
      city: "Islamabad",
      postalCode: "44000",
      country: "Pakistan",
    },
    paymentMethod: "cash",
    totalPrice: 7000,
    isPaid: false,
    isDelivered: false,
    status: "pending",
    createdAt: new Date("2026-01-20T10:05:00Z"),
  },
  {
    _id: "ord_004",
    user: "u5",
    orderItems: [
      {
        product: "prod_3",
        name: "Basmati Rice 10kg",
        qty: 4,
        price: 3150,
        image: "https://example.com/rice.jpg",
      },
      {
        product: "prod_2",
        name: "Fairness Cream 50g",
        qty: 6,
        price: 440,
        image: "https://example.com/cream.jpg",
      },
    ],
    shippingAddress: {
      address: "G-13/2, Street 22",
      city: "Islamabad",
      postalCode: "44220",
      country: "Pakistan",
    },
    paymentMethod: "stripe",
    totalPrice: 15040,
    isPaid: true,
    paidAt: new Date("2026-01-19T13:10:00Z"),
    isDelivered: false,
    status: "processing",
    createdAt: new Date("2026-01-18T08:55:00Z"),
  },
];

export default function DashboardAdminOrders() {
  const { user, isAuthenticated } = useUserStore();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const filteredOrders = dummyOrders.filter(
    (order) =>
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.shippingAddress.city.toLowerCase().includes(search.toLowerCase()) ||
      order.status.toLowerCase().includes(search.toLowerCase()),
  );

  const paginatedOrders = filteredOrders.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "outline";
      case "delivered":
        return "success";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Orders Management</h1>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by order ID, city or status..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order._id}>
                <TableCell className="font-medium">#{order._id}</TableCell>
                <TableCell>{order.orderItems.length} item(s)</TableCell>
                <TableCell>Rs. {order.totalPrice.toLocaleString()}</TableCell>
                <TableCell>{order.shippingAddress.city}</TableCell>
                <TableCell className="capitalize">
                  {order.paymentMethod}
                </TableCell>
                <TableCell>
                  <Badge variant={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(order.createdAt).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                  <Button variant="ghost" size="sm">
                    Update
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {paginatedOrders.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {filteredOrders.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {paginatedOrders.length} of {filteredOrders.length} orders
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
