"use client";

import { useActionState } from "react";

import { SubmitButton } from "@/components/admin/submit-button";

import { signIn, type AuthState } from "../actions";

export function LoginForm() {
  const [state, formAction] = useActionState<AuthState, FormData>(signIn, {});

  return (
    <form action={formAction} className="mt-8 space-y-4">
      <label className="block">
        <span className="text-sm font-medium text-forest-900">Почта</span>
        <input
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1.5 h-11 w-full rounded-lg border border-forest-900/20 bg-white px-3.5 text-sm text-forest-950 transition-colors focus:border-forest-700"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-forest-900">Пароль</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="mt-1.5 h-11 w-full rounded-lg border border-forest-900/20 bg-white px-3.5 text-sm text-forest-950 transition-colors focus:border-forest-700"
        />
      </label>

      {state.error ? (
        <p role="alert" className="rounded-lg bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
          {state.error}
        </p>
      ) : null}

      <SubmitButton className="w-full" pendingLabel="Входим…">
        Войти
      </SubmitButton>
    </form>
  );
}
