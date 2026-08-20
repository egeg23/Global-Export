import Link from "next/link";

import { Container } from "@/components/ui/container";
import { contacts } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { getCategories } from "@/lib/content/source";
import { localeHref, t, type Locale } from "@/lib/i18n";

import { CurrentYear } from "./current-year";
import { Logo } from "./logo";

export async function Footer({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const categories = await getCategories();
  const buildYear = new Date().getFullYear();

  const navLinks = [
    { href: "about", label: dict.nav.about },
    { href: "catalog", label: dict.nav.catalog },
    { href: "quality", label: dict.nav.quality },
    { href: "team", label: dict.nav.team },
    { href: "news", label: dict.nav.news },
    { href: "contacts", label: dict.nav.contacts },
  ];

  return (
    <footer className="bg-forest-950 text-sand-200">
      <Container className="py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Logo tone="light" />
            <p className="mt-6 max-w-sm text-sm leading-relaxed text-sand-300/70">
              {dict.footer.tagline}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {contacts.socials.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-10 items-center rounded-full border border-sand-200/15 px-4 text-xs font-medium tracking-wide text-sand-200/80 transition-colors duration-300 hover:border-sand-200/40 hover:text-sand-50"
                >
                  {social.name}
                </a>
              ))}
            </div>
          </div>

          <nav className="lg:col-span-2" aria-label={dict.footer.navTitle}>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
              {dict.footer.navTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={localeHref(locale, link.href)}
                    className="link-underline text-sm text-sand-200/75 transition-colors hover:text-sand-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav className="lg:col-span-3" aria-label={dict.footer.productsTitle}>
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
              {dict.footer.productsTitle}
            </h3>
            <ul className="mt-5 space-y-3">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`${localeHref(locale, "catalog")}?category=${category.slug}`}
                    className="link-underline text-sm text-sand-200/75 transition-colors hover:text-sand-50"
                  >
                    {t(category.name, locale)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-harvest-300">
              {dict.footer.contactsTitle}
            </h3>
            <address className="mt-5 space-y-3 text-sm not-italic text-sand-200/75">
              <p>{t(contacts.address, locale)}</p>
              {contacts.emails.slice(0, 2).map((email) => (
                <p key={email.value}>
                  <a
                    href={email.href}
                    className="link-underline transition-colors hover:text-sand-50"
                  >
                    {email.value}
                  </a>
                </p>
              ))}
              {contacts.phones.map((phone) => (
                <p key={phone.value}>
                  <a
                    href={phone.href}
                    className="link-underline transition-colors hover:text-sand-50"
                  >
                    {phone.value}
                  </a>
                </p>
              ))}
            </address>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-sand-200/10 pt-8 text-xs text-sand-300/75 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © <CurrentYear fallback={buildYear} /> Global Export Company LLC.{" "}
            {dict.footer.rights}
          </p>
          <p className="sm:text-right">{t(contacts.address, locale)}</p>
        </div>
      </Container>
    </footer>
  );
}
