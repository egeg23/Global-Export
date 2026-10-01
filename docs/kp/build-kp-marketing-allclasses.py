#!/usr/bin/env python3
"""
КП AllClasses по маркетингу: заявки в школу. Не договор — предложение;
условия те же, что в Приложении № 5 к Договору № 4127.

Данные — docs/kp/allclasses_marketing.py: состав работ по каналам и рыночные
цены из таблицы владельца, цены для AllClasses назначены владельцем
01.10.2026 (наши услуги по каналу в месяц; рекламный бюджет $3 500 — сверх,
без комиссии).

Бланк, шрифты и стили — из build-kp-allclasses.py, без копирования.

    python3 docs/kp/build-kp-marketing-allclasses.py
    SRC=docs/kp/kp-marketing-allclasses.html OUT=docs/kp/KP-AllClasses-marketing.pdf node docs/kp/render.mjs
"""

import pathlib
import sys

HERE = pathlib.Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))
import allclasses_marketing as MK  # noqa: E402

_base = (HERE / "build-kp-allclasses.py").read_text()
ns: dict = {"__file__": str(HERE / "build-kp-allclasses.py")}
exec(_base[: _base.index("HTML = f\"\"\"")], ns)
CSS = eval('f"""' + _base[_base.index("<style>") + 7: _base.index("</style>")] + '"""', ns)
LOGO_SVG, SIGN, MUTED = ns["LOGO_SVG"], ns["SIGN"], ns["MUTED"]

DATE_RU, SIGN_DATE = "1 октября 2026", "01.10.2026"
som, d = MK.som, MK.dollars
BUDGET_SOM = MK.AD_BUDGET_USD * MK.RATE
TOTAL = MK.FEE + BUDGET_SOM


def channel_block(c: dict) -> str:
    rows = "".join(f'<tr><td class="d">{w}</td><td class="num was" style="width:96px">{som(v)}</td></tr>' for w, v in c["works"])
    budget = next(v for k, v, _ in MK.SPLIT if k == c["key"])
    return (f'<table class="smeta ch"><thead><tr><th>{c["name"]}</th><th class="num">Рынок</th></tr></thead><tbody>{rows}'
            f'<tr><td class="d">Старт без доплаты: {", ".join(c["setup"])}</td><td class="num was">{som(c["market_first"] - c["market"])}</td></tr>'
            f'<tr class="pay"><td>Для AllClasses — в месяц <span class="d" style="font-size:8.5pt;font-weight:400">'
            f'· рекламный бюджет канала на старте {d(budget)}</span></td>'
            f'<td class="num">{som(c["price"])}<br><span class="d" style="font-size:8pt">≈ {d(c["usd"])} · рынок {som(c["market"])}</span></td></tr>'
            "</tbody></table>")


def split_table() -> str:
    rows = []
    for key, v, parts in MK.SPLIT:
        rows.append(f'<tr><td><b>{MK.NAMES[key]}</b></td><td class="num money">{d(v)}</td><td class="num">{round(v * 100 / MK.AD_BUDGET_USD)}%</td></tr>')
        rows += [f'<tr><td class="d" style="padding-left:18px">{n}</td><td class="num d">{d(x)}</td><td></td></tr>' for n, x in parts]
    rows.append(f'<tr class="sum total"><td>Рекламный бюджет в месяц</td><td class="num">{d(MK.AD_BUDGET_USD)}</td><td class="num">100%</td></tr>')
    return ('<table class="smeta"><thead><tr><th>Канал и кампании</th><th class="num">В месяц</th><th class="num">Доля</th></tr></thead><tbody>'
            + "".join(rows) + "</tbody></table>")


STEPS = [
    ("Неделя 1", "Медиаплан и стратегия, доступы к кабинетам, проверка пикселя и событий, семантика, креативы и тексты на ru и uz"),
    ("Недели 2–4", "Тестовый месяц: запуск всех четырёх каналов, поиск связок «аудитория — оффер — креатив», перераспределение бюджета каждую неделю"),
    ("Месяц 2", "Письменный план: число заявок и цена заявки по каждому каналу — по фактам теста, дополнительным соглашением к договору"),
    ("Дальше", "Бюджет идёт туда, где дешевле оплаченная подписка, а не клик или заявка; слабые кампании отключаем"),
]

HTML = f"""<!doctype html>
<html lang="ru"><head><meta charset="utf-8">
<title>Коммерческое предложение — маркетинг AllClasses</title>
<style>{CSS}
table.smeta.ch {{ margin-top: 3mm; font-size: 8.2pt; }}
table.smeta.ch td {{ padding: 2.5px 7px; }}
table.smeta.ch tr.pay td {{ font-size: 10.5pt; padding-top: 5px; }}
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
    Вам нужны заявки в школу — этот вопрос берём на себя целиком. Ведём рекламу в четырёх каналах, где ищут
    английский и IELTS в Узбекистане: Instagram и Facebook, Google, Яндекс и Telegram. Креативы и тексты — на русском
    и узбекском. Каждую заявку считаем в вашей админке, от клика до оплаты. Сайт доводим по договору на доработку:
    пиксель, посадочные под объявления и короткий пробный Speaking — реклама с ними платит за учеников, а не за клики.
  </p>

  <div class="tiles">
    <div class="tile"><p class="k">Наша работа, 4 канала</p><p class="v">{som(MK.FEE)}</p>
      <p class="s">в месяц, ≈ {d(MK.FEE_USD)} · на рынке <span class="was">{som(MK.MARKET)}</span></p></div>
    <div class="tile"><p class="k">Рекламный бюджет</p><p class="v">{d(MK.AD_BUDGET_USD)}</p>
      <p class="s">в месяц, в ваши кабинеты · ≈ {som(BUDGET_SOM)}</p></div>
    <div class="tile pay"><p class="k">Всего в месяц</p><p class="v">≈ {som(TOTAL)}</p>
      <p class="s">≈ {d(MK.FEE_USD + MK.AD_BUDGET_USD)} · комиссии с бюджета нет</p></div>
  </div>

  <div class="promise">
    <b>Что вы не платите:</b> стартовые работы первого месяца — медиаплан, стратегия, семантика, профили Google и Яндекс
    (на рынке первый месяц стоит {som(MK.MARKET_FIRST)}), и комиссию с рекламного бюджета (на рынке — 10%).
    Ниже по каждому каналу — полный состав работ с рыночной ценой и ваша цена.
  </div>

  <h2><span class="num">1</span>Каналы: что делаем и сколько стоит</h2>
  {"".join(channel_block(c) for c in MK.CHANNELS)}
  <div class="note">
    Рыночные цены — по смете маркетингового агентства полного цикла из Ташкента, 2026 год, без НДС, по расчётному курсу
    {MK.RATE:,} сум за доллар. Наши цены НДС не облагаются.
  </div>

  <h2><span class="num">2</span>Как распределим ваши {d(MK.AD_BUDGET_USD)} на рекламу</h2>
  <p style="margin-top:3mm;color:{MUTED}">
    Больше всего — в Meta: там ваша аудитория, и туда встаёт ретаргетинг на тех, кто начал пробный Speaking и не оплатил.
    Бюджет идёт напрямую в ваши рекламные кабинеты, примерно {d(MK.AD_BUDGET_USD / 4)} в неделю.
    Со второго месяца доли меняем по результатам: до 20% бюджета перекладываем в каналы с самой дешёвой оплаченной подпиской.
  </p>
  {split_table()}

  <h2><span class="num">3</span>Как мы закрываем вопрос с заявками</h2>
  <table class="days"><tbody>
    {"".join(f"<tr><td>{a}</td><td>{b}</td></tr>" for a, b in STEPS)}
  </tbody></table>
  <ul class="what">
    <li><b>Что считаем заявкой.</b> <span>Регистрацию или пройденный пробный Speaking с контактом — определение фиксируем
      до старта. Считаем в вашей админке по меткам рекламы, а не в отчётах кабинетов.</span></li>
    <li><b>Оптимизируем на оплату, а не на клик.</b> <span>Meta и Google учатся на событии оплаты с сервера — это делается
      по договору на доработку, поэтому рекламу запускаем после его первого релиза.</span></li>
    <li><b>Отчёт каждую неделю.</b> <span>Расход, заявки, цена заявки и оплаты по каждому каналу и кампании; что отключили,
      что масштабируем.</span></li>
    <li><b>План с цифрой — после теста.</b> <span>Цену заявки в вашей нише покажет только тестовый месяц. Со второго месяца
      план по заявкам и их цене записываем в дополнительное соглашение.</span></li>
  </ul>

  <h2><span class="num">4</span>По желанию: SMM — ведение Instagram</h2>
  <table class="smeta"><tbody>
    <tr><td><b>SMM под ключ.</b> <span class="d">Стратегия и SMM-дизайн, контент-план, 8 рилс и 4 публикации, 30 сторис в месяц,
      тексты на ru и uz, постинг в Instagram, Facebook и Telegram, ответы на комментарии и сообщения, аналитика.
      Первый месяц со стратегией: <span class="was">{som(MK.SMM["market_first"])}</span> <b>{som(MK.SMM["price_first"])}</b>.</span></td>
      <td class="num money" style="width:118px"><span class="was">{som(MK.SMM["market"])}</span><br><b>{som(MK.SMM["price"])}</b> / мес</td></tr>
  </tbody></table>

  <div class="two">
    <div>
      <h2><span class="num">5</span>Что нужно от вас</h2>
      <ol class="need">
        <li>Доступы к кабинетам Meta, Google Ads, Яндекс Директ, Telegram Ads — или создадим на вас</li>
        <li>Пополнение кабинетов рекламным бюджетом до начала месяца</li>
        <li>Согласование креативов в течение 2 рабочих дней</li>
        <li>Доступ к отчёту по источникам и оплатам в админке</li>
      </ol>
    </div>
    <div>
      <h2><span class="num">6</span>Условия</h2>
      <ul class="terms">
        <li>Предоплата за месяц до 5-го числа, минимальный срок — 3 месяца</li>
        <li>Цены в сумах, НДС не облагается</li>
        <li>Кабинеты, аудитории и материалы — ваши</li>
        <li>Входит в Договор № 4127, Приложение № 5</li>
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
</div></body></html>""".replace(f"{MK.RATE:,}", f"{MK.RATE:,}".replace(",", " "))

out = HERE / "kp-marketing-allclasses.html"
out.write_text(HTML)
print("Собрано:", out, "| работа", som(MK.FEE), "| всего", som(TOTAL))
