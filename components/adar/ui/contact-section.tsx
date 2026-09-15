import { OrderForm } from "@/components/adar/ui/order-form";
import { Shell } from "@/components/adar/ui/shell";
import { company } from "@/content/adar/company";
import { cn } from "@/lib/cn";

/**
 * Контакты и заявка в одном экране.
 *
 * Пять телефонов, которые компания перечисляет на своей странице контактов,
 * сведены к четырём рабочим и разбиты на строки: списком в столбик по ним
 * действительно звонят, сплошной строкой — нет.
 */
export function ContactSection({ tone = "light" }: { tone?: "light" | "dark" }) {
  const dark = tone === "dark";

  return (
    <section
      id="kontakty"
      className={cn("py-20 lg:py-28", dark ? "bg-adar-green-900" : "bg-adar-cream-50")}
    >
      <Shell size="wide" className="grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-5">
          <p
            className={cn(
              "text-[0.7rem] font-semibold uppercase tracking-[0.22em]",
              dark ? "text-adar-gold-400" : "text-adar-green-500",
            )}
          >
            Контакты
          </p>
          <h2
            className={cn(
              "mt-4 font-adar-display text-4xl leading-tight sm:text-5xl",
              dark ? "text-adar-cream-50" : "text-adar-green-950",
            )}
          >
            Расскажите, кому дарим
          </h2>
          <p
            className={cn(
              "mt-6 max-w-md text-sm leading-relaxed",
              dark ? "text-adar-cream-50/60" : "text-adar-ink-muted",
            )}
          >
            Количество, бюджет на человека и дату отгрузки достаточно назвать
            примерно — состав подберём и покажем несколько вариантов на выбор.
          </p>

          <dl className="mt-10 grid gap-7 text-sm">
            <div>
              <dt
                className={cn(
                  "text-xs uppercase tracking-[0.16em]",
                  dark ? "text-adar-cream-50/40" : "text-adar-ink-subtle",
                )}
              >
                Телефоны
              </dt>
              <dd className="mt-2 grid gap-1">
                {company.contacts.phones.map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone.replace(/\s/g, "")}`}
                    className={cn(
                      "w-fit transition-colors",
                      dark
                        ? "text-adar-cream-50 hover:text-adar-gold-400"
                        : "text-adar-ink hover:text-adar-green-700",
                    )}
                  >
                    {phone}
                  </a>
                ))}
              </dd>
            </div>

            <div>
              <dt
                className={cn(
                  "text-xs uppercase tracking-[0.16em]",
                  dark ? "text-adar-cream-50/40" : "text-adar-ink-subtle",
                )}
              >
                Почта
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${company.contacts.email}`}
                  className={cn(dark ? "text-adar-cream-50" : "text-adar-ink")}
                >
                  {company.contacts.email}
                </a>
              </dd>
            </div>

            <div>
              <dt
                className={cn(
                  "text-xs uppercase tracking-[0.16em]",
                  dark ? "text-adar-cream-50/40" : "text-adar-ink-subtle",
                )}
              >
                Адрес и время работы
              </dt>
              <dd className={cn("mt-2", dark ? "text-adar-cream-50/80" : "text-adar-ink-muted")}>
                {company.contacts.address}
                <br />
                {company.contacts.hours}
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <OrderForm tone={tone} />
        </div>
      </Shell>
    </section>
  );
}
