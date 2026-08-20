import { mediaBucket, supabaseUrl } from "@/lib/supabase/env";

/**
 * Resolves an image reference to something `next/image` can load.
 *
 * Three kinds of value end up in an `image_path` column:
 *  - `/images/products/mung-bean.jpg` — shipped in `public/`, used as is;
 *  - `news/2026/harvest.jpg` — an object in the storage bucket;
 *  - a full URL — already resolved, left alone.
 */
export function mediaUrl(path: string | null | undefined): string | undefined {
  if (!path) return undefined;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  if (path.startsWith("/")) return path;
  if (!supabaseUrl) return undefined;
  return `${supabaseUrl}/storage/v1/object/public/${mediaBucket}/${path}`;
}
