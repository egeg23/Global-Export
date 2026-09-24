import Link from "next/link";

import { company } from "@/content/akbar/company";
import { categories } from "@/lib/akbar/catalog";

export function AkbarFooter() {
  return (
    <footer className="bg-ak-ink px-4 pb-10 pt-16 text-ak-ivory sm:px-8 lg:px-[4vw]">
      <div className="mx-auto max-w-[100rem]">
        <div className="grid gap-12 border-b border-ak-ivory/10 pb-12 md:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <p className="font-ak-display text-4xl font-semibold tracking-[0.2em]">AKBAR RICH</p>
            <p className="mt-2 text-[0.65rem] tracking-[0.42em] text-ak-gold-300">KO‘NGIL TINCH · С {company.since}</p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-ak-ivory/60">
              Фабрика межкомнатных дверей, стеновых панелей и погонажа. {company.office.address}.
            </p>
          </div>
          <nav aria-label="Каталог">
            <p className="ak-eyebrow text-ak-gold-300">Каталог</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link href={`/akbar/katalog/${category.subcategories[0].slug}`} className="text-ak-ivory/75 hover:text-ak-gold-300">
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="ak-eyebrow text-ak-gold-300">Компания</p>
            <ul className="mt-4 grid gap-2.5 text-sm text-ak-ivory/75">
              <li><Link href="/akbar#fabrika" className="hover:text-ak-gold-300">О фабрике</Link></li>
              <li><Link href="/akbar#konstruktor" className="hover:text-ak-gold-300">Конструктор двери</Link></li>
              <li><Link href="/akbar#servis" className="hover:text-ak-gold-300">Сервис</Link></li>
              <li><Link href="/akbar#partneram" className="hover:text-ak-gold-300">Дилерам и корпоративным клиентам</Link></li>
              <li><Link href="/akbar#shourum" className="hover:text-ak-gold-300">Шоурум</Link></li>
            </ul>
          </div>
          <div>
            <p className="ak-eyebrow text-ak-gold-300">Связь</p>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {company.phones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href} className="font-semibold tabular-nums hover:text-ak-gold-300">{phone.label}</a>
                </li>
              ))}
              <li>
                <a href={`mailto:${company.email}`} className="text-ak-ivory/75 hover:text-ak-gold-300">{company.email}</a>
              </li>
            </ul>
            <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[0.7rem] font-semibold uppercase tracking-[0.14em]">
              {company.socials.map((social) => (
                <li key={social.label}>
                  <a href={social.href} target="_blank" rel="noopener" className="hover:text-ak-gold-300">{social.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-8 text-xs text-ak-ivory/45">
          © {company.since}–2026 Akbar Rich. {company.slogan}
        </p>
      </div>
    </footer>
  );
}
