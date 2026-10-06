import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Gate } from "@/components/showcase/gate";
import { isLocked, returnTo, showcaseById } from "@/lib/showcase/access";

export const metadata: Metadata = { title: "Доступ к витрине", robots: { index: false, follow: false } };

const showcase = showcaseById("mavera");

/**
 * Страница ввода кода MAVERA (lib/showcase/access.ts). Открыта витрина —
 * `MAVERA_ACCESS_CODE=off` на сервере — страница просто ведёт дальше.
 */
export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[]; error?: string }>;
}) {
  const params = await searchParams;
  const next = returnTo(showcase, Array.isArray(params.next) ? params.next[0] : params.next);
  if (!(await isLocked(showcase))) redirect(next);

  return <Gate id="mavera" next={next} error={Boolean(params.error)} />;
}
