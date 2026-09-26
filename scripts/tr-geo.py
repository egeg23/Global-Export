#!/usr/bin/env python3
"""
Карта присутствия Tranio: настоящие контуры стран в кадре региона.

Прежняя карта была всем миром в точку — красиво, но бесполезно: Тихий
океан и обе Америки занимали половину кадра, а Кипр, на котором у
компании сделки, был меньше точки. И подсветить страну на точечном поле
нельзя: точки не знают, в какой они стране.

Поэтому здесь два слоя. Страны, где компания работает, — настоящие
полигоны из Natural Earth (пакет world-atlas, 1:50 млн): их можно
залить, обвести и зажечь по наведению. Вся остальная суша в кадре —
точечное поле, как было: фон, а не предмет разговора.

Кадр — не весь мир, а прямоугольник, в который попадают все офисы и все
направления каталога, кроме США. Компания сама пишет «10 офисов в
Евразии», и Евразия с северной Африкой — это и есть её карта.

Проекция равнопромежуточная со стандартной параллелью 30°: долгота
сжата на её косинус, иначе Европа расползается вширь.

Набор — обычный пакет npm, в зависимости проекта он не нужен: скрипт
запускают руками, а в репозиторий едет готовый content/tr/geo.ts.

    npm pack world-atlas@2.0.2 && tar xzf world-atlas-2.0.2.tgz
    python3 scripts/tr-geo.py package content/tr/geo.ts
"""

from __future__ import annotations

import json
import sys
from math import cos, radians
from pathlib import Path

from PIL import Image, ImageDraw

sys.setrecursionlimit(20000)

# --- кадр ------------------------------------------------------------

LON0, LON1 = -12.0, 120.0
LAT0, LAT1 = -12.0, 60.0
PARALLEL = 30.0

# Единиц на градус долготы и широты. Долгота сжата на косинус параллели.
KX = 10.0 * cos(radians(PARALLEL))
KY = 10.0

VIEW_W = round((LON1 - LON0) * KX, 1)
VIEW_H = round((LAT1 - LAT0) * KY, 1)

# --- точечный фон ----------------------------------------------------

STEP = 1.5  # градусов на точку
DOT = 3.4  # радиус точки в единицах кадра, он же половина толщины штриха

# --- страны ----------------------------------------------------------

# id в макете → имя в Natural Earth. США в кадр не входят: офиса там нет,
# а ради одного направления каталога разворачивать карту на две Америки
# значит снова показать половину пустого океана.
COUNTRIES = {
    "russia": "Russia",
    "kazakhstan": "Kazakhstan",
    "uae": "United Arab Emirates",
    "cyprus": "Cyprus",
    "greece": "Greece",
    "spain": "Spain",
    "thailand": "Thailand",
    "turkey": "Turkey",
    "portugal": "Portugal",
    "germany": "Germany",
    "italy": "Italy",
    "france": "France",
    "montenegro": "Montenegro",
    "oman": "Oman",
    "indonesia": "Indonesia",
    "uk": "United Kingdom",
    "austria": "Austria",
    "switzerland": "Switzerland",
    "hungary": "Hungary",
    "croatia": "Croatia",
    "czechia": "Czechia",
    "israel": "Israel",
}

# Кольцо меньше этой площади в единицах кадра выбрасывается: это остров
# в полпикселя, который только раздувает путь.
MIN_AREA = 6.0

# Допуск упрощения контура в единицах кадра. Кадр шириной 1143 единицы
# на экране редко шире полутора тысяч точек, поэтому полторы единицы —
# это примерно один экранный пиксель.
EPS = 1.5


# --- топология -------------------------------------------------------


def decode_arcs(topo: dict) -> list[list[tuple[float, float]]]:
    """Дельта-кодированные целые → градусы."""
    sx, sy = topo["transform"]["scale"]
    tx, ty = topo["transform"]["translate"]
    out = []
    for arc in topo["arcs"]:
        x = y = 0
        line = []
        for dx, dy in arc:
            x += dx
            y += dy
            line.append((x * sx + tx, y * sy + ty))
        out.append(line)
    return out


def ring(arcs: list, indexes: list[int]) -> list[tuple[float, float]]:
    """Кольцо из дуг: отрицательный индекс — дуга задом наперёд."""
    points: list[tuple[float, float]] = []
    for i in indexes:
        line = arcs[~i][::-1] if i < 0 else arcs[i]
        points.extend(line if not points else line[1:])
    return points


def polygons(geom: dict, arcs: list) -> list[list[list[tuple[float, float]]]]:
    """Геометрия → список полигонов, полигон → внешнее кольцо и дырки."""
    if geom["type"] == "Polygon":
        return [[ring(arcs, part) for part in geom["arcs"]]]
    if geom["type"] == "MultiPolygon":
        return [[ring(arcs, part) for part in poly] for poly in geom["arcs"]]
    if geom["type"] == "GeometryCollection":
        out = []
        for part in geom["geometries"]:
            out.extend(polygons(part, arcs))
        return out
    return []


# --- геометрия -------------------------------------------------------


def clip(points: list[tuple[float, float]], edge: str, value: float) -> list[tuple[float, float]]:
    """Отсечение кольца одной стороной кадра (Сазерленд — Ходжман)."""
    inside = {
        "left": lambda p: p[0] >= value,
        "right": lambda p: p[0] <= value,
        "bottom": lambda p: p[1] >= value,
        "top": lambda p: p[1] <= value,
    }[edge]
    out: list[tuple[float, float]] = []
    if not points:
        return out
    prev = points[-1]
    for point in points:
        if inside(point):
            if not inside(prev):
                out.append(cross(prev, point, edge, value))
            out.append(point)
        elif inside(prev):
            out.append(cross(prev, point, edge, value))
        prev = point
    return out


def cross(a: tuple[float, float], b: tuple[float, float], edge: str, value: float):
    if edge in ("left", "right"):
        t = (value - a[0]) / (b[0] - a[0])
        return (value, a[1] + t * (b[1] - a[1]))
    t = (value - a[1]) / (b[1] - a[1])
    return (a[0] + t * (b[0] - a[0]), value)


def frame(points: list[tuple[float, float]]) -> list[tuple[float, float]]:
    for edge, value in (("left", LON0), ("right", LON1), ("bottom", LAT0), ("top", LAT1)):
        points = clip(points, edge, value)
        if not points:
            return []
    return points


def project(lat: float, lon: float) -> tuple[float, float]:
    return ((lon - LON0) * KX, (LAT1 - lat) * KY)


def area(points: list[tuple[float, float]]) -> float:
    s = 0.0
    for i, (x, y) in enumerate(points):
        x2, y2 = points[(i + 1) % len(points)]
        s += x * y2 - x2 * y
    return abs(s) / 2


def thin(points: list[tuple[float, float]], eps: float) -> list[tuple[float, float]]:
    """Дуглас — Пекер: выбросить точки, которые не меняют силуэт.

    Без него контур России из набора 1:50 млн занимает больше ста
    килобайт — на экране эта точность не видна, а страницу тащит.
    """
    if len(points) < 3:
        return points
    ax, ay = points[0]
    bx, by = points[-1]
    dx, dy = bx - ax, by - ay
    span = (dx * dx + dy * dy) ** 0.5
    far, worst = 0, 0.0
    for i in range(1, len(points) - 1):
        x, y = points[i]
        if span < 1e-9:
            gap = ((x - ax) ** 2 + (y - ay) ** 2) ** 0.5
        else:
            gap = abs(dy * x - dx * y + bx * ay - by * ax) / span
        if gap > worst:
            far, worst = i, gap
    if worst <= eps:
        return [points[0], points[-1]]
    return thin(points[: far + 1], eps)[:-1] + thin(points[far:], eps)


def path_of(rings: list[list[tuple[float, float]]]) -> str:
    parts = []
    for points in rings:
        d = [f"M{points[0][0]:.1f} {points[0][1]:.1f}"]
        last = points[0]
        for x, y in points[1:]:
            if abs(x - last[0]) < 0.05 and abs(y - last[1]) < 0.05:
                continue
            d.append(f"L{x:.1f} {y:.1f}")
            last = (x, y)
        if len(d) < 4:
            continue
        parts.append("".join(d) + "Z")
    return "".join(parts)


def shape(geom: dict, arcs: list) -> tuple[str, list[list[tuple[float, float]]]]:
    """Путь страны в кадре и её кольца в единицах кадра — для маски."""
    kept: list[list[tuple[float, float]]] = []
    for poly in polygons(geom, arcs):
        for points in poly:
            cut = frame(points)
            if len(cut) < 3:
                continue
            flat = [project(lat, lon) for lon, lat in cut]
            size = area(flat)
            if size < MIN_AREA:
                continue
            # Допуск по размеру кольца: один и тот же на Россию и на Кипр
            # оставляет от Кипра пятиугольник. Крупному контуру полторы
            # единицы незаметны, мелкому — это весь остров.
            eps = min(EPS, max(0.25, size**0.5 / 14))
            kept.append(thin(flat, eps))
    return path_of(kept), kept


# --- точечный фон ----------------------------------------------------


def backdrop(land: list[list[tuple[float, float]]], ours: list[list[tuple[float, float]]]) -> str:
    """Точки по всей суше кадра, кроме стран, которые рисуются заливкой."""
    cols = int((LON1 - LON0) / STEP)
    rows = int((LAT1 - LAT0) / STEP)
    # Растр в четыре раза мельче сетки: так точка ставится по тому, есть
    # ли земля в самой ячейке, а не по одному её углу.
    fine = 4
    size = (cols * fine, rows * fine)

    def draw(rings: list[list[tuple[float, float]]]) -> Image.Image:
        im = Image.new("1", size, 0)
        pen = ImageDraw.Draw(im)
        for points in rings:
            pen.polygon(
                [(x / VIEW_W * size[0], y / VIEW_H * size[1]) for x, y in points],
                fill=1,
            )
        return im

    land_px = draw(land).load()
    ours_px = draw(ours).load()

    dots = []
    for row in range(rows):
        for col in range(cols):
            hit = False
            for dy in range(fine):
                for dx in range(fine):
                    x, y = col * fine + dx, row * fine + dy
                    if land_px[x, y] and not ours_px[x, y]:
                        hit = True
                        break
                if hit:
                    break
            if not hit:
                continue
            cx = (col + 0.5) / cols * VIEW_W
            cy = (row + 0.5) / rows * VIEW_H
            # Точка — подсегмент нулевой длины с круглым торцом: «M x y h0».
            # Кружок дугами занимал бы втрое больше места, а рисуется так же.
            dots.append(f"M{cx:.0f} {cy:.0f}h0")
    return "".join(dots)


# --- сборка ----------------------------------------------------------


def main() -> None:
    src = Path(sys.argv[1])
    out = Path(sys.argv[2])

    topo = json.loads((src / "countries-50m.json").read_text())
    arcs = decode_arcs(topo)
    by_name = {g["properties"]["name"]: g for g in topo["objects"]["countries"]["geometries"]}

    shapes: dict[str, str] = {}
    ours: list[list[tuple[float, float]]] = []
    for key, name in COUNTRIES.items():
        geom = by_name.get(name)
        if geom is None:
            sys.exit(f"нет страны {name!r} в наборе")
        d, rings = shape(geom, arcs)
        if not d:
            sys.exit(f"страна {name!r} не попала в кадр")
        shapes[key] = d
        ours.extend(rings)

    land_topo = json.loads((src / "land-50m.json").read_text())
    land_arcs = decode_arcs(land_topo)
    land_rings: list[list[tuple[float, float]]] = []
    for poly in polygons(land_topo["objects"]["land"], land_arcs):
        for points in poly:
            cut = frame(points)
            if len(cut) < 3:
                continue
            land_rings.append([project(lat, lon) for lon, lat in cut])

    dots = backdrop(land_rings, ours)

    body = [
        "/**",
        " * Кадр присутствия Tranio: контуры стран и точечный фон.",
        " *",
        " * Собрано скриптом scripts/tr-geo.py из набора world-atlas",
        " * (Natural Earth, 1:50 млн) — руками эти пути не пишут.",
        " *",
        " * Кадр: долгота от %.0f до %.0f, широта от %.0f до %.0f." % (LON0, LON1, LAT0, LAT1),
        " * Проекция равнопромежуточная, стандартная параллель %.0f°." % PARALLEL,
        " */",
        "",
        "export const VIEW_W = %s;" % VIEW_W,
        "export const VIEW_H = %s;" % VIEW_H,
        "",
        "/** Точка на кадре по широте и долготе. */",
        "export function project(lat: number, lon: number): { x: number; y: number } {",
        "  return {",
        "    x: (lon - %s) * %s," % (LON0, round(KX, 6)),
        "    y: (%s - lat) * %s," % (LAT1, KY),
        "  };",
        "}",
        "",
        "/** Радиус точки фона в единицах кадра. */",
        "export const DOT = %s;" % DOT,
        "",
        "/** Вся прочая суша кадра — точками, как фон. */",
        "export const BACKDROP =",
        '  "%s";' % dots,
        "",
        "/** Контуры стран, где компания работает. */",
        "export const SHAPES: Record<string, string> = {",
    ]
    for key, d in shapes.items():
        body.append('  %s:\n    "%s",' % (key, d))
    body.append("};")
    body.append("")

    out.write_text("\n".join(body))
    size = out.stat().st_size
    print(f"{out}: {size // 1024} КБ, стран {len(shapes)}, точек фона {dots.count('M')}")


if __name__ == "__main__":
    main()
