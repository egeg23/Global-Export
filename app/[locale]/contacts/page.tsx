import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { LeadForm } from "@/components/forms/lead-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { contacts } from "@/content/company";
import { getDictionary } from "@/content/dictionaries";
import { getTeam } from "@/lib/content/source";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return pageMetadata({
    locale,
    path: "contacts",
    title: dict.meta.contactsTitle,
    description: dict.meta.contactsDescription,
  });
}

export default async function ContactsPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);
  const exportTeam = (await getTeam()).filter((member) => member.group === "export");

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.contacts.eyebrow}
        title={dict.contacts.title}
        text={dict.contacts.intro}
        breadcrumbLabel={dict.common.breadcrumb}
        breadcrumbs={[{ href: "", label: dict.nav.home }, { label: dict.nav.contacts }]}
      />

      <section className="bg-sand-50 py-24 lg:py-32">
        <Container>
          <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal>
                <h2 className="font-display text-2xl text-forest-950">
                  {dict.contacts.officeTitle}
                </h2>

                <ul className="mt-8 space-y-7">
                  <li className="flex items-start gap-4">
                    <span className="mt-0.5 text-forest-600">
                      <Icon name="pin" className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                        {dict.contacts.officeTitle}
                      </p>
                      <p className="mt-1 text-[0.95rem] text-forest-900">
                        {t(contacts.address, locale)}
                      </p>
                    </div>
                  </li>

                  {contacts.emails.slice(0, 1).map((email) => (
                    <li key={email.value} className="flex items-start gap-4">
                      <span className="mt-0.5 text-forest-600">
                        <Icon name="mail" className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                          {t(email.label, locale)}
                        </p>
                        <a
                          href={email.href}
                          className="link-underline mt-1 inline-block text-[0.95rem] text-forest-900"
                        >
                          {email.value}
                        </a>
                      </div>
                    </li>
                  ))}

                  {contacts.phones.map((phone) => (
                    <li key={phone.value} className="flex items-start gap-4">
                      <span className="mt-0.5 text-forest-600">
                        <Icon name="phone" className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                          {t(phone.label, locale)}
                        </p>
                        <a
                          href={phone.href}
                          className="link-underline mt-1 inline-block text-[0.95rem] text-forest-900"
                        >
                          {phone.value}
                        </a>
                      </div>
                    </li>
                  ))}

                  {t(contacts.workingHours, locale) ? (
                    <li className="flex items-start gap-4">
                      <span className="mt-0.5 text-forest-600">
                        <Icon name="clock" className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                          {dict.contacts.hoursTitle}
                        </p>
                        <p className="mt-1 text-[0.95rem] text-forest-900">
                          {t(contacts.workingHours, locale)}
                        </p>
                      </div>
                    </li>
                  ) : null}
                </ul>

                {contacts.socials.length > 0 ? (
                  <div className="mt-10">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-forest-500">
                      {dict.contacts.socialsTitle}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      {contacts.socials.map((social) => (
                        <a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex h-10 items-center rounded-full border border-forest-900/15 px-4 text-xs font-medium text-forest-800 transition-colors duration-300 hover:border-forest-800/50 hover:bg-forest-800/5"
                        >
                          {social.name}
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null}
              </Reveal>
            </div>

            <Reveal delay={100} className="lg:col-span-7">
              <div className="rounded-card border border-forest-900/8 bg-white/70 p-7 shadow-[var(--shadow-soft)] sm:p-9">
                <h2 className="font-display text-2xl text-forest-950">{dict.form.title}</h2>
                <LeadForm locale={locale} dict={dict} className="mt-7" />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Export managers */}
      {exportTeam.length > 0 ? (
        <section className="bg-sand-100 py-20 lg:py-28">
          <Container>
            <SectionHeading
              eyebrow={dict.contacts.departmentsTitle}
              title={dict.team.exportDept}
            />

            <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {exportTeam.map((member, index) => (
                <Reveal as="li" key={member.name} delay={(index % 4) * 70}>
                  <div className="h-full rounded-card border border-forest-900/8 bg-white/70 p-6 shadow-[var(--shadow-soft)]">
                    <h3 className="font-display text-lg text-forest-950">{member.name}</h3>
                    <p className="mt-1 text-sm text-ink-muted">{t(member.position, locale)}</p>
                    {member.email ? (
                      <a
                        href={`mailto:${member.email}`}
                        className="link-underline mt-4 inline-block text-sm text-forest-700"
                      >
                        {member.email}
                      </a>
                    ) : null}
                  </div>
                </Reveal>
              ))}
            </ul>
          </Container>
        </section>
      ) : null}

      {/* Map */}
      <section aria-label={dict.contacts.mapTitle} className="relative h-[45vh] min-h-72 bg-forest-950">
        <iframe
          src={contacts.mapEmbed}
          title={dict.contacts.mapTitle}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-full w-full border-0 grayscale-[0.35]"
        />
      </section>
    </>
  );
}
