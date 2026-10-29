/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async rewrites() {
    if (process.env.BACKEND_URL) {
      return [
        {
          source: "/api/:path*",
          destination: `${process.env.BACKEND_URL}/api/:path*`,
        },
        {
          source: "/docs",
          destination: `${process.env.BACKEND_URL}/docs`,
        },
        {
          source: "/openapi.json",
          destination: `${process.env.BACKEND_URL}/openapi.json`,
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
