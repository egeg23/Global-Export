#!/usr/bin/env python3
"""
Земля, повёрнутая Узбекистаном к зрителю.

Снимков планеты, снятых точно над Ташкентом, в открытом доступе нет: Apollo 17
смотрел на Африку, у остальных кадров свой ракурс. Зато есть мозаика NASA Blue
Marble — настоящая съёмка со спутника, разложенная в прямоугольную проекцию.
Отсюда глобус и собирается: для каждой точки диска считается, куда она
приходится на шаре, шар поворачивается нужной стороной, и цвет берётся из
мозаики. Съёмка остаётся настоящей, меняется только точка съёмки.

    python3 scripts/gh-globe.py bm-1920.jpg globe.png --lat 41.31 --lon 69.24

Терминатора нет намеренно: полностью освещённый шар читается как планета, а
не как фаза луны, и в заставке работает лучше.
"""

from __future__ import annotations

import argparse
import math
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


def globe(texture: np.ndarray, size: int, lat0: float, lon0: float, tilt: float) -> Image.Image:
    """Ортографическая проекция мозаики на диск размером size."""
    th, tw, _ = texture.shape
    radius = size / 2

    # Координаты пикселей диска в долях радиуса.
    axis = (np.arange(size) + 0.5 - radius) / radius
    x = axis[None, :].repeat(size, axis=0)
    # Ось экрана смотрит вниз, ось глобуса — на север, поэтому знак меняется:
    # без этого планета собирается вверх ногами.
    y = -axis[:, None].repeat(size, axis=1)
    inside = x * x + y * y <= 1.0
    z = np.sqrt(np.clip(1.0 - x * x - y * y, 0.0, 1.0))

    # Наклон оси: планета в кадре стоит не строго вертикально.
    a = math.radians(tilt)
    xr = x * math.cos(a) - y * math.sin(a)
    yr = x * math.sin(a) + y * math.cos(a)

    # Поворот шара: сначала широта, потом долгота.
    p = math.radians(lat0)
    ey = yr * math.cos(p) + z * math.sin(p)
    ez = -yr * math.sin(p) + z * math.cos(p)

    lat = np.degrees(np.arcsin(np.clip(ey, -1.0, 1.0)))
    lon = np.degrees(np.arctan2(xr, ez)) + lon0
    lon = (lon + 180.0) % 360.0 - 180.0

    u = np.clip(((lon + 180.0) / 360.0 * tw).astype(np.int32), 0, tw - 1)
    v = np.clip(((90.0 - lat) / 180.0 * th).astype(np.int32), 0, th - 1)
    rgb = texture[v, u]

    # Край шара уходит в тень: без этого диск выглядит наклейкой, а не шаром.
    limb = np.clip(z, 0.0, 1.0) ** 0.42
    rgb = (rgb.astype(np.float32) * (0.32 + 0.68 * limb)[:, :, None]).astype(np.uint8)

    alpha = np.where(inside, 255, 0).astype(np.uint8)
    out = Image.fromarray(np.dstack([rgb, alpha]), "RGBA")
    # Сглаживание кромки диска: ступенька по окружности заметнее всего.
    edge = Image.fromarray(alpha, "L").filter(ImageFilter.GaussianBlur(0.9))
    out.putalpha(edge)
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("texture", type=Path, help="мозаика в прямоугольной проекции")
    parser.add_argument("dst", type=Path)
    parser.add_argument("--lat", type=float, default=41.31, help="широта точки в центре диска")
    parser.add_argument("--lon", type=float, default=69.24, help="долгота точки в центре диска")
    parser.add_argument("--tilt", type=float, default=-14.0, help="наклон оси в кадре, градусы")
    parser.add_argument("--size", type=int, default=1400)
    args = parser.parse_args()

    texture = np.asarray(Image.open(args.texture).convert("RGB"))
    disc = globe(texture, args.size, args.lat, args.lon, args.tilt)
    # Мозаика меньше диска, поэтому картинка тянется: лёгкая нерезкая маска
    # возвращает материкам край, не выдавая пикселей.
    disc = disc.filter(ImageFilter.UnsharpMask(radius=2, percent=55, threshold=2))

    args.dst.parent.mkdir(parents=True, exist_ok=True)
    disc.save(args.dst, optimize=True)
    print(f"{args.dst}: {disc.width}x{disc.height}, {args.dst.stat().st_size // 1024} КБ")


if __name__ == "__main__":
    main()
