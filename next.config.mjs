/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: "export",
  basePath: "/me",
  distDir: "out",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: false,
  },
  poweredByHeader: false,
};

export default nextConfig;
