"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import Image from "next/image";

// Dynamically import the MatrixGridBackground with no SSR
const MatrixGridBackground = dynamic(() => import("./matrix-grid-background"), {
  ssr: false,
});

export function HeroSection() {
  return (
    <section className="relative h-screen bg-black">
      {/* Navigation Bar */}
      <nav className="w-full px-6 py-4 flex justify-between items-center z-20 fixed top-0">
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

      {/* Matrix Grid Background */}
      <MatrixGridBackground />

      {/* Content overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="container px-4 text-center z-10">
          <h1 className="text-5xl md:text-7xl tracking-tight mb-4 animate-fade-in text-white">
            <span className="font-roboto">{"<"}</span>
            <span className="font-lato font-bold">Arun Nura</span>
            <span className="font-roboto">{" />"}</span>
          </h1>
          <p className="font-roboto text-xl md:text-2xl mb-8 max-w-2xl mx-auto animate-fade-in-delay text-gray-300">
            {"{multi-disciplinary art practitioner}"}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-delay-2">
            <Button
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white border-none"
              asChild
            >
              <Link href="/resume">Resume</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-white text-white hover:bg-white/10"
              asChild
            >
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full h-10 w-10 p-0 text-white hover:bg-white/10"
          onClick={() => {
            window.scrollTo({
              top: window.innerHeight,
              behavior: "smooth",
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          <span className="sr-only">Scroll down</span>
        </Button>
      </div>
    </section>
  );
}
