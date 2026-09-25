/**
 * Скрипт, который ставит язык до первой отрисовки.
 *
 * Живёт отдельно от компонентов по той же причине, что и скрипт палитры:
 * его зовёт серверная разметка корня документа, а модуль с `"use client"`
 * сервер позвать не может.
 *
 * Язык пишется и в `lang` самого документа, и в атрибут на теле. Первое
 * нужно экранным дикторам и переносам, второе — стилям и подписке в
 * браузере.
 */

export const LANG_KEY = "showcase-lang";

export function langScript(world: string, allowed: string[], fallback: string) {
  return `(function(){try{
var a=${JSON.stringify(allowed)};
var u=new URL(location.href).searchParams.get("lang");
var s=null;try{s=localStorage.getItem(${JSON.stringify(`${LANG_KEY}:${world}`)})}catch(e){}
var n=(navigator.language||"").slice(0,2);
var l=a.indexOf(u)>=0?u:(a.indexOf(s)>=0?s:(a.indexOf(n)>=0?n:${JSON.stringify(fallback)}));
document.body.setAttribute("data-lang",l);
document.documentElement.setAttribute("lang",l==="kk"?"kk":"ru");
}catch(e){}})();`;
}
