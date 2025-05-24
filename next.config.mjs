/** @type {import('next').NextConfig} */
const nextConfig = {
  // In dev-super mode, enable server features, otherwise use static export
  output:
    process.env.NEXT_PUBLIC_ADMIN_ENABLED === "true" ? undefined : "export",
  // Use /me base path only in production (GitHub Pages)
  basePath: process.env.NODE_ENV === "production" ? "/me" : "",
  // Disable API routes in static export
  rewrites: async () => {
    if (process.env.NEXT_PUBLIC_ADMIN_ENABLED === "true") {
      return [];
    }
    return {
      beforeFiles: [
        {
          source: "/api/:path*",
          destination: "/_error",
        },
      ],
    };
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  distDir: "out",
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    webpackBuildWorker: false,
  },
  poweredByHeader: false,
};

export default nextConfig;
