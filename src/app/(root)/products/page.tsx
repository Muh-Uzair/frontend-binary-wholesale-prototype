"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  ShoppingCart,
  Filter,
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";

// Dummy products (same schema as before)
const dummyProducts = [
  {
    id: "1",
    name: "Cooking Oil 5L",
    category: "Grocery",
    brand: "Mezan",
    variants: ["5L", "10L"],
    price: 1200,
    moq: 5,
    stock: 150,
    inStock: true,
  },
  {
    id: "2",
    name: "Fairness Cream 50g",
    category: "Beauty",
    brand: "Fair & Lovely",
    variants: ["50g", "100g"],
    price: 350,
    moq: 10,
    stock: 80,
    inStock: true,
  },
  {
    id: "3",
    name: "Basmati Rice 10kg",
    category: "Grocery",
    brand: "Super Kernel",
    variants: ["5kg", "10kg"],
    price: 2800,
    moq: 2,
    stock: 45,
    inStock: true,
  },
  {
    id: "4",
    name: "Shampoo 400ml",
    category: "Beauty",
    brand: "Head & Shoulders",
    variants: ["200ml", "400ml"],
    price: 450,
    moq: 6,
    stock: 120,
    inStock: true,
  },
  {
    id: "5",
    name: "Sugar 50kg Bag",
    category: "Grocery",
    brand: "Local",
    variants: ["50kg"],
    price: 4500,
    moq: 1,
    stock: 30,
    inStock: true,
  },
  {
    id: "6",
    name: "Face Wash 100ml",
    category: "Beauty",
    brand: "Neutrogena",
    variants: ["100ml", "200ml"],
    price: 280,
    moq: 12,
    stock: 25,
    inStock: true,
  },
  // Add more if needed
];

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const [cartCount, setCartCount] = useState(0);

  // Filter products
  const filteredProducts = dummyProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

    const matchesCategory =
      selectedCategories.length === 0 ||
      selectedCategories.includes(p.category);

    return matchesSearch && matchesPrice && matchesCategory;
  });

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage,
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleAddToCart = () => {
    setCartCount((prev) => prev + 1);
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header (no full navbar like homepage) */}
      <header className="sticky top-0 z-40 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">
              BW
            </div>
            <h1 className="text-xl font-bold">Binary Wholesale</h1>
          </Link>

          <div className="flex items-center gap-4">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Link href={"/cart"}>
              <Button variant="outline" className="gap-2 relative">
                <ShoppingCart className="h-5 w-5" />
                Cart
                {cartCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {cartCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="w-full md:w-64 space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Filter className="h-5 w-5" /> Filters
              </h3>

              {/* Category Filter */}
              <div className="space-y-3">
                <h4 className="font-medium">Category</h4>
                {["Grocery", "Beauty"].map((cat) => (
                  <div key={cat} className="flex items-center space-x-2">
                    <Checkbox
                      id={cat}
                      checked={selectedCategories.includes(cat)}
                      onCheckedChange={() => toggleCategory(cat)}
                    />
                    <Label htmlFor={cat}>{cat}</Label>
                  </div>
                ))}
              </div>

              {/* Price Range */}
              <div className="mt-8">
                <h4 className="font-medium mb-4">Price Range (PKR)</h4>
                <Slider
                  min={0}
                  max={5000}
                  step={100}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mb-2"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>₹{priceRange[0]}</span>
                  <span>₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">
                All Products ({filteredProducts.length})
              </h2>
            </div>

            {paginatedProducts.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                No products found matching your filters.
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <Card key={product.id} className="overflow-hidden">
                    <CardHeader className="p-4 pb-2">
                      <div className="h-40 bg-gray-100 rounded flex items-center justify-center">
                        <Package className="h-20 w-20 text-gray-400" />
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 pt-2">
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-2">
                        {product.brand} • {product.category}
                      </p>
                      <div className="flex justify-between items-center mb-2">
                        <p className="text-xl font-bold text-indigo-600">
                          ₹{product.price.toLocaleString()}
                        </p>
                        <Badge variant="outline">MOQ: {product.moq}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {product.inStock ? (
                          <Badge className="bg-green-600">
                            In Stock ({product.stock})
                          </Badge>
                        ) : (
                          <Badge variant="destructive">Out of Stock</Badge>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        className="w-full gap-2"
                        onClick={() => setCartCount((c) => c + 1)}
                        disabled={!product.inStock}
                      >
                        <ShoppingCart className="h-4 w-4" />
                        Add to Cart
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center mt-12 gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>

                <span className="text-sm font-medium">
                  Page {page} of {totalPages}
                </span>

                <Button
                  variant="outline"
                  size="icon"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
