"use client";

import { useState } from "react";

import { Reveal } from "@/components/akbar/reveal";
import { company } from "@/content/akbar/company";

const { lat, lon } = company.office;
const MAP = `https://yandex.ru/map-widget/v1/?ll=${lon}%2C${lat}&z=16&pt=${lon},${lat},pm2dgm`;
const ROUTE = `https://yandex.uz/maps/?rtext=~${lat}%2C${lon}&rtt=auto`;
const GOOGLE = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;

/**
 * Шоурум и связь.
 *
 * Карта подгружается только по нажатию: чужой виджет с первого экрана
 * тянул бы скрипты и куки ещё до того, как человек решил ехать.
 */
export function Showroom() {
  const [map, setMap] = useState(false);

  return (
    <section id="shourum" className="scroll-mt-16 bg-ak-ivory px-4 py-20 sm:px-8 lg:px-[4vw] lg:py-28">
      <div className="mx-auto grid max-w-[100rem] gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <Reveal>
          <p className="ak-eyebrow text-ak-gold-600">Шоурум</p>
          <h2 className="mt-4 font-ak-display text-5xl font-medium leading-[0.98] sm:text-6xl">
            Приходите потрогать двери
          </h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-ak-muted">
            В шоуруме можно рассмотреть модели вживую, сравнить покрытия и задать все вопросы. Адрес
            ближайшего филиала в вашем регионе подскажет менеджер.
          </p>

          <dl className="mt-10 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="ak-eyebrow text-ak-muted">{company.office.title}</dt>
              <dd className="mt-2 text-base font-semibold leading-snug">{company.office.address}</dd>
              <dd className="mt-1 text-sm text-ak-muted">{company.office.landmark}</dd>
              <dd className="mt-1 text-sm text-ak-muted">{company.office.hours}</dd>
            </div>
            <div>
              <dt className="ak-eyebrow text-ak-muted">Call-центр</dt>
              {company.phones.map((phone) => (
                <dd key={phone.href} className="mt-2">
                  <a href={phone.href} className="text-lg font-semibold tabular-nums hover:text-ak-gold-600">
                    {phone.label}
                  </a>
                </dd>
              ))}
              <dd className="mt-1">
                <a href={`mailto:${company.email}`} className="text-sm text-ak-muted hover:text-ak-gold-600">
                  {company.email}
                </a>
              </dd>
            </div>
            {company.schedule.map((team) => (
              <div key={team.team}>
                <dt className="ak-eyebrow text-ak-muted">{team.team}</dt>
                {team.hours.map((line) => (
                  <dd key={line} className="mt-2 text-sm">
                    {line}
                  </dd>
                ))}
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap gap-3">
            <a href={ROUTE} target="_blank" rel="noopener" className="ak-btn ak-btn-ink">
              Маршрут в Яндекс Картах
            </a>
            <a href={GOOGLE} target="_blank" rel="noopener" className="ak-btn ak-btn-line">
              Google Maps
            </a>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative min-h-[26rem] overflow-hidden rounded-[2rem] bg-ak-wall-2">
          {map ? (
            <iframe
              title="Главный офис Akbar Rich на карте"
              src={MAP}
              className="absolute inset-0 h-full w-full border-0"
              loading="lazy"
              allowFullScreen
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(circle_at_50%_45%,#e9e2da,#d4ccc7)]">
              {/* Схема вместо карты: кольцевая, ориентир и точка. */}
              <svg aria-hidden="true" viewBox="0 0 400 300" className="absolute inset-0 h-full w-full opacity-60">
                <path d="M-20 210 C 80 150, 160 250, 260 190 S 380 120, 430 150" fill="none" stroke="#b8a898" strokeWidth="14" />
                <path d="M-20 210 C 80 150, 160 250, 260 190 S 380 120, 430 150" fill="none" stroke="#f5efe5" strokeWidth="2" strokeDasharray="8 8" />
                <path d="M120 -10 L 170 320" fill="none" stroke="#c8baab" strokeWidth="6" />
                <path d="M300 -10 L 250 320" fill="none" stroke="#c8baab" strokeWidth="5" />
              </svg>
              <div className="relative text-center">
                <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-ak-ink text-ak-gold-300 shadow-[0_18px_40px_-12px_rgb(22_18_14/0.5)]">
                  <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                    <path d="M12 21s7-6.2 7-12a7 7 0 1 0-14 0c0 5.8 7 12 7 12z" />
                    <circle cx="12" cy="9" r="2.5" />
                  </svg>
                </span>
                <p className="mt-4 font-ak-display text-2xl font-semibold">Малая кольцевая, 24</p>
                <button type="button" onClick={() => setMap(true)} className="ak-btn ak-btn-ink mt-5 min-h-12">
                  Показать на карте
                </button>
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
