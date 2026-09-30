#!/usr/bin/env python3
"""
КП AllClasses по маркетингу: лиды в школу. Не договор — предложение.

Цены: за базу взяты рыночные цены маркетингового агентства полного цикла из
Ташкента (присланное владельцем КП 2026 года, цены в сумах без НДС). Для
AllClasses от всех цен — и от услуг, и от комиссий с рекламного бюджета —
скидка 30%. Названия агентства в документе нет: это наш прайс-ориентир, а не
чужое предложение.

Бланк, шрифты и стили — те же, что у КП на доработку (build-kp-allclasses.py):
оттуда берутся без копирования.

    python3 docs/kp/build-kp-marketing-allclasses.py
    SRC=docs/kp/kp-marketing-allclasses.html OUT=docs/kp/KP-AllClasses-marketing.pdf node docs/kp/render.mjs
"""

import pathlib

HERE = pathlib.Path(__file__).resolve().parent
_base = (HERE / "build-kp-allclasses.py").read_text()
ns: dict = {"__file__": str(HERE / "build-kp-allclasses.py")}
exec(_base[: _base.index("HTML = f\"\"\"")], ns)
CSS = eval('f"""' + _base[_base.index("<style>") + 7: _base.index("</style>")] + '"""', ns)
LOGO_SVG, SIGN = ns["LOGO_SVG"], ns["SIGN"]
DARK, ORANGE, ORANGE_DARK, MUTED = ns["DARK"], ns["ORANGE"], ns["ORANGE_DARK"], ns["MUTED"]

DATE_RU, SIGN_DATE = "30 сентября 2026", "30.09.2026"
RATE, RATE_TXT = 11821.18, "11 821,18"   # cbu.uz на 30.09.2026
DISCOUNT = 0.30


def som(v: float) -> str:
    return f"{round(v):,}".replace(",", " ") + " сум"


def off(v: float) -> float:
    return round(v * (1 - DISCOUNT) / 1000) * 1000


def usd(v: float) -> str:
    return "≈ $" + f"{round(v / RATE):,}".replace(",", " ")


# Услуги: (название, что входит, ежемесячно, первый месяц или None, комиссия с бюджета)
SETUP = [
    ("Стратегия и медиаплан",
     "Аудитории (IELTS, General English, Multilevel; ru и uz), офферы под каждую, распределение бюджета по каналам, "
     "цели по заявкам и цене заявки, схема подсчёта лида в вашей админке", 6_800_000),
]
CHANNELS = [
    ("Таргетированная реклама Meta (Instagram, Facebook)",
     "Кампании на регистрацию и пробный Speaking, ретаргетинг на тех, кто начал пробник и не оплатил, "
     "лид-формы, креативы и тексты на ru и uz, еженедельная оптимизация", 8_000_000, 10_000_000, 10),
    ("Реклама в Telegram (Telegram Ads)",
     "Подбор каналов про английский, IELTS и учёбу за рубежом, медиаплан, запуск и ведение кампаний, отчётность", 3_300_000, 4_900_000, 10),
    ("Контекстная реклама Google и Яндекс",
     "Поиск по запросам «IELTS онлайн», «IELTS tayyorlov», «ingliz tili onlayn» и подобным, ремаркетинг КМС и РСЯ, "
     "Google и Яндекс Бизнес, настройка конверсий", 10_350_000, 13_550_000, 10),
]
CONTENT = [
    ("Видео-рилс для рекламы — 3 ролика в месяц",
     "Сценарии, съёмка на телефон, монтаж до 60 секунд, тексты на ru и uz. Формат «разбор ответа Speaking» и «как выглядит оценка ИИ»",
     9_400_000, None, None),
    ("Посевы в Telegram-каналах и у блогеров",
     "Подбор каналов и преподавателей-блогеров по IELTS и Multilevel, креативы, размещение, отчёт по заявкам с каждого размещения",
     8_000_000, None, 20),
]
OPTIONS = [
    ("SMM: ведение Instagram под ключ",
     "Стратегия, контент-план, 8 рилс и 4 публикации, 30 сторис в месяц, тексты на ru и uz, ответы на комментарии и сообщения",
     25_840_000, 39_840_000, 20),
    ("Отдел продаж и CRM: дожим тех, кто не оплатил",
     "Воронка в CRM, скрипты звонков и сообщений в Telegram, обучение менеджера, дашборд «заявка → оплата»; разово, 1,5 месяца",
     22_000_000, None, None, True),
]


def row(name, what, monthly, first=None, commission=None, once=False):
    price = (f'<span class="was">{som(monthly)}</span><br><b>{som(off(monthly))}</b>'
             + ("" if once else " / мес"))
    extra = []
    if first:
        extra.append(f'первый месяц с запуском: <span class="was">{som(first)}</span> <b>{som(off(first))}</b>')
    if commission:
        extra.append(f'комиссия с рекламного бюджета: <span class="was">{commission}%</span> <b>{round(commission * (1 - DISCOUNT))}%</b>')
    sub = f'<div class="d" style="margin-top:3px">{" · ".join(extra)}</div>' if extra else ""
    return f'<tr><td><b>{name}.</b> <span class="d">{what}</span>{sub}</td><td class="num money" style="width:118px">{price}</td></tr>'


def table(items, once=False):
    return ('<table class="smeta"><thead><tr><th>Услуга</th><th class="num">Рынок → для вас</th></tr></thead><tbody>'
            + "".join(row(*x[:5], once=once or (len(x) > 5 and x[5])) if len(x) >= 5 else row(x[0], x[1], x[2], once=True) for x in items)
            + "</tbody></table>")


def pkg(items):
    monthly = sum(x[2] for x in items)
    first = sum((x[3] or x[2]) for x in items)
    return monthly, first


L_M, L_F = pkg(CHANNELS)
P_M, P_F = pkg(CHANNELS + CONTENT)
SETUP_P = SETUP[0][2]

PACKAGES = [
    ("Лиды", "Три рекламных канала под ключ", L_M, L_F + SETUP_P,
     ["Meta, Telegram Ads, Google и Яндекс", "Стратегия и медиаплан на старте", "Креативы и тексты на ru и uz",
      "Еженедельный отчёт: заявки и цена заявки по каналам"]),
    ("Лиды + контент", "Каналы, свои ролики и посевы", P_M, P_F + SETUP_P,
     ["Всё из пакета «Лиды»", "3 рекламных рилс в месяц", "Посевы в Telegram-каналах и у блогеров",
      "План по заявкам на месяц с цифрой — после тестового месяца"]),
]


def packages_html():
    out = []
    for name, tag, m, f, items in PACKAGES:
        li = "".join(f"<li>{x}</li>" for x in items)
        out.append(
            f'<div class="plan"><p class="pn">{name}</p><p class="ps" style="margin:2px 0 4px">{tag}</p>'
            f'<p class="pp"><span class="was">{som(m)}</span><br><b>{som(off(m))}</b> / мес</p>'
            f'<p class="ps">{usd(off(m))} · первый месяц со стратегией: {som(off(f))}</p><ul>{li}</ul></div>'
        )
    return "".join(out)


STEPS = [
    ("Неделя 1", "Стратегия и медиаплан, доступы к рекламным кабинетам, проверка пикселя и событий, креативы на ru и uz"),
    ("Недели 2–4", "Тестовый месяц: запуск всех каналов, поиск связок «аудитория — оффер — креатив», перераспределение бюджета еженедельно"),
    ("Месяц 2", "Фиксируем письменно план по заявкам и цену заявки по каждому каналу — по фактам тестового месяца, а не на глаз"),
    ("Дальше", "Масштабируем то, что приносит оплаты: бюджет идёт в каналы с лучшей ценой оплаченной подписки, а не заявки"),
]

HTML = f"""<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<title>Коммерческое предложение — маркетинг AllClasses</title>
<style>{CSS}
table.smeta td b {{ font-weight: 600; }}
</style></head><body><div class="sheet">

  <header class="blank">
    <div class="brand">{LOGO_SVG}
      <div><p class="name">DevUz Studio</p><p class="what">Разработка, маркетинг и ИИ-продукты · Ташкент</p></div>
    </div>
    <div class="contacts"><p>devuz.studio</p><p>t.me/Devuz_studio_bot</p><p>Ташкент, улица Шота Руставели, 138</p></div>
  </header>

  <h1 class="title">Коммерческое предложение</h1>
  <p class="subtitle">AllClasses · маркетинг и заявки в школу под ключ</p>
  <div class="meta"><span>Ташкент</span><span>{DATE_RU}</span></div>
  <div class="parties">
    <div><b>Кому</b>AllClasses · онлайн-школа английского, allclasses.live</div>
    <div><b>От кого</b>DevUz Studio · Егор Максимов</div>
    <div><b>Срок действия</b>14 календарных дней</div>
  </div>

  <p class="lead">
    Вам нужны заявки в школу — мы берём этот вопрос на себя целиком: реклама во всех каналах, где ищут
    английский и IELTS в Узбекистане, креативы на русском и узбекском, посевы, и подсчёт каждой заявки
    в вашей же админке — от клика до оплаты. Сайт при этом доводим по договору на доработку: пиксель,
    посадочные под каждое объявление и короткий пробный Speaking. Реклама без них платит за клики,
    с ними — за учеников.
  </p>

  <div class="promise">
    <b>Скидка 30% — от всех цен:</b> ведение каналов, контент, посевы и комиссии с рекламного бюджета.
    Везде рядом стоят обе цифры: зачёркнутая — рыночная цена в Ташкенте, жирная — ваша.
    НДС не начисляется.
  </div>

  <h2><span class="num">1</span>Пакеты — в месяц</h2>
  <div class="plans">{packages_html()}</div>
  <div class="note">
    Рекламный бюджет оплачивается отдельно, напрямую в рекламные кабинеты; наша комиссия с него — 7% вместо 10%
    (для посевов и блогеров — 14% вместо 20%). Рекомендуемый стартовый бюджет — от $500 на канал в тестовый месяц.
    Суммы в сумах; в долларах — по курсу ЦБ {RATE_TXT} (cbu.uz, 30.09.2026).
  </div>

  <h2><span class="num">2</span>Как мы закрываем вопрос с заявками</h2>
  <table class="days"><tbody>
    {"".join(f"<tr><td>{d}</td><td>{t}</td></tr>" for d, t in STEPS)}
  </tbody></table>
  <ul class="what">
    <li><b>Что считаем заявкой.</b> <span>Регистрацию или пройденный пробный Speaking с контактом — определение фиксируем
      вместе до старта. Считаем в вашей админке по меткам рекламы, а не в отчётах кабинетов.</span></li>
    <li><b>Оптимизируем на оплату, а не на клик.</b> <span>Meta и Google учатся на событии оплаты с сервера — это делается
      по договору на доработку. Поэтому рекламу разумно запускать после его первого релиза.</span></li>
    <li><b>Отчёт каждую неделю.</b> <span>Заявки, цена заявки и оплаты по каждому каналу и объявлению; что отключили,
      что масштабируем.</span></li>
    <li><b>План с цифрой — после теста.</b> <span>Называть число заявок до первого месяца значило бы гадать: цену заявки
      в вашей нише покажет только тест. Со второго месяца план и цена заявки записываются в допсоглашение.</span></li>
  </ul>

  <h2><span class="num">3</span>Стартовые работы — разово</h2>
  {table(SETUP, once=True)}

  <h2><span class="num">4</span>Рекламные каналы — ежемесячно</h2>
  {table(CHANNELS)}

  <h2><span class="num">5</span>Контент и посевы — ежемесячно</h2>
  {table(CONTENT)}

  <h2><span class="num">6</span>По желанию</h2>
  {table(OPTIONS)}

  <div class="two">
    <div>
      <h2><span class="num">7</span>Что нужно от вас</h2>
      <ol class="need">
        <li>Доступы к рекламным кабинетам Meta, Google Ads, Яндекс Директ, Telegram Ads — или создадим на вас</li>
        <li>Решение по рекламному бюджету на тестовый месяц</li>
        <li>Преподаватель на 1–2 часа в месяц для съёмки роликов</li>
        <li>Доступ к отчёту по источникам и оплатам в админке</li>
      </ol>
    </div>
    <div>
      <h2><span class="num">8</span>Условия</h2>
      <ul class="terms">
        <li>Предоплата за месяц, минимальный срок — 3 месяца</li>
        <li>Скидка 30% — на весь срок работы</li>
        <li>Рекламные кабинеты и все материалы — ваши</li>
        <li>Оформляется допсоглашением к Договору № 4127</li>
      </ul>
    </div>
  </div>

  <div class="sign">
    <div class="who"><b>Егор Максимов</b><span>DevUz Studio · t.me/Devuz_studio_bot</span></div>
    <div class="line"><div class="rule"><img src="data:image/png;base64,{SIGN}" alt="Подпись"></div><span>Подпись · {SIGN_DATE}</span></div>
  </div>

  <footer class="blank">
    <p><b>ИП MAKSIMOV EGOR ANDREEVICH</b> · Республика Узбекистан, г. Ташкент, улица Шота Руставели, 138 · ПИНФЛ 32303946570039</p>
    <p>Предложение носит информационный характер и не является публичной офертой. Состав работ и цена фиксируются договором.</p>
  </footer>
</div></body></html>"""

out = HERE / "kp-marketing-allclasses.html"
out.write_text(HTML)
print("Собрано:", out, "| Лиды:", som(off(L_M)), "/мес | Лиды+контент:", som(off(P_M)), "/мес")
