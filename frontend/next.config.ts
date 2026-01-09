import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compiler: {
    // Remove console logs in production
    removeConsole: false, // Set to true in production
  },
};

export default nextConfig;
