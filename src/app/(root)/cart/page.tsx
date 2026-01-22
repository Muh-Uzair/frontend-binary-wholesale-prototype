"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus, ArrowRight, ShoppingCart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { toast } from "sonner";

// Dummy recommended products (you can fetch these from API later)
const recommendedProducts = [
  {
    _id: "rec_1",
    name: "Sugar 5kg",
    price: 850,
    brand: "Local",
    category: "grocery",
    description: "Premium quality sugar",
    images:
      "https://images.unsplash.com/photo-1617890686219-509e1a0596e2?w=400",
    stock: 100,
    moq: 1,
    variants: ["5kg"],
    inStock: true,
  },
  {
    _id: "rec_2",
    name: "Shampoo 400ml",
    price: 750,
    brand: "Head & Shoulders",
    category: "beauty",
    description: "Anti-dandruff shampoo",
    images:
      "https://images.unsplash.com/photo-1608248597788-35336b9d0d5b?w=400",
    stock: 50,
    moq: 2,
    variants: ["400ml"],
    inStock: true,
  },
  {
    _id: "rec_3",
    name: "Dishwash Gel 1L",
    price: 420,
    brand: "Vim",
    category: "grocery",
    description: "Powerful dishwashing gel",
    images:
      "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=400",
    stock: 80,
    moq: 3,
    variants: ["1L"],
    inStock: true,
  },
];

export default function CartPage() {
  const {
    items,
    totalPrice,
    removeFromCart,
    updateQuantity,
    clearCart,
    addToCart,
  } = useCartStore();
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const isEmpty = items.length === 0;
  const subtotal = totalPrice;
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping - discount;

  const handleRemoveItem = (productId: string, productName: string) => {
    removeFromCart(productId);
    toast.success(`${productName} removed from cart`);
  };

  const handleIncreaseQuantity = (item: any) => {
    if (item.quantity >= item.stock) {
      toast.error(`Cannot add more. Only ${item.stock} units available`);
      return;
    }
    updateQuantity(item._id, item.quantity + 1);
  };

  const handleDecreaseQuantity = (item: any) => {
    if (item.quantity <= 1) {
      handleRemoveItem(item._id, item.name);
      return;
    }
    updateQuantity(item._id, item.quantity - 1);
  };

  const handleApplyPromo = () => {
    if (!promoCode.trim()) {
      toast.error("Please enter a promo code");
      return;
    }

    // Dummy promo code validation
    const validCodes = {
      SAVE10: 0.1, // 10% discount
      SAVE20: 0.2, // 20% discount
      FLAT500: 500, // Flat 500 off
    };

    const code = promoCode.toUpperCase();
    if (validCodes[code]) {
      const discountValue =
        typeof validCodes[code] === "number" && validCodes[code] < 1
          ? subtotal * validCodes[code]
          : validCodes[code];
      setDiscount(discountValue);
      toast.success(
        `Promo code applied! You saved Rs. ${discountValue.toFixed(0)}`,
      );
    } else {
      toast.error("Invalid promo code");
    }
  };

  const handleAddRecommended = (product: any) => {
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
      product.moq,
    );
    toast.success(`${product.name} added to cart!`);
  };

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
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Shopping Cart</h1>
        <Button
          variant="outline"
          onClick={() => {
            clearCart();
            toast.success("Cart cleared");
          }}
          className="text-destructive hover:text-destructive"
        >
          Clear Cart
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card rounded-lg border shadow-sm">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">
                Your Items ({items.length})
              </h2>

              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 py-6 border-b last:border-b-0"
                >
                  {/* Image */}
                  <div className="h-24 w-24 sm:h-32 sm:w-32 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={item.images || "/placeholder-product.jpg"}
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
                        <p className="text-sm text-muted-foreground mt-1">
                          Brand: {item.brand}
                        </p>
                        {item.selectedVariant && (
                          <p className="text-sm text-muted-foreground">
                            Variant: {item.selectedVariant}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">
                          MOQ: {item.moq} • Stock: {item.stock}
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          Rs. {item.price.toLocaleString()}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Subtotal: Rs.{" "}
                          {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive/90"
                        onClick={() => handleRemoveItem(item._id, item.name)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-4">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleDecreaseQuantity(item)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-medium">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-9 w-9"
                        onClick={() => handleIncreaseQuantity(item)}
                        disabled={item.quantity >= item.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Products */}
          <div className="bg-card rounded-lg border shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-6">You may also like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {recommendedProducts.map((prod) => (
                <Card
                  key={prod._id}
                  className="overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-square bg-muted">
                    <img
                      src={prod.images}
                      alt={prod.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-medium line-clamp-2 text-sm">
                      {prod.name}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {prod.brand}
                    </p>
                    <p className="text-sm font-semibold mt-2">
                      Rs. {prod.price.toLocaleString()}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="w-full mt-3"
                      onClick={() => handleAddRecommended(prod)}
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
                  <span>Subtotal ({items.length} items)</span>
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

                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span>- Rs. {discount.toLocaleString()}</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>Rs. {total.toLocaleString()}</span>
                </div>
              </div>

              <Link href="/checkout">
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
