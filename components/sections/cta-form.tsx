import { LeadForm } from "@/components/forms/lead-form";
import { Container } from "@/components/ui/container";
import { Icon } from "@/components/ui/icon";
import { Reveal } from "@/components/ui/reveal";
import { Eyebrow } from "@/components/ui/section-heading";
import { contacts } from "@/content/company";
import type { Dictionary } from "@/content/dictionaries";
import { t, type Locale } from "@/lib/i18n";

export function CtaForm({
  locale,
  dict,
  products = [],
  defaultProduct,
}: {
  locale: Locale;
  dict: Dictionary;
  products?: { value: string; label: string }[];
  defaultProduct?: string;
}) {
  return (
    <section id="enquiry" className="relative overflow-hidden bg-forest-900 py-24 lg:py-32">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(90% 60% at 85% 0%, rgba(224,170,61,0.22), transparent 65%)",
        }}
      />

      <Container className="relative">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <Reveal>
              <Eyebrow tone="light">{dict.contacts.eyebrow}</Eyebrow>
              <h2 className="mt-5 text-3xl leading-[1.15] text-sand-50 sm:text-4xl">
                {dict.home.ctaTitle}
              </h2>
              <p className="mt-6 text-base leading-relaxed text-sand-200/75">
                {dict.home.ctaText}
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-10 space-y-5">
              <div className="flex items-start gap-4">
                <span className="mt-0.5 text-harvest-300">
                  <Icon name="pin" className="h-5 w-5" />
                </span>
                <p className="text-sm text-sand-200/80">{t(contacts.address, locale)}</p>
              </div>

              {contacts.emails.slice(0, 2).map((email) => (
                <div key={email.value} className="flex items-start gap-4">
                  <span className="mt-0.5 text-harvest-300">
                    <Icon name="mail" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-[0.7rem] uppercase tracking-[0.14em] text-sand-300/75">
                      {t(email.label, locale)}
                    </p>
                    <a
                      href={email.href}
                      className="link-underline text-sm text-sand-100 transition-colors hover:text-sand-50"
                    >
                      {email.value}
                    </a>
                  </div>
                </div>
              ))}

              {t(contacts.workingHours, locale) ? (
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 text-harvest-300">
                    <Icon name="clock" className="h-5 w-5" />
                  </span>
                  <p className="text-sm text-sand-200/80">{t(contacts.workingHours, locale)}</p>
                </div>
              ) : null}
            </Reveal>
          </div>

          <Reveal delay={100} className="lg:col-span-7">
            <div className="rounded-card border border-sand-50/10 bg-forest-950/45 p-7 backdrop-blur-sm sm:p-9">
              <h3 className="font-display text-xl text-sand-50">{dict.form.title}</h3>
              <LeadForm
                locale={locale}
                dict={dict}
                tone="dark"
                products={products}
                defaultProduct={defaultProduct}
                className="mt-7"
              />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
