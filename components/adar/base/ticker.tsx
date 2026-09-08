import { company } from "@/content/adar/company";

/**
 * Бегущая строка с их же слоганами.
 *
 * Список дублируется — вторая копия скрыта от чтения с экрана, — и лента
 * сдвигается ровно на половину своей ширины, поэтому склейки не видно.
 */
export function Ticker() {
  const line = [...company.ticker, ...company.ticker, ...company.ticker];

  return (
    <div className="overflow-hidden border-y border-adar-green-900/10 bg-adar-green-900 py-4">
      <div className="flex w-max adar-marquee" style={{ "--adar-marquee-duration": "38s" } as React.CSSProperties}>
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1}
            className="flex shrink-0 items-center gap-10 pr-10"
          >
            {line.map((phrase, index) => (
              <li
                key={`${copy}-${index}`}
                className="flex items-center gap-10 whitespace-nowrap text-sm font-medium uppercase tracking-[0.2em] text-adar-cream-100/85"
              >
                {phrase}
                <span aria-hidden="true" className="text-adar-gold-500">
                  ✳
                </span>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
