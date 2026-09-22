"use client";

import { useState } from "react";

import { PriceForecast } from "@/components/mavera/forecast/chart";
import type { TierId } from "@/components/present/mavera/theme";
import { projects } from "@/content/mavera/data";
import { forecastOf } from "@/content/mavera/forecast";
import { cn } from "@/lib/cn";

/** Прогноз цены квадратного метра по проектам — выбор проекта чипом. */
export function ProjectForecast({ variant }: { variant: TierId }) {
  const [slug, setSlug] = useState(projects[0].slug);
  const project = projects.find((item) => item.slug === slug) ?? projects[0];
  const points = forecastOf({ priceUsd: project.priceUsd, district: project.district, due: project.due });
  const pill = variant === "premium" || variant === "noir" ? "rounded-full" : variant === "lux" ? "rounded-[2px]" : "rounded-none";

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">Прогноз по годам</p>
          <h3 className="mt-3 text-2xl leading-snug">Что будет с ценой квартиры через пять лет</h3>
        </div>
        <div role="group" aria-label="Проект" className="flex flex-wrap gap-2">
          {projects.map((item) => (
            <button
              key={item.slug}
              type="button"
              aria-pressed={item.slug === slug}
              onClick={() => setSlug(item.slug)}
              className={cn(
                "px-3.5 py-1.5 text-xs transition-colors duration-200",
                pill,
                item.slug === slug ? "bg-[var(--w-accent)] text-[var(--w-accent-ink)]" : "border border-[var(--w-line)] text-[var(--w-muted)] hover:text-[var(--w-ink)]",
              )}
            >
              {item.name}
            </button>
          ))}
        </div>
      </div>

      <div className={cn("mt-8 border border-[var(--w-line)] bg-[var(--w-surface)] p-6 sm:p-8", variant === "premium" || variant === "noir" ? "rounded-[var(--w-radius-lg)]" : variant === "lux" ? "rounded-[2px]" : "")}>
        <PriceForecast
          key={project.slug}
          title={`${variant === "noir" ? "Резиденция" : "ЖК"} «${project.name}» · цена за м² · ${project.district} район · ${project.due}`}
          points={points}
        />
      </div>
    </div>
  );
}
