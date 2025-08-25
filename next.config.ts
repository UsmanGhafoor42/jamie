import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost", "api.hotmarketdtf.com"], // 👈 or your actual backend domain in production
  },
};

export default nextConfig;
