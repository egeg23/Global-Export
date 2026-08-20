import { cn } from "@/lib/cn";

/**
 * Line icons drawn on a 24×24 grid with a 1.4 stroke, so they sit at the same
 * optical weight as the body text. Inline SVG — no icon package in the bundle.
 */
const paths = {
  chain: (
    <>
      <path d="M10 14a4 4 0 0 0 5.66 0l3-3A4 4 0 0 0 13 5.34l-1.2 1.2" />
      <path d="M14 10a4 4 0 0 0-5.66 0l-3 3A4 4 0 0 0 11 18.66l1.2-1.2" />
    </>
  ),
  lab: (
    <>
      <path d="M9.5 3v6.2L4.8 17a2.2 2.2 0 0 0 1.9 3.3h10.6a2.2 2.2 0 0 0 1.9-3.3l-4.7-7.8V3" />
      <path d="M8 3h8M8.6 13.5h6.8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 6v5.5c0 4.2 2.9 7.6 7 9.5 4.1-1.9 7-5.3 7-9.5V6l-7-3Z" />
      <path d="m9.2 12.2 2 2 3.6-3.9" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M3.2 9.5h17.6M3.2 14.5h17.6" />
      <path d="M12 3c2.5 2.6 3.8 5.7 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.7-3.8-9S9.5 5.6 12 3Z" />
    </>
  ),
  docs: (
    <>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </>
  ),
  storage: (
    <>
      <path d="M3 9.5 12 4l9 5.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5Z" />
      <path d="M8 21v-6h8v6M8 12h8" />
    </>
  ),
  leaf: (
    <>
      <path d="M4 20c0-8 5-13 16-13 0 8-4.8 13-11 13H4Z" />
      <path d="M4 20c3.5-4.5 7-7.5 12-9.5" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6.5h11v10H3z" />
      <path d="M14 10h3.6l2.4 3v3.5h-6" />
      <circle cx="7" cy="18" r="1.8" />
      <circle cx="16.5" cy="18" r="1.8" />
    </>
  ),
  handshake: (
    <>
      <path d="m3 12 3-3 4 3.5 2-1.5 2 1.5L18 9l3 3" />
      <path d="M6 9 9.5 6H15l3.5 3M8 16l2.5 2.5a2 2 0 0 0 2.8 0L18 14" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="m3.8 7 8.2 6 8.2-6" />
    </>
  ),
  phone: (
    <path d="M6.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 6 6L16.5 13l4 1.5v3a2 2 0 0 1-2.2 2C10.8 19 5 13.2 4.5 5.7a2 2 0 0 1 2-2.2Z" />
  ),
  pin: (
    <>
      <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.3l3.4 2" />
    </>
  ),
} satisfies Record<string, React.ReactNode>;

/**
 * Union of the icons actually drawn above. `paths` is intentionally left
 * un-annotated: typing it as Record<string, …> would widen this back to
 * `string` and a misspelled name would compile.
 */
export type IconName = keyof typeof paths;

export function Icon({ name, className }: { name: IconName; className?: string }) {
  const node = paths[name];

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={cn("h-6 w-6", className)}
    >
      {node}
    </svg>
  );
}
