import { cn } from "@/lib/cn";

/**
 * Архитектурная заставка для макетов.
 *
 * Рисуется кодом, а не фотографией: рендеров MAVERA у нас нет, а подставлять
 * чужие здания в макет застройщика нечестно — на защите это первый вопрос.
 * Заодно силуэты ничего не весят, перекрашиваются вместе с палитрой и дают
 * три слоя разной глубины, которые и разъезжаются в параллаксе.
 *
 * Окна раскладываются детерминированной псевдослучайностью: при одинаковом
 * seed сервер и клиент рисуют одно и то же, иначе React ругался бы на
 * расхождение разметки при гидрации.
 */

function noise(seed: number): number {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

type Tower = { x: number; w: number; top: number };

const far: Tower[] = [
  { x: 40, w: 90, top: 250 },
  { x: 150, w: 70, top: 300 },
  { x: 245, w: 110, top: 215 },
  { x: 380, w: 80, top: 285 },
  { x: 485, w: 95, top: 240 },
  { x: 605, w: 75, top: 305 },
  { x: 700, w: 120, top: 225 },
  { x: 845, w: 85, top: 270 },
  { x: 955, w: 100, top: 235 },
  { x: 1080, w: 80, top: 295 },
];

const mid: Tower[] = [
  { x: 95, w: 130, top: 330 },
  { x: 250, w: 105, top: 285 },
  { x: 380, w: 145, top: 350 },
  { x: 550, w: 115, top: 300 },
  { x: 690, w: 135, top: 345 },
  { x: 850, w: 110, top: 290 },
  { x: 985, w: 150, top: 340 },
];

const near: Tower[] = [
  { x: -20, w: 200, top: 395 },
  { x: 205, w: 160, top: 355 },
  { x: 390, w: 185, top: 410 },
  { x: 600, w: 170, top: 370 },
  { x: 795, w: 195, top: 405 },
  { x: 1015, w: 210, top: 365 },
];

/** Сетка окон по фасаду — шаг и пропуски зависят от seed, не от Math.random. */
function windows(tower: Tower, seed: number, step: number, size: number) {
  const cells: React.ReactNode[] = [];
  const cols = Math.max(1, Math.floor((tower.w - step) / step));
  const rows = Math.max(1, Math.floor((600 - tower.top - step) / step));
  const originX = tower.x + (tower.w - (cols - 1) * step - size) / 2;

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const lit = noise(seed + row * 31.7 + col * 7.3);
      if (lit < 0.42) continue;
      cells.push(
        <rect
          key={`${row}-${col}`}
          x={originX + col * step}
          y={tower.top + step + row * step}
          width={size}
          height={size * 1.4}
          rx={size * 0.2}
          opacity={0.25 + lit * 0.55}
        />,
      );
    }
  }

  return cells;
}

type Props = {
  className?: string;
  /** Глубина параллакса: 0 — слои стоят на месте. */
  depth?: number;
};

export function Skyline({ className, depth = 1 }: Props) {
  const shift = (amount: number) =>
    ({
      transform: `translate3d(calc(var(--mv-mx, 0) * ${amount * depth}px), calc(var(--mv-p, 0) * ${-amount * depth * 1.6}px), 0)`,
      transition: "transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)",
    }) satisfies React.CSSProperties;

  /*
   * Небо и свечение заданы фоном элемента, а не градиентами в <defs>:
   * идентификатор в `url(#...)` один на весь документ, поэтому все макеты
   * страницы брали небо у того, который отрисовался первым, — в дневной
   * палитре оно оставалось ночным.
   */
  return (
    <svg
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      className={cn("h-full w-full", className)}
      style={{
        background:
          "radial-gradient(45% 45% at 70% 26%, var(--mv-glow), transparent 70%), linear-gradient(to bottom, var(--mv-sky-top), var(--mv-sky-bottom))",
      }}
    >
      {/* Дальний план: плоские силуэты без деталей. */}
      <g style={shift(4)} fill="var(--mv-tower-far)">
        {far.map((tower) => (
          <rect
            key={tower.x}
            x={tower.x}
            y={tower.top}
            width={tower.w}
            height={600 - tower.top}
          />
        ))}
      </g>

      {/* Средний план: корпуса с окнами. */}
      <g style={shift(10)}>
        {mid.map((tower, index) => (
          <g key={tower.x}>
            <rect
              x={tower.x}
              y={tower.top}
              width={tower.w}
              height={600 - tower.top}
              fill="var(--mv-tower-mid)"
            />
            <g fill="var(--mv-window)">{windows(tower, index * 97 + 13, 14, 5)}</g>
          </g>
        ))}
      </g>

      {/* Ближний план: крупные блоки, козырьки и башенный кран. */}
      <g style={shift(20)}>
        <g stroke="var(--mv-tower-near)" strokeWidth="3" fill="none" opacity="0.85">
          <path d="M1120 150 v250" />
          <path d="M1035 168 h150" />
          <path d="M1120 150 l-30 18 h60 z" />
          <path d="M1075 168 v22" />
        </g>
        {near.map((tower, index) => (
          <g key={tower.x}>
            <rect
              x={tower.x}
              y={tower.top}
              width={tower.w}
              height={600 - tower.top}
              fill="var(--mv-tower-near)"
            />
            <rect
              x={tower.x}
              y={tower.top}
              width={tower.w}
              height={6}
              fill="var(--mv-accent)"
              opacity="0.5"
            />
            <g fill="var(--mv-window)">{windows(tower, index * 53 + 29, 18, 7)}</g>
          </g>
        ))}
      </g>
    </svg>
  );
}
