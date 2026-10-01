#!/usr/bin/env python3
"""
Коммерческое предложение AllClasses — доработка сайта и воронки плюс ежемесячное
сопровождение со статьями. Бланк и вёрстка те же, что у КП MAVERA; содержание
взято из аудита docs/allclasses-audit.md (вариант A + B, затем D).

Цены: стандартная ставка студии $26 за час (та же, что в смете MAVERA до скидки),
SEO-статьи — прайс студии ($380 / $550 в месяц). Для AllClasses на всё действует
скидка 30%: в документе стоят обе цифры, чтобы было видно, что скидка его.

    python3 docs/kp/build-kp-allclasses.py
    SRC=docs/kp/kp-allclasses.html OUT=docs/kp/KP-AllClasses.pdf node docs/kp/render.mjs
"""

import base64

import pathlib

HERE = pathlib.Path(__file__).resolve().parent

# Шрифты качает и кэширует сборщик КП MAVERA — берём его функцию, а не копию.
_src = (HERE / "build-kp-mavera.py").read_text()
_fonts_ns: dict = {"__file__": str(HERE / "build-kp-mavera.py")}
exec(_src[: _src.index("FONTS = fonts_css()")], _fonts_ns)
FONTS = _fonts_ns["fonts_css"]()

SIGN = base64.b64encode((HERE / "signature.png").read_bytes()).decode()
DATE_RU = "29 сентября 2026"
SIGN_DATE = "29.09.2026"
RATE = 11806.97  # сум за доллар, cbu.uz на 29.09.2026
RATE_TXT = "11 806,97"

HOUR = 26          # стандартная ставка студии, $ в час
DISCOUNT = 0.30    # скидка для AllClasses

# Бренд AllClasses: почти чёрный и оранжевый (сняты с allclasses.live).
DARK, ORANGE, ORANGE_DARK = "#161311", "#ff8a3d", "#c2560f"
INK, MUTED, SUBTLE, LINE = "#17140f", "#5b544a", "#6f675a", "#ece6df"


def usd(v: float) -> str:
    return "$" + f"{round(v):,}".replace(",", " ")


def mln(v: float) -> str:
    return f"{v * RATE / 1_000_000:.1f}".replace(".", ",") + " млн сум"


def off(v: float) -> float:
    return round(v * (1 - DISCOUNT))


# Что нашли в аудите → что делаем. Часы — оценка команды.
SMETA = [
    ("Аналитика и трекинг",
     "Meta Pixel и Conversions API; покупка — с сервера после ответа ATMOS; единые события в GA4, "
     "Метрике и Meta (пробник, регистрация, выбор тарифа, оплата); конверсия Google Ads на оплату; "
     "сохранение utm_content, utm_term, yclid и передача в вашу админку", 20),
    ("Новая главная ru и uz",
     "Первый экран вокруг ИИ-оценки Speaking с проверкой преподавателем; заголовок, title и "
     "description под запросы; блок «как работает оценка»; кнопка ведёт в пробник, а не в регистрацию", 18),
    ("Тексты",
     "Узбекская версия — вычитка и переписка носителем под узбекские запросы; единое обращение «вы» / "
     "«siz»; правки русской и английской версий на ключевых страницах", 16),
    ("Посадочные под рекламу",
     "Четыре страницы на ru и uz, по одному обещанию и одной кнопке: IELTS Speaking с ИИ, IELTS к дате "
     "экзамена, General English с нуля, Multilevel (CEFR)", 40),
    ("Короткий пробник Speaking",
     "Один вопрос Part 2 или 2–3 вопроса Part 1 — оценка сразу, полный тест после регистрации; "
     "вместо нынешних 14 записей до первой оценки", 24),
    ("Бесплатные уроки",
     "Видео и проверка ответов в бесплатных уроках открыты — гость видит продукт, а не текст без видео", 6),
    ("Регистрация",
     "Без повтора пароля; вход через Telegram; телефон или Telegram для связи с теми, кто не оплатил", 16),
    ("Тарифы и оплата",
     "Подача тарифов, лестница выгоды (цифры решаете вы), понятный срок возврата, способы оплаты на "
     "странице", 12),
    ("Блок доверия",
     "Кто ведёт уроки и кто проверяет Speaking, Telegram для вопросов, отзывы учеников по мере появления", 8),
    ("Техническое SEO и скорость",
     "Разметка FAQPage и Course с ценой; пустые страницы вне индекса; кнопки на телефоне не меньше 44 px; "
     "аудио Listening-теста грузится по нажатию, а не 20 МБ сразу", 12),
    ("Старт SEO",
     "Яндекс Вебмастер и Google Search Console, семантика ru и uz, карточки в каталогах kursy.uz, "
     "kursi24.uz, 2GIS", 12),
    ("Проверка и выкатка",
     "Сквозной путь «регистрация → оплата → урок» перед каждым релизом, выкатка, отчёт «до и после» "
     "по вашей админке", 10),
]
HOURS = sum(h for *_, h in SMETA)
LIST = HOURS * HOUR
PAY = off(LIST)
SAVE = LIST - PAY

DAYS = [
    ("Дни 1–2", "Доступы; Meta Pixel и Conversions API; единая схема событий; UTM и yclid"),
    ("Дни 3–4", "Новая главная ru и uz, тексты, вычитка узбекской версии"),
    ("Дни 5–7", "Тарифы, бесплатные уроки, техническое SEO → <b>релиз 1</b> после проверки «регистрация → оплата → урок»"),
    ("Дни 8–11", "Четыре посадочные на ru и uz, короткий пробник Speaking"),
    ("Дни 12–13", "Регистрация с Telegram, блок доверия"),
    ("Дни 14–15", "Старт SEO, сквозная проверка → <b>релиз 2</b>, отчёт «до и после»"),
]

# Ежемесячно: сопровождение + статьи. Статьи — прайс студии, сопровождение — часы по ставке.
PLANS = [
    ("Старт", 10, 12, "3 в неделю", 380, [
        "До 10 часов правок и доработок в месяц",
        "Контроль пикселя, событий и оплаты — чтобы реклама не училась вслепую",
        "12 SEO-статей в месяц на ru и uz: узбекские — латиницей и под узбекские запросы, не переводом",
        "Публикация, разметка, перелинковка на посадочные и курсы",
        "Отчёт раз в месяц: источник → пробник → регистрация → оплата",
    ]),
    ("Рост", 20, 20, "5 в неделю", 550, [
        "До 20 часов правок и доработок в месяц",
        "Всё из «Старта»",
        "20 SEO-статей в месяц на ru и uz",
        "Один A/B-тест в месяц: первый экран, пробник или тарифы",
        "Позиции и показы по ключевым запросам в Вебмастере и Search Console",
    ]),
]

EXTRAS = [
    ("Онбординг «когда экзамен и какой балл нужен → план занятий»", 16),
    ("Telegram-бот: практика Speaking, напоминания, вход в кабинет", 32),
    ("Режим Multilevel (CEFR) в пробнике и курсе — задания дают ваши преподаватели", 24),
    ("Оплата кошельками Payme и Click, если ATMOS их не подключает", 16),
]

WHY = [
    ("Реклама Meta работает вслепую.", "На сайте нет Meta Pixel: реклама не знает, кто зарегистрировался "
     "и оплатил, и оптимизируется под клики. Google Ads считает конверсией открытие урока, а не оплату."),
    ("Главное преимущество не видно.", "ИИ-оценка Speaking с проверкой преподавателем не упомянута ни на "
     "одной странице. На первом экране — «Онлайн-школа английского», как у всех."),
    ("До «вау-момента» слишком далеко.", "Пробный Speaking — 14 записей и больше 30 нажатий до первой "
     "оценки. В бесплатных видеоуроках видео закрыто подпиской."),
    ("Длинный тариф ничем не выгоднее.", "3, 6 и 12 месяцев стоят одинаково за день, хотя сайт обещает "
     "«чем длиннее, тем выгоднее»."),
    ("В нишевой выдаче сайта нет.", "По девяти запросам про IELTS и английский онлайн сайта нет в топ-20 "
     "Яндекса по Ташкенту. Ниши «IELTS Speaking с ИИ» на узбекском и Multilevel почти свободны."),
]


def smeta_rows() -> str:
    out = []
    for i, (name, what, h) in enumerate(SMETA, 1):
        out.append(
            f'<tr><td class="n">{i}</td><td><b>{name}.</b> <span class="d">{what}</span></td>'
            f'<td class="num">{h}</td><td class="num was">{usd(h * HOUR)}</td>'
            f'<td class="num money">{usd(off(h * HOUR))}</td></tr>'
        )
    return "".join(out)


def plans_html() -> str:
    out = []
    for name, hours, n, per_week, articles, bullets in PLANS:
        base = hours * HOUR + articles
        items = "".join(f"<li>{b}</li>" for b in bullets)
        out.append(
            f'<div class="plan"><p class="pn">{name}</p>'
            f'<p class="pp"><span class="was">{usd(base)}</span> <b>{usd(off(base))}</b> / мес</p>'
            f'<p class="ps">≈ {mln(off(base))} · статьи: {per_week}</p><ul>{items}</ul></div>'
        )
    return "".join(out)


def extras_rows() -> str:
    return "".join(
        f'<tr><td>{name}</td><td class="num was">{usd(h * HOUR)}</td><td class="num money">{usd(off(h * HOUR))}</td></tr>'
        for name, h in EXTRAS
    )


LOGO_SVG = """<svg width="42" height="42" viewBox="-112 -112 224 224" aria-hidden="true">
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
</svg>"""

HTML = f"""<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<title>Коммерческое предложение — AllClasses</title>
<style>
{FONTS}
@page {{ size: A4; margin: 14mm 0 12mm; }}
* {{ box-sizing: border-box; }}
html, body {{ margin: 0; padding: 0; background: #fff; }}
body {{
  font-family: "Manrope", "Liberation Sans", Arial, sans-serif; font-size: 9.4pt; line-height: 1.55; color: {INK};
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}}
.sheet {{ width: 210mm; margin: 0 auto; padding: 0 18mm; }}
h1, h2, h3 {{ margin: 0; font-weight: 600; }}
p {{ margin: 0 0 0.7em; }}
table {{ width: 100%; border-collapse: collapse; }}
.was {{ text-decoration: line-through; color: {SUBTLE}; font-weight: 400; }}

header.blank {{ display: flex; align-items: flex-start; justify-content: space-between; gap: 18px;
  border-bottom: 2px solid {INK}; padding-bottom: 10px; break-inside: avoid; }}
.brand {{ display: flex; align-items: center; gap: 11px; }}
.brand .name {{ margin: 0; font-size: 13pt; font-weight: 700; line-height: 1; }}
.brand .what {{ margin: 3px 0 0; font-size: 7.6pt; color: {MUTED}; }}
.contacts {{ text-align: right; font-size: 7.6pt; line-height: 1.5; color: {MUTED}; }}
.contacts p {{ margin: 0; }}

.title {{ margin-top: 10mm; text-align: center; font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 23pt; font-weight: 600; color: {DARK}; }}
.subtitle {{ margin-top: 3px; text-align: center; font-size: 10.5pt; color: {MUTED}; }}
.meta {{ display: flex; justify-content: space-between; margin-top: 8mm; font-size: 9pt; color: {MUTED}; }}
.parties {{ display: flex; gap: 26px; margin-top: 4mm; padding: 9px 12px; background: #fbf5ef; border-left: 3px solid {ORANGE}; }}
.parties div {{ font-size: 9pt; }}
.parties b {{ display: block; font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.1em; color: {SUBTLE}; font-weight: 600; }}
.lead {{ margin-top: 6mm; font-size: 10.2pt; line-height: 1.6; }}

.tiles {{ display: flex; gap: 8px; margin-top: 5mm; break-inside: avoid; }}
.tile {{ flex: 1; padding: 11px 13px; border: 1px solid {LINE}; border-radius: 3px; }}
.tile.pay {{ background: {DARK}; border-color: {DARK}; color: #fff; }}
.tile .k {{ margin: 0; font-size: 7.4pt; text-transform: uppercase; letter-spacing: 0.1em; color: {SUBTLE}; font-weight: 600; }}
.tile.pay .k {{ color: {ORANGE}; }}
.tile .v {{ margin: 4px 0 0; font-size: 15pt; font-weight: 700; line-height: 1.1; color: {DARK}; }}
.tile.pay .v {{ color: #fff; }}
.tile .v.was {{ color: {SUBTLE}; }}
.tile .s {{ margin: 2px 0 0; font-size: 7.8pt; color: {MUTED}; }}
.tile.pay .s {{ color: rgba(255,255,255,0.75); }}

.promise {{ margin-top: 4mm; padding: 10px 13px; background: {DARK}; color: #fff; border-radius: 3px; font-size: 9.4pt; break-inside: avoid; }}
.promise b {{ color: {ORANGE}; }}

h2 {{ margin-top: 7mm; padding-bottom: 4px; border-bottom: 1px solid {LINE}; font-size: 11.5pt; color: {DARK}; break-after: avoid; }}
h2 .num {{ color: {ORANGE_DARK}; font-weight: 700; margin-right: 7px; }}

ul.what {{ margin: 4mm 0 0; padding: 0; list-style: none; }}
ul.what li {{ margin-bottom: 2.6mm; padding-left: 15px; position: relative; break-inside: avoid; }}
ul.what li::before {{ content: ""; position: absolute; left: 0; top: 6px; width: 6px; height: 6px; background: {ORANGE}; }}
ul.what b {{ font-weight: 600; }}
ul.what span {{ color: {MUTED}; }}

table.smeta {{ margin-top: 4mm; font-size: 8.7pt; }}
table.smeta th {{ text-align: left; padding: 6px 7px; border-bottom: 1.5px solid {DARK};
  font-size: 7.2pt; text-transform: uppercase; letter-spacing: 0.08em; color: {SUBTLE}; font-weight: 600; }}
table.smeta td {{ padding: 5px 7px; border-bottom: 1px solid #f0ebe5; vertical-align: top; }}
table.smeta tr {{ break-inside: avoid; }}
table.smeta td.n {{ color: {SUBTLE}; width: 18px; }}
table.smeta .d {{ color: {MUTED}; }}
table.smeta .num {{ text-align: right; white-space: nowrap; font-variant-numeric: tabular-nums; width: 58px; }}
table.smeta th.num {{ text-align: right; }}
table.smeta .money {{ font-weight: 600; color: {DARK}; }}
tr.sum td {{ border-bottom: none; padding-top: 8px; font-weight: 600; }}
tr.sum.total td {{ border-top: 1.5px solid {DARK}; }}
tr.discount td {{ color: {ORANGE_DARK}; font-weight: 600; }}
tr.pay td {{ font-size: 12pt; font-weight: 700; color: {DARK}; padding-top: 4px; }}

table.days {{ margin-top: 4mm; font-size: 9pt; break-inside: avoid; }}
table.days td {{ padding: 5px 8px; border-bottom: 1px solid #f0ebe5; }}
table.days td:first-child {{ width: 74px; font-weight: 600; color: {ORANGE_DARK}; white-space: nowrap; }}

.plans {{ display: flex; gap: 10px; margin-top: 4mm; break-inside: avoid; }}
.plan {{ flex: 1; padding: 11px 13px; border: 1px solid {LINE}; border-radius: 3px; }}
.plan:last-child {{ border: 1.5px solid {ORANGE}; }}
.plan .pn {{ margin: 0; font-size: 7.6pt; text-transform: uppercase; letter-spacing: 0.1em; color: {ORANGE_DARK}; font-weight: 700; }}
.plan .pp {{ margin: 4px 0 0; font-size: 10pt; }}
.plan .pp b {{ font-size: 15pt; color: {DARK}; }}
.plan .ps {{ margin: 1px 0 6px; font-size: 7.8pt; color: {MUTED}; }}
.plan ul {{ margin: 0; padding-left: 15px; font-size: 8.5pt; }}
.plan li {{ margin-bottom: 1.4mm; }}

table.extras {{ margin-top: 3mm; font-size: 8.8pt; break-inside: avoid; }}
table.extras td {{ padding: 4px 8px; border-bottom: 1px solid #f0ebe5; }}
table.extras td.num {{ text-align: right; white-space: nowrap; width: 62px; font-variant-numeric: tabular-nums; }}
table.extras td.money {{ color: {DARK}; font-weight: 600; }}

.two {{ display: flex; gap: 14px; break-inside: avoid; }}
.two > div {{ flex: 1; }}
ol.need, ul.terms {{ margin: 3mm 0 0; padding-left: 16px; font-size: 8.8pt; }}
ol.need li, ul.terms li {{ margin-bottom: 1.8mm; }}

.note {{ margin-top: 3mm; padding: 9px 12px; background: #fbf5ef; border-left: 3px solid {ORANGE}; font-size: 8.5pt; color: {MUTED}; break-inside: avoid; }}

.sign {{ display: flex; justify-content: space-between; align-items: flex-end; margin-top: 9mm; break-inside: avoid; }}
.sign .who b {{ display: block; font-size: 10pt; }}
.sign .who span {{ font-size: 8.6pt; color: {MUTED}; }}
.sign .line {{ width: 62mm; }}
.sign .line .rule {{ position: relative; height: 15mm; border-bottom: 1px solid {INK}; }}
.sign .line .rule img {{ position: absolute; left: 5mm; bottom: -2px; width: 46mm; }}
.sign .line span {{ display: block; margin-top: 4px; font-size: 7.4pt; color: {SUBTLE}; }}

footer.blank {{ margin-top: 9mm; padding-top: 7px; border-top: 1px solid #d8d8d2; font-size: 7.4pt; line-height: 1.5; color: {SUBTLE}; break-inside: avoid; }}
footer.blank p {{ margin: 0; }}
footer.blank b {{ color: {MUTED}; }}
</style>
</head>
<body>
<div class="sheet">

  <header class="blank">
    <div class="brand">
      {LOGO_SVG}
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
  <p class="subtitle">AllClasses · больше целевого трафика и больше оплаченных подписок</p>

  <div class="meta"><span>Ташкент</span><span>{DATE_RU}</span></div>

  <div class="parties">
    <div><b>Кому</b>AllClasses · онлайн-школа английского, allclasses.live</div>
    <div><b>От кого</b>DevUz Studio · Егор Максимов</div>
    <div><b>Срок действия</b>14 календарных дней</div>
  </div>

  <p class="lead">
    Мы прошли ваш сайт как ученик — на телефоне и компьютере, от рекламы до оплаты — и сравнили
    с конкурентами. Сайт у вас технически сделан хорошо: быстрый, с правильной разметкой языков и
    картой сайта, метки рекламы не теряются. Новый сайт не нужен. Деньги теряются в другом —
    в том, что сайт говорит, как устроен пробник и что видит реклама. Это и исправляем:
    за 1,5–3 недели, двумя релизами, в вашем текущем сайте.
  </p>

  <div class="tiles">
    <div class="tile">
      <p class="k">Срок</p>
      <p class="v">1,5–3 недели</p>
      <p class="s">релиз 1 — через 7 рабочих дней, релиз 2 — через 15</p>
    </div>
    <div class="tile">
      <p class="k">Стоимость работ</p>
      <p class="v was">{usd(LIST)}</p>
      <p class="s">{HOURS} часов команды по стандартному прайсу</p>
    </div>
    <div class="tile pay">
      <p class="k">Для AllClasses −30%</p>
      <p class="v">{usd(PAY)}</p>
      <p class="s">≈ {mln(PAY)} · вы экономите {usd(SAVE)}</p>
    </div>
  </div>

  <div class="promise">
    <b>Скидка 30% — ваша на всё:</b> на доработку сайта, на ежемесячное сопровождение со статьями
    и на дополнительные работы из раздела 5. Везде в документе рядом стоят обе цены:
    зачёркнутая — стандартная, жирная — ваша.
  </div>

  <h2><span class="num">1</span>Что мешает продавать сейчас</h2>
  <ul class="what">
    {"".join(f"<li><b>{t}</b> <span>{d}</span></li>" for t, d in WHY)}
  </ul>
  <div class="note">
    Всё измерено на живом сайте 29 сентября 2026 года; подробный аудит с источниками — отдельным
    документом. Процентов роста не обещаем: замеров «до» у нас нет. Результат меряем в вашей же
    админке, где видно источник и оплату каждого студента, — до и после каждого релиза.
  </div>

  <h2><span class="num">2</span>Доработка сайта и воронки</h2>
  <table class="smeta">
    <thead><tr><th class="n"></th><th>Работа</th><th class="num">Часы</th><th class="num">Прайс</th><th class="num">Для вас</th></tr></thead>
    <tbody>
      {smeta_rows()}
      <tr class="sum total"><td></td><td>Итого по стандартному прайсу</td><td class="num">{HOURS}</td><td class="num">{usd(LIST)}</td><td class="num"></td></tr>
      <tr class="sum discount"><td></td><td>Скидка 30% для AllClasses</td><td class="num"></td><td class="num"></td><td class="num">−{usd(SAVE)}</td></tr>
      <tr class="pay"><td></td><td>К оплате</td><td class="num"></td><td class="num"></td><td class="num">{usd(PAY)}</td></tr>
    </tbody>
  </table>
  <div class="note">
    Цена в долларах, оплата в сумах по курсу ЦБ на день счёта. По курсу {RATE_TXT} сум за доллар
    (cbu.uz, 29.09.2026) это около {mln(PAY)}. Стандартная ставка — ${HOUR} за час работы команды,
    для вас — ${str(round(HOUR * (1 - DISCOUNT), 1)).replace('.', ',')}.
  </div>

  <h2><span class="num">3</span>Сроки: 1,5–3 недели, два релиза</h2>
  <table class="days"><tbody>
    {"".join(f"<tr><td>{d}</td><td>{t}</td></tr>" for d, t in DAYS)}
  </tbody></table>
  <div class="note">
    Дни рабочие, отсчёт — с получения доступов. Крупные правки показываем и согласуем до выкатки;
    перед каждым релизом проходим путь «регистрация → оплата → урок» на тестовом аккаунте.
  </div>

  <h2><span class="num">4</span>Сопровождение и статьи — в месяц</h2>
  <p style="margin-top:3mm;color:{MUTED}">
    После релизов сайт должен продолжать работать на трафик: правки, контроль рекламы и SEO-статьи
    на русском и узбекском под запросы, по которым вас сейчас нет в выдаче. Первые показы по
    узбекским запросам — через 1–2 месяца, заметный трафик — через 3–6. Поэтому рекомендуем
    не меньше трёх месяцев.
  </p>
  <div class="plans">{plans_html()}</div>

  <h2><span class="num">5</span>Что можно добавить — тоже со скидкой 30%</h2>
  <table class="extras"><tbody>{extras_rows()}</tbody></table>

  <div class="two">
    <div>
      <h2><span class="num">6</span>Что нужно от вас</h2>
      <ol class="need">
        <li>Доступ к репозиторию и серверу сайта — или контакт вашего разработчика</li>
        <li>Доступы: Meta Business, GA4, Google Ads, Яндекс Метрика</li>
        <li>Кабинет ATMOS — для покупки с сервера и уточнения кошельков</li>
        <li>Решение по тарифной лестнице</li>
        <li>Имена и фото преподавателей, кто проверяет Speaking</li>
        <li>Тестовый аккаунт для сквозной проверки</li>
      </ol>
    </div>
    <div>
      <h2><span class="num">7</span>Условия</h2>
      <ul class="terms">
        <li>Доработка: 50% к старту, 50% после релиза 2</li>
        <li>Сопровождение: предоплата за месяц, от 3 месяцев</li>
        <li>Скидка 30% действует на весь срок сопровождения</li>
        <li>Один круг правок на каждый релиз</li>
        <li>30 дней бесплатных исправлений после релиза 2</li>
        <li>Всё сделанное остаётся в вашем сайте и репозитории</li>
      </ul>
    </div>
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

out = HERE / "kp-allclasses.html"
out.write_text(HTML)
print("Собрано:", out, f"({round(len(HTML) / 1024)} КБ)", f"часы {HOURS}, прайс {usd(LIST)}, к оплате {usd(PAY)}")
