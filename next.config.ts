import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The project lives in an iCloud-synced Desktop; ".nosync" keeps iCloud from duplicating cache files.
  distDir: ".next.nosync",
  turbopack: { root: __dirname },
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};

export default nextConfig;
