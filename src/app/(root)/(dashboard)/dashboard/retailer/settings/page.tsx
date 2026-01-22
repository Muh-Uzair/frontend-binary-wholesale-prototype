"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Upload,
  Save,
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Lock,
} from "lucide-react";

export default function DashboardRetailerSettings() {
  // Dummy states for retailer profile
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [shopName, setShopName] = useState("Muhammad General Store");
  const [fullName, setFullName] = useState("Muhammad Ahmed");
  const [phone, setPhone] = useState("+923001234567");
  const [email, setEmail] = useState("muhammad@shop.com");
  const [address, setAddress] = useState("Shop #45, G-9 Markaz, Islamabad");

  const [orderNotifications, setOrderNotifications] = useState(true);
  const [deliveryUpdates, setDeliveryUpdates] = useState(true);
  const [promoAlerts, setPromoAlerts] = useState(true);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setProfileImage(url);
    }
  };

  const handleSave = () => {
    alert("Settings saved successfully! (Static demo)");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Retailer Settings</h1>
        <p className="text-muted-foreground">
          Update your shop details, preferences and notifications
        </p>
      </div>

      {/* Shop & Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shop & Profile</CardTitle>
          <CardDescription>
            Manage your shop information and personal details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profileImage || "/shop-placeholder.jpg"}
                alt="Shop/Owner"
              />
              <AvatarFallback>{shopName?.charAt(0) || "S"}</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <Label htmlFor="shop-image">Change Shop/Owner Photo</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="shop-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <label
                    htmlFor="shop-image"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Photo
                  </label>
                </Button>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fullName">Owner Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Shop Address</Label>
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <Input
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Profile Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose what updates you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order-notifications">
                New Order Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Get notified when your order is confirmed or shipped
              </p>
            </div>
            <Switch
              id="order-notifications"
              checked={orderNotifications}
              onCheckedChange={setOrderNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="delivery-updates">Delivery Status Updates</Label>
              <p className="text-sm text-muted-foreground">
                Alerts when your order is out for delivery or delivered
              </p>
            </div>
            <Switch
              id="delivery-updates"
              checked={deliveryUpdates}
              onCheckedChange={setDeliveryUpdates}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="promo-alerts">Promotions & Discounts</Label>
              <p className="text-sm text-muted-foreground">
                Special offers and new product discounts
              </p>
            </div>
            <Switch
              id="promo-alerts"
              checked={promoAlerts}
              onCheckedChange={setPromoAlerts}
            />
          </div>
        </CardContent>
      </Card>

      {/* Payment & Security */}
      <Card>
        <CardHeader>
          <CardTitle>Payment & Security</CardTitle>
          <CardDescription>
            Manage payment methods and account security
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CreditCard className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Default Payment Method</p>
                <p className="text-sm text-muted-foreground">
                  JazzCash • ****5678
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Update Payment Method
            </Button>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Change Password</p>
                <p className="text-sm text-muted-foreground">
                  Update your login password for security
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
