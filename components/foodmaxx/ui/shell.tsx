import { cn } from "@/lib/cn";

/** Общая колонка страницы: одна ширина на все секции. */
export function Shell({
  children,
  className,
  size = "default",
}: {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "wide";
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full px-5 sm:px-8 lg:px-10",
        size === "wide" ? "max-w-[1600px]" : "max-w-[1200px]",
        className,
      )}
    >
      {children}
    </div>
  );
}
