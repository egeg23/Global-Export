import { Addon, ConfiguratorProvider } from "@/components/configurator/context";
import { globalexCatalog, globalexHrefs } from "@/content/globalex/addons";
import { showcaseChrome } from "@/lib/adar/showcase";

/**
 * Конструктор для концепций Global Export — только на витрине.
 *
 * Концепции живут на том же сервере, что и будущий сайт компании, поэтому
 * признак тот же, что у остальной витринной обвязки: без `SHOWCASE_ROOT`
 * страницы собираются чистыми, а блоки соседней концепции (`Extra`) в
 * разметку не попадают.
 */
export function GlobalexConfigurator({
  locale,
  tier,
  children,
}: {
  locale: string;
  tier: "a" | "b";
  children: React.ReactNode;
}) {
  if (!showcaseChrome) return <>{children}</>;
  return (
    <ConfiguratorProvider catalog={globalexCatalog} tier={tier} page={tier} hrefs={globalexHrefs(locale)}>
      {children}
    </ConfiguratorProvider>
  );
}

/** Блок соседней концепции: на витрине — призрак с тумблером, у заказчика — ничего. */
export function Extra({ id, children }: { id: string; children: React.ReactNode }) {
  if (!showcaseChrome) return null;
  return <Addon id={id}>{children}</Addon>;
}
