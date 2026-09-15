import { Rise } from "@/components/mavera/reveal";
import type { TierId } from "@/components/present/mavera/theme";
import { news, reviews } from "@/content/mavera/extras";
import { cn } from "@/lib/cn";

/**
 * Блоки-допники главной, общие для трёх миров.
 *
 * Оформление берётся из токенов мира: в «Стандарте» это строгие карточки без
 * радиуса, в «Люксе» — засечные заголовки на бумаге, в «Премиуме» — стекло на
 * тёмном. Разметка одна.
 */

const width: Record<TierId, string> = {
  standard: "max-w-[1400px]",
  lux: "max-w-[1500px]",
  premium: "max-w-[1500px]",
};

const radius: Record<TierId, string> = {
  standard: "",
  lux: "rounded-[2px]",
  premium: "rounded-[var(--w-radius-lg)]",
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[0.7rem] uppercase tracking-[0.24em] text-[var(--w-accent)]">{children}</p>;
}

/** Отзывы жильцов — допник «Отзывы». */
export function Reviews({ variant }: { variant: TierId }) {
  return (
    <div className={cn("mx-auto w-full px-5 py-20 sm:px-8", width[variant])}>
      <Rise className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Отзывы</Eyebrow>
          <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08]">Что говорят те, кто уже въехал</h2>
        </div>
        <p className="max-w-sm text-sm leading-relaxed text-[var(--w-muted)]">
          Отзывы собираются в панели управления и публикуются после проверки.
          Здесь — условные тексты для показа блока.
        </p>
      </Rise>

      <ul className="mt-10 grid gap-5 md:grid-cols-3">
        {reviews.map((review, index) => (
          <Rise
            as="li"
            key={review.name}
            delay={index * 80}
            className={cn("border border-[var(--w-line)] bg-[var(--w-surface)] p-6", radius[variant])}
          >
            <p aria-label={`Оценка ${review.rating} из 5`} className="text-sm tracking-[0.2em] text-[var(--w-accent)]">
              {"★".repeat(review.rating)}
              <span className="opacity-30">{"★".repeat(5 - review.rating)}</span>
            </p>
            <p className="mt-4 text-base leading-relaxed">{review.text}</p>
            <p className="mt-5 text-sm font-medium">{review.name}</p>
            <p className="mt-1 text-xs text-[var(--w-muted)]">{review.flat}</p>
          </Rise>
        ))}
      </ul>
    </div>
  );
}

/** Новости компании — допник «Новости и пресс-центр». */
export function News({ variant }: { variant: TierId }) {
  return (
    <div className={cn("mx-auto w-full px-5 py-20 sm:px-8", width[variant])}>
      <Rise className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <Eyebrow>Новости</Eyebrow>
          <h2 className="mt-4 text-[clamp(1.8rem,3vw,2.6rem)] leading-[1.08]">Что происходит на стройках</h2>
        </div>
        <span className="text-sm text-[var(--w-accent)]">Все новости →</span>
      </Rise>

      <div className="mt-10 grid gap-px bg-[var(--w-line)] md:grid-cols-3">
        {news.map((item, index) => (
          <Rise as="article" key={item.title} delay={index * 80} className="bg-[var(--w-bg)] p-6">
            <time className="text-xs text-[var(--w-muted)]">{item.date}</time>
            <h3 className="mt-3 text-xl leading-snug">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-[var(--w-muted)]">{item.text}</p>
          </Rise>
        ))}
      </div>
    </div>
  );
}
