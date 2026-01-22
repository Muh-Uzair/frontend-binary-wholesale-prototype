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
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

// Zod schema (same as before)
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

// Product interface matching your backend response
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
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const limit = 5; // items per page (same as your table)

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

  // Fetch products from API with pagination & search
  const fetchProducts = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;

      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
          // Agar auth token chahiye to yahan add kar dena
          // Authorization: `Bearer ${token}`,
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

  // Debounced search (har key press pe nahi, 500ms wait karega)
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1); // search change hone pe page 1 pe reset
      fetchProducts();
    }, 500);

    return () => clearTimeout(timer);
  }, [search, fetchProducts]);

  // Initial fetch + page change pe call
  useEffect(() => {
    fetchProducts();
  }, [page, fetchProducts]);

  const onSubmit = async (values: FormValues) => {
    try {
      setIsCreating(true);
      const submittedData = {
        ...values,
        inStock: values.stock > 0,
        createdBy: user?._id as string,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(submittedData),
        },
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Failed to create product");
      }

      toast.success("Product created successfully!");
      form.reset();
      setIsDialogOpen(false);

      // Refresh list after create
      fetchProducts();
    } catch (error: any) {
      toast.error(error.message || "Product creation failed");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
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
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Create Product
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[640px]">
            <DialogHeader>
              <DialogTitle>Create New Product</DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 pt-4"
              >
                {/* ... your form fields same as before ... */}

                <Button
                  type="submit"
                  className="w-full mt-6"
                  disabled={isCreating}
                >
                  {isCreating ? "Creating..." : "Create Product"}
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
                  <TableCell>
                    {product.stock} (
                    <span
                      className={
                        product.inStock ? "text-green-600" : "text-red-600"
                      }
                    >
                      {product.inStock ? "In Stock" : "Out of Stock"}
                    </span>
                    )
                  </TableCell>
                  <TableCell>{product.moq}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:text-red-700"
                    >
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
