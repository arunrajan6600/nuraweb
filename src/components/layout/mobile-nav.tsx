"use client";

import * as React from "react";
import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <nav className="flex flex-col gap-4">
          <Link href="/" className="text-lg font-semibold">
            Home
          </Link>
          <Link href="/projects" className="text-lg font-semibold">
            Projects
          </Link>
          <Link href="/blog" className="text-lg font-semibold">
            Blog
          </Link>
          <Link href="/info" className="text-lg font-semibold">
            About
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
