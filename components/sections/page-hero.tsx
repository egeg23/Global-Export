import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/ui/container";
import { Eyebrow } from "@/components/ui/section-heading";
import { cn } from "@/lib/cn";
import { localeHref, type Locale } from "@/lib/i18n";

type Crumb = { href?: string; label: string };

type PageHeroProps = {
  locale: Locale;
  eyebrow?: string;
  title: string;
  text?: string;
  image?: string;
  breadcrumbs?: Crumb[];
  /** Localised label for the breadcrumb landmark. */
  breadcrumbLabel?: string;
  className?: string;
};

/**
 * Dark band at the top of every inner page. The fixed header sits transparent
 * over it, so each page opens the same way the home page does.
 */
export function PageHero({
  locale,
  eyebrow,
  title,
  text,
  image,
  breadcrumbs,
  breadcrumbLabel = "Breadcrumb",
  className,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "relative isolate flex min-h-[46vh] items-end overflow-hidden bg-forest-950 pb-14 pt-36 lg:min-h-[52vh] lg:pb-20 lg:pt-44",
        className,
      )}
    >
      {image ? (
        <>
          <Image src={image} alt="" fill priority sizes="100vw" className="-z-20 object-cover" />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-gradient-to-t from-forest-950 via-forest-950/80 to-forest-950/50"
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 opacity-[0.08]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(250,246,238,0.9) 1px, transparent 0)",
            backgroundSize: "28px 28px",
          }}
        />
      )}

      <Container className="relative">
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <nav aria-label={breadcrumbLabel} className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-sand-300/75">
              {breadcrumbs.map((crumb, index) => (
                <li key={`${crumb.label}-${index}`} className="flex items-center gap-2">
                  {index > 0 ? <span aria-hidden="true">/</span> : null}
                  {crumb.href ? (
                    <Link
                      href={localeHref(locale, crumb.href)}
                      className="link-underline transition-colors hover:text-sand-100"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span className="text-sand-200/80">{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        {eyebrow ? <Eyebrow tone="light">{eyebrow}</Eyebrow> : null}

        <h1 className="mt-5 max-w-4xl text-3xl leading-[1.1] text-sand-50 sm:text-5xl lg:text-[3.5rem]">
          {title}
        </h1>

        {text ? (
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-sand-200/80 sm:text-lg">
            {text}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
