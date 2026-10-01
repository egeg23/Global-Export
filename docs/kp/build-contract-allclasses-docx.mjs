// Договор с AllClasses в Word — для согласования и правок заказчиком.
//
// Текст не дублируется: его отдаёт сборщик PDF-версии
// (build-contract-allclasses.py --json), здесь только вёрстка в .docx.
// Поправили пункт там — пересобрали оба файла, и они не разъехались.
//
//   python3 docs/kp/build-contract-allclasses.py --json > /tmp/contract.json
//   JSON=/tmp/contract.json OUT=docs/kp/Dogovor-4127-AllClasses.docx node docs/kp/build-contract-allclasses-docx.mjs
//
// Пакет docx ищется как обычно; если его нет в проекте — путь в DOCX
// (например, DOCX=/path/to/node_modules/docx/dist/index.cjs).

import { readFileSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const d = require(process.env.DOCX ?? "docx");
const {
  AlignmentType, BorderStyle, Document, Footer, Header, Packer, PageBreak, PageNumber, Paragraph,
  ShadingType, Table, TableCell, TableRow, TabStopType, TextRun, WidthType,
} = d;

const data = JSON.parse(readFileSync(process.env.JSON, "utf8"));
const OUT = process.env.OUT ?? "Dogovor-AllClasses.docx";
const N = data.number;

const FONT = "Arial";
const ORANGE = "C2560F";
const GREY = "6F675A";
const PAGE_W = 11906, MARGIN = 1134;               // A4, поля 2 см
const W = PAGE_W - MARGIN * 2;                     // ширина текста, DXA

const money = (n) =>
  "$" + Number(n).toLocaleString("ru-RU", { minimumFractionDigits: 0, maximumFractionDigits: 2 }).replace(/ /g, " ");

const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? 20, bold: o.bold, color: o.color, italics: o.italics, strike: o.strike });
const para = (children, o = {}) =>
  new Paragraph({
    children: Array.isArray(children) ? children : [run(children, o)],
    alignment: o.align ?? AlignmentType.JUSTIFIED,
    spacing: { after: o.after ?? 100, before: o.before ?? 0, line: 276 },
    keepNext: o.keepNext,
    pageBreakBefore: o.pageBreak,
    shading: o.shade ? { type: ShadingType.CLEAR, color: "auto", fill: o.shade } : undefined,
    border: o.bottom ? { bottom: { style: BorderStyle.SINGLE, size: 12, color: "17140F", space: 4 } } : undefined,
    tabStops: o.tabs,
    indent: o.indent,
  });
const heading = (text) => para([run(text, { bold: true, size: 22 })], { before: 200, after: 100, keepNext: true, align: AlignmentType.LEFT });
const sub = (text) => para([run(text, { bold: true, size: 20, color: ORANGE })], { before: 200, after: 80, keepNext: true, align: AlignmentType.LEFT });

const border = { style: BorderStyle.SINGLE, size: 4, color: "D9D2C9" };
const borders = { top: border, bottom: border, left: border, right: border };
const cell = (content, width, o = {}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: o.noBorders ? { top: { style: BorderStyle.NONE }, bottom: { style: BorderStyle.NONE }, left: { style: BorderStyle.NONE }, right: { style: BorderStyle.NONE } } : borders,
    shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 },
    columnSpan: o.span,
    children: (Array.isArray(content) ? content : [content]).map((c) =>
      c instanceof Paragraph ? c : para(typeof c === "string" ? [run(c, { size: o.size ?? 18, bold: o.bold, color: o.color, strike: o.strike })] : c, { after: 0, align: o.align ?? AlignmentType.LEFT }),
    ),
  });
const table = (widths, rows) => new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: widths, rows });
const headRow = (widths, labels, aligns = []) =>
  new TableRow({ tableHeader: true, children: labels.map((l, i) => cell(l, widths[i], { bold: true, fill: "F4EDE6", size: 16, color: GREY, align: aligns[i] })) });

const R = AlignmentType.RIGHT, C = AlignmentType.CENTER;

// ── Шапка договора ───────────────────────────────────────────────────────────
const body = [];
body.push(
  para([run("ПРОЕКТ · НА СОГЛАСОВАНИЕ", { bold: true, size: 16, color: ORANGE })], { align: AlignmentType.LEFT, after: 200 }),
  para([run(`Договор № ${N}`, { bold: true, size: 32 })], { align: C, after: 60 }),
  para([run("на выполнение работ по доработке сайта и оказание услуг по сопровождению и SEO", { size: 20, color: GREY })], { align: C, after: 240 }),
  para([run("г. Ташкент"), run("\t«____» ______________ 2026 г.")], { align: AlignmentType.LEFT, tabs: [{ type: TabStopType.RIGHT, position: W }], after: 240 }),
  para([
    run("Индивидуальный предприниматель "), run("MAKSIMOV EGOR ANDREEVICH", { bold: true }),
    run(" (DevUz Studio), именуемый в дальнейшем «Исполнитель», с одной стороны, и индивидуальный предприниматель "),
    run("JUKOV ANDREY ALEKSANDROVICH", { bold: true }),
    run(" (AllClasses), именуемый в дальнейшем «Заказчик», с другой стороны, вместе именуемые «Стороны», заключили настоящий Договор о нижеследующем."),
  ], { after: 160 }),
  para([
    run("Коротко о главном. ", { bold: true, size: 18 }),
    run(`Работы — 15 рабочих дней, два релиза, ${money(data.PAY)} вместо ${money(data.LIST)} (скидка 30%). ` +
      `Сопровождение со статьями — от ${money(data.plans[0].pay)} в месяц, скидка 30% на весь срок. ` +
      "Гарантии по региону продвижения и требованиям Яндекса и Google к статьям — разделы 8 и 9 и Приложение № 4. " +
      (data.mk ? `Маркетинг — ${data.mk.fee.toLocaleString("ru-RU").replace(/\u00a0/g, " ")} сум в месяц за четыре канала, рекламный бюджет $${data.mk.budget.toLocaleString("ru-RU").replace(/\u00a0/g, " ")} — сверх, без комиссии (раздел 10 и Приложение № 5). ` : "") +
      "Дополнительные работы оформляются дополнительными соглашениями к Договору.", { size: 18, color: "5B544A" }),
  ], { shade: "FBF5EF", after: 120 }),
);

// ── Разделы ─────────────────────────────────────────────────────────────────
data.S.forEach(([head, items], i) => {
  body.push(heading(`${i + 1}. ${head}`));
  items.forEach((t, j) => body.push(para([run(`${i + 1}.${j + 1}. `, { bold: true, color: GREY }), run(t)])));
});

// ── Реквизиты ───────────────────────────────────────────────────────────────
const reqLines = {
  contractor: [
    ["ИП MAKSIMOV EGOR ANDREEVICH", true],
    ["Адрес: Республика Узбекистан, г. Ташкент, улица Шота Руставели, 138"],
    ["ПИНФЛ: 32303946570039"],
    ["Р/с: ______________________________"],
    ["Банк: ______________________________"],
    ["МФО: ___________"],
    ["Тел.: +998 90 912-37-72"],
    ["Эл. почта: __________________________"],
    ["Telegram: t.me/Devuz_studio_bot · devuz.studio"],
  ],
  client: [
    ["ИП JUKOV ANDREY ALEKSANDROVICH", true],
    ["Рег. № 7693922 от 17.04.2026, MIROBOD TUMANI DAVLAT XIZMATLARI MARKAZI"],
    ["Адрес: ______________________________"],
    ["ПИНФЛ: ______________________________"],
    ["Р/с: ______________________________"],
    ["Банк: ______________________________"],
    ["МФО: ___________"],
    ["Эл. почта: info@allclasses.live"],
    ["Сайт: allclasses.live"],
  ],
};
const half = W / 2;
const reqCell = (title, lines) =>
  cell([
    para([run(title.toUpperCase(), { bold: true, size: 16, color: GREY })], { after: 80, align: AlignmentType.LEFT }),
    ...lines.map(([t, b]) => para([run(t, { size: 18, bold: b })], { after: 40, align: AlignmentType.LEFT })),
    para([run("")], { after: 300 }),
    para([run("____________________ / ______________ /", { size: 18 })], { after: 0, align: AlignmentType.LEFT }),
    para([run("М.П. (при наличии)", { size: 14, color: GREY })], { after: 0, align: AlignmentType.LEFT }),
  ], half, { noBorders: true });
body.push(heading(`${data.S.length + 1}. Реквизиты и подписи Сторон`));
body.push(table([half, half], [new TableRow({ cantSplit: true, children: [reqCell("Исполнитель", reqLines.contractor), reqCell("Заказчик", reqLines.client)] })]));

const appHead = (n, title) => [
  para([new PageBreak()], { after: 0 }),
  para([run(`Приложение № ${n} к Договору № ${N}`, { size: 16, color: GREY })], { align: R, after: 120 }),
  para([run(title, { bold: true, size: 28 })], { align: C, after: 200 }),
];
const appSign = () =>
  table([half, half], [new TableRow({
    children: ["Исполнитель", "Заказчик"].map((who) =>
      cell([para([run("")], { after: 300 }), para([run(`${who} ____________________`, { size: 18 })], { after: 0, align: AlignmentType.LEFT })], half, { noBorders: true })),
  })]);

// ── Приложение 1 ────────────────────────────────────────────────────────────
{
  const w = [420, 5500, W - 420 - 5500];
  const rows = [headRow(w, ["№", "Работа", "Критерий приёмки"])];
  for (const [s, [name, days]] of Object.entries(data.stages)) {
    rows.push(new TableRow({ children: [cell(`Этап ${s} — ${name} · ${days} рабочих дней`, W, { span: 3, fill: "FBF5EF", bold: true, color: ORANGE })] }));
    data.works.forEach((x, i) => {
      if (String(x.stage) !== s) return;
      rows.push(new TableRow({ cantSplit: true, children: [
        cell(String(i + 1), w[0], { color: GREY }),
        cell([[run(`${x.title}. `, { bold: true, size: 18 }), run(x.what, { size: 18 })]], w[1]),
        cell(x.accept, w[2], { color: "5B544A" }),
      ] }));
    });
  }
  body.push(...appHead(1, "Техническое задание"), table(w, rows), appSign());
}

// ── Приложение 2 ────────────────────────────────────────────────────────────
{
  const w = [420, 4700, 800, 900, 1500, W - 420 - 4700 - 800 - 900 - 1500];
  const al = [undefined, undefined, C, R, R, R];
  const rows = [headRow(w, ["№", "Работа", "Этап", "Часы", "Прайс", "Цена −30%"], al)];
  data.works.forEach((x, i) =>
    rows.push(new TableRow({ children: [
      cell(String(i + 1), w[0], { color: GREY }), cell(x.title, w[1]), cell(String(x.stage), w[2], { align: C }),
      cell(String(x.hours), w[3], { align: R }), cell(money(x.list), w[4], { align: R, strike: true, color: GREY }),
      cell(money(x.pay), w[5], { align: R, bold: true }),
    ] })));
  const hours = data.works.reduce((a, x) => a + x.hours, 0);
  rows.push(new TableRow({ children: [
    cell("", w[0]), cell("Итого Работы", w[1], { bold: true }), cell("", w[2]), cell(String(hours), w[3], { align: R, bold: true }),
    cell(money(data.LIST), w[4], { align: R, strike: true, color: GREY }), cell(money(data.PAY), w[5], { align: R, bold: true }),
  ] }));
  const w2 = [2600, 4700, W - 2600 - 4700];
  const sched = table(w2, [
    headRow(w2, ["Платёж", "Срок", "Сумма"], [undefined, undefined, R]),
    new TableRow({ children: [cell("Аванс 50%", w2[0]), cell("3 рабочих дня с даты подписания", w2[1]), cell(money(data.ADV), w2[2], { align: R, bold: true })] }),
    new TableRow({ children: [cell("Остаток 50%", w2[0]), cell("5 рабочих дней с даты приёмки Этапа 2", w2[1]), cell(money(data.REST), w2[2], { align: R, bold: true })] }),
  ]);
  body.push(...appHead(2, "Смета и график платежей"), table(w, rows), sub("График платежей"), sched,
    para([run(`Стандартная ставка Исполнителя — $${data.HOUR} за час работы команды; для Заказчика — $${String(Math.round(data.HOUR * 0.7 * 10) / 10).replace(".", ",")}. ` +
      "Оплата в сумах по курсу Центрального банка Республики Узбекистан на дату выставления счёта. " +
      "Дополнительные работы в эту смету не входят и оформляются дополнительными соглашениями к Договору.", { size: 16, color: GREY })], { before: 160 }),
    appSign());
}

// ── Приложение 3 ────────────────────────────────────────────────────────────
{
  const w = [1700, 4700, 1500, W - 1700 - 4700 - 1500];
  const rows = [headRow(w, ["Тариф (отметить)", "Объём в месяц", "Прайс", "Цена −30%"], [undefined, undefined, R, R])];
  data.plans.forEach((p) => rows.push(new TableRow({ children: [
    cell(`☐ ${p.name}`, w[0], { bold: true }),
    cell(`до ${p.hours} часов правок и доработок; ${p.n} материалов (статей и новостей) в месяц на ru и uz`, w[1]),
    cell(`${money(p.list)} / мес`, w[2], { align: R, strike: true, color: GREY }),
    cell(`${money(p.pay)} / мес`, w[3], { align: R, bold: true }),
  ] })));
  body.push(...appHead(3, "Сопровождение и публикации"), table(w, rows), para([run("")], { after: 80 }),
    ...data.app3.map((t) => para(t)), appSign());
}

// ── Приложение 4 ────────────────────────────────────────────────────────────
{
  const w = [3400, W - 3400];
  const fill = (k, v) => new TableRow({ children: [cell(k, w[0], { color: GREY }), cell(v, w[1])] });
  body.push(...appHead(4, "Регион продвижения и требования к материалам"),
    sub("1. Регион и языки продвижения (заполняет Заказчик)"),
    table(w, [fill("Регион (страна, города)", " "), fill("Языки", "русский, узбекский (латиница)"), fill("Приоритетные направления", "IELTS, General English, Multilevel (CEFR)")]),
    sub("2. Требования к содержанию материала"),
    ...data.app4_content.map((t, i) => para([run(`${i + 1}. `, { bold: true, color: GREY }), run(t)], { indent: { left: 280, hanging: 280 } })),
    sub("3. Технические требования к странице материала"),
    ...data.app4_tech.map((t, i) => para([run(`${i + 1}. `, { bold: true, color: GREY }), run(t)], { indent: { left: 280, hanging: 280 } })),
    para([run(data.app4_note, { size: 16, color: GREY })], { before: 160 }),
    appSign());
}

// ── Приложение 5 ────────────────────────────────────────────────────────────
if (data.mk) {
  const mk = data.mk;
  const som = (v) => Number(v).toLocaleString("ru-RU").replace(/ /g, " ") + " сум";
  const w = [W - 1900 - 2000, 1900, 2000];
  const rows = [headRow(w, ["Канал и состав работ в месяц", "Рынок", "Для Заказчика"], [undefined, R, R])];
  for (const c of mk.channels) {
    rows.push(new TableRow({ cantSplit: true, children: [
      cell([[run(`${c.name}. `, { bold: true, size: 18 }), run(c.works.join("; ") + ". ", { size: 18 }),
        run(`Старт: ${c.setup.join(", ")} — без доплаты.`, { size: 16, color: GREY })]], w[0]),
      cell(som(c.market), w[1], { align: R, strike: true, color: GREY }),
      cell([[run(som(c.price), { bold: true, size: 18 })], [run(`≈ $${c.usd}`, { size: 16, color: GREY })]], w[2], { align: R }),
    ] }));
  }
  rows.push(new TableRow({ children: [
    cell("Маркетинг в месяц", w[0], { bold: true }),
    cell(som(mk.market), w[1], { align: R, strike: true, color: GREY }),
    cell([[run(som(mk.fee), { bold: true, size: 18 })], [run(`≈ $${mk.fee_usd}`, { size: 16, color: GREY })]], w[2], { align: R }),
  ] }));
  const w2 = [W - 1600 - 1200, 1600, 1200];
  const br = [headRow(w2, ["Канал и кампании", "В месяц", "Доля"], [undefined, R, R])];
  for (const s of mk.split) {
    br.push(new TableRow({ children: [cell(s.name, w2[0], { bold: true, fill: "FBF5EF", color: ORANGE }),
      cell(money(s.usd), w2[1], { align: R, bold: true, fill: "FBF5EF" }),
      cell(`${Math.round((s.usd * 100) / mk.budget)}%`, w2[2], { align: R, fill: "FBF5EF" })] }));
    for (const [n, v] of s.parts) br.push(new TableRow({ children: [cell(n, w2[0]), cell(money(v), w2[1], { align: R }), cell("", w2[2])] }));
  }
  br.push(new TableRow({ children: [cell("Рекламный бюджет в месяц", w2[0], { bold: true }), cell(money(mk.budget), w2[1], { align: R, bold: true }), cell("100%", w2[2], { align: R })] }));
  body.push(...appHead(5, "Маркетинг: каналы, стоимость и рекламный бюджет"), table(w, rows),
    sub("Рекламный бюджет: стартовое распределение"), table(w2, br),
    para([run(mk.note, { size: 16, color: GREY })], { before: 160 }), appSign());
}

const doc = new Document({
  creator: "DevUz Studio",
  title: `Договор № ${N} — AllClasses (проект)`,
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    headers: { default: new Header({ children: [para([run(`Договор № ${N} · DevUz Studio — AllClasses · проект на согласование`, { size: 14, color: GREY })], { align: R, after: 0 })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: C, children: [
      new TextRun({ children: ["Стр. ", PageNumber.CURRENT, " из ", PageNumber.TOTAL_PAGES], font: FONT, size: 14, color: GREY }),
    ] })] }) },
    children: body,
  }],
});

writeFileSync(OUT, await Packer.toBuffer(doc));
console.log("DOCX:", OUT);
