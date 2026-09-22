import Image from "next/image";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { company } from "@/content/foodmaxx/company";
import { CurrentYear } from "@/components/layout/current-year";

/** Подвал: кто, где и как дозвониться. */
export function FoodmaxxFooter() {
  const buildYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/8 bg-fm-ink-950 py-14">
      <Shell size="wide" className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Image
            src="/foodmaxx/brand/logo.webp"
            alt="FOODMAXX"
            width={900}
            height={224}
            className="h-8 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-fm-cream-50/55">
            {company.legal}. Овощная и мясная консервация, готовые блюда.
            С {company.since} года.
          </p>
        </div>

        <nav aria-label="Меню в подвале">
          <h2 className="text-xs uppercase tracking-[0.18em] text-fm-cream-50/45">Разделы</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {[
              { label: "Продукция", href: "#produkciya" },
              { label: "Производство", href: "#proizvodstvo" },
              { label: "Каталог", href: "#katalog" },
              { label: "О компании", href: "#o-kompanii" },
              { label: "Контакты", href: "#kontakty" },
            ].map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="-my-1 inline-block py-1 text-fm-cream-50/70 transition-colors hover:text-fm-amber-400"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-fm-cream-50/45">Для связи</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {company.contacts.phones.map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="-my-1 inline-block py-1 tabular-nums text-fm-cream-50/70 transition-colors hover:text-fm-amber-400"
                >
                  {phone}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${company.contacts.email}`}
                className="-my-1 inline-block py-1 text-fm-cream-50/70 transition-colors hover:text-fm-amber-400"
              >
                {company.contacts.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-fm-cream-50/45">Завод</h2>
          <p className="mt-4 text-sm leading-relaxed text-fm-cream-50/70">
            {company.contacts.address}
          </p>
        </div>
      </Shell>

      <Shell size="wide" className="mt-12 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-white/8 pt-7">
        <p className="text-xs text-fm-cream-50/45">
          © <CurrentYear fallback={buildYear} /> {company.brand}
        </p>
        <p className="font-fm-display text-sm text-fm-amber-400/85">
          Качество и вкус — в каждой банке
        </p>
      </Shell>
    </footer>
  );
}
