"use client";

import React, { useState, useEffect, useCallback } from "react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Eye, Package, Loader2, Download } from "lucide-react";
import * as XLSX from "xlsx";

interface IOrder {
  _id: string;
  orderId: string;
  user: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
  };
  orderItems: {
    product: {
      _id: string;
      name: string;
      brand?: string;
      images?: string;
    };
    name: string;
    qty: number;
    price: number;
    image: string;
  }[];
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  status: string;
  createdAt: string;
}

export default function DashboardAdminOrders() {
  const { user } = useUserStore();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const limit = 10;

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (search) {
        params.append("search", search);
      }

      if (statusFilter && statusFilter !== "all") {
        params.append("status", statusFilter);
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders?${params.toString()}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch orders");
      }

      const result = await response.json();
      setOrders(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
      setTotalOrders(result.pagination?.total || 0);
    } catch (error: any) {
      toast.error(error.message || "Failed to load orders");
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchOrders();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleViewOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleUpdateOrder = (order: IOrder) => {
    setSelectedOrder(order);
    setUpdatingStatus(order.status);
    setIsUpdateDialogOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedOrder) return;

    try {
      setIsUpdating(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/orders/${selectedOrder._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: updatingStatus,
            isDelivered: updatingStatus === "delivered",
          }),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to update order");
      }

      toast.success("Order status updated successfully!");
      setIsUpdateDialogOpen(false);
      fetchOrders();
    } catch (error: any) {
      toast.error(error.message || "Failed to update order");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleExportToExcel = () => {
    if (orders.length === 0) {
      toast.error("No orders to export");
      return;
    }

    try {
      // Prepare data for Excel
      const excelData = orders.map((order) => ({
        "Order ID": order.orderId,
        "Customer Name": order.shippingAddress.fullName,
        Phone: order.shippingAddress.phone,
        Email: order.user.email,
        Address: order.shippingAddress.address,
        City: order.shippingAddress.city,
        "Postal Code": order.shippingAddress.postalCode,
        "Items Count": order.orderItems.length,
        "Total Price (Rs.)": order.totalPrice,
        "Payment Method": order.paymentMethod,
        "Payment Status": order.isPaid ? "Paid" : "Unpaid",
        "Order Status": order.status,
        Delivered: order.isDelivered ? "Yes" : "No",
        "Order Date": new Date(order.createdAt).toLocaleDateString("en-PK"),
      }));

      // Create worksheet
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths
      const columnWidths = [
        { wch: 25 }, // Order ID
        { wch: 20 }, // Customer Name
        { wch: 15 }, // Phone
        { wch: 25 }, // Email
        { wch: 35 }, // Address
        { wch: 15 }, // City
        { wch: 12 }, // Postal Code
        { wch: 12 }, // Items Count
        { wch: 15 }, // Total Price
        { wch: 15 }, // Payment Method
        { wch: 15 }, // Payment Status
        { wch: 12 }, // Order Status
        { wch: 10 }, // Delivered
        { wch: 15 }, // Order Date
      ];
      worksheet["!cols"] = columnWidths;

      // Create workbook
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      // Generate filename with current date
      const fileName = `Orders_Export_${new Date().toLocaleDateString("en-PK").replace(/\//g, "-")}.xlsx`;

      // Download file
      XLSX.writeFile(workbook, fileName);

      toast.success("Orders exported successfully!");
    } catch (error: any) {
      toast.error("Failed to export orders");
      console.error("Export error:", error);
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "processing":
        return "default";
      case "shipped":
        return "outline";
      case "delivered":
        return "default";
      case "cancelled":
        return "destructive";
      default:
        return "secondary";
    }
  };

  if (isLoading && orders.length === 0) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Orders Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Total Orders: {totalOrders}
          </p>
        </div>
        <Button onClick={handleExportToExcel} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export to Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <Input
          placeholder="Search by order ID, customer name or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="max-w-sm"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="shipped">Shipped</SelectItem>
            <SelectItem value="delivered">Delivered</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="h-24 text-center text-muted-foreground"
                >
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">{order.orderId}</TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {order.shippingAddress.fullName}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {order.shippingAddress.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{order.orderItems.length} item(s)</TableCell>
                  <TableCell className="font-semibold">
                    Rs. {order.totalPrice.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <span className="capitalize text-sm">
                        {order.paymentMethod}
                      </span>
                      <Badge
                        variant={order.isPaid ? "default" : "secondary"}
                        className="text-xs w-fit"
                      >
                        {order.isPaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString("en-PK", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewOrder(order)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleUpdateOrder(order)}
                    >
                      <Package className="h-4 w-4 mr-1" />
                      Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div>
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1 || isLoading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages || isLoading}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* View Order Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Order Details - {selectedOrder?.orderId}</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <strong>Name:</strong>{" "}
                    {selectedOrder.shippingAddress.fullName}
                  </p>
                  <p>
                    <strong>Phone:</strong>{" "}
                    {selectedOrder.shippingAddress.phone}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedOrder.user.email}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Shipping Address</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>
                    {selectedOrder.shippingAddress.city},{" "}
                    {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {selectedOrder.orderItems.map((item, idx) => (
                    <div key={idx} className="flex gap-4 p-3 border rounded-lg">
                      <img
                        src={item.image || "/placeholder-product.jpg"}
                        alt={item.name}
                        className="h-16 w-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">
                          Qty: {item.qty} × Rs. {item.price.toLocaleString()}
                        </p>
                      </div>
                      <div className="font-semibold">
                        Rs. {(item.qty * item.price).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span>Payment Method:</span>
                    <span className="capitalize">
                      {selectedOrder.paymentMethod}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Status:</span>
                    <Badge
                      variant={selectedOrder.isPaid ? "default" : "secondary"}
                    >
                      {selectedOrder.isPaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Order Status:</span>
                    <Badge variant={getStatusVariant(selectedOrder.status)}>
                      {selectedOrder.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>Rs. {selectedOrder.totalPrice.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Order Status</DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-4">
              <div>
                <Label>Order ID</Label>
                <p className="text-sm font-medium mt-1">
                  {selectedOrder.orderId}
                </p>
              </div>

              <div>
                <Label>Current Status</Label>
                <div className="mt-2">
                  <Badge variant={getStatusVariant(selectedOrder.status)}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>New Status</Label>
                <Select
                  value={updatingStatus}
                  onValueChange={setUpdatingStatus}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                className="w-full"
                onClick={handleStatusUpdate}
                disabled={isUpdating || updatingStatus === selectedOrder.status}
              >
                {isUpdating ? "Updating..." : "Update Status"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
