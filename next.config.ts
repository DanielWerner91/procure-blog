import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.in',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.reuters.com',
      },
      {
        protocol: 'https',
        hostname: '*.techcrunch.com',
      },
      {
        protocol: 'https',
        hostname: '*.zdnet.com',
      },
      {
        protocol: 'https',
        hostname: '*.venturebeat.com',
      },
    ],
  },
};

export default nextConfig;
