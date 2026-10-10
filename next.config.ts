import path from "path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },

  cacheComponents: true,
  partialPrefetching: true,

  // Silences the "ignored package-lock.json" warning
  turbopack: { root: path.resolve(__dirname) },
  outputFileTracingRoot: path.resolve(__dirname),

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/bczu9zcy/**",
      },
    ],
  },

  serverExternalPackages: ["tesseract.js", "sharp", "bcrypt"],
};

export default nextConfig;