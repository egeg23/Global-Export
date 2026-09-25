#!/usr/bin/env python3
"""
Точечная карта мира для карты офисов Tranio.

Фотографию планеты в меморандум не положишь — она спорит с набором и
перетягивает внимание на себя. Зато география должна быть настоящей:
десять офисов на выдуманных берегах выглядят несерьёзно.

Поэтому берём ту же мозаику NASA Blue Marble, что и глобус Golden House,
но не как картинку, а как источник маски суши: каждая ячейка сетки
становится квадратной точкой, если под ней земля. Получается абстракция
с верной береговой линией — то, что рисуют на биржевых терминалах.

Вывод — данные пути для одного <path>, чтобы вся карта красилась
currentColor и меняла цвет вместе с палитрой.

    python3 scripts/tr-worldmap.py bm-2560.jpg content/tr/worldmap.ts
"""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
from PIL import Image

# Сетка: два к одному, как сама прямоугольная проекция.
COLS, ROWS = 120, 60
# Полюса режем: Антарктида и Арктика на карте офисов только мешают.
TOP, BOTTOM = 0.10, 0.86
# Сетку множим на десять, чтобы координаты пути были целыми: целые
# числа короче дробных, и весь путь укладывается в тридцать килобайт.
SCALE = 10
DOT = 6  # сторона точки в этих единицах


def land_mask(path: Path) -> np.ndarray:
    im = Image.open(path).convert("RGB")
    im = im.resize((COLS, ROWS), Image.BOX)
    a = np.asarray(im).astype(np.int16)
    r, g, b = a[:, :, 0], a[:, :, 1], a[:, :, 2]
    bright = (r + g + b) / 3
    # Океан мозаики — синий и тёмный: синего больше красного. Суша либо
    # краснее синего (песок, почва, зелень), либо просто светлая (лёд).
    return (r > b + 6) | (bright > 145)


def main() -> None:
    src, dst = Path(sys.argv[1]), Path(sys.argv[2])
    mask = land_mask(src)

    parts: list[str] = []
    cells = 0
    for row in range(ROWS):
        if not (TOP * ROWS <= row < BOTTOM * ROWS):
            continue
        for col in range(COLS):
            if not mask[row, col]:
                continue
            cells += 1
            x = col * SCALE + (SCALE - DOT) // 2
            y = row * SCALE + (SCALE - DOT) // 2
            parts.append(f"M{x} {y}h{DOT}v{DOT}h-{DOT}z")

    path = "".join(parts)
    out = f'''/**
 * Точечная карта мира: маска суши из мозаики NASA Blue Marble.
 *
 * Собрана скриптом scripts/tr-worldmap.py — руками этот путь не пишут.
 * Координаты в сетке {COLS}×{ROWS}, она же viewBox: колонка — доля
 * долготы, строка — доля широты, поэтому офис ставится на место по
 * обычному пересчёту из градусов.
 *
 * Полюса обрезаны: на карте офисов Антарктида только занимает место.
 */

export const MAP_COLS = {COLS * SCALE};
export const MAP_ROWS = {ROWS * SCALE};

/** Куда попадает точка с такими координатами в сетке карты. */
export function project(lat: number, lon: number): {{ x: number; y: number }} {{
  return {{
    x: ((lon + 180) / 360) * MAP_COLS,
    y: ((90 - lat) / 180) * MAP_ROWS,
  }};
}}

/** Одна строка пути на всю сушу: {cells} точек. */
export const WORLD_PATH =
  "{path}";
'''
    dst.write_text(out, encoding="utf-8")
    print(f"точек суши: {cells}, размер файла: {len(out) // 1024} КБ")

    # Предпросмотр: убедиться глазами, что берега на месте.
    if len(sys.argv) > 3:
        prev = Image.new("RGB", (COLS * 8, ROWS * 8), "#0c1017")
        px = prev.load()
        for row in range(ROWS):
            if not (TOP * ROWS <= row < BOTTOM * ROWS):
                continue
            for col in range(COLS):
                if not mask[row, col]:
                    continue
                for dy in range(5):
                    for dx in range(5):
                        px[col * 8 + dx + 1, row * 8 + dy + 1] = (127, 178, 234)
        prev.save(sys.argv[3])
        print("предпросмотр:", sys.argv[3])


if __name__ == "__main__":
    main()
