import { cn } from "@/lib/cn";

/**
 * Логотип ADAR.
 *
 * На фирменном пакете это золотое тиснение с разрядкой и подписью
 * «SINCE 2011» под ним — так и набрано, шрифтом, а не картинкой: логотип в
 * векторе у компании не запрашивался, а растровый на их сайте мутный.
 *
 * Цвет подписи задаётся не начертанием знака, а поверхностью под ним:
 * золотой знак стоит и на кремовой шапке, и на тёмной, а тёмно-серая подпись
 * читается только на первой.
 */
export function Wordmark({
  className,
  tone = "gold",
  withYear = true,
  onDark = false,
}: {
  className?: string;
  tone?: "gold" | "ink" | "cream";
  withYear?: boolean;
  /** Знак стоит на тёмной подложке — подпись под ним должна быть светлой. */
  onDark?: boolean;
}) {
  return (
    <span className={cn("inline-flex flex-col leading-none", className)}>
      <span
        className={cn(
          "font-adar-display text-2xl font-medium tracking-[0.28em]",
          tone === "gold" && "adar-gold-text",
          tone === "ink" && "text-adar-green-900",
          tone === "cream" && "text-adar-cream-50",
        )}
      >
        ADAR
      </span>
      {withYear ? (
        <span
          className={cn(
            "mt-1 text-[0.55rem] tracking-[0.4em]",
            onDark || tone === "cream" ? "text-adar-cream-50/65" : "text-adar-ink-subtle",
          )}
        >
          SINCE 2011
        </span>
      ) : null}
    </span>
  );
}
