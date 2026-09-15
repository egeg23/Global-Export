import Link from "next/link";

import { Container } from "@/components/ui/container";
import { cn } from "@/lib/cn";

/**
 * Переключатель клиентов на витрине.
 *
 * Стенд один, работ на нём две, и они не смешиваются: у каждой свой адрес,
 * своя страница и свой разговор с заказчиком. Поэтому это не состояние
 * компонента, а две ссылки — раздел можно отправить одной строкой, и открыв её,
 * человек сразу попадает в нужную работу, а не в общий список.
 */

type StandId = "globalex" | "mavera";

const stands: { id: StandId; href: string; label: string; note: string }[] = [
  { id: "globalex", href: "/present", label: "Global Export", note: "действующий клиент" },
  { id: "mavera", href: "/present/mavera", label: "MAVERA", note: "новый клиент" },
];

export function StandSwitch({ active }: { active: StandId }) {
  return (
    <div className="border-b border-sand-50/10 bg-forest-950">
      <Container className="flex flex-wrap items-center gap-x-6 gap-y-3 py-4">
        <div
          role="group"
          aria-label="Раздел витрины"
          className="flex rounded-full border border-sand-50/12 p-1"
        >
          {stands.map((stand) => (
            <Link
              key={stand.id}
              href={stand.href}
              prefetch={false}
              aria-current={active === stand.id ? "page" : undefined}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300",
                active === stand.id
                  ? "bg-harvest-300 text-forest-950"
                  : "text-sand-200/70 hover:text-sand-50",
              )}
            >
              {stand.label}
            </Link>
          ))}
        </div>

        <p className="text-xs text-sand-300/50">
          {stands.find((stand) => stand.id === active)?.note}
        </p>
      </Container>
    </div>
  );
}
