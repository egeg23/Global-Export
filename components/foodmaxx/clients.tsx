import Image from "next/image";

import { Shell } from "@/components/foodmaxx/ui/shell";
import { clients } from "@/content/foodmaxx/company";

/**
 * Торговые сети.
 *
 * На сайте заказчика эти логотипы лежат в самом низу мелкой строкой, хотя
 * это его сильнейший аргумент: продукт уже прошёл входной контроль шести
 * сетей. Поэтому здесь они идут отдельным разделом и крупно.
 */
export function FoodmaxxClients() {
  return (
    <section className="bg-fm-cream-100 py-16 text-fm-ink-900 lg:py-20">
      <Shell size="wide">
        <div className="flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-fm-display text-xl font-600 sm:text-2xl">
            Нас берут федеральные сети
          </h2>
          <p className="text-sm text-fm-ink-400">
            Продукт прошёл входной контроль каждой из них
          </p>
        </div>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {clients.map((client) => (
            <li
              key={client.file}
              className="flex h-24 items-center justify-center rounded-fm border border-fm-ink-900/8 bg-white px-5 transition-colors duration-300 hover:border-fm-ink-900/20"
            >
              <Image
                src={`/foodmaxx/clients/${client.file}.webp`}
                alt={client.name}
                width={500}
                height={200}
                className="max-h-10 w-auto object-contain"
              />
            </li>
          ))}
        </ul>
      </Shell>
    </section>
  );
}
