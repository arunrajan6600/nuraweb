import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ModularBlog - A Cell-Based Blog Platform",
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="flex min-h-screen flex-col">
            <header className="border-b">
              <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="text-xl font-bold">
                  ModularBlog
                </Link>
                <nav className="flex items-center gap-6">
                  <Link href="/blog" className="hover:text-primary">
                    Blog
                  </Link>
                  <Link href="/admin" className="hover:text-primary">
                    Admin
                  </Link>
                </nav>
              </div>
            </header>
            <main className="flex-1">{children}</main>
            <footer className="border-t py-6">
              <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
                &copy; {new Date().getFullYear()} ModularBlog. All rights
                reserved.
              </div>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
