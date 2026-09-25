#!/usr/bin/env python3
"""
Коммерческое предложение Akbar Rich — сайт фабрики дверей и, по желанию,
панель управления. Собирает HTML на фирменном бланке DevUz Studio, из него
печатается PDF.

Бланк, шрифты и вёрстка — те же, что у КП MAVERA (build-kp-mavera.py); здесь
меняются только палитра, смета и текст. Правится одно место — SMETA_SITE,
SMETA_PANEL, EXTRAS или текст, — и документ пересобирается целиком.

    python3 docs/kp/build-kp-akbar.py
    SRC=docs/kp/kp-akbar.html OUT=docs/kp/KP-Akbar-Rich.pdf node docs/kp/render.mjs
"""

import base64
import pathlib
import re
import urllib.request

HERE = pathlib.Path(__file__).resolve().parent
CACHE = HERE / ".fonts"
UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"
FAMILIES = [("Manrope", "Manrope:wght@400;500;600;700"), ("Cormorant Garamond", "Cormorant+Garamond:wght@400;500;600")]


def _get(url: str) -> bytes:
    return urllib.request.urlopen(urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60).read()


def fonts_css() -> str:
    """Шрифты одним файлом — тот же кэш, что у КП MAVERA."""
    cached = CACHE / "embedded.css"
    if cached.exists():
        return cached.read_text()

    CACHE.mkdir(exist_ok=True)
    blocks = []
    for _, query in FAMILIES:
        css = _get(f"https://fonts.googleapis.com/css2?family={query}&subset=cyrillic,latin&display=swap").decode()
        for block in re.findall(r"@font-face\s*\{[^}]*\}", css):
            rng = re.search(r"unicode-range:\s*([^;]+);", block)
            if not rng or not ("U+0301" in rng.group(1) or "U+0400" in rng.group(1) or "U+0000-00FF" in rng.group(1)):
                continue
            url = re.search(r"url\((https://[^)]+)\)", block).group(1)
            blocks.append(block.replace(url, "data:font/woff2;base64," + base64.b64encode(_get(url)).decode()))

    cached.write_text("\n".join(blocks))
    return cached.read_text()


def b64(name: str) -> str:
    return base64.b64encode((HERE / name).read_bytes()).decode()


FONTS = fonts_css()
SIGN = b64("signature.png")
SIGN_DATE = "24.09.2026"
SHOT_HERO = b64("akbar-shot-hero.jpg")
SHOT_ROOM = b64("akbar-shot-room.jpg")
SHOT_MENU = b64("akbar-shot-menu.jpg")
SHOT_CONFIG = b64("akbar-shot-config.jpg")

PROTOTYPE = "globalex.maximov-tech.ru/akbar"

# Палитра — их продукция: орех, патина, эмаль.
INK, WALNUT, WALNUT_500 = "#16120e", "#3b2417", "#7a4a2a"
GOLD, GOLD_DARK = "#b8914f", "#8a6a33"
MUTED, SUBTLE, LINE, PAPER = "#5d544b", "#6d6258", "#e6ddd0", "#f7f2ea"

SMETA_SITE = [
    ("1", "Дизайн: концепция, главная, каталог, карточка модели, версия для телефона", "300"),
    ("2", "Главный экран: дверь открывается прокруткой, и посетитель входит в комнату", "150"),
    ("3", "Каталог: 6 категорий и 30 разделов, модели со всеми цветами и покрытиями из вашей базы", "250"),
    ("4", "Конструктор двери: модель, покрытие, цвет, остекление, высота до 3 м, комплект", "200"),
    ("5", "Страницы: о фабрике, сервис, дилерам, корпоративным клиентам, шоурум и контакты", "150"),
    ("6", "Заявки в Telegram и на почту, карта, звонок в одно касание", "70"),
    ("7", "Два языка: русский и узбекский", "60"),
    ("8", "Скорость, базовое SEO, Яндекс.Метрика", "80"),
    ("9", "Запуск на вашем домене, проверка на телефонах и компьютерах", "40"),
]

SMETA_PANEL = [
    ("1", "Вход в панель по логину и паролю", "80"),
    ("2", "Каталог: категории, разделы, модели, цвета и покрытия, фотографии", "250"),
    ("3", "Главная: популярные модели, обложки разделов, баннеры", "80"),
    ("4", "Заявки: список, статус, комментарий менеджера", "120"),
    ("5", "Перенос текущего каталога и обучение работе с панелью", "70"),
]

assert sum(int(price) for *_, price in SMETA_SITE) == 1300
assert sum(int(price) for *_, price in SMETA_PANEL) == 600

DAYS = [
    ("Дни 1–2", "Дизайн главной, каталога и карточки модели — показываем и согласовываем"),
    ("Дни 3–6", "Вёрстка всех страниц, каталог из вашей базы, версия для телефона"),
    ("Дни 7–8", "Конструктор двери, заявки, карта, узбекская версия"),
    ("Дни 9–10", "Проверка на устройствах, запуск на домене"),
    ("+4 дня", "Панель управления и перенос каталога — если берёте панель"),
]

FIXES = [
    ("Ссылки на категории ведут в никуда", "в адресе разделов на главной лишние пробелы, и переход ломается"),
    ("Страница «О компании» отдаёт 404", "из меню человек попадает на «Страница не найдено»"),
    ("Половина разделов меню пустые", "из 30 разделов каталога 16 без единой позиции"),
    ("Русская версия наполовину узбекская", "на страницах продукции узбекский текст у кнопки связи и забытое слово «hello»"),
    ("Опечатки в подвале", "«Отдел прадаж», «сомовывоз»"),
    ("Разный график на разных страницах", "в подвале — Сб–Вс 10–18, на странице адреса — воскресенье выходной"),
    ("Блог остановился на 2024 годе", "«Какие двери в тренде в 2024 году?» — на главной в 2026-м"),
    ("Служебная часть базы открыта наружу", "и показывает внутренние ошибки — при переезде закроем"),
]

BEST = [
    ("ProfilDoors (Россия)", "конструктор и комплект «полотно + коробка + наличники + фурнитура» — у вас конструктор на ваших же моделях"),
    ("Barausse и Garofoli (Италия)", "коллекции по характеру, раздел для дилеров и профессионалов — у вас девять характеров дверей и отдельный блок партнёрам"),
    ("ESTET и Domus (Ташкент)", "шоурум и консультант как главное действие, скрытые двери отдельной темой — у вас шоурум с картой и раздел скрытых дверей"),
]

EXTRAS = [
    ("Сайт и продажи", [
        ("Кабинет дилера: остатки, заказы, свои цены", "$1 800"),
        ("3D-тур по шоуруму — панорама 360°", "$900"),
        ("Онлайн-предоплата заказа: Payme, Click, Uzum", "$700"),
        ("Журнал: статьи о выборе дверей, новости фабрики", "$600"),
        ("Избранное и подборка — уходит ссылкой в Telegram", "$450"),
        ("Отзывы покупателей", "$350"),
        ("Английская версия", "по запросу"),
        ("Примерка двери на фото интерьера покупателя", "по запросу"),
    ]),
    ("Панель управления", [
        ("Интеграция с вашей CRM — заявки и статусы сделок", "$1 300"),
        ("Роли и права: кто правит каталог, кто видит заявки", "$400"),
        ("Импорт каталога из Excel с предпросмотром", "$350"),
        ("Журнал действий: кто и когда поменял позицию", "$300"),
    ]),
    ("Продвижение — подписка, в месяц", [
        ("SEO-статьи о дверях и интерьере: до 5 в неделю", "$550 / мес"),
        ("SEO-статьи о дверях и интерьере: до 3 в неделю", "$380 / мес"),
        ("Соцсети: публикации и ведение", "по запросу"),
    ]),
]


def rows(items):
    return "".join(
        f'<tr><td class="n">{n}</td><td>{work}</td><td class="num money">${price}</td></tr>' for n, work, price in items
    )


def extras_html():
    out = []
    for title, items in EXTRAS:
        lines = "".join(f'<tr><td>{name}</td><td class="num money">{price}</td></tr>' for name, price in items)
        out.append(
            f'<div class="extras-group"><h3 class="extras-h">{title}</h3>'
            f'<table class="extras"><tbody>{lines}</tbody></table></div>'
        )
    return "".join(out)


HTML = f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Коммерческое предложение — Akbar Rich</title>
<style>
{FONTS}

@page {{ size: A4; margin: 14mm 0 12mm; }}

* {{ box-sizing: border-box; }}
html, body {{ margin: 0; padding: 0; background: #fff; }}
body {{
  font-family: "Manrope", "Liberation Sans", Arial, sans-serif;
  font-size: 9.6pt;
  line-height: 1.55;
  color: {INK};
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}}
.sheet {{ width: 210mm; margin: 0 auto; padding: 0 18mm; }}
h1, h2, h3 {{ margin: 0; font-weight: 600; }}
p {{ margin: 0 0 0.7em; }}
a {{ color: {WALNUT_500}; }}
table {{ width: 100%; border-collapse: collapse; }}

header.blank {{
  display: flex; align-items: flex-start; justify-content: space-between; gap: 18px;
  border-bottom: 2px solid {INK}; padding-bottom: 10px; break-inside: avoid;
}}
.brand {{ display: flex; align-items: center; gap: 11px; }}
.brand .name {{ font-size: 13pt; font-weight: 700; letter-spacing: -0.01em; line-height: 1; }}
.brand .what {{ margin-top: 3px; font-size: 7.6pt; color: {MUTED}; }}
.contacts {{ text-align: right; font-size: 7.6pt; line-height: 1.5; color: {MUTED}; }}

.title {{
  margin-top: 11mm; text-align: center;
  font-family: "Cormorant Garamond", "Liberation Serif", Georgia, serif;
  font-size: 23pt; font-weight: 600; letter-spacing: 0.01em; color: {WALNUT};
}}
.subtitle {{ margin-top: 3px; text-align: center; font-size: 10.5pt; color: {MUTED}; }}
.meta {{ display: flex; justify-content: space-between; margin-top: 9mm; font-size: 9pt; color: {MUTED}; }}
.parties {{ display: flex; gap: 26px; margin-top: 4mm; padding: 9px 12px; background: {PAPER}; border-left: 3px solid {GOLD}; }}
.parties div {{ font-size: 9pt; }}
.parties b {{ display: block; font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.1em; color: {SUBTLE}; font-weight: 600; }}

.lead {{ margin-top: 6mm; font-size: 10.2pt; line-height: 1.6; }}

.tiles {{ display: flex; gap: 8px; margin-top: 6mm; break-inside: avoid; }}
.tile {{ flex: 1; padding: 11px 13px; border: 1px solid {LINE}; border-radius: 3px; }}
.tile.pay {{ background: {INK}; border-color: {INK}; color: #fff; }}
.tile .k {{ font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.1em; color: {SUBTLE}; font-weight: 600; }}
.tile.pay .k {{ color: {GOLD}; }}
.tile .v {{ margin-top: 4px; font-size: 16pt; font-weight: 700; line-height: 1.1; color: {WALNUT}; }}
.tile.pay .v {{ color: #fff; }}
.tile .s {{ margin-top: 2px; font-size: 8pt; color: {MUTED}; }}
.tile.pay .s {{ color: rgba(255,255,255,0.72); }}

.shots {{ display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 5mm; break-inside: avoid; }}
.shots figure {{ margin: 0; }}
.shots img {{ display: block; width: 100%; border: 1px solid {LINE}; border-radius: 3px; }}
.shots figcaption {{ margin-top: 3px; font-size: 7.4pt; color: {SUBTLE}; }}
.proto {{ margin-top: 3mm; padding: 9px 12px; background: {INK}; color: #fff; border-radius: 3px; font-size: 9pt; break-inside: avoid; }}
.proto b {{ color: {GOLD}; }}
.proto a {{ color: #fff; font-weight: 600; }}

h2 {{
  margin-top: 7mm; padding-bottom: 4px; border-bottom: 1px solid {LINE};
  font-size: 11.5pt; color: {WALNUT}; break-after: avoid;
}}
h2 .num {{ color: {GOLD_DARK}; font-weight: 700; margin-right: 7px; }}

ul.what {{ margin: 4mm 0 0; padding: 0; list-style: none; }}
ul.what li {{ margin-bottom: 3mm; padding-left: 15px; position: relative; break-inside: avoid; }}
ul.what li::before {{ content: ""; position: absolute; left: 0; top: 6px; width: 6px; height: 6px; background: {GOLD}; }}
ul.what b {{ display: block; font-weight: 600; }}
ul.what span {{ color: {MUTED}; }}

table.smeta {{ margin-top: 4mm; font-size: 9pt; break-inside: avoid; }}
table.smeta th {{
  text-align: left; padding: 6px 8px; border-bottom: 1.5px solid {INK};
  font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.08em; color: {SUBTLE}; font-weight: 600;
}}
table.smeta td {{ padding: 5px 8px; border-bottom: 1px solid #efe9df; vertical-align: top; }}
table.smeta td.n {{ color: {SUBTLE}; width: 22px; }}
table.smeta .num {{ text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }}
table.smeta .money {{ width: 78px; }}
table.smeta th.num {{ text-align: right; }}
tr.sum td {{ border-bottom: none; padding-top: 8px; font-weight: 600; }}
tr.sum.total td {{ border-top: 1.5px solid {INK}; }}
tr.pay td {{ font-size: 12pt; font-weight: 700; color: {WALNUT}; padding-top: 4px; }}
tr.opt td {{ color: {GOLD_DARK}; }}
h3.part {{ margin-top: 5mm; font-size: 8.4pt; text-transform: uppercase; letter-spacing: 0.1em; color: {WALNUT_500}; font-weight: 700; }}

table.days {{ margin-top: 4mm; font-size: 9pt; break-inside: avoid; }}
table.days td {{ padding: 5px 8px; border-bottom: 1px solid #efe9df; }}
table.days td:first-child {{ width: 66px; font-weight: 600; color: {WALNUT_500}; white-space: nowrap; }}

table.fixes {{ margin-top: 4mm; font-size: 8.8pt; }}
table.fixes td {{ padding: 5px 8px; border-bottom: 1px solid #efe9df; vertical-align: top; }}
table.fixes td:first-child {{ width: 44%; font-weight: 600; }}
table.fixes td:last-child {{ color: {MUTED}; }}
table.fixes tr {{ break-inside: avoid; }}

.two {{ display: flex; gap: 14px; margin-top: 4mm; }}
.two > div {{ flex: 1; }}
ol.need, ul.terms {{ margin: 0; padding-left: 16px; font-size: 9pt; }}
ol.need li, ul.terms li {{ margin-bottom: 2mm; }}

h3.extras-h {{
  margin-top: 5mm; font-size: 8.4pt; text-transform: uppercase; letter-spacing: 0.1em;
  color: {WALNUT_500}; font-weight: 700; break-after: avoid;
}}
table.extras {{ margin-top: 2mm; font-size: 8.8pt; }}
.extras-group {{ break-inside: avoid; }}
table.extras td {{ padding: 4px 8px; border-bottom: 1px solid #f3eee6; }}
table.extras td.num {{ text-align: right; white-space: nowrap; width: 88px; font-variant-numeric: tabular-nums; color: {WALNUT}; font-weight: 600; }}

.note {{ margin-top: 3mm; padding: 9px 12px; background: {PAPER}; border-left: 3px solid {GOLD}; font-size: 8.6pt; color: {MUTED}; break-inside: avoid; }}

.sign {{ display: flex; justify-content: space-between; align-items: flex-end; margin-top: 9mm; break-inside: avoid; }}
.sign .who b {{ display: block; font-size: 10pt; }}
.sign .who span {{ font-size: 8.6pt; color: {MUTED}; }}
.sign .line {{ width: 62mm; }}
.sign .line .rule {{ position: relative; height: 15mm; border-bottom: 1px solid {INK}; }}
.sign .line .rule img {{ position: absolute; left: 5mm; bottom: -2px; width: 46mm; }}
.sign .line span {{ display: block; margin-top: 4px; font-size: 7.4pt; color: {SUBTLE}; }}

footer.blank {{
  margin-top: 10mm; padding-top: 7px; border-top: 1px solid #d8d8d2;
  font-size: 7.4pt; line-height: 1.5; color: {SUBTLE}; break-inside: avoid;
}}
footer.blank b {{ color: {MUTED}; }}
</style>
</head>
<body>
<div class="sheet">

  <header class="blank">
    <div class="brand">
      <svg width="42" height="42" viewBox="-112 -112 224 224" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" y1="-1" x2="1" y2="1">
            <stop offset="0" stop-color="#5B9BFF"/><stop offset="55%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#22F0A0"/>
          </linearGradient>
          <mask id="cut">
            <rect x="-112" y="-112" width="224" height="224" fill="#fff"/>
            <path d="M-22 -34 L-58 0 L-22 34" stroke="#000" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M22 -34 L58 0 L22 34" stroke="#000" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            <rect x="-5" y="-40" width="10" height="80" fill="#000" rx="5"/>
          </mask>
        </defs>
        <path d="M0 -100 L29.29 -70.71 L70.71 -70.71 L70.71 -29.29 L100 0 L70.71 29.29 L70.71 70.71 L29.29 70.71 L0 100 L-29.29 70.71 L-70.71 70.71 L-70.71 29.29 L-100 0 L-70.71 -29.29 L-70.71 -70.71 L-29.29 -70.71 Z"
              fill="url(#g)" mask="url(#cut)"/>
      </svg>
      <div>
        <p class="name">DevUz Studio</p>
        <p class="what">Разработка сайтов и приложений · Ташкент</p>
      </div>
    </div>
    <div class="contacts">
      <p>devuz.studio</p>
      <p>t.me/Devuz_studio_bot</p>
      <p>Ташкент, улица Шота Руставели, 138</p>
    </div>
  </header>

  <h1 class="title">Коммерческое предложение</h1>
  <p class="subtitle">Новый сайт фабрики дверей Akbar Rich</p>

  <div class="meta"><span>Ташкент</span><span>24 сентября 2026</span></div>

  <div class="parties">
    <div><b>Кому</b>Akbar Rich, фабрика дверей · Ташкент</div>
    <div><b>От кого</b>DevUz Studio · Егор Максимов</div>
    <div><b>Срок действия</b>14 календарных дней</div>
  </div>

  <p class="lead">
    Сайт, который продаёт двери так же, как ваш шоурум: человек видит модель вживую, собирает
    свою дверь — покрытие, цвет, высоту, комплект — и оставляет заявку с готовым набором. Весь
    каталог — 6 категорий и 30 разделов — заполнен, пустых разделов больше нет. Сайт работает из
    вашей базы каталога, поэтому новые модели появляются на нём сами.
  </p>

  <div class="tiles">
    <div class="tile">
      <p class="k">Сайт</p>
      <p class="v">$1 300</p>
      <p class="s">10 рабочих дней</p>
    </div>
    <div class="tile">
      <p class="k">Панель управления</p>
      <p class="v">+$600</p>
      <p class="s">если нужна, +4 дня</p>
    </div>
    <div class="tile pay">
      <p class="k">Сайт с панелью</p>
      <p class="v">$1 900</p>
      <p class="s">14 рабочих дней под ключ</p>
    </div>
  </div>

  <div class="shots">
    <figure><img src="data:image/jpeg;base64,{SHOT_HERO}" alt="Главный экран прототипа"><figcaption>Главный экран: ваша модель № 45 в американском орехе</figcaption></figure>
    <figure><img src="data:image/jpeg;base64,{SHOT_ROOM}" alt="Дверь открыта, посетитель в комнате"><figcaption>Прокрутка открывает дверь — и посетитель входит в дом</figcaption></figure>
    <figure><img src="data:image/jpeg;base64,{SHOT_MENU}" alt="Меню каталога"><figcaption>Меню: все разделы с обложками и позициями</figcaption></figure>
    <figure><img src="data:image/jpeg;base64,{SHOT_CONFIG}" alt="Конструктор двери"><figcaption>Конструктор на ваших моделях, цветах и рендерах</figcaption></figure>
  </div>
  <div class="proto">
    <b>Прототип уже работает:</b> <a href="https://{PROTOTYPE}">{PROTOTYPE}</a> — откройте с телефона и с компьютера.
    Модели, цвета и фотографии в нём — ваши, из открытого каталога сайта.
  </div>

  <h2><span class="num">1</span>Что получит посетитель</h2>
  <ul class="what">
    <li><b>Главный экран, который запоминается.</b><span>Ваша дверь на стене; прокрутка открывает её,
        и посетитель входит в комнату. Первое впечатление — как в шоуруме, а не как в прайс-листе.</span></li>
    <li><b>Каталог без пустых разделов.</b><span>Шесть категорий — двери, окна, плинтусы, обрешётки,
        стеновые панели, мебельные створки — и тридцать разделов с обложками. У каждой модели все её
        цвета и покрытия: эмаль, ясень, американский орех.</span></li>
    <li><b>Конструктор двери.</b><span>Модель, покрытие, цвет, глухая или со стеклом, высота до трёх
        метров, коробка, наличники и фурнитура. Набор одной кнопкой уходит менеджеру — переписывать
        ничего не нужно.</span></li>
    <li><b>То, чем вы отличаетесь.</b><span>Трёхметровые двери толщиной 5 см, скрытые двери и стеновые
        панели, интерьер у одного производителя — отдельными разделами, а не строкой в каталоге.</span></li>
    <li><b>Дилерам и корпоративным клиентам.</b><span>Условия, требования и шаги партнёрства — ваши же,
        с кнопкой заявки. Для жилых комплексов и отелей — свой блок.</span></li>
    <li><b>Шоурум и связь.</b><span>Адрес, ориентир, график отделов, маршрут в Яндекс и Google Картах,
        звонок в одно касание. Заявки приходят в Telegram и на почту.</span></li>
  </ul>

  <h2><span class="num">2</span>Что взяли у лучших</h2>
  <ul class="what">
    {"".join(f"<li><b>{who}</b><span>{what}</span></li>" for who, what in BEST)}
  </ul>

  <h2 style="break-before: page; margin-top: 0"><span class="num">3</span>Смета</h2>
  <h3 class="part">Сайт</h3>
  <table class="smeta">
    <thead><tr><th class="n"></th><th>Работа</th><th class="num">Стоимость</th></tr></thead>
    <tbody>
      {rows(SMETA_SITE)}
      <tr class="sum total"><td></td><td>Итого сайт</td><td class="num money">$1 300</td></tr>
    </tbody>
  </table>

  <h3 class="part">Панель управления — если нужна</h3>
  <table class="smeta">
    <thead><tr><th class="n"></th><th>Работа</th><th class="num">Стоимость</th></tr></thead>
    <tbody>
      {rows(SMETA_PANEL)}
      <tr class="sum total"><td></td><td>Итого панель</td><td class="num money">$600</td></tr>
      <tr class="pay"><td></td><td>Сайт с панелью</td><td class="num money">$1 900</td></tr>
    </tbody>
  </table>
  <div class="note">
    <b>Нужна ли вам панель.</b> У вас уже есть база каталога, из которой работает нынешний сайт.
    Новый сайт подключается к ней — и тогда модели вы добавляете как раньше, а панель не нужна:
    это $1 300. Панель за $600 — если хотите одно удобное место для каталога, главной и заявок,
    без старой системы. Цена в долларах, оплата в сумах по курсу ЦБ на день счёта.
  </div>

  <h2><span class="num">4</span>Сроки</h2>
  <table class="days"><tbody>
    {"".join(f"<tr><td>{d}</td><td>{t}</td></tr>" for d, t in DAYS)}
  </tbody></table>

  <h2><span class="num">5</span>Что исправим по ходу</h2>
  <p style="color:{MUTED}; margin-top:3mm">Нашли, пока изучали нынешний сайт. Всё это уйдёт вместе с переездом, отдельно не оплачивается.</p>
  <table class="fixes"><tbody>
    {"".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in FIXES)}
  </tbody></table>

  <div class="two">
    <div>
      <h2 style="margin-top:7mm"><span class="num">6</span>Что нужно от вас</h2>
      <ol class="need">
        <li>Доступ к базе каталога — или выгрузка моделей</li>
        <li>Логотип в векторе (SVG, AI, EPS или PDF)</li>
        <li>Фото шоурума и производства, если есть</li>
        <li>Адреса филиалов для страницы «Где купить»</li>
        <li>Домен и доступ к хостингу — либо оформим на вас</li>
      </ol>
    </div>
    <div>
      <h2 style="margin-top:7mm"><span class="num">7</span>Условия</h2>
      <ul class="terms">
        <li>Оплата: 50% к старту, 50% при запуске</li>
        <li>Один круг правок по дизайну</li>
        <li>30 дней бесплатных исправлений после запуска</li>
        <li>Исходный код и права на дизайн — ваши</li>
      </ul>
    </div>
  </div>

  <h2><span class="num">8</span>Что можно добавить дальше</h2>
  <p style="color:{MUTED}">
    Сайт работает и без этого. Всё ниже подключается позже, по одному, без переделки сайта.
  </p>
  {extras_html()}

  <div class="note">
    Разработка считается один раз, подписка — ежемесячно. Итоговый набор собираем вместе: назовите
    задачу — покажем экран и цену до начала работ.
  </div>

  <div class="sign">
    <div class="who">
      <b>Егор Максимов</b>
      <span>DevUz Studio · t.me/Devuz_studio_bot</span>
    </div>
    <div class="line">
      <div class="rule"><img src="data:image/png;base64,{SIGN}" alt="Подпись"></div>
      <span>Подпись · {SIGN_DATE}</span>
    </div>
  </div>

  <footer class="blank">
    <p><b>ИП MAKSIMOV EGOR ANDREEVICH</b> · Республика Узбекистан, г. Ташкент, улица Шота Руставели, 138 · ПИНФЛ 32303946570039</p>
    <p>Предложение носит информационный характер и не является публичной офертой. Состав работ и цена фиксируются договором.</p>
  </footer>

</div>
</body>
</html>
"""

out = HERE / "kp-akbar.html"
out.write_text(HTML)
print("Собрано:", out, f"({round(len(HTML) / 1024)} КБ)")
