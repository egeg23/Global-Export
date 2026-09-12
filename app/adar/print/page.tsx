import type { Metadata } from "next";

import { PrintButton } from "@/components/adar/print/print-button";
import { printStyles } from "@/app/adar/print/styles";
import { comparison, concepts } from "@/content/adar/concepts";
import { sets } from "@/content/adar/catalog";
import { priceRange } from "@/lib/adar/catalog";
import { formatNumber } from "@/lib/adar/format";

export const metadata: Metadata = {
  title: "Предложение для печати",
  robots: { index: false, follow: false },
};

const SITE = "globalex.maximov-tech.ru/adar";

/** Листов в комплекте — подписывается в подвале каждого. */
const SHEETS = 4;

function SheetFoot({ n, children }: { n: number; children?: React.ReactNode }) {
  return (
    <footer className="pl-foot">
      <div>{children ?? SITE}</div>
      <div>
        Лист {n} из {SHEETS}
      </div>
    </footer>
  );
}

/**
 * Лист, который менеджер увозит на встречу.
 *
 * Собирается из тех же данных, что и сами концепции, поэтому не устаревает:
 * поменялась строка в смете — поменялась и распечатка. Печатать её можно из
 * браузера в PDF, отдельного файла держать не нужно.
 *
 * Три листа A4: обзор с выбором варианта, построчное сравнение и сметы.
 * На каждом оставлено место, куда заказчик пишет от руки — в сравнении для
 * этого отведена собственная колонка напротив каждой строки.
 */
export default function AdarPrintSheet() {
  return (
    <>
      <style>{printStyles}</style>

      <div className="pl">
        <PrintButton />

        {/* ЛИСТ 1 — обзор и выбор */}
        <section className="pl-sheet">
          <header className="pl-head">
            <div className="pl-brand">
              ADAR<span>SINCE 2011</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="pl-kicker">Коммерческое предложение</div>
              <div style={{ fontSize: "8.4pt", marginTop: "1.5mm" }}>
                Новый сайт adar.uz · три варианта
              </div>
            </div>
          </header>

          <h1 className="pl-h1 pl-serif">Три варианта нового сайта</h1>

          <p className="pl-lead">
            Каждый вариант — работающая страница, а не макет: по адресу ниже
            открывается каталог из {sets.length} наборов с вашими фотографиями,
            ценами от {formatNumber(priceRange.min)} до{" "}
            {formatNumber(priceRange.max)} сум и составом каждого набора.
            Варианты отличаются не объёмом текста, а тем, что посетитель может
            сделать на сайте.
          </p>

          <div className="pl-fill">
            <div>Дата встречи</div>
            <div>Менеджер</div>
            <div>Со стороны заказчика</div>
          </div>

          <div className="pl-grid">
            {concepts.map((concept) => (
              <article
                key={concept.id}
                className={concept.id === "plus" ? "pl-card pl-card--pick" : "pl-card"}
              >
                <div className="pl-num">ВАРИАНТ {concept.index}</div>
                <h2 className="pl-name pl-serif">«{concept.name}»</h2>
                <p className="pl-tag">{concept.tagline}</p>
                <div className="pl-price pl-serif">${concept.estimate.total}</div>
                <div className="pl-days">{concept.estimate.days}</div>
                <ul className="pl-list">
                  {concept.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>

          <div className="pl-choice">
            <span className="pl-choice-title">Выбранный вариант:</span>
            {concepts.map((concept) => (
              <span key={concept.id} className="pl-box">
                {concept.index} «{concept.name}»
              </span>
            ))}
          </div>

          <div className="pl-notes">
            <div className="pl-notes-title">Комментарий заказчика</div>
            {[0, 1, 2, 3].map((line) => (
              <div key={line} className="pl-line" />
            ))}
          </div>

          <SheetFoot n={1}>
            <span className="pl-qr">
              {/* eslint-disable-next-line @next/next/no-img-element -- в печать
                  уходит исходный SVG: next/image отдал бы растр и код замылился */}
              <img src="/adar/qr-prototype.svg" alt="" />
              <span>
                <b>{SITE}</b>
                Наведите камеру телефона — откроются все три варианта
              </span>
            </span>
          </SheetFoot>
        </section>

        {/* ЛИСТ 2 — построчное сравнение */}
        <section className="pl-sheet">
          <header className="pl-head">
            <div className="pl-brand">
              ADAR<span>SINCE 2011</span>
            </div>
            <div style={{ textAlign: "right" }}>
              <div className="pl-kicker">Что входит в каждый вариант</div>
            </div>
          </header>

          <h2 className="pl-h2 pl-serif">Построчное сравнение</h2>
          <p className="pl-sub">
            Правая колонка оставлена пустой: отмечайте в ней, что нужно, что
            лишнее и что добавить. Строку, которой здесь нет, допишите внизу.
          </p>

          <table className="pl-table">
            <thead>
              <tr>
                <th style={{ width: "62mm" }}>Возможность</th>
                {concepts.map((concept) => (
                  <th key={concept.id} className="pl-center">
                    {concept.index} «{concept.name}»
                    <br />${concept.estimate.total}
                  </th>
                ))}
                <th className="pl-mark">Отметки заказчика</th>
              </tr>
            </thead>
            <tbody>
              {comparison.map((row) => (
                <tr key={row.title}>
                  <th scope="row" style={{ fontWeight: 400 }}>
                    {row.title}
                  </th>
                  {row.values.map((value, index) => (
                    <td key={index} className="pl-center">
                      {value === true ? "✓" : value === false ? "—" : value}
                    </td>
                  ))}
                  <td className="pl-mark" />
                </tr>
              ))}
              <tr className="pl-total">
                <th scope="row">Стоимость</th>
                {concepts.map((concept) => (
                  <td key={concept.id} className="pl-center">
                    ${concept.estimate.total}
                  </td>
                ))}
                <td className="pl-mark" />
              </tr>
            </tbody>
          </table>

          <div className="pl-notes">
            <div className="pl-notes-title">Что нужно добавить или убрать</div>
            {[0, 1, 2].map((line) => (
              <div key={line} className="pl-line" />
            ))}
          </div>

          <SheetFoot n={2} />
        </section>

        {/* ЛИСТЫ 3 И 4 — сметы; третий вариант уезжает на отдельный лист
            вместе с итогом встречи: втроём они на A4 не помещаются. */}
        {[concepts.slice(0, 2), concepts.slice(2)].map((group, sheet) => (
          <section key={sheet} className="pl-sheet">
            <header className="pl-head">
              <div className="pl-brand">
                ADAR<span>SINCE 2011</span>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="pl-kicker">Сметы по вариантам</div>
              </div>
            </header>

            {group.map((concept) => (
              <div key={concept.id}>
                <h2 className="pl-h2 pl-serif">
                  Вариант {concept.index} · «{concept.name}» · ${concept.estimate.total} ·{" "}
                  {concept.estimate.days}
                </h2>
                <table className="pl-table">
                  <tbody>
                    {concept.estimate.lines.map((line) => (
                      <tr key={line.title}>
                        <th scope="row" style={{ fontWeight: 400, width: "110mm" }}>
                          {line.title}
                        </th>
                        <td className="pl-right">${line.price}</td>
                        <td className="pl-mark" />
                      </tr>
                    ))}
                    <tr className="pl-total">
                      <th scope="row">Итого</th>
                      <td className="pl-right">${concept.estimate.total}</td>
                      <td className="pl-mark" />
                    </tr>
                  </tbody>
                </table>
                <p className="pl-excluded">
                  В сумму не входит: {concept.estimate.excluded.join(", ").toLowerCase()}.
                </p>
              </div>
            ))}

            {sheet === 1 ? (
              <>
                <div className="pl-choice" style={{ marginTop: "8mm" }}>
                  <span className="pl-choice-title">Итог встречи:</span>
                  <span className="pl-box">берём вариант</span>
                  <span className="pl-box">думаем</span>
                  <span className="pl-box">нужна доработка</span>
                </div>

                <div className="pl-fill" style={{ marginTop: "7mm" }}>
                  <div>Согласованная сумма</div>
                  <div>Срок</div>
                  <div>Подпись</div>
                </div>

                <div className="pl-notes">
                  <div className="pl-notes-title">Договорились</div>
                  {[0, 1, 2].map((line) => (
                    <div key={line} className="pl-line" />
                  ))}
                </div>
              </>
            ) : null}

            <SheetFoot n={3 + sheet} />
          </section>
        ))}

      </div>
    </>
  );
}
