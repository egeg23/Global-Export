/**
 * Скрипт, который ставит палитру до первой отрисовки.
 *
 * Живёт отдельно от компонента переключателя намеренно: его вызывает
 * серверная разметка корня документа, а модуль с `"use client"` сервер
 * позвать не может.
 *
 * Выполняется синхронно при разборе разметки, поэтому страница красится
 * сразу правильной палитрой — приём из руководства Next про вспышку до
 * гидратации. Ошибки глотаются намеренно: в приватном окне доступ к
 * хранилищу бросает исключение, и падать из-за оттенка фона страница не
 * должна.
 */

export const PALETTE_KEY = "showcase-palette";

export function paletteScript(world: string, allowed: string[], fallback: string) {
  return `(function(){try{
var a=${JSON.stringify(allowed)};
var u=new URL(location.href).searchParams.get("palette");
var s=null;try{s=localStorage.getItem(${JSON.stringify(`${PALETTE_KEY}:${world}`)})}catch(e){}
var p=a.indexOf(u)>=0?u:(a.indexOf(s)>=0?s:${JSON.stringify(fallback)});
document.body.setAttribute("data-palette",p);
}catch(e){}})();`;
}
