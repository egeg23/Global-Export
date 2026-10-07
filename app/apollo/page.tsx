import { About, Blog, Budget, Contacts, Countries, Flights, Footer, Header, Hero, Hot, Operators, Pay, Reviews, TgHot, Visa } from "@/components/apollo/sections";
import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Addon, ConfiguratorProvider } from "@/components/configurator/context";
import { apolloCatalog, apolloHrefs } from "@/content/apollo/addons";

/**
 * Apollo Travel — главная.
 *
 * Их сайт, переодетый целиком: поиск туров остаётся на движке Tourvisor, а
 * форма, ожидание поиска и всё вокруг — наше. Порядок — порядок решения о
 * поездке: найти тур, увидеть горящее, выбрать страну, посмотреть билеты,
 * поверить агентству и прийти в офис.
 *
 * Допники конструктора (док справа внизу) встают каждый на своё место:
 * бюджет и визы — к странам, автопостинг — к горящим, оплата — перед
 * контактами. Календарь цен и рассрочка живут внутри формы и карточек.
 */
export default function ApolloPage() {
  return (
    <ConfiguratorProvider catalog={apolloCatalog} tier="site" page="main" hrefs={apolloHrefs()}>
      <DevuzIntro project="apollo" />
      <Header />
      <main id="content">
        <Hero />
        <Operators />
        <Hot />
        <Addon id="tg-hot">
          <TgHot />
        </Addon>
        <Countries />
        <Addon id="budget">
          <Budget />
        </Addon>
        <Addon id="visa">
          <Visa />
        </Addon>
        <Flights />
        <About />
        <Addon id="reviews">
          <Reviews />
        </Addon>
        <Blog />
        <Addon id="pay">
          <Pay />
        </Addon>
        <Contacts />
      </main>
      <Footer />
    </ConfiguratorProvider>
  );
}
