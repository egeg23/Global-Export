"use client";

import NumberFlow from "@number-flow/react";
import { useId, useState } from "react";

import { CERT_LEVELS, DTM, MARKS, dtmParts, fmt, type CertLevel, type DtmInput } from "@/components/medacademy/shared/dtm";
import { cn } from "@/lib/cn";

/**
 * Калькулятор балла DTM — главный интерактив обоих вариантов.
 *
 * Ученик двигает число верных ответов (или выбирает уровень сертификата) и
 * видит балл из 189 и где он относительно баллов, с которыми поступали сами
 * преподаватели MedAcademy, — это их факты с сайта, а не выдуманный
 * «проходной». Полоса заполняется через transform, цифры — NumberFlow.
 */
export function DtmCalculator({ v }: { v: "a" | "b" }) {
  const [input, setInput] = useState<DtmInput>({ mandatory: 22, bio: 21, chem: 18, bioCert: "none", chemCert: "none" });
  const parts = dtmParts(input);
  const set = (patch: Partial<DtmInput>) => setInput((prev) => ({ ...prev, ...patch }));
  const share = parts.total / DTM.max;
  const gainChem = input.chemCert === "none" && input.chem <= 25 ? fmt(5 * DTM.chem.weight) : null;

  return (
    <div className={cn("grid gap-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10")}>
      <div className="space-y-6">
        <Slider
          label="Обязательные: родной язык, математика, история"
          hint="30 вопросов × 1,1"
          value={input.mandatory}
          onChange={(value) => set({ mandatory: value })}
        />
        <Subject
          label="Биология — первый профильный"
          hint="30 вопросов × 3,1"
          value={input.bio}
          cert={input.bioCert}
          onValue={(value) => set({ bio: value })}
          onCert={(cert) => set({ bioCert: cert })}
        />
        <Subject
          label="Химия — второй профильный"
          hint="30 вопросов × 2,1"
          value={input.chem}
          cert={input.chemCert}
          onValue={(value) => set({ chem: value })}
          onCert={(cert) => set({ chemCert: cert })}
        />
      </div>

      <div className={cn("ma-card flex flex-col p-6 sm:p-8", v === "b" && "bg-ma-surface-2")} aria-live="polite">
        <p className="ma-eyebrow ma-muted">Ваш балл</p>
        <p className="mt-2 flex items-baseline gap-2">
          <span className={cn("ma-display ma-num text-6xl sm:text-7xl", v === "a" ? "text-ma-ink" : "text-ma-accent")}>
            <NumberFlow value={parts.total} locales="ru-RU" format={{ maximumFractionDigits: 1 }} />
          </span>
          <span className="ma-muted text-xl">из {DTM.max}</span>
        </p>

        <div className="relative mt-8 h-3 overflow-visible rounded-full bg-ma-surface-2" aria-hidden="true">
          <div
            className={cn("absolute inset-0 origin-left rounded-full transition-transform duration-500 ease-[var(--ease-ma)]", v === "a" ? "bg-ma-accent" : "bg-ma-accent")}
            style={{ transform: `scaleX(${share})` }}
          />
          {MARKS.map((mark) => (
            <span
              key={mark.name}
              className="absolute top-1/2 h-5 w-0.5 -translate-y-1/2 bg-ma-ink"
              style={{ left: `${(mark.score / DTM.max) * 100}%` }}
            />
          ))}
        </div>

        <ul className="mt-6 space-y-2 text-sm">
          {MARKS.map((mark) => {
            const diff = parts.total - mark.score;
            return (
              <li key={mark.name} className="flex items-baseline justify-between gap-3 border-t border-ma-line pt-2">
                <span className="ma-muted">{mark.name.split(" ")[0]} {mark.verb} с</span>
                <span className="ma-num shrink-0 font-bold">
                  {fmt(mark.score)}{" "}
                  <span className={cn("font-normal", diff >= 0 ? "text-ma-pop" : "ma-muted")}>
                    {diff >= 0 ? `+${fmt(diff)}` : `−${fmt(-diff)}`}
                  </span>
                </span>
              </li>
            );
          })}
        </ul>

        <dl className="mt-6 grid grid-cols-3 gap-3 text-sm">
          {[
            ["Обязат.", parts.mandatory, 33],
            ["Биология", parts.bio, 93],
            ["Химия", parts.chem, 63],
          ].map(([label, value, max]) => (
            <div key={label as string} className="rounded-[var(--ma-radius)] bg-ma-bg p-3">
              <dt className="ma-muted text-xs">{label}</dt>
              <dd className="ma-num mt-1 font-bold">
                {fmt(value as number)}
                <span className="ma-muted font-normal"> / {max}</span>
              </dd>
            </div>
          ))}
        </dl>

        {gainChem ? (
          <p className="mt-6 text-sm">
            <b>+5 верных по химии</b> — это ещё <b className="ma-num">{gainChem}</b> балла. Ради таких пяти ответов и разбирают задачи на курсе.
          </p>
        ) : null}

        <p className="ma-muted mt-auto pt-6 text-xs leading-relaxed">
          Формула UZBMB: 90 вопросов, максимум 189. Баллы за сертификат — ориентир testmakon.uz по нижней границе уровня.
          Проходной балл зависит от вуза, года и формы обучения — его назовёт администратор.
        </p>
      </div>
    </div>
  );
}

function Slider({ label, hint, value, onChange, disabled }: { label: string; hint: string; value: number; onChange: (value: number) => void; disabled?: boolean }) {
  const id = useId();
  return (
    <div className={cn(disabled && "opacity-40")}>
      <div className="flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="font-bold">
          {label}
        </label>
        <span className="ma-num shrink-0 text-lg font-bold">{value} / 30</span>
      </div>
      <p className="ma-muted text-sm">{hint}</p>
      <input
        id={id}
        type="range"
        min={0}
        max={30}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(Number(event.target.value))}
        className="ma-range mt-2"
      />
    </div>
  );
}

function Subject({
  label,
  hint,
  value,
  cert,
  onValue,
  onCert,
}: {
  label: string;
  hint: string;
  value: number;
  cert: CertLevel;
  onValue: (value: number) => void;
  onCert: (cert: CertLevel) => void;
}) {
  return (
    <div className="space-y-3">
      <Slider label={label} hint={cert === "none" ? hint : `Засчитан сертификат ${cert}`} value={value} onChange={onValue} disabled={cert !== "none"} />
      <div role="radiogroup" aria-label={`Сертификат: ${label}`} className="flex flex-wrap gap-1.5">
        {CERT_LEVELS.map((level) => (
          <button
            key={level}
            type="button"
            role="radio"
            aria-checked={cert === level}
            onClick={() => onCert(level)}
            className="ma-chip min-h-10 px-3 text-xs"
          >
            {level === "none" ? "без сертификата" : level}
          </button>
        ))}
      </div>
    </div>
  );
}
