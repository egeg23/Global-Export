// Печать КП в PDF: тот же Chromium, что у тестов витрины.
//
// Playwright у нас стоит глобально, а не в зависимостях проекта: печать
// документа — разовая задача, тащить браузер в сборку сайта незачем. Поэтому
// пакет ищется сначала как обычно, потом среди глобальных.
import { execSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "kp-mavera-etap-1.html");
const out = process.env.OUT ?? join(here, "KP-MAVERA-etap-1.pdf");

const { chromium } = await import("playwright").catch(async () => {
  const root = execSync("npm root -g").toString().trim();
  return import(pathToFileURL(join(root, "playwright", "index.mjs")).href);
});

const browser = await chromium.launch({ executablePath: process.env.CHROME ?? "/opt/pw-browsers/chromium" });
const page = await browser.newPage();
await page.goto(`file://${src}`, { waitUntil: "load" });
// Без этого первая страница печатается запасным шрифтом.
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.pdf({ path: out, format: "A4", printBackground: true, preferCSSPageSize: true });
console.log("PDF:", out);
await browser.close();
