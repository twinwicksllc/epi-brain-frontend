import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      root: '..',
    },
  },
  // Keep any other existing settings below this line
};

export default nextConfig;