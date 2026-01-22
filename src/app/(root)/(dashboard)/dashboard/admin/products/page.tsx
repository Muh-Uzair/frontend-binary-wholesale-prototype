"use client";

import { useUserStore } from "@/store/userStore";
import React, { useEffect, useState, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";

// Zod schema
const formSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").trim(),
  description: z.string().min(1, "Description is required").trim(),
  category: z.enum(["grocery", "beauty"]),
  brand: z.string().min(1, "Brand name is required").trim(),
  images: z
    .string()
    .min(1, "At least one image URL is required")
    .url("Please enter a valid URL"),
  variants: z.string().array().min(1, "At least one variant is required"),
  stock: z.number().min(0, "Stock cannot be negative"),
  moq: z.number().min(1, "MOQ must be at least 1"),
});

type FormValues = z.infer<typeof formSchema>;

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  category: string;
  brand: string;
  images: string;
  variants: string[];
  createdBy: string;
  stock: number;
  inStock: boolean;
  moq: number;
  createdAt?: string;
}

export default function DashboardAdminProducts() {
  const { user } = useUserStore();

  const [products, setProducts] = useState<IProduct[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);

  const limit = 5;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "grocery",
      brand: "",
      images: "",
      variants: [""],
      stock: 0,
      moq: 1,
    },
  });

  // Reset form when dialog opens (create or edit mode)
  useEffect(() => {
    if (isDialogOpen) {
      if (editingProduct) {
        // Edit mode - populate form with product data
        form.reset({
          name: editingProduct.name,
          description: editingProduct.description,
          category: editingProduct.category as "grocery" | "beauty",
          brand: editingProduct.brand || "",
          images: editingProduct.images,
          variants: editingProduct.variants,
          stock: editingProduct.stock,
          moq: editingProduct.moq,
        });
      } else {
        // Create mode - reset to defaults
        form.reset({
          name: "",
          description: "",
          category: "grocery",
          brand: "",
          images: "",
          variants: [""],
          stock: 0,
          moq: 1,
        });
      }
    }
  }, [isDialogOpen, editingProduct, form]);

  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          // Authorization: `Bearer ${token}`, // add if needed
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to fetch products");
      }

      const result = await response.json();
      setProducts(result.data || []);
      setTotalPages(result.pagination?.totalPages || 1);
    } catch (error: any) {
      toast.error(error.message || "Failed to load products");
    } finally {
      setIsLoading(false);
    }
  }, [page, search]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      fetchProducts();
    }, 500);
    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  // Fetch on page change
  useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsSubmitting(true);

      const payload = {
        ...values,
        inStock: values.stock > 0,
        // createdBy only needed for create - backend might ignore for update
        ...(editingProduct ? {} : { createdBy: user?._id as string }),
      };

      let response: Response;

      if (editingProduct) {
        // PATCH for update
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${editingProduct._id}`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
      } else {
        // POST for create
        response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
        );
      }

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to save product");
      }

      toast.success(
        editingProduct
          ? "Product updated successfully!"
          : "Product created successfully!",
      );

      setIsDialogOpen(false);
      setEditingProduct(null);
      form.reset();
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product: IProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Products Management</h1>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle>
                {editingProduct ? "Edit Product" : "Create New Product"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 pt-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Cooking Oil 5L" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Brand *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Mezan, Dove, ..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Describe the product (features, benefits, usage, etc.)..."
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category *</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="grocery">Grocery</SelectItem>
                            <SelectItem value="beauty">Beauty</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="moq"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Order Quantity (MOQ) *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="stock"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Stock Quantity *</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={0}
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="images"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Main Image URL *</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://example.com/product-image.jpg"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="variants"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Variants (comma separated) *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="5L, 10L, 500ml, Pack of 6"
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                .split(",")
                                .map((s) => s.trim())
                                .filter(Boolean),
                            )
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? "Saving..."
                    : editingProduct
                      ? "Update Product"
                      : "Create Product"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by name, category or brand..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead>MOQ</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-muted-foreground"
                >
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product._id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell className="capitalize">
                    {product.category}
                  </TableCell>
                  <TableCell>{product.brand || "—"}</TableCell>
                  <TableCell>{product.variants.join(", ")}</TableCell>
                  <TableCell className="flex items-center gap-2">
                    {product.stock}
                    <Badge
                      variant={product.inStock ? "success" : "destructive"}
                      className="text-xs"
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </Badge>
                  </TableCell>
                  <TableCell>{product.moq}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                      // TODO: Add delete functionality later
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
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
    </div>
  );
}
