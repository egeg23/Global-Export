"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Dropzone } from "@/components/admin/dropzone";
import { useUpload } from "@/components/admin/use-upload";
import { mediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/client";
import { mediaBucket } from "@/lib/supabase/env";
import type { MediaRow } from "@/lib/supabase/types";

function formatSize(bytes: number | null): string {
  if (!bytes) return "";
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} КБ`;
  return `${(bytes / 1024 / 1024).toFixed(1)} МБ`;
}

export function MediaManager({ initial }: { initial: MediaRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [copied, setCopied] = useState<string | null>(null);
  const [removing, setRemoving] = useState<string | null>(null);
  const { upload, busy, error, progress } = useUpload("uploads");

  async function remove(item: MediaRow) {
    if (!window.confirm(`Удалить «${item.filename}»? Файл пропадёт со страниц, где он используется.`)) {
      return;
    }

    setRemoving(item.id);
    const supabase = createClient();
    // Row first: if the file removal fails the library still shows the entry,
    // which is recoverable. The other order leaves a listing pointing at nothing.
    const { error: rowError } = await supabase.from("media").delete().eq("id", item.id);
    if (!rowError) {
      await supabase.storage.from(mediaBucket).remove([item.path]);
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      router.refresh();
    }
    setRemoving(null);
  }

  return (
    <div>
      <Dropzone
        label="Перетащите файлы сюда"
        hint="JPG, PNG, WebP, AVIF или PDF, до 10 МБ"
        busy={busy}
        onFiles={async (files) => {
          const uploaded = await upload(files);
          if (uploaded.length > 0) {
            setItems((current) => [...uploaded, ...current]);
            router.refresh();
          }
        }}
        className="mt-8"
      />

      {progress ? (
        <p className="mt-3 text-sm text-ink-muted" role="status">
          Загружено {progress.done} из {progress.total}…
        </p>
      ) : null}
      {error ? (
        <p className="mt-3 text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      {items.length === 0 ? (
        <p className="mt-10 text-sm text-ink-muted">Пока ничего не загружено.</p>
      ) : (
        <ul className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const url = mediaUrl(item.path);
            const isImage = item.mime_type?.startsWith("image/") ?? false;

            return (
              <li
                key={item.id}
                className="overflow-hidden rounded-xl border border-forest-900/10 bg-white"
              >
                <div className="relative aspect-square bg-sand-200">
                  {url && isImage ? (
                    <Image
                      src={url}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 20vw, 45vw"
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="flex h-full items-center justify-center text-xs text-ink-subtle">
                      PDF
                    </span>
                  )}
                </div>

                <div className="p-3">
                  <p className="truncate text-xs font-medium text-forest-950" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="mt-0.5 text-[0.7rem] text-ink-subtle">
                    {[
                      item.width && item.height ? `${item.width}×${item.height}` : null,
                      formatSize(item.size_bytes),
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <div className="mt-2.5 flex gap-1.5">
                    <button
                      type="button"
                      onClick={async () => {
                        await navigator.clipboard.writeText(item.path);
                        setCopied(item.id);
                        window.setTimeout(() => setCopied(null), 1500);
                      }}
                      className="inline-flex h-8 flex-1 items-center justify-center rounded-lg border border-forest-900/15 px-2 text-[0.7rem] font-medium text-forest-800 transition-colors hover:bg-forest-800/5"
                    >
                      {copied === item.id ? "Скопировано" : "Скопировать путь"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item)}
                      disabled={removing === item.id}
                      className="inline-flex h-8 items-center justify-center rounded-lg border border-red-200 px-2.5 text-[0.7rem] font-medium text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
                    >
                      {removing === item.id ? "…" : "Удалить"}
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
