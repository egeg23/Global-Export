// Moves the bundled TypeScript content into Supabase.
//
// Deliberately goes through supabase-js as a signed-in admin rather than
// through psql: the same path the panel uses, so a broken RLS policy fails
// here instead of silently in production.
//
//   SUPABASE_URL=... SUPABASE_KEY=... SEED_EMAIL=... SEED_PASSWORD=... \
//     node scripts/seed.mjs
import { createClient } from "@supabase/supabase-js";
import { evaluate } from "./extract-content.mjs";

const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.SEED_EMAIL;
const password = process.env.SEED_PASSWORD;

if (!url || !key || !email || !password) {
  console.error("Need SUPABASE_URL, SUPABASE_KEY, SEED_EMAIL, SEED_PASSWORD.");
  process.exit(1);
}

const supabase = createClient(url, key, { auth: { persistSession: false } });

const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
if (signInError) {
  console.error("Sign-in failed:", signInError.message);
  process.exit(1);
}

const [{ categories }, { certificates }, { team }, { products }, { news }] = await Promise.all([
  evaluate("content/categories.ts"),
  evaluate("content/certificates.ts"),
  evaluate("content/team.ts"),
  evaluate("content/products.ts"),
  evaluate("content/news.ts"),
]);

/** jsonb columns are NOT NULL with a `{}` default — never send null. */
const loc = (value) => value ?? {};

const tables = [
  {
    name: "categories",
    conflict: "slug",
    rows: categories.map((c, i) => ({
      slug: c.slug,
      name: loc(c.name),
      short_name: loc(c.shortName),
      description: loc(c.description),
      image_path: c.image ?? null,
      position: i,
    })),
  },
  {
    name: "certificates",
    conflict: "slug",
    rows: certificates.map((c, i) => ({
      slug: c.slug,
      name: c.name,
      issuer: c.issuer ?? null,
      description: loc(c.description),
      image_path: c.image ?? null,
      position: i,
    })),
  },
  {
    name: "products",
    conflict: "slug",
    rows: products.map((p, i) => ({
      slug: p.slug,
      category_slug: p.category,
      name: loc(p.name),
      latin_name: p.latinName ?? null,
      description: loc(p.description),
      specs: p.specs ?? [],
      regions: loc(p.regions),
      packaging: loc(p.packaging),
      hs_code: p.hsCode ?? null,
      image_path: p.image ?? null,
      is_featured: Boolean(p.featured),
      availability: p.availability ?? "available",
      position: i,
    })),
  },
  {
    name: "news",
    conflict: "slug",
    rows: news.map((n) => ({
      slug: n.slug,
      published_at: n.date,
      title: loc(n.title),
      excerpt: loc(n.excerpt),
      body: loc(n.body),
      tag: loc(n.tag),
      image_path: n.image ?? null,
      is_published: true,
    })),
  },
];

for (const table of tables) {
  const { error, count } = await supabase
    .from(table.name)
    .upsert(table.rows, { onConflict: table.conflict, count: "exact" })
    .select("id");

  if (error) {
    console.error(`${table.name}: ${error.message}`);
    process.exit(1);
  }
  console.log(`${table.name}: ${count ?? table.rows.length} rows`);
}

// team_members has no natural key — the same person can share a name with
// nobody else here, but there is no unique constraint to upsert against, so
// the table is replaced wholesale.
const { count: existingTeam } = await supabase
  .from("team_members")
  .select("id", { count: "exact", head: true });

if (!existingTeam) {
  const { error } = await supabase.from("team_members").insert(
    team.map((m, i) => ({
      name: m.name,
      position_title: loc(m.position),
      team_group: m.group,
      email: m.email ?? null,
      photo_path: m.photo ?? null,
      position: i,
    })),
  );
  if (error) {
    console.error(`team_members: ${error.message}`);
    process.exit(1);
  }
  console.log(`team_members: ${team.length} rows`);
} else {
  console.log(`team_members: ${existingTeam} rows already present, skipped`);
}
