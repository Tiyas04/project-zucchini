import { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ hostname: "res.cloudinary.com" }],
    qualities: [100, 75],
  },
};

export default nextConfig;
