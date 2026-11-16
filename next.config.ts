import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      fs: { browser: "./shims/empty.js" },
      path: { browser: "./shims/empty.js" },
      crypto: { browser: "./shims/empty.js" },
    },
  },
};

export default nextConfig;
