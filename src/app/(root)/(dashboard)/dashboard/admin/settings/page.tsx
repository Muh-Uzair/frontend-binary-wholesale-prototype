"use client";

import { useUserStore } from "@/store/userStore";
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
import { Upload, Save, Bell, Mail, ShieldCheck } from "lucide-react";

export default function DashboardAdminSettings() {
  const { user } = useUserStore();

  // Dummy states for form (static UI only)
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [fullName, setFullName] = useState(user?.fullName || "Admin User");
  const [email, setEmail] = useState(
    user?.email || "admin@binarywholesale.com",
  );

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [lowStockAlerts, setLowStockAlerts] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setProfileImage(url);
    }
  };

  const handleSave = () => {
    // Dummy save action
    alert("Settings saved! (This is a static demo)");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences and security
        </p>
      </div>

      {/* Profile Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>
            Update your personal details and profile picture
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24">
              <AvatarImage
                src={profileImage || "/placeholder-avatar.jpg"}
                alt="Profile"
              />
              <AvatarFallback>{fullName?.charAt(0) || "A"}</AvatarFallback>
            </Avatar>

            <div className="space-y-2">
              <Label htmlFor="profile-image">Change Profile Picture</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <Button variant="outline" asChild>
                  <label
                    htmlFor="profile-image"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </label>
                </Button>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG or GIF (max 2MB)
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <Button onClick={handleSave} className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Notifications Section */}
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Choose what updates you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-muted-foreground" />
                <Label htmlFor="email-notifications">Email Notifications</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Receive emails about important updates and alerts
              </p>
            </div>
            <Switch
              id="email-notifications"
              checked={emailNotifications}
              onCheckedChange={setEmailNotifications}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="order-updates">New Order Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified when new orders are placed
              </p>
            </div>
            <Switch
              id="order-updates"
              checked={orderUpdates}
              onCheckedChange={setOrderUpdates}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="low-stock">Low Stock Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Alerts when product stock falls below threshold
              </p>
            </div>
            <Switch
              id="low-stock"
              checked={lowStockAlerts}
              onCheckedChange={setLowStockAlerts}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Section */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>
            Manage your account security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
                <Label>Two-Factor Authentication</Label>
              </div>
              <p className="text-sm text-muted-foreground">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              checked={twoFactorAuth}
              onCheckedChange={setTwoFactorAuth}
            />
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
            >
              Change Password
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
