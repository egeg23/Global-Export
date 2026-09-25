import Image from "next/image";

import { Reveal } from "@/components/delta/reveal";
import { StoryArt } from "@/components/delta/story-art";
import { founder, school, stories } from "@/content/delta/school";

/* ------------------------------------------------------------------ */
/* Как пройдёт первый урок                                             */
/* ------------------------------------------------------------------ */

const LESSON = [
  {
    title: "Знакомимся",
    text: "Преподаватель узнаёт, что ребёнку интересно: игры, рисунки или задачки. От этого зависит, с чего он начнёт.",
    color: "#FFD84A",
  },
  {
    title: "Делаем первый проект",
    text: "Не лекция, а работа руками. Наш ученик впервые взял мышку — и к концу урока собрал свои первые скрипты.",
    color: "#04BD62",
  },
  {
    title: "Перемена с пользой",
    text: "Даже перемены — это игры на логику, внимание и концентрацию. Телефон в это время отдыхает.",
    color: "#5BA8FF",
  },
  {
    title: "Разговор с вами",
    text: "Рассказываем, что увидели, и советуем ступень. Решение — за вами, после урока, а не до него.",
    color: "#E5322D",
  },
];

export function FirstLesson() {
  return (
    <section id="urok" className="relative overflow-hidden bg-dl-yellow px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-blue-800">Пробный урок</p>
            <h2 className="mt-3 max-w-2xl font-dl-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Как пройдёт первый урок
            </h2>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-dl-ink/75">
              Четыре шага, и последний из них — с вами. Вы уходите не с обещаниями, а с тем, что ребёнок
              сделал своими руками.
            </p>
          </div>
          <Reveal className="dl-clay relative hidden overflow-hidden lg:block" delay={120}>
            <Image
              src="/delta/class-screen.webp"
              alt="Ученик Delta IT-School собирает программу из блоков"
              width={600}
              height={800}
              className="h-64 w-full object-cover object-[50%_60%]"
            />
          </Reveal>
        </div>

        <ol className="relative mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {/* Пунктир, связывающий шаги */}
          <li aria-hidden="true" className="pointer-events-none absolute left-8 right-8 top-9 hidden border-t-[3px] border-dashed border-dl-ink/30 xl:block" />
          {LESSON.map((step, i) => (
            <Reveal as="li" key={step.title} delay={i * 110} className="dl-clay relative p-6">
              <span
                className="grid h-12 w-12 place-items-center rounded-2xl border-[3px] border-dl-ink font-dl-display text-xl font-black"
                style={{ background: step.color, color: step.color === "#E5322D" || step.color === "#04BD62" ? "#fff" : "#10214A" }}
              >
                {i + 1}
              </span>
              <h3 className="mt-5 font-dl-display text-2xl font-black">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-dl-ink-muted">{step.text}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Кто учит                                                            */
/* ------------------------------------------------------------------ */

export function Teacher() {
  return (
    <section className="bg-dl-paper px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1240px] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-16">
        <Reveal className="relative mx-auto w-full max-w-md">
          <div className="dl-clay overflow-hidden">
            <Image
              src="/delta/kirill-student.webp"
              alt="Кирилл Георгиевич с учеником в классе"
              width={600}
              height={800}
              className="aspect-[4/5] w-full object-cover"
            />
          </div>
          <div className="dl-clay absolute -bottom-6 -right-3 max-w-[15rem] rotate-2 bg-dl-lemon p-4 sm:-right-8">
            <p className="text-sm font-extrabold leading-snug">«{founder.manner}»</p>
            <p className="mt-1 text-xs font-bold text-dl-ink-muted">— так о нём пишет сама школа</p>
          </div>
        </Reveal>

        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-blue">Кто учит</p>
          <h2 className="mt-3 font-dl-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
            Урок ведёт основатель школы
          </h2>
          <p className="mt-2 font-dl-display text-2xl font-extrabold text-dl-blue">{founder.name}</p>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-dl-ink-muted">{founder.story}</p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-dl-ink-muted">
            В большой сети преподаватели меняются, и ребёнка каждый раз знакомят с новым человеком. Здесь
            ребёнка знает тот, кто эту школу построил.
          </p>

          <figure className="dl-clay-soft mt-8 max-w-xl p-6">
            <blockquote className="text-base leading-relaxed">«{founder.praise}»</blockquote>
            <figcaption className="mt-3 text-sm font-bold text-dl-ink-muted">
              {founder.manager}, менеджер Delta IT-School
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Уже случилось — истории с источником                                */
/* ------------------------------------------------------------------ */

export function Results() {
  return (
    <section className="bg-white px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-blue">Результаты</p>
            <h2 className="mt-3 max-w-2xl font-dl-display text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Не обещания — уже случилось
            </h2>
          </div>
          <p className="max-w-sm text-base leading-relaxed text-dl-ink-muted">
            Каждая история — из нашего Telegram-канала. Ссылка ведёт на сам пост: проверьте.
          </p>
        </div>

        <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {stories.map((story, i) => (
            <Reveal as="li" key={story.id} delay={i * 90} className="dl-clay flex flex-col overflow-hidden">
              <div className="relative aspect-[4/3] overflow-hidden border-b-[3px] border-dl-ink bg-dl-sky-100">
                <StoryArt id={story.id} />
                <span className="absolute left-3 top-3 rounded-full border-2 border-dl-ink bg-dl-yellow px-2.5 py-0.5 text-xs font-extrabold">
                  {story.badge}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-sm font-extrabold text-dl-blue">{story.who}</p>
                <h3 className="mt-1 font-dl-display text-xl font-black leading-snug">{story.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-dl-ink-muted">{story.text}</p>
                <a
                  href={`${school.telegram}/${story.source.slice(1)}`}
                  target="_blank"
                  rel="noopener"
                  className="dl-focus mt-4 inline-flex w-fit items-center gap-1.5 rounded-full text-sm font-extrabold text-dl-blue hover:underline"
                >
                  Пост {story.source} в канале
                  <span aria-hidden="true">↗</span>
                </a>
              </div>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Открытый экзамен, перемены, дома                                    */
/* ------------------------------------------------------------------ */

export function Openness() {
  return (
    <section className="bg-dl-paper px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto grid w-full max-w-[1240px] gap-6 lg:grid-cols-3">
        <Reveal className="dl-clay relative overflow-hidden bg-dl-blue text-white lg:col-span-2">
          <div className="grid h-full md:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col justify-center p-7 sm:p-10">
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-lemon">Открытый экзамен</p>
              <h2 className="mt-3 font-dl-display text-3xl font-black leading-tight sm:text-4xl">
                Родителей мы зовём на экзамен сами
              </h2>
              <p className="mt-4 text-base leading-relaxed text-white/85">
                Экзамены проходят в обеих группах, во время обычных занятий. Приходите и посмотрите на
                результат своими глазами — не в отчёте, а вживую.
              </p>
            </div>
            <div className="relative min-h-60 border-t-[3px] border-dl-ink md:border-l-[3px] md:border-t-0">
              <Image src="/delta/class-group.webp" alt="Ученики и преподаватель в классе Delta IT-School" fill sizes="(min-width: 1024px) 30vw, 100vw" className="object-cover" />
            </div>
          </div>
        </Reveal>

        <Reveal className="dl-clay flex flex-col bg-dl-green p-7 text-white sm:p-8" delay={100}>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-white/80">Перемены</p>
          <h3 className="mt-3 font-dl-display text-2xl font-black leading-tight">Даже перемена — с пользой</h3>
          <p className="mt-3 flex-1 text-base leading-relaxed text-white/90">
            Развивающие интеллектуальные игры: логика, внимание, концентрация. Не телефон в углу, а башня,
            которую нельзя уронить.
          </p>
          <div className="mt-5 flex items-center gap-3 rounded-2xl bg-white/15 p-3">
            <Image src="/delta/break-game.webp" alt="" width={180} height={320} className="h-20 w-12 rounded-lg border-2 border-dl-ink object-cover" />
            <p className="text-sm font-bold">Так выглядит перемена в Delta</p>
          </div>
        </Reveal>

        <Reveal className="dl-clay grid gap-6 bg-white p-7 sm:p-8 lg:col-span-3 lg:grid-cols-[1fr_1.4fr] lg:items-center" delay={60}>
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-dl-blue">Дома</p>
            <h3 className="mt-3 font-dl-display text-3xl font-black leading-tight">Пятнадцать минут вместо ленты</h3>
            <p className="mt-3 text-base leading-relaxed text-dl-ink-muted">
              У каждого урока своя цель, и дома её закрепляют тренажёры, которые мы даём. Успех ребёнка во
              многом зависит от поддержки семьи — это мы говорим родителям честно.
            </p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {[
              { t: "Клавиатурный тренажёр", d: "Слепая печать — навык, который пригодится и в школе.", c: "#FFD84A" },
              { t: "Тренажёры для мозга", d: "Задачи на логику и внимание — как игра, но с пользой.", c: "#5BA8FF" },
              { t: "Свой проект", d: "Сделал дома — пришлите в чат: посмотрим и поможем с ошибками.", c: "#04BD62" },
            ].map((item) => (
              <li key={item.t} className="rounded-2xl border-[3px] border-dl-ink p-4" style={{ background: `${item.c}33` }}>
                <span className="block h-2 w-10 rounded-full border-2 border-dl-ink" style={{ background: item.c }} aria-hidden="true" />
                <p className="mt-3 font-dl-display text-lg font-black leading-tight">{item.t}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-dl-ink-muted">{item.d}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
