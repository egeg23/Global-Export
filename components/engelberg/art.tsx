/**
 * Рисованные части истории — векторные, чтобы оставаться чёткими при любом
 * приближении камеры: логотип Engelberg, разрез профиля, туннель камеры.
 */

/** Надпись «Engelberg» с их логотипа (engelberg-window.com/uploads/logo.svg). */
export function Wordmark({ className }: { className?: string }) {
  return (
    <svg viewBox="82 18 168 34" className={className} role="img" aria-label="Engelberg">
      <path fill="currentColor" fillRule="evenodd" d={WORDMARK} />
    </svg>
  );
}

const WORDMARK =
  "m101 43-.6 2.7H83V20.3h17l.5 2.7H86v8h13v2.8H86V43zm19.7 2.7-2.7.1V34.1q0-2.5-1.3-3.7-1.2-1.4-3.8-1.4-3 0-4.7 1.8a6 6 0 0 0-1.8 4.5v10.4l-2.7.1V27.1l2.7-.2v3.6a7 7 0 0 1 2.7-2.8 8 8 0 0 1 4-1q7.6 0 7.6 7zm23-20v1l-.7 1.5-2 .3q-1.2.3-1.8 1 1.2 1.5 1.2 3.6 0 2.7-2.2 4.5a9 9 0 0 1-5.7 1.8q-1.5 0-2.8-.3v.3q0 .7 1 1l2.4.2q3.9 0 6.4 1.7 2.6 1.5 2.6 4.3t-2.7 4.4q-2.7 1.9-6.8 1.8t-6.7-1.4q-2.9-1.5-2.8-3.5 0-3.6 7.1-3.6l-3.1.9q-1.7.6-1.7 1.6 0 1.4 1.9 2.4 2 1.2 5 1.2t4.7-.9q2-1 2-3 0-1.8-1.7-3a10 10 0 0 0-5-1.1q-2.6 0-3.3-.2-1.4-.3-1.4-1.1 0-1.1 1-2.4a7 7 0 0 1-3.1-2.3q-1-1.4-1-3.3 0-2.8 2.2-4.7a9 9 0 0 1 5.6-1.8q3 0 5 1.3l3.7-1.5q1.8-.7 2.6-.7m-6.2 7.5q0-1.9-1.4-3.2-1.6-1.2-3.7-1.2t-3.6 1.2a4 4 0 0 0-1.4 3.2 4 4 0 0 0 1.4 3q1.5 1.2 3.6 1.2t3.7-1.2 1.4-3m27 1.2-.1.5-16.2 3.4a7 7 0 0 0 7 5.5q2.7 0 4.4-1.1 1.7-1 2.6-3l1.8 1.6q-2.2 5-8.8 4.9-4.6-.1-7.3-2.6a10 10 0 0 1-2.8-7.2q0-4.2 2.9-7t7.2-2.8q4 .1 6.7 2.5 2.6 2.5 2.6 5.3m-3.3-.5a5 5 0 0 0-2-3.5 7 7 0 0 0-4.2-1.5 7 7 0 0 0-7.2 7.3zm9 11.8-2.7.1V20.3l2.7-.3zm23.8-9.5q0 4.5-2.7 7.3a10 10 0 0 1-7 2.7q-4.5 0-7-3v2.4l-2.7.2V20.3l2.7-.3v10.2q1-1.6 3-2.6a8 8 0 0 1 4-1q4.3.1 7 2.6 2.7 2.6 2.7 7m-2.6 0q0-3-1.9-5.1-2-2-5-2-3.4 0-5.2 2a7 7 0 0 0-2 5.4q0 3 2 5.2 1.9 2 5.3 2 3 0 4.9-2 2-2.2 2-5.5m24.4-1.8v.5l-16.3 3.4a7 7 0 0 0 2.6 4q1.8 1.5 4.5 1.5t4.3-1.1q1.7-1 2.6-3l1.8 1.6q-2.2 5-8.8 4.9-4.5-.1-7.2-2.6a10 10 0 0 1-2.7-7.2q0-4.2 2.8-7a10 10 0 0 1 7.1-2.8q4 .1 6.8 2.5a7 7 0 0 1 2.5 5.3m-3.3-.5a5 5 0 0 0-2-3.5 6 6 0 0 0-4-1.5 7 7 0 0 0-7.3 7.3zm17.1-7-.6 2.7h-.6a7 7 0 0 0-5 1.8 6 6 0 0 0-1.8 4.6v9.7l-2.8.1V27.1l2.7-.2v4a7 7 0 0 1 2.9-3 8 8 0 0 1 4.1-1zm20.4-1.2q-.8 0-2.6.7l-3.8 1.5q-2-1.3-4.9-1.3-3.3 0-5.6 1.8a6 6 0 0 0-2.4 4.7q0 2 1.2 3.3 1 1.5 3 2.3-.9 1.4-1 2.4t1.5 1q.8.3 3.1.3 3.3 0 5 1 2 1.3 1.9 3.1 0 2-2 3-1.9 1-4.7 1-3 0-5-1.3-2-1-2-2.4 0-1 1.8-1.6l3-1q-7 0-7 3.7 0 1.9 2.7 3.5 2.8 1.4 6.7 1.4t6.9-1.8q2.7-1.6 2.7-4.4-.1-2.7-2.6-4.3a11 11 0 0 0-6.4-1.7q-1.6 0-2.6-.2-.8-.3-.8-1v-.3q1 .3 2.7.3 3.4 0 5.8-1.8a6 6 0 0 0 2.2-4.5q0-2-1.3-3.7.7-.6 1.9-.9l2-.3.6-1.6zm-6.2 7.5a4 4 0 0 1-1.4 3q-1.5 1.2-3.6 1.2-2.2 0-3.6-1.2a4 4 0 0 1-1.4-3 4 4 0 0 1 1.4-3.2q1.5-1.2 3.6-1.2t3.6 1.2a4 4 0 0 1 1.4 3.2";

/**
 * Разрез алюминиевого профиля с термомостом — по их же снимку разреза
 * (каталог, «Системы из алюминия»): тёмный алюминий, красная полиамидная
 * вставка, три стекла. Улица слева, дом справа. Масштаб — около 3,5
 * единицы на миллиметр: глубина рамы 90 мм ≈ 320 единиц. Видимая часть —
 * SECTION_BOX: улица слева от рамы, дом справа.
 */
export const SECTION_BOX = { x: 200, y: 60, w: 600, h: 580 } as const;
export function ProfileSection() {
  return (
    <svg
      viewBox={`${SECTION_BOX.x} ${SECTION_BOX.y} ${SECTION_BOX.w} ${SECTION_BOX.h}`}
      className="eb-section"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="eb-alu" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--eb-alu-hi)" />
          <stop offset="0.45" stopColor="var(--eb-alu)" />
          <stop offset="1" stopColor="var(--eb-alu-lo)" />
        </linearGradient>
        <linearGradient id="eb-glass" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--eb-glass)" stopOpacity="0.55" />
          <stop offset="0.5" stopColor="var(--eb-glass-hi)" stopOpacity="0.9" />
          <stop offset="1" stopColor="var(--eb-glass)" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="eb-heat" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="var(--eb-cold)" />
          <stop offset="0.43" stopColor="var(--eb-cold)" stopOpacity="0.6" />
          <stop offset="0.5" stopColor="var(--eb-cold)" stopOpacity="0" />
          <stop offset="0.5" stopColor="var(--eb-warm)" stopOpacity="0" />
          <stop offset="0.57" stopColor="var(--eb-warm)" stopOpacity="0.6" />
          <stop offset="1" stopColor="var(--eb-warm)" />
        </linearGradient>
        <linearGradient id="eb-fade-up" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="1" />
        </linearGradient>
        <mask id="eb-glass-mask" maskUnits="userSpaceOnUse" x="380" y="60" width="240" height="320">
          <rect x="380" y="60" width="240" height="320" fill="url(#eb-fade-up)" />
        </mask>
        <pattern id="eb-foam" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="8" height="8" fill="var(--eb-foam)" />
          <line x1="0" y1="0" x2="0" y2="8" stroke="var(--eb-foam-line)" strokeWidth="2" />
        </pattern>
      </defs>

      {/* Стеклопакет: три стекла, дистанционные рамки, уплотнители */}
      <g className="eb-sec-glass" mask="url(#eb-glass-mask)">
        <rect x="425" y="60" width="12" height="300" fill="url(#eb-glass)" />
        <rect x="494" y="60" width="12" height="300" fill="url(#eb-glass)" />
        <rect x="563" y="60" width="12" height="300" fill="url(#eb-glass)" />
        <rect x="437" y="318" width="57" height="20" rx="2" fill="var(--eb-spacer)" />
        <rect x="506" y="318" width="57" height="20" rx="2" fill="var(--eb-spacer)" />
        <rect x="425" y="338" width="150" height="16" fill="var(--eb-seal)" />
        <rect x="411" y="300" width="14" height="40" rx="5" fill="var(--eb-seal)" />
        <rect x="575" y="300" width="14" height="40" rx="5" fill="var(--eb-seal)" />
      </g>

      {/* Тепловое поле: холод слева упирается в термомост */}
      <rect className="eb-sec-heat" x="330" y="330" width="340" height="280" fill="url(#eb-heat)" />

      {/* Створка */}
      <g className="eb-sec-metal" fill="url(#eb-alu)" stroke="var(--eb-alu-edge)" strokeWidth="1.5">
        <path d="M372 300h56v46h-20v80h20v24h-56z" />
        <path d="M572 300h56v150h-56v-24h20v-80h-20z" />
        <path d="M384 316h28v18h-28zM384 360h18v60h-18zM600 316h16v118h-16z" fill="var(--eb-hollow)" />
      </g>

      {/* Рама */}
      <g className="eb-sec-metal" fill="url(#eb-alu)" stroke="var(--eb-alu-edge)" strokeWidth="1.5">
        <path d="M340 462h91v138h-91z" />
        <path d="M569 462h91v138h-91z" />
        <path d="M356 478h59v44h-59zM356 536h59v48h-59zM585 478h59v106h-59z" fill="var(--eb-hollow)" />
      </g>

      {/* Термомост: две полиамидные вставки и утеплитель между ними */}
      <g className="eb-sec-break">
        <rect x="431" y="474" width="138" height="112" fill="url(#eb-foam)" />
        <rect x="431" y="466" width="138" height="12" rx="3" fill="var(--eb-break)" />
        <rect x="431" y="582" width="138" height="12" rx="3" fill="var(--eb-break)" />
        <rect x="428" y="356" width="144" height="10" rx="3" fill="var(--eb-break)" />
        <rect x="428" y="420" width="144" height="10" rx="3" fill="var(--eb-break)" />
        <rect x="431" y="366" width="138" height="54" fill="url(#eb-foam)" />
      </g>

      {/* Подсветка контуров по ходу рассказа */}
      <g className="eb-sec-marks" fill="none" strokeWidth="2">
        <rect className="eb-mark eb-mark-1" x="334" y="294" width="102" height="312" rx="10" />
        <rect className="eb-mark eb-mark-2" x="424" y="350" width="152" height="250" rx="10" />
        <rect className="eb-mark eb-mark-3" x="564" y="294" width="102" height="312" rx="10" />
      </g>
      <g className="eb-sec-nums">
        <text className="eb-num eb-num-1" x="385" y="630" textAnchor="middle">01</text>
        <text className="eb-num eb-num-2" x="500" y="630" textAnchor="middle">02</text>
        <text className="eb-num eb-num-3" x="615" y="630" textAnchor="middle">03</text>
      </g>
    </svg>
  );
}

/**
 * Пролёт сквозь камеру профиля: рамки-сечения уходят навстречу, как рёбра
 * туннеля. Глубину рамкам раздаёт движок через переменную --eb-fly.
 */
export function Tunnel() {
  return (
    <div className="eb-tunnel" aria-hidden="true">
      {Array.from({ length: 9 }, (_, i) => (
        <span key={i} className="eb-rib" data-k={`rib${i}`}>
          <i />
        </span>
      ))}
    </div>
  );
}
