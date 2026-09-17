#!/usr/bin/env python3
"""
Коммерческое предложение MAVERA — первый этап. Собирает HTML на фирменном
бланке DevUz Studio, из него печатается PDF.

Зачем скриптом, а не руками в редакторе: цена, состав работ и список допников
меняются от разговора к разговору, а бланк, шрифты и вёрстка — нет. Правится
одно место — таблица SMETA, EXTRAS или текст, — и документ пересобирается
целиком, без разъехавшихся отступов.

Шрифты (Manrope и Cormorant Garamond — те же, что у ADAR) скачиваются с Google
Fonts при первой сборке и кладутся рядом, в .fonts/embedded.css: в готовый файл
они уходят base64-строкой, чтобы PDF печатался одинаково на любой машине.

    python3 docs/kp/build-kp-mavera.py          # собрать HTML
    node docs/kp/render.mjs                     # напечатать PDF
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
    """Шрифты одним файлом. Скачиваются один раз, дальше берутся из кэша."""
    cached = CACHE / "embedded.css"
    if cached.exists():
        return cached.read_text()

    CACHE.mkdir(exist_ok=True)
    blocks = []
    for _, query in FAMILIES:
        css = _get(f"https://fonts.googleapis.com/css2?family={query}&subset=cyrillic,latin&display=swap").decode()
        for block in re.findall(r"@font-face\s*\{[^}]*\}", css):
            rng = re.search(r"unicode-range:\s*([^;]+);", block)
            # Только кириллица и базовая латиница: остальные подмножества документу не нужны.
            if not rng or not ("U+0301" in rng.group(1) or "U+0400" in rng.group(1) or "U+0000-00FF" in rng.group(1)):
                continue
            url = re.search(r"url\((https://[^)]+)\)", block).group(1)
            blocks.append(block.replace(url, "data:font/woff2;base64," + base64.b64encode(_get(url)).decode()))

    cached.write_text("\n".join(blocks))
    return cached.read_text()


FONTS = fonts_css()
LOGO = base64.b64encode((HERE / "mavera-logo.png").read_bytes()).decode()
# Подпись — с прозрачным фоном, чтобы легла на линию, а не белым прямоугольником.
SIGN = base64.b64encode((HERE / "signature.png").read_bytes()).decode()
SIGN_DATE = "17.09.2026"

GREEN_900, GREEN_700, GREEN_500 = "#10261c", "#1d4535", "#35735a"
GOLD, GOLD_DARK = "#d0a03c", "#ad7f26"
INK, MUTED, SUBTLE = "#17140f", "#5b544a", "#6f675a"

def tower(filled: int, total: int = 14) -> str:
    """Кадр заставки: башня, у которой выросло `filled` этажей из `total`."""
    parts = ['<svg viewBox="0 0 90 118" width="74" height="97" role="img" aria-label="Кадр заставки">']
    parts.append(f'<path d="M45 4 L48 26 L42 26 Z" fill="{GREEN_900 if filled >= total else "#cfcfc9"}"/>')
    for i in range(total):
        y = 26 + i * 6.2
        half = 13 + i * 1.45
        on = i < filled
        parts.append(
            f'<rect x="{45 - half:.1f}" y="{y:.1f}" width="{half * 2:.1f}" height="3.1" rx="1.5" '
            f'fill="{GREEN_700 if on else "#e4e4df"}"/>'
        )
    parts.append("</svg>")
    return "".join(parts)

SMETA = [
    ("1", "Оформление: палитра, логотип, типографика; макеты для компьютера и телефона", "40", "1 000"),
    ("2", "Заставка: анимация логотипа — этажи вырастают, 3–5 секунд", "16", "450"),
    ("3", "Вёрстка страниц: главная, каталог ЖК, карточка ЖК, контакты", "56", "1 400"),
    ("4", "Панель управления: вход, добавление и правка ЖК, фотографии, описание, публикация", "48", "1 300"),
    ("5", "Формы заявок: на почту и в Telegram", "10", "250"),
    ("6", "Адаптив: телефон, планшет, компьютер", "16", "400"),
    ("7", "Базовое SEO, Яндекс.Метрика, скорость загрузки", "12", "300"),
    ("8", "Сервер, домен, запуск, обучение работе с панелью", "10", "250"),
    ("9", "Проверка: браузеры и устройства", "10", "250"),
]

DAYS = [
    ("День 1", "Палитра, логотип, макет главной страницы"),
    ("День 2", "Макеты каталога и карточки ЖК — показываем и согласовываем"),
    ("День 3–4", "Вёрстка всех страниц, адаптив под телефон"),
    ("День 5", "Панель управления: ЖК, фотографии, описание, публикация"),
    ("День 6", "Заставка с анимацией логотипа, наполнение вашими материалами"),
    ("День 7", "Проверка на устройствах, запуск на домене, обучение"),
]

EXTRAS = [
    ("Сайт и продажи", [
        ("Шахматка квартир — этажи клетками вместо списка", "$1 200"),
        ("Онлайн-бронирование: бронь на 5 дней вместо заявки", "$900"),
        ("3D-тур по квартире — панорама 360°", "$900"),
        ("Новости и пресс-центр", "$600"),
        ("Ипотечный калькулятор по выбранной квартире", "$500"),
        ("Избранное и подборка — уходит ссылкой в Telegram", "$450"),
        ("Ход строительства: фотоотчёт по месяцам", "$350"),
        ("Прогноз стоимости квартиры графиком по годам", "$350"),
        ("Отзывы жильцов", "$350"),
        ("Ещё два языка: английский и узбекский", "$300"),
    ]),
    ("Панель управления", [
        ("Интеграция с вашей CRM — заявки и статусы сделок", "$1 300"),
        ("Роли и права: кто правит цены, кто видит заявки", "$400"),
        ("Импорт квартир из Excel с предпросмотром", "$350"),
        ("Журнал действий: кто и когда поменял цену или статус", "$300"),
        ("Яндекс.Метрика внутри панели", "$250"),
    ]),
    ("Сверх сайта: интеграции и ИИ", [
        ("Свои ИИ-агенты на RAG-базе — модель на ваших данных и вашем сервере", "от $26 000"),
        ("Своя CRM с контролем качества разговоров", "$4 000"),
        ("ИИ-агенты на первую линию: отвечают и квалифицируют", "$2 600"),
        ("Личный кабинет дольщика: договор, платежи, ход стройки", "$2 400"),
        ("Партнёрский кабинет для риелторов", "$1 800"),
        ("Онлайн-оплата брони: Payme, Click, Uzum", "$700"),
    ]),
    ("Продвижение — подписка, в месяц", [
        ("SEO-статьи на автопилоте: до 10 в неделю", "$750 / мес"),
        ("SEO-статьи на автопилоте: до 5 в неделю", "$550 / мес"),
        ("SEO-статьи на автопилоте: до 3 в неделю", "$380 / мес"),
        ("Соцсети: автопостинг новостей и ведение", "по запросу"),
    ]),
]

def rows(items):
    return "".join(
        f'<tr><td class="n">{n}</td><td>{work}</td><td class="num">{hours}</td><td class="num money">${price}</td></tr>'
        for n, work, hours, price in items
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
<title>Коммерческое предложение — MAVERA</title>
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
table {{ width: 100%; border-collapse: collapse; }}
.avoid {{ break-inside: avoid; }}

/* ─── Бланк ─── */
header.blank {{
  display: flex; align-items: flex-start; justify-content: space-between; gap: 18px;
  border-bottom: 2px solid {INK}; padding-bottom: 10px; break-inside: avoid;
}}
.brand {{ display: flex; align-items: center; gap: 11px; }}
.brand .name {{ font-size: 13pt; font-weight: 700; letter-spacing: -0.01em; line-height: 1; }}
.brand .what {{ margin-top: 3px; font-size: 7.6pt; color: {MUTED}; }}
.contacts {{ text-align: right; font-size: 7.6pt; line-height: 1.5; color: {MUTED}; }}

/* ─── Шапка документа ─── */
.title {{
  margin-top: 11mm; text-align: center;
  font-family: "Cormorant Garamond", "Liberation Serif", Georgia, serif;
  font-size: 23pt; font-weight: 600; letter-spacing: 0.01em; color: {GREEN_900};
}}
.subtitle {{ margin-top: 3px; text-align: center; font-size: 10.5pt; color: {MUTED}; }}
.meta {{ display: flex; justify-content: space-between; margin-top: 9mm; font-size: 9pt; color: {MUTED}; }}
.parties {{ display: flex; gap: 26px; margin-top: 4mm; padding: 9px 12px; background: #f4f7f5; border-left: 3px solid {GREEN_700}; }}
.parties div {{ font-size: 9pt; }}
.parties b {{ display: block; font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.1em; color: {SUBTLE}; font-weight: 600; }}

.lead {{ margin-top: 6mm; font-size: 10.2pt; line-height: 1.6; }}

/* ─── Три плитки с ценой ─── */
.tiles {{ display: flex; gap: 8px; margin-top: 6mm; break-inside: avoid; }}
.tile {{ flex: 1; padding: 11px 13px; border: 1px solid #dfe5e1; border-radius: 3px; }}
.tile.pay {{ background: {GREEN_900}; border-color: {GREEN_900}; color: #fff; }}
.tile .k {{ font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.1em; color: {SUBTLE}; font-weight: 600; }}
.tile.pay .k {{ color: {GOLD}; }}
.tile .v {{ margin-top: 4px; font-size: 16pt; font-weight: 700; line-height: 1.1; color: {GREEN_900}; }}
.tile.pay .v {{ color: #fff; }}
.tile .s {{ margin-top: 2px; font-size: 8pt; color: {MUTED}; }}
.tile.pay .s {{ color: rgba(255,255,255,0.72); }}
.tile .was {{ text-decoration: line-through; }}

/* ─── Разделы ─── */
h2 {{
  margin-top: 7mm; padding-bottom: 4px; border-bottom: 1px solid #dfe5e1;
  font-size: 11.5pt; color: {GREEN_900};
}}
h2 .num {{ color: {GOLD_DARK}; font-weight: 700; margin-right: 7px; }}

ul.what {{ margin: 4mm 0 0; padding: 0; list-style: none; }}
ul.what li {{ margin-bottom: 3mm; padding-left: 15px; position: relative; break-inside: avoid; }}
ul.what li::before {{ content: ""; position: absolute; left: 0; top: 6px; width: 6px; height: 6px; background: {GOLD}; }}
ul.what b {{ display: block; font-weight: 600; }}
ul.what span {{ color: {MUTED}; }}

/* ─── Палитра ─── */
.palette {{ display: flex; gap: 8px; margin-top: 4mm; break-inside: avoid; }}
.swatch {{ flex: 1; border: 1px solid #e6e6e1; border-radius: 3px; overflow: hidden; }}
.swatch .chip {{ height: 26px; }}
.swatch .cap {{ padding: 5px 8px; font-size: 7.6pt; line-height: 1.35; }}
.swatch .cap b {{ display: block; font-weight: 600; }}
.swatch .cap span {{ color: {SUBTLE}; font-family: "Liberation Mono", monospace; font-size: 7pt; }}

/* ─── Заставка ─── */
.splash {{ display: flex; gap: 16px; align-items: flex-start; margin-top: 4mm; break-inside: avoid; }}
.splash .logo {{ width: 42mm; flex: none; text-align: center; padding: 8px; border: 1px solid #e6e6e1; border-radius: 3px; }}
.splash .logo img {{ width: 100%; }}
.splash .logo p {{ margin: 6px 0 0; font-size: 7.2pt; color: {SUBTLE}; }}
.frames {{ display: flex; gap: 10px; margin-top: 3mm; }}
.frame {{ text-align: center; }}
.frame .t {{ margin-top: 3px; font-size: 7.4pt; color: {SUBTLE}; }}

/* ─── Таблицы ─── */
table.smeta {{ margin-top: 4mm; font-size: 9pt; break-inside: avoid; }}
table.smeta th {{
  text-align: left; padding: 6px 8px; border-bottom: 1.5px solid {GREEN_900};
  font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.08em; color: {SUBTLE}; font-weight: 600;
}}
table.smeta td {{ padding: 5px 8px; border-bottom: 1px solid #ecefed; vertical-align: top; }}
table.smeta td.n {{ color: {SUBTLE}; width: 22px; }}
table.smeta .num {{ text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; }}
table.smeta .money {{ width: 78px; }}
table.smeta th.num {{ text-align: right; }}
tr.sum td {{ border-bottom: none; padding-top: 8px; font-weight: 600; }}
tr.sum.total td {{ border-top: 1.5px solid {GREEN_900}; }}
tr.discount td {{ color: {GOLD_DARK}; }}
tr.pay td {{ font-size: 12pt; font-weight: 700; color: {GREEN_900}; padding-top: 4px; }}

table.days {{ margin-top: 4mm; font-size: 9pt; break-inside: avoid; }}
table.days td {{ padding: 5px 8px; border-bottom: 1px solid #ecefed; }}
table.days td:first-child {{ width: 66px; font-weight: 600; color: {GREEN_700}; white-space: nowrap; }}

.two {{ display: flex; gap: 14px; margin-top: 4mm; }}
.two > div {{ flex: 1; }}
ol.need, ul.terms {{ margin: 0; padding-left: 16px; font-size: 9pt; }}
ol.need li, ul.terms li {{ margin-bottom: 2mm; }}

h3.extras-h {{
  margin-top: 5mm; font-size: 8.4pt; text-transform: uppercase; letter-spacing: 0.1em;
  color: {GREEN_700}; font-weight: 700; break-after: avoid;
}}
table.extras {{ margin-top: 2mm; font-size: 8.8pt; }}
.extras-group {{ break-inside: avoid; }}
table.extras td {{ padding: 4px 8px; border-bottom: 1px solid #f0f2f1; }}
table.extras td.num {{ text-align: right; white-space: nowrap; width: 88px; font-variant-numeric: tabular-nums; color: {GREEN_900}; font-weight: 600; }}

.note {{ margin-top: 3mm; padding: 9px 12px; background: #faf7f0; border-left: 3px solid {GOLD}; font-size: 8.6pt; color: {MUTED}; }}

.sign {{ display: flex; justify-content: space-between; align-items: flex-end; margin-top: 9mm; break-inside: avoid; }}
.sign .who b {{ display: block; font-size: 10pt; }}
.sign .who span {{ font-size: 8.6pt; color: {MUTED}; }}
.sign .line {{ width: 62mm; }}
/* Росчерк лежит на линейке, а подпись с датой — под ней: внутри одной коробки
   картинка накрывала бы строку. */
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
        <p class="what">Разработка сайтов, приложений и ИИ-продуктов · Ташкент</p>
      </div>
    </div>
    <div class="contacts">
      <p>devuz.studio</p>
      <p>t.me/Devuz_studio_bot</p>
      <p>Ташкент, улица Шота Руставели, 138</p>
    </div>
  </header>

  <h1 class="title">Коммерческое предложение</h1>
  <p class="subtitle">Сайт застройщика MAVERA · первый этап</p>

  <div class="meta"><span>Ташкент</span><span>17 сентября 2026</span></div>

  <div class="parties">
    <div><b>Кому</b>MAVERA, застройщик · Ташкент</div>
    <div><b>От кого</b>DevUz Studio · Егор Максимов</div>
    <div><b>Срок действия</b>14 календарных дней</div>
  </div>

  <p class="lead">
    Сайт жилых комплексов в вашей палитре — тёмно-зелёный с золотом и серым — с вашим логотипом
    и минимальной панелью управления: новый ЖК, фотографии и описание вы добавляете сами, без
    разработчика и без обращений к нам. Перед сайтом — заставка: логотип собирается по этажам,
    как будто дом строят.
  </p>

  <div class="tiles">
    <div class="tile">
      <p class="k">Срок</p>
      <p class="v">7 дней</p>
      <p class="s">рабочих, от старта до запуска</p>
    </div>
    <div class="tile">
      <p class="k">Стоимость работ</p>
      <p class="v was">$5 600</p>
      <p class="s">218 часов команды</p>
    </div>
    <div class="tile pay">
      <p class="k">К оплате со скидкой</p>
      <p class="v">$4 300</p>
      <p class="s">скидка $1 300 — 23%</p>
    </div>
  </div>

  <h2><span class="num">1</span>Что входит в первый этап</h2>
  <ul class="what">
    <li><b>Оформление под ваш бренд.</b><span>Тёмно-зелёный фон, золотые акценты и серый текст — палитра
        вашего фирменного стиля. Ваш логотип в шапке, на заставке и в подвале. Макеты для компьютера и телефона.</span></li>
    <li><b>Заставка с анимацией логотипа.</b><span>Логотип вырастает этажами за 3–5 секунд, пока грузится
        сайт. Показывается один раз за визит — повторно человека не задерживает.</span></li>
    <li><b>Четыре страницы.</b><span>Главная с ключевыми проектами, каталог жилых комплексов, карточка ЖК
        с фотогалереей и характеристиками, контакты с картой и формой.</span></li>
    <li><b>Панель управления.</b><span>Вход по логину. Добавить жилой комплекс, загрузить фотографии,
        написать описание, поменять порядок на сайте, снять с публикации — без разработчика.</span></li>
    <li><b>Заявки.</b><span>Форма на сайте уходит на почту и в Telegram — ни одна не теряется.</span></li>
    <li><b>Запуск.</b><span>Адаптив под телефон и планшет, базовое SEO, Яндекс.Метрика, домен и сервер,
        обучение работе с панелью.</span></li>
  </ul>

  <div class="palette">
    <div class="swatch"><div class="chip" style="background:{GREEN_900}"></div>
      <div class="cap"><b>Тёмно-зелёный</b><span>#10261C</span></div></div>
    <div class="swatch"><div class="chip" style="background:{GREEN_700}"></div>
      <div class="cap"><b>Зелёный, заливки</b><span>#1D4535</span></div></div>
    <div class="swatch"><div class="chip" style="background:{GOLD}"></div>
      <div class="cap"><b>Золото, акценты</b><span>#D0A03C</span></div></div>
    <div class="swatch"><div class="chip" style="background:{MUTED}"></div>
      <div class="cap"><b>Серый, текст</b><span>#5B544A</span></div></div>
  </div>

  <h2><span class="num">2</span>Заставка: логотип, который строится</h2>
  <div class="splash">
    <div class="logo">
      <img src="data:image/png;base64,{LOGO}" alt="Логотип MAVERA">
      <p>Ваш логотип — финальный кадр заставки</p>
    </div>
    <div>
      <p>Пока грузится сайт, на весь экран показывается тёмно-зелёный кадр с вашим логотипом.
         Этажи появляются снизу вверх один за другим, шпили прорастают последними, затем проявляется
         слово MAVERA — и заставка растворяется, открывая главную страницу.</p>
      <p style="margin-bottom:0">Длительность 3–5 секунд, настраивается. Если сайт загрузился раньше —
         заставка не задерживает: она уходит по готовности. Для тех, у кого в телефоне включено
         «уменьшение движения», показываем статичный логотип без анимации.</p>
      <div class="frames">
        <div class="frame">{tower(4)}<p class="t">0,0 с</p></div>
        <div class="frame">{tower(9)}<p class="t">1,5 с</p></div>
        <div class="frame">{tower(14)}<p class="t">3,0 с</p></div>
      </div>
    </div>
  </div>
  <div class="note">
    Для анимации нужен логотип в векторе (SVG, AI, EPS или PDF). Из растровой картинки этажи
    анимировать нельзя — если вектора нет, мы перерисуем логотип в вектор, это 4 часа работы.
  </div>

  <h2><span class="num">3</span>Смета</h2>
  <table class="smeta">
    <thead><tr><th class="n"></th><th>Работа</th><th class="num">Часы</th><th class="num">Стоимость</th></tr></thead>
    <tbody>
      {rows(SMETA)}
      <tr class="sum total"><td></td><td>Итого работ</td><td class="num">218</td><td class="num money">$5 600</td></tr>
      <tr class="sum discount"><td></td><td>Скидка на первый этап — 23%</td><td class="num"></td><td class="num money">−$1 300</td></tr>
      <tr class="pay"><td></td><td>К оплате</td><td class="num"></td><td class="num money">$4 300</td></tr>
    </tbody>
  </table>
  <div class="note">
    Цена в долларах, оплата в сумах по курсу ЦБ на день счёта. По курсу 11 765,21 сум за доллар
    (cbu.uz, 15.09.2026) это примерно 50,6 млн сум. Эффективная ставка — $19,7 за час работы команды.
  </div>

  <h2><span class="num">4</span>Сроки: 7 рабочих дней</h2>
  <table class="days"><tbody>
    {"".join(f"<tr><td>{d}</td><td>{t}</td></tr>" for d, t in DAYS)}
  </tbody></table>

  <div class="two">
    <div>
      <h2 style="margin-top:7mm"><span class="num">5</span>Что нужно от вас</h2>
      <ol class="need">
        <li>Логотип в векторе — для заставки и печати</li>
        <li>Фотографии и рендеры жилых комплексов</li>
        <li>Тексты о компании и объектах (или соберём по вашим материалам)</li>
        <li>Домен и доступ к хостингу — либо оформим на вас</li>
      </ol>
    </div>
    <div>
      <h2 style="margin-top:7mm"><span class="num">6</span>Условия</h2>
      <ul class="terms">
        <li>Оплата: 50% к старту, 50% при запуске</li>
        <li>Один круг правок по макетам</li>
        <li>30 дней бесплатных исправлений после запуска</li>
        <li>Исходный код и панель — ваши</li>
      </ul>
    </div>
  </div>

  <h2><span class="num">7</span>Что можно добавить дальше</h2>
  <p style="color:{MUTED}">
    Первый этап — рабочий сайт с панелью. Всё ниже подключается позже, по одному, без переделки
    сайта: каждый пункт мы уже делали и показываем вживую на демонстрации.
  </p>
  {extras_html()}

  <div class="note">
    Разработка считается один раз, подписка — ежемесячно. Итоговый набор собираем вместе: назовите
    задачу, покажем экран и цену до начала работ.
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

out = HERE / "kp-mavera-etap-1.html"
out.write_text(HTML)
print("Собрано:", out, f"({round(len(HTML) / 1024)} КБ)")
