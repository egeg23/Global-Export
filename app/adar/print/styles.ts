/**
 * Стили печатного листа.
 *
 * Отдельной строкой, а не через Tailwind: лист меряется в миллиметрах и
 * пунктах, а не в условных шагах сетки, и должен читаться на чёрно-белом
 * принтере. Цвета здесь нет вовсе — иерархию держат кегль, насыщенность и
 * толщина линеек, поэтому лист одинаков в цвете и в оттенках серого.
 */
export const printStyles = `
  .pl {
    --ink: #000;
    --ink-soft: #3f3f3f;
    --ink-faint: #767676;
    --rule: #c8c8c8;
    --rule-soft: #e2e2e2;

    background: #f1f1f1;
    color: var(--ink);
    font-family: var(--font-manrope), ui-sans-serif, system-ui, sans-serif;
    font-size: 9.2pt;
    line-height: 1.4;
    padding: 12mm 0;
  }

  .pl-sheet {
    display: flex;
    flex-direction: column;
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto 10mm;
    padding: 12mm 13mm 10mm;
    background: #fff;
    box-shadow: 0 2px 14px rgb(0 0 0 / 0.14);
  }

  .pl-serif {
    font-family: var(--font-cormorant), Georgia, serif;
    font-weight: 600;
  }

  /* Шапка листа */
  .pl-head { display: flex; justify-content: space-between; align-items: flex-start; gap: 10mm;
    border-bottom: 1.4pt solid var(--ink); padding-bottom: 4mm; }
  .pl-brand { font-family: var(--font-cormorant), Georgia, serif; font-size: 19pt;
    letter-spacing: 0.26em; font-weight: 600; line-height: 1; }
  .pl-brand span { display: block; font-family: inherit; font-size: 6pt; letter-spacing: 0.4em;
    color: var(--ink-faint); margin-top: 1.5mm; }
  .pl-kicker { font-size: 7.6pt; text-transform: uppercase; letter-spacing: 0.18em;
    color: var(--ink-faint); }
  .pl-h1 { font-size: 19pt; line-height: 1.08; margin: 5mm 0 2.5mm; }
  .pl-lead { max-width: 150mm; color: var(--ink-soft); }

  /* Поля, которые заполняют от руки */
  .pl-fill { display: flex; gap: 8mm; margin-top: 4mm; font-size: 8.6pt; color: var(--ink-faint); }
  .pl-fill > div { flex: 1; border-bottom: 0.8pt solid var(--rule); padding-bottom: 4mm; }

  /* Три варианта */
  .pl-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5mm; margin-top: 6mm; }
  .pl-card { border: 0.8pt solid var(--rule); padding: 4mm; display: flex; flex-direction: column; }
  .pl-card--pick { border: 1.6pt solid var(--ink); }
  .pl-num { font-size: 8pt; letter-spacing: 0.2em; color: var(--ink-faint); }
  .pl-name { font-size: 15pt; margin: 2mm 0 1mm; }
  .pl-tag { font-size: 8.2pt; color: var(--ink-soft); min-height: 11mm; }
  .pl-price { font-size: 22pt; line-height: 1; margin-top: 2.5mm; font-variant-numeric: tabular-nums; }
  .pl-days { font-size: 8.4pt; color: var(--ink-faint); margin-top: 1.5mm; }
  .pl-list { list-style: none; margin: 3mm 0 0; padding: 2.5mm 0 0; border-top: 0.6pt solid var(--rule-soft);
    display: grid; gap: 1.5mm; font-size: 8.2pt; }
  .pl-list li { padding-left: 4mm; position: relative; }
  .pl-list li::before { content: "—"; position: absolute; left: 0; color: var(--ink-faint); }

  /* Выбор варианта галочкой */
  .pl-choice { display: flex; align-items: center; gap: 6mm; margin-top: 6mm;
    border: 0.8pt solid var(--rule); padding: 3.5mm 4mm; }
  .pl-choice-title { font-size: 9pt; font-weight: 600; }
  .pl-box { display: inline-flex; align-items: center; gap: 2.5mm; font-size: 9pt; }
  .pl-box::before { content: ""; width: 4.5mm; height: 4.5mm; border: 1pt solid var(--ink);
    display: inline-block; }

  /* Место для комментария заказчика */
  .pl-notes { margin-top: 6mm; }
  .pl-notes-title { font-size: 8pt; text-transform: uppercase; letter-spacing: 0.16em;
    color: var(--ink-faint); margin-bottom: 3mm; }
  .pl-line { border-bottom: 0.7pt solid var(--rule); height: 7.5mm; }

  /* Таблицы */
  .pl-table { width: 100%; border-collapse: collapse; margin-top: 4.5mm; font-size: 8.4pt; }
  .pl-table th, .pl-table td { text-align: left; padding: 1.7mm 2mm; vertical-align: top;
    border-bottom: 0.6pt solid var(--rule-soft); }
  .pl-table thead th { font-size: 7.6pt; text-transform: uppercase; letter-spacing: 0.14em;
    color: var(--ink-faint); border-bottom: 1pt solid var(--ink); font-weight: 600; }
  .pl-center { text-align: center; }
  .pl-right { text-align: right; font-variant-numeric: tabular-nums; }
  .pl-mark { width: 52mm; border-left: 0.6pt solid var(--rule); }
  .pl-total td, .pl-total th { border-top: 1.2pt solid var(--ink); border-bottom: none;
    padding-top: 2.5mm; font-weight: 600; font-size: 9.6pt; }

  .pl-h2 { font-size: 14pt; margin-top: 7mm; }
  .pl-h2:first-of-type { margin-top: 6mm; }
  .pl-sub { font-size: 8.6pt; color: var(--ink-soft); margin-top: 2mm; max-width: 150mm; }
  .pl-excluded { font-size: 8.2pt; color: var(--ink-faint); margin-top: 2.5mm; }

  /* Подвал листа */
  .pl-foot { display: flex; justify-content: space-between; align-items: flex-end; gap: 8mm;
    margin-top: auto; padding-top: 4mm; border-top: 0.8pt solid var(--rule); font-size: 8pt;
    color: var(--ink-faint); }
  .pl-qr { display: flex; align-items: center; gap: 4mm; }
  .pl-qr img { width: 22mm; height: 22mm; }
  .pl-qr b { display: block; font-size: 9pt; color: var(--ink); }

  .pl-print-button { position: fixed; right: 14mm; bottom: 14mm; z-index: 10;
    border: 1pt solid #000; background: #000; color: #fff; font: inherit; font-size: 9.5pt;
    padding: 3mm 6mm; border-radius: 999px; cursor: pointer; }

  @media print {
    @page { size: A4 portrait; margin: 0; }

    .pl { background: #fff; padding: 0; }
    .pl-sheet { box-shadow: none; margin: 0; width: auto; min-height: 297mm; }
    /* Последний лист без разрыва — иначе принтер выплюнет пустую страницу. */
    .pl-sheet { break-after: page; }
    .pl-sheet:last-child { break-after: auto; }
    .pl-print-button { display: none; }

    /* Строки таблиц не должны разрываться посередине. */
    .pl-table tr { break-inside: avoid; }
    .pl-card { break-inside: avoid; }
  }
`;
