import { cn } from "@/lib/cn";

import { Reveal } from "./reveal";

export function Eyebrow({
  children,
  className,
  tone = "dark",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "dark" | "light";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-[0.7rem] font-semibold uppercase tracking-[0.18em]",
        tone === "dark" ? "text-forest-600" : "text-harvest-300",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "h-px w-6",
          tone === "dark" ? "bg-forest-400/60" : "bg-harvest-300/60",
        )}
      />
      {children}
    </span>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  text?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
  /** Rendered to the right of the heading on wide screens — usually a link. */
  action?: React.ReactNode;
};

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  tone = "dark",
  className,
  action,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-6 md:flex-row md:items-end md:justify-between",
        align === "center" && "md:flex-col md:items-center",
        className,
      )}
    >
      <Reveal className={cn("max-w-2xl", align === "center" && "text-center")}>
        {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
        <h2
          className={cn(
            "mt-4 text-3xl leading-[1.15] sm:text-4xl lg:text-[2.75rem]",
            tone === "dark" ? "text-forest-950" : "text-sand-50",
          )}
        >
          {title}
        </h2>
        {text ? (
          <p
            className={cn(
              "mt-4 text-base leading-relaxed sm:text-lg",
              tone === "dark" ? "text-ink-muted" : "text-sand-200/80",
            )}
          >
            {text}
          </p>
        ) : null}
      </Reveal>

      {action ? (
        <Reveal delay={120} className="shrink-0">
          {action}
        </Reveal>
      ) : null}
    </div>
  );
}
