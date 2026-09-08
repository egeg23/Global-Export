import Link from "next/link";

import { cn } from "@/lib/cn";

type Props = {
  active: "globalex" | "adar";
  /** Тёмная витрина Global Export и кремовая ADAR требуют разных контрастов. */
  tone?: "dark" | "light";
  className?: string;
};

const projects = [
  { id: "globalex", label: "Global Export", href: "/present", note: "сельхозэкспорт" },
  { id: "adar", label: "ADAR", href: "/adar", note: "подарочные наборы" },
] as const;

/**
 * Переключатель между двумя проектами в работе.
 *
 * Стоит первым элементом на витрине каждого из них: заказчик открывает одну
 * ссылку и видит, что второй проект тоже здесь, не спрашивая адрес.
 */
export function ProjectSwitcher({ active, tone = "dark", className }: Props) {
  const dark = tone === "dark";

  return (
    <nav
      aria-label="Проекты"
      className={cn(
        "inline-flex items-center gap-1 rounded-full border p-1",
        dark ? "border-white/12 bg-white/5" : "border-adar-green-900/12 bg-white/70",
        className,
      )}
    >
      {projects.map((project) => {
        const current = project.id === active;
        return (
          <Link
            key={project.id}
            href={project.href}
            prefetch={false}
            aria-current={current ? "page" : undefined}
            className={cn(
              "group rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
              current
                ? dark
                  ? "bg-white text-forest-950"
                  : "bg-adar-green-900 text-adar-cream-50"
                : dark
                  ? "text-white/60 hover:text-white"
                  : "text-adar-ink-muted hover:text-adar-ink",
            )}
          >
            {project.label}
            <span
              className={cn(
                "ml-2 hidden text-[0.7rem] font-normal sm:inline",
                current ? "opacity-55" : "opacity-45",
              )}
            >
              {project.note}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
