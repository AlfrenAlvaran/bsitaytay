
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    agentFeedback: true,
  },

  cacheComponents: true,
  partialPrefetching: true,

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