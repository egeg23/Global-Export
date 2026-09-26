import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Offer } from "@/components/showcase/offer";
import { Capital, Chapter, Contacts, Footer, Header, Analytics } from "@/components/tr/sections";
import { trOffer } from "@/content/tr/offer";
import { Hero } from "@/components/tr/hero";
import { OfficeMap } from "@/components/tr/map";
import { Permits } from "@/components/tr/permits";
import { Search } from "@/components/tr/search";
import { Strategies } from "@/components/tr/strategies";

/**
 * Tranio — один макет главной.
 *
 * Страница построена как инвестиционный меморандум: разделы пронумерованы,
 * цифры набраны моноширинным, под каждым разделом стоит оговорка о том,
 * откуда взята цифра. Жанр выбран по тому, зачем к ним приходят: считать,
 * а не смотреть.
 *
 * Четыре механики, которые на их нынешнем сайте либо отсутствуют, либо
 * лежат текстом: подбор направления по цели и бюджету, калькулятор их же
 * четырёх стратегий, карта десяти офисов и подбор программы ВНЖ.
 */
export default function TranioPage() {
  return (
    <>
      <DevuzIntro project="tr" />
      <Header />

      <main>
        <Hero />

        <Chapter
          id="search"
          number="01"
          title={
            <>
              Куда смотреть с вашим бюджетом и{" "}
              <span className="text-[var(--w-accent)]">вашей целью</span>
            </>
          }
          lead="Двадцать одно направление в нашем каталоге. Выбор цели и суммы сразу пересчитывает список: остаются те страны, где на эти деньги что-то действительно покупают."
        >
          <Search />
        </Chapter>

        <Chapter
          id="strategies"
          number="02"
          tone="deep"
          title={
            <>
              Четыре стратегии Tranio, <span className="text-[var(--w-accent)]">посчитанные</span>
            </>
          }
          lead="Строительство в Европе, строительство в Дубае, реновация и арендный бизнес. Поставьте капитал и горизонт — покажем, во что это выходит по деньгам и по сроку."
        >
          <Strategies />
        </Chapter>

        <Chapter
          id="map"
          number="03"
          title={
            <>
              Десять офисов, <span className="text-[var(--w-accent)]">две с половиной тысячи</span>{" "}
              сделок
            </>
          }
          lead="Присутствие на карте, а не строкой в подвале: города стоят на своих настоящих координатах, дуги идут от Москвы, откуда мы родом."
        >
          <OfficeMap />
        </Chapter>

        <Chapter
          id="permits"
          number="04"
          title={
            <>
              Статус: что подойдёт и{" "}
              <span className="text-[var(--w-accent)]">как быстро оформят</span>
            </>
          }
          lead="Десять программ — от вида на жительство цифрового кочевника до гражданства за инвестиции. Сортируются по сроку оформления."
        >
          <Permits />
        </Chapter>

        <Chapter
          id="capital"
          number="05"
          tone="deep"
          title={
            <>
              Tranio Capital: <span className="text-[var(--w-accent)]">€1,73 млрд</span> проектов
            </>
          }
          lead="Инвестиционная группа внутри компании — то, что отличает нас от брокера объявлений."
        >
          <Capital />
        </Chapter>

        <Chapter
          id="analytics"
          number="06"
          title={
            <>
              Четыре тысячи публикаций — <span className="text-[var(--w-accent)]">это актив</span>
            </>
          }
          lead="База знаний по каждой стране: налоги, ипотека, содержание, районы. Пишем сами и обновляем, когда меняются правила."
        >
          <Analytics />
        </Chapter>

        <Chapter
          id="offer"
          number="07"
          tone="deep"
          title={
            <>
              Что это стоит и <span className="text-[var(--w-accent)]">из чего складывается</span>
            </>
          }
          lead="Это цена работы студии Maximov Tech над сайтом, а не услуга Tranio. Сверху — то, что в макете уже сделано: любой блок снимается тумблером, и сумма падает. Снизу — то, что можно доделать: там тумблер сумму поднимает."
        >
          <Offer
            items={trOffer}
            currency="rub"
            title="Стоимость макета"
            lead="Полный состав: главная со всеми механиками и панель заявок"
            fullLabel="Состав макета —"
            madeLabel="Что в макете уже сделано"
            extraLabel="Что можно доделать сверх макета"
            note="Срок макета — три недели от согласования; каждое дополнение считается отдельным сроком и обсуждается до старта. В цену входят вёрстка, адаптив от 320 px, выкатка на домен и SSL. Хостинг и домен оплачиваются отдельно и напрямую."
          />
        </Chapter>

        <Chapter
          id="contacts"
          number="08"
          title={
            <>
              Разговор начинается <span className="text-[var(--w-accent)]">с вашей цифры</span>
            </>
          }
          lead="Соберите состав в подборе и калькуляторе — заявка уйдёт вместе с ним, и первый звонок начнётся не с «расскажите, что вы хотите»."
        >
          <Contacts />
        </Chapter>
      </main>

      <Footer />
    </>
  );
}
