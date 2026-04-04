import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  experimental: {
    // Prevents static prerendering of /_global-error and /_not-found
    // which crash with workUnitAsyncStorage invariant error in Next.js 16.
    // The backoffice is fully dynamic (auth + DB) so no pages benefit from
    // static generation anyway.
    dynamicIO: true,
  },
};

export default nextConfig;
