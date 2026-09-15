import { Shell } from "@/components/adar/ui/shell";
import { Reveal } from "@/components/ui/reveal";
import { advantages, company } from "@/content/adar/company";
import { cn } from "@/lib/cn";

/**
 * Четыре причины заказывать здесь, взятые из их же текстов, плюс история
 * первой крупной отгрузки — она у компании на странице «О нас» и работает
 * лучше любого списка преимуществ.
 */
export function Advantages({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <section id="o-kompanii" className={cn("py-20 lg:py-28", dark && "bg-adar-green-900")}>
      <Shell size="wide" className="grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p
            className={cn(
              "text-[0.7rem] font-semibold uppercase tracking-[0.22em]",
              dark ? "text-adar-gold-400" : "text-adar-green-500",
            )}
          >
            О компании
          </p>
          <h2
            className={cn(
              "mt-4 font-adar-display text-4xl leading-tight sm:text-5xl",
              dark ? "text-adar-cream-50" : "text-adar-green-950",
            )}
          >
            Пятнадцатый сезон подряд
          </h2>

          <blockquote className="mt-8 border-l-2 border-adar-gold-500 pl-6">
            <p
              className={cn(
                "font-adar-display text-xl leading-relaxed",
                dark ? "text-adar-cream-50/90" : "text-adar-ink",
              )}
            >
              {company.quote}
            </p>
          </blockquote>

          <p
            className={cn(
              "mt-8 max-w-md text-sm leading-relaxed",
              dark ? "text-adar-cream-50/55" : "text-adar-ink-muted",
            )}
          >
            {company.story}
          </p>
        </div>

        <ul
          className={cn(
            "grid gap-px overflow-hidden rounded-adar sm:grid-cols-2 lg:col-span-7",
            dark ? "bg-white/10" : "bg-adar-green-900/10",
          )}
        >
          {advantages.map((item, index) => (
            <Reveal
              as="li"
              key={item.title}
              delay={index * 70}
              className={cn("p-7", dark ? "bg-adar-green-900" : "bg-adar-cream-50")}
            >
              <span
                className={cn(
                  "font-adar-display text-2xl",
                  dark ? "text-adar-gold-400" : "text-adar-gold-600",
                )}
              >
                0{index + 1}
              </span>
              <h3
                className={cn(
                  "mt-4 text-lg leading-snug",
                  dark ? "text-adar-cream-50" : "text-adar-green-950",
                )}
              >
                {item.title}
              </h3>
              <p
                className={cn(
                  "mt-3 text-sm leading-relaxed",
                  dark ? "text-adar-cream-50/60" : "text-adar-ink-muted",
                )}
              >
                {item.text}
              </p>
            </Reveal>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
