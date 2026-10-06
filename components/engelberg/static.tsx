/* eslint-disable @next/next/no-img-element -- снимки макета лежат готовыми webp и подгружаются лениво самим браузером */
import { benefits, bkh65, brand, chambers, fs50, handles, thermo90 } from "@/content/engelberg/site";

const IMG = "/images/engelberg";

/**
 * История без движения — для тех, у кого в системе включено «уменьшить
 * движение». Те же главы и те же факты, стопкой, без камеры и пролётов.
 * Показывается вместо истории правилом в engelberg.css.
 */
export function StaticStory({ variant }: { variant?: "v2" } = {}) {
  const pic = (v1: string, v2: string) => (variant === "v2" ? `v2/${v2}-1440` : v1);
  const chapters = [
    { img: pic("alps-1920", "alps"), title: brand.motto, text: brand.lead },
    {
      img: pic("villa-2400", "villa"),
      title: `${thermo90.name} — окна в пол`,
      text: `${thermo90.lead} ${thermo90.specs.map((s) => `${s.label}: ${s.value}`).join(" · ")}.`,
    },
    {
      img: null,
      title: "Три контура, которые держат тепло",
      text: chambers.map((c) => `${c.title}. ${c.text}`).join(" "),
    },
    { img: pic("room-1920", "room"), title: "Преимущества", text: benefits.map((b) => `${b.title}. ${b.text}`).join(" ") },
    { img: pic("handle-black", "handle"), title: handles.name, text: `${handles.lead} ${handles.origin}.` },
    { img: pic("sliding-1920", "bkh-open"), title: bkh65.name, text: `${bkh65.lead} ${bkh65.specs.map((s) => `${s.label}: ${s.value}`).join(" · ")}.` },
    { img: pic("facade-1920", "fs-glass"), title: fs50.name, text: `${fs50.lead} ${fs50.about}` },
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
