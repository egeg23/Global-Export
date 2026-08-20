"use client";

import { useState } from "react";

import { cn } from "@/lib/cn";
import type { Dictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";

type Option = { value: string; label: string };

type LeadFormProps = {
  locale: Locale;
  dict: Dictionary;
  products?: Option[];
  /** Pre-selects a product when the form is embedded on a product page. */
  defaultProduct?: string;
  tone?: "light" | "dark";
  className?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

export function LeadForm({
  locale,
  dict,
  products = [],
  defaultProduct,
  tone = "light",
  className,
}: LeadFormProps) {
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const dark = tone === "dark";

  const fieldClass = cn(
    "h-12 w-full rounded-xl border px-4 text-[0.95rem] transition-colors duration-300 outline-none",
    dark
      ? "border-sand-50/15 bg-sand-50/5 text-sand-50 placeholder:text-sand-300/40 focus:border-harvest-300/70"
      : "border-forest-900/12 bg-white text-forest-950 placeholder:text-ink-subtle focus:border-forest-600",
  );

  const labelClass = cn(
    "mb-2 block text-[0.7rem] font-semibold uppercase tracking-[0.14em]",
    dark ? "text-sand-300/60" : "text-forest-600",
  );

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries()) as Record<string, string>;

    const nextErrors: Record<string, string> = {};
    if (!data.name?.trim()) nextErrors.name = dict.form.required;
    if (!data.email?.trim()) nextErrors.email = dict.form.required;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email)) {
      nextErrors.email = dict.form.invalidEmail;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("submitting");
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          locale,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });

      if (!response.ok) throw new Error(`Request failed: ${response.status}`);

      setStatus("success");
      form.reset();
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex min-h-64 flex-col items-start justify-center rounded-card border p-8",
          dark ? "border-harvest-300/30 bg-sand-50/5" : "border-forest-600/25 bg-forest-50",
          className,
        )}
      >
        <span
          className={cn(
            "inline-flex h-12 w-12 items-center justify-center rounded-full",
            dark ? "bg-harvest-400/20 text-harvest-300" : "bg-forest-600/12 text-forest-700",
          )}
        >
          <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-6 w-6">
            <path
              d="m5 12.5 4.5 4.5L19 7.5"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p
          className={cn(
            "mt-5 font-display text-xl",
            dark ? "text-sand-50" : "text-forest-950",
          )}
        >
          {dict.form.success}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className={cn("space-y-5", className)}>
      {/* Honeypot */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelClass}>
            {dict.form.name} *
          </label>
          <input
            id="lead-name"
            name="name"
            autoComplete="name"
            className={cn(fieldClass, errors.name && "border-red-500/70")}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name ? <p className="mt-1.5 text-xs text-red-500">{errors.name}</p> : null}
        </div>

        <div>
          <label htmlFor="lead-company" className={labelClass}>
            {dict.form.company}
          </label>
          <input
            id="lead-company"
            name="company"
            autoComplete="organization"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="lead-email" className={labelClass}>
            {dict.form.email} *
          </label>
          <input
            id="lead-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            className={cn(fieldClass, errors.email && "border-red-500/70")}
            aria-invalid={Boolean(errors.email)}
          />
          {errors.email ? <p className="mt-1.5 text-xs text-red-500">{errors.email}</p> : null}
        </div>

        <div>
          <label htmlFor="lead-phone" className={labelClass}>
            {dict.form.phone}
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="lead-country" className={labelClass}>
            {dict.form.country}
          </label>
          <input
            id="lead-country"
            name="country"
            autoComplete="country-name"
            className={fieldClass}
          />
        </div>

        <div>
          <label htmlFor="lead-volume" className={labelClass}>
            {dict.form.volume}
          </label>
          <input id="lead-volume" name="volume" className={fieldClass} />
        </div>
      </div>

      {products.length > 0 ? (
        <div>
          <label htmlFor="lead-product" className={labelClass}>
            {dict.form.product}
          </label>
          <select
            id="lead-product"
            name="product"
            defaultValue={defaultProduct ?? ""}
            className={cn(fieldClass, "appearance-none pr-10")}
          >
            <option value="">{dict.form.productPlaceholder}</option>
            {products.map((option) => (
              <option key={option.value} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      <div>
        <label htmlFor="lead-message" className={labelClass}>
          {dict.form.message}
        </label>
        <textarea
          id="lead-message"
          name="message"
          rows={4}
          placeholder={dict.form.messagePlaceholder}
          className={cn(fieldClass, "h-auto resize-y py-3 leading-relaxed")}
        />
      </div>

      {status === "error" ? (
        <p className="rounded-xl border border-red-500/30 bg-red-500/8 px-4 py-3 text-sm text-red-600">
          {dict.form.error}
        </p>
      ) : null}

      <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "submitting"}
          className={cn(
            "inline-flex h-12 items-center justify-center rounded-full px-8 text-[0.95rem] font-medium transition-all duration-300 disabled:opacity-60",
            dark
              ? "bg-sand-50 text-forest-900 hover:bg-white"
              : "bg-forest-800 text-sand-50 hover:bg-forest-700",
          )}
        >
          {status === "submitting" ? dict.form.submitting : dict.form.submit}
        </button>

        <p className={cn("max-w-xs text-xs", dark ? "text-sand-300/50" : "text-ink-subtle")}>
          {dict.form.consent}
        </p>
      </div>
    </form>
  );
}
