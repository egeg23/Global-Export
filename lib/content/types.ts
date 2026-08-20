import type { Localized } from "@/lib/i18n";

/**
 * Content model for the site.
 *
 * Every entity below maps 1:1 to a collection in a headless CMS — the shapes
 * were chosen so that swapping these TypeScript modules for Payload/Sanity
 * collections is a data-source change, not a rewrite of the UI.
 */

export type Company = {
  name: Localized;
  legalName: string;
  tagline: Localized;
  description: Localized;
  mission: Localized;
  founded: string;
};

export type Stat = {
  value: string;
  suffix?: string;
  label: Localized;
};

export type Category = {
  slug: string;
  name: Localized;
  shortName: Localized;
  description: Localized;
  image: string;
};

export type Spec = {
  label: Localized;
  value: Localized;
};

export type Product = {
  slug: string;
  category: string;
  name: Localized;
  latinName?: string;
  description: Localized;
  specs: Spec[];
  image: string;
  /** Marks the products surfaced on the home page. */
  featured?: boolean;
  /** Origin regions inside Uzbekistan — used on the product page. */
  regions?: Localized;
  packaging?: Localized;
  hsCode?: string;
};

export type Certificate = {
  slug: string;
  name: string;
  issuer?: string;
  description: Localized;
  image?: string;
};

export type TeamMember = {
  name: string;
  position: Localized;
  group: "board" | "directors";
  photo?: string;
  email?: string;
};

export type NewsItem = {
  slug: string;
  date: string;
  title: Localized;
  excerpt: Localized;
  /** Body is authored as markdown-ish plain paragraphs separated by blank lines. */
  body: Localized;
  image: string;
  tag?: Localized;
};

export type Facility = {
  name: Localized;
  location: Localized;
  description: Localized;
  capacity?: string;
  image: string;
};

export type ContactChannel = {
  label: Localized;
  value: string;
  href: string;
};

export type Contacts = {
  address: Localized;
  phones: ContactChannel[];
  emails: ContactChannel[];
  socials: { name: string; url: string }[];
  mapEmbed: string;
  mapLink: string;
  workingHours: Localized;
};

export type Advantage = {
  title: Localized;
  description: Localized;
  icon: string;
};

export type ProcessStep = {
  step: string;
  title: Localized;
  description: Localized;
};
