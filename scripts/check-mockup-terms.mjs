/**
 * Перед сборкой: у каждого проекта витрины есть строка с условиями макета, а
 * оттенки площадки включены. Нет — сборка не идёт, и площадка остаётся на
 * прежней версии.
 *
 * Решение владельца, 03.10.2026: ссылка на условия использования макетов —
 * на каждом макете, сделанном и будущем. Новый проект — новая папка в app/ со
 * своим layout.tsx; без <MockupTerms /> в нём он не выйдет.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";

/** Не макеты заказчиков: панель и наша собственная презентация. */
const NOT_MOCKUPS = new Set(["admin", "api", "present"]);

const problems = [];
for (const entry of readdirSync("app", { withFileTypes: true })) {
  if (!entry.isDirectory() || NOT_MOCKUPS.has(entry.name)) continue;
  const layout = `app/${entry.name}/layout.tsx`;
  if (!existsSync(layout)) continue;
  if (!/<MockupTerms\b/.test(readFileSync(layout, "utf8"))) {
    problems.push(`${layout}: нет <MockupTerms /> — строки с условиями макета`);
  }
}
if (!/lib\/showcase\/tone\.mjs/.test(readFileSync("postcss.config.mjs", "utf8"))) {
  problems.push("postcss.config.mjs: выключены оттенки площадки (lib/showcase/tone.mjs)");
}

if (problems.length) {
  console.error(`Макеты без защиты:\n${problems.map((p) => `  • ${p}`).join("\n")}`);
  process.exit(1);
}
