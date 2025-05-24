/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Optimize images
  images: {
    domains: ['v0.blob.com'],
    formats: ['image/avif', 'image/webp'],
    unoptimized: true,
  },
}

export default nextConfig
