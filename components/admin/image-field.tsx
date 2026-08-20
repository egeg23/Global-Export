"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { mediaUrl } from "@/lib/media";
import { createClient } from "@/lib/supabase/client";
import type { MediaRow } from "@/lib/supabase/types";

import { Dropzone } from "./dropzone";
import { useUpload } from "./use-upload";

/**
 * A picture on an entry: drop a new file, or pick one already uploaded.
 *
 * The value posted with the form is the storage path — or, for the photographs
 * that shipped with the prototype, a path under `public/`. Both forms are
 * resolved by `mediaUrl()`, so an entry seeded from the repository can have its
 * picture replaced from the panel without anything else changing.
 */
export function ImageField({
  name,
  label,
  hint,
  value,
  folder,
}: {
  name: string;
  label: string;
  hint?: string;
  value?: string | null;
  folder: string;
}) {
  const [path, setPath] = useState(value ?? "");
  const [picking, setPicking] = useState(false);
  const { upload, busy, error } = useUpload(folder);

  const preview = mediaUrl(path);

  return (
    <div>
      <span className="text-sm font-medium text-forest-900">{label}</span>
      {hint ? <p className="mt-0.5 text-xs text-ink-subtle">{hint}</p> : null}

      <input type="hidden" name={name} value={path} />

      <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg border border-forest-900/10 bg-sand-200 sm:w-44">
          {preview ? (
            <Image
              src={preview}
              alt=""
              fill
              sizes="176px"
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-ink-subtle">
              Нет изображения
            </span>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <Dropzone
            label="Перетащите файл сюда"
            hint="или нажмите, чтобы выбрать"
            multiple={false}
            busy={busy}
            className="!py-0"
            onFiles={async (files) => {
              const [uploaded] = await upload(files.slice(0, 1));
              if (uploaded) setPath(uploaded.path);
            }}
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setPicking(true)}
              className="inline-flex h-9 items-center rounded-lg border border-forest-900/15 px-3 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-800/5"
            >
              Выбрать из медиатеки
            </button>
            {path ? (
              <button
                type="button"
                onClick={() => setPath("")}
                className="inline-flex h-9 items-center rounded-lg border border-forest-900/15 px-3 text-xs font-medium text-forest-800 transition-colors hover:bg-forest-800/5"
              >
                Убрать
              </button>
            ) : null}
          </div>

          {path ? (
            <p className="break-all text-[0.7rem] text-ink-subtle">{path}</p>
          ) : null}
          {error ? <p className="text-xs text-red-700">{error}</p> : null}
        </div>
      </div>

      {picking ? (
        <MediaPicker
          onClose={() => setPicking(false)}
          onPick={(item) => {
            setPath(item.path);
            setPicking(false);
          }}
        />
      ) : null}
    </div>
  );
}

function MediaPicker({
  onPick,
  onClose,
}: {
  onPick: (item: MediaRow) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;

    createClient()
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(120)
      .then(({ data }) => {
        if (!cancelled) setItems((data as MediaRow[] | null) ?? []);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Медиатека"
      className="fixed inset-0 z-50 flex items-end justify-center bg-forest-950/50 p-0 sm:items-center sm:p-6"
    >
      {/* Click-away, with the keyboard route covered by Escape above. */}
      <button
        type="button"
        aria-hidden="true"
        tabIndex={-1}
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <div className="relative flex max-h-[85vh] w-full max-w-3xl flex-col rounded-t-2xl bg-sand-50 sm:rounded-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-forest-900/10 px-5 py-4">
          <h2 className="text-sm font-semibold text-forest-950">Медиатека</h2>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-8 items-center rounded-lg px-3 text-xs font-medium text-forest-800 hover:bg-forest-800/6"
          >
            Закрыть
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items === null ? (
            <p className="text-sm text-ink-muted">Загружаем…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-ink-muted">
              Пока ничего не загружено. Файлы можно добавить в разделе «Медиа».
            </p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {items.map((item) => {
                const url = mediaUrl(item.path);
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onPick(item)}
                      className="group block w-full overflow-hidden rounded-lg border border-forest-900/10 bg-white text-left transition-colors hover:border-forest-700"
                    >
                      <span className="relative block aspect-square bg-sand-200">
                        {url && item.mime_type?.startsWith("image/") ? (
                          <Image
                            src={url}
                            alt=""
                            fill
                            sizes="160px"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="flex h-full items-center justify-center text-xs text-ink-subtle">
                            PDF
                          </span>
                        )}
                      </span>
                      <span className="block truncate px-2 py-1.5 text-[0.7rem] text-ink-muted">
                        {item.filename}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
