"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { money } from "@/components/present/mavera/theme";
import type { Project } from "@/content/mavera/data";
import { cn } from "@/lib/cn";

const segments = ["Все", "Эконом", "Комфорт", "Бизнес"] as const;

/**
 * Каталог «Стандарта»: фильтр, который действительно фильтрует.
 *
 * Весь смысл варианта — найти квартиру, а не любоваться кадром, поэтому
 * состояние живёт прямо здесь и отклик мгновенный: ни перезагрузки, ни
 * ожидания сервера. Оформление швейцарское — сетка, волосяные линии,
 * нулевой радиус, единственный акцент на выбранном фильтре.
 *
 * Фильтр один — по сегменту, ровно как в смете «Стандарта». Статусы,
 * сортировка и поиск по нескольким параметрам — уже «Люкс»: за $5 900 сайт
 * должен и выглядеть, и уметь проще, чем за $8 900.
 */
export function StandardCatalog({ claims, projects }: { claims: Record<string, string>; projects: Project[] }) {
  const [segment, setSegment] = useState<(typeof segments)[number]>("Все");

  const list = projects.filter((p) => segment === "Все" || p.segment === segment);

  const chip = (active: boolean) =>
    cn(
      "border px-4 py-2 text-sm transition-colors duration-200",
      active
        ? "border-[var(--w-accent)] bg-[var(--w-accent)] text-[var(--w-accent-ink)]"
        : "border-[var(--w-line)] text-[var(--w-muted)] hover:border-[var(--w-ink)] hover:text-[var(--w-ink)]",
    );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-[var(--w-line)] pb-6">
        <div className="flex flex-wrap gap-2">
          {segments.map((item) => (
            <button key={item} type="button" onClick={() => setSegment(item)} className={chip(segment === item)}>
              {item}
            </button>
          ))}
        </div>
        <p className="text-sm text-[var(--w-muted)]">
          Найдено: <span className="font-medium text-[var(--w-ink)]">{list.length}</span> из {projects.length}
        </p>
      </div>

      <ul className="mt-5 grid gap-px border border-[var(--w-line)] bg-[var(--w-line)] sm:grid-cols-2 lg:grid-cols-3">
        {list.map((project) => (
          <li key={project.slug} className="group bg-[var(--w-surface)]">
            <Link href={`/mavera/standard/${project.slug}`} prefetch={false} className="block">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={project.photo}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 ease-[var(--w-ease)] group-hover:scale-[1.03] motion-reduce:transform-none"
                />
                <span className="absolute left-0 top-0 bg-[var(--w-ink)] px-3 py-1.5 text-[0.7rem] uppercase tracking-[0.14em] text-white">
                  {project.status}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg">ЖК «{project.name}»</h3>
                  <span className="text-[0.7rem] uppercase tracking-[0.14em] text-[var(--w-muted)]">
                    {project.segment}
                  </span>
                </div>
                <p className="mt-1 text-sm text-[var(--w-muted)]">{project.district}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">
                  {claims[project.slug]}
                </p>

                <dl className="mt-5 grid grid-cols-3 gap-4 border-t border-[var(--w-line)] pt-4 text-sm">
                  {[
                    ["Этажей", project.floors],
                    ["Квартир", project.flats],
                    ["Сдача", project.due.replace("Сдан в ", "")],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt className="text-[0.65rem] uppercase tracking-[0.12em] text-[var(--w-muted)]">{label}</dt>
                      <dd className="mt-1 tabular-nums">{value}</dd>
                    </div>
                  ))}
                </dl>

                <p className="mt-5 flex items-baseline justify-between gap-4 border-t border-[var(--w-line)] pt-4">
                  <span className="text-base font-medium tabular-nums">
                    от {money(project.priceUsd, "uzs")}
                    <span className="ml-1 text-sm font-normal text-[var(--w-muted)]">за м²</span>
                  </span>
                  <span className="text-sm text-[var(--w-accent)] transition-transform duration-200 group-hover:translate-x-1">
                    Выбрать квартиру →
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {list.length === 0 ? (
        <p className="border border-t-0 border-[var(--w-line)] px-6 py-16 text-center text-sm text-[var(--w-muted)]">
          В этом сегменте пока ничего нет. Выберите другой.
        </p>
      ) : null}
    </div>
  );
}
