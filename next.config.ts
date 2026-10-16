import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Locally the project lives in an iCloud-synced Desktop; ".nosync" keeps iCloud from duplicating
  // cache files. Vercel and other CI builds need the default ".next".
  ...(process.env.VERCEL || process.env.CI ? {} : { distDir: ".next.nosync" }),
  turbopack: { root: __dirname },
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};

export default nextConfig;
