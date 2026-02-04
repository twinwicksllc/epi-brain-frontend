import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbopack: {
      root: '..',
    },
  },
  /* config options here */
};

export default nextConfig;