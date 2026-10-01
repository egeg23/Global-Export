// Договор № 4127 с AllClasses на рекламу — в Word, для согласования.
//
// Текст и цифры отдаёт build-contract-ads-allclasses.py (JSON), здесь только
// вёрстка. Вёрстка та же, что у build-contract-allclasses-docx.mjs.
//
//   python3 docs/kp/build-contract-ads-allclasses.py > /tmp/ads.json
//   JSON=/tmp/ads.json OUT=docs/kp/Dogovor-4127-AllClasses-reklama.docx node docs/kp/build-contract-ads-allclasses-docx.mjs
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
  para([run("на оказание услуг по ведению рекламы", { size: 20, color: GREY })], { align: C, after: 240 }),
  para([run("г. Ташкент"), run("\t«____» ______________ 2026 г.")], { align: AlignmentType.LEFT, tabs: [{ type: TabStopType.RIGHT, position: W }], after: 240 }),
  para([
    run("Индивидуальный предприниматель "), run("MAKSIMOV EGOR ANDREEVICH", { bold: true }),
    run(" (DevUz Studio), именуемый в дальнейшем «Исполнитель», с одной стороны, и индивидуальный предприниматель "),
    run("JUKOV ANDREY ALEKSANDROVICH", { bold: true }),
    run(" (AllClasses), именуемый в дальнейшем «Заказчик», с другой стороны, вместе именуемые «Стороны», заключили настоящий Договор о нижеследующем."),
  ], { after: 160 }),
  para([
    run("Коротко о главном. ", { bold: true, size: 18 }),
    run(data.summary, { size: 18, color: "5B544A" }),
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
  const mk = data;
  const som = (v) => Number(v).toLocaleString("ru-RU").replace(/ /g, " ") + " сум";
  const w = [W - 1900 - 1900, 1900, 1900];
  const rows = [headRow(w, ["Канал и состав работ в месяц", "В месяц", "Первый месяц"], [undefined, R, R])];
  for (const c of mk.channels) {
    rows.push(new TableRow({ cantSplit: true, children: [
      cell([[run(`${c.name}. `, { bold: true, size: 18 }), run(c.works.join("; ") + ". ", { size: 18 }),
        run(`Стартовые работы первого месяца: ${c.setup.join(", ")}.`, { size: 16, color: GREY })]], w[0]),
      cell([[run(som(c.price), { bold: true, size: 18 })], [run(`≈ $${c.usd}`, { size: 16, color: GREY })]], w[1], { align: R }),
      cell(som(c.price_first), w[2], { align: R }),
    ] }));
  }
  rows.push(new TableRow({ children: [
    cell("Итого Услуги", w[0], { bold: true }),
    cell([[run(som(mk.fee), { bold: true, size: 18 })], [run(`≈ $${mk.fee_usd}`, { size: 16, color: GREY })]], w[1], { align: R }),
    cell(som(mk.fee_first), w[2], { align: R, bold: true }),
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
  body.push(...appHead(1, "Маркетинг: каналы, стоимость и рекламный бюджет"), table(w, rows),
    sub("Рекламный бюджет: стартовое распределение"), table(w2, br),
    para([run(mk.note, { size: 16, color: GREY })], { before: 160 }), appSign());
}

const doc = new Document({
  creator: "DevUz Studio",
  title: `Договор № ${N} на рекламу — AllClasses (проект)`,
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    headers: { default: new Header({ children: [para([run(`Договор № ${N} на рекламу · DevUz Studio — AllClasses · проект на согласование`, { size: 14, color: GREY })], { align: R, after: 0 })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: C, children: [
      new TextRun({ children: ["Стр. ", PageNumber.CURRENT, " из ", PageNumber.TOTAL_PAGES], font: FONT, size: 14, color: GREY }),
    ] })] }) },
    children: body,
  }],
});

writeFileSync(OUT, await Packer.toBuffer(doc));
console.log("DOCX:", OUT);
