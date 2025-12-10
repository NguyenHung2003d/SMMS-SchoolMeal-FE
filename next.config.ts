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

  //production thì mở nó ra
  // async rewrites() {
  //   return [
  //     {
  //       source: "/api/proxy/:path*",
  //       destination: "https://outragedly-guidebookish-mitzie.ngrok-free.dev/api/:path*", cái ni là url của ngrok, sau này thay bằng link deploy của be
  //     },
  //   ];
  // },
};

export default nextConfig;
