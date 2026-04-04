import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  missingSuspenseWithCSRBailout: false,
};

export default nextConfig;
