import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ozgqvsecemslpaqftkiy.supabase.co',
      },
    ],
  },
};

export default nextConfig;