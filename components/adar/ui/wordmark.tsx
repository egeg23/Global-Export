import { cn } from "@/lib/cn";

/**
 * Логотип ADAR — настоящий, от заказчика.
 *
 * Солнце с узором и подпись «EST ADAR 2011» лежат в `public/adar/brand/`
 * отдельными файлами: в шапке нужен горизонтальный замок, а знак без подписи
 * уходит в баннер и в значок вкладки.
 *
 * Цвет даёт не файл, а градиент под маской — в брифе просили заменить жёлтый
 * на золотой, и это делается, не трогая исходник. На тёмной подложке золото
 * читается тиснением, на светлой — фольгой.
 */
export function Wordmark({
  className,
  size = "default",
  withMark = false,
}: {
  className?: string;
  /** Высота подписи: в шапке компактнее, в подвале крупнее. */
  size?: "small" | "default";
  /** Показать солнце слева от подписи. */
  withMark?: boolean;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2 sm:gap-3", className)}>
      {withMark ? (
        <span
          aria-hidden="true"
          className={cn(
            "adar-logo-mark block shrink-0",
            size === "small" ? "w-8 max-[359px]:hidden" : "w-11",
          )}
        />
      ) : null}
      <span
        role="img"
        aria-label="ADAR, основана в 2011 году"
        className={cn("adar-logo-word block", size === "small" ? "w-32 sm:w-[9.5rem]" : "w-44")}
      />
    </span>
  );
}
