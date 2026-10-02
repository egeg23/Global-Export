/**
 * Tailwind, затем оттенки площадки (lib/showcase/tone.mjs): цвета переменных
 * сдвигаются уже в собранных стилях, поэтому шаг идёт вторым.
 */
import { fileURLToPath } from "node:url";

// Путь — полный: Turbopack ищет плагины не от корня проекта.
const tone = fileURLToPath(new URL("./lib/showcase/tone.mjs", import.meta.url));

const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    [tone]: {},
  },
};

export default config;
