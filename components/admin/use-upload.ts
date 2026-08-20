"use client";

import { useCallback, useState } from "react";

import { slugify } from "@/lib/admin/form";
import { createClient } from "@/lib/supabase/client";
import { mediaBucket } from "@/lib/supabase/env";
import type { MediaRow } from "@/lib/supabase/types";

/** Mirrors the bucket's own limits, so a file is rejected before it uploads. */
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
];

const extensions: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "application/pdf": "pdf",
};

function describe(file: File): string | null {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return `«${file.name}»: поддерживаются JPG, PNG, WebP, AVIF и PDF.`;
  }
  if (file.size > MAX_UPLOAD_BYTES) {
    const mb = (file.size / 1024 / 1024).toFixed(1);
    return `«${file.name}»: ${mb} МБ — максимум 10 МБ.`;
  }
  return null;
}

/** Pixel dimensions, so the media library can show them and warn about tiny images. */
async function measure(file: File): Promise<{ width: number; height: number } | null> {
  if (!file.type.startsWith("image/")) return null;
  try {
    const bitmap = await createImageBitmap(file);
    const size = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return size;
  } catch {
    return null;
  }
}

/**
 * Uploads straight from the browser to Supabase Storage.
 *
 * Going through a server action instead would mean the file travelling twice —
 * browser to our server, server to storage — and hitting the body-size limit on
 * server actions. The row-level policies allow the upload only for an account on
 * the admin allowlist, so the session does the authorising.
 */
export function useUpload(folder: string) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);

  const upload = useCallback(
    async (files: File[]): Promise<MediaRow[]> => {
      if (files.length === 0) return [];

      setError(null);
      setBusy(true);
      setProgress({ done: 0, total: files.length });

      const supabase = createClient();
      const uploaded: MediaRow[] = [];
      const problems: string[] = [];

      for (const [index, file] of files.entries()) {
        const rejection = describe(file);
        if (rejection) {
          problems.push(rejection);
          setProgress({ done: index + 1, total: files.length });
          continue;
        }

        const extension = extensions[file.type] ?? "bin";
        const base = slugify(file.name.replace(/\.[^.]+$/, "")) || "file";
        // The timestamp keeps a re-upload of the same filename from replacing
        // the original, which some other entry may still be pointing at.
        const path = `${folder}/${Date.now()}-${base}.${extension}`;

        const { error: uploadError } = await supabase.storage
          .from(mediaBucket)
          .upload(path, file, { cacheControl: "31536000", contentType: file.type });

        if (uploadError) {
          problems.push(`«${file.name}»: ${uploadError.message}`);
          setProgress({ done: index + 1, total: files.length });
          continue;
        }

        const size = await measure(file);
        const { data, error: insertError } = await supabase
          .from("media")
          .insert({
            path,
            filename: file.name,
            mime_type: file.type,
            size_bytes: file.size,
            width: size?.width ?? null,
            height: size?.height ?? null,
            folder,
          })
          .select("*")
          .single();

        if (insertError) {
          // The file is in the bucket but unlisted; remove it rather than leave
          // an orphan nothing can reach.
          await supabase.storage.from(mediaBucket).remove([path]);
          problems.push(`«${file.name}»: ${insertError.message}`);
        } else if (data) {
          uploaded.push(data as MediaRow);
        }

        setProgress({ done: index + 1, total: files.length });
      }

      setBusy(false);
      setProgress(null);
      if (problems.length > 0) setError(problems.join(" "));

      return uploaded;
    },
    [folder],
  );

  return { upload, busy, error, progress, clearError: () => setError(null) };
}
