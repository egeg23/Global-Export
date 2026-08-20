import { cn } from "@/lib/cn";

/**
 * Wordmark: a wheat/leaf glyph inside a globe ring — agriculture plus export,
 * drawn as inline SVG so it stays crisp and costs no extra request.
 */
export function Logo({
  className,
  tone = "dark",
}: {
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-3",
        tone === "dark" ? "text-forest-900" : "text-sand-50",
        className,
      )}
    >
      <svg viewBox="0 0 40 40" aria-hidden="true" className="h-9 w-9 shrink-0">
        <circle cx="20" cy="20" r="18.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
        <path
          d="M20 4c4.2 4.4 6.3 9.7 6.3 16S24.2 31.6 20 36c-4.2-4.4-6.3-9.7-6.3-16S15.8 8.4 20 4Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.35"
        />
        <path d="M3.5 20h33" stroke="currentColor" strokeWidth="1.2" opacity="0.35" />
        <path
          d="M20 30.5V17.8"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <path
          d="M20 17.6c0-3.4 1.7-6.3 4.6-8.1.7 3.6-.4 6.9-3.2 9.2-.5.4-1 .3-1.4-.1Zm0 0c0-3.4-1.7-6.3-4.6-8.1-.7 3.6.4 6.9 3.2 9.2.5.4 1 .3 1.4-.1Z"
          fill="currentColor"
        />
        <path
          d="M20 24.4c0-2.6 1.4-4.8 3.8-6.2.6 2.8-.3 5.3-2.6 7.1-.4.3-.9.2-1.2-.1Zm0 0c0-2.6-1.4-4.8-3.8-6.2-.6 2.8.3 5.3 2.6 7.1.4.3.9.2 1.2-.1Z"
          fill="currentColor"
          opacity="0.7"
        />
      </svg>

      <span className="flex flex-col leading-none">
        <span className="font-display text-lg tracking-tight">Global Export</span>
        <span
          className={cn(
            "mt-1 text-[0.6rem] font-semibold uppercase tracking-[0.22em]",
            tone === "dark" ? "text-forest-500" : "text-sand-300/70",
          )}
        >
          Company
        </span>
      </span>
    </span>
  );
}
