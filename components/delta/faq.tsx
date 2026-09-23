import { faq } from "@/content/delta/school";

/**
 * Вопросы родителей — в их формулировках и с ответами только из того, что
 * школа публикует. Нативные <details>: работают без скриптов и с клавиатуры.
 */
export function Faq() {
  return (
    <section id="voprosy" className="bg-white px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-blue">Вопросы</p>
          <h2 className="mt-3 font-dl-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Что спрашивают родители
          </h2>
          <p className="mt-4 max-w-sm text-lg leading-relaxed text-dl-ink-muted">
            Не нашли свой вопрос — задайте его в нашем чате в Telegram.
          </p>
        </div>

        <div className="grid gap-3">
          {faq.map((item) => (
            <details key={item.q} className="group dl-clay-soft overflow-hidden open:border-dl-ink">
              <summary className="dl-focus flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-dl-display text-lg font-black marker:hidden">
                {item.q}
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-[3px] border-dl-ink bg-dl-yellow text-base transition-transform duration-300 group-open:rotate-45"
                  aria-hidden="true"
                >
                  +
                </span>
              </summary>
              <p className="px-5 pb-5 text-base leading-relaxed text-dl-ink-muted">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
