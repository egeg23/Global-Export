"use client";

import { useCallback, useEffect, useState } from "react";

import { cn } from "@/lib/cn";

/**
 * Рамки и общее поведение показа макетов — одно на витрину сайта и на витрину
 * панели управления, чтобы обе выглядели частями одной презентации.
 */

/** Разрешено ли движение. Читает системную настройку и следит за её сменой. */
export function useMotionAllowed() {
  const [allowed, setAllowed] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setAllowed(!query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  return allowed;
}

/**
 * Указатель двигает слои: рамка слегка поворачивается, а силуэты внутри неё
 * разъезжаются по глубине. Значения пишутся прямо в CSS-переменные узла, без
 * состояния React — перерисовка на каждый кадр мыши обошлась бы дороже самого
 * эффекта.
 */
export function usePointerParallax(enabled: boolean) {
  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (!enabled || event.pointerType !== "mouse") return;
      const node = event.currentTarget;
      const box = node.getBoundingClientRect();
      node.style.setProperty("--mv-mx", ((event.clientX - box.left) / box.width - 0.5).toFixed(3));
      node.style.setProperty("--mv-my", ((event.clientY - box.top) / box.height - 0.5).toFixed(3));
    },
    [enabled],
  );

  const onPointerLeave = useCallback((event: React.PointerEvent<HTMLElement>) => {
    const node = event.currentTarget;
    node.style.setProperty("--mv-mx", "0");
    node.style.setProperty("--mv-my", "0");
  }, []);

  return { onPointerMove, onPointerLeave };
}

/** Рамка браузера: верхняя планка с адресом и обрезанный по ней экран. */
export function BrowserFrame({
  path,
  children,
  className,
  bodyClassName,
  style,
}: {
  path: string;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      style={style}
      className={cn(
        "overflow-hidden rounded-xl border border-sand-50/12 bg-forest-900 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-sand-50/10 px-3 py-2">
        <span className="flex gap-1.5" aria-hidden="true">
          <span className="h-2 w-2 rounded-full bg-sand-50/20" />
          <span className="h-2 w-2 rounded-full bg-sand-50/20" />
          <span className="h-2 w-2 rounded-full bg-sand-50/20" />
        </span>
        <span className="mx-auto max-w-[70%] truncate rounded-full bg-sand-50/8 px-3 py-0.5 text-[0.62rem] text-sand-300/60">
          {path}
        </span>
      </div>
      <div className={cn("[container-type:inline-size]", bodyClassName)}>{children}</div>
    </div>
  );
}

/** Телефон — для показа адаптивности (пункт 9 брифа). */
export function PhoneFrame({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[2rem] border-[6px] border-forest-900 bg-forest-900 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.75)]",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-sand-50/20"
      />
      <div className="h-full [container-type:inline-size]">{children}</div>
    </div>
  );
}
