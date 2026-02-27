import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Strict mode for catching bugs early
  reactStrictMode: true,

  // Remove X-Powered-By header for security
  poweredByHeader: false,

  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
