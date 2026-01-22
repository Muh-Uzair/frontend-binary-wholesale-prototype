"use client";
import React, { useState, useEffect } from "react";
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
  ChevronLeft,
  ChevronRight,
  Package,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const itemsPerPage = 10;

  // Get cart state and actions from Zustand
  const { totalItems, addToCart, toggleCart } = useCartStore();

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, [page, search, selectedCategories, priceRange]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: itemsPerPage.toString(),
        search: search,
      });

      if (selectedCategories.length > 0) {
        params.append("categories", selectedCategories.join(","));
      }

      params.append("minPrice", priceRange[0].toString());
      params.append("maxPrice", priceRange[1].toString());

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?${params.toString()}`,
      );
      const data = await response.json();

      if (data.success) {
        setProducts(data.data);
        setTotalPages(data.pagination.totalPages);
        setTotalProducts(data.pagination.total);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
    );
    setPage(1);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
    setPage(1);
  };

  const handleAddToCart = (product) => {
    if (!product.inStock) {
      toast.error("Product is out of stock");
      return;
    }

    // Add product to cart with MOQ as default quantity
    addToCart(
      {
        _id: product._id,
        name: product.name,
        description: product.description,
        category: product.category,
        brand: product.brand,
        images: product.images,
        price: product.price,
        moq: product.moq,
        stock: product.stock,
        selectedVariant: product.variants?.[0] || "",
      },
      product.moq, // Add MOQ quantity by default
    );

    toast.success(`${product.name} added to cart!`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Package className="w-8 h-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-800">
                Binary Wholesale
              </span>
            </div>

            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products, brands..."
                value={search}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>

            <Link href={"/cart"}>
              <Button
                variant="outline"
                className="relative"
                onClick={toggleCart}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart
                {totalItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 px-1.5 py-0.5 text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <aside className="w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">
                    Category
                  </Label>
                  <div className="space-y-2">
                    {["grocery", "beauty"].map((cat) => (
                      <div key={cat} className="flex items-center space-x-2">
                        <Checkbox
                          id={cat}
                          checked={selectedCategories.includes(cat)}
                          onCheckedChange={() => toggleCategory(cat)}
                        />
                        <Label
                          htmlFor={cat}
                          className="capitalize cursor-pointer"
                        >
                          {cat}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <Label className="text-sm font-semibold mb-3 block">
                    Price Range (PKR)
                  </Label>
                  <div className="space-y-4">
                    <Slider
                      min={0}
                      max={5000}
                      step={100}
                      value={priceRange}
                      onValueChange={handlePriceChange}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₨{priceRange[0]}</span>
                      <span>₨{priceRange[1]}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                All Products ({totalProducts})
              </h2>
              <p className="text-gray-600 text-sm mt-1">
                Page {page} of {totalPages}
              </p>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Spinner />
              </div>
            ) : products.length === 0 ? (
              <Card className="p-12">
                <div className="text-center">
                  <AlertCircle className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">
                    No products found matching your filters.
                  </p>
                </div>
              </Card>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <Card
                      key={product._id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <CardHeader className="p-0">
                        <div className="aspect-square bg-gray-100 relative">
                          <img
                            src={product.images || "/placeholder-product.jpg"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {product.inStock ? (
                            <Badge className="absolute top-2 right-2 bg-green-500">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge className="absolute top-2 right-2 bg-red-500">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <CardTitle className="text-lg mb-2 line-clamp-2">
                          {product.name}
                        </CardTitle>
                        <div className="flex gap-2 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {product.brand}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-xs capitalize"
                          >
                            {product.category}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-2xl font-bold text-blue-600">
                              ₨{product.price?.toLocaleString() || "N/A"}
                            </span>
                            <span className="text-sm text-gray-500">
                              MOQ: {product.moq}
                            </span>
                          </div>
                          {product.variants && product.variants.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {product.variants.map((variant, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {variant}
                                </Badge>
                              ))}
                            </div>
                          )}
                          <div className="text-sm text-gray-600">
                            Stock: {product.stock} units
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          className="w-full"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-4 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page === 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {page} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setPage((p) => Math.min(totalPages, p + 1))
                      }
                      disabled={page === totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
