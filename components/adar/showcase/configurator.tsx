import { Addon, ConfiguratorProvider } from "@/components/configurator/context";
import { adarCatalog, adarHrefs } from "@/content/adar/addons";
import { showcaseChrome } from "@/lib/adar/showcase";

/**
 * Конструктор ADAR — часть витринной обвязки.
 *
 * Как и полоса вариантов с составом работ, он существует только на нашей площадке:
 * признак тот же, `SHOWCASE_ROOT`. На сервере заказчика страницы собираются
 * без провайдера, и блоки, обёрнутые в `Addon`, рисуются как обычно, а
 * чужие для варианта блоки (`Extra`) не попадают в разметку вовсе.
 */
export function AdarConfigurator({
  tier,
  children,
}: {
  tier: "base" | "plus" | "premium";
  children: React.ReactNode;
}) {
  if (!showcaseChrome) return <>{children}</>;
  return (
    <ConfiguratorProvider catalog={adarCatalog} tier={tier} page="main" hrefs={adarHrefs(tier)}>
      {children}
    </ConfiguratorProvider>
  );
}

/** Блок из другого варианта: на витрине — призрак с тумблером, у заказчика — ничего. */
export function Extra({ id, children }: { id: string; children: React.ReactNode }) {
  if (!showcaseChrome) return null;
  return <Addon id={id}>{children}</Addon>;
}
