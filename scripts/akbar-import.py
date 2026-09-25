#!/usr/bin/env python3
"""
Каталог Akbar Rich для прототипа — из их собственной базы.

У сайта akbar-rich.uz открытый GraphQL (api.akbar-rich.uz): категории,
подкатегории, модели дверей и их варианты — цвет, покрытие и отдельный рендер
на каждый. Отсюда берутся только публичные сущности каталога — то, что и так
видит любой посетитель их сайта. Заявки, пользователей и прочие служебные
разделы скрипт не трогает.

Что делает:
  1. Забирает категории с подкатегориями, модели и варианты.
  2. Отбирает модели для конструктора (у кого есть все три покрытия) и витрину
     каталога по подкатегориям.
  3. Для пустых разделов — а их у них больше половины — собирает по две
     позиции «для вида» из обложки раздела: сама обложка и её деталь. Такие
     позиции помечены `demo: true`, чтобы их было видно в коде и в разборе.
  4. Качает картинки и пережимает в webp под нужные размеры.

    python3 scripts/akbar-import.py

Результат: content/akbar/catalog.json и картинки в public/akbar/.
"""

import io
import json
import pathlib
import re
import subprocess
from collections import defaultdict

from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parent.parent
OUT_JSON = ROOT / "content/akbar/catalog.json"
IMG = ROOT / "public/akbar"
API = "https://api.akbar-rich.uz/graphql"

# Модели для конструктора: у каждой все три покрытия — эмаль, ясень, орех.
CONFIGURATOR = ["52", "11", "14", "130", "86", "88", "176", "85", "174", "173"]
PER_SUB = 8

MATERIAL = {
    "эмаль": "Эмаль",
    "Ясин": "Ясень",
    "Американский Орех": "Американский орех",
    "Oрех(коричневый)": "Орех",
}

# Название цвета в их базе → подпись и оттенок точки-образца.
COLOR = {
    "orex": ("Орех", "#6b3f26"),
    "белый": ("Белый", "#f4f1ea"),
    "yasin-gold-min": ("Ясень, лёгкое золото", "#e7dcc6"),
    "yasin-gold-max": ("Ясень, насыщенное золото", "#d9c29a"),
    "yasin-gold": ("Ясень с золотом", "#e3d4b4"),
    "Белый+Золотой": ("Белый с золотом", "#efe6d2"),
    "orex-gold": ("Орех с золотом", "#7a4a2a"),
    "orex-koren-gold": ("Орех-корень с золотом", "#83502c"),
    "Ясен белый золото": ("Ясень белый с золотом", "#ece3d0"),
    "Черный+золотой": ("Чёрный с золотом", "#1c1a18"),
    "Ясин": ("Ясень", "#e6ddcb"),
    "Ясен белый": ("Ясень белый", "#efeae0"),
    "Черный": ("Чёрный", "#1c1c1c"),
    "Ясен бежевый ": ("Ясень бежевый", "#dccab0"),
    "Ясен бежевый золото": ("Ясень бежевый с золотом", "#d6c19e"),
    "Зеленый+Золотой": ("Зелёный с золотом", "#2f4a3a"),
    "серый": ("Серый", "#8d8f92"),
    "темно-синий с золотым": ("Тёмно-синий с золотом", "#1e2b4a"),
    "Серый и золотой": ("Серый с золотом", "#8a8580"),
    "Золотой": ("Золотой", "#c9a45c"),
    "Бело-серый": ("Бело-серый", "#d7d6d2"),
    "синий": ("Синий", "#27406e"),
    "темно-зеленый": ("Тёмно-зелёный", "#27402f"),
    "темно-серый": ("Тёмно-серый", "#4a4b4e"),
    "yasin-grey": ("Ясень серый", "#b9b6b0"),
    "Yashil-Oq": ("Зелёный с белым", "#6f8f78"),
    "Малочный + Золото": ("Молочный с золотом", "#efe4cc"),
    "Ясень с золотом": ("Ясень с золотом", "#e3d4b4"),
    "бежевый": ("Бежевый", "#dcc9a8"),
    "ясин черный": ("Ясень чёрный", "#2a2826"),
    "желтый": ("Жёлтый", "#e8c77a"),
}

# Разделы, которые у них пустые, — две позиции «для вида» на каждый.
DEMO_NAMES = {
    "8": ["«Лайт»", "«Стандарт»"],
    "7": ["«Монолит 3000»", "«Колонна 3000»"],
    "10": ["«Версаль»", "«Корона»"],
    "11": ["«Решётка»", "«Арка»"],
    "16": ["«Ромб»", "«Классика»"],
    "17": ["«Кессон»", "«Соты»"],
    "21": ["«Филёнка»", "«Прованс»"],
    "22": ["«Конус 01»", "«Конус 02»"],
    "23": ["«Волна»", "«Шеврон»"],
    "24": ["«Рамка»", "«Бордюр»"],
    "25": ["«Филёнка Люкс»", "«Модерн»"],
    "26": ["«Эксклюзив 01»", "«Эксклюзив 02»"],
    "27": ["«Конус 01»", "«Конус 02»"],
    "28": ["«Премиум 01»", "«Премиум 02»"],
    "29": ["«Портал»", "«Арка-проём»"],
    "30": ["«Дорика»", "«Ионика»"],
}


def gql(query: str, variables: dict | None = None) -> dict:
    body = json.dumps({"query": query, "variables": variables or {}})
    out = subprocess.run(
        ["curl", "-s", "--max-time", "90", API, "-H", "Content-Type: application/json", "-d", body],
        capture_output=True, text=True, check=True,
    ).stdout
    data = json.loads(out)
    if "errors" in data:
        raise SystemExit(data["errors"][0]["message"])
    return data["data"]


def paged(name: str, fields: str) -> list:
    items, page = [], 1
    while True:
        d = gql(f"query($p:Int){{ {name}(pagination:{{page:$p, pageSize:100}}) {{ meta {{ pagination {{ pageCount }} }} data {{ id attributes {{ {fields} }} }} }} }}", {"p": page})[name]
        items += d["data"]
        if page >= d["meta"]["pagination"]["pageCount"]:
            return items
        page += 1


def clean_name(name: str) -> str:
    name = name.strip().replace("Xай-тек", "Hi-tech").replace("Xайтек", "Хайтек")
    name = re.sub(r'"([^"]+)"', r"«\1»", name)
    name = re.sub(r"№\s*", "№ ", name)
    return name


def fetch(url: str) -> Image.Image:
    # curl, а не urllib: он берёт системный прокси и его сертификаты как есть.
    raw = subprocess.run(["curl", "-sL", "--max-time", "120", url], capture_output=True, check=True).stdout
    return Image.open(io.BytesIO(raw)).convert("RGB")


cache: dict[str, Image.Image] = {}


def save(url: str, name: str, width: int, crop: tuple[float, float, float, float] | None = None) -> str:
    """Картинка по адресу → public/akbar/<name>.webp заданной ширины."""
    target = IMG / f"{name}.webp"
    if not target.exists():
        if url not in cache:
            cache[url] = fetch(url)
        im = cache[url]
        if crop:
            w, h = im.size
            im = im.crop((int(w * crop[0]), int(h * crop[1]), int(w * crop[2]), int(h * crop[3])))
        if im.width > width:
            im = im.resize((width, round(im.height * width / im.width)), Image.LANCZOS)
        target.parent.mkdir(parents=True, exist_ok=True)
        im.save(target, "WEBP", quality=80, method=6)
    return f"/akbar/{name}.webp"


def main() -> None:
    cats = gql("""{ categories(pagination:{limit:100}) { data { id attributes { name_ru name_uz
        default_image { data { attributes { url } } }
        subcategories(pagination:{limit:100}) { data { id attributes { name_ru name_uz group_label_ru
          default_image { data { attributes { url } } } } } } } } } }""")["categories"]["data"]
    products = paged("products", """name_ru description_ru is_popular is_new
        subcategories { data { id } } variants { data { id } }""")
    variants = paged("variants", """variantName
        colors { data { attributes { name_ru } } }
        materials { data { attributes { name_ru } } }
        primary_images { data { attributes { url } } }
        products { data { id } }""")

    by_product = defaultdict(list)
    for v in variants:
        for p in v["attributes"]["products"]["data"]:
            by_product[p["id"]].append(v)

    by_sub = defaultdict(list)
    for p in products:
        for s in p["attributes"]["subcategories"]["data"]:
            by_sub[s["id"]].append(p)

    def variant_json(v: dict, model_id: str, index: int, full: bool) -> dict | None:
        a = v["attributes"]
        imgs = a["primary_images"]["data"]
        if not imgs:
            return None
        url = imgs[0]["attributes"]["url"]
        color_raw = a["colors"]["data"][0]["attributes"]["name_ru"] if a["colors"]["data"] else ""
        label, swatch = COLOR.get(color_raw, (color_raw.strip().capitalize() or "Базовый", "#b8a88f"))
        mat_raw = a["materials"]["data"][0]["attributes"]["name_ru"] if a["materials"]["data"] else ""
        low = url.lower()
        glazing = "glass" if "_do_" in low or "-do-" in low else "solid" if "_dg_" in low or "-dg-" in low else None
        out = {
            "id": f"{model_id}-{index}",
            "color": label,
            "swatch": swatch,
            "material": MATERIAL.get(mat_raw, mat_raw or "—"),
            "glazing": glazing,
            "thumb": save(url, f"m/{model_id}-{index}-t", 420),
        }
        if full:
            out["image"] = save(url, f"m/{model_id}-{index}", 900)
        return out

    catalog = {"categories": [], "configurator": []}

    for cat in cats:
        ca = cat["attributes"]
        cat_json = {
            "id": cat["id"],
            "name": ca["name_ru"].strip(),
            "nameUz": ca["name_uz"].strip(),
            "cover": save(ca["default_image"]["data"]["attributes"]["url"], f"c/cat-{cat['id']}", 1200) if ca["default_image"]["data"] else None,
            "subcategories": [],
        }
        for sub in ca["subcategories"]["data"]:
            sa = sub["attributes"]
            cover_url = sa["default_image"]["data"]["attributes"]["url"] if sa["default_image"]["data"] else None
            sub_json = {
                "id": sub["id"],
                "name": sa["name_ru"].strip().replace("Xайтек", "Хайтек").replace("Паталочная", "Потолочная"),
                "group": sa["group_label_ru"],
                "cover": save(cover_url, f"c/sub-{sub['id']}", 1100) if cover_url else None,
                "realCount": len(by_sub.get(sub["id"], [])),
                "items": [],
            }
            real = by_sub.get(sub["id"], [])
            real.sort(key=lambda p: (not p["attributes"]["is_popular"], -len(by_product.get(p["id"], []))))
            for p in real[:PER_SUB]:
                vs = [variant_json(v, p["id"], i, False) for i, v in enumerate(by_product.get(p["id"], [])[:4])]
                vs = [v for v in vs if v]
                if not vs:
                    continue
                sub_json["items"].append({
                    "id": p["id"],
                    "name": clean_name(p["attributes"]["name_ru"]),
                    "popular": bool(p["attributes"]["is_popular"]),
                    "variants": vs,
                })
            if not sub_json["items"] and cover_url and sub["id"] in DEMO_NAMES:
                # Раздел пуст — две позиции «для вида»: обложка и её деталь.
                for i, title in enumerate(DEMO_NAMES[sub["id"]]):
                    crop = None if i == 0 else (0.18, 0.22, 0.82, 0.78)
                    sub_json["items"].append({
                        "id": f"demo-{sub['id']}-{i}",
                        "name": title,
                        "demo": True,
                        "variants": [{
                            "id": f"demo-{sub['id']}-{i}-0",
                            "color": "По вашему образцу",
                            "swatch": "#c9b28a",
                            "material": "МДФ",
                            "glazing": None,
                            "thumb": save(cover_url, f"d/{sub['id']}-{i}", 520, crop),
                        }],
                    })
            cat_json["subcategories"].append(sub_json)
        catalog["categories"].append(cat_json)

    by_id = {p["id"]: p for p in products}
    for model_id in CONFIGURATOR:
        p = by_id[model_id]
        vs = [variant_json(v, model_id, i, True) for i, v in enumerate(by_product[model_id][:8])]
        desc = (p["attributes"]["description_ru"] or "").strip()
        if desc.startswith("Классические двери являются идеальным выбором"):
            desc = ""
        catalog["configurator"].append({
            "id": model_id,
            "name": clean_name(p["attributes"]["name_ru"]),
            "sub": p["attributes"]["subcategories"]["data"][0]["id"] if p["attributes"]["subcategories"]["data"] else None,
            "description": desc,
            "variants": [v for v in vs if v],
        })

    OUT_JSON.parent.mkdir(parents=True, exist_ok=True)
    OUT_JSON.write_text(json.dumps(catalog, ensure_ascii=False, indent=1))
    total = sum(len(s["items"]) for c in catalog["categories"] for s in c["subcategories"])
    demo = sum(1 for c in catalog["categories"] for s in c["subcategories"] for i in s["items"] if i.get("demo"))
    print(f"позиций: {total}, из них для вида: {demo}; моделей в конструкторе: {len(catalog['configurator'])}")


if __name__ == "__main__":
    main()
