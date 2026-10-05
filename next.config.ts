import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  cacheComponents: true,
  async redirects() {
    return [{ source: "/go", destination: "/python", permanent: true }];
  },
};

export default nextConfig;
