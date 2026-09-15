import { CountUp } from "@/components/adar/premium/count-up";
import { Shell } from "@/components/adar/ui/shell";
import { sets } from "@/content/adar/catalog";
import { company } from "@/content/adar/company";

/**
 * Полоса цифр.
 *
 * Всё, кроме количества наборов, компания называет сама: год основания,
 * первая отгрузка на 24 000 подарков, порог в 5 000 штук для собственного
 * дизайна коробки.
 */
const figures = [
  { value: company.since, label: "год первой крупной отгрузки", suffix: "", plain: true },
  { value: 24000, label: "подарков в первом контракте", suffix: "" },
  { value: sets.length, label: "готовых наборов в каталоге", suffix: "" },
  { value: 5000, label: "штук — и коробка с вашим логотипом", suffix: "от " },
];

export function NumbersBand() {
  return (
    <section className="border-y border-white/8 bg-adar-green-950 py-16 lg:py-20">
      <Shell size="wide">
        <dl className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {figures.map((figure) => (
            // Подпись — это и есть <dt>: раньше она стояла дважды, скрытой
            // для экранного диктора и видимой рядом, и он читал её дважды.
            // Порядок в разметке обязан быть dt→dd, поэтому визуально их
            // меняет местами колонка с обратным направлением.
            <div key={figure.label} className="flex flex-col-reverse">
              <dt className="mt-4 max-w-[13rem] text-sm leading-relaxed text-adar-cream-50/65">
                {figure.label}
              </dt>
              <dd className="font-adar-display text-5xl leading-none text-adar-gold-400 tabular-nums xl:text-6xl">
                {figure.suffix}
                <CountUp to={figure.value} plain={figure.plain} />
              </dd>
            </div>
          ))}
        </dl>
      </Shell>
    </section>
  );
}
