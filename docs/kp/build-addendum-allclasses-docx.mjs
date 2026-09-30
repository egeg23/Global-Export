// Дополнительное соглашение № 1 к договору с AllClasses — дополнительные работы
// из КП, которые заказчик отмечает сам (чекбоксы Word кликаются).
//
// Цены — как в КП: часы × $26 стандартной ставки, для AllClasses −30%.
//
//   OUT=docs/kp/DopSoglashenie-1-k-4127-AllClasses.docx node docs/kp/build-addendum-allclasses-docx.mjs
//   (если пакета docx нет в проекте — путь в DOCX, как у build-contract-allclasses-docx.mjs)

import { writeFileSync } from "node:fs";
import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
const {
  AlignmentType, BorderStyle, CheckBox, Document, Footer, Header, Packer, PageNumber, Paragraph,
  ShadingType, Table, TableCell, TableRow, TabStopType, TextRun, WidthType,
} = require(process.env.DOCX ?? "docx");

const OUT = process.env.OUT ?? "DopSoglashenie-1.docx";
const CONTRACT = "4127";
const HOUR = 26, DISCOUNT = 0.3;
const off = (v) => Math.round(v * (1 - DISCOUNT));

// Те же четыре работы, что в КП (раздел 5) — описание, критерий приёмки, часы, срок.
const EXTRAS = [
  ["Онбординг «дата экзамена и целевой балл → план занятий»",
    "Экран после регистрации: ученик указывает дату экзамена, текущий и целевой балл; сайт строит план занятий по неделям из уроков курса и показывает его в личном кабинете.",
    "новый ученик проходит онбординг и видит план в кабинете на тестовом аккаунте.", 16, 3],
  ["Telegram-бот: практика Speaking, напоминания, вход в кабинет",
    "Бот AllClasses: ежедневный вопрос Speaking с приёмом голосового ответа и передачей на оценку, напоминания о занятиях по плану, вход в кабинет по Telegram.",
    "на тестовом аккаунте бот принимает голосовой ответ, присылает напоминание и открывает кабинет.", 32, 5],
  ["Режим Multilevel (CEFR) в пробном задании и курсе",
    "Пробное задание и раздел курса в формате национального экзамена Multilevel: задания и критерии предоставляют преподаватели Заказчика, Исполнитель встраивает их в сайт и в оценку.",
    "гость проходит пробное задание Multilevel и получает оценку.", 24, 4],
  ["Оплата кошельками Payme и Click",
    "Подключение оплаты через Payme и Click на странице оформления, если платёжный шлюз ATMOS их не подключает; события оплаты передаются в аналитику так же, как оплата картой.",
    "тестовая оплата через каждый кошелёк проходит и открывает доступ.", 16, 3],
];

const FONT = "Arial", ORANGE = "C2560F", GREY = "6F675A";
const PAGE_W = 11906, MARGIN = 1134, W = PAGE_W - MARGIN * 2;
const money = (n) => "$" + n.toLocaleString("ru-RU").replace(/ /g, " ");
const run = (text, o = {}) => new TextRun({ text, font: FONT, size: o.size ?? 20, bold: o.bold, color: o.color, strike: o.strike });
const para = (children, o = {}) => new Paragraph({
  children: Array.isArray(children) ? children : [run(children, o)],
  alignment: o.align ?? AlignmentType.JUSTIFIED,
  spacing: { after: o.after ?? 100, before: o.before ?? 0, line: 276 },
  keepNext: o.keepNext, tabStops: o.tabs,
  shading: o.shade ? { type: ShadingType.CLEAR, color: "auto", fill: o.shade } : undefined,
});
const heading = (t) => para([run(t, { bold: true, size: 22 })], { before: 200, after: 100, keepNext: true, align: AlignmentType.LEFT });
const b = { style: BorderStyle.SINGLE, size: 4, color: "D9D2C9" };
const none = { style: BorderStyle.NONE };
const cell = (children, width, o = {}) => new TableCell({
  width: { size: width, type: WidthType.DXA },
  borders: o.noBorders ? { top: none, bottom: none, left: none, right: none } : { top: b, bottom: b, left: b, right: b },
  shading: o.fill ? { type: ShadingType.CLEAR, color: "auto", fill: o.fill } : undefined,
  margins: { top: 60, bottom: 60, left: 100, right: 100 },
  verticalAlign: o.vcenter ? "center" : undefined,
  children: (Array.isArray(children) ? children : [children]).map((c) =>
    c instanceof Paragraph ? c : para(typeof c === "string" ? [run(c, { size: o.size ?? 18, bold: o.bold, color: o.color, strike: o.strike })] : c,
      { after: 0, align: o.align ?? AlignmentType.LEFT })),
});
const R = AlignmentType.RIGHT, C = AlignmentType.CENTER;

const body = [
  para([run("ПРОЕКТ · НА СОГЛАСОВАНИЕ", { bold: true, size: 16, color: ORANGE })], { align: AlignmentType.LEFT, after: 200 }),
  para([run("Дополнительное соглашение № 1", { bold: true, size: 30 })], { align: C, after: 40 }),
  para([run(`к Договору № ${CONTRACT} от «____» ______________ 2026 г.`, { size: 20, color: GREY })], { align: C, after: 40 }),
  para([run("о выполнении дополнительных работ", { size: 20, color: GREY })], { align: C, after: 240 }),
  para([run("г. Ташкент"), run("\t«____» ______________ 2026 г.")], { align: AlignmentType.LEFT, tabs: [{ type: TabStopType.RIGHT, position: W }], after: 240 }),
  para([
    run("Индивидуальный предприниматель "), run("MAKSIMOV EGOR ANDREEVICH", { bold: true }),
    run(" (DevUz Studio), именуемый в дальнейшем «Исполнитель», и индивидуальный предприниматель "),
    run("JUKOV ANDREY ALEKSANDROVICH", { bold: true }),
    run(` (AllClasses), именуемый в дальнейшем «Заказчик», заключили настоящее Дополнительное соглашение к Договору № ${CONTRACT} (далее — Договор) о нижеследующем.`),
  ], { after: 160 }),
  para([run("Как заполнять. ", { bold: true, size: 18 }),
    run("Отметьте галочкой в таблице работы, которые нужны, и впишите итог по отмеченным в п. 2.1. " +
      "Работы без отметки не заказываются и не оплачиваются. Позже любую из них можно добавить следующим дополнительным соглашением.",
      { size: 18, color: "5B544A" })], { shade: "FBF5EF", after: 120 }),
];

const clause = (n, text) => para([run(`${n}. `, { bold: true, color: GREY }), run(text)]);

body.push(heading("1. Предмет"));
body.push(clause("1.1", "Исполнитель выполняет, а Заказчик принимает и оплачивает дополнительные работы, отмеченные Заказчиком в таблице ниже (далее — Дополнительные работы). Состав и критерий приёмки каждой работы указаны в таблице."));

const w = [560, 4200, 2330, 700, 1100, W - 560 - 4200 - 2330 - 700 - 1100];
const head = ["✓", "Работа", "Критерий приёмки", "Срок, р. дн.", "Прайс", "Цена −30%"];
const rows = [new TableRow({ tableHeader: true, children: head.map((h, i) =>
  cell(h, w[i], { bold: true, fill: "F4EDE6", size: 16, color: GREY, align: i >= 3 ? (i === 3 ? C : R) : i === 0 ? C : undefined })) })];
EXTRAS.forEach(([title, what, accept, hours, days], i) => {
  rows.push(new TableRow({ cantSplit: true, children: [
    cell(new Paragraph({ alignment: C, children: [new CheckBox({ checked: false, checkedState: { value: "2612" }, uncheckedState: { value: "2610" } })] }), w[0], { vcenter: true }),
    cell([[run(`${i + 1}. ${title}. `, { bold: true, size: 18 }), run(what, { size: 18 })]], w[1]),
    cell(accept, w[2], { color: "5B544A" }),
    cell(String(days), w[3], { align: C }),
    cell(money(hours * HOUR), w[4], { align: R, strike: true, color: GREY }),
    cell(money(off(hours * HOUR)), w[5], { align: R, bold: true }),
  ] }));
});
const all = EXTRAS.reduce((a, x) => a + off(x[3] * HOUR), 0);
const allList = EXTRAS.reduce((a, x) => a + x[3] * HOUR, 0);
rows.push(new TableRow({ children: [
  cell("", w[0]), cell("Если отмечены все работы", w[1], { bold: true }), cell("", w[2]),
  cell(String(EXTRAS.reduce((a, x) => a + x[4], 0)), w[3], { align: C, bold: true }),
  cell(money(allList), w[4], { align: R, strike: true, color: GREY }), cell(money(all), w[5], { align: R, bold: true }),
] }));
body.push(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: w, rows }));
body.push(para([run(`Цена по прайсу — часы работы команды по стандартной ставке $${HOUR}; для Заказчика действует скидка 30% по п. 2.2 Договора. ` +
  "Срок каждой работы — в рабочих днях; отмеченные работы выполняются последовательно в указанном в таблице порядке, если Стороны не договорились иначе.",
  { size: 16, color: GREY })], { before: 120 }));

body.push(heading("2. Цена и порядок расчётов"));
body.push(clause("2.1", "Цена Дополнительных работ равна сумме цен отмеченных работ (колонка «Цена −30%») и составляет: $ ____________ (________________________________________) долларов США."));
body.push(clause("2.2", "Оплата: аванс 50% цены Дополнительных работ — в течение 3 рабочих дней с даты подписания настоящего Соглашения; остаток 50% — в течение 5 рабочих дней с даты приёмки последней из отмеченных работ."));
body.push(clause("2.3", "Оплата производится в национальной валюте Республики Узбекистан по курсу Центрального банка Республики Узбекистан на дату выставления счёта. Исполнитель не является плательщиком НДС; цены НДС не облагаются."));

body.push(heading("3. Сроки"));
body.push(clause("3.1", "Выполнение Дополнительных работ начинается после поступления аванса и предоставления Заказчиком материалов и доступов, необходимых для отмеченных работ (для режима Multilevel — задания и критерии оценки; для оплаты кошельками — доступы к кабинетам Payme и Click или ответ ATMOS)."));
body.push(clause("3.2", "Дата начала: «____» ______________ 2026 г. Если Договор в части Работ ещё исполняется, Дополнительные работы начинаются после приёмки Этапа 2 Договора, если Стороны письменно не договорились иначе."));

body.push(heading("4. Прочие условия"));
body.push(clause("4.1", "Приёмка, гарантия, ответственность, конфиденциальность, порядок разрешения споров и иные условия, не изменённые настоящим Соглашением, применяются к Дополнительным работам в редакции Договора."));
body.push(clause("4.2", "Работы, не отмеченные Заказчиком в таблице п. 1.1, не заказаны. Их можно заказать позже следующим дополнительным соглашением; скидка 30% на них сохраняется."));
body.push(clause("4.3", "Настоящее Соглашение является неотъемлемой частью Договора, вступает в силу с даты подписания и составлено в двух экземплярах, по одному для каждой Стороны."));

// Подписи
const half = W / 2;
const sig = (title, lines) => cell([
  para([run(title.toUpperCase(), { bold: true, size: 16, color: GREY })], { after: 80, align: AlignmentType.LEFT }),
  ...lines.map((t, i) => para([run(t, { size: 18, bold: i === 0 })], { after: 40, align: AlignmentType.LEFT })),
  para([run("")], { after: 300 }),
  para([run("____________________ / ______________ /", { size: 18 })], { after: 0, align: AlignmentType.LEFT }),
], half, { noBorders: true });
body.push(heading("5. Подписи Сторон"));
body.push(new Table({ width: { size: W, type: WidthType.DXA }, columnWidths: [half, half], rows: [new TableRow({ cantSplit: true, children: [
  sig("Исполнитель", ["ИП MAKSIMOV EGOR ANDREEVICH", "ПИНФЛ: 32303946570039", "г. Ташкент, улица Шота Руставели, 138"]),
  sig("Заказчик", ["ИП JUKOV ANDREY ALEKSANDROVICH", "Рег. № 7693922 от 17.04.2026", "info@allclasses.live"]),
] })] }));

const doc = new Document({
  creator: "DevUz Studio",
  title: `Дополнительное соглашение № 1 к Договору № ${CONTRACT} — AllClasses`,
  styles: { default: { document: { run: { font: FONT, size: 20 } } } },
  sections: [{
    properties: { page: { size: { width: PAGE_W, height: 16838 }, margin: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN } } },
    headers: { default: new Header({ children: [para([run(`Доп. соглашение № 1 к Договору № ${CONTRACT} · DevUz Studio — AllClasses`, { size: 14, color: GREY })], { align: R, after: 0 })] }) },
    footers: { default: new Footer({ children: [new Paragraph({ alignment: C, children: [
      new TextRun({ children: ["Стр. ", PageNumber.CURRENT, " из ", PageNumber.TOTAL_PAGES], font: FONT, size: 14, color: GREY })] })] }) },
    children: body,
  }],
});

writeFileSync(OUT, await Packer.toBuffer(doc));
console.log("DOCX:", OUT, "— все работы:", money(allList), "→", money(all));
