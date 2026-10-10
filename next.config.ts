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

  // Ship Tesseract's worker, WASM core and language data to the serverless function
  outputFileTracingIncludes: {
    "/api/residents/id-scan/extract": [
      "./node_modules/tesseract.js/**/*",
      "./node_modules/tesseract.js-core/**/*",
      "./tessdata/**/*",
    ],
  },
};

export default nextConfig;