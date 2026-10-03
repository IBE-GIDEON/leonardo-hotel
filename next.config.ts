import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "leonardospahotelandsuites.com" }],
  },
};

export default nextConfig;
