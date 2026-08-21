"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { loginDomain } from "@/lib/showcase";

export type AuthState = { error?: string };

export async function signIn(_state: AuthState, formData: FormData): Promise<AuthState> {
  if (!isSupabaseConfigured) {
    return { error: "База данных не подключена. Заполните переменные окружения Supabase." };
  }

  const login = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!login || !password) {
    return { error: "Введите логин и пароль." };
  }

  // Supabase опознаёт пользователя по почте, но заставлять владельца сайта
  // помнить домен незачем: короткое имя дополняется автоматически.
  const email = login.includes("@")
    ? login.toLowerCase()
    : `${login.toLowerCase()}@${loginDomain}`;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    // Deliberately not "no such user" vs "wrong password": that difference
    // tells an attacker which addresses are registered.
    return { error: "Неверная почта или пароль." };
  }

  redirect("/admin");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
