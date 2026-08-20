// One-off helper: loads the content modules without a TypeScript toolchain.
// They are plain data — `import type` lines and the `: Type` annotation after
// the exported name are the only TypeScript in them, so stripping those two
// patterns leaves valid JavaScript.
import { readFileSync } from "node:fs";

export function loadModule(path) {
  const source = readFileSync(path, "utf8");
  const stripped = source
    .replace(/^import type .*?;$/gm, "")
    .replace(/^import \{[^}]*\} from .*?;$/gm, "")
    .replace(/export const (\w+)\s*:\s*[^=]+=/g, "export const $1 =")
    .replace(/export function [\s\S]*$/m, "");
  return stripped;
}

export async function evaluate(path) {
  const code = loadModule(path);
  const encoded = "data:text/javascript;base64," + Buffer.from(code).toString("base64");
  return import(encoded);
}
