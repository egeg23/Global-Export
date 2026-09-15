"use client";

import type { Plan } from "@/content/mavera/plans";
import { cn } from "@/lib/cn";

/**
 * Чертёж квартиры.
 *
 * Комнаты проявляются по очереди — это не украшение: глаз успевает пройти по
 * плану в том же порядке, в каком по квартире идут ногами, от входа вглубь.
 * Задержка живёт в CSS-переменной, поэтому кадры анимации не проходят через
 * состояние React.
 *
 * Чертёж и площади комнат приходят с сервера готовыми: правила выбора
 * планировки по метражу в браузер не уезжают.
 */
export function FlatPlan({
  plan,
  areas,
  area,
  className,
}: {
  plan: Plan;
  areas: number[];
  area: number;
  className?: string;
}) {

  return (
    <svg
      viewBox="0 0 320 232"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label={`Планировка: ${plan.name}, ${area.toFixed(1).replace(".", ",")} м²`}
    >
      <defs>
        {/* Плитка мокрых зон — та же штриховка, что на настоящих чертежах. */}
        <pattern id="mv-tile" width="7" height="7" patternUnits="userSpaceOnUse">
          <path d="M0 7 L7 0" stroke="currentColor" strokeOpacity="0.25" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Балконы — за контуром, тоньше линией. */}
      {plan.balconies.map((balcony) => (
        <rect
          key={`${balcony.x}-${balcony.y}`}
          x={balcony.x}
          y={balcony.y}
          width={balcony.w}
          height={balcony.h}
          fill="var(--w-accent)"
          fillOpacity="0.14"
          stroke="var(--w-ink)"
          strokeOpacity="0.3"
          strokeWidth="1.5"
          className="w-room"
          style={{ "--w-delay": `${plan.layout.length * 70}ms` } as React.CSSProperties}
        />
      ))}

      {plan.layout.map((room, index) => (
        <g
          key={`${room.label}-${room.x}-${room.y}`}
          className="w-room"
          style={{ "--w-delay": `${index * 70}ms` } as React.CSSProperties}
        >
          <rect
            x={room.x}
            y={room.y}
            width={room.w}
            height={room.h}
            fill="var(--w-ink)"
            fillOpacity="0.045"
            stroke="var(--w-ink)"
            strokeOpacity="0.5"
            strokeWidth="2.5"
          />
          {room.wet ? (
            <rect
              x={room.x}
              y={room.y}
              width={room.w}
              height={room.h}
              fill="url(#mv-tile)"
              className="text-[var(--w-ink)]"
            />
          ) : null}

          <text
            x={room.x + room.w / 2}
            y={room.y + room.h / 2 - 4}
            textAnchor="middle"
            className="fill-[var(--w-muted)]"
            style={{ fontSize: room.w < 70 ? 8 : 9.5 }}
          >
            {room.label}
          </text>
          <text
            x={room.x + room.w / 2}
            y={room.y + room.h / 2 + 9}
            textAnchor="middle"
            className="fill-[var(--w-ink)]"
            style={{ fontSize: room.w < 70 ? 8.5 : 10, fontWeight: 500 }}
          >
            {(areas[index] ?? 0).toFixed(1).replace(".", ",")}
          </text>
        </g>
      ))}

      {/* Входная дверь — створка с дугой открывания. */}
      <g
        className="w-room"
        style={{ "--w-delay": `${(plan.layout.length + 1) * 70}ms` } as React.CSSProperties}
        stroke="var(--w-accent)"
        strokeWidth="2.5"
        fill="none"
      >
        <path d={`M${plan.entry.x} ${plan.entry.y} l0 -18`} />
        <path d={`M${plan.entry.x} ${plan.entry.y} a18 18 0 0 0 -18 -18`} strokeOpacity="0.5" />
      </g>
    </svg>
  );
}
