import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.mux.com",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/documentacion",
        destination:
          "https://widget.belender.net/widget-boxed/clavepin/6d17c1b9-3ec4-431d-b009-be7742eff16c/e75aa965-4851-4cb9-b2d1-00b49d3b7950",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
