import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { CtaForm } from "@/components/sections/cta-form";
import { PageHero } from "@/components/sections/page-hero";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/content/dictionaries";
import { team } from "@/content/team";
import type { TeamGroup, TeamMember } from "@/lib/content/types";
import { isLocale, t, type Locale } from "@/lib/i18n";
import { pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return pageMetadata({
    locale,
    path: "team",
    title: dict.meta.teamTitle,
    description: dict.meta.teamDescription,
  });
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function MemberCard({ member, locale }: { member: TeamMember; locale: Locale }) {
  return (
    <div className="flex h-full flex-col rounded-card border border-forest-900/8 bg-white/70 p-7 shadow-[var(--shadow-soft)]">
      <span
        aria-hidden="true"
        className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-forest-800/8 font-display text-lg text-forest-700"
      >
        {initials(member.name)}
      </span>
      <h3 className="mt-5 font-display text-lg text-forest-950">{member.name}</h3>
      <p className="mt-1 text-sm text-ink-muted">{t(member.position, locale)}</p>
      {member.email ? (
        <a
          href={`mailto:${member.email}`}
          className="link-underline mt-4 inline-block self-start text-sm text-forest-700"
        >
          {member.email}
        </a>
      ) : null}
    </div>
  );
}

export default async function TeamPage({ params }: Props) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();

  const locale = raw as Locale;
  const dict = getDictionary(locale);

  const groups: { key: TeamGroup; title: string }[] = [
    { key: "board", title: dict.team.board },
    { key: "directors", title: dict.team.directors },
    { key: "export", title: dict.team.exportDept },
  ];

  return (
    <>
      <PageHero
        locale={locale}
        eyebrow={dict.team.eyebrow}
        title={dict.team.title}
        text={
          locale === "ru"
            ? "Правление, директора департаментов и отдел экспорта — люди, с которыми вы будете работать напрямую."
            : locale === "uz"
              ? "Boshqaruv, departament direktorlari va eksport bo‘limi — siz bevosita ishlaydigan odamlar."
              : "The management board, department directors and the export team — the people you will deal with directly."
        }
        breadcrumbLabel={dict.common.breadcrumb}
        breadcrumbs={[{ href: "", label: dict.nav.home }, { label: dict.nav.team }]}
      />

      {groups.map((group, groupIndex) => {
        const members = team.filter((member) => member.group === group.key);
        if (members.length === 0) return null;

        return (
          <section
            key={group.key}
            className={groupIndex % 2 === 0 ? "bg-sand-50 py-20 lg:py-28" : "bg-sand-100 py-20 lg:py-28"}
          >
            <Container>
              <SectionHeading eyebrow={dict.team.eyebrow} title={group.title} />

              <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {members.map((member, index) => (
                  <Reveal as="li" key={member.name} delay={(index % 3) * 80}>
                    <MemberCard member={member} locale={locale} />
                  </Reveal>
                ))}
              </ul>
            </Container>
          </section>
        );
      })}

      <CtaForm locale={locale} dict={dict} />
    </>
  );
}
