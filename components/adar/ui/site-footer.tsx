import { Shell } from "@/components/adar/ui/shell";
import { Wordmark } from "@/components/adar/ui/wordmark";
import { company } from "@/content/adar/company";
import { CurrentYear } from "@/components/layout/current-year";

const menu = [
  { label: "Главная", href: "#" },
  { label: "Каталог", href: "#katalog" },
  { label: "Тематики", href: "#tematiki" },
  { label: "О компании", href: "#o-kompanii" },
  { label: "Контакты", href: "#kontakty" },
];

/** Подвал: меню, контакты, год. Один на все три концепции. */
export function SiteFooter() {
  // Год сборки — только запасное значение: точный год подставит браузер.
  const buildYear = new Date().getFullYear();

  return (
    <footer className="bg-adar-green-950 py-16 text-adar-cream-50">
      <Shell size="wide" className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Wordmark tone="cream" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-adar-cream-50/50">
            Подарочные наборы для мероприятий и праздников. Ташкент, с{" "}
            {company.since} года.
          </p>
        </div>

        <nav aria-label="Меню в подвале">
          <h2 className="text-xs uppercase tracking-[0.18em] text-adar-cream-50/40">Меню</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {menu.map((item) => (
              <li key={item.label}>
                <a
                  href={item.href}
                  className="text-adar-cream-50/75 transition-colors hover:text-adar-gold-400"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-adar-cream-50/40">Для связи</h2>
          <ul className="mt-4 grid gap-2.5 text-sm">
            {company.contacts.phones.slice(0, 2).map((phone) => (
              <li key={phone}>
                <a
                  href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-adar-cream-50/75 transition-colors hover:text-adar-gold-400"
                >
                  {phone}
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${company.contacts.email}`}
                className="text-adar-cream-50/75 transition-colors hover:text-adar-gold-400"
              >
                {company.contacts.email}
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xs uppercase tracking-[0.18em] text-adar-cream-50/40">Адрес</h2>
          <p className="mt-4 text-sm leading-relaxed text-adar-cream-50/75">
            {company.contacts.address}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-adar-cream-50/50">
            {company.contacts.hours}
          </p>
        </div>
      </Shell>

      <Shell size="wide" className="mt-14 border-t border-white/10 pt-8">
        <p className="text-xs text-adar-cream-50/35">
          © <CurrentYear fallback={buildYear} /> ADAR
        </p>
      </Shell>
    </footer>
  );
}
