import type { Metadata } from "next";

import { DevuzIntro } from "@/components/brand/devuz-intro";
import { Wordmark } from "@/components/engelberg/art";
import { After } from "@/components/engelberg/after";
import { StaticStory } from "@/components/engelberg/static";
import { StoryV2 } from "@/components/engelberg/story-v2";

export const metadata: Metadata = { title: "Вторая версия" };

/**
 * Engelberg — вторая версия: та же история на прокрутке, но кадры —
 * фотореалистичные рендеры GPT Image вместо стока (components/engelberg/
 * story-v2.tsx). Своя ссылка, тот же код доступа, что у первой версии:
 * адрес под /engelberg закрыт прокси целиком.
 */
export default function EngelbergV2Page() {
  return (
    <>
      <DevuzIntro project="engelberg" />
      <header className="eb-header">
        <a href="#top" className="eb-logo" aria-label="Engelberg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/engelberg/crest.svg" alt="" />
          <Wordmark />
        </a>
        <nav className="eb-nav">
          <a href="https://engelberg-window.com/catalog/" target="_blank" rel="noreferrer">
            Каталог
          </a>
          <a href="https://engelberg-window.com/portfolio/" target="_blank" rel="noreferrer">
            Портфолио
          </a>
          <a href="#eb-contact" className="eb-cta">
            Консультация
          </a>
        </nav>
      </header>
      <main id="top">
        <StoryV2 />
        <StaticStory variant="v2" />
        <After backdrop="/images/engelberg/v2/cta-1440.webp" />
      </main>
    </>
  );
}
