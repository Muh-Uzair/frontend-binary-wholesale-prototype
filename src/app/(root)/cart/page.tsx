"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// ────────────────────────────────────────────────
// Dummy cart items
// ────────────────────────────────────────────────
const dummyCartItems = [
  {
    id: "1",
    productId: "prod_1",
    name: "Cooking Oil 5L",
    variant: "5L",
    price: 1450,
    quantity: 3,
    image:
      "https://images.unsplash.com/photo-1621951753010-1795658a5f5d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    productId: "prod_2",
    name: "Fairness Cream 50g",
    variant: "50g",
    price: 450,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    productId: "prod_3",
    name: "Basmati Rice 10kg",
    variant: "10kg",
    price: 3200,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1586201836022-8b3e2c0d0c5f?w=800&auto=format&fit=crop&q=80",
  },
];

// Dummy recommended products
const recommendedProducts = [
  {
    id: "prod_4",
    name: "Sugar 5kg",
    price: 850,
    image: "https://images.unsplash.com/photo-1617890686219-509e1a0596e2?w=400",
  },
  {
    id: "prod_5",
    name: "Shampoo 400ml",
    price: 750,
    image: "https://images.unsplash.com/photo-1608248597788-35336b9d0d5b?w=400",
  },
  {
    id: "prod_6",
    name: "Dishwash Gel 1L",
    price: 420,
    image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400",
  },
];

export default function CartPage() {
  const cartItems = dummyCartItems; // ← replace with real cart state later
  const isEmpty = cartItems.length === 0;

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  if (isEmpty) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Looks like you haven&apos;t added anything yet. Start shopping to fill
          it up!
        </p>
        <Button size="lg" asChild>
          <a href="/products">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Your Items ({cartItems.length})
              </h2>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-6 border-b last:border-b-0"
                >
                  {/* Image - using normal <img> */}
                  <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-lg line-clamp-2">
                          {item.name}
                        </h3>
                        {item.variant && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Variant: {item.variant}
                          </p>
                        )}
                        <p className="text-lg font-semibold mt-2">
                          Rs. {item.price.toLocaleString()}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-3 mt-4">
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button variant="outline" size="icon" className="h-9 w-9">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended / Similar Products */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {recommendedProducts.map((prod) => (
                <Card
                  key={prod.id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium line-clamp-2">{prod.name}</h4>
                    <p className="text-sm font-semibold mt-1">
                      Rs. {prod.price.toLocaleString()}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full mt-3"
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-lg border shadow-sm sticky top-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.length} items)</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "text-green-600" : ""}>
                    {shipping === 0
                      ? "Free"
                      : `Rs. ${shipping.toLocaleString()}`}
                  </span>
                </div>

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="mt-6">
                <label
                  htmlFor="promo"
                  className="block text-sm font-medium mb-2"
                >
                  Promo Code
                </label>
                <div className="flex gap-2">
                  <Input id="promo" placeholder="Enter code" />
                  <Button variant="secondary">Apply</Button>
                </div>
              </div>

              <Link href={"/checkout"}>
                <Button className="w-full mt-8 py-6 text-lg" size="lg">
                  Proceed to Checkout <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>

              <p className="text-center text-sm text-muted-foreground mt-4">
                Secure checkout • Free returns
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
