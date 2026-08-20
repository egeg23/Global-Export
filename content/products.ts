import type { Product } from "@/lib/content/types";

/**
 * Product catalogue. Names, calibration and the purity/moisture figures are
 * taken from globalex.uz; packing, MOQ and HS codes are industry-standard
 * values that the client should confirm before launch.
 */
export const products: Product[] = [
  {
    "slug": "green-mung-beans",
    "category": "beans",
    "name": {
      "en": "Green Mung Beans",
      "ru": "Зеленый маш",
      "uz": "Yashil mosh"
    },
    "latinName": "Vigna radiata",
    "description": {
      "en": "Uzbek green mung bean is machine-cleaned and colour-sorted, with even grain and a bright green seed coat; the bulk of the crop is grown as a second harvest after winter wheat. Purity of 99% and moisture held at 11% max. give the lot the reserve it needs for long rail and sea transit and allow packing without re-cleaning at destination. Standard uses are dal and soups, mung flour and starch, noodle production, with the split fraction supplied for milling programmes.",
      "ru": "Узбекский зелёный маш проходит машинную очистку и фотосепарацию: зерно выровненное, оболочка ярко-зелёная, основной объём убирается вторым урожаем после озимой пшеницы. Чистота 99% и влажность не выше 11% дают запас по срокам при железнодорожной и морской доставке и позволяют фасовать товар без дополнительной подработки на месте. Применяется для дала и супов, машевой муки и крахмала, лапши; дроблёная фракция поставляется под помольные программы.",
      "uz": "O‘zbek yashil moshi mashinada tozalanib, rang bo‘yicha saralanadi: doni bir tekis, po‘sti yorqin yashil, asosiy hajm kuzgi bug‘doydan keyingi takroriy ekin sifatida yetishtiriladi. 99% tozalik va 11% dan oshmagan namlik uzoq temir yo‘l va dengiz yo‘lida zaxira beradi hamda mahsulotni joyida qayta tozalamasdan qadoqlash imkonini beradi. Dal va sho‘rvalar, mosh uni va kraxmali, ugra ishlab chiqarishda ishlatiladi; maydalangan fraksiya tegirmon dasturlari uchun yetkaziladi."
    },
    "specs": [
      {
        "label": {
          "en": "Calibre / count",
          "ru": "Калибр / счётность",
          "uz": "Kalibr / donadorlik"
        },
        "value": {
          "en": "+3 mm /+3,5 mm / Splited",
          "ru": "+3 мм. / +3,5 мм. / Дроблёный",
          "uz": "+3 mm / +3,5 mm / maydalangan"
        }
      },
      {
        "label": {
          "en": "Purity",
          "ru": "Чистота",
          "uz": "Tozaligi"
        },
        "value": {
          "en": "99% min.",
          "ru": "99% мин.",
          "uz": "99% min."
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "11% max.",
          "ru": "11% макс.",
          "uz": "11% maks."
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months from packing date, dry ventilated warehouse, 10–20 °C",
          "ru": "12 месяцев с даты фасовки, сухой вентилируемый склад, 10–20 °C",
          "uz": "Qadoqlangan sanadan 12 oy, quruq shamollatiladigan omborda, 10–20 °C"
        }
      },
      {
        "label": {
          "en": "Minimum order / delivery terms",
          "ru": "Минимальная партия / условия поставки",
          "uz": "Minimal partiya / yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga ko‘ra"
        }
      }
    ],
    "image": "/images/products/green-mung-beans.jpg",
    "featured": true,
    "regions": {
      "en": "Kashkadarya, Surkhandarya and Jizzakh regions, plus irrigated districts of Samarkand region — mainly as a second crop after winter wheat.",
      "ru": "Кашкадарьинская, Сурхандарьинская и Джизакская области, а также орошаемые районы Самаркандской области — преимущественно вторым урожаем после озимой пшеницы.",
      "uz": "Qashqadaryo, Surxondaryo va Jizzax viloyatlari, shuningdek Samarqand viloyatining sug‘oriladigan tumanlari — asosan kuzgi bug‘doydan keyingi takroriy ekin sifatida."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga ko‘ra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
    },
    "hsCode": "0713.31"
  },
  {
    "slug": "green-mung-beans-sprouting",
    "category": "beans",
    "name": {
      "en": "Green Mung Beans for Sprouting",
      "ru": "Зелёный маш для проращивания",
      "uz": "Undirish uchun yashil mosh"
    },
    "latinName": "Vigna radiata",
    "description": {
      "en": "A dedicated sprouting grade: only the large +3,5 mm and 4 mm fractions, selected for intact seed coat and tested germination above 90%. Gentle cleaning and optical sorting keep mechanical damage low, which is exactly what determines sprout yield and shelf appearance for the end customer. Supplied to sprouting houses, fresh-produce packers and HoReCa distributors; each lot ships with a germination test and phytosanitary certificate.",
      "ru": "Отдельный сорт под проращивание: только крупные фракции +3,5 мм и 4 мм, отобранные по целостности оболочки, всхожесть подтверждается на уровне 90% и выше. Щадящая очистка и оптическая сортировка минимизируют механические повреждения зерна — именно они определяют выход ростков и их товарный вид у конечного покупателя. Поставляется предприятиям по проращиванию, фасовщикам свежей продукции и дистрибьюторам HoReCa; каждая партия сопровождается протоколом всхожести и фитосанитарным сертификатом.",
      "uz": "Undirishga mo‘ljallangan alohida nav: faqat yirik +3,5 mm va 4 mm fraksiyalar, po‘sti butunligi bo‘yicha saralanadi, unuvchanligi 90% va undan yuqori darajada tasdiqlanadi. Ehtiyotkor tozalash va optik saralash mexanik shikastlanishni kamaytiradi — aynan shu ko‘rsatkich nihollar hosili va savdo ko‘rinishini belgilaydi. Undirish korxonalari, yangi mahsulot qadoqlovchilari va HoReCa distribyutorlariga yetkaziladi; har bir partiya unuvchanlik bayonnomasi va fitosanitar sertifikat bilan jo‘natiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Calibre / count",
          "ru": "Калибр / счётность",
          "uz": "Kalibr / donadorlik"
        },
        "value": {
          "en": "+3,5 mm / 4 mm",
          "ru": "+3,5 мм / 4 мм",
          "uz": "+3,5 mm / 4 mm"
        }
      },
      {
        "label": {
          "en": "Purity",
          "ru": "Чистота",
          "uz": "Tozaligi"
        },
        "value": {
          "en": "99% min.",
          "ru": "99% мин.",
          "uz": "99% min."
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "11% max.",
          "ru": "11% макс.",
          "uz": "11% maks."
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months from packing date; germination 90% min. guaranteed for the first 6 months",
          "ru": "12 месяцев с даты фасовки; всхожесть не менее 90% гарантируется первые 6 месяцев",
          "uz": "Qadoqlangan sanadan 12 oy; dastlabki 6 oy davomida kamida 90% unuvchanlik kafolatlanadi"
        }
      },
      {
        "label": {
          "en": "Minimum order / delivery terms",
          "ru": "Минимальная партия / условия поставки",
          "uz": "Minimal partiya / yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga ko‘ra"
        }
      }
    ],
    "image": "/images/products/green-mung-beans-sprouting.jpg",
    "regions": {
      "en": "Kashkadarya, Surkhandarya and Jizzakh regions; seed lots for sprouting are selected from fields with early, dry harvesting conditions.",
      "ru": "Кашкадарьинская, Сурхандарьинская и Джизакская области; партии под проращивание отбираются с полей ранней уборки в сухих условиях.",
      "uz": "Qashqadaryo, Surxondaryo va Jizzax viloyatlari; undirishga mo‘ljallangan partiyalar erta va quruq sharoitda o‘rib olingan dalalardan tanlanadi."
    },
    "packaging": {
      "en": "25 kg PP bags with food-grade inner liner, big bags 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 кг с пищевым вкладышем, биг-бэги 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "Oziq-ovqatga yaroqli ichki qoplamali 25 kg PP qoplar, 1000 kg big-beglar, talabga ko‘ra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
    },
    "hsCode": "0713.31"
  },
  {
    "slug": "red-speckled-kidney-beans",
    "category": "beans",
    "name": {
      "en": "Red Speckled Kidney Beans",
      "ru": "Фасоль \"Красная\"",
      "uz": "Qizil chipor loviya"
    },
    "latinName": "Phaseolus vulgaris",
    "description": {
      "en": "Deep red bean with dark speckling, calibrated at 200–220 pieces per 100 g — the size most canners and retail packers in Europe, Turkey and the Gulf specify. The bean keeps its shape and skin after soaking and cooking, so it performs in canning, ready meals, chili and bean salads. Cleaned, destoned and optically sorted, packed at 12% max. moisture for stable long-distance shipment.",
      "ru": "Насыщенно-красная фасоль с тёмной рябью, калибр 200–220 шт. на 100 г — именно этот размер запрашивают консервные заводы и фасовщики в Европе, Турции и странах Залива. Зерно держит форму и оболочку после замачивания и варки, поэтому подходит для консервирования, готовых блюд, чили и салатов. Очищена, отделена от камней и оптически отсортирована, влажность до 12% обеспечивает устойчивость при длительной перевозке.",
      "uz": "To‘q qizil, qora chipor loviya; kalibri 100 grammda 200–220 dona — Yevropa, Turkiya va Fors ko‘rfazi mamlakatlaridagi konserva zavodlari va qadoqlovchilar aynan shu o‘lchamni so‘raydi. Doni ivitilgandan va pishirilgandan keyin ham shaklini va po‘stini saqlaydi, shu bois konservalash, tayyor taomlar, chili va salatlar uchun mos. Tozalangan, toshdan ajratilgan va optik saralangan, namligi 12% dan oshmagani uzoq masofaga tashishda barqarorlik beradi."
    },
    "specs": [
      {
        "label": {
          "en": "Calibre / count",
          "ru": "Калибр / счётность",
          "uz": "Kalibr / donadorlik"
        },
        "value": {
          "en": "200 - 220 P / 100 gr.",
          "ru": "200 - 220 шт. / 100 гр.",
          "uz": "200 - 220 dona / 100 gr."
        }
      },
      {
        "label": {
          "en": "Purity",
          "ru": "Чистота",
          "uz": "Tozaligi"
        },
        "value": {
          "en": "99% min.",
          "ru": "99% мин.",
          "uz": "99% min."
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "12% max.",
          "ru": "12% макс.",
          "uz": "12% maks."
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months from packing date, dry ventilated warehouse, 10–20 °C",
          "ru": "12 месяцев с даты фасовки, сухой вентилируемый склад, 10–20 °C",
          "uz": "Qadoqlangan sanadan 12 oy, quruq shamollatiladigan omborda, 10–20 °C"
        }
      },
      {
        "label": {
          "en": "Minimum order / delivery terms",
          "ru": "Минимальная партия / условия поставки",
          "uz": "Minimal partiya / yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga ko‘ra"
        }
      }
    ],
    "image": "/images/products/red-speckled-kidney-beans.jpg",
    "featured": true,
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana) and Tashkent region; part of the volume comes from Jizzakh and Samarkand regions.",
      "ru": "Ферганская долина (Андижан, Наманган, Фергана) и Ташкентская область; часть объёма — Джизакская и Самаркандская области.",
      "uz": "Farg‘ona vodiysi (Andijon, Namangan, Farg‘ona) va Toshkent viloyati; hajmning bir qismi Jizzax va Samarqand viloyatlaridan."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga ko‘ra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
    },
    "hsCode": "0713.33"
  },
  {
    "slug": "light-speckled-kidney-beans",
    "category": "beans",
    "name": {
      "en": "Light Speckled Kidney Beans",
      "ru": "Фасоль \"Пестрая\"",
      "uz": "Och rangli chipor loviya"
    },
    "latinName": "Phaseolus vulgaris",
    "description": {
      "en": "Large light beige bean with pink-brown speckling of the borlotti / cranberry type, calibrated at 180–200 pieces per 100 g — the coarsest grade in our bean range. Thin skin and a creamy texture after cooking make it a standard choice for canned beans in tomato sauce, soups, pasta e fagioli and dry retail packs. Machine-cleaned and optically sorted to 99% purity, moisture 12% max.",
      "ru": "Крупная светло-бежевая фасоль с розово-коричневой рябью типа борлотти/кранберри, калибр 180–200 шт. на 100 г — самый крупный размер в нашей бобовой линейке. Тонкая оболочка и кремовая текстура после варки делают её стандартным выбором для консервов в томатном соусе, супов, pasta e fagioli и сухой розничной фасовки. Машинная очистка и оптическая сортировка до чистоты 99%, влажность не выше 12%.",
      "uz": "Yirik, och bej rangli, pushti-jigarrang chipor borlotti/kranberri turidagi loviya; kalibri 100 grammda 180–200 dona — bizning loviya assortimentimizdagi eng yirik nav. Po‘sti yupqa, pishirilgach mag‘zi qaymoqsimon bo‘lgani uchun tomat sousidagi konservalar, sho‘rvalar, pasta e fagioli va quruq chakana qadoq uchun standart tanlov. Mashinada tozalanib, optik saralanadi, tozaligi 99%, namligi 12% dan oshmaydi."
    },
    "specs": [
      {
        "label": {
          "en": "Calibre / count",
          "ru": "Калибр / счётность",
          "uz": "Kalibr / donadorlik"
        },
        "value": {
          "en": "180 - 200 P / 100 gr.",
          "ru": "180 - 200 шт. / 100 гр.",
          "uz": "180 - 200 dona / 100 gr."
        }
      },
      {
        "label": {
          "en": "Purity",
          "ru": "Чистота",
          "uz": "Tozaligi"
        },
        "value": {
          "en": "99% min.",
          "ru": "99% мин.",
          "uz": "99% min."
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "12% max.",
          "ru": "12% макс.",
          "uz": "12% maks."
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months from packing date, dry ventilated warehouse, 10–20 °C",
          "ru": "12 месяцев с даты фасовки, сухой вентилируемый склад, 10–20 °C",
          "uz": "Qadoqlangan sanadan 12 oy, quruq shamollatiladigan omborda, 10–20 °C"
        }
      },
      {
        "label": {
          "en": "Minimum order / delivery terms",
          "ru": "Минимальная партия / условия поставки",
          "uz": "Minimal partiya / yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga ko‘ra"
        }
      }
    ],
    "image": "/images/products/light-speckled-kidney-beans.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana) and Tashkent region; part of the volume comes from Jizzakh and Samarkand regions.",
      "ru": "Ферганская долина (Андижан, Наманган, Фергана) и Ташкентская область; часть объёма — Джизакская и Самаркандская области.",
      "uz": "Farg‘ona vodiysi (Andijon, Namangan, Farg‘ona) va Toshkent viloyati; hajmning bir qismi Jizzax va Samarqand viloyatlaridan."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga ko‘ra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
    },
    "hsCode": "0713.33"
  },
  {
    "slug": "black-eye-kidney-beans",
    "category": "beans",
    "name": {
      "en": "Black Eye Kidney Beans",
      "ru": "Фасоль \"Черный Глаз\"",
      "uz": "Qora ko‘z loviya"
    },
    "latinName": "Vigna unguiculata",
    "description": {
      "en": "Cream-white cow pea with the characteristic black eye, calibrated at 300–330 pieces per 100 g. Thin skin and a short cooking time — no long soaking required — make it the working grade for Indian, African and Mediterranean cuisine, canned lines and dry retail packs. Cleaned, destoned and optically sorted to remove discoloured and cracked grains; moisture held at 12% max.",
      "ru": "Кремово-белая фасоль вигна с характерным чёрным глазком, калибр 300–330 шт. на 100 г. Тонкая оболочка и короткое время варки без длительного замачивания делают её рабочим сортом для индийской, африканской и средиземноморской кухни, консервных линий и сухой розничной фасовки. Очищена, отделена от камней и оптически отсортирована с удалением потемневших и треснувших зёрен; влажность не выше 12%.",
      "uz": "Xarakterli qora ko‘zli, krem-oq rangli vigna loviyasi; kalibri 100 grammda 300–330 dona. Po‘sti yupqa, uzoq ivitishsiz tez pishadi — shu bois hind, afrika va O‘rta yer dengizi oshxonasi, konserva liniyalari va quruq chakana qadoq uchun asosiy nav hisoblanadi. Tozalangan, toshdan ajratilgan va optik saralangan: rangi o‘zgargan hamda yorilgan donalar chiqarib tashlanadi; namligi 12% dan oshmaydi."
    },
    "specs": [
      {
        "label": {
          "en": "Calibre / count",
          "ru": "Калибр / счётность",
          "uz": "Kalibr / donadorlik"
        },
        "value": {
          "en": "300 - 330 P / 100gr.",
          "ru": "300 - 330 шт. / 100 гр.",
          "uz": "300 - 330 dona / 100 gr."
        }
      },
      {
        "label": {
          "en": "Purity",
          "ru": "Чистота",
          "uz": "Tozaligi"
        },
        "value": {
          "en": "99% min.",
          "ru": "99% мин.",
          "uz": "99% min."
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "12% max.",
          "ru": "12% макс.",
          "uz": "12% maks."
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months from packing date, dry ventilated warehouse, 10–20 °C",
          "ru": "12 месяцев с даты фасовки, сухой вентилируемый склад, 10–20 °C",
          "uz": "Qadoqlangan sanadan 12 oy, quruq shamollatiladigan omborda, 10–20 °C"
        }
      },
      {
        "label": {
          "en": "Minimum order / delivery terms",
          "ru": "Минимальная партия / условия поставки",
          "uz": "Minimal partiya / yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga ko‘ra"
        }
      }
    ],
    "image": "/images/products/black-eye-kidney-beans.jpg",
    "regions": {
      "en": "Surkhandarya and Kashkadarya regions and the south of Jizzakh region — the warm areas that suit cow pea.",
      "ru": "Сурхандарьинская и Кашкадарьинская области, юг Джизакской области — тёплые зоны, подходящие для вигны.",
      "uz": "Surxondaryo va Qashqadaryo viloyatlari hamda Jizzax viloyatining janubi — vigna uchun mos issiq hududlar."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga ko‘ra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
    },
    "hsCode": "0713.35"
  },
  {
    "slug": "purple-speckled-kidney-beans",
    "category": "beans",
    "name": {
      "en": "Purple Speckled Kidney Beans",
      "ru": "Фасоль \"Фиолетовая пестрая\"",
      "uz": "Binafsha chipor loviya"
    },
    "latinName": "Phaseolus vulgaris",
    "description": {
      "en": "Purple-violet bean with darker speckling, calibrated at 200–220 pieces per 100 g. It cooks to a dense, mealy texture and holds colour better than light varieties, which is why processors take it for soups, stews, frozen vegetable mixes and dry mixes. Supplied as a cleaned, optically sorted lot at 99% purity and 12% max. moisture, on the same terms as the rest of the kidney bean range.",
      "ru": "Фасоль фиолетово-сиреневого цвета с более тёмной рябью, калибр 200–220 шт. на 100 г. Даёт плотную рассыпчатую текстуру при варке и лучше светлых сортов держит цвет, поэтому её берут под супы, рагу, замороженные овощные смеси и сухие миксы. Поставляется очищенной и оптически отсортированной, чистота 99%, влажность до 12% — на тех же условиях, что и остальная линейка фасоли.",
      "uz": "Binafsha-siyohrang, to‘qroq chipor loviya; kalibri 100 grammda 200–220 dona. Pishirilganda zich, uvadek mag‘iz beradi va och navlarga qaraganda rangini yaxshiroq saqlaydi, shu bois sho‘rvalar, qovurma taomlar, muzlatilgan sabzavot va quruq aralashmalar uchun olinadi. Tozalangan va optik saralangan holda, 99% tozalik hamda 12% gacha namlik bilan, loviya assortimentining qolgan qismi bilan bir xil shartlarda yetkaziladi."
    },
    "specs": [
      {
        "label": {
          "en": "Calibre / count",
          "ru": "Калибр / счётность",
          "uz": "Kalibr / donadorlik"
        },
        "value": {
          "en": "200 - 220 P / 100gr.",
          "ru": "200 - 220 шт. / 100 гр.",
          "uz": "200 - 220 dona / 100 gr."
        }
      },
      {
        "label": {
          "en": "Purity",
          "ru": "Чистота",
          "uz": "Tozaligi"
        },
        "value": {
          "en": "99% min.",
          "ru": "99% мин.",
          "uz": "99% min."
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "12% max.",
          "ru": "12% макс.",
          "uz": "12% maks."
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months from packing date, dry ventilated warehouse, 10–20 °C",
          "ru": "12 месяцев с даты фасовки, сухой вентилируемый склад, 10–20 °C",
          "uz": "Qadoqlangan sanadan 12 oy, quruq shamollatiladigan omborda, 10–20 °C"
        }
      },
      {
        "label": {
          "en": "Minimum order / delivery terms",
          "ru": "Минимальная партия / условия поставки",
          "uz": "Minimal partiya / yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga ko‘ra"
        }
      }
    ],
    "image": "/images/products/purple-speckled-kidney-beans.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana) and Tashkent region; part of the volume comes from Jizzakh and Samarkand regions.",
      "ru": "Ферганская долина (Андижан, Наманган, Фергана) и Ташкентская область; часть объёма — Джизакская и Самаркандская области.",
      "uz": "Farg‘ona vodiysi (Andijon, Namangan, Farg‘ona) va Toshkent viloyati; hajmning bir qismi Jizzax va Samarqand viloyatlaridan."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga ko‘ra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
    },
    "hsCode": "0713.33"
  },
  {
    "slug": "red-skirt-kidney-beans",
    "category": "beans",
    "name": {
      "en": "Red Skirt Kidney Beans",
      "ru": "Фасоль \"Красная каёмчатая\"",
      "uz": "Qizil hoshiyali loviya"
    },
    "latinName": "Phaseolus vulgaris",
    "description": {
      "en": "Small red-rimmed bean, calibrated at 340–370 pieces per 100 g — the finest count in the range. The small grain absorbs sauce quickly and cooks evenly, which suits soups, bean pastes, chili and pre-cooked ready meals where a short process time matters. Cleaned, destoned and optically sorted; 99% purity and 12% max. moisture, packed to the same export standard as the other kidney bean grades.",
      "ru": "Мелкая фасоль с красной каймой, калибр 340–370 шт. на 100 г — самая мелкая счётность в линейке. Мелкое зерно быстро вбирает соус и равномерно разваривается, что удобно для супов, бобовых паст, чили и готовых блюд, где важно короткое время обработки. Очищена, отделена от камней и оптически отсортирована; чистота 99%, влажность до 12%, фасовка по тому же экспортному стандарту, что и остальные сорта фасоли.",
      "uz": "Qizil hoshiyali mayda loviya; kalibri 100 grammda 340–370 dona — assortimentdagi eng mayda donadorlik. Mayda doni sousni tez shimadi va bir tekis pishadi, shu bois sho‘rvalar, loviya pastalari, chili va qayta ishlash vaqti qisqa bo‘lishi kerak bo‘lgan tayyor taomlar uchun qulay. Tozalangan, toshdan ajratilgan va optik saralangan; tozaligi 99%, namligi 12% gacha, boshqa loviya navlari bilan bir xil eksport standartida qadoqlanadi."
    },
    "specs": [
      {
        "label": {
          "en": "Calibre / count",
          "ru": "Калибр / счётность",
          "uz": "Kalibr / donadorlik"
        },
        "value": {
          "en": "340 - 370 P / 100gr.",
          "ru": "340 - 370 шт. / 100 гр.",
          "uz": "340 - 370 dona / 100 gr."
        }
      },
      {
        "label": {
          "en": "Purity",
          "ru": "Чистота",
          "uz": "Tozaligi"
        },
        "value": {
          "en": "99% min.",
          "ru": "99% мин.",
          "uz": "99% min."
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "12% max.",
          "ru": "12% макс.",
          "uz": "12% maks."
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months from packing date, dry ventilated warehouse, 10–20 °C",
          "ru": "12 месяцев с даты фасовки, сухой вентилируемый склад, 10–20 °C",
          "uz": "Qadoqlangan sanadan 12 oy, quruq shamollatiladigan omborda, 10–20 °C"
        }
      },
      {
        "label": {
          "en": "Minimum order / delivery terms",
          "ru": "Минимальная партия / условия поставки",
          "uz": "Minimal partiya / yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga ko‘ra"
        }
      }
    ],
    "image": "/images/products/red-skirt-kidney-beans.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana) and Tashkent region; part of the volume comes from Jizzakh and Samarkand regions.",
      "ru": "Ферганская долина (Андижан, Наманган, Фергана) и Ташкентская область; часть объёма — Джизакская и Самаркандская области.",
      "uz": "Farg‘ona vodiysi (Andijon, Namangan, Farg‘ona) va Toshkent viloyati; hajmning bir qismi Jizzax va Samarqand viloyatlaridan."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga ko‘ra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
    },
    "hsCode": "0713.33"
  },
  {
    "slug": "raisins",
    "category": "dried-fruits",
    "name": {
      "en": "Raisins",
      "ru": "Изюм",
      "uz": "Mayiz"
    },
    "latinName": "Vitis vinifera L.",
    "description": {
      "en": "Sun-dried raisins from Uzbekistan's traditional table-grape valleys, supplied in black, red, golden and brown types made from seedless Kishmish and Sultana varieties. High natural sugar content and a dense, meaty texture make them a stable input for bakery and confectionery, cereal and snack mixes, and retail packing. Delivered cleaned and calibrated; laser sorting and metal detection are available on request.",
      "ru": "Изюм солнечной сушки из традиционных виноградарских долин Узбекистана — чёрный, красный, жёлтый и коричневый, из бессемянных сортов кишмиш и сультани. Высокая естественная сахаристость и плотная мякоть делают его стабильным сырьём для хлебопечения и кондитерского производства, зерновых и снековых смесей, а также для фасовки в розницу. Поставляется очищенным и калиброванным; лазерная сортировка и металлодетекция — по запросу.",
      "uz": "O‘zbekistonning an’anaviy uzumchilik vodiylarida quyoshda quritilgan mayiz — qora, qizil, sariq va jigarrang turlari danaksiz kishmish va sultoni navlaridan tayyorlanadi. Tabiiy shakarning yuqoriligi va zich eti uni nonvoychilik va qandolat ishlab chiqarishi, don hamda gazak aralashmalari va chakana qadoqlash uchun barqaror xomashyoga aylantiradi. Tozalangan va kalibrlangan holda yetkaziladi; lazerli saralash va metall detektor — talab bo‘yicha."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Navlari"
        },
        "value": {
          "en": "Black / Red / Golden / Brown",
          "ru": "Чёрный / Красный / Жёлтый (золотистый) / Коричневый",
          "uz": "Qora / Qizil / Sariq (oltinrang) / Jigarrang"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namlik"
        },
        "value": {
          "en": "16% max.",
          "ru": "не более 16%",
          "uz": "16% dan ko‘p emas"
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 12.5 kg cartons, 25 kg PP bags with food-grade PE liner",
          "ru": "коробки 10 / 12,5 кг, мешки ПП 25 кг с пищевым ПЭ-вкладышем",
          "uz": "10 / 12,5 kg kartonlar, oziq-ovqatbop PE ichlikli 25 kg PP qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +5…+20 °C, RH 65% max., dry ventilated warehouse",
          "ru": "12 месяцев при +5…+20 °C, отн. влажность не более 65%, сухой проветриваемый склад",
          "uz": "+5…+20 °C da 12 oy, nisbiy namlik 65% dan ko‘p emas, quruq shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ / Delivery terms",
          "ru": "Минимальная партия / Условия поставки",
          "uz": "Minimal partiya / Yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 18–20 MT); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 18–20 т); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 18–20 t); FCA Toshkent, avtomobil yoki temir yo‘l orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/raisins.jpg",
    "featured": true,
    "regions": {
      "en": "Samarkand and Bukhara regions, Tashkent region (Parkent, Bostanlyk), Jizzakh — traditional table-grape valleys.",
      "ru": "Самаркандская и Бухарская области, Ташкентская область (Паркент, Бостанлык), Джизак — традиционные виноградарские долины.",
      "uz": "Samarqand va Buxoro viloyatlari, Toshkent viloyati (Parkent, Bo‘stonliq), Jizzax — an’anaviy uzumchilik vodiylari."
    },
    "packaging": {
      "en": "10 kg and 12.5 kg cartons, 25 kg PP bags with inner food-grade PE liner; big bags 500–1000 kg and retail packing 200 g – 1 kg on request. Approx. 18–20 MT per 20' container.",
      "ru": "Коробки 10 и 12,5 кг, мешки ПП 25 кг с внутренним пищевым ПЭ-вкладышем; биг-бэги 500–1000 кг и розничная фасовка 200 г – 1 кг по запросу. Около 18–20 т в 20-футовом контейнере.",
      "uz": "10 va 12,5 kg kartonlar, ichki oziq-ovqatbop PE ichlikli 25 kg PP qoplar; talab bo‘yicha 500–1000 kg big-beglar va 200 g – 1 kg chakana qadoq. 20 futlik konteynerda taxminan 18–20 t."
    },
    "hsCode": "0806.20"
  },
  {
    "slug": "dried-apricot",
    "category": "dried-fruits",
    "name": {
      "en": "Dried Apricot",
      "ru": "Сушеный Абрикос",
      "uz": "Quritilgan o‘rik (o‘rik qoqi)"
    },
    "latinName": "Prunus armeniaca L.",
    "description": {
      "en": "Uzbek dried apricot is produced from ripe fruit of Fergana Valley and Samarkand orchards and is offered both sulphured (bright orange, SO2 within EU limits) and naturally sun-dried (dark amber, no additives). Calibration by fruit count per kilogram gives consistent lots for retail packing, bakery fillings, muesli and compote blends. Fruit is hand-sorted; pitted and stone-in formats are available.",
      "ru": "Узбекская курага производится из спелых плодов садов Ферганской долины и Самаркандской области и поставляется как в сульфитированном виде (яркий оранжевый цвет, SO2 в пределах норм ЕС), так и в натуральной солнечной сушке (тёмно-янтарная, без добавок). Калибровка по количеству плодов на килограмм обеспечивает однородные партии для розничной фасовки, начинок для выпечки, мюсли и компотных смесей. Продукт проходит ручную переборку; доступны форматы без косточки и с косточкой.",
      "uz": "O‘zbek o‘rik qoqisi Farg‘ona vodiysi va Samarqand bog‘larining pishgan mevalaridan tayyorlanadi hamda oltingugurtlangan (yorqin to‘q sariq, SO2 miqdori Yevropa Ittifoqi me’yorlari doirasida) va tabiiy quyoshda quritilgan (to‘q qahrabo rang, qo‘shimchalarsiz) ko‘rinishlarda taklif etiladi. Bir kilogrammdagi meva soni bo‘yicha kalibrlash chakana qadoqlash, non-qandolat to‘ldirmalari, myusli va kompot aralashmalari uchun bir xil partiyalarni beradi. Meva qo‘lda saralanadi; danaksiz va danakli shakllari mavjud."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Navlari"
        },
        "value": {
          "en": "Sulphured / Natural",
          "ru": "Сульфитированная (субхана) / Натуральная",
          "uz": "Oltingugurtlangan (subxona) / Tabiiy"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namlik"
        },
        "value": {
          "en": "20% max.",
          "ru": "не более 20%",
          "uz": "20% dan ko‘p emas"
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "5 / 10 / 12.5 kg cartons with PE liner, 25 kg PP bags",
          "ru": "коробки 5 / 10 / 12,5 кг с ПЭ-вкладышем, мешки ПП 25 кг",
          "uz": "PE ichlikli 5 / 10 / 12,5 kg kartonlar, 25 kg PP qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +5…+18 °C, RH 65% max., away from strong odours",
          "ru": "12 месяцев при +5…+18 °C, отн. влажность не более 65%, отдельно от резко пахнущих товаров",
          "uz": "+5…+18 °C da 12 oy, nisbiy namlik 65% dan ko‘p emas, keskin hidli mahsulotlardan alohida"
        }
      },
      {
        "label": {
          "en": "MOQ / Delivery terms",
          "ru": "Минимальная партия / Условия поставки",
          "uz": "Minimal partiya / Yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 16–18 MT); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 16–18 т); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 16–18 t); FCA Toshkent, avtomobil yoki temir yo‘l orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-apricot.jpg",
    "featured": true,
    "regions": {
      "en": "Fergana Valley (Namangan, Andijan, Fergana) and Samarkand region (Urgut area) — the country's main apricot-drying districts.",
      "ru": "Ферганская долина (Наманган, Андижан, Фергана) и Самаркандская область (Ургутский район) — основные районы сушки абрикоса в стране.",
      "uz": "Farg‘ona vodiysi (Namangan, Andijon, Farg‘ona) va Samarqand viloyati (Urgut atrofi) — mamlakatdagi asosiy o‘rik quritish hududlari."
    },
    "packaging": {
      "en": "5 kg, 10 kg and 12.5 kg cartons with food-grade PE liner, 25 kg PP bags; vacuum packing and retail packs 200 g – 1 kg on request. Approx. 16–18 MT per 20' container.",
      "ru": "Коробки 5, 10 и 12,5 кг с пищевым ПЭ-вкладышем, мешки ПП 25 кг; вакуумная упаковка и розничная фасовка 200 г – 1 кг по запросу. Около 16–18 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 5, 10 va 12,5 kg kartonlar, 25 kg PP qoplar; talab bo‘yicha vakuumli qadoq va 200 g – 1 kg chakana qadoq. 20 futlik konteynerda taxminan 16–18 t."
    },
    "hsCode": "0813.10"
  },
  {
    "slug": "dried-prune",
    "category": "dried-fruits",
    "name": {
      "en": "Dried Prune",
      "ru": "Чернослив",
      "uz": "Quritilgan olxo‘ri (chernosliv)"
    },
    "latinName": "Prunus domestica L.",
    "description": {
      "en": "Dried prunes from Ashlock, Spain and Hungarian plum varieties, supplied pitted and with stone, in natural dry form or lightly glycerine-treated for a softer texture. High dry-matter content and a low share of broken fruit make them a dependable raw material for prune paste and juice concentrate, bakery fillings, snack mixes and retail packs. Grading by fruit count per 500 g is available on request.",
      "ru": "Чернослив из слив сортов Ашлок, Испанка и Венгерка — с косточкой и без косточки, в натуральной сухой форме или с лёгкой обработкой глицерином для более мягкой текстуры. Высокое содержание сухих веществ и низкая доля боя делают его надёжным сырьём для пасты и сокового концентрата, начинок для выпечки, снековых смесей и розничной фасовки. Калибровка по количеству плодов на 500 г — по запросу.",
      "uz": "Ashlok, Ispanka va Vengerka olxo‘ri navlaridan tayyorlangan quritilgan olxo‘ri — danakli va danaksiz, tabiiy quruq holda yoki yumshoqroq tuzilma uchun yengil glitserin bilan ishlangan. Quruq modda miqdorining yuqoriligi va singan meva ulushining pastligi uni olxo‘ri pastasi va sharbat konsentrati, non-qandolat to‘ldirmalari, gazak aralashmalari va chakana qadoq uchun ishonchli xomashyoga aylantiradi. 500 grammdagi meva soni bo‘yicha kalibrlash — talab bo‘yicha."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Navlari"
        },
        "value": {
          "en": "Without seeds - Ashlock / Spain / Hungarian\nWith seeds - Spain / Hungarian",
          "ru": "Без косточки — Ашлок / Испанка / Венгерка\nС косточкой — Испанка / Венгерка",
          "uz": "Danaksiz — Ashlok / Ispanka / Vengerka\nDanakli — Ispanka / Vengerka"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namlik"
        },
        "value": {
          "en": "25% max.",
          "ru": "не более 25%",
          "uz": "25% dan ko‘p emas"
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 12.5 kg cartons with PE liner, 25 kg PP bags",
          "ru": "коробки 10 / 12,5 кг с ПЭ-вкладышем, мешки ПП 25 кг",
          "uz": "PE ichlikli 10 / 12,5 kg kartonlar, 25 kg PP qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +5…+18 °C, RH 70% max., dry ventilated warehouse",
          "ru": "12 месяцев при +5…+18 °C, отн. влажность не более 70%, сухой проветриваемый склад",
          "uz": "+5…+18 °C da 12 oy, nisbiy namlik 70% dan ko‘p emas, quruq shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ / Delivery terms",
          "ru": "Минимальная партия / Условия поставки",
          "uz": "Minimal partiya / Yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 18–20 MT); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 18–20 т); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 18–20 t); FCA Toshkent, avtomobil yoki temir yo‘l orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-prune.jpg",
    "regions": {
      "en": "Samarkand and Tashkent regions, Fergana Valley — foothill plum orchards with cool nights during ripening.",
      "ru": "Самаркандская и Ташкентская области, Ферганская долина — предгорные сливовые сады с прохладными ночами в период созревания.",
      "uz": "Samarqand va Toshkent viloyatlari, Farg‘ona vodiysi — pishish davrida tunlari salqin bo‘ladigan tog‘oldi olxo‘ri bog‘lari."
    },
    "packaging": {
      "en": "10 kg and 12.5 kg cartons with food-grade PE liner, 25 kg PP bags; big bags and retail packs 200 g – 1 kg on request. Approx. 18–20 MT per 20' container.",
      "ru": "Коробки 10 и 12,5 кг с пищевым ПЭ-вкладышем, мешки ПП 25 кг; биг-бэги и розничная фасовка 200 г – 1 кг по запросу. Около 18–20 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 12,5 kg kartonlar, 25 kg PP qoplar; talab bo‘yicha big-beglar va 200 g – 1 kg chakana qadoq. 20 futlik konteynerda taxminan 18–20 t."
    },
    "hsCode": "0813.20"
  },
  {
    "slug": "walnuts",
    "category": "dried-fruits",
    "name": {
      "en": "Walnuts",
      "ru": "Орех",
      "uz": "Yong‘oq"
    },
    "latinName": "Juglans regia L.",
    "description": {
      "en": "Walnut kernels in light (white) and amber (red) colour grades, grown in mountain-foothill orchards where wide day-to-night temperature swings build up oil content and a clean, non-bitter taste. Supplied as halves, quarters and pieces after hand and laser sorting, with shell fragment content controlled to export standards. Used in confectionery, bakery, ice cream and halva production and in retail nut mixes; in-shell walnuts are available seasonally.",
      "ru": "Ядро грецкого ореха светлых (белый) и янтарных (красный) цветовых категорий выращивается в предгорных садах, где значительные суточные перепады температур дают высокую масличность и чистый вкус без горечи. Поставляется половинками, четвертинками и ломом после ручной и лазерной сортировки, содержание частиц скорлупы контролируется по экспортным нормам. Применяется в кондитерском и хлебопекарном производстве, мороженом и халве, а также в розничных ореховых смесях; орех в скорлупе — сезонно.",
      "uz": "Yorug‘ (oq) va qahrabo (qizil) rang toifalaridagi yong‘oq mag‘zi tog‘oldi bog‘larida yetishtiriladi — kunduzgi va tungi harorat farqi kattaligi tufayli moy miqdori yuqori, ta’mi toza va achchiqsiz. Qo‘lda va lazerli saralashdan so‘ng yarim, chorak hamda maydalangan holda yetkaziladi, po‘choq zarralari miqdori eksport talablari darajasida nazorat qilinadi. Qandolat va nonvoychilik, muzqaymoq va halva ishlab chiqarish, chakana yong‘oq aralashmalari uchun ishlatiladi; po‘chog‘i bilan yong‘oq mavsumiy ravishda mavjud."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Navlari"
        },
        "value": {
          "en": "White / Red",
          "ru": "Белый / Красный",
          "uz": "Oq / Qizil"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namlik"
        },
        "value": {
          "en": "8% max.",
          "ru": "не более 8%",
          "uz": "8% dan ko‘p emas"
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "Kernels: 10 / 12.5 kg cartons with PE liner; in-shell: 25 kg PP mesh bags",
          "ru": "ядро: коробки 10 / 12,5 кг с ПЭ-вкладышем; в скорлупе: сетчатые мешки ПП 25 кг",
          "uz": "mag‘iz: PE ichlikli 10 / 12,5 kg kartonlar; po‘chog‘i bilan: 25 kg PP to‘rli qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +2…+10 °C (up to 6 months at ambient), RH 65% max.",
          "ru": "12 месяцев при +2…+10 °C (до 6 месяцев при обычной температуре), отн. влажность не более 65%",
          "uz": "+2…+10 °C da 12 oy (oddiy haroratda 6 oygacha), nisbiy namlik 65% dan ko‘p emas"
        }
      },
      {
        "label": {
          "en": "MOQ / Delivery terms",
          "ru": "Минимальная партия / Условия поставки",
          "uz": "Minimal partiya / Yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 12–14 MT of kernels); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 12–14 т ядра); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 12–14 t mag‘iz); FCA Toshkent, avtomobil yoki temir yo‘l orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/walnuts.jpg",
    "regions": {
      "en": "Mountain-foothill areas of Tashkent region (Bostanlyk), the Fergana Valley, Surkhandarya, Kashkadarya and Jizzakh.",
      "ru": "Предгорные районы Ташкентской области (Бостанлык), Ферганская долина, Сурхандарья, Кашкадарья и Джизак.",
      "uz": "Toshkent viloyatining tog‘oldi hududlari (Bo‘stonliq), Farg‘ona vodiysi, Surxondaryo, Qashqadaryo va Jizzax."
    },
    "packaging": {
      "en": "Kernels in 10 kg and 12.5 kg cartons with food-grade PE liner, vacuum packing on request; in-shell walnuts in 25 kg PP mesh or woven bags. Retail packs on request. Approx. 12–14 MT of kernels per 20' container.",
      "ru": "Ядро — коробки 10 и 12,5 кг с пищевым ПЭ-вкладышем, вакуумная упаковка по запросу; орех в скорлупе — сетчатые или тканые мешки ПП 25 кг. Розничная фасовка по запросу. Около 12–14 т ядра в 20-футовом контейнере.",
      "uz": "Mag‘iz — oziq-ovqatbop PE ichlikli 10 va 12,5 kg kartonlarda, talab bo‘yicha vakuumli qadoq; po‘chog‘i bilan yong‘oq — 25 kg PP to‘rli yoki to‘qima qoplarda. Chakana qadoq talab bo‘yicha. 20 futlik konteynerda taxminan 12–14 t mag‘iz."
    },
    "hsCode": "0802.31"
  },
  {
    "slug": "almonds",
    "category": "dried-fruits",
    "name": {
      "en": "Almonds",
      "ru": "Миндаль",
      "uz": "Bodom"
    },
    "latinName": "Prunus dulcis (Mill.) D.A.Webb",
    "description": {
      "en": "Uzbek almonds are offered in-shell and as kernels of sweet varieties grown in southern and foothill districts, with a firm texture and the mild, sweet flavour typical of Central Asian orchards. Kernels are calibrated by size and sorted for splits and foreign matter, which suits confectionery and bakery lines, nut butters, roasting and retail packing. Blanching and vacuum packing are available on request.",
      "ru": "Миндаль из Узбекистана поставляется в скорлупе и ядром сладких сортов, выращенных в южных и предгорных районах; плотная текстура и мягкий сладкий вкус характерны для среднеазиатских садов. Ядро калибруется по размеру и сортируется по половинкам и посторонним примесям, что подходит для кондитерских и хлебопекарных линий, ореховых паст, обжарки и розничной фасовки. Бланширование и вакуумная упаковка — по запросу.",
      "uz": "O‘zbek bodomi po‘chog‘i bilan va mag‘iz holida, janubiy hamda tog‘oldi tumanlarida yetishtirilgan shirin navlardan taklif etiladi; zich tuzilma va mayin shirin ta’m Markaziy Osiyo bog‘lariga xos. Mag‘iz o‘lchami bo‘yicha kalibrlanadi, yorilgan donalar va begona aralashmalardan saralanadi — bu qandolat va non liniyalari, yong‘oq pastalari, qovurish va chakana qadoqlash uchun qulay. Blanshirlash va vakuumli qadoqlash — talab bo‘yicha."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Navlari"
        },
        "value": {
          "en": "In-shell / Kernels (shelled)",
          "ru": "В скорлупе / Без скорлупы (ядро)",
          "uz": "Po‘chog‘i bilan / Mag‘iz (po‘chog‘isiz)"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namlik"
        },
        "value": {
          "en": "6% max.",
          "ru": "не более 6%",
          "uz": "6% dan ko‘p emas"
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "Kernels: 10 / 12.5 kg cartons with PE liner; in-shell: 25 kg PP bags",
          "ru": "ядро: коробки 10 / 12,5 кг с ПЭ-вкладышем; в скорлупе: мешки ПП 25 кг",
          "uz": "mag‘iz: PE ichlikli 10 / 12,5 kg kartonlar; po‘chog‘i bilan: 25 kg PP qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +5…+15 °C, RH 65% max., away from strong odours",
          "ru": "12 месяцев при +5…+15 °C, отн. влажность не более 65%, отдельно от резко пахнущих товаров",
          "uz": "+5…+15 °C da 12 oy, nisbiy namlik 65% dan ko‘p emas, keskin hidli mahsulotlardan alohida"
        }
      },
      {
        "label": {
          "en": "MOQ / Delivery terms",
          "ru": "Минимальная партия / Условия поставки",
          "uz": "Minimal partiya / Yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 14–16 MT of kernels); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 14–16 т ядра); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 14–16 t mag‘iz); FCA Toshkent, avtomobil yoki temir yo‘l orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/almonds.jpg",
    "regions": {
      "en": "Surkhandarya and Kashkadarya, Samarkand region and the foothill districts of Tashkent region.",
      "ru": "Сурхандарья и Кашкадарья, Самаркандская область и предгорные районы Ташкентской области.",
      "uz": "Surxondaryo va Qashqadaryo, Samarqand viloyati hamda Toshkent viloyatining tog‘oldi tumanlari."
    },
    "packaging": {
      "en": "Kernels in 10 kg and 12.5 kg cartons with food-grade PE liner, vacuum packing on request; in-shell almonds in 25 kg PP bags. Retail packs 100 g – 1 kg on request. Approx. 14–16 MT of kernels per 20' container.",
      "ru": "Ядро — коробки 10 и 12,5 кг с пищевым ПЭ-вкладышем, вакуумная упаковка по запросу; миндаль в скорлупе — мешки ПП 25 кг. Розничная фасовка 100 г – 1 кг по запросу. Около 14–16 т ядра в 20-футовом контейнере.",
      "uz": "Mag‘iz — oziq-ovqatbop PE ichlikli 10 va 12,5 kg kartonlarda, talab bo‘yicha vakuumli qadoq; po‘chog‘i bilan bodom — 25 kg PP qoplarda. 100 g – 1 kg chakana qadoq talab bo‘yicha. 20 futlik konteynerda taxminan 14–16 t mag‘iz."
    },
    "hsCode": "0802.11"
  },
  {
    "slug": "peanuts",
    "category": "dried-fruits",
    "name": {
      "en": "Peanuts",
      "ru": "Арахис",
      "uz": "Yer yong‘oq"
    },
    "latinName": "Arachis hypogaea L.",
    "description": {
      "en": "Groundnuts supplied shelled (kernels) and unshelled from irrigated fields of the Fergana Valley and Tashkent region, calibrated by count per ounce for predictable roasting behaviour. Aflatoxin is controlled lot by lot, with third-party laboratory reports issued before shipment. Suitable for roasting and salting, peanut butter and paste, confectionery, bakery and snack lines.",
      "ru": "Арахис поставляется очищенным (ядро) и в скорлупе с орошаемых полей Ферганской долины и Ташкентской области; калибровка по количеству ядер на унцию обеспечивает предсказуемое поведение при обжарке. Содержание афлатоксинов контролируется по каждой партии, до отгрузки предоставляются протоколы независимой лаборатории. Подходит для обжарки и соления, производства арахисовой пасты, кондитерских и хлебобулочных изделий, снековых линий.",
      "uz": "Yer yong‘og‘i tozalangan (mag‘iz) va po‘chog‘i bilan yetkaziladi; Farg‘ona vodiysi va Toshkent viloyatining sug‘oriladigan dalalarida yetishtiriladi hamda unsiyadagi dona soni bo‘yicha kalibrlanadi, bu qovurishda barqaror natija beradi. Aflatoksin miqdori har bir partiya bo‘yicha nazorat qilinadi, jo‘natishdan oldin mustaqil laboratoriya bayonnomalari taqdim etiladi. Qovurish va tuzlash, yer yong‘og‘i pastasi, qandolat va non mahsulotlari hamda gazak liniyalari uchun mos."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Navlari"
        },
        "value": {
          "en": "Shelled / Unshelled",
          "ru": "Без скорлупы (ядро) / В скорлупе",
          "uz": "Mag‘iz (po‘chog‘isiz) / Po‘chog‘i bilan"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namlik"
        },
        "value": {
          "en": "8% max.",
          "ru": "не более 8%",
          "uz": "8% dan ko‘p emas"
        }
      },
      {
        "label": {
          "en": "Origin",
          "ru": "Происхождение",
          "uz": "Kelib chiqishi"
        },
        "value": {
          "en": "Uzbekistan",
          "ru": "Узбекистан",
          "uz": "O‘zbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "25 / 50 kg PP bags, big bags 1000 kg",
          "ru": "мешки ПП 25 / 50 кг, биг-бэги 1000 кг",
          "uz": "25 / 50 kg PP qoplar, 1000 kg big-beglar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +5…+20 °C, RH 70% max., dry ventilated warehouse",
          "ru": "12 месяцев при +5…+20 °C, отн. влажность не более 70%, сухой проветриваемый склад",
          "uz": "+5…+20 °C da 12 oy, nisbiy namlik 70% dan ko‘p emas, quruq shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ / Delivery terms",
          "ru": "Минимальная партия / Условия поставки",
          "uz": "Minimal partiya / Yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 20 MT); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 20 т); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 20 t); FCA Toshkent, avtomobil yoki temir yo‘l orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/peanuts.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan), Tashkent and Khorezm regions — irrigated fields with a long warm season.",
      "ru": "Ферганская долина (Андижан, Наманган), Ташкентская и Хорезмская области — орошаемые поля с продолжительным тёплым сезоном.",
      "uz": "Farg‘ona vodiysi (Andijon, Namangan), Toshkent va Xorazm viloyatlari — uzoq issiq mavsumli sug‘oriladigan dalalar."
    },
    "packaging": {
      "en": "25 kg and 50 kg PP bags, big bags 1000 kg; 10 kg vacuum cartons for kernels and retail packing on request. Approx. 20 MT per 20' container.",
      "ru": "Мешки ПП 25 и 50 кг, биг-бэги 1000 кг; вакуумные коробки 10 кг для ядра и розничная фасовка по запросу. Около 20 т в 20-футовом контейнере.",
      "uz": "25 va 50 kg PP qoplar, 1000 kg big-beglar; mag‘iz uchun 10 kg vakuumli kartonlar va chakana qadoq talab bo‘yicha. 20 futlik konteynerda taxminan 20 t."
    },
    "hsCode": "1202.41"
  }
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export const featuredProducts: Product[] = products.filter((product) => product.featured);
