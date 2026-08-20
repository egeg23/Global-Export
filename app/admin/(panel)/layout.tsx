import Link from "next/link";

import { SubmitButton } from "@/components/admin/submit-button";
import { requireAdmin } from "@/lib/admin/auth";

import { signOut } from "../actions";

const sections = [
  { href: "/admin", label: "Обзор", exact: true },
  { href: "/admin/news", label: "Новости" },
  { href: "/admin/products", label: "Продукция" },
  { href: "/admin/categories", label: "Категории" },
  { href: "/admin/certificates", label: "Сертификаты" },
  { href: "/admin/team", label: "Команда" },
  { href: "/admin/media", label: "Медиа" },
];

/**
 * Everything under this layout is behind the guard. The login page sits outside
 * it, in `app/admin/login`, which is why the panel is a route group rather than
 * a folder.
 */
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireAdmin();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[90rem] flex-col lg:flex-row">
      <header className="border-b border-forest-900/10 bg-white lg:w-60 lg:shrink-0 lg:border-b-0 lg:border-r">
        <div className="flex items-center justify-between gap-4 px-5 py-4 lg:block lg:px-6 lg:py-6">
          <Link href="/admin" className="block">
            <span className="text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-forest-600">
              Global Export
            </span>
            <span className="mt-0.5 block text-sm font-medium text-forest-950">
              Панель управления
            </span>
          </Link>

          <Link
            href="/"
            target="_blank"
            className="text-xs text-forest-700 underline-offset-4 hover:underline lg:mt-4 lg:block"
          >
            Открыть сайт ↗
          </Link>
        </div>

        <nav aria-label="Разделы" className="px-3 pb-4 lg:px-4">
          <ul className="flex gap-1 overflow-x-auto lg:block lg:space-y-0.5 lg:overflow-visible">
            {sections.map((section) => (
              <li key={section.href}>
                <Link
                  href={section.href}
                  className="block whitespace-nowrap rounded-lg px-3 py-2 text-sm text-forest-900/80 transition-colors hover:bg-forest-800/6 hover:text-forest-950"
                >
                  {section.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hidden border-t border-forest-900/10 px-6 py-5 lg:block">
          <p className="truncate text-xs text-ink-subtle" title={user.email ?? ""}>
            {user.email}
          </p>
          <form action={signOut} className="mt-3">
            <SubmitButton variant="ghost" className="h-9 w-full px-3 text-xs">
              Выйти
            </SubmitButton>
          </form>
        </div>
      </header>

      <main className="flex-1 px-5 py-8 lg:px-10 lg:py-12">{children}</main>
    </div>
  );
}
