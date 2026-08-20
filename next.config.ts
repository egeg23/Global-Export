import type { NextConfig } from "next";

// Derived rather than hard-coded so a different Supabase project only needs a
// new environment variable, not a config edit.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : undefined;

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
    // Photographs uploaded through the admin panel are served from the
    // project's public storage bucket; everything else lives in `public/`.
    remotePatterns: supabaseHost
      ? [{ protocol: "https", hostname: supabaseHost, pathname: "/storage/v1/object/public/**" }]
      : [],
  },
  poweredByHeader: false,
};

export default nextConfig;
