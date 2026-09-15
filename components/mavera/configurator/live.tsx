"use client";

import { useRef } from "react";

import { useAddon } from "@/components/mavera/configurator/context";
import { useMotionPreferred } from "@/components/mavera/motion";
import { cn } from "@/lib/cn";
import type { AddonId } from "@/content/mavera/addons";

/**
 * Допники, которые не добавляют блок, а меняют поведение существующего.
 *
 * Все три читают тумблер и без конструктора работают как включённые.
 * Анимации подчиняются `data-motion`: «Анимации и параллакс» выключены —
 * ни слова, ни кадры не двигаются, что бы ни говорил их собственный тумблер.
 */

/** Заголовок, который собирается по словам — «Живой первый экран». */
export function Words({ text, offset = 0 }: { text: string; offset?: number }) {
  const live = useAddon("hero");
  if (!live) return <>{text}</>;

  // Пробел стоит между обёртками, а не внутри: внутри inline-block он бы схлопнулся.
  return (
    <>
      {text.split(" ").map((word, index) => (
        <span key={`${word}-${index}`}>
          {index ? " " : null}
          <span className="w-word" style={{ "--w-delay": `${offset + index * 90}ms` } as React.CSSProperties}>
            {word}
          </span>
        </span>
      ))}
    </>
  );
}

/** Класс, который навешивается только при включённом допнике. */
export function Live({
  id,
  className,
  base,
  as = "div",
  children,
}: {
  id: AddonId;
  className: string;
  base?: string;
  as?: "div" | "span";
  children: React.ReactNode;
}) {
  const on = useAddon(id);
  const Tag = as;
  return <Tag className={cn(base, on && className)}>{children}</Tag>;
}

/**
 * Кнопка, которая тянется к курсору — «Магнитные кнопки».
 *
 * Сдвиг пишется прямо в стиль узла: на каждый кадр указателя нет перерисовки
 * React. На телефоне курсора нет — остаётся подсветка при нажатии.
 */
export function Magnetic({
  children,
  className,
  strength = 7,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  const on = useAddon("magnetic");
  const motion = useMotionPreferred();
  const ref = useRef<HTMLSpanElement>(null);

  const move = (event: React.PointerEvent<HTMLSpanElement>) => {
    const node = ref.current;
    if (!node || !on || !motion || event.pointerType !== "mouse") return;
    const box = node.getBoundingClientRect();
    const dx = (event.clientX - (box.left + box.width / 2)) / (box.width / 2);
    const dy = (event.clientY - (box.top + box.height / 2)) / (box.height / 2);
    node.style.transform = `translate3d(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px, 0)`;
  };

  const leave = () => {
    const node = ref.current;
    if (node) node.style.transform = "";
  };

  return (
    <span
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      className={cn("inline-block transition-transform duration-300 ease-out", on && "w-magnet", className)}
    >
      {children}
    </span>
  );
}
