"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { Addon } from "@/components/configurator/context";
import { In } from "@/components/cf/motion";
import { products, sum, type ComfortCategory, type ComfortProduct } from "@/content/comfort/products";
import { cn } from "@/lib/cn";

/**
 * «Влезет ли» — подбор по размерам комнаты.
 *
 * У Comfort габариты есть почти в каждом описании, но лежат в свободном
 * тексте: чтобы понять, встанет ли диван, покупатель листает карточки и
 * считает в уме. Здесь он вводит стену и глубину комнаты — и видит, какие
 * модели встанут, и план комнаты в масштабе. Ни у одного конкурента в
 * Ташкенте такого нет (docs/comfort-research.md).
 *
 * Считаем только то, что можно посчитать честно: их габариты и общие
 * правила расстановки. Правила подписаны прямо в блоке — это ориентиры, а
 * не обещание магазина. Чего не знаем (высоты спинок, разбирается ли
 * угловой диван), о том так и говорим: «уточните у менеджера».
 *
 * План — SVG: прямоугольники единичного размера, растянутые transform'ом,
 * поэтому при смене модели они плавно перетекают без пересчёта раскладки.
 */

type Kind = Exclude<ComfortCategory, "storage">;

const kinds: { id: Kind; label: string }[] = [
  { id: "sofa", label: "Диван или кресло" },
  { id: "wardrobe", label: "Шкаф" },
  { id: "dining", label: "Обеденная зона" },
  { id: "bed", label: "Кровать" },
];

/** Проход перед мебелью — общий ориентир, см. */
const PASSAGE = 70;
/** Отодвинутый стул — с каждой стороны стола, см. */
const CHAIR = 75;
/** Проход сбоку от кровати, см. */
const BEDSIDE = 60;

type Room = { wall: number; depth: number; door: number; ceiling: number };

type Verdict = {
  fits: boolean;
  /** Что именно не сошлось или что нужно уточнить. */
  notes: string[];
  /** Сколько места останется для прохода, см. */
  free: number;
  /** Занятая площадь с учётом стульев, для плана. */
  footprint: { w: number; d: number };
};

function judge(product: ComfortProduct, room: Room): Verdict | null {
  const { width, depth, height } = product;
  if (!width || !depth) return null;
  const notes: string[] = [];

  if (product.category === "dining") {
    const w = width + CHAIR * 2;
    const d = depth + CHAIR * 2;
    const fits = w <= room.wall && d <= room.depth;
    if (w > room.wall) notes.push(`со стульями нужно ${w} см вдоль стены`);
    if (d > room.depth) notes.push(`со стульями нужно ${d} см в глубину`);
    return { fits, notes, free: Math.min(room.wall - w, room.depth - d), footprint: { w, d } };
  }

  const needWall = product.category === "bed" ? width + BEDSIDE : width;
  const free = room.depth - depth;
  let fits = needWall <= room.wall && free >= PASSAGE;
  if (needWall > room.wall) notes.push(product.category === "bed" ? `с проходом сбоку нужно ${needWall} см` : `шире стены на ${needWall - room.wall} см`);
  if (free < PASSAGE) notes.push(free < 0 ? "глубже комнаты" : `проход останется ${free} см`);

  if (product.category === "wardrobe" && height) {
    // Шкаф собирают лёжа и поднимают: боковина по диагонали должна пройти под потолком.
    const diagonal = Math.ceil(Math.hypot(height, Math.min(depth, 60)));
    if (height >= room.ceiling) {
      fits = false;
      notes.push(`выше потолка: ${height} см`);
    } else if (diagonal >= room.ceiling) {
      fits = false;
      notes.push(`при подъёме диагональ ${diagonal} см — не пройдёт под потолком`);
    }
  }

  if (product.category === "sofa") {
    if (product.modular) notes.push("модульный — заносится по частям");
    else if (depth > room.door) notes.push("глубже дверного проёма — разборность уточните у менеджера");
  }

  return { fits, notes, free, footprint: { w: width, d: depth } };
}

export function Fit() {
  return (
    <Addon id="fit" anchor="fit" as="section" className="py-20 sm:py-28">
      <FitBody />
    </Addon>
  );
}

function FitBody() {
  const [kind, setKind] = useState<Kind>("sofa");
  const [room, setRoom] = useState<Room>({ wall: 360, depth: 420, door: 80, ceiling: 270 });
  const [picked, setPicked] = useState<string | null>(null);

  const rows = useMemo(
    () =>
      products
        .filter((product) => product.category === kind)
        .map((product) => ({ product, verdict: judge(product, room) }))
        .filter((row): row is { product: ComfortProduct; verdict: Verdict } => row.verdict !== null)
        .sort((a, b) => Number(b.verdict.fits) - Number(a.verdict.fits) || b.product.price - a.product.price),
    [kind, room],
  );

  const fitting = rows.filter((row) => row.verdict.fits);
  const current = rows.find((row) => row.product.id === picked) ?? fitting[0] ?? rows[0];

  const field = (key: keyof Room, label: string, min: number, max: number) => (
    <label className="block text-sm">
      <span className="flex items-baseline justify-between gap-3 text-cf-muted">
        {label}
        <b className="font-semibold tabular-nums text-cf-paper">{room[key]} см</b>
      </span>
      <input
        type="range"
        className="cf-range mt-3"
        min={min}
        max={max}
        step={5}
        value={room[key]}
        onChange={(event) => setRoom((value) => ({ ...value, [key]: Number(event.target.value) }))}
      />
    </label>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <In variant="zoom">
        <p className="cf-eyebrow text-cf-accent">Подбор по размерам</p>
        <h2 className="cf-display mt-4 max-w-3xl text-[clamp(2rem,5vw,3.6rem)]">Влезет ли? Проверьте до поездки в шоурум</h2>
        <p className="mt-5 max-w-2xl text-cf-muted">
          Введите размеры комнаты — покажем модели из каталога, которые встанут, и план в масштабе. Габариты — из
          карточек Comfort.
        </p>
      </In>

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-[1.75rem] bg-cf-ink-3 p-5 sm:p-7 lg:col-span-5">
          <div role="group" aria-label="Что ставим" className="flex flex-wrap gap-2">
            {kinds.map((item) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={kind === item.id}
                onClick={() => {
                  setKind(item.id);
                  setPicked(null);
                }}
                className="cf-chip"
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="mt-7 space-y-6">
            {field("wall", "Длина стены", 150, 700)}
            {field("depth", "Глубина комнаты", 200, 700)}
            {kind === "sofa" ? field("door", "Ширина дверного проёма", 60, 120) : null}
            {kind === "wardrobe" ? field("ceiling", "Высота потолка", 220, 330) : null}
          </div>
          <p className="mt-7 text-xs leading-relaxed text-cf-muted">
            Ориентиры: проход перед мебелью {PASSAGE} см, у кровати {BEDSIDE} см сбоку, за стулом {CHAIR} см. Шкаф
            собирают лёжа — проверяем, пройдёт ли он при подъёме под потолком.
          </p>
        </div>

        <div className="overflow-hidden rounded-[1.75rem] bg-cf-ink-2 lg:col-span-7">
          {current ? <Plan room={room} row={current} kind={kind} /> : null}
          <p aria-live="polite" className="border-t border-cf-line px-5 py-4 text-sm sm:px-7">
            Встанут <b className="text-cf-accent">{fitting.length}</b> из {rows.length} моделей этой категории.
            {fitting.length === 0 ? " Comfort делает мебель по индивидуальным размерам — спросите в шоуруме." : null}
          </p>
        </div>
      </div>

      <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map(({ product, verdict }) => {
          const active = current?.product.id === product.id;
          return (
            <li key={product.id}>
              <button
                type="button"
                onClick={() => setPicked(product.id)}
                aria-pressed={active}
                className={cn(
                  "flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-colors",
                  active ? "bg-cf-ink-3 ring-1 ring-cf-accent" : "bg-cf-ink-3/60 hover:bg-cf-ink-3",
                  !verdict.fits && "opacity-70",
                )}
              >
                <span className="relative h-16 w-14 shrink-0 overflow-hidden rounded-xl">
                  <Image src={product.image} alt="" fill sizes="56px" className="object-cover" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{product.name}</span>
                  <span className="block text-xs text-cf-muted">{product.size}</span>
                  <span className="mt-1 block text-xs tabular-nums text-cf-muted">{sum(product.price)}</span>
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2.5 py-1 text-[0.7rem] font-semibold",
                    verdict.fits ? "bg-cf-accent text-cf-accent-ink" : "bg-white/8 text-cf-muted",
                  )}
                >
                  {verdict.fits ? "встанет" : "не встанет"}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** План комнаты сверху, в масштабе. */
function Plan({ room, row, kind }: { room: Room; row: { product: ComfortProduct; verdict: Verdict }; kind: Kind }) {
  const { product, verdict } = row;
  const pad = 40;
  const view = 600;
  const scale = (view - pad * 2) / Math.max(room.wall, room.depth, verdict.footprint.w, verdict.footprint.d + 10);
  const rw = room.wall * scale;
  const rd = room.depth * scale;
  const ox = (view - rw) / 2;
  const oy = pad;

  const fw = verdict.footprint.w * scale;
  const fd = verdict.footprint.d * scale;
  const fx = ox + (rw - fw) / 2;
  // Обеденная зона — посередине комнаты, остальное — к стене.
  const fy = kind === "dining" ? oy + (rd - fd) / 2 : oy;

  const iw = (product.width ?? 0) * scale;
  const id = (product.depth ?? 0) * scale;
  const ix = ox + (rw - iw) / 2;
  const iy = kind === "dining" ? oy + (rd - id) / 2 : oy;

  const unit = (x: number, y: number, w: number, h: number) =>
    ({ transform: `translate(${x}px, ${y}px) scale(${Math.max(w, 0.01)}, ${Math.max(h, 0.01)})` }) as React.CSSProperties;
  const ease = "transition-transform duration-700 ease-[var(--ease-cf)] motion-reduce:transition-none";
  const height = oy + rd + pad + 10;

  return (
    <div className="p-4 sm:p-6">
      <svg viewBox={`0 0 ${view} ${height}`} role="img" aria-label={`План: ${product.name} в комнате ${room.wall} на ${room.depth} см`} className="h-auto w-full">
        {/* Комната. */}
        <rect x={ox} y={oy} width={rw} height={rd} rx={6} fill="rgb(255 255 255 / 0.03)" stroke="var(--cf-line)" strokeWidth={1.5} className="transition-all duration-500" />
        {/* Стена, у которой стоит мебель. */}
        <line x1={ox} y1={oy} x2={ox + rw} y2={oy} stroke="var(--cf-paper)" strokeWidth={4} strokeLinecap="round" opacity={kind === "dining" ? 0.3 : 0.9} />
        {/* Дверь — внизу справа. */}
        {kind === "sofa" ? (
          <g>
            <line x1={ox + rw - 20 - room.door * scale} y1={oy + rd} x2={ox + rw - 20} y2={oy + rd} stroke="var(--cf-accent)" strokeWidth={4} />
            <text x={ox + rw - 20 - (room.door * scale) / 2} y={oy + rd + 22} textAnchor="middle" fontSize={18} fill="var(--cf-muted)">
              дверь {room.door}
            </text>
          </g>
        ) : null}

        {/* Зона стульев или прохода сбоку. */}
        {kind === "dining" || kind === "bed" ? (
          <rect
            x={0}
            y={0}
            width={1}
            height={1}
            fill="var(--cf-accent)"
            opacity={0.12}
            className={ease}
            style={unit(kind === "bed" ? fx - (BEDSIDE * scale) / 2 : fx, fy, kind === "bed" ? fw + BEDSIDE * scale : fw, fd)}
          />
        ) : null}

        {/* Сама мебель. */}
        <rect
          x={0}
          y={0}
          width={1}
          height={1}
          fill={verdict.fits ? "var(--cf-accent)" : "#ff8a7a"}
          opacity={0.85}
          className={ease}
          style={unit(ix, iy, iw, id)}
        />

        {/* Проход до противоположной стены. */}
        {kind !== "dining" && verdict.free > 0 ? (
          <g className="transition-opacity duration-500">
            <line x1={ox + rw / 2} y1={iy + id + 6} x2={ox + rw / 2} y2={oy + rd - 6} stroke="var(--cf-muted)" strokeDasharray="4 5" />
            <text x={ox + rw / 2 + 8} y={iy + id + (oy + rd - iy - id) / 2 + 4} fontSize={19} fill="var(--cf-paper)">
              проход {verdict.free} см
            </text>
          </g>
        ) : null}

        <text x={ox} y={oy - 12} fontSize={18} fill="var(--cf-muted)">
          стена {room.wall} см
        </text>
        <text x={ox - 14} y={oy + rd / 2} fontSize={18} fill="var(--cf-muted)" textAnchor="middle" transform={`rotate(-90 ${ox - 14} ${oy + rd / 2})`}>
          {room.depth} см
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap items-baseline justify-between gap-2 px-1">
        <p className="font-semibold">
          {product.name} <span className="text-sm font-normal text-cf-muted">· {product.size}</span>
        </p>
        <p className={cn("text-sm font-semibold", verdict.fits ? "text-cf-accent" : "text-[#ff8a7a]")}>
          {verdict.fits ? "Встанет" : "Не встанет"}
        </p>
      </div>
      {verdict.notes.length ? <p className="mt-1 px-1 text-xs text-cf-muted">{verdict.notes.join(" · ")}</p> : null}
    </div>
  );
}
