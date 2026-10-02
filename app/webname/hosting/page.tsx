import { permanentRedirect } from "next/navigation";

/**
 * Старый адрес шага «Реестра». С 02.10.2026 на /webname — окно выбора
 * вариантов, а «Реестр» живёт на /webname/registry; ссылки, уже отправленные
 * заказчику, ведут туда же, со всеми параметрами (?name=, ?plan=, ?addons=).
 */
export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(await searchParams)) {
    for (const item of Array.isArray(value) ? value : value ? [value] : []) query.append(key, item);
  }
  const tail = query.toString();
  permanentRedirect(`/webname/registry/hosting${tail ? `?${tail}` : ""}`);
}
