"use client";

import { useRef, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Drag-and-drop target that is also a button.
 *
 * Dropping a file is convenient but invisible to a keyboard and to a screen
 * reader, so the same area opens a file dialog on click or Enter, and the file
 * input stays in the DOM rather than being synthesised on demand.
 */
export function Dropzone({
  onFiles,
  busy,
  label,
  hint,
  accept = "image/jpeg,image/png,image/webp,image/avif,application/pdf",
  multiple = true,
  className,
}: {
  onFiles: (files: File[]) => void;
  busy?: boolean;
  label: string;
  hint?: string;
  accept?: string;
  multiple?: boolean;
  className?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [over, setOver] = useState(false);

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setOver(true);
      }}
      onDragLeave={() => setOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setOver(false);
        const files = Array.from(event.dataTransfer.files);
        if (files.length > 0) onFiles(multiple ? files : files.slice(0, 1));
      }}
      className={cn(
        "rounded-xl border-2 border-dashed transition-colors",
        over ? "border-forest-600 bg-forest-50" : "border-forest-900/20 bg-white",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={busy}
        className="flex w-full flex-col items-center gap-1.5 px-5 py-8 text-center disabled:cursor-progress"
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 text-forest-600">
          <path
            d="M12 16V4m0 0L8 8m4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm font-medium text-forest-900">
          {busy ? "Загружаем…" : label}
        </span>
        {hint ? <span className="text-xs text-ink-subtle">{hint}</span> : null}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        className="sr-only"
        onChange={(event) => {
          const files = Array.from(event.target.files ?? []);
          if (files.length > 0) onFiles(files);
          // Reset so re-picking the same file fires change again.
          event.target.value = "";
        }}
      />
    </div>
  );
}
