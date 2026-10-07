# Apollo Travel (goapollo.uz) — исследование к макету

07.10.2026. Сайт агентства — набор модулей Tourvisor (`//tourvisor.ru/module/init.js`):
`tv-image-slider`, `tv-search-form`, `tv-history`, `tv-hot-tours`, `tv-calendar`,
`tv-min-price`, `tv-free-button`, у каждого свой `tv-moduleid-…` агентства. Новый сайт —
«переодеть»: модули и их ID остаются, наше — оформление, форма, ожидание поиска и всё
вокруг.

## Как форма передаёт поиск модулю

Модуль сам читает адрес (`findSettingsFromUrl`): наша форма ведёт на страницу с
`tv-search-form` и строкой
`?ts_dosearch=1&s_flyfrom=<id вылета>&s_country=<id>&s_j_date_from=ДД.ММ.ГГГГ&s_j_date_to=ДД.ММ.ГГГГ&s_nights_from=7&s_nights_to=10&s_adults=2&s_child=…&s_currency=…`.
ID Ташкента и стран — из конструктора модулей Tourvisor. Карточка тура — `#tvtourid=…`.
Оформление модуля: в конструкторе Tourvisor (цвета, шрифты) и переменные
`--tv-main-color`, `--tv-search-button-color`, `--tv-price-color`, `--tv-font-theme1/2`.

Авиабилеты — белая метка Aviasales (Travelpayouts): цвета, шрифт, скругления;
ссылка `/flights/?origin_iata=TAS&destination_iata=IST&depart_date=…&adults=1`.

## Что взяли у рынка

- Onlinetours: длинная форма-пилюля и счётчик «опрошено N из M туроператоров» при поиске.
- Tutu: вкладки «Туры / Авиа / Отели» над одной формой.
- Level.Travel, Google Flights, Hopper: календарь цен, «куда за мой бюджет», цвет дней.
- Travelata, Sletat: горящие с обратным отсчётом и старой ценой.
- Aviasales: самолёт по дуге и живые фразы, пока идёт поиск.
- Местные (Asialuxe, Kompas, 1travel.uz): рассрочка, цена в $, офис и Telegram на виду.
- 21st.dev / Magic UI / Aceternity: глобус cobe с дугами, бегущая строка логотипов,
  посадочный талон, счётчик цен, подсветка карточек под курсором — написаны свои.

## Ориентиры цен из Ташкента (за человека, ~7 ночей)

Анталья от $876, Мальдивы от $947 (kun.uz, 07.2025); Дубай ~$600 в низкий сезон,
Египет ~$400–450, Пхукет $560–1045 (1travel.uz, turtopar.uz). Вьетнам и Шри-Ланка —
без надёжного источника. Для макета это примеры; на сайте цены даёт `tv-min-price`.
