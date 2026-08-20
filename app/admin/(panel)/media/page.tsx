import { PageHeader } from "@/components/admin/page-header";
import { createClient } from "@/lib/supabase/server";
import type { MediaRow } from "@/lib/supabase/types";

import { MediaManager } from "./media-manager";

export default async function MediaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("media")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <>
      <PageHeader
        title="Медиа"
        description="Общее хранилище фотографий и документов. Загруженный файл можно выбрать в любом разделе — в новостях, товарах, сертификатах и карточках сотрудников."
      />
      <MediaManager initial={(data as MediaRow[] | null) ?? []} />
    </>
  );
}
