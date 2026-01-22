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
import { Badge } from "@/components/ui/badge"; // assuming you have Badge from shadcn

// ────────────────────────────────────────────────
// Dummy retailers (matching your User schema)
// ────────────────────────────────────────────────
const dummyRetailers = [
  {
    _id: "u1",
    fullName: "Ahmed Khan",
    email: "ahmed.khan.retail@gmail.com",
    role: "retailer",
    phone: "+92-321-4567890",
    createdAt: "2025-08-15T10:30:00.000Z",
  },
  {
    _id: "u2",
    fullName: "Sana Malik",
    email: "sana.malik.shop@yahoo.com",
    role: "retailer",
    phone: "0333-9876543",
    createdAt: "2025-09-02T14:15:00.000Z",
  },
  {
    _id: "u3",
    fullName: "Bilal Traders",
    email: "bilal.traders786@outlook.com",
    role: "retailer",
    phone: "+923001234567",
    createdAt: "2025-10-10T09:45:00.000Z",
  },
  {
    _id: "u4",
    fullName: "Ayesha Cosmetics",
    email: "ayesha.beauty.pk@gmail.com",
    role: "retailer",
    phone: "0315-5556677",
    createdAt: "2025-11-20T16:20:00.000Z",
  },
  {
    _id: "u5",
    fullName: "Zain Grocery Store",
    email: "zain.grocery.isb@hotmail.com",
    role: "retailer",
    phone: "+92-300-1122334",
    createdAt: "2025-12-05T11:10:00.000Z",
  },
  {
    _id: "u6",
    fullName: "Hina Boutique",
    email: "hina.fashion@live.com",
    role: "retailer",
    phone: "0346-7890123",
    createdAt: "2026-01-08T13:55:00.000Z",
  },
];

export default function DashboardAdminRetailers() {
  const { user, isAuthenticated } = useUserStore();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  // Filter retailers
  const filteredRetailers = dummyRetailers.filter(
    (r) =>
      r.fullName.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase()),
  );

  // Pagination
  const paginatedRetailers = filteredRetailers.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredRetailers.length / itemsPerPage);

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Retailers Management</h1>

        {/* You can add "Invite Retailer" or "Add Retailer" button later */}
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" />
          Invite Retailer
        </Button> */}
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1); // reset to first page on new search
          }}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Joined</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedRetailers.map((retailer) => (
              <TableRow key={retailer._id}>
                <TableCell className="font-medium">
                  {retailer.fullName}
                </TableCell>
                <TableCell>{retailer.email}</TableCell>
                <TableCell>{retailer.phone || "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {retailer.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  {new Date(retailer.createdAt).toLocaleDateString("en-PK", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    Suspend
                  </Button>
                </TableCell>
              </TableRow>
            ))}

            {paginatedRetailers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No retailers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination & count */}
      {filteredRetailers.length > 0 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Showing {paginatedRetailers.length} of {filteredRetailers.length}{" "}
            retailers
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
