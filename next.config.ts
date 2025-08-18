import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      hostname:"wavelms.t3.storageapi.dev"
    }],
  },
};

export default nextConfig;
