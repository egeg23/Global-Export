/**
 * Обложки историй — рисунки в духе знака: толстый контур, четыре цвета
 * глобуса. Фото из канала сюда не годятся — см. комментарий у `stories`.
 */
const INK = "#10214A";

export function StoryArt({ id }: { id: string }) {
  if (id === "isfandiyor")
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
        <rect width="320" height="240" fill="#FFF6D1" />
        <path d="M0 200 H320" stroke="#FFD84A" strokeWidth="60" />
        {/* мышка */}
        <path d="M82 70 C112 70 122 98 122 128 C122 162 106 180 82 180 C58 180 42 162 42 128 C42 98 52 70 82 70 Z" fill="#fff" stroke={INK} strokeWidth="5" />
        <path d="M82 70 V112" stroke={INK} strokeWidth="5" />
        <rect x="77" y="84" width="10" height="16" rx="5" fill="#5BA8FF" stroke={INK} strokeWidth="4" />
        <path d="M82 70 C82 40 120 30 150 44" fill="none" stroke={INK} strokeWidth="5" strokeLinecap="round" />
        {/* первые блоки */}
        <g stroke={INK} strokeWidth="5" strokeLinejoin="round">
          <rect x="160" y="62" width="120" height="34" rx="10" fill="#FFD84A" />
          <rect x="160" y="104" width="100" height="34" rx="10" fill="#5BA8FF" />
          <rect x="160" y="146" width="130" height="34" rx="10" fill="#04BD62" />
        </g>
        <g fill={INK} fontFamily="ui-sans-serif, system-ui" fontWeight="900" fontSize="17">
          <text x="174" y="85">вперёд</text>
          <text x="174" y="127">налево</text>
          <text x="174" y="169" fill="#fff">повторить</text>
        </g>
      </svg>
    );
  if (id === "hasan")
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
        <rect width="320" height="240" fill="#E6F0FF" />
        {/* экран игры */}
        <rect x="50" y="34" width="220" height="136" rx="16" fill="#10214A" stroke={INK} strokeWidth="5" />
        <rect x="64" y="48" width="192" height="108" rx="8" fill="#5BA8FF" />
        <path d="M64 136 H256 V156 H64 Z" fill="#04BD62" />
        {/* пиксельный герой */}
        <g fill="#FFD84A" stroke={INK} strokeWidth="3">
          <rect x="104" y="100" width="24" height="24" />
          <rect x="110" y="124" width="12" height="12" />
        </g>
        <rect x="112" y="108" width="4" height="4" fill={INK} />
        <rect x="120" y="108" width="4" height="4" fill={INK} />
        {/* монетки */}
        <g fill="#FCE93A" stroke={INK} strokeWidth="3">
          <circle cx="170" cy="96" r="8" />
          <circle cx="196" cy="84" r="8" />
          <circle cx="222" cy="96" r="8" />
        </g>
        <text x="236" y="70" textAnchor="end" fontFamily="ui-monospace, monospace" fontWeight="700" fontSize="13" fill="#fff">SCORE 030</text>
        {/* геймпад */}
        <rect x="108" y="180" width="104" height="40" rx="20" fill="#E5322D" stroke={INK} strokeWidth="5" />
        <path d="M130 200 H146 M138 192 V208" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
        <circle cx="182" cy="196" r="5" fill="#fff" />
        <circle cx="194" cy="206" r="5" fill="#fff" />
      </svg>
    );
  if (id === "oge")
    return (
      <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
        <rect width="320" height="240" fill="#E7F8EF" />
        <rect x="70" y="30" width="180" height="180" rx="16" fill="#fff" stroke={INK} strokeWidth="5" transform="rotate(-4 160 120)" />
        <g transform="rotate(-4 160 120)">
          <text x="160" y="92" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontWeight="900" fontSize="15" fill="#45557A">ОГЭ · информатика</text>
          <text x="160" y="150" textAnchor="middle" fontFamily="ui-rounded, ui-sans-serif, system-ui" fontWeight="900" fontSize="58" fill="#004AAD">20/21</text>
          <path d="M110 170 H210" stroke="#04BD62" strokeWidth="6" strokeLinecap="round" />
        </g>
        {/* печать-звезда */}
        <circle cx="236" cy="176" r="30" fill="#FFD84A" stroke={INK} strokeWidth="5" />
        <path d="M236 158 L241 170 L254 171 L244 179 L247 192 L236 185 L225 192 L228 179 L218 171 L231 170 Z" fill="#fff" stroke={INK} strokeWidth="3" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
      <rect width="320" height="240" fill="#FFE9E8" />
      <path d="M0 196 H320" stroke="#FFD1CF" strokeWidth="80" />
      {/* школа */}
      <path d="M70 96 L160 50 L250 96" fill="#E5322D" stroke={INK} strokeWidth="5" strokeLinejoin="round" />
      <rect x="84" y="96" width="152" height="100" fill="#fff" stroke={INK} strokeWidth="5" />
      <g fill="#5BA8FF" stroke={INK} strokeWidth="4">
        <rect x="100" y="112" width="26" height="24" rx="3" />
        <rect x="194" y="112" width="26" height="24" rx="3" />
        <rect x="100" y="150" width="26" height="24" rx="3" />
        <rect x="194" y="150" width="26" height="24" rx="3" />
      </g>
      <rect x="146" y="146" width="28" height="50" rx="4" fill="#FFD84A" stroke={INK} strokeWidth="4" />
      {/* флажок с номером */}
      <path d="M160 50 V16" stroke={INK} strokeWidth="5" strokeLinecap="round" />
      <path d="M160 18 H206 L196 30 L206 42 H160 Z" fill="#04BD62" stroke={INK} strokeWidth="4" strokeLinejoin="round" />
      <text x="180" y="36" textAnchor="middle" fontFamily="ui-sans-serif, system-ui" fontWeight="900" fontSize="13" fill="#fff">42</text>
    </svg>
  );
}
