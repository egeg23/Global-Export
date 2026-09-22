import { Addon, ConfiguratorProvider } from "@/components/configurator/context";
import { adarCatalog, adarHrefs } from "@/content/adar/addons";
import { showcasePricing } from "@/lib/adar/showcase";

/**
 * Конструктор ADAR — часть витринной обвязки.
 *
 * Существует только на нашей площадке и только при включённых ценах
 * (`showcasePricing`): док целиком — разговор о цене, и без неё ему нечего
 * показывать. Без провайдера блоки, обёрнутые в `Addon`, рисуются как
 * обычно, а чужие для варианта блоки (`Extra`) не попадают в разметку
 * вовсе — страница выглядит ровно так, как у заказчика. Каталог с ценами
 * при этом не уходит в данные страницы.
 */
export function AdarConfigurator({
  tier,
  children,
}: {
  tier: "base" | "plus" | "premium";
  children: React.ReactNode;
}) {
  if (!showcasePricing) return <>{children}</>;
  return (
    <ConfiguratorProvider catalog={adarCatalog} tier={tier} page="main" hrefs={adarHrefs(tier)}>
      {children}
    </ConfiguratorProvider>
  );
}

/** Блок из другого варианта: с ценами — призрак с тумблером, без них и у заказчика — ничего. */
export function Extra({ id, children }: { id: string; children: React.ReactNode }) {
  if (!showcasePricing) return null;
  return <Addon id={id}>{children}</Addon>;
}
