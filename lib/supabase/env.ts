/**
 * Supabase is optional. Without these two variables the site still builds and
 * renders — it just serves the content bundled in `content/` and the admin
 * panel reports that it is not connected. That keeps `next build` working on a
 * clean checkout and in CI.
 */
export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseKey);

/** Public bucket holding everything uploaded through the media library. */
export const mediaBucket = "media";
