import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: ["localhost"], // 👈 or your actual backend domain in production
  },
};

export default nextConfig;
