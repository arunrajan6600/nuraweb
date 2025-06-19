import Link from "next/link";
import { MainNav } from "@/components/layout/main-nav";
import { MobileNav } from "@/components/layout/mobile-nav";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 md:px-6 w-full">
        {/* Logo on the left */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              നു
            </span>
          </Link>
        </div>

        {/* Navigation on the right */}
        <div className="flex items-center">
          <MainNav />
        </div>

        {/* Mobile nav button on the right (mobile only) */}
        <div className="md:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
