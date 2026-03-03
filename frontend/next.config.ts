import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Standalone output for Docker optimized builds
  output: 'standalone',

  // Image optimization: allow clinic domain CDN
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cosmodent.ua' },
      { protocol: 'https', hostname: 'storage.googleapis.com' },
      // Dev: allow localhost uploads
      { protocol: 'http', hostname: 'localhost' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  // Experimental: partial pre-rendering (Next 15)
  experimental: {
    ppr: false, // enable when stable
  },

  // Rewrites: proxy API calls in dev
  async rewrites() {
    return process.env.NODE_ENV === 'development'
      ? [
          {
            source:      '/api/:path*',
            destination: `${process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api'}/:path*`,
          },
        ]
      : [];
  },

  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',        value: 'DENY' },
          { key: 'X-Content-Type-Options',  value: 'nosniff' },
          { key: 'Referrer-Policy',         value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',      value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },
};

export default nextConfig;
