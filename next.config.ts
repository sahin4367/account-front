import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/uploads/**',
      },
      {
        // Production backend domain-ini buraya əlavə et
        protocol: 'https',
        hostname: process.env.NEXT_PUBLIC_API_DOMAIN ?? 'localhost',
        pathname: '/uploads/**',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source:      '/api/v1/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/v1/:path*`,
      },
    ];
  },
};

export default nextConfig;