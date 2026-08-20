import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first: the product photography is large and compresses far better
    // than WebP, and every supported browser falls back on its own.
    formats: ["image/avif", "image/webp"],
    // The catalogue imagery is versioned by filename, so the optimiser's
    // output can be cached for a year instead of the four-hour default.
    minimumCacheTTL: 31_536_000,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [256, 384],
  },
  poweredByHeader: false,
};

export default nextConfig;
