import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  reactStrictMode: false,
  experimental: {
    turbo: {
      root: path.resolve(__dirname, "../.."),
    },
  },
};

export default nextConfig;