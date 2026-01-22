"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreditCard, Lock, Truck, ArrowRight, Check } from "lucide-react";

// Dummy cart items (same as in CartPage)
const dummyCartItems = [
  {
    id: "1",
    name: "Cooking Oil 5L",
    variant: "5L",
    price: 1450,
    quantity: 3,
    image:
      "https://images.unsplash.com/photo-1621951753010-1795658a5f5d?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "2",
    name: "Fairness Cream 50g",
    variant: "50g",
    price: 450,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=800&auto=format&fit=crop&q=80",
  },
  {
    id: "3",
    name: "Basmati Rice 10kg",
    variant: "10kg",
    price: 3200,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1586201836022-8b3e2c0d0c5f?w=800&auto=format&fit=crop&q=80",
  },
];

export default function CheckoutPage() {
  const subtotal = dummyCartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left – Order Summary / Products */}
        <div className="lg:col-span-3 space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Order Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {dummyCartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 py-4 border-b last:border-b-0"
                >
                  <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{item.name}</h3>
                    {item.variant && (
                      <p className="text-sm text-muted-foreground">
                        Variant: {item.variant}
                      </p>
                    )}
                    <div className="mt-1 flex items-baseline gap-3">
                      <span className="font-semibold">
                        Rs. {item.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        × {item.quantity}
                      </span>
                    </div>
                  </div>

                  <div className="text-right font-medium whitespace-nowrap">
                    Rs. {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}

              <div className="space-y-3 pt-4">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Rs. {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
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
            </CardContent>
          </Card>

          {/* Delivery Address (you can expand later) */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p className="font-medium">Muhammad</p>
                <p>House #12, Street 45, F-11/3</p>
                <p>Islamabad, 44000, Pakistan</p>
                <p className="text-muted-foreground">+92 300 1234567</p>
                <Button variant="outline" size="sm">
                  Change address
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right – Payment Form */}
        <div className="lg:col-span-2">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Card brand selection */}
              <div className="space-y-2">
                <Label>Card Type</Label>
                <Select defaultValue="visa">
                  <SelectTrigger>
                    <SelectValue placeholder="Select card type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visa">Visa</SelectItem>
                    <SelectItem value="mastercard">Mastercard</SelectItem>
                    <SelectItem value="amex">American Express</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Card number */}
              <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="pl-10"
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input id="expiry" placeholder="MM / YY" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC / CVV</Label>
                  <div className="relative">
                    <Input id="cvc" placeholder="123" maxLength={4} />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Cardholder name */}
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card</Label>
                <Input id="cardName" placeholder="Muhammad Ali" />
              </div>

              <div className="pt-4">
                <Button className="w-full py-6 text-lg" size="lg">
                  Pay Rs. {total.toLocaleString()}{" "}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground pt-2">
                <div className="flex items-center justify-center gap-1.5">
                  <Lock className="h-4 w-4" />
                  <span>Secure payment • Encrypted</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
