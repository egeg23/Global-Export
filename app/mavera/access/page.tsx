import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Gate } from "@/components/showcase/gate";
import { accessCode, safeNext, showcaseById } from "@/lib/showcase/access";

export const metadata: Metadata = { title: "Доступ к витрине" };

const showcase = showcaseById("mavera");

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(showcase, params.next);
  if (!accessCode(showcase)) redirect(next);

  return <Gate id="mavera" next={next} error={Boolean(params.error)} />;
}
