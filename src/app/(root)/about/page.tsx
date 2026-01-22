"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Users,
  Target,
  HeartHandshake,
  Truck,
  ShieldCheck,
  Star,
  ArrowRight,
} from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar - Same as homepage */}
      <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
              BW
            </div>
            <h1 className="text-2xl font-bold text-gray-900">
              Binary Wholesale
            </h1>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 hover:text-indigo-600 font-medium"
            >
              Products
            </Link>
            <Link href="/about" className="text-indigo-600 font-medium">
              About Us
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/signin">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-50 to-white py-20 md:py-32">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About Binary Wholesale
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We are a dedicated B2B wholesale platform connecting suppliers with
            retailers across Pakistan. Our mission is to make bulk buying
            simple, affordable, and reliable for every shop owner.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
              Our Story
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              Founded in Islamabad, Binary Wholesale was born from the vision of
              making wholesale trading easier for small and medium retailers. We
              saw retailers struggling with inconsistent supply, high prices,
              and delayed deliveries. So we built a platform that solves these
              problems – offering verified suppliers, transparent pricing, fast
              delivery, and excellent support.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Today, we proudly serve hundreds of retailers with grocery, beauty
              products, cosmetics, and daily essentials – all under one roof, at
              the best wholesale rates in Pakistan.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-700 text-lg">
                To empower retailers by providing a reliable, transparent, and
                efficient wholesale platform that saves time, reduces costs, and
                helps businesses grow.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mb-6">
                <HeartHandshake className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-700 text-lg">
                To become the most trusted B2B wholesale partner in Pakistan,
                serving thousands of retailers with unmatched variety, quality,
                and service.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Retailers Choose Us
          </h3>

          <div className="grid md:grid-cols-3 gap-10">
            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <Truck className="h-10 w-10 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-semibold">
                Fast & Reliable Delivery
              </h4>
              <p className="text-gray-700 text-lg">
                We deliver across major cities within 24-48 hours.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <ShieldCheck className="h-10 w-10 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-semibold">
                100% Secure & Transparent
              </h4>
              <p className="text-gray-700 text-lg">
                Verified suppliers, clear pricing, and safe payment options.
              </p>
            </div>

            <div className="text-center space-y-6">
              <div className="mx-auto w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center">
                <Star className="h-10 w-10 text-indigo-600" />
              </div>
              <h4 className="text-2xl font-semibold">Best Wholesale Prices</h4>
              <p className="text-gray-700 text-lg">
                Competitive rates with no hidden fees – save more on every
                order.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-6 text-center">
          <h3 className="text-4xl font-bold mb-6">Ready to Partner with Us?</h3>
          <p className="text-xl mb-10 max-w-3xl mx-auto opacity-90">
            Join Binary Wholesale today and take your retail business to the
            next level with better prices, faster delivery, and trusted supply.
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              variant="secondary"
              className="text-xl px-16 py-8 bg-white text-indigo-600 hover:bg-gray-100"
            >
              Sign Up Now – It&apos;s Free
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            {/* Column 1: About & Logo */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded bg-indigo-600 text-white flex items-center justify-center font-bold text-xl">
                  BW
                </div>
                <h4 className="text-2xl font-bold text-white">
                  Binary Wholesale
                </h4>
              </div>
              <p className="text-gray-400">
                Pakistan&apos;s leading B2B wholesale platform for grocery and
                beauty products. Trusted by hundreds of retailers for quality,
                price, and fast delivery.
              </p>
              <p className="text-sm">
                © {new Date().getFullYear()} Binary Wholesale. All rights
                reserved.
              </p>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-6">
                Quick Links
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="hover:text-white transition-colors">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    href="/products"
                    className="hover:text-white transition-colors"
                  >
                    Products
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="hover:text-white transition-colors"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faq"
                    className="hover:text-white transition-colors"
                  >
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Support & Services */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-6">
                Support & Services
              </h5>
              <ul className="space-y-3">
                <li>
                  <Link
                    href="/help"
                    className="hover:text-white transition-colors"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    href="/shipping"
                    className="hover:text-white transition-colors"
                  >
                    Shipping & Delivery
                  </Link>
                </li>
                <li>
                  <Link
                    href="/returns"
                    className="hover:text-white transition-colors"
                  >
                    Returns & Refunds
                  </Link>
                </li>
                <li>
                  <Link
                    href="/payment"
                    className="hover:text-white transition-colors"
                  >
                    Payment Methods
                  </Link>
                </li>
                <li>
                  <Link
                    href="/wholesale"
                    className="hover:text-white transition-colors"
                  >
                    Wholesale Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Social */}
            <div>
              <h5 className="text-lg font-semibold text-white mb-6">
                Contact Us
              </h5>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>Islamabad, Pakistan</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📧</span>
                  <span>support@binarywholesale.pk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>📞</span>
                  <span>+92 300 1234567</span>
                </li>
              </ul>
              <div className="mt-8">
                <h6 className="text-sm font-medium text-gray-400 mb-4">
                  Follow Us
                </h6>
                <div className="flex gap-5">
                  <div className="">
                    <a href="#" className="hover:text-white transition-colors">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21-.36.1-.73.15-1.11.15-.27 0-.53-.03-.78-.08.54 1.69 2.11 2.92 3.97 2.96-1.47 1.15-3.32 1.84-5.33 1.84-.35 0-.69-.02-1.03-.06 1.9 1.22 4.16 1.93 6.59 1.93 7.9 0 12.21-6.54 12.21-12.21 0-.19 0-.37-.01-.56A8.7 8.7 0 0022.46 6z" />
                      </svg>
                    </a>
                  </div>

                  <div>
                    <a href="#" className="hover:text-white transition-colors">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                      </svg>
                    </a>
                  </div>

                  <div>
                    <a href="#" className="hover:text-white transition-colors">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>

                  <div>
                    <a href="#" className="hover:text-white transition-colors">
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
