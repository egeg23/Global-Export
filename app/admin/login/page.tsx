import { redirect } from "next/navigation";

import { currentAdmin } from "@/lib/admin/auth";
import { isShowcase } from "@/lib/showcase";
import { isSupabaseConfigured } from "@/lib/supabase/env";

import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await currentAdmin()) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-forest-600">
          Global Export
        </p>
        <h1 className="mt-3 text-2xl font-medium text-forest-950">Панель управления</h1>
        <p className="mt-2 text-sm text-ink-muted">
          Вход для сотрудников компании.
        </p>

        {isSupabaseConfigured ? (
          <>
            <LoginForm />

            {/* Общий доступ показывается только на демонстрационной площадке.
                На сайте компании этого блока не существует. */}
            {isShowcase ? (
              <div className="mt-8 rounded-lg border border-forest-900/12 bg-white/70 p-4">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-forest-600">
                  Демонстрационный доступ
                </p>
                <p className="mt-2 text-sm text-ink-muted">
                  Логин <code className="font-medium text-forest-900">demo</code>, пароль{" "}
                  <code className="font-medium text-forest-900">demo</code>. Можно менять
                  что угодно — это площадка для показа, содержимое восстанавливается.
                </p>
              </div>
            ) : null}
          </>
        ) : (
          <p className="mt-8 rounded-lg border border-harvest-300 bg-harvest-50 px-4 py-3 text-sm text-harvest-800">
            База данных не подключена: задайте <code>NEXT_PUBLIC_SUPABASE_URL</code> и{" "}
            <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code>. Сайт при этом работает и
            показывает содержимое из репозитория.
          </p>
        )}
      </div>
    </main>
  );
}
