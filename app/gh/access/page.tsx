import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { Gate } from "@/components/showcase/gate";
import { accessCode, safeNext, showcaseById } from "@/lib/showcase/access";

export const metadata: Metadata = { title: "Доступ к макету" };

const showcase = showcaseById("gh");

export default async function AccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const params = await searchParams;
  const next = safeNext(showcase, params.next);
  if (!accessCode(showcase)) redirect(next);

  return <Gate id="gh" next={next} error={Boolean(params.error)} />;
}
