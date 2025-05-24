/** @type {import('next').NextConfig} */
const nextConfig = {
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
  // Remove output: "export" to enable API routes
  async redirects() {
    const isAdminEnabled = process.env.NEXT_PUBLIC_ADMIN_ENABLED === 'true';
    
    if (!isAdminEnabled) {
      return [
        {
          source: '/api/:path*',
          has: [
            {
              type: 'header',
              key: 'accept',
              value: '(.*)/(.*)' // Match any content type for API requests
            }
          ],
          permanent: false,
          destination: '/404'
        }
      ];
    }
    return [];
  }
};

export default nextConfig;
