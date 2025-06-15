import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="w-full px-6 py-4 flex justify-between items-center z-20 fixed top-0 bg-black/50 backdrop-blur-sm">
      <Link href="/" className="flex items-center">
        <Image
          src="/placeholder-logo.svg"
          alt="Logo"
          width={40}
          height={40}
          className="w-auto h-8"
        />
      </Link>
      <div className="flex gap-4">
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-white/20"
          asChild
        >
          <Link href="/about">About</Link>
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-white/20"
          asChild
        >
          <Link href="/works">Works</Link>
        </Button>
        <Button
          variant="ghost"
          className="text-white hover:text-white hover:bg-white/20"
          asChild
        >
          <Link href="/blog">Blog</Link>
        </Button>
      </div>
    </nav>
  );
}
