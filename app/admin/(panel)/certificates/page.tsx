import { EntryList } from "@/components/admin/entry-list";
import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { CertificateRow } from "@/lib/supabase/types";

import { toggleCertificate } from "./actions";

export default async function CertificatesListPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("certificates")
    .select("*")
    .order("position", { ascending: true });

  const rows = ((data as CertificateRow[] | null) ?? []).map((row) => ({
    id: row.id,
    title: row.name,
    subtitle: row.issuer ?? undefined,
    isPublished: row.is_published,
  }));

  return (
    <>
      <PageHeader
        title="Сертификаты"
        description="FSSC 22000, Sedex SMETA, Halal и другие. Скан можно приложить — он будет доступен по ссылке на странице «Качество»."
        action={{ href: "/admin/certificates/new", label: "Добавить сертификат" }}
      />
      <EntryList
        rows={rows}
        basePath="/admin/certificates"
        empty="Сертификатов пока нет."
        togglePublished={toggleCertificate}
      />
    </>
  );
}
