import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full bg-black/50 backdrop-blur-sm text-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Arun Nura. All rights reserved.
            </p>
          </div>
          <div className="flex gap-6">
            <Link
              href="https://www.instagram.com/arun.nura"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Instagram
            </Link>
            <Link
              href="mailto:arunr6600@yahoo.com"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/blog"
              className="text-gray-400 hover:text-white transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
