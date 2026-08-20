"use client";

import { useCallback, useRef, useState } from "react";

import { Container } from "@/components/ui/container";
import { stats } from "@/content/company";
import { t, type Locale } from "@/lib/i18n";

/** Parses "50 000" into 50000, keeping the original for the final render. */
function toNumber(value: string): number | null {
  const digits = value.replace(/[^\d]/g, "");
  return digits ? Number(digits) : null;
}

function Counter({ value, duration = 1400 }: { value: string; duration?: number }) {
  const target = toNumber(value);
  const [display, setDisplay] = useState(target === null ? value : "0");
  const started = useRef(false);

  const start = useCallback(
    (node: HTMLSpanElement | null) => {
      if (!node || target === null || started.current) return;
      if (typeof IntersectionObserver === "undefined") {
        setDisplay(value);
        return;
      }

      const reduced =
        typeof window !== "undefined" &&
        window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        if (reduced) {
          setDisplay(value);
          return;
        }

        const from = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - from) / duration, 1);
          // Ease-out so the number decelerates into place.
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(
            progress === 1
              ? value
              : Math.round(target * eased).toLocaleString("ru-RU").replace(/,/g, " "),
          );
          if (progress < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });

      observer.observe(node);
      return () => observer.disconnect();
    },
    [target, value, duration],
  );

  return <span ref={start}>{display}</span>;
}

/**
 * The figure strip from the client's reference, counting up as it comes into
 * view. `prefers-reduced-motion` skips straight to the final value.
 */
export function CounterStrip({ locale }: { locale: Locale }) {
  return (
    <section className="bg-sand-50 py-20 lg:py-24">
      <Container>
        <dl className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-4">
          {stats.slice(0, 4).map((stat) => (
            <div key={t(stat.label, locale)} className="text-center lg:text-left">
              <dd className="font-display text-[clamp(2.25rem,4vw,3.25rem)] leading-none text-forest-900">
                <Counter value={stat.value} />
                {stat.suffix ? (
                  <span className="ml-1 text-xl text-harvest-500">
                    {t(stat.suffix, locale)}
                  </span>
                ) : null}
              </dd>
              <dt className="mx-auto mt-4 max-w-[13rem] text-sm leading-snug text-ink-muted lg:mx-0">
                {t(stat.label, locale)}
              </dt>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
