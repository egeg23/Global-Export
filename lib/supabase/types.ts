import type { Localized } from "@/lib/i18n";

/**
 * Hand-written instead of generated: the generator emits ~400 lines of
 * conditional-type plumbing for six tables, and the shapes here are the ones
 * the app actually reads. Keep in step with `supabase/migrations`.
 */

/** Localised columns are `jsonb` and default to `{}`, so every key is optional. */
export type LocalizedJson = Partial<Localized>;

export type SpecJson = { label: LocalizedJson; value: LocalizedJson };

export type MediaRow = {
  id: string;
  path: string;
  filename: string;
  mime_type: string | null;
  size_bytes: number | null;
  width: number | null;
  height: number | null;
  alt: LocalizedJson;
  folder: string;
  created_at: string;
};

export type NewsRow = {
  id: string;
  slug: string;
  published_at: string;
  title: LocalizedJson;
  excerpt: LocalizedJson;
  body: LocalizedJson;
  tag: LocalizedJson;
  image_path: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name: LocalizedJson;
  short_name: LocalizedJson;
  description: LocalizedJson;
  image_path: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ProductRow = {
  id: string;
  slug: string;
  category_slug: string;
  name: LocalizedJson;
  latin_name: string | null;
  description: LocalizedJson;
  specs: SpecJson[];
  regions: LocalizedJson;
  packaging: LocalizedJson;
  hs_code: string | null;
  image_path: string | null;
  is_featured: boolean;
  availability: "available" | "soon";
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type CertificateRow = {
  id: string;
  slug: string;
  name: string;
  issuer: string | null;
  description: LocalizedJson;
  image_path: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type TeamMemberRow = {
  id: string;
  name: string;
  position_title: LocalizedJson;
  team_group: "board" | "directors" | "export";
  email: string | null;
  photo_path: string | null;
  position: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

/**
 * `Insert` allows every column with a database default to be omitted; `Update`
 * allows any subset. Generated ids and timestamps are never written by hand.
 */
type Writable<Row> = Partial<Omit<Row, "id" | "created_at" | "updated_at">>;

type Table<Row, Required extends keyof Row> = {
  Row: Row;
  Insert: Writable<Row> & Pick<Row, Required>;
  Update: Writable<Row>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      media: Table<MediaRow, "path" | "filename">;
      news: Table<NewsRow, "slug">;
      categories: Table<CategoryRow, "slug">;
      products: Table<ProductRow, "slug" | "category_slug">;
      certificates: Table<CertificateRow, "slug" | "name">;
      team_members: Table<TeamMemberRow, "name">;
    };
    Views: Record<never, never>;
    Functions: Record<never, never>;
    Enums: Record<never, never>;
    CompositeTypes: Record<never, never>;
  };
};

export type TableName = keyof Database["public"]["Tables"];
