#!/usr/bin/env python3
"""
Вырезает дом из рендера Golden House: небо в прозрачность, тротуар — в дымку.

Почему не «волшебная палочка». Небо на рендере — не один цвет, а градиент от
синего вверху до почти белого у горизонта, и заливка по цвету либо не достаёт
до горизонта, либо заодно съедает белую штукатурку фасада.

Здесь небо снимается сверху вниз по столбцам: в каждом столбце от верхнего
края идёт спуск, пока цвет меняется плавно — так спуск сам следует за
градиентом, — и останавливается на первом резком переходе, то есть на кромке
дома. Окна и стекло при этом остаются домом: до них спуск уже остановлен.

    python3 scripts/gh-cutout.py рендер.jpg дом.png --crop 236,0,1704,1280

Низ не режется по линии: рендер стоит на тротуаре с деревьями и машинами, а
ровный срез читается как ошибка. Вместо среза — растворение: нижняя четверть
уходит в прозрачность, и дом будто стоит в дымке.
"""

from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

# Насколько цвет может уйти от накопленного среднего, оставаясь небом.
TOLERANCE = 30
# Небо всегда светлее фасадной тени: ниже этого спуск прекращается.
FLOOR = 120


def skyline(rgb: np.ndarray, tolerance: int, floor: int) -> np.ndarray:
    """Маска неба: True выше кромки дома в каждом столбце."""
    height, width, _ = rgb.shape
    value = rgb.astype(np.float32)
    mask = np.zeros((height, width), dtype=bool)

    # Среднее по уже пройденному небу столбца — оно и ведёт за градиентом.
    running = value[0].copy()
    alive = np.ones(width, dtype=bool)
    mask[0] = True
    for y in range(1, height):
        delta = np.abs(value[y] - running).max(axis=1)
        bright = value[y].mean(axis=1) >= floor
        alive &= (delta <= tolerance) & bright
        if not alive.any():
            break
        mask[y] = alive
        # Инерция: одиночный пиксель не должен уводить модель за собой.
        running[alive] = running[alive] * 0.82 + value[y][alive] * 0.18
    return mask


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("src", type=Path)
    parser.add_argument("dst", type=Path)
    parser.add_argument("--crop", help="left,top,right,bottom — рамка главного объёма")
    parser.add_argument("--fade", type=float, default=0.26, help="доля высоты на растворение низа")
    parser.add_argument("--tolerance", type=int, default=TOLERANCE)
    parser.add_argument("--floor", type=int, default=FLOOR)
    parser.add_argument("--width", type=int, default=1600, help="ширина готового файла")
    args = parser.parse_args()

    image = Image.open(args.src).convert("RGB")
    if args.crop:
        image = image.crop(tuple(int(v) for v in args.crop.split(",")))

    sky = skyline(np.asarray(image), args.tolerance, args.floor)
    alpha = Image.fromarray(np.where(sky, 0, 255).astype(np.uint8), "L")
    # Кромка получается ступенькой в пиксель: лёгкое размытие убирает лестницу,
    # не съедая перила балконов.
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.7))

    out = image.convert("RGBA")
    out.putalpha(alpha)

    height = out.height
    fade = int(height * args.fade)
    ramp = np.ones((height, out.width), dtype=np.float32)
    if fade:
        ramp[height - fade :, :] = np.linspace(1.0, 0.0, fade, dtype=np.float32)[:, None] ** 1.5
    band = (np.asarray(out.getchannel("A"), dtype=np.float32) * ramp).astype(np.uint8)
    out.putalpha(Image.fromarray(band, "L"))

    box = out.getbbox()
    if box:
        out = out.crop(box)
    if args.width and out.width > args.width:
        out = out.resize((args.width, round(out.height * args.width / out.width)), Image.LANCZOS)

    args.dst.parent.mkdir(parents=True, exist_ok=True)
    out.save(args.dst, optimize=True)
    print(f"{args.dst}: {out.width}x{out.height}, {args.dst.stat().st_size // 1024} КБ")


if __name__ == "__main__":
    main()
