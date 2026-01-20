"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Zod schema - validation rules
const formSchema = z.object({
  fullName: z
    .string()
    .min(3, { message: "Full name must be at least 3 characters." })
    .max(100, { message: "Name is too long." }),

  email: z.string().email({ message: "Please enter a valid email address." }),

  phone: z
    .string()
    .refine((val) => !val || /^[0-9+\-]*$/.test(val), {
      message: "Phone can only contain digits, + and -",
    })
    .refine((val) => !val || val.length >= 7, {
      message: "Phone number should be at least 7 characters if provided.",
    }),

  // New: Password field
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters." })
    .max(50, { message: "Password is too long." }),
});

type FormValues = z.infer<typeof formSchema>;

// CMP CMP CMP
export default function SignUpPage() {
  // VARS
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
    mode: "onChange",
  });
  const router = useRouter();

  // FUNCTIONS
  // Submit handler
  async function onSubmit(values: FormValues) {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            fullName: values.fullName,
            email: values.email,
            phone: values.phone || undefined,
            password: values.password,
            role: "retailer",
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Signup failed");
      }

      const data = await response.json();
      console.log("Signup successful:", data);
      toast.success("Account created successfully!");

      router.push("/signin");
      form.reset();
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "Signup failed");
      } else {
        toast.error("Something went wrong");
      }
    }
  }

  // JSX JSX JSX
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            Create Retailer Account
          </CardTitle>
          <CardDescription className="text-center">
            Enter your details to get started as a retailer
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Muhammad Ahmed" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="example@domain.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone (optional) */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+923001234567 or 03001234567"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* New: Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password" // <-- type password for hiding text
                        placeholder="••••••••"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? "Creating..." : "Sign Up"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
