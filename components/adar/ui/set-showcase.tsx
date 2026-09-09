"use client";

import { SetCarousel } from "@/components/adar/ui/set-carousel";
import { useSetDialog } from "@/components/adar/ui/set-dialog";
import type { GiftSet } from "@/lib/adar/types";

/**
 * Лента и карточка товара вместе.
 *
 * Существует ради границы клиента и сервера: страница собирается на сервере
 * и не может передать в ленту обработчик выбора. Здесь он и заводится.
 */
export function SetShowcase({
  sets,
  title,
  note,
  tone = "light",
}: {
  sets: GiftSet[];
  title: string;
  note?: string;
  tone?: "light" | "dark";
}) {
  const { open, dialog } = useSetDialog();

  return (
    <>
      <SetCarousel sets={sets} title={title} note={note} tone={tone} onPick={open} />
      {dialog}
    </>
  );
}
