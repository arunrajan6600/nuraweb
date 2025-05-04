import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { Providers } from "@/components/providers"; // Import the new Providers component
import { Toaster } from "@/components/ui/toaster";
import { NavMenu } from "@/components/nav-menu";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Arun - A Cell-Based Blog Platform",
  description: "A modern blogging platform with a modular content system",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Add suppressHydrationWarning for next-themes */}
      <body className={inter.className}>
        <Providers>
          {/* Use the Providers component */}
          <div className="flex min-h-screen flex-col">
            <header className="border-b">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                  Arun
                </Link>
                <NavMenu />
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} Arun. All rights reserved.
              </div>
            </footer>
          </div>
          <Toaster />
        </Providers>
        {/* Close Providers component */}
      </body>
    </html>
  );
}
