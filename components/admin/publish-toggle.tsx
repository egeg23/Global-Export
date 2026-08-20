"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { cn } from "@/lib/cn";
import type { SaveState } from "@/lib/admin/mutate";

/**
 * Publish switch on a list row. A submit button rather than a checkbox: the
 * change is a server round-trip, and a checkbox that snaps back on failure is
 * worse than a button that visibly waits.
 */
export function PublishToggle({
  id,
  isPublished,
  action,
}: {
  id: string;
  isPublished: boolean;
  action: (state: SaveState, formData: FormData) => Promise<SaveState>;
}) {
  const [state, formAction] = useActionState<SaveState, FormData>(action, {});

  return (
    <form action={formAction} className="shrink-0">
      <input type="hidden" name="id" value={id} />
      <input type="hidden" name="published" value={isPublished ? "false" : "true"} />
      <Toggle isPublished={isPublished} />
      {state.error ? <span className="sr-only">{state.error}</span> : null}
    </form>
  );
}

function Toggle({ isPublished }: { isPublished: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      title={isPublished ? "Снять с публикации" : "Опубликовать"}
      className={cn(
        "inline-flex h-7 items-center gap-1.5 rounded-full px-2.5 text-[0.7rem] font-medium transition-colors disabled:opacity-50",
        isPublished
          ? "bg-forest-800/10 text-forest-800 hover:bg-forest-800/16"
          : "bg-harvest-100 text-harvest-800 hover:bg-harvest-200",
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          isPublished ? "bg-forest-600" : "bg-harvest-500",
        )}
      />
      {pending ? "…" : isPublished ? "Опубликовано" : "Черновик"}
    </button>
  );
}
