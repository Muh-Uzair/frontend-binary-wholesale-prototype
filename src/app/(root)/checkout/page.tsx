"use client";

import React, { useState } from "react";
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
import {
  CreditCard,
  Lock,
  Truck,
  ArrowRight,
  Check,
  ShoppingCart,
} from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCartStore();
  const { user, isAuthenticated } = useUserStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    cardType: "visa",
    cardNumber: "",
    expiryDate: "",
    cvc: "",
    cardholderName: "",
  });

  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.fullName || "",
    phone: user?.phone || "",
    address: "",
    city: "",
    postalCode: "",
    country: "Pakistan",
  });

  const subtotal = totalPrice;
  const shipping = subtotal > 5000 ? 0 : 350;
  const total = subtotal + shipping;

  const handlePaymentChange = (field: string, value: string) => {
    setPaymentDetails((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleAddressChange = (field: string, value: string) => {
    setShippingAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePlaceOrder = async () => {
    // Validation
    if (!isAuthenticated) {
      toast.error("Please log in to place an order");
      router.push("/login");
      return;
    }

    if (items.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode
    ) {
      toast.error("Please fill in all shipping address fields");
      return;
    }

    if (
      !paymentDetails.cardNumber ||
      !paymentDetails.expiryDate ||
      !paymentDetails.cvc ||
      !paymentDetails.cardholderName
    ) {
      toast.error("Please fill in all payment details");
      return;
    }

    setIsProcessing(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Prepare order data
    const orderData = {
      orderId: `ORD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user: {
        id: user?._id,
        fullName: user?.fullName,
        email: user?.email,
        phone: user?.phone,
        role: user?.role,
      },
      items: items.map((item) => ({
        productId: item._id,
        name: item.name,
        brand: item.brand,
        category: item.category,
        variant: item.selectedVariant,
        price: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity,
        moq: item.moq,
      })),
      pricing: {
        subtotal,
        shipping,
        total,
        currency: "PKR",
      },
      shippingAddress,
      paymentDetails: {
        cardType: paymentDetails.cardType,
        cardNumberLast4: paymentDetails.cardNumber.slice(-4),
        cardholderName: paymentDetails.cardholderName,
        // Note: In production, NEVER log full card details
      },
      orderStatus: "confirmed",
      paymentStatus: "paid",
    };

    // Log the complete order details (for dummy project)
    console.log("═══════════════════════════════════════════════");
    console.log("🛒 ORDER PLACED SUCCESSFULLY");
    console.log("═══════════════════════════════════════════════");
    console.log("📦 Order Details:", JSON.stringify(orderData, null, 2));
    console.log("═══════════════════════════════════════════════");
    console.log("👤 User Information:");
    console.log("   - ID:", orderData.user.id);
    console.log("   - Name:", orderData.user.fullName);
    console.log("   - Email:", orderData.user.email);
    console.log("   - Phone:", orderData.user.phone);
    console.log("═══════════════════════════════════════════════");
    console.log("📋 Cart Items:");
    orderData.items.forEach((item, idx) => {
      console.log(`   ${idx + 1}. ${item.name}`);
      console.log(`      - Brand: ${item.brand}`);
      console.log(`      - Variant: ${item.variant}`);
      console.log(`      - Price: Rs. ${item.price}`);
      console.log(`      - Quantity: ${item.quantity}`);
      console.log(`      - Subtotal: Rs. ${item.subtotal}`);
    });
    console.log("═══════════════════════════════════════════════");
    console.log("💰 Payment Summary:");
    console.log("   - Subtotal: Rs.", orderData.pricing.subtotal);
    console.log("   - Shipping: Rs.", orderData.pricing.shipping);
    console.log("   - Total: Rs.", orderData.pricing.total);
    console.log("═══════════════════════════════════════════════");
    console.log("🚚 Shipping Address:");
    console.log("   - Name:", orderData.shippingAddress.fullName);
    console.log("   - Phone:", orderData.shippingAddress.phone);
    console.log("   - Address:", orderData.shippingAddress.address);
    console.log("   - City:", orderData.shippingAddress.city);
    console.log("   - Postal Code:", orderData.shippingAddress.postalCode);
    console.log("   - Country:", orderData.shippingAddress.country);
    console.log("═══════════════════════════════════════════════");
    console.log("💳 Payment Information:");
    console.log(
      "   - Card Type:",
      orderData.paymentDetails.cardType.toUpperCase(),
    );
    console.log(
      "   - Last 4 Digits:",
      orderData.paymentDetails.cardNumberLast4,
    );
    console.log("   - Cardholder:", orderData.paymentDetails.cardholderName);
    console.log("═══════════════════════════════════════════════");
    console.log("✅ Order Status:", orderData.orderStatus);
    console.log("✅ Payment Status:", orderData.paymentStatus);
    console.log("═══════════════════════════════════════════════\n\n");

    // Show success message
    toast.success("Order placed successfully! Check console for details.", {
      duration: 5000,
    });

    // Clear cart
    clearCart();

    setIsProcessing(false);

    // Redirect to success page (you can create this later)
    setTimeout(() => {
      router.push("/");
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 min-h-[70vh] flex flex-col items-center justify-center text-center">
        <ShoppingCart className="h-20 w-20 text-muted-foreground mb-6" />
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <p className="text-muted-foreground mb-8 max-w-md">
          Add some products to your cart before checking out.
        </p>
        <Button size="lg" asChild>
          <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

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
                Order Summary ({items.length} items)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {items.map((item) => (
                <div
                  key={item._id}
                  className="flex gap-4 py-4 border-b last:border-b-0"
                >
                  <div className="h-20 w-20 flex-shrink-0 rounded-md overflow-hidden bg-muted">
                    <img
                      src={item.images || "/placeholder-product.jpg"}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Brand: {item.brand}
                    </p>
                    {item.selectedVariant && (
                      <p className="text-sm text-muted-foreground">
                        Variant: {item.selectedVariant}
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

          {/* Delivery Address */}
          <Card>
            <CardHeader>
              <CardTitle>Delivery Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      value={shippingAddress.fullName}
                      onChange={(e) =>
                        handleAddressChange("fullName", e.target.value)
                      }
                      placeholder="Muhammad Ali"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={shippingAddress.phone}
                      onChange={(e) =>
                        handleAddressChange("phone", e.target.value)
                      }
                      placeholder="+92 300 1234567"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    value={shippingAddress.address}
                    onChange={(e) =>
                      handleAddressChange("address", e.target.value)
                    }
                    placeholder="House #12, Street 45, F-11/3"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      value={shippingAddress.city}
                      onChange={(e) =>
                        handleAddressChange("city", e.target.value)
                      }
                      placeholder="Islamabad"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      value={shippingAddress.postalCode}
                      onChange={(e) =>
                        handleAddressChange("postalCode", e.target.value)
                      }
                      placeholder="44000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">Country</Label>
                    <Input
                      id="country"
                      value={shippingAddress.country}
                      disabled
                    />
                  </div>
                </div>
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
                <Select
                  value={paymentDetails.cardType}
                  onValueChange={(value) =>
                    handlePaymentChange("cardType", value)
                  }
                >
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
                <Label htmlFor="cardNumber">Card Number *</Label>
                <div className="relative">
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="pl-10"
                    value={paymentDetails.cardNumber}
                    onChange={(e) =>
                      handlePaymentChange("cardNumber", e.target.value)
                    }
                    maxLength={19}
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                </div>
              </div>

              {/* Expiry & CVC */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiry">Expiry Date *</Label>
                  <Input
                    id="expiry"
                    placeholder="MM / YY"
                    value={paymentDetails.expiryDate}
                    onChange={(e) =>
                      handlePaymentChange("expiryDate", e.target.value)
                    }
                    maxLength={7}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvc">CVC / CVV *</Label>
                  <div className="relative">
                    <Input
                      id="cvc"
                      placeholder="123"
                      maxLength={4}
                      value={paymentDetails.cvc}
                      onChange={(e) =>
                        handlePaymentChange("cvc", e.target.value)
                      }
                    />
                    <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Cardholder name */}
              <div className="space-y-2">
                <Label htmlFor="cardName">Name on Card *</Label>
                <Input
                  id="cardName"
                  placeholder="Muhammad Ali"
                  value={paymentDetails.cardholderName}
                  onChange={(e) =>
                    handlePaymentChange("cardholderName", e.target.value)
                  }
                />
              </div>

              <div className="pt-4">
                <Button
                  className="w-full py-6 text-lg"
                  size="lg"
                  onClick={handlePlaceOrder}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      Pay Rs. {total.toLocaleString()}{" "}
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </>
                  )}
                </Button>
              </div>

              <div className="text-center text-sm text-muted-foreground pt-2">
                <div className="flex items-center justify-center gap-1.5">
                  <Lock className="h-4 w-4" />
                  <span>Secure payment • Encrypted</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-xs text-blue-800">
                  💡 <strong>Note:</strong> This is a demo project. Order
                  details will be logged to the console when you click
                  &quot;Pay&quot;.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
