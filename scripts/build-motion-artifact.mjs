// Turns public/motion.html into self-contained copies with the images inlined
// as data URIs. Emits two shapes:
//
//   <dir>/motion-standalone.html — a complete document, sendable as one file
//   <dir>/motion-fragment.html   — the same page without the html/head/body
//                                  shell, for hosts that supply their own
//
//   node scripts/build-motion-artifact.mjs [output directory]
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const source = "public/motion.html";
const dir = process.argv[2] ?? "/tmp";

let html = readFileSync(source, "utf8");

const inlined = new Map();
html = html.replace(/BASE \+ (\w+)/g, "BASE + $1"); // untouched; paths are built at runtime

// The script builds URLs as BASE + name + ".webp", so the lookup table has to be
// injected rather than the literal strings replaced.
const names = [
  ...new Set(
    [...html.matchAll(/"([a-z-]+)",\s*family/g)].map((m) => m[1]),
  ),
];
const baskets = [...html.matchAll(/basket: "(basket-[a-z]+)"/g)].map((m) => m[1]);

for (const name of [...names, ...baskets]) {
  const file = `public/images/motion/${name}.webp`;
  const data = readFileSync(file).toString("base64");
  inlined.set(name, `data:image/webp;base64,${data}`);
}

const table =
  "  var INLINE = " + JSON.stringify(Object.fromEntries(inlined)) + ";\n";

// Swap the URL builder for a lookup in the inlined table.
html = html.replace(
  '  var BASE = "/images/motion/";\n',
  table + '  var BASE = "";\n  function asset(n) { return INLINE[n]; }\n',
);
html = html.replace(/BASE \+ g\.basket \+ "\.webp"/g, "asset(g.basket)");
html = html.replace(/BASE \+ "walnut\.webp"/g, 'asset("walnut")');
html = html.replace(/BASE \+ item\.kind\.file \+ "\.webp"/g, "asset(item.kind.file)");

const standalone = join(dir, "motion-standalone.html");
writeFileSync(standalone, html);

// The fragment keeps <title>, the font link, the styles and the body content,
// and drops the document shell the host provides.
const head = html.slice(html.indexOf("<title>"), html.indexOf("</head>"));
const keep = head
  .split("\n")
  .filter((line) => !line.includes('name="viewport"') && !line.includes("charset"))
  .join("\n");
const body = html.slice(html.indexOf("<body>") + "<body>".length, html.indexOf("</body>"));

const fragment = join(dir, "motion-fragment.html");
writeFileSync(fragment, keep.trimEnd() + "\n" + body);

for (const [label, file] of [["standalone", standalone], ["fragment", fragment]]) {
  const size = readFileSync(file).length / 1024;
  console.log(`${label}: ${inlined.size} images inlined, ${size.toFixed(0)} KB`);
}
