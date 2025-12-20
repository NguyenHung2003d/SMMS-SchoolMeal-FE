import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", 
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/:path*", 
  //       destination: "https://outragedly-guidebookish-mitzie.ngrok-free.dev/api/:path*",
  //     },
  //   ];
  // },
};

export default nextConfig;
