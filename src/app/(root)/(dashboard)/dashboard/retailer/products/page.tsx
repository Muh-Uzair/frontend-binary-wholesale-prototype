"use client";

import React, { useState } from "react";
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
import { ShoppingCart, Search, Plus } from "lucide-react";

// Dummy products for retailer view (same schema as before)
const dummyProducts = [
  {
    _id: "1",
    name: "Cooking Oil 5L",
    category: "grocery",
    brand: "Mezan",
    variants: ["5L", "10L"],
    stock: 150,
    inStock: true,
    moq: 5,
    pricePerUnit: 1200, // dummy wholesale price for retailer
  },
  {
    _id: "2",
    name: "Fairness Cream 50g",
    category: "beauty",
    brand: "Fair & Lovely",
    variants: ["50g", "100g"],
    stock: 80,
    inStock: true,
    moq: 10,
    pricePerUnit: 350,
  },
  {
    _id: "3",
    name: "Basmati Rice 10kg",
    category: "grocery",
    brand: "Super Kernel",
    variants: ["5kg", "10kg"],
    stock: 45,
    inStock: true,
    moq: 2,
    pricePerUnit: 2800,
  },
  {
    _id: "4",
    name: "Shampoo 400ml",
    category: "beauty",
    brand: "Head & Shoulders",
    variants: ["200ml", "400ml"],
    stock: 120,
    inStock: true,
    moq: 6,
    pricePerUnit: 450,
  },
  // Add more as needed
];

export default function DashboardRetailerProductsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [cartCount, setCartCount] = useState(0); // dummy cart counter

  const filteredProducts = dummyProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(search.toLowerCase())),
  );

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
    // Future: real cart logic yahan aayega
  };

  return (
    <div className="space-y-6">
      {/* Header with Cart Indicator */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Available Products</h1>
        <Button variant="outline" className="gap-2">
          <ShoppingCart className="h-4 w-4" />
          Cart ({cartCount})
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search products by name, brand or category..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="pl-10"
        />
      </div>

      {/* Products Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Price/Unit</TableHead>
              <TableHead>MOQ</TableHead>
              <TableHead>Stock Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product._id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{product.category}</Badge>
                </TableCell>
                <TableCell>{product.brand || "-"}</TableCell>
                <TableCell>{product.variants.join(", ")}</TableCell>
                <TableCell>₹{product.pricePerUnit.toLocaleString()}</TableCell>
                <TableCell>{product.moq}</TableCell>
                <TableCell>
                  {product.inStock ? (
                    <Badge variant="default" className="bg-green-600">
                      In Stock ({product.stock})
                    </Badge>
                  ) : (
                    <Badge variant="destructive">Out of Stock</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    className="gap-1"
                    onClick={handleAddToCart}
                    disabled={!product.inStock}
                  >
                    <Plus className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {paginatedProducts.length} of {filteredProducts.length}{" "}
          products
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
    </div>
  );
}
