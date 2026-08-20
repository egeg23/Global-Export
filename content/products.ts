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
      "ru": "Зелёный маш",
      "uz": "Yashil mosh"
    },
    "latinName": "Vigna radiata",
    "description": {
      "en": "Uzbek green mung bean is machine-cleaned and colour-sorted, with even grain and a bright green seed coat; the bulk of the crop is grown as a second harvest after winter wheat. Purity of 99% and moisture held at 11% max. give the lot the reserve it needs for long rail and sea transit and allow packing without re-cleaning at destination. Standard uses are dal and soups, mung flour and starch, noodle production, with the split fraction supplied for milling programmes.",
      "ru": "Узбекский зелёный маш проходит машинную очистку и фотосепарацию: зерно выровненное, оболочка ярко-зелёная, основной объём убирается вторым урожаем после озимой пшеницы. Чистота 99% и влажность не выше 11% дают запас по срокам при железнодорожной и морской доставке и позволяют фасовать товар без дополнительной подработки на месте. Применяется для дала и супов, машевой муки и крахмала, лапши; дроблёная фракция поставляется под помольные программы.",
      "uz": "Oʻzbek yashil moshi mashinada tozalanib, rang boʻyicha saralanadi: doni bir tekis, poʻsti yorqin yashil, asosiy hajm kuzgi bugʻdoydan keyingi takroriy ekin sifatida yetishtiriladi. 99% tozalik va 11% dan oshmagan namlik uzoq temir yoʻl va dengiz yoʻlida zaxira beradi hamda mahsulotni joyida qayta tozalamasdan qadoqlash imkonini beradi. Dal va shoʻrvalar, mosh uni va kraxmali, ugra ishlab chiqarishda ishlatiladi; maydalangan fraksiya tegirmon dasturlari uchun yetkaziladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
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
          "uz": "Oʻzbekiston"
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
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga koʻra"
        }
      }
    ],
    "image": "/images/products/green-mung-beans.jpg",
    "featured": true,
    "regions": {
      "en": "Kashkadarya, Surkhandarya and Jizzakh regions, plus irrigated districts of Samarkand region — mainly as a second crop after winter wheat.",
      "ru": "Кашкадарьинская, Сурхандарьинская и Джизакская области, а также орошаемые районы Самаркандской области — преимущественно вторым урожаем после озимой пшеницы.",
      "uz": "Qashqadaryo, Surxondaryo va Jizzax viloyatlari, shuningdek Samarqand viloyatining sugʻoriladigan tumanlari — asosan kuzgi bugʻdoydan keyingi takroriy ekin sifatida."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga koʻra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
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
      "uz": "Undirishga moʻljallangan alohida nav: faqat yirik +3,5 mm va 4 mm fraksiyalar, poʻsti butunligi boʻyicha saralanadi, unuvchanligi 90% va undan yuqori darajada tasdiqlanadi. Ehtiyotkor tozalash va optik saralash mexanik shikastlanishni kamaytiradi — aynan shu koʻrsatkich nihollar hosili va savdo koʻrinishini belgilaydi. Undirish korxonalari, yangi mahsulot qadoqlovchilari va HoReCa distribyutorlariga yetkaziladi; har bir partiya unuvchanlik bayonnomasi va fitosanitar sertifikat bilan joʻnatiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
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
          "uz": "Oʻzbekiston"
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
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga koʻra"
        }
      }
    ],
    "image": "/images/products/green-mung-beans-sprouting.jpg",
    "regions": {
      "en": "Kashkadarya, Surkhandarya and Jizzakh regions; seed lots for sprouting are selected from fields with early, dry harvesting conditions.",
      "ru": "Кашкадарьинская, Сурхандарьинская и Джизакская области; партии под проращивание отбираются с полей ранней уборки в сухих условиях.",
      "uz": "Qashqadaryo, Surxondaryo va Jizzax viloyatlari; undirishga moʻljallangan partiyalar erta va quruq sharoitda oʻrib olingan dalalardan tanlanadi."
    },
    "packaging": {
      "en": "25 kg PP bags with food-grade inner liner, big bags 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 кг с пищевым вкладышем, биг-бэги 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "Oziq-ovqatga yaroqli ichki qoplamali 25 kg PP qoplar, 1000 kg big-beglar, talabga koʻra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
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
      "uz": "Toʻq qizil, qora chipor loviya; kalibri 100 grammda 200–220 dona — Yevropa, Turkiya va Fors koʻrfazi mamlakatlaridagi konserva zavodlari va qadoqlovchilar aynan shu oʻlchamni soʻraydi. Doni ivitilgandan va pishirilgandan keyin ham shaklini va poʻstini saqlaydi, shu bois konservalash, tayyor taomlar, chili va salatlar uchun mos. Tozalangan, toshdan ajratilgan va optik saralangan, namligi 12% dan oshmagani uzoq masofaga tashishda barqarorlik beradi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
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
          "uz": "Oʻzbekiston"
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
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga koʻra"
        }
      }
    ],
    "image": "/images/products/red-speckled-kidney-beans.jpg",
    "featured": true,
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana) and Tashkent region; part of the volume comes from Jizzakh and Samarkand regions.",
      "ru": "Ферганская долина (Андижан, Наманган, Фергана) и Ташкентская область; часть объёма — Джизакская и Самаркандская области.",
      "uz": "Fargʻona vodiysi (Andijon, Namangan, Fargʻona) va Toshkent viloyati; hajmning bir qismi Jizzax va Samarqand viloyatlaridan."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga koʻra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
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
      "uz": "Yirik, och bej rangli, pushti-jigarrang chipor borlotti/kranberri turidagi loviya; kalibri 100 grammda 180–200 dona — bizning loviya assortimentimizdagi eng yirik nav. Poʻsti yupqa, pishirilgach magʻzi qaymoqsimon boʻlgani uchun tomat sousidagi konservalar, shoʻrvalar, pasta e fagioli va quruq chakana qadoq uchun standart tanlov. Mashinada tozalanib, optik saralanadi, tozaligi 99%, namligi 12% dan oshmaydi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
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
          "uz": "Oʻzbekiston"
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
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga koʻra"
        }
      }
    ],
    "image": "/images/products/light-speckled-kidney-beans.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana) and Tashkent region; part of the volume comes from Jizzakh and Samarkand regions.",
      "ru": "Ферганская долина (Андижан, Наманган, Фергана) и Ташкентская область; часть объёма — Джизакская и Самаркандская области.",
      "uz": "Fargʻona vodiysi (Andijon, Namangan, Fargʻona) va Toshkent viloyati; hajmning bir qismi Jizzax va Samarqand viloyatlaridan."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga koʻra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
    },
    "hsCode": "0713.33"
  },
  {
    "slug": "black-eye-kidney-beans",
    "category": "beans",
    "name": {
      "en": "Black Eye Kidney Beans",
      "ru": "Фасоль \"Черный Глаз\"",
      "uz": "Qora koʻz loviya"
    },
    "latinName": "Vigna unguiculata",
    "description": {
      "en": "Cream-white cow pea with the characteristic black eye, calibrated at 300–330 pieces per 100 g. Thin skin and a short cooking time — no long soaking required — make it the working grade for Indian, African and Mediterranean cuisine, canned lines and dry retail packs. Cleaned, destoned and optically sorted to remove discoloured and cracked grains; moisture held at 12% max.",
      "ru": "Кремово-белая фасоль вигна с характерным чёрным глазком, калибр 300–330 шт. на 100 г. Тонкая оболочка и короткое время варки без длительного замачивания делают её рабочим сортом для индийской, африканской и средиземноморской кухни, консервных линий и сухой розничной фасовки. Очищена, отделена от камней и оптически отсортирована с удалением потемневших и треснувших зёрен; влажность не выше 12%.",
      "uz": "Xarakterli qora koʻzli, krem-oq rangli vigna loviyasi; kalibri 100 grammda 300–330 dona. Poʻsti yupqa, uzoq ivitishsiz tez pishadi — shu bois hind, afrika va Oʻrta yer dengizi oshxonasi, konserva liniyalari va quruq chakana qadoq uchun asosiy nav hisoblanadi. Tozalangan, toshdan ajratilgan va optik saralangan: rangi oʻzgargan hamda yorilgan donalar chiqarib tashlanadi; namligi 12% dan oshmaydi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
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
          "uz": "Oʻzbekiston"
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
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga koʻra"
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
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga koʻra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
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
      "uz": "Binafsha-siyohrang, toʻqroq chipor loviya; kalibri 100 grammda 200–220 dona. Pishirilganda zich, uvadek magʻiz beradi va och navlarga qaraganda rangini yaxshiroq saqlaydi, shu bois shoʻrvalar, qovurma taomlar, muzlatilgan sabzavot va quruq aralashmalar uchun olinadi. Tozalangan va optik saralangan holda, 99% tozalik hamda 12% gacha namlik bilan, loviya assortimentining qolgan qismi bilan bir xil shartlarda yetkaziladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
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
          "uz": "Oʻzbekiston"
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
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga koʻra"
        }
      }
    ],
    "image": "/images/products/purple-speckled-kidney-beans.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana) and Tashkent region; part of the volume comes from Jizzakh and Samarkand regions.",
      "ru": "Ферганская долина (Андижан, Наманган, Фергана) и Ташкентская область; часть объёма — Джизакская и Самаркандская области.",
      "uz": "Fargʻona vodiysi (Andijon, Namangan, Fargʻona) va Toshkent viloyati; hajmning bir qismi Jizzax va Samarqand viloyatlaridan."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga koʻra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
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
      "uz": "Qizil hoshiyali mayda loviya; kalibri 100 grammda 340–370 dona — assortimentdagi eng mayda donadorlik. Mayda doni sousni tez shimadi va bir tekis pishadi, shu bois shoʻrvalar, loviya pastalari, chili va qayta ishlash vaqti qisqa boʻlishi kerak boʻlgan tayyor taomlar uchun qulay. Tozalangan, toshdan ajratilgan va optik saralangan; tozaligi 99%, namligi 12% gacha, boshqa loviya navlari bilan bir xil eksport standartida qadoqlanadi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
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
          "uz": "Oʻzbekiston"
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
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (24 MT) in 25 kg bags; FCA Tashkent, DAP or CIF on request",
          "ru": "1 × 20-футовый контейнер (24 т) в мешках по 25 кг; FCA Ташкент, DAP или CIF по запросу",
          "uz": "1 × 20 futli konteyner (24 t), 25 kg qoplarda; FCA Toshkent, DAP yoki CIF talabga koʻra"
        }
      }
    ],
    "image": "/images/products/red-skirt-kidney-beans.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana) and Tashkent region; part of the volume comes from Jizzakh and Samarkand regions.",
      "ru": "Ферганская долина (Андижан, Наманган, Фергана) и Ташкентская область; часть объёма — Джизакская и Самаркандская области.",
      "uz": "Fargʻona vodiysi (Andijon, Namangan, Fargʻona) va Toshkent viloyati; hajmning bir qismi Jizzax va Samarqand viloyatlaridan."
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 500 and 1000 kg, retail packing 500 g – 5 kg on request; approx. 24 MT per 20' FCL",
      "ru": "Мешки ПП 25 / 50 кг, биг-бэги 500 и 1000 кг, розничная фасовка 500 г – 5 кг по запросу; около 24 т в 20-футовом контейнере",
      "uz": "25 / 50 kg PP qoplar, 500 va 1000 kg big-beglar, talabga koʻra 500 g – 5 kg chakana qadoq; 20 futli konteynerda taxminan 24 t"
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
      "uz": "Oʻzbekistonning anʼanaviy uzumchilik vodiylarida quyoshda quritilgan mayiz — qora, qizil, sariq va jigarrang turlari danaksiz kishmish va sultoni navlaridan tayyorlanadi. Tabiiy shakarning yuqoriligi va zich eti uni nonvoychilik va qandolat ishlab chiqarishi, don hamda gazak aralashmalari va chakana qadoqlash uchun barqaror xomashyoga aylantiradi. Tozalangan va kalibrlangan holda yetkaziladi; lazerli saralash va metall detektor — talab boʻyicha."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Turlari"
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
          "uz": "Namligi"
        },
        "value": {
          "en": "16% max.",
          "ru": "не более 16%",
          "uz": "16% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
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
          "uz": "+5…+20 °C da 12 oy, nisbiy namlik 65% dan koʻp emas, quruq shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 18–20 MT); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 18–20 т); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 18–20 t); FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/raisins.jpg",
    "featured": true,
    "regions": {
      "en": "Samarkand and Bukhara regions, Tashkent region (Parkent, Bostanlyk), Jizzakh — traditional table-grape valleys.",
      "ru": "Самаркандская и Бухарская области, Ташкентская область (Паркент, Бостанлык), Джизак — традиционные виноградарские долины.",
      "uz": "Samarqand va Buxoro viloyatlari, Toshkent viloyati (Parkent, Boʻstonliq), Jizzax — anʼanaviy uzumchilik vodiylari."
    },
    "packaging": {
      "en": "10 kg and 12.5 kg cartons, 25 kg PP bags with inner food-grade PE liner; big bags 500–1000 kg and retail packing 200 g – 1 kg on request. Approx. 18–20 MT per 20' container.",
      "ru": "Коробки 10 и 12,5 кг, мешки ПП 25 кг с внутренним пищевым ПЭ-вкладышем; биг-бэги 500–1000 кг и розничная фасовка 200 г – 1 кг по запросу. Около 18–20 т в 20-футовом контейнере.",
      "uz": "10 va 12,5 kg kartonlar, ichki oziq-ovqatbop PE ichlikli 25 kg PP qoplar; talab boʻyicha 500–1000 kg big-beglar va 200 g – 1 kg chakana qadoq. 20 futlik konteynerda taxminan 18–20 t."
    },
    "hsCode": "0806.20"
  },
  {
    "slug": "dried-apricot",
    "category": "dried-fruits",
    "name": {
      "en": "Dried Apricot",
      "ru": "Сушёный абрикос",
      "uz": "Quritilgan oʻrik (oʻrik qoqi)"
    },
    "latinName": "Prunus armeniaca L.",
    "description": {
      "en": "Uzbek dried apricot is produced from ripe fruit of Fergana Valley and Samarkand orchards and is offered both sulphured (bright orange, SO2 within EU limits) and naturally sun-dried (dark amber, no additives). Calibration by fruit count per kilogram gives consistent lots for retail packing, bakery fillings, muesli and compote blends. Fruit is hand-sorted; pitted and stone-in formats are available.",
      "ru": "Узбекская курага производится из спелых плодов садов Ферганской долины и Самаркандской области и поставляется как в сульфитированном виде (яркий оранжевый цвет, SO2 в пределах норм ЕС), так и в натуральной солнечной сушке (тёмно-янтарная, без добавок). Калибровка по количеству плодов на килограмм обеспечивает однородные партии для розничной фасовки, начинок для выпечки, мюсли и компотных смесей. Продукт проходит ручную переборку; доступны форматы без косточки и с косточкой.",
      "uz": "Oʻzbek oʻrik qoqisi Fargʻona vodiysi va Samarqand bogʻlarining pishgan mevalaridan tayyorlanadi hamda oltingugurtlangan (yorqin toʻq sariq, SO2 miqdori Yevropa Ittifoqi meʼyorlari doirasida) va tabiiy quyoshda quritilgan (toʻq qahrabo rang, qoʻshimchalarsiz) koʻrinishlarda taklif etiladi. Bir kilogrammdagi meva soni boʻyicha kalibrlash chakana qadoqlash, non-qandolat toʻldirmalari, myusli va kompot aralashmalari uchun bir xil partiyalarni beradi. Meva qoʻlda saralanadi; danaksiz va danakli shakllari mavjud."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Turlari"
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
          "uz": "Namligi"
        },
        "value": {
          "en": "20% max.",
          "ru": "не более 20%",
          "uz": "20% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
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
          "uz": "+5…+18 °C da 12 oy, nisbiy namlik 65% dan koʻp emas, keskin hidli mahsulotlardan alohida"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 16–18 MT); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 16–18 т); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 16–18 t); FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-apricot.jpg",
    "featured": true,
    "regions": {
      "en": "Fergana Valley (Namangan, Andijan, Fergana) and Samarkand region (Urgut area) — the country's main apricot-drying districts.",
      "ru": "Ферганская долина (Наманган, Андижан, Фергана) и Самаркандская область (Ургутский район) — основные районы сушки абрикоса в стране.",
      "uz": "Fargʻona vodiysi (Namangan, Andijon, Fargʻona) va Samarqand viloyati (Urgut atrofi) — mamlakatdagi asosiy oʻrik quritish hududlari."
    },
    "packaging": {
      "en": "5 kg, 10 kg and 12.5 kg cartons with food-grade PE liner, 25 kg PP bags; vacuum packing and retail packs 200 g – 1 kg on request. Approx. 16–18 MT per 20' container.",
      "ru": "Коробки 5, 10 и 12,5 кг с пищевым ПЭ-вкладышем, мешки ПП 25 кг; вакуумная упаковка и розничная фасовка 200 г – 1 кг по запросу. Около 16–18 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 5, 10 va 12,5 kg kartonlar, 25 kg PP qoplar; talab boʻyicha vakuumli qadoq va 200 g – 1 kg chakana qadoq. 20 futlik konteynerda taxminan 16–18 t."
    },
    "hsCode": "0813.10"
  },
  {
    "slug": "dried-prune",
    "category": "dried-fruits",
    "name": {
      "en": "Dried Prune",
      "ru": "Чернослив",
      "uz": "Quritilgan olxoʻri (chernosliv)"
    },
    "latinName": "Prunus domestica L.",
    "description": {
      "en": "Dried prunes from Ashlock, Spain and Hungarian plum varieties, supplied pitted and with stone, in natural dry form or lightly glycerine-treated for a softer texture. High dry-matter content and a low share of broken fruit make them a dependable raw material for prune paste and juice concentrate, bakery fillings, snack mixes and retail packs. Grading by fruit count per 500 g is available on request.",
      "ru": "Чернослив из слив сортов Ашлок, Испанка и Венгерка — с косточкой и без косточки, в натуральной сухой форме или с лёгкой обработкой глицерином для более мягкой текстуры. Высокое содержание сухих веществ и низкая доля боя делают его надёжным сырьём для пасты и сокового концентрата, начинок для выпечки, снековых смесей и розничной фасовки. Калибровка по количеству плодов на 500 г — по запросу.",
      "uz": "Ashlok, Ispanka va Vengerka olxoʻri navlaridan tayyorlangan quritilgan olxoʻri — danakli va danaksiz, tabiiy quruq holda yoki yumshoqroq tuzilma uchun yengil glitserin bilan ishlangan. Quruq modda miqdorining yuqoriligi va singan meva ulushining pastligi uni olxoʻri pastasi va sharbat konsentrati, non-qandolat toʻldirmalari, gazak aralashmalari va chakana qadoq uchun ishonchli xomashyoga aylantiradi. 500 grammdagi meva soni boʻyicha kalibrlash — talab boʻyicha."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Turlari"
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
          "uz": "Namligi"
        },
        "value": {
          "en": "25% max.",
          "ru": "не более 25%",
          "uz": "25% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
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
          "uz": "+5…+18 °C da 12 oy, nisbiy namlik 70% dan koʻp emas, quruq shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 18–20 MT); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 18–20 т); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 18–20 t); FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-prune.jpg",
    "regions": {
      "en": "Samarkand and Tashkent regions, Fergana Valley — foothill plum orchards with cool nights during ripening.",
      "ru": "Самаркандская и Ташкентская области, Ферганская долина — предгорные сливовые сады с прохладными ночами в период созревания.",
      "uz": "Samarqand va Toshkent viloyatlari, Fargʻona vodiysi — pishish davrida tunlari salqin boʻladigan togʻoldi olxoʻri bogʻlari."
    },
    "packaging": {
      "en": "10 kg and 12.5 kg cartons with food-grade PE liner, 25 kg PP bags; big bags and retail packs 200 g – 1 kg on request. Approx. 18–20 MT per 20' container.",
      "ru": "Коробки 10 и 12,5 кг с пищевым ПЭ-вкладышем, мешки ПП 25 кг; биг-бэги и розничная фасовка 200 г – 1 кг по запросу. Около 18–20 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 12,5 kg kartonlar, 25 kg PP qoplar; talab boʻyicha big-beglar va 200 g – 1 kg chakana qadoq. 20 futlik konteynerda taxminan 18–20 t."
    },
    "hsCode": "0813.20"
  },
  {
    "slug": "walnuts",
    "category": "dried-fruits",
    "name": {
      "en": "Walnuts",
      "ru": "Грецкий орех",
      "uz": "Yongʻoq"
    },
    "latinName": "Juglans regia L.",
    "description": {
      "en": "Walnut kernels in light (white) and amber (red) colour grades, grown in mountain-foothill orchards where wide day-to-night temperature swings build up oil content and a clean, non-bitter taste. Supplied as halves, quarters and pieces after hand and laser sorting, with shell fragment content controlled to export standards. Used in confectionery, bakery, ice cream and halva production and in retail nut mixes; in-shell walnuts are available seasonally.",
      "ru": "Ядро грецкого ореха светлых (белый) и янтарных (красный) цветовых категорий выращивается в предгорных садах, где значительные суточные перепады температур дают высокую масличность и чистый вкус без горечи. Поставляется половинками, четвертинками и ломом после ручной и лазерной сортировки, содержание частиц скорлупы контролируется по экспортным нормам. Применяется в кондитерском и хлебопекарном производстве, мороженом и халве, а также в розничных ореховых смесях; орех в скорлупе — сезонно.",
      "uz": "Yorugʻ (oq) va qahrabo (qizil) rang toifalaridagi yongʻoq magʻzi togʻoldi bogʻlarida yetishtiriladi — kunduzgi va tungi harorat farqi kattaligi tufayli moy miqdori yuqori, taʼmi toza va achchiqsiz. Qoʻlda va lazerli saralashdan soʻng yarim, chorak hamda maydalangan holda yetkaziladi, poʻchoq zarralari miqdori eksport talablari darajasida nazorat qilinadi. Qandolat va nonvoychilik, muzqaymoq va halva ishlab chiqarish, chakana yongʻoq aralashmalari uchun ishlatiladi; poʻchogʻi bilan yongʻoq mavsumiy ravishda mavjud."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Turlari"
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
          "uz": "Namligi"
        },
        "value": {
          "en": "8% max.",
          "ru": "не более 8%",
          "uz": "8% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
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
          "uz": "magʻiz: PE ichlikli 10 / 12,5 kg kartonlar; poʻchogʻi bilan: 25 kg PP toʻrli qoplar"
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
          "uz": "+2…+10 °C da 12 oy (oddiy haroratda 6 oygacha), nisbiy namlik 65% dan koʻp emas"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 12–14 MT of kernels); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 12–14 т ядра); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 12–14 t magʻiz); FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/walnuts.jpg",
    "regions": {
      "en": "Mountain-foothill areas of Tashkent region (Bostanlyk), the Fergana Valley, Surkhandarya, Kashkadarya and Jizzakh.",
      "ru": "Предгорные районы Ташкентской области (Бостанлык), Ферганская долина, Сурхандарья, Кашкадарья и Джизак.",
      "uz": "Toshkent viloyatining togʻoldi hududlari (Boʻstonliq), Fargʻona vodiysi, Surxondaryo, Qashqadaryo va Jizzax."
    },
    "packaging": {
      "en": "Kernels in 10 kg and 12.5 kg cartons with food-grade PE liner, vacuum packing on request; in-shell walnuts in 25 kg PP mesh or woven bags. Retail packs on request. Approx. 12–14 MT of kernels per 20' container.",
      "ru": "Ядро — коробки 10 и 12,5 кг с пищевым ПЭ-вкладышем, вакуумная упаковка по запросу; орех в скорлупе — сетчатые или тканые мешки ПП 25 кг. Розничная фасовка по запросу. Около 12–14 т ядра в 20-футовом контейнере.",
      "uz": "Magʻiz — oziq-ovqatbop PE ichlikli 10 va 12,5 kg kartonlarda, talab boʻyicha vakuumli qadoq; poʻchogʻi bilan yongʻoq — 25 kg PP toʻrli yoki toʻqima qoplarda. Chakana qadoq talab boʻyicha. 20 futlik konteynerda taxminan 12–14 t magʻiz."
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
      "uz": "Oʻzbek bodomi poʻchogʻi bilan va magʻiz holida, janubiy hamda togʻoldi tumanlarida yetishtirilgan shirin navlardan taklif etiladi; zich tuzilma va mayin shirin taʼm Markaziy Osiyo bogʻlariga xos. Magʻiz oʻlchami boʻyicha kalibrlanadi, yorilgan donalar va begona aralashmalardan saralanadi — bu qandolat va non liniyalari, yongʻoq pastalari, qovurish va chakana qadoqlash uchun qulay. Blanshirlash va vakuumli qadoqlash — talab boʻyicha."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Turlari"
        },
        "value": {
          "en": "In-shell / Kernels (shelled)",
          "ru": "В скорлупе / Без скорлупы (ядро)",
          "uz": "Poʻchogʻi bilan / Magʻiz (poʻchogʻisiz)"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "6% max.",
          "ru": "не более 6%",
          "uz": "6% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
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
          "uz": "magʻiz: PE ichlikli 10 / 12,5 kg kartonlar; poʻchogʻi bilan: 25 kg PP qoplar"
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
          "uz": "+5…+15 °C da 12 oy, nisbiy namlik 65% dan koʻp emas, keskin hidli mahsulotlardan alohida"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 14–16 MT of kernels); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 14–16 т ядра); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 14–16 t magʻiz); FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/almonds.jpg",
    "regions": {
      "en": "Surkhandarya and Kashkadarya, Samarkand region and the foothill districts of Tashkent region.",
      "ru": "Сурхандарья и Кашкадарья, Самаркандская область и предгорные районы Ташкентской области.",
      "uz": "Surxondaryo va Qashqadaryo, Samarqand viloyati hamda Toshkent viloyatining togʻoldi tumanlari."
    },
    "packaging": {
      "en": "Kernels in 10 kg and 12.5 kg cartons with food-grade PE liner, vacuum packing on request; in-shell almonds in 25 kg PP bags. Retail packs 100 g – 1 kg on request. Approx. 14–16 MT of kernels per 20' container.",
      "ru": "Ядро — коробки 10 и 12,5 кг с пищевым ПЭ-вкладышем, вакуумная упаковка по запросу; миндаль в скорлупе — мешки ПП 25 кг. Розничная фасовка 100 г – 1 кг по запросу. Около 14–16 т ядра в 20-футовом контейнере.",
      "uz": "Magʻiz — oziq-ovqatbop PE ichlikli 10 va 12,5 kg kartonlarda, talab boʻyicha vakuumli qadoq; poʻchogʻi bilan bodom — 25 kg PP qoplarda. 100 g – 1 kg chakana qadoq talab boʻyicha. 20 futlik konteynerda taxminan 14–16 t magʻiz."
    },
    "hsCode": "0802.11"
  },
  {
    "slug": "peanuts",
    "category": "dried-fruits",
    "name": {
      "en": "Peanuts",
      "ru": "Арахис",
      "uz": "Yer yongʻoq"
    },
    "latinName": "Arachis hypogaea L.",
    "description": {
      "en": "Groundnuts supplied shelled (kernels) and unshelled from irrigated fields of the Fergana Valley and Tashkent region, calibrated by count per ounce for predictable roasting behaviour. Aflatoxin is controlled lot by lot, with third-party laboratory reports issued before shipment. Suitable for roasting and salting, peanut butter and paste, confectionery, bakery and snack lines.",
      "ru": "Арахис поставляется очищенным (ядро) и в скорлупе с орошаемых полей Ферганской долины и Ташкентской области; калибровка по количеству ядер на унцию обеспечивает предсказуемое поведение при обжарке. Содержание афлатоксинов контролируется по каждой партии, до отгрузки предоставляются протоколы независимой лаборатории. Подходит для обжарки и соления, производства арахисовой пасты, кондитерских и хлебобулочных изделий, снековых линий.",
      "uz": "Yer yongʻogʻi tozalangan (magʻiz) va poʻchogʻi bilan yetkaziladi; Fargʻona vodiysi va Toshkent viloyatining sugʻoriladigan dalalarida yetishtiriladi hamda unsiyadagi dona soni boʻyicha kalibrlanadi, bu qovurishda barqaror natija beradi. Aflatoksin miqdori har bir partiya boʻyicha nazorat qilinadi, joʻnatishdan oldin mustaqil laboratoriya bayonnomalari taqdim etiladi. Qovurish va tuzlash, yer yongʻogʻi pastasi, qandolat va non mahsulotlari hamda gazak liniyalari uchun mos."
    },
    "specs": [
      {
        "label": {
          "en": "Varieties",
          "ru": "Разновидности",
          "uz": "Turlari"
        },
        "value": {
          "en": "Shelled / Unshelled",
          "ru": "Без скорлупы (ядро) / В скорлупе",
          "uz": "Magʻiz (poʻchogʻisiz) / Poʻchogʻi bilan"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "8% max.",
          "ru": "не более 8%",
          "uz": "8% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
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
          "uz": "+5…+20 °C da 12 oy, nisbiy namlik 70% dan koʻp emas, quruq shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "1 x 20' FCL (approx. 20 MT); FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "1 x 20' FCL (ок. 20 т); FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "1 x 20' FCL (taxminan 20 t); FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/peanuts.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan), Tashkent and Khorezm regions — irrigated fields with a long warm season.",
      "ru": "Ферганская долина (Андижан, Наманган), Ташкентская и Хорезмская области — орошаемые поля с продолжительным тёплым сезоном.",
      "uz": "Fargʻona vodiysi (Andijon, Namangan), Toshkent va Xorazm viloyatlari — uzoq issiq mavsumli sugʻoriladigan dalalar."
    },
    "packaging": {
      "en": "25 kg and 50 kg PP bags, big bags 1000 kg; 10 kg vacuum cartons for kernels and retail packing on request. Approx. 20 MT per 20' container.",
      "ru": "Мешки ПП 25 и 50 кг, биг-бэги 1000 кг; вакуумные коробки 10 кг для ядра и розничная фасовка по запросу. Около 20 т в 20-футовом контейнере.",
      "uz": "25 va 50 kg PP qoplar, 1000 kg big-beglar; magʻiz uchun 10 kg vakuumli kartonlar va chakana qadoq talab boʻyicha. 20 futlik konteynerda taxminan 20 t."
    },
    "hsCode": "1202.41"
  },
  {
    "slug": "organic-green-mung-beans",
    "category": "organic",
    "name": {
      "en": "Organic Green Mung Beans",
      "ru": "Органический зелёный маш",
      "uz": "Organik yashil mosh"
    },
    "latinName": "Vigna radiata",
    "description": {
      "en": "Certified organic green mung beans from the southern and central regions of Uzbekistan, machine-cleaned, de-stoned and colour-sorted to 99% purity. Uzbek mung has a thin skin, an even green colour and stable germination, so the same lot works for retail packing, dhal processing and sprouting programmes. Organic status is documented lot by lot and traceable back to the certified field.",
      "ru": "Сертифицированный органический зелёный маш из южных и центральных регионов Узбекистана: машинная очистка, камнеотбор, фотосепарация, чистота от 99%. Узбекский маш отличается тонкой кожурой, ровным зелёным цветом и стабильной всхожестью — одна и та же партия подходит и для фасовки, и для переработки в дал, и для проращивания. Органический статус подтверждается по каждой партии и прослеживается до сертифицированного поля.",
      "uz": "Oʻzbekistonning janubiy va markaziy hududlarida yetishtirilgan sertifikatlangan organik yashil mosh: mashinada tozalangan, toshdan ajratilgan va foto-saralangan, tozaligi 99% dan kam emas. Oʻzbek moshining poʻsti yupqa, rangi bir tekis yashil, unib chiqish qobiliyati barqaror — shu bois bir partiya ham qadoqlash, ham dal ishlab chiqarish, ham undirish uchun mos keladi. Organik maqomi har bir partiya boʻyicha hujjatlashtiriladi va sertifikatlangan dalagacha kuzatiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "+3.0 mm / +3.5 mm; split mung on request; machine-cleaned and colour-sorted",
          "ru": "+3,0 мм / +3,5 мм; дроблёный по запросу; машинная очистка и фотосепарация",
          "uz": "+3,0 mm / +3,5 mm; soʻrov boʻyicha maydalangan; mashinada tozalangan va foto-saralangan"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Purity 99% min. / Moisture 11% max. / Origin: Uzbekistan",
          "ru": "Чистота 99% мин. / Влажность 11% макс. / Происхождение: Узбекистан",
          "uz": "Tozaligi 99% dan kam emas / Namligi 11% dan koʻp emas / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request",
          "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу",
          "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months in dry, ventilated warehouses at up to +20 °C, RH 65% max.",
          "ru": "24 месяца в сухом вентилируемом складе при температуре до +20 °C и влажности не выше 65%",
          "uz": "Quruq, shamollatiladigan omborda +20 °C gacha va nisbiy namlik 65% dan oshmaganda 24 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 20 MT (1 × 20' FCL); FCA Tashkent, FOB Poti / Aktau, DAP EU (Incoterms 2020)",
          "ru": "от 20 т (1 × 20' FCL); FCA Ташкент, FOB Поти / Актау, DAP ЕС (Инкотермс 2020)",
          "uz": "20 tonnadan (1 × 20' FCL); FCA Toshkent, FOB Poti / Aktau, DAP YeI (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/organic-green-mung-beans.jpg",
    "featured": true,
    "regions": {
      "en": "Kashkadarya, Surkhandarya, Jizzakh and Syrdarya regions — certified organic plots on irrigated and rain-fed land",
      "ru": "Кашкадарьинская, Сурхандарьинская, Джизакская и Сырдарьинская области — сертифицированные органические участки на орошаемых и богарных землях",
      "uz": "Qashqadaryo, Surxondaryo, Jizzax va Sirdaryo viloyatlari — sugʻoriladigan va lalmikor yerlardagi sertifikatlangan organik maydonlar"
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request; 25-27 MT per 40' FCL",
      "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу; 25-27 т в 40' контейнере",
      "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash; 40' konteynerda 25-27 tonna"
    },
    "hsCode": "0713.31"
  },
  {
    "slug": "organic-sultana",
    "category": "organic",
    "name": {
      "en": "Organic Sultana",
      "ru": "Органический изюм «Султана»",
      "uz": "Organik sultoni mayiz"
    },
    "latinName": "Vitis vinifera",
    "description": {
      "en": "Seedless sultana raisins from certified organic vineyards, sun-dried in the traditional Uzbek way without sulphur dioxide or added oil. The continental climate gives a high natural sugar content and a firm, non-sticky berry that holds its shape in bakery, muesli and confectionery lines. Every consignment is cleaned, laser-sorted and metal-detected before packing, with organic certificates issued per lot.",
      "ru": "Изюм сорта «Султана» без косточек с сертифицированных органических виноградников, высушенный на солнце по традиционной узбекской технологии — без диоксида серы и без обработки маслом. Континентальный климат даёт высокое содержание природных сахаров и плотную, неслипающуюся ягоду, которая держит форму в хлебопечении, мюсли и кондитерских линиях. Каждая партия проходит очистку, лазерную сортировку и металлодетекцию, органические сертификаты оформляются на каждый лот.",
      "uz": "Sertifikatlangan organik uzumzorlardan olingan danaksiz sultoni mayiz anʼanaviy oʻzbek usulida quyoshda quritiladi — oltingugurt dioksidi va moy ishlatilmaydi. Kontinental iqlim tufayli tabiiy shakar miqdori yuqori, mevasi zich va yopishmaydi, shu bois nonvoychilik, musli va qandolat liniyalarida shaklini saqlaydi. Har bir partiya tozalash, lazerli saralash va metall detektoridan oʻtkaziladi, organik sertifikatlar har bir lot uchun rasmiylashtiriladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Seedless sun-dried sultana, natural (unsulphured), oil-free; 260-320 berries / 100 g, Jumbo grade on request",
          "ru": "«Султана» без косточек, солнечной сушки, натуральный (без сульфитов), без масла; 260-320 ягод / 100 г, Jumbo по запросу",
          "uz": "Danaksiz quyoshda quritilgan sultoni, tabiiy (sulfitsiz), moysiz; 100 g da 260-320 dona, soʻrov boʻyicha Jumbo"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Foreign matter 0.5% max., stems 1% max. / Moisture 15-17% / Origin: Uzbekistan",
          "ru": "Посторонние примеси 0,5% макс., плодоножки 1% макс. / Влажность 15-17% / Происхождение: Узбекистан",
          "uz": "Begona aralashmalar 0,5% dan koʻp emas, bandlar 1% dan koʻp emas / Namligi 15-17% / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 kg / 12.5 kg carton boxes with food-grade PE liner, 20 kg cartons, retail packing on request",
          "ru": "картонные короба 10 кг / 12,5 кг с пищевым ПЭ-вкладышем, короба 20 кг, потребительская фасовка по запросу",
          "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg / 12,5 kg karton qutilar, 20 kg qutilar, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +5…+15 °C, RH 65% max., away from direct sunlight",
          "ru": "12 месяцев при +5…+15 °C, влажность не выше 65%, без прямого солнечного света",
          "uz": "+5…+15 °C da, nisbiy namlik 65% dan oshmaganda, toʻgʻridan-toʻgʻri quyosh nuridan uzoqda 12 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 5 MT trial lot, 18-20 MT per FCL; FCA Tashkent, DAP EU (Incoterms 2020), samples by air",
          "ru": "от 5 т пробной партии, 18-20 т в контейнере; FCA Ташкент, DAP ЕС (Инкотермс 2020), образцы авиапочтой",
          "uz": "5 tonnalik sinov partiyasidan, konteynerda 18-20 tonna; FCA Toshkent, DAP YeI (Inkoterms 2020), namunalar aviapochta orqali"
        }
      }
    ],
    "image": "/images/products/organic-sultana.jpg",
    "regions": {
      "en": "Samarkand and Bukhara regions, Parkent and Bostanlyk districts of Tashkent region, Fergana Valley — certified organic vineyards",
      "ru": "Самаркандская и Бухарская области, Паркентский и Бостанлыкский районы Ташкентской области, Ферганская долина — сертифицированные органические виноградники",
      "uz": "Samarqand va Buxoro viloyatlari, Toshkent viloyatining Parkent va Boʻstonliq tumanlari, Fargʻona vodiysi — sertifikatlangan organik uzumzorlar"
    },
    "packaging": {
      "en": "10 kg / 12.5 kg carton boxes with food-grade PE liner, 20 kg cartons, vacuum or retail packing on request",
      "ru": "картонные короба 10 кг / 12,5 кг с пищевым ПЭ-вкладышем, короба 20 кг, вакуум или потребительская фасовка по запросу",
      "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg / 12,5 kg karton qutilar, 20 kg qutilar, soʻrov boʻyicha vakuum yoki chakana qadoqlash"
    },
    "hsCode": "0806.20"
  },
  {
    "slug": "organic-sesame-seeds",
    "category": "organic",
    "name": {
      "en": "Organic Sesame Seeds",
      "ru": "Органические семена кунжута",
      "uz": "Organik kunjut urugʻi"
    },
    "latinName": "Sesamum indicum",
    "description": {
      "en": "Whole natural sesame seeds grown on certified organic land in southern Uzbekistan and cleaned to 99.95% purity on gravity and optical sorters. Oil content of 48-52% and a clean, nutty profile make the seed suitable for tahini, bakery toppings and cold-pressed oil. Hulled seed can be supplied on request, and every lot carries an organic certificate traceable to the field.",
      "ru": "Цельные натуральные семена кунжута, выращенные на сертифицированных органических землях юга Узбекистана и очищенные до 99,95% на гравитационных и оптических сепараторах. Масличность 48-52% и чистый ореховый вкус позволяют использовать семя для тахини, посыпки в хлебопечении и холодного отжима масла. По запросу поставляется очищенное (шелушёное) семя; на каждую партию оформляется органический сертификат с прослеживаемостью до поля.",
      "uz": "Oʻzbekiston janubidagi sertifikatlangan organik yerlarda yetishtirilgan butun tabiiy kunjut urugʻi gravitatsion va optik saralagichlarda 99,95% gacha tozalanadi. Moyliligi 48-52% va toza yongʻoqsimon taʼmi tufayli u tahin, nonvoychilik sepmasi va sovuq presslangan moy uchun mos keladi. Soʻrov boʻyicha poʻsti tozalangan urugʻ ham yetkaziladi; har bir partiyaga dalagacha kuzatiladigan organik sertifikat beriladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Whole natural white seed, oil content 48-52%; hulled seed on request",
          "ru": "цельное натуральное белое семя, масличность 48-52%; шелушёное семя по запросу",
          "uz": "Butun tabiiy oq urugʻ, moyliligi 48-52%; soʻrov boʻyicha poʻstsiz urugʻ"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Purity 99.95% min. / Moisture 6% max. / Origin: Uzbekistan",
          "ru": "Чистота 99,95% мин. / Влажность 6% макс. / Происхождение: Узбекистан",
          "uz": "Tozaligi 99,95% dan kam emas / Namligi 6% dan koʻp emas / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request",
          "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу",
          "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "18 months in dry, ventilated warehouses at up to +20 °C, RH 65% max.",
          "ru": "18 месяцев в сухом вентилируемом складе при температуре до +20 °C и влажности не выше 65%",
          "uz": "Quruq, shamollatiladigan omborda +20 °C gacha va nisbiy namlik 65% dan oshmaganda 18 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 20 MT (1 × 20' FCL); FCA Tashkent, FOB Poti / Aktau, DAP EU (Incoterms 2020)",
          "ru": "от 20 т (1 × 20' FCL); FCA Ташкент, FOB Поти / Актау, DAP ЕС (Инкотермс 2020)",
          "uz": "20 tonnadan (1 × 20' FCL); FCA Toshkent, FOB Poti / Aktau, DAP YeI (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/organic-sesame-seeds.jpg",
    "regions": {
      "en": "Surkhandarya and Kashkadarya regions, Khorezm — warm southern zones with certified organic sesame plots",
      "ru": "Сурхандарьинская и Кашкадарьинская области, Хорезм — тёплые южные зоны с сертифицированными органическими посевами кунжута",
      "uz": "Surxondaryo va Qashqadaryo viloyatlari, Xorazm — sertifikatlangan organik kunjut maydonlari joylashgan issiq janubiy hududlar"
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request; 25-26 MT per 40' FCL",
      "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу; 25-26 т в 40' контейнере",
      "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash; 40' konteynerda 25-26 tonna"
    },
    "hsCode": "1207.40"
  },
  {
    "slug": "organic-kidney-beans",
    "category": "organic",
    "name": {
      "en": "Organic Kidney Beans",
      "ru": "Органическая фасоль",
      "uz": "Organik loviya"
    },
    "latinName": "Phaseolus vulgaris",
    "description": {
      "en": "Certified organic kidney beans in light speckled and red speckled types, calibrated at 180-220 seeds per 100 g and colour-sorted for uniform appearance. Grown on irrigated organic plots of the Fergana Valley, the beans cook evenly and keep their skin intact, which suits canning, dry retail packing and food-service programmes. Organic documentation is issued per lot and traceable to the field.",
      "ru": "Сертифицированная органическая фасоль пёстрых и красных типов, откалиброванная на уровне 180-220 шт. на 100 г и отсортированная по цвету для однородного внешнего вида. Выращена на орошаемых органических участках Ферганской долины: равномерно разваривается и сохраняет целую кожуру, что важно для консервирования, сухой фасовки и сегмента HoReCa. Органические документы оформляются на каждую партию и прослеживаются до поля.",
      "uz": "Sertifikatlangan organik loviya — chipor va qizil turlari, 100 g da 180-220 dona qilib kalibrlangan va bir xil koʻrinish uchun rangi boʻyicha saralangan. Fargʻona vodiysining sugʻoriladigan organik maydonlarida yetishtiriladi, bir tekis pishadi va poʻsti butun qoladi — bu konservalash, quruq qadoqlash va HoReCa uchun muhim. Organik hujjatlar har bir partiya uchun rasmiylashtiriladi va dalagacha kuzatiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Light speckled and red speckled types, 180-220 seeds / 100 g; machine-cleaned and colour-sorted",
          "ru": "пёстрая и красная фасоль, 180-220 шт. / 100 г; машинная очистка и фотосепарация",
          "uz": "Chipor va qizil turlar, 100 g da 180-220 dona; mashinada tozalangan va foto-saralangan"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Purity 99% min. / Moisture 12% max. / Origin: Uzbekistan",
          "ru": "Чистота 99% мин. / Влажность 12% макс. / Происхождение: Узбекистан",
          "uz": "Tozaligi 99% dan kam emas / Namligi 12% dan koʻp emas / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request",
          "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу",
          "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months in dry, ventilated warehouses at up to +20 °C, RH 65% max.",
          "ru": "24 месяца в сухом вентилируемом складе при температуре до +20 °C и влажности не выше 65%",
          "uz": "Quruq, shamollatiladigan omborda +20 °C gacha va nisbiy namlik 65% dan oshmaganda 24 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 20 MT (1 × 20' FCL); FCA Tashkent, FOB Poti / Aktau, DAP EU (Incoterms 2020)",
          "ru": "от 20 т (1 × 20' FCL); FCA Ташкент, FOB Поти / Актау, DAP ЕС (Инкотермс 2020)",
          "uz": "20 tonnadan (1 × 20' FCL); FCA Toshkent, FOB Poti / Aktau, DAP YeI (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/organic-kidney-beans.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan, Namangan, Fergana regions) and Tashkent region — certified organic irrigated plots",
      "ru": "Ферганская долина (Андижанская, Наманганская, Ферганская области) и Ташкентская область — сертифицированные органические орошаемые участки",
      "uz": "Fargʻona vodiysi (Andijon, Namangan, Fargʻona viloyatlari) va Toshkent viloyati — sertifikatlangan organik sugʻoriladigan maydonlar"
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request; 25-27 MT per 40' FCL",
      "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу; 25-27 т в 40' контейнере",
      "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash; 40' konteynerda 25-27 tonna"
    },
    "hsCode": "0713.33"
  },
  {
    "slug": "organic-millet",
    "category": "organic",
    "name": {
      "en": "Organic Millet",
      "ru": "Органическое просо (пшено)",
      "uz": "Organik tariq"
    },
    "latinName": "Panicum miliaceum",
    "description": {
      "en": "Organic proso millet from the dryland belt of central Uzbekistan, supplied hulled as bright yellow grain or unhulled as seed. Low-input cultivation and dry harvesting conditions keep the grain clean and free of musty notes, which matters for porridge, gluten-free flour and bird-feed blends. Purity is brought to 99% on air-screen and optical equipment, with organic certification issued per lot.",
      "ru": "Органическое просо из богарного пояса центрального Узбекистана: поставляется в виде шелушёного пшена насыщенного жёлтого цвета или необрушенным зерном. Экстенсивная агротехника и сухие условия уборки дают чистое зерно без затхлых тонов — это важно для круп, безглютеновой муки и кормовых смесей. Чистота доводится до 99% на воздушно-ситовом и оптическом оборудовании, органический сертификат оформляется на каждую партию.",
      "uz": "Markaziy Oʻzbekistonning lalmikor mintaqasidan olingan organik tariq: poʻsti tozalangan sariq don yoki poʻstli urugʻ koʻrinishida yetkaziladi. Kam kimyoviy aralashuv va quruq hosil yigʻish sharoiti donni toza va begona hidsiz saqlaydi — bu boʻtqa, glyutensiz un va yem aralashmalari uchun muhim. Tozaligi havo-elak va optik uskunalarda 99% ga yetkaziladi, organik sertifikat har bir partiya uchun beriladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Hulled millet 1.8-2.2 mm, bright yellow, whole grain; unhulled seed on request",
          "ru": "шелушёное пшено 1,8-2,2 мм, насыщенно-жёлтое, целое зерно; необрушенное зерно по запросу",
          "uz": "Poʻsti tozalangan tariq 1,8-2,2 mm, toʻq sariq, butun don; soʻrov boʻyicha poʻstli urugʻ"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Purity 99% min. / Moisture 13% max. / Origin: Uzbekistan",
          "ru": "Чистота 99% мин. / Влажность 13% макс. / Происхождение: Узбекистан",
          "uz": "Tozaligi 99% dan kam emas / Namligi 13% dan koʻp emas / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request",
          "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу",
          "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months for hulled millet, 24 months for unhulled seed, in dry ventilated storage",
          "ru": "12 месяцев для шелушёного пшена, 24 месяца для необрушенного зерна, в сухом вентилируемом складе",
          "uz": "Poʻsti tozalangan tariq uchun 12 oy, poʻstli urugʻ uchun 24 oy — quruq, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 20 MT (1 × 20' FCL); FCA Tashkent, FOB Poti / Aktau, DAP EU (Incoterms 2020)",
          "ru": "от 20 т (1 × 20' FCL); FCA Ташкент, FOB Поти / Актау, DAP ЕС (Инкотермс 2020)",
          "uz": "20 tonnadan (1 × 20' FCL); FCA Toshkent, FOB Poti / Aktau, DAP YeI (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/organic-millet.jpg",
    "regions": {
      "en": "Jizzakh, Syrdarya and Kashkadarya regions — rain-fed and lightly irrigated organic land",
      "ru": "Джизакская, Сырдарьинская и Кашкадарьинская области — богарные и слабо орошаемые органические земли",
      "uz": "Jizzax, Sirdaryo va Qashqadaryo viloyatlari — lalmikor va kam sugʻoriladigan organik yerlar"
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request; 25-26 MT per 40' FCL",
      "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу; 25-26 т в 40' контейнере",
      "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash; 40' konteynerda 25-26 tonna"
    },
    "hsCode": "1008.29"
  },
  {
    "slug": "organic-chickpeas",
    "category": "organic",
    "name": {
      "en": "Organic Chickpeas",
      "ru": "Органический нут",
      "uz": "Organik noʻxat"
    },
    "latinName": "Cicer arietinum",
    "description": {
      "en": "Kabuli-type organic chickpeas in 7-8 mm and 8-9 mm calibres, grown on certified organic land in the south of Uzbekistan. The hot, dry ripening season produces a light cream colour, thin skin and reliable cooking behaviour for hummus, canning and retail packing. Lots are gravity-separated, colour-sorted and shipped with organic certificates traceable to the field.",
      "ru": "Органический нут типа «кабули» калибров 7-8 мм и 8-9 мм, выращенный на сертифицированных органических землях юга Узбекистана. Жаркий и сухой период созревания даёт светлый кремовый цвет, тонкую кожуру и предсказуемое поведение при варке — для хумуса, консервирования и фасовки. Партии проходят гравитационную очистку и фотосепарацию, отгружаются с органическими сертификатами, прослеживаемыми до поля.",
      "uz": "Oʻzbekiston janubidagi sertifikatlangan organik yerlarda yetishtirilgan «kabuli» turidagi organik noʻxat, kalibri 7-8 mm va 8-9 mm. Issiq va quruq pishish davri unga och krem rang, yupqa poʻst va pishirishda barqaror xususiyat beradi — xummus, konservalash va qadoqlash uchun. Partiyalar gravitatsion tozalash va foto-saralashdan oʻtadi, dalagacha kuzatiladigan organik sertifikatlar bilan joʻnatiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Kabuli type, calibre 7-8 mm / 8-9 mm; machine-cleaned and colour-sorted",
          "ru": "тип «кабули», калибр 7-8 мм / 8-9 мм; машинная очистка и фотосепарация",
          "uz": "«Kabuli» turi, kalibri 7-8 mm / 8-9 mm; mashinada tozalangan va foto-saralangan"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Purity 99% min. / Moisture 12% max. / Origin: Uzbekistan",
          "ru": "Чистота 99% мин. / Влажность 12% макс. / Происхождение: Узбекистан",
          "uz": "Tozaligi 99% dan kam emas / Namligi 12% dan koʻp emas / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request",
          "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу",
          "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months in dry, ventilated warehouses at up to +20 °C, RH 65% max.",
          "ru": "24 месяца в сухом вентилируемом складе при температуре до +20 °C и влажности не выше 65%",
          "uz": "Quruq, shamollatiladigan omborda +20 °C gacha va nisbiy namlik 65% dan oshmaganda 24 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 20 MT (1 × 20' FCL); FCA Tashkent, FOB Poti / Aktau, DAP EU (Incoterms 2020)",
          "ru": "от 20 т (1 × 20' FCL); FCA Ташкент, FOB Поти / Актау, DAP ЕС (Инкотермс 2020)",
          "uz": "20 tonnadan (1 × 20' FCL); FCA Toshkent, FOB Poti / Aktau, DAP YeI (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/organic-chickpeas.jpg",
    "regions": {
      "en": "Kashkadarya, Surkhandarya, Jizzakh and Samarkand regions — certified organic rain-fed and irrigated fields",
      "ru": "Кашкадарьинская, Сурхандарьинская, Джизакская и Самаркандская области — сертифицированные органические богарные и орошаемые поля",
      "uz": "Qashqadaryo, Surxondaryo, Jizzax va Samarqand viloyatlari — sertifikatlangan organik lalmikor va sugʻoriladigan dalalar"
    },
    "packaging": {
      "en": "25 kg / 50 kg PP bags, big bags 1000 kg, retail packing on request; 25-27 MT per 40' FCL",
      "ru": "мешки ПП 25 кг / 50 кг, биг-бэги 1000 кг, потребительская фасовка по запросу; 25-27 т в 40' контейнере",
      "uz": "25 kg / 50 kg PP qoplar, 1000 kg big-bag, soʻrov boʻyicha chakana qadoqlash; 40' konteynerda 25-27 tonna"
    },
    "hsCode": "0713.20"
  },
  {
    "slug": "organic-dried-apricot",
    "category": "organic",
    "name": {
      "en": "Organic Dried Apricot",
      "ru": "Органическая курага",
      "uz": "Organik oʻrik qoqi"
    },
    "latinName": "Prunus armeniaca",
    "description": {
      "en": "Sun-dried organic apricots from mountain and foothill orchards, processed without sulphur dioxide, so the fruit keeps its natural dark-amber colour and concentrated sweetness. High day-night temperature contrast in the growing zones gives a dense, meaty pulp that holds up in bakery fillings, snack mixes and infant-food lines. Supplied whole and pitted in A / AA / AAA sizes, each lot certified organic and traceable to the orchard.",
      "ru": "Курага солнечной сушки с горных и предгорных садов, переработанная без диоксида серы — фрукт сохраняет натуральный тёмно-янтарный цвет и концентрированную сладость. Большой перепад дневных и ночных температур в зонах выращивания формирует плотную мясистую мякоть, которая держит форму в начинках, снековых миксах и линиях детского питания. Поставляется целой, без косточки, в размерах A / AA / AAA; каждая партия сертифицирована как органическая и прослеживается до сада.",
      "uz": "Togʻ va togʻoldi bogʻlaridan olingan quyoshda quritilgan organik oʻrik qoqi oltingugurt dioksidisiz tayyorlanadi — meva tabiiy toʻq qahrabo rangini va toʻyingan shirinligini saqlaydi. Yetishtirish hududlaridagi kunduzgi va tungi harorat farqi mevaga zich, etli magʻiz beradi: u nonvoychilik toʻldirmalari, snek aralashmalari va bolalar ovqati liniyalarida shaklini yoʻqotmaydi. Butun va danaksiz holda A / AA / AAA oʻlchamlarida yetkaziladi; har bir partiya organik sertifikatga ega va bogʻgacha kuzatiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Natural sun-dried, unsulphured, whole and pitted; sizes A / AA / AAA (60-100 and 100-140 pcs per kg)",
          "ru": "натуральная солнечная сушка, без сульфитов, целая без косточки; размеры A / AA / AAA (60-100 и 100-140 шт. на кг)",
          "uz": "Tabiiy quyoshda quritilgan, sulfitsiz, butun va danaksiz; oʻlchamlari A / AA / AAA (1 kg da 60-100 va 100-140 dona)"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Foreign matter 0.5% max. / Moisture 18-20% / Origin: Uzbekistan",
          "ru": "Посторонние примеси 0,5% макс. / Влажность 18-20% / Происхождение: Узбекистан",
          "uz": "Begona aralashmalar 0,5% dan koʻp emas / Namligi 18-20% / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 kg / 12.5 kg carton boxes with food-grade PE liner, 20 kg cartons, retail packing on request",
          "ru": "картонные короба 10 кг / 12,5 кг с пищевым ПЭ-вкладышем, короба 20 кг, потребительская фасовка по запросу",
          "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg / 12,5 kg karton qutilar, 20 kg qutilar, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +2…+8 °C, RH 65% max. (unsulphured fruit requires cool storage)",
          "ru": "12 месяцев при +2…+8 °C, влажность не выше 65% (несульфитированный продукт требует холодного хранения)",
          "uz": "+2…+8 °C da, nisbiy namlik 65% dan oshmaganda 12 oy (sulfitsiz mahsulot salqin saqlashni talab qiladi)"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 5 MT trial lot, 18-20 MT per FCL; FCA Tashkent, DAP EU (Incoterms 2020), samples by air",
          "ru": "от 5 т пробной партии, 18-20 т в контейнере; FCA Ташкент, DAP ЕС (Инкотермс 2020), образцы авиапочтой",
          "uz": "5 tonnalik sinov partiyasidan, konteynerda 18-20 tonna; FCA Toshkent, DAP YeI (Inkoterms 2020), namunalar aviapochta orqali"
        }
      }
    ],
    "image": "/images/products/organic-dried-apricot.jpg",
    "featured": true,
    "regions": {
      "en": "Fergana Valley (Namangan and Fergana regions), Urgut district of Samarkand region, Boysun in Surkhandarya — mountain and foothill organic orchards",
      "ru": "Ферганская долина (Наманганская и Ферганская области), Ургутский район Самаркандской области, Байсун в Сурхандарьинской области — горные и предгорные органические сады",
      "uz": "Fargʻona vodiysi (Namangan va Fargʻona viloyatlari), Samarqand viloyatining Urgut tumani, Surxondaryodagi Boysun — togʻ va togʻoldi organik bogʻlari"
    },
    "packaging": {
      "en": "10 kg / 12.5 kg carton boxes with food-grade PE liner, 20 kg cartons, vacuum or retail packing on request",
      "ru": "картонные короба 10 кг / 12,5 кг с пищевым ПЭ-вкладышем, короба 20 кг, вакуум или потребительская фасовка по запросу",
      "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg / 12,5 kg karton qutilar, 20 kg qutilar, soʻrov boʻyicha vakuum yoki chakana qadoqlash"
    },
    "hsCode": "0813.10"
  },
  {
    "slug": "organic-walnuts",
    "category": "organic",
    "name": {
      "en": "Organic Walnuts",
      "ru": "Органический грецкий орех",
      "uz": "Organik yongʻoq"
    },
    "latinName": "Juglans regia",
    "description": {
      "en": "Organic walnut kernels hand-sorted into light halves and quarters, cracked from nuts grown in mountain valleys where walnut has been cultivated for centuries. Cool nights and low humidity at harvest keep the oil fresh and the kernel colour light, with peroxide values well inside industrial specifications. In-shell nuts of 30-34 mm are available on request; all lots carry organic certification traceable to the orchard.",
      "ru": "Органическое ядро грецкого ореха, отсортированное вручную на светлые половинки и четвертинки; орех выращен в горных долинах, где культура возделывается веками. Прохладные ночи и низкая влажность в период уборки сохраняют свежесть масла и светлый цвет ядра, перекисное число уверенно укладывается в промышленные требования. По запросу поставляем орех в скорлупе калибра 30-34 мм; все партии имеют органический сертификат с прослеживаемостью до сада.",
      "uz": "Organik yongʻoq magʻzi qoʻlda saralanadi — och rangli yarim va chorak magʻizlar; yongʻoq asrlar davomida yetishtirilib kelinayotgan togʻ vodiylaridan olinadi. Hosil davridagi salqin tunlar va past namlik moyning yangiligini va magʻizning och rangini saqlaydi, peroksid koʻrsatkichi sanoat talablari doirasida boʻladi. Soʻrov boʻyicha 30-34 mm kalibrli poʻstli yongʻoq ham yetkaziladi; barcha partiyalar bogʻgacha kuzatiladigan organik sertifikatga ega."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Kernels: light halves (LH) and light quarters (LQ), hand-sorted; in-shell 30-34 mm on request",
          "ru": "ядро: светлые половинки (LH) и четвертинки (LQ), ручная сортировка; в скорлупе 30-34 мм по запросу",
          "uz": "Magʻiz: och rangli yarim (LH) va chorak (LQ) magʻizlar, qoʻlda saralangan; soʻrov boʻyicha poʻstli 30-34 mm"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Kernel purity 99.5% min. (shell fragments 0.5% max.) / Moisture 5% max. / Origin: Uzbekistan",
          "ru": "Чистота ядра 99,5% мин. (частицы скорлупы 0,5% макс.) / Влажность 5% макс. / Происхождение: Узбекистан",
          "uz": "Magʻiz tozaligi 99,5% dan kam emas (poʻst boʻlakchalari 0,5% dan koʻp emas) / Namligi 5% dan koʻp emas / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 kg carton boxes with food-grade PE liner, vacuum packing on request; 25 kg PP bags for in-shell",
          "ru": "картонные короба 10 кг с пищевым ПЭ-вкладышем, вакуумная упаковка по запросу; для ореха в скорлупе — мешки ПП 25 кг",
          "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg karton qutilar, soʻrov boʻyicha vakuum qadoqlash; poʻstli yongʻoq uchun 25 kg PP qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months for kernels at 0…+4 °C, RH 60% max.; 12 months for in-shell in dry ventilated storage",
          "ru": "12 месяцев для ядра при 0…+4 °C и влажности не выше 60%; 12 месяцев для ореха в скорлупе в сухом вентилируемом складе",
          "uz": "Magʻiz uchun 0…+4 °C da, namlik 60% dan oshmaganda 12 oy; poʻstli yongʻoq uchun quruq, shamollatiladigan omborda 12 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 3 MT trial lot, 16-18 MT per FCL; FCA Tashkent, DAP EU (Incoterms 2020), samples by air",
          "ru": "от 3 т пробной партии, 16-18 т в контейнере; FCA Ташкент, DAP ЕС (Инкотермс 2020), образцы авиапочтой",
          "uz": "3 tonnalik sinov partiyasidan, konteynerda 16-18 tonna; FCA Toshkent, DAP YeI (Inkoterms 2020), namunalar aviapochta orqali"
        }
      }
    ],
    "image": "/images/products/organic-walnuts.jpg",
    "regions": {
      "en": "Bostanlyk district of Tashkent region, Fergana Valley foothills, Boysun in Surkhandarya, mountain areas of Jizzakh — certified organic orchards and managed groves",
      "ru": "Бостанлыкский район Ташкентской области, предгорья Ферганской долины, Байсун в Сурхандарье, горные районы Джизакской области — сертифицированные органические сады и ореховые рощи",
      "uz": "Toshkent viloyatining Boʻstonliq tumani, Fargʻona vodiysi togʻoldi hududlari, Surxondaryodagi Boysun, Jizzaxning togʻli tumanlari — sertifikatlangan organik bogʻlar va yongʻoqzorlar"
    },
    "packaging": {
      "en": "10 kg carton boxes with food-grade PE liner, vacuum blocks on request; in-shell in 25 kg PP or mesh bags",
      "ru": "картонные короба 10 кг с пищевым ПЭ-вкладышем, вакуумные блоки по запросу; орех в скорлупе — мешки ПП или сетка 25 кг",
      "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg karton qutilar, soʻrov boʻyicha vakuum bloklar; poʻstli yongʻoq 25 kg PP yoki toʻr qoplarda"
    },
    "hsCode": "0802.32"
  },
  {
    "slug": "organic-peanuts",
    "category": "organic",
    "name": {
      "en": "Organic Peanuts",
      "ru": "Органический арахис",
      "uz": "Organik yeryongʻoq"
    },
    "latinName": "Arachis hypogaea",
    "description": {
      "en": "Raw organic peanut kernels of 50/60 and 60/70 counts, grown on irrigated organic plots and dried down to 8% moisture immediately after lifting to control aflatoxin risk. The kernels are uniform in size with tight red skins, suitable for roasting, peanut butter and confectionery coatings. Aflatoxin is tested per lot against EU limits, and in-shell peanuts can be supplied on request.",
      "ru": "Сырое органическое ядро арахиса калибров 50/60 и 60/70, выращенное на орошаемых органических участках и высушенное до 8% влажности сразу после подкопки — это ключевой контроль риска афлатоксинов. Ядро выровнено по размеру, с плотной красной оболочкой: подходит для обжарки, арахисовой пасты и кондитерских глазурей. Афлатоксин контролируется по каждой партии по нормам ЕС; по запросу поставляется арахис в скорлупе.",
      "uz": "Sugʻoriladigan organik maydonlarda yetishtirilgan xom organik yeryongʻoq magʻzi, kalibri 50/60 va 60/70; kovlab olingandan soʻng darhol 8% namlikkacha quritiladi — bu aflatoksin xavfini nazorat qilishning asosiy usuli. Magʻizlar oʻlchami bir tekis, poʻsti qizil va zich: qovurish, yeryongʻoq pastasi va qandolat qoplamalari uchun mos. Aflatoksin har bir partiyada YeI meʼyorlari boʻyicha tekshiriladi; soʻrov boʻyicha poʻstli yeryongʻoq ham yetkaziladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Raw shelled kernels, 50/60 and 60/70 counts per ounce; in-shell on request",
          "ru": "сырое ядро, калибр 50/60 и 60/70 шт. на унцию; в скорлупе по запросу",
          "uz": "Xom magʻiz, kalibri untsiyada 50/60 va 60/70 dona; soʻrov boʻyicha poʻstli"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Purity 99% min. / Moisture 8% max. / Aflatoxin within EU limits / Origin: Uzbekistan",
          "ru": "Чистота 99% мин. / Влажность 8% макс. / Афлатоксин в пределах норм ЕС / Происхождение: Узбекистан",
          "uz": "Tozaligi 99% dan kam emas / Namligi 8% dan koʻp emas / Aflatoksin YeI meʼyorlari doirasida / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "25 kg / 50 kg PP or jute bags, big bags 1000 kg, vacuum packing on request",
          "ru": "мешки ПП или джут 25 кг / 50 кг, биг-бэги 1000 кг, вакуумная упаковка по запросу",
          "uz": "25 kg / 50 kg PP yoki jut qoplar, 1000 kg big-bag, soʻrov boʻyicha vakuum qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months in dry, ventilated storage at up to +20 °C, RH 65% max.",
          "ru": "12 месяцев в сухом вентилируемом складе при температуре до +20 °C и влажности не выше 65%",
          "uz": "Quruq, shamollatiladigan omborda +20 °C gacha va nisbiy namlik 65% dan oshmaganda 12 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 5 MT trial lot, 20-22 MT per FCL; FCA Tashkent, DAP EU (Incoterms 2020), samples by air",
          "ru": "от 5 т пробной партии, 20-22 т в контейнере; FCA Ташкент, DAP ЕС (Инкотермс 2020), образцы авиапочтой",
          "uz": "5 tonnalik sinov partiyasidan, konteynerda 20-22 tonna; FCA Toshkent, DAP YeI (Inkoterms 2020), namunalar aviapochta orqali"
        }
      }
    ],
    "image": "/images/products/organic-peanuts.jpg",
    "regions": {
      "en": "Fergana Valley (Andijan and Namangan regions), Tashkent region, Surkhandarya — certified organic irrigated plots",
      "ru": "Ферганская долина (Андижанская и Наманганская области), Ташкентская область, Сурхандарья — сертифицированные органические орошаемые участки",
      "uz": "Fargʻona vodiysi (Andijon va Namangan viloyatlari), Toshkent viloyati, Surxondaryo — sertifikatlangan organik sugʻoriladigan maydonlar"
    },
    "packaging": {
      "en": "25 kg / 50 kg PP or jute bags, big bags 1000 kg, vacuum or retail packing on request; 20-22 MT per 40' FCL",
      "ru": "мешки ПП или джут 25 кг / 50 кг, биг-бэги 1000 кг, вакуум или потребительская фасовка по запросу; 20-22 т в 40' контейнере",
      "uz": "25 kg / 50 kg PP yoki jut qoplar, 1000 kg big-bag, soʻrov boʻyicha vakuum yoki chakana qadoqlash; 40' konteynerda 20-22 tonna"
    },
    "hsCode": "1202.42"
  },
  {
    "slug": "organic-prunes",
    "category": "organic",
    "name": {
      "en": "Organic Prunes",
      "ru": "Органический чернослив",
      "uz": "Organik quritilgan olxoʻri"
    },
    "latinName": "Prunus domestica",
    "description": {
      "en": "Pitted organic prunes of the Hungarian and Spanish plum types, dried without preservatives, sorbates or glycerine coating. Careful drying keeps the flesh soft and elastic with a clean, deep flavour, so the fruit performs well in bakery fillings, purees and snack packing. Sizes 60-80 and 80-100 pieces per kilo are available, each lot certified organic and traceable to the orchard.",
      "ru": "Органический чернослив без косточки из слив «Венгерка» и «Испанка», высушенный без консервантов, сорбатов и глицериновой обработки. Аккуратная сушка сохраняет мягкую эластичную мякоть и чистый глубокий вкус — фрукт хорошо ведёт себя в начинках, пюре и снековой фасовке. Доступны размеры 60-80 и 80-100 шт. на килограмм; каждая партия сертифицирована как органическая и прослеживается до сада.",
      "uz": "«Vengerka» va «Ispanka» navli olxoʻrilardan tayyorlangan danaksiz organik olxoʻri qoqisi konservantlar, sorbatlar va glitserin qoplamasisiz quritiladi. Ehtiyotkorona quritish magʻizni yumshoq va elastik, taʼmini esa toza va toʻyingan saqlaydi — u nonvoychilik toʻldirmalari, pyure va snek qadoqlashda yaxshi natija beradi. 1 kg da 60-80 va 80-100 dona oʻlchamlari mavjud; har bir partiya organik sertifikatga ega va bogʻgacha kuzatiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Pitted, Hungarian and Spanish types, 60-80 / 80-100 pcs per kg; without preservatives or glycerine",
          "ru": "без косточки, «Венгерка» и «Испанка», 60-80 / 80-100 шт. на кг; без консервантов и глицерина",
          "uz": "Danaksiz, «Vengerka» va «Ispanka» navlari, 1 kg da 60-80 / 80-100 dona; konservantlar va glitserinsiz"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Foreign matter 0.5% max., pit fragments 1% max. / Moisture 21-23% / Origin: Uzbekistan",
          "ru": "Посторонние примеси 0,5% макс., фрагменты косточек 1% макс. / Влажность 21-23% / Происхождение: Узбекистан",
          "uz": "Begona aralashmalar 0,5% dan koʻp emas, danak boʻlakchalari 1% dan koʻp emas / Namligi 21-23% / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 kg / 12.5 kg carton boxes with food-grade PE liner, 20 kg cartons, retail packing on request",
          "ru": "картонные короба 10 кг / 12,5 кг с пищевым ПЭ-вкладышем, короба 20 кг, потребительская фасовка по запросу",
          "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg / 12,5 kg karton qutilar, 20 kg qutilar, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +2…+8 °C, RH 65% max. (preservative-free fruit requires cool storage)",
          "ru": "12 месяцев при +2…+8 °C, влажность не выше 65% (продукт без консервантов требует холодного хранения)",
          "uz": "+2…+8 °C da, nisbiy namlik 65% dan oshmaganda 12 oy (konservantsiz mahsulot salqin saqlashni talab qiladi)"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 5 MT trial lot, 18-20 MT per FCL; FCA Tashkent, DAP EU (Incoterms 2020), samples by air",
          "ru": "от 5 т пробной партии, 18-20 т в контейнере; FCA Ташкент, DAP ЕС (Инкотермс 2020), образцы авиапочтой",
          "uz": "5 tonnalik sinov partiyasidan, konteynerda 18-20 tonna; FCA Toshkent, DAP YeI (Inkoterms 2020), namunalar aviapochta orqali"
        }
      }
    ],
    "image": "/images/products/organic-prunes.jpg",
    "regions": {
      "en": "Samarkand region, Tashkent region (Bostanlyk, Parkent), Fergana Valley — certified organic plum orchards",
      "ru": "Самаркандская область, Ташкентская область (Бостанлык, Паркент), Ферганская долина — сертифицированные органические сливовые сады",
      "uz": "Samarqand viloyati, Toshkent viloyati (Boʻstonliq, Parkent), Fargʻona vodiysi — sertifikatlangan organik olxoʻri bogʻlari"
    },
    "packaging": {
      "en": "10 kg / 12.5 kg carton boxes with food-grade PE liner, 20 kg cartons, vacuum or retail packing on request",
      "ru": "картонные короба 10 кг / 12,5 кг с пищевым ПЭ-вкладышем, короба 20 кг, вакуум или потребительская фасовка по запросу",
      "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg / 12,5 kg karton qutilar, 20 kg qutilar, soʻrov boʻyicha vakuum yoki chakana qadoqlash"
    },
    "hsCode": "0813.20"
  },
  {
    "slug": "organic-apricot-kernels",
    "category": "organic",
    "name": {
      "en": "Organic Apricot Kernels",
      "ru": "Органические ядра абрикосовых косточек",
      "uz": "Organik oʻrik magʻzi"
    },
    "latinName": "Prunus armeniaca",
    "description": {
      "en": "Sweet organic apricot kernels recovered from the stones of the same certified orchards that supply our dried apricots, cracked and sorted to remove bitter and broken kernels. With an oil content around 45-50%, they are used for cold-pressed apricot kernel oil, confectionery marzipan substitutes and snack roasting. Sweet (non-bitter) selection is confirmed by taste and laboratory control on every lot.",
      "ru": "Сладкие органические ядра абрикосовых косточек из тех же сертифицированных садов, что поставляют нашу курагу; косточки колются, ядра сортируются с удалением горьких и битых. Масличность около 45-50% позволяет использовать их для холодного отжима абрикосового масла, кондитерских аналогов марципана и обжарки в снеках. Отбор сладких (негорьких) ядер подтверждается органолептикой и лабораторным контролем по каждой партии.",
      "uz": "Shirin organik oʻrik magʻzi bizning oʻrik qoqimizni yetkazib beradigan sertifikatlangan bogʻlarning danaklaridan olinadi; danaklar chaqiladi, magʻizlar achchiq va singan donalardan tozalanadi. Moyliligi 45-50% atrofida boʻlgani uchun undan sovuq presslangan oʻrik magʻzi moyi, qandolatda marsipan oʻrnini bosuvchi massalar va qovurilgan sneklar tayyorlanadi. Shirin (achchiq boʻlmagan) magʻiz tanlovi har bir partiyada organoleptik va laboratoriya nazorati bilan tasdiqlanadi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Sweet (non-bitter) whole kernels, calibre 11-13 mm, oil content 45-50%; blanched kernels on request",
          "ru": "сладкие (негорькие) целые ядра, калибр 11-13 мм, масличность 45-50%; бланшированные ядра по запросу",
          "uz": "Shirin (achchiq boʻlmagan) butun magʻizlar, kalibri 11-13 mm, moyliligi 45-50%; soʻrov boʻyicha blanshirlangan magʻiz"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Purity 99% min. (shell fragments 0.5% max., broken 2% max.) / Moisture 6% max. / Origin: Uzbekistan",
          "ru": "Чистота 99% мин. (частицы скорлупы 0,5% макс., бой 2% макс.) / Влажность 6% макс. / Происхождение: Узбекистан",
          "uz": "Tozaligi 99% dan kam emas (poʻst boʻlakchalari 0,5%, singan magʻiz 2% dan koʻp emas) / Namligi 6% dan koʻp emas / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 kg / 12.5 kg carton boxes with food-grade PE liner, 25 kg PP bags on request",
          "ru": "картонные короба 10 кг / 12,5 кг с пищевым ПЭ-вкладышем, мешки ПП 25 кг по запросу",
          "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg / 12,5 kg karton qutilar, soʻrov boʻyicha 25 kg PP qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "12 months at +5…+15 °C, RH 65% max., away from direct sunlight",
          "ru": "12 месяцев при +5…+15 °C, влажность не выше 65%, без прямого солнечного света",
          "uz": "+5…+15 °C da, nisbiy namlik 65% dan oshmaganda, toʻgʻridan-toʻgʻri quyosh nuridan uzoqda 12 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 3 MT trial lot, 16-18 MT per FCL; FCA Tashkent, DAP EU (Incoterms 2020), samples by air",
          "ru": "от 3 т пробной партии, 16-18 т в контейнере; FCA Ташкент, DAP ЕС (Инкотермс 2020), образцы авиапочтой",
          "uz": "3 tonnalik sinov partiyasidan, konteynerda 16-18 tonna; FCA Toshkent, DAP YeI (Inkoterms 2020), namunalar aviapochta orqali"
        }
      }
    ],
    "image": "/images/products/organic-apricot-kernels.jpg",
    "regions": {
      "en": "Fergana Valley (Namangan and Fergana regions), Urgut district of Samarkand region, Boysun in Surkhandarya — the same certified organic apricot orchards",
      "ru": "Ферганская долина (Наманганская и Ферганская области), Ургутский район Самаркандской области, Байсун в Сурхандарье — те же сертифицированные органические абрикосовые сады",
      "uz": "Fargʻona vodiysi (Namangan va Fargʻona viloyatlari), Samarqand viloyatining Urgut tumani, Surxondaryodagi Boysun — oʻsha sertifikatlangan organik oʻrik bogʻlari"
    },
    "packaging": {
      "en": "10 kg / 12.5 kg carton boxes with food-grade PE liner, 25 kg PP bags or vacuum packing on request",
      "ru": "картонные короба 10 кг / 12,5 кг с пищевым ПЭ-вкладышем, мешки ПП 25 кг или вакуумная упаковка по запросу",
      "uz": "Oziq-ovqatga yaroqli PE ichlik bilan 10 kg / 12,5 kg karton qutilar, soʻrov boʻyicha 25 kg PP qoplar yoki vakuum qadoqlash"
    },
    "hsCode": "1212.99"
  },
  {
    "slug": "organic-rosehip",
    "category": "organic",
    "name": {
      "en": "Organic Rosehip",
      "ru": "Органический шиповник",
      "uz": "Organik namatak"
    },
    "latinName": "Rosa canina",
    "description": {
      "en": "Dried organic rosehip collected from certified wild-harvest areas in the mountains and foothills of Uzbekistan, then air-dried at low temperature to preserve natural vitamin C. The fruit is cleaned of stalks and leaves and supplied whole, cut and sifted, or milled for tea blends, herbal infusions and food-supplement extraction. Wild-collection areas are mapped and audited, so every lot stays traceable to its harvest zone.",
      "ru": "Сушёный органический шиповник с сертифицированных участков дикого сбора в горах и предгорьях Узбекистана; сушка воздушная, при низкой температуре — это сохраняет природный витамин C. Плоды очищаются от плодоножек и листьев и поставляются целыми, резаными (cut & sifted) или в помоле — для чайных смесей, травяных настоев и производства экстрактов для БАД. Участки дикого сбора картированы и проходят аудит, поэтому каждая партия прослеживается до зоны заготовки.",
      "uz": "Oʻzbekiston togʻlari va togʻoldi hududlaridagi sertifikatlangan yovvoyi yigʻim maydonlaridan terilgan quritilgan organik namatak past haroratda havoda quritiladi — bu tabiiy C vitaminini saqlaydi. Mevalar band va barglardan tozalanadi hamda butun, maydalangan (cut & sifted) yoki un holida yetkaziladi: choy aralashmalari, oʻsimlik damlamalari va BFQ uchun ekstrakt ishlab chiqarishga mos. Yovvoyi yigʻim maydonlari xaritaga olingan va auditdan oʻtadi, shu bois har bir partiya yigʻim hududigacha kuzatiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Whole dried fruits (wild harvest); cut and sifted 2-5 mm or milled on request",
          "ru": "целые сушёные плоды (дикий сбор); резка 2-5 мм (cut & sifted) или помол по запросу",
          "uz": "Butun quritilgan mevalar (yovvoyi yigʻim); soʻrov boʻyicha 2-5 mm maydalangan (cut & sifted) yoki un holida"
        }
      },
      {
        "label": {
          "en": "Purity & moisture",
          "ru": "Чистота и влажность",
          "uz": "Tozalik va namlik"
        },
        "value": {
          "en": "Purity 99% min. (stalks and leaves 1% max.) / Moisture 10% max. / Origin: Uzbekistan",
          "ru": "Чистота 99% мин. (плодоножки и листья 1% макс.) / Влажность 10% макс. / Происхождение: Узбекистан",
          "uz": "Tozaligi 99% dan kam emas (band va barglar 1% dan koʻp emas) / Namligi 10% dan koʻp emas / Kelib chiqishi: Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Certification",
          "ru": "Сертификация",
          "uz": "Sertifikatlash"
        },
        "value": {
          "en": "Organic (EU) — organic status traceable to the field",
          "ru": "Organic (EU) — органический статус прослеживается до поля",
          "uz": "Organic (EU) — organik maqomi dalagacha kuzatiladi"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 kg / 20 kg carton boxes with PE liner, 25 kg PP bags, retail packing on request",
          "ru": "картонные короба 10 кг / 20 кг с ПЭ-вкладышем, мешки ПП 25 кг, потребительская фасовка по запросу",
          "uz": "PE ichlik bilan 10 kg / 20 kg karton qutilar, 25 kg PP qoplar, soʻrov boʻyicha chakana qadoqlash"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months in dry, dark, ventilated storage at up to +20 °C, RH 65% max.",
          "ru": "24 месяца в сухом тёмном вентилируемом складе при температуре до +20 °C и влажности не выше 65%",
          "uz": "Quruq, qorongʻi va shamollatiladigan omborda +20 °C gacha, namlik 65% dan oshmaganda 24 oy"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 3 MT trial lot, 10-12 MT per FCL (low density); FCA Tashkent, DAP EU (Incoterms 2020)",
          "ru": "от 3 т пробной партии, 10-12 т в контейнере (низкая насыпная плотность); FCA Ташкент, DAP ЕС (Инкотермс 2020)",
          "uz": "3 tonnalik sinov partiyasidan, konteynerda 10-12 tonna (zichligi past); FCA Toshkent, DAP YeI (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/organic-rosehip.jpg",
    "regions": {
      "en": "Certified wild-collection areas in Bostanlyk (Tashkent region), Zaamin in Jizzakh, Boysun in Surkhandarya and the mountains around the Fergana Valley",
      "ru": "Сертифицированные участки дикого сбора в Бостанлыке (Ташкентская область), Зааминe (Джизакская область), Байсуне (Сурхандарья) и горах вокруг Ферганской долины",
      "uz": "Boʻstonliq (Toshkent viloyati), Zomin (Jizzax), Boysun (Surxondaryo) va Fargʻona vodiysi atrofidagi togʻlardagi sertifikatlangan yovvoyi yigʻim maydonlari"
    },
    "packaging": {
      "en": "10 kg / 20 kg carton boxes with PE liner, 25 kg PP bags, big bags for cut and sifted material, retail packing on request",
      "ru": "картонные короба 10 кг / 20 кг с ПЭ-вкладышем, мешки ПП 25 кг, биг-бэги для резаного сырья, потребительская фасовка по запросу",
      "uz": "PE ichlik bilan 10 kg / 20 kg karton qutilar, 25 kg PP qoplar, maydalangan xomashyo uchun big-bag, soʻrov boʻyicha chakana qadoqlash"
    },
    "hsCode": "1211.90"
  },
  {
    "slug": "dried-bell-pepper",
    "category": "dried-vegetables",
    "name": {
      "en": "Dried Bell Pepper",
      "ru": "Сушёный сладкий перец",
      "uz": "Quritilgan bulgʻor qalampiri"
    },
    "latinName": "Capsicum annuum L. var. grossum",
    "description": {
      "en": "Air-dried sweet bell pepper supplied as red and green slices in 6x6 and 10x10 mm calibres, processed within hours of harvest to hold colour and aroma. Uzbekistan's long sunny season builds a high dry-matter and pigment content in the raw fruit, so the slices rehydrate to a bright, firm piece rather than a pale one. Standard input for soup and sauce concentrates, seasoning and marinade blends, instant noodles, snack coatings and meat processing.",
      "ru": "Сушёный сладкий перец поставляется красными и зелёными ломтиками калибра 6x6 и 10x10 мм; сырьё перерабатывается в течение нескольких часов после уборки, что сохраняет цвет и аромат. Длинный солнечный сезон Узбекистана даёт высокое содержание сухих веществ и красящих пигментов, поэтому после регидратации ломтик остаётся ярким и плотным, а не бледным. Стандартное сырьё для концентратов супов и соусов, приправочных и маринадных смесей, лапши быстрого приготовления, посыпок для снеков и мясопереработки.",
      "uz": "Quritilgan bulgʻor qalampiri qizil va yashil tilimlar shaklida, 6x6 va 10x10 mm kalibrda yetkaziladi; xomashyo hosil yigʻilgandan keyin bir necha soat ichida qayta ishlanadi va shu bois rangi hamda hidi saqlanadi. Oʻzbekistonning uzoq quyoshli mavsumi mevada quruq modda va boʻyovchi pigmentlar miqdorini oshiradi, shuning uchun tilim namlangach oqarib ketmaydi — yorqin va zich boʻlib qoladi. Shoʻrva va sous konsentratlari, ziravor va marinad aralashmalari, tez tayyorlanadigan makaron, gazak sepmalari va goʻsht mahsulotlari ishlab chiqarish uchun standart xomashyo."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Sliced / Red - Caliber: 6x6; 10x10 / Green - Caliber: 10x10 (mm); flakes and powder on request",
          "ru": "Ломтики / красный — калибр: 6x6; 10x10 / зелёный — калибр: 10x10 (мм); хлопья и порошок по запросу",
          "uz": "Tilim / qizil — kalibr: 6x6; 10x10 / yashil — kalibr: 10x10 (mm); talab boʻyicha parcha (xlopya) va kukun"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "7% max.",
          "ru": "не более 7%",
          "uz": "7% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 20 kg carton boxes with food-grade PE liner, 20 kg PP or kraft bags with PE liner",
          "ru": "коробки 10 / 20 кг с пищевым ПЭ-вкладышем, мешки ПП или крафт 20 кг с ПЭ-вкладышем",
          "uz": "oziq-ovqatbop PE ichlikli 10 / 20 kg karton qutilar, PE ichlikli 20 kg PP yoki kraft qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months at +5…+25 °C, RH 65% max., dry dark ventilated warehouse",
          "ru": "24 месяцев при +5…+25 °C, отн. влажность не более 65%, сухой затемнённый проветриваемый склад",
          "uz": "+5…+25 °C da 24 oy, nisbiy namlik 65% dan koʻp emas, quruq, qorongʻi, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 1 000 kg per item; 1 x 20' FCL — approx. 5–6 MT (mixed containers accepted). FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "От 1 000 кг по позиции; 1 x 20' FCL — ок. 5–6 т (допускается сборный контейнер). FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "Har bir pozitsiya boʻyicha 1 000 kg dan; 1 x 20' FCL — taxminan 5–6 t (aralash konteyner qabul qilinadi). FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-bell-pepper.jpg",
    "featured": true,
    "regions": {
      "en": "Surkhandarya and Kashkadarya regions, Samarkand region and the Fergana Valley — the warm southern and eastern districts where sweet pepper is grown for processing.",
      "ru": "Сурхандарьинская и Кашкадарьинская области, Самаркандская область и Ферганская долина — тёплые южные и восточные районы, где сладкий перец выращивают на переработку.",
      "uz": "Surxondaryo va Qashqadaryo viloyatlari, Samarqand viloyati hamda Fargʻona vodiysi — bulgʻor qalampiri qayta ishlash uchun yetishtiriladigan issiq janubiy va sharqiy hududlar."
    },
    "packaging": {
      "en": "10 kg and 20 kg carton boxes with food-grade PE liner, 20 kg PP or multi-wall kraft bags with PE liner. Retail packing and big bags 100–200 kg on request. Approx. 5–6 MT per 20' container.",
      "ru": "Коробки 10 и 20 кг с пищевым ПЭ-вкладышем, мешки ПП или многослойные крафт-мешки 20 кг с ПЭ-вкладышем. Розничная фасовка и биг-бэги 100–200 кг по запросу. Около 5–6 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 20 kg karton qutilar, PE ichlikli 20 kg PP yoki koʻp qatlamli kraft qoplar. Talab boʻyicha chakana qadoq va 100–200 kg big-beglar. 20 futlik konteynerda taxminan 5–6 t."
    },
    "hsCode": "0904.21"
  },
  {
    "slug": "dried-tomato",
    "category": "dried-vegetables",
    "name": {
      "en": "Dried Tomato",
      "ru": "Сушёный томат",
      "uz": "Quritilgan pomidor"
    },
    "latinName": "Solanum lycopersicum L.",
    "description": {
      "en": "Dried tomato slices made from ripe open-field fruit of Uzbekistan's irrigated valleys, where hot summers and a wide day-night temperature range push up dry matter, sugars and lycopene. The product delivers a deep red colour and concentrated taste at low dosage in ketchups and sauces, soup bases, dry seasoning mixes, bakery fillings and pizza toppings. Supplied sliced; flakes and powder are milled to order, with lot-by-lot moisture and colour control.",
      "ru": "Сушёный томат из спелых плодов открытого грунта орошаемых долин Узбекистана: жаркое лето и большой перепад дневных и ночных температур дают высокое содержание сухих веществ, сахаров и ликопина. Продукт обеспечивает насыщенный красный цвет и концентрированный вкус при небольшой дозировке в кетчупах и соусах, суповых основах, сухих приправочных смесях, начинках для выпечки и посыпках для пиццы. Поставляется ломтиками; хлопья и порошок мелются под заказ, с контролем влажности и цвета по каждой партии.",
      "uz": "Quritilgan pomidor Oʻzbekistonning sugʻoriladigan vodiylarida ochiq maydonda yetishtirilgan pishgan mevalardan tayyorlanadi: issiq yoz va kunduzgi hamda tungi haroratning katta farqi quruq modda, shakar va likopin miqdorini oshiradi. Mahsulot ketchup va souslar, shoʻrva asoslari, quruq ziravor aralashmalari, non-qandolat toʻldirmalari va pitsa sepmalarida oz miqdorda ham toʻq qizil rang va quyuq taʼm beradi. Tilim holida yetkaziladi; parcha (xlopya) va kukun buyurtma boʻyicha tortiladi, har bir partiyada namlik va rang nazorat qilinadi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Sliced (halves and slices); flakes and powder on request",
          "ru": "Ломтики (половинки и слайсы); хлопья и порошок по запросу",
          "uz": "Tilim (yarim va tilim); talab boʻyicha parcha (xlopya) va kukun"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "8% max.",
          "ru": "не более 8%",
          "uz": "8% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 20 kg carton boxes with food-grade PE liner, 20 kg PP or kraft bags with PE liner",
          "ru": "коробки 10 / 20 кг с пищевым ПЭ-вкладышем, мешки ПП или крафт 20 кг с ПЭ-вкладышем",
          "uz": "oziq-ovqatbop PE ichlikli 10 / 20 kg karton qutilar, PE ichlikli 20 kg PP yoki kraft qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months at +5…+25 °C, RH 65% max., dry dark ventilated warehouse",
          "ru": "24 месяцев при +5…+25 °C, отн. влажность не более 65%, сухой затемнённый проветриваемый склад",
          "uz": "+5…+25 °C da 24 oy, nisbiy namlik 65% dan koʻp emas, quruq, qorongʻi, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 1 000 kg per item; 1 x 20' FCL — approx. 6–7 MT (mixed containers accepted). FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "От 1 000 кг по позиции; 1 x 20' FCL — ок. 6–7 т (допускается сборный контейнер). FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "Har bir pozitsiya boʻyicha 1 000 kg dan; 1 x 20' FCL — taxminan 6–7 t (aralash konteyner qabul qilinadi). FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-tomato.jpg",
    "featured": true,
    "regions": {
      "en": "Syrdarya and Jizzakh regions, Tashkent region and Samarkand region — the irrigated field-tomato belt supplying the country's processing plants.",
      "ru": "Сырдарьинская и Джизакская области, Ташкентская и Самаркандская области — орошаемый пояс полевого томата, снабжающий перерабатывающие заводы страны.",
      "uz": "Sirdaryo va Jizzax viloyatlari, Toshkent hamda Samarqand viloyatlari — mamlakat qayta ishlash korxonalarini taʼminlaydigan sugʻoriladigan dala pomidori mintaqasi."
    },
    "packaging": {
      "en": "10 kg and 20 kg carton boxes with food-grade PE liner, 20 kg PP or multi-wall kraft bags with PE liner. Retail packing and big bags 100–200 kg on request. Approx. 6–7 MT per 20' container.",
      "ru": "Коробки 10 и 20 кг с пищевым ПЭ-вкладышем, мешки ПП или многослойные крафт-мешки 20 кг с ПЭ-вкладышем. Розничная фасовка и биг-бэги 100–200 кг по запросу. Около 6–7 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 20 kg karton qutilar, PE ichlikli 20 kg PP yoki koʻp qatlamli kraft qoplar. Talab boʻyicha chakana qadoq va 100–200 kg big-beglar. 20 futlik konteynerda taxminan 6–7 t."
    },
    "hsCode": "0712.90"
  },
  {
    "slug": "dried-carrot",
    "category": "dried-vegetables",
    "name": {
      "en": "Dried Carrot",
      "ru": "Сушёная морковь",
      "uz": "Quritilgan sabzi"
    },
    "latinName": "Daucus carota L. subsp. sativus",
    "description": {
      "en": "Dehydrated carrot diced to 3x3, 5x5 and 10x10 mm from orange table varieties of Uzbekistan's irrigated valleys, blanched before drying to fix carotene and keep the cut edges clean. Rehydration is fast and even, which makes the dice a reliable filler in soup and bouillon concentrates, instant meals, sauces, ready-mix pilaf sets and extruded snacks. Cut size, screening and metal detection are agreed per contract.",
      "ru": "Сушёная морковь кубиком 3x3, 5x5 и 10x10 мм из оранжевых столовых сортов орошаемых долин Узбекистана; перед сушкой сырьё бланшируется, что закрепляет каротин и сохраняет чистую линию реза. Регидратация быстрая и равномерная, поэтому кубик стабильно работает как наполнитель в супо-бульонных концентратах, блюдах быстрого приготовления, соусах, готовых наборах для плова и экструдированных снеках. Размер реза, просев и металлодетекция согласуются по контракту.",
      "uz": "Quritilgan sabzi Oʻzbekistonning sugʻoriladigan vodiylarida yetishtirilgan toʻq sariq oshxona navlaridan 3x3, 5x5 va 10x10 mm kubik shaklida tayyorlanadi; quritishdan oldin blanshirovka qilinishi karotinni mustahkamlaydi va kesim chetini toza saqlaydi. Namlanish tez va bir tekis kechadi, shu bois kubik shoʻrva-bulon konsentratlari, tez tayyor taomlar, souslar, palov uchun tayyor toʻplamlar va ekstruziya gazaklarida ishonchli toʻldiruvchi boʻlib xizmat qiladi. Kesim oʻlchami, elash va metall detektor shartnoma boʻyicha kelishiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Sliced (diced) / Caliber: 3x3; 5x5; 10x10 (mm); flakes and powder on request",
          "ru": "Ломтики (кубик) / калибр: 3x3; 5x5; 10x10 (мм); хлопья и порошок по запросу",
          "uz": "Tilim (kubik) / kalibr: 3x3; 5x5; 10x10 (mm); talab boʻyicha parcha (xlopya) va kukun"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "6% max.",
          "ru": "не более 6%",
          "uz": "6% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 20 kg carton boxes with food-grade PE liner, 20 kg PP or kraft bags with PE liner",
          "ru": "коробки 10 / 20 кг с пищевым ПЭ-вкладышем, мешки ПП или крафт 20 кг с ПЭ-вкладышем",
          "uz": "oziq-ovqatbop PE ichlikli 10 / 20 kg karton qutilar, PE ichlikli 20 kg PP yoki kraft qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months at +5…+25 °C, RH 65% max., dry dark ventilated warehouse",
          "ru": "24 месяцев при +5…+25 °C, отн. влажность не более 65%, сухой затемнённый проветриваемый склад",
          "uz": "+5…+25 °C da 24 oy, nisbiy namlik 65% dan koʻp emas, quruq, qorongʻi, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 1 000 kg per item; 1 x 20' FCL — approx. 7–8 MT (mixed containers accepted). FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "От 1 000 кг по позиции; 1 x 20' FCL — ок. 7–8 т (допускается сборный контейнер). FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "Har bir pozitsiya boʻyicha 1 000 kg dan; 1 x 20' FCL — taxminan 7–8 t (aralash konteyner qabul qilinadi). FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-carrot.jpg",
    "regions": {
      "en": "Tashkent and Samarkand regions, Khorezm region and Kashkadarya — the main irrigated carrot-growing districts.",
      "ru": "Ташкентская и Самаркандская области, Хорезмская область и Кашкадарья — основные районы орошаемого морковеводства.",
      "uz": "Toshkent va Samarqand viloyatlari, Xorazm viloyati hamda Qashqadaryo — sabzi yetishtiriladigan asosiy sugʻoriladigan hududlar."
    },
    "packaging": {
      "en": "10 kg and 20 kg carton boxes with food-grade PE liner, 20 kg PP or multi-wall kraft bags with PE liner. Retail packing and big bags 100–200 kg on request. Approx. 7–8 MT per 20' container.",
      "ru": "Коробки 10 и 20 кг с пищевым ПЭ-вкладышем, мешки ПП или многослойные крафт-мешки 20 кг с ПЭ-вкладышем. Розничная фасовка и биг-бэги 100–200 кг по запросу. Около 7–8 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 20 kg karton qutilar, PE ichlikli 20 kg PP yoki koʻp qatlamli kraft qoplar. Talab boʻyicha chakana qadoq va 100–200 kg big-beglar. 20 futlik konteynerda taxminan 7–8 t."
    },
    "hsCode": "0712.90"
  },
  {
    "slug": "dried-pepper",
    "category": "dried-vegetables",
    "name": {
      "en": "Dried Pepper",
      "ru": "Сушёный перец",
      "uz": "Quritilgan qalampir"
    },
    "latinName": "Capsicum annuum L.",
    "description": {
      "en": "Dried capsicum pepper offered whole, sliced in 3x3, 5x5 and 10x10 mm calibres or milled to powder, in sweet (paprika) and hot types. Grown in the hot southern regions of Uzbekistan, the pods reach full colour on the plant, so the ground product holds a strong red hue without added colourants. Used in spice and seasoning blends, sausage and meat production, sauces, instant products and snack coatings; ASTA colour value and pungency (SHU) are fixed in the contract specification.",
      "ru": "Сушёный стручковый перец предлагается целым, ломтиком калибра 3x3, 5x5 и 10x10 мм или молотым в порошок, в сладком (паприка) и остром вариантах. Перец выращивается в жарких южных регионах Узбекистана и добирает цвет на кусте, поэтому молотый продукт даёт насыщенный красный тон без добавления красителей. Применяется в приправочных и пряных смесях, колбасном и мясном производстве, соусах, продуктах быстрого приготовления и посыпках для снеков; цветность по ASTA и острота (SHU) фиксируются в спецификации контракта.",
      "uz": "Quritilgan qalampir butun holda, 3x3, 5x5 va 10x10 mm kalibrdagi tilim shaklida yoki kukun qilib tortilgan holda, shirin (paprika) va achchiq turlarida taklif etiladi. Qalampir Oʻzbekistonning issiq janubiy hududlarida yetishtiriladi va rangni tup ustida toʻliq oladi, shuning uchun tortilgan mahsulot boʻyoq qoʻshilmasdan ham toʻq qizil tusda boʻladi. Ziravor va aralashmalar, kolbasa va goʻsht ishlab chiqarish, souslar, tez tayyorlanadigan mahsulotlar hamda gazak sepmalarida qoʻllaniladi; ASTA boʻyicha ranglilik va achchiqlik (SHU) shartnoma spetsifikatsiyasida belgilanadi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Whole / Sliced / Powder / Caliber: 3x3; 5x5; 10x10 (mm)",
          "ru": "Целый / ломтики / порошок / калибр: 3x3; 5x5; 10x10 (мм)",
          "uz": "Butun / tilim / kukun / kalibr: 3x3; 5x5; 10x10 (mm)"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "10% max.",
          "ru": "не более 10%",
          "uz": "10% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 20 kg carton boxes with food-grade PE liner, 20 kg PP or kraft bags with PE liner",
          "ru": "коробки 10 / 20 кг с пищевым ПЭ-вкладышем, мешки ПП или крафт 20 кг с ПЭ-вкладышем",
          "uz": "oziq-ovqatbop PE ichlikli 10 / 20 kg karton qutilar, PE ichlikli 20 kg PP yoki kraft qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months at +5…+25 °C, RH 65% max., dry dark ventilated warehouse",
          "ru": "24 месяцев при +5…+25 °C, отн. влажность не более 65%, сухой затемнённый проветриваемый склад",
          "uz": "+5…+25 °C da 24 oy, nisbiy namlik 65% dan koʻp emas, quruq, qorongʻi, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 1 000 kg per item; 1 x 20' FCL — approx. 5–6 MT whole and sliced, 12–14 MT powder (mixed containers accepted). FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "От 1 000 кг по позиции; 1 x 20' FCL — ок. 5–6 т для целого и ломтика, 12–14 т для порошка (допускается сборный контейнер). FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "Har bir pozitsiya boʻyicha 1 000 kg dan; 1 x 20' FCL — taxminan butun va tilim uchun 5–6 t, kukun uchun 12–14 t (aralash konteyner qabul qilinadi). FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-pepper.jpg",
    "regions": {
      "en": "Surkhandarya and Kashkadarya regions, Namangan and Fergana — southern and eastern districts with the heat units capsicum needs to ripen fully.",
      "ru": "Сурхандарьинская и Кашкадарьинская области, Наманган и Фергана — южные и восточные районы с суммой активных температур, необходимой перцу для полного созревания.",
      "uz": "Surxondaryo va Qashqadaryo viloyatlari, Namangan va Fargʻona — qalampirning toʻliq pishishi uchun zarur issiqlik yigʻindisiga ega janubiy va sharqiy hududlar."
    },
    "packaging": {
      "en": "10 kg and 20 kg carton boxes with food-grade PE liner, 20 kg PP or multi-wall kraft bags with PE liner. Retail packing and big bags 100–200 kg on request. Approx. 5–6 MT whole and sliced, 12–14 MT powder per 20' container.",
      "ru": "Коробки 10 и 20 кг с пищевым ПЭ-вкладышем, мешки ПП или многослойные крафт-мешки 20 кг с ПЭ-вкладышем. Розничная фасовка и биг-бэги 100–200 кг по запросу. Около 5–6 т для целого и ломтика, 12–14 т для порошка в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 20 kg karton qutilar, PE ichlikli 20 kg PP yoki koʻp qatlamli kraft qoplar. Talab boʻyicha chakana qadoq va 100–200 kg big-beglar. 20 futlik konteynerda taxminan butun va tilim uchun 5–6 t, kukun uchun 12–14 t."
    },
    "hsCode": "0904.21"
  },
  {
    "slug": "dried-pumpkin",
    "category": "dried-vegetables",
    "name": {
      "en": "Dried Pumpkin",
      "ru": "Сушёная тыква",
      "uz": "Quritilgan qovoq"
    },
    "latinName": "Cucurbita maxima Duchesne",
    "description": {
      "en": "Dried pumpkin in 10x10 mm slices from thick-fleshed varieties of the Khorezm and lower Amu Darya area, traditionally grown for storage and drying. High natural sugar and carotene give a sweet taste and a warm orange colour, which works in porridge and cereal mixes, soup and puree concentrates, bakery fillings, baby-food raw material and pet-food formulations. Powder and finer dice are produced to order.",
      "ru": "Сушёная тыква ломтиком 10x10 мм из толстомясых сортов Хорезма и низовьев Амударьи, которые традиционно выращивают на хранение и сушку. Высокое содержание природных сахаров и каротина даёт сладкий вкус и тёплый оранжевый цвет — продукт хорошо работает в кашах и зерновых смесях, супо-пюреных концентратах, начинках для выпечки, как сырьё для детского питания и в кормовых рецептурах. Порошок и более мелкий кубик изготавливаются под заказ.",
      "uz": "Quritilgan qovoq Xorazm va Amudaryoning quyi oqimidagi qalin etli navlardan 10x10 mm tilim shaklida tayyorlanadi; bu navlar anʼanaviy ravishda saqlash va quritish uchun yetishtiriladi. Tabiiy shakar va karotinning yuqoriligi shirin taʼm hamda iliq toʻq sariq rang beradi — mahsulot boʻtqa va don aralashmalari, shoʻrva-pyure konsentratlari, non-qandolat toʻldirmalarida, bolalar ovqati xomashyosi va yem retseptlarida qoʻl keladi. Kukun va mayda kubik buyurtma boʻyicha tayyorlanadi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Sliced / Caliber: 10x10 (mm); flakes and powder on request",
          "ru": "Ломтики / калибр: 10x10 (мм); хлопья и порошок по запросу",
          "uz": "Tilim / kalibr: 10x10 (mm); talab boʻyicha parcha (xlopya) va kukun"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "8% max.",
          "ru": "не более 8%",
          "uz": "8% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 20 kg carton boxes with food-grade PE liner, 20 kg PP or kraft bags with PE liner",
          "ru": "коробки 10 / 20 кг с пищевым ПЭ-вкладышем, мешки ПП или крафт 20 кг с ПЭ-вкладышем",
          "uz": "oziq-ovqatbop PE ichlikli 10 / 20 kg karton qutilar, PE ichlikli 20 kg PP yoki kraft qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months at +5…+25 °C, RH 65% max., dry dark ventilated warehouse",
          "ru": "24 месяцев при +5…+25 °C, отн. влажность не более 65%, сухой затемнённый проветриваемый склад",
          "uz": "+5…+25 °C da 24 oy, nisbiy namlik 65% dan koʻp emas, quruq, qorongʻi, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 1 000 kg per item; 1 x 20' FCL — approx. 6–7 MT (mixed containers accepted). FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "От 1 000 кг по позиции; 1 x 20' FCL — ок. 6–7 т (допускается сборный контейнер). FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "Har bir pozitsiya boʻyicha 1 000 kg dan; 1 x 20' FCL — taxminan 6–7 t (aralash konteyner qabul qilinadi). FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-pumpkin.jpg",
    "regions": {
      "en": "Khorezm region and the Republic of Karakalpakstan, Bukhara and Jizzakh regions — the traditional pumpkin-growing areas of the Amu Darya lowlands and the steppe belt.",
      "ru": "Хорезмская область и Республика Каракалпакстан, Бухарская и Джизакская области — традиционные районы выращивания тыквы в низовьях Амударьи и степной зоне.",
      "uz": "Xorazm viloyati va Qoraqalpogʻiston Respublikasi, Buxoro hamda Jizzax viloyatlari — Amudaryo quyi oqimi va dasht mintaqasidagi anʼanaviy qovoqchilik hududlari."
    },
    "packaging": {
      "en": "10 kg and 20 kg carton boxes with food-grade PE liner, 20 kg PP or multi-wall kraft bags with PE liner. Retail packing and big bags 100–200 kg on request. Approx. 6–7 MT per 20' container.",
      "ru": "Коробки 10 и 20 кг с пищевым ПЭ-вкладышем, мешки ПП или многослойные крафт-мешки 20 кг с ПЭ-вкладышем. Розничная фасовка и биг-бэги 100–200 кг по запросу. Около 6–7 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 20 kg karton qutilar, PE ichlikli 20 kg PP yoki koʻp qatlamli kraft qoplar. Talab boʻyicha chakana qadoq va 100–200 kg big-beglar. 20 futlik konteynerda taxminan 6–7 t."
    },
    "hsCode": "0712.90"
  },
  {
    "slug": "dried-cabbage",
    "category": "dried-vegetables",
    "name": {
      "en": "Dried Cabbage",
      "ru": "Сушёная капуста",
      "uz": "Quritilgan karam"
    },
    "latinName": "Brassica oleracea L. var. capitata",
    "description": {
      "en": "Dried white cabbage cut to 3x3, 5x5 and 10x10 mm from dense autumn heads grown in the cooler foothill districts of Uzbekistan. Blanching before drying keeps the leaf light in colour and free of the sulphurous note that poorly processed cabbage carries, and the cut rehydrates in minutes. Typical uses are dry soup and borscht concentrates, instant noodle sachets, vegetable mixes for catering and camping rations.",
      "ru": "Сушёная белокочанная капуста резкой 3x3, 5x5 и 10x10 мм из плотных осенних кочанов, выращенных в более прохладных предгорных районах Узбекистана. Бланширование перед сушкой сохраняет светлый цвет листа и убирает сернистый оттенок, характерный для плохо переработанной капусты, а резка восстанавливается за считанные минуты. Типовое применение — сухие концентраты супов и борщей, саше для лапши быстрого приготовления, овощные смеси для кейтеринга и полевых рационов.",
      "uz": "Quritilgan oq karam Oʻzbekistonning salqinroq togʻoldi hududlarida yetishtirilgan zich kuzgi boshlardan 3x3, 5x5 va 10x10 mm kesimda tayyorlanadi. Quritishdan oldingi blanshirovka barg rangini och saqlaydi va yomon qayta ishlangan karamga xos oltingugurt hidini yoʻqotadi, kesim esa bir necha daqiqada tiklanadi. Odatda quruq shoʻrva va borsh konsentratlari, tez tayyorlanadigan makaron paketchalari, keytering va dala ratsionlari uchun sabzavot aralashmalarida ishlatiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Sliced (cut) / Caliber: 3x3; 5x5; 10x10 (mm); flakes on request",
          "ru": "Ломтики (резка) / калибр: 3x3; 5x5; 10x10 (мм); хлопья по запросу",
          "uz": "Tilim (kesim) / kalibr: 3x3; 5x5; 10x10 (mm); talab boʻyicha parcha (xlopya)"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "6% max.",
          "ru": "не более 6%",
          "uz": "6% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 20 kg carton boxes with food-grade PE liner, 20 kg PP or kraft bags with PE liner",
          "ru": "коробки 10 / 20 кг с пищевым ПЭ-вкладышем, мешки ПП или крафт 20 кг с ПЭ-вкладышем",
          "uz": "oziq-ovqatbop PE ichlikli 10 / 20 kg karton qutilar, PE ichlikli 20 kg PP yoki kraft qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months at +5…+25 °C, RH 65% max., dry dark ventilated warehouse",
          "ru": "24 месяцев при +5…+25 °C, отн. влажность не более 65%, сухой затемнённый проветриваемый склад",
          "uz": "+5…+25 °C da 24 oy, nisbiy namlik 65% dan koʻp emas, quruq, qorongʻi, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 1 000 kg per item; 1 x 20' FCL — approx. 4–5 MT (mixed containers accepted). FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "От 1 000 кг по позиции; 1 x 20' FCL — ок. 4–5 т (допускается сборный контейнер). FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "Har bir pozitsiya boʻyicha 1 000 kg dan; 1 x 20' FCL — taxminan 4–5 t (aralash konteyner qabul qilinadi). FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-cabbage.jpg",
    "regions": {
      "en": "Tashkent region (Bostanlyk, Parkent), the Fergana Valley and the foothill districts of Samarkand region, where autumn cabbage is grown for storage and processing.",
      "ru": "Ташкентская область (Бостанлык, Паркент), Ферганская долина и предгорные районы Самаркандской области, где осеннюю капусту выращивают на хранение и переработку.",
      "uz": "Toshkent viloyati (Boʻstonliq, Parkent), Fargʻona vodiysi va Samarqand viloyatining togʻoldi tumanlari — kuzgi karam saqlash va qayta ishlash uchun yetishtiriladigan hududlar."
    },
    "packaging": {
      "en": "10 kg and 20 kg carton boxes with food-grade PE liner, 20 kg PP or multi-wall kraft bags with PE liner. Retail packing and big bags 100–200 kg on request. Approx. 4–5 MT per 20' container.",
      "ru": "Коробки 10 и 20 кг с пищевым ПЭ-вкладышем, мешки ПП или многослойные крафт-мешки 20 кг с ПЭ-вкладышем. Розничная фасовка и биг-бэги 100–200 кг по запросу. Около 4–5 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 20 kg karton qutilar, PE ichlikli 20 kg PP yoki koʻp qatlamli kraft qoplar. Talab boʻyicha chakana qadoq va 100–200 kg big-beglar. 20 futlik konteynerda taxminan 4–5 t."
    },
    "hsCode": "0712.90"
  },
  {
    "slug": "dried-beetroot",
    "category": "dried-vegetables",
    "name": {
      "en": "Dried Beetroot",
      "ru": "Сушёная свёкла",
      "uz": "Quritilgan lavlagi"
    },
    "latinName": "Beta vulgaris L. subsp. vulgaris",
    "description": {
      "en": "Dried table beetroot in 10x10 mm slices from dark-fleshed varieties with a high betanin content, dried at controlled temperature so the pigment is not degraded. It carries colour and an earthy-sweet taste into borscht and soup concentrates, dry sauce and seasoning mixes, bakery and snack products, and serves as raw material for natural colouring preparations. Powder and finer dice are milled on request.",
      "ru": "Сушёная столовая свёкла ломтиком 10x10 мм из тёмномякотных сортов с высоким содержанием бетанина; сушка ведётся при контролируемой температуре, чтобы не разрушить пигмент. Продукт даёт цвет и характерный землисто-сладкий вкус в концентратах борщей и супов, сухих соусных и приправочных смесях, хлебобулочных и снековых изделиях, а также служит сырьём для натуральных красящих препаратов. Порошок и более мелкий кубик мелются по запросу.",
      "uz": "Quritilgan oshxona lavlagisi betanin miqdori yuqori boʻlgan toʻq etli navlardan 10x10 mm tilim shaklida tayyorlanadi; pigment buzilmasligi uchun quritish nazorat qilinadigan haroratda olib boriladi. Mahsulot borsh va shoʻrva konsentratlari, quruq sous va ziravor aralashmalari, non hamda gazak mahsulotlariga rang va oʻziga xos shirin-tuproqsimon taʼm beradi, shuningdek tabiiy boʻyovchi preparatlar uchun xomashyo boʻlib xizmat qiladi. Kukun va mayda kubik talab boʻyicha tortiladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Sliced / Caliber: 10x10 (mm); flakes and powder on request",
          "ru": "Ломтики / калибр: 10x10 (мм); хлопья и порошок по запросу",
          "uz": "Tilim / kalibr: 10x10 (mm); talab boʻyicha parcha (xlopya) va kukun"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "8% max.",
          "ru": "не более 8%",
          "uz": "8% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 20 kg carton boxes with food-grade PE liner, 20 kg PP or kraft bags with PE liner",
          "ru": "коробки 10 / 20 кг с пищевым ПЭ-вкладышем, мешки ПП или крафт 20 кг с ПЭ-вкладышем",
          "uz": "oziq-ovqatbop PE ichlikli 10 / 20 kg karton qutilar, PE ichlikli 20 kg PP yoki kraft qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "24 months at +5…+25 °C, RH 65% max., dry dark ventilated warehouse",
          "ru": "24 месяцев при +5…+25 °C, отн. влажность не более 65%, сухой затемнённый проветриваемый склад",
          "uz": "+5…+25 °C da 24 oy, nisbiy namlik 65% dan koʻp emas, quruq, qorongʻi, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 1 000 kg per item; 1 x 20' FCL — approx. 7–8 MT (mixed containers accepted). FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "От 1 000 кг по позиции; 1 x 20' FCL — ок. 7–8 т (допускается сборный контейнер). FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "Har bir pozitsiya boʻyicha 1 000 kg dan; 1 x 20' FCL — taxminan 7–8 t (aralash konteyner qabul qilinadi). FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-beetroot.jpg",
    "regions": {
      "en": "Tashkent and Samarkand regions, the Fergana Valley and Jizzakh — irrigated districts where table beet is grown in the autumn rotation.",
      "ru": "Ташкентская и Самаркандская области, Ферганская долина и Джизак — орошаемые районы, где столовую свёклу выращивают в осеннем обороте.",
      "uz": "Toshkent va Samarqand viloyatlari, Fargʻona vodiysi hamda Jizzax — oshxona lavlagisi kuzgi aylanmada yetishtiriladigan sugʻoriladigan hududlar."
    },
    "packaging": {
      "en": "10 kg and 20 kg carton boxes with food-grade PE liner, 20 kg PP or multi-wall kraft bags with PE liner. Retail packing and big bags 100–200 kg on request. Approx. 7–8 MT per 20' container.",
      "ru": "Коробки 10 и 20 кг с пищевым ПЭ-вкладышем, мешки ПП или многослойные крафт-мешки 20 кг с ПЭ-вкладышем. Розничная фасовка и биг-бэги 100–200 кг по запросу. Около 7–8 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 20 kg karton qutilar, PE ichlikli 20 kg PP yoki koʻp qatlamli kraft qoplar. Talab boʻyicha chakana qadoq va 100–200 kg big-beglar. 20 futlik konteynerda taxminan 7–8 t."
    },
    "hsCode": "0712.90"
  },
  {
    "slug": "dried-dill",
    "category": "dried-vegetables",
    "name": {
      "en": "Dried Dill",
      "ru": "Сушёный укроп",
      "uz": "Quritilgan shivit"
    },
    "latinName": "Anethum graveolens L.",
    "description": {
      "en": "Dried dill weed cut to 3x3, 5x5 and 10x10 mm, dried in shade at low temperature so the green colour and the essential-oil profile survive the process. Uzbek open-field dill is cut young, before flowering, which keeps stalk content low and the aroma clean. Supplied to seasoning houses and producers of soup concentrates, dry sauces and dressings, brine and pickling mixes, and to retail packers of culinary herbs.",
      "ru": "Сушёная зелень укропа резкой 3x3, 5x5 и 10x10 мм; сушка ведётся в тени при низкой температуре, что сохраняет зелёный цвет и профиль эфирных масел. Узбекский укроп открытого грунта срезают молодым, до цветения, поэтому доля стебля невысока, а аромат остаётся чистым. Поставляется производителям приправ и супов-концентратов, сухих соусов и заправок, рассольных и засолочных смесей, а также фасовщикам кулинарных трав.",
      "uz": "Quritilgan shivit koʻkati 3x3, 5x5 va 10x10 mm kesimda tayyorlanadi; quritish soyada, past haroratda olib boriladi va shu bois yashil rang hamda efir moylari tarkibi saqlanadi. Oʻzbekistonda ochiq maydondagi shivit gullashdan oldin, yosh holida oʻriladi — bu poya ulushini kamaytiradi va hidni toza saqlaydi. Ziravor ishlab chiqaruvchilar, shoʻrva konsentratlari, quruq sous va zapravkalar, tuzlash hamda marinad aralashmalari ishlab chiqaruvchilarga, shuningdek oshxona koʻkatlarini chakana qadoqlovchilarga yetkaziladi."
    },
    "specs": [
      {
        "label": {
          "en": "Grade & calibration",
          "ru": "Сорт и калибровка",
          "uz": "Nav va kalibrlash"
        },
        "value": {
          "en": "Sliced (cut leaf) / Caliber: 3x3; 5x5; 10x10 (mm); rubbed and powder on request",
          "ru": "Ломтики (резаная зелень) / калибр: 3x3; 5x5; 10x10 (мм); растёртая зелень и порошок по запросу",
          "uz": "Tilim (kesilgan koʻkat) / kalibr: 3x3; 5x5; 10x10 (mm); talab boʻyicha ezilgan koʻkat va kukun"
        }
      },
      {
        "label": {
          "en": "Moisture",
          "ru": "Влажность",
          "uz": "Namligi"
        },
        "value": {
          "en": "8% max.",
          "ru": "не более 8%",
          "uz": "8% dan koʻp emas"
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
          "uz": "Oʻzbekiston"
        }
      },
      {
        "label": {
          "en": "Packaging",
          "ru": "Упаковка",
          "uz": "Qadoqlash"
        },
        "value": {
          "en": "10 / 20 kg carton boxes with food-grade PE liner, 20 kg PP or kraft bags with PE liner",
          "ru": "коробки 10 / 20 кг с пищевым ПЭ-вкладышем, мешки ПП или крафт 20 кг с ПЭ-вкладышем",
          "uz": "oziq-ovqatbop PE ichlikli 10 / 20 kg karton qutilar, PE ichlikli 20 kg PP yoki kraft qoplar"
        }
      },
      {
        "label": {
          "en": "Shelf life",
          "ru": "Срок хранения",
          "uz": "Saqlash muddati"
        },
        "value": {
          "en": "18 months at +5…+25 °C, RH 65% max., dry dark ventilated warehouse",
          "ru": "18 месяцев при +5…+25 °C, отн. влажность не более 65%, сухой затемнённый проветриваемый склад",
          "uz": "+5…+25 °C da 18 oy, nisbiy namlik 65% dan koʻp emas, quruq, qorongʻi, shamollatiladigan omborda"
        }
      },
      {
        "label": {
          "en": "MOQ & delivery terms",
          "ru": "Мин. партия и условия поставки",
          "uz": "Minimal partiya va yetkazib berish shartlari"
        },
        "value": {
          "en": "From 1 000 kg per item; 1 x 20' FCL — approx. 2.5–3 MT (mixed containers accepted). FCA Tashkent, DAP by truck or rail, CIF Poti / Bandar Abbas (Incoterms 2020)",
          "ru": "От 1 000 кг по позиции; 1 x 20' FCL — ок. 2,5–3 т (допускается сборный контейнер). FCA Ташкент, DAP автотранспортом или по железной дороге, CIF Поти / Бендер-Аббас (Инкотермс 2020)",
          "uz": "Har bir pozitsiya boʻyicha 1 000 kg dan; 1 x 20' FCL — taxminan 2,5–3 t (aralash konteyner qabul qilinadi). FCA Toshkent, avtomobil yoki temir yoʻl orqali DAP, CIF Poti / Bandar Abbos (Inkoterms 2020)"
        }
      }
    ],
    "image": "/images/products/dried-dill.jpg",
    "regions": {
      "en": "Tashkent region, the Fergana Valley and Samarkand region — market-gardening districts around the large cities that supply fresh herbs for drying.",
      "ru": "Ташкентская область, Ферганская долина и Самаркандская область — пригородные овощеводческие районы вокруг крупных городов, поставляющие свежую зелень на сушку.",
      "uz": "Toshkent viloyati, Fargʻona vodiysi va Samarqand viloyati — quritishga yangi koʻkat yetkazib beradigan yirik shaharlar atrofidagi polizchilik hududlari."
    },
    "packaging": {
      "en": "10 kg and 20 kg carton boxes with food-grade PE liner, 20 kg PP or multi-wall kraft bags with PE liner. Retail packing and big bags 100–200 kg on request. Approx. 2.5–3 MT per 20' container.",
      "ru": "Коробки 10 и 20 кг с пищевым ПЭ-вкладышем, мешки ПП или многослойные крафт-мешки 20 кг с ПЭ-вкладышем. Розничная фасовка и биг-бэги 100–200 кг по запросу. Около 2,5–3 т в 20-футовом контейнере.",
      "uz": "Oziq-ovqatbop PE ichlikli 10 va 20 kg karton qutilar, PE ichlikli 20 kg PP yoki koʻp qatlamli kraft qoplar. Talab boʻyicha chakana qadoq va 100–200 kg big-beglar. 20 futlik konteynerda taxminan 2,5–3 t."
    },
    "hsCode": "0712.90"
  }
];

export function getProduct(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  return products.filter((product) => product.category === category);
}

export const featuredProducts: Product[] = products.filter((product) => product.featured);
