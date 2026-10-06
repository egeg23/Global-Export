/* eslint-disable @next/next/no-img-element -- снимки макета лежат готовыми webp и подгружаются лениво самим браузером */
import { benefits, bkh65, brand, chambers, fs50, handles, thermo90 } from "@/content/engelberg/site";

const IMG = "/images/engelberg";

/**
 * История без движения — для тех, у кого в системе включено «уменьшить
 * движение». Те же главы и те же факты, стопкой, без камеры и пролётов.
 * Показывается вместо истории правилом в engelberg.css.
 */
export function StaticStory() {
  const chapters = [
    { img: "alps-1920", title: brand.motto, text: brand.lead },
    {
      img: "villa-2400",
      title: `${thermo90.name} — окна в пол`,
      text: `${thermo90.lead} ${thermo90.specs.map((s) => `${s.label}: ${s.value}`).join(" · ")}.`,
    },
    {
      img: null,
      title: "Три контура, которые держат тепло",
      text: chambers.map((c) => `${c.title}. ${c.text}`).join(" "),
    },
    { img: "room-1920", title: "Преимущества", text: benefits.map((b) => `${b.title}. ${b.text}`).join(" ") },
    { img: "handle-black", title: handles.name, text: `${handles.lead} ${handles.origin}.` },
    { img: "sliding-1920", title: bkh65.name, text: `${bkh65.lead} ${bkh65.specs.map((s) => `${s.label}: ${s.value}`).join(" · ")}.` },
    { img: "facade-1920", title: fs50.name, text: `${fs50.lead} ${fs50.about}` },
  ];

  return (
    <div className="eb-static">
      {chapters.map((c) => (
        <section key={c.title}>
          {c.img ? <img src={`${IMG}/${c.img}.webp`} alt="" loading="lazy" /> : null}
          <div>
            <h2 className="eb-h">{c.title}</h2>
            <p className="eb-p">{c.text}</p>
          </div>
        </section>
      ))}
    </div>
  );
}
