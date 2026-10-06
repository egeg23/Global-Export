import { clamp, out, seg } from "./timeline";

/**
 * Движок истории: одна липкая сцена, один requestAnimationFrame, ни одной
 * перерисовки React во время прокрутки.
 *
 * Узлы сцены помечены `data-k`, и функция кадра пишет им прозрачность и
 * трансформацию напрямую. Фотографии — «камеры»: у каждой точка, на которую
 * смотрит объектив (u, v в долях кадра), и приближение z. Камера считает
 * сама, как кадр покрывает экран, и не даёт увидеть край снимка — поэтому
 * одну и ту же сцену можно вести и на широком мониторе, и на телефоне.
 */

export type Pose = { o?: number; x?: number; y?: number; s?: number; r?: number; ry?: number; rx?: number };

type Cam = { el: HTMLElement; iw: number; ih: number; bw: number; bh: number };

type Beat = { el: HTMLElement; a: number; b: number; lines: HTMLElement[] };

export class Stage {
  W = 1;
  H = 1;
  private nodes = new Map<string, HTMLElement>();
  private cams = new Map<string, Cam>();
  private beats: Beat[] = [];
  private last = new Map<HTMLElement, string>();
  private lastO = new Map<HTMLElement, number>();
  private lazy: { el: HTMLImageElement; from: number }[] = [];

  constructor(private root: HTMLElement) {
    root.querySelectorAll<HTMLElement>("[data-k]").forEach((el) => this.nodes.set(el.dataset.k!, el));
    root.querySelectorAll<HTMLElement>("[data-cam]").forEach((el) => {
      this.cams.set(el.dataset.cam!, { el, iw: Number(el.dataset.iw), ih: Number(el.dataset.ih), bw: 1, bh: 1 });
    });
    root.querySelectorAll<HTMLElement>("[data-beat]").forEach((el) => {
      const [a, b] = el.dataset.beat!.split(" ").map(Number);
      this.beats.push({ el, a, b, lines: Array.from(el.querySelectorAll<HTMLElement>("[data-line]")) });
    });
    root.querySelectorAll<HTMLImageElement>("img[data-src]").forEach((el) => {
      this.lazy.push({ el, from: Number(el.dataset.from ?? 0) });
    });
  }

  resize(W: number, H: number) {
    this.W = W;
    this.H = H;
    for (const cam of this.cams.values()) {
      const k = Math.max(W / cam.iw, H / cam.ih);
      cam.bw = cam.iw * k;
      cam.bh = cam.ih * k;
      cam.el.style.width = `${cam.bw}px`;
      cam.el.style.height = `${cam.bh}px`;
    }
    this.last.clear();
  }

  /** Подгрузить снимки, до которых осталось меньше `ahead` экранов. */
  load(t: number, ahead = 7) {
    if (!this.lazy.length) return;
    const mobile = this.W <= 820;
    this.lazy = this.lazy.filter(({ el, from }) => {
      if (from - t > ahead) return true;
      reveal(el, mobile);
      return false;
    });
  }

  /** Всё оставшееся — по одному, когда браузер свободен. */
  loadRest() {
    const mobile = this.W <= 820;
    const queue = this.lazy.sort((a, b) => a.from - b.from).map(({ el }) => el);
    this.lazy = [];
    const next = () => {
      const el = queue.shift();
      if (!el) return;
      reveal(el, mobile);
      if (el.complete) next();
      else {
        el.addEventListener("load", next, { once: true });
        el.addEventListener("error", next, { once: true });
      }
    };
    next();
  }

  el(k: string) {
    return this.nodes.get(k);
  }

  private write(el: HTMLElement, transform: string, o: number) {
    if (this.last.get(el) !== transform) {
      el.style.transform = transform;
      this.last.set(el, transform);
    }
    const prev = this.lastO.get(el);
    if (prev === undefined || Math.abs(prev - o) > 0.001 || (o === 0) !== (prev === 0)) {
      el.style.opacity = o.toFixed(3);
      el.style.visibility = o <= 0.001 ? "hidden" : "visible";
      this.lastO.set(el, o);
    }
  }

  /** Поза слоя: x, y — в долях экрана; s — масштаб; r, ry, rx — градусы. */
  pose(k: string, p: Pose) {
    const el = this.nodes.get(k);
    if (!el) return;
    const { o = 1, x = 0, y = 0, s = 1, r = 0, ry = 0, rx = 0 } = p;
    let tf = `translate3d(${(x * this.W).toFixed(1)}px,${(y * this.H).toFixed(1)}px,0)`;
    if (s !== 1) tf += ` scale(${s.toFixed(4)})`;
    if (r) tf += ` rotate(${r.toFixed(2)}deg)`;
    if (ry) tf += ` rotateY(${ry.toFixed(2)}deg)`;
    if (rx) tf += ` rotateX(${rx.toFixed(2)}deg)`;
    this.write(el, tf, clamp(o));
  }

  /** Только прозрачность. */
  fade(k: string, o: number) {
    const el = this.nodes.get(k);
    if (!el) return;
    this.write(el, this.last.get(el) ?? "", clamp(o));
  }

  /** Камера над снимком: смотрит в точку (u, v) с приближением z ≥ 1. */
  cam(k: string, u: number, v: number, z: number) {
    const cam = this.cams.get(k);
    if (!cam) return;
    const bw = cam.bw * z;
    const bh = cam.bh * z;
    const tx = clamp(this.W / 2 - u * bw, this.W - bw, 0);
    const ty = clamp(this.H / 2 - v * bh, this.H - bh, 0);
    const tf = `translate3d(${tx.toFixed(1)}px,${ty.toFixed(1)}px,0) scale(${z.toFixed(4)})`;
    if (this.last.get(cam.el) !== tf) {
      cam.el.style.transform = tf;
      this.last.set(cam.el, tf);
    }
  }

  /** Переменная CSS на корне — для того, что рисует сам CSS. */
  vars(values: Record<string, number>) {
    for (const [name, value] of Object.entries(values)) {
      const v = value.toFixed(4);
      const key = `--${name}`;
      if (this.root.style.getPropertyValue(key) !== v) this.root.style.setProperty(key, v);
    }
  }

  /**
   * Подписи: каждая живёт в своём окне [a, b] — выплывает снизу, строки
   * догоняют друг друга, и так же уходит вверх.
   */
  runBeats(t: number) {
    for (const beat of this.beats) {
      const { a, b } = beat;
      const inn = seg(t, a, a + 0.7);
      const outp = seg(t, b - 0.6, b);
      const o = Math.min(inn, 1 - outp);
      const tf = `translate3d(0,${((1 - out(inn)) * 28 - out(outp) * 28).toFixed(1)}px,0)`;
      this.write(beat.el, tf, o);
      if (o <= 0) continue;
      beat.lines.forEach((line, i) => {
        const li = seg(t, a + 0.12 * i, a + 0.12 * i + 0.8);
        this.write(line, `translate3d(0,${((1 - out(li)) * 22).toFixed(1)}px,0)`, out(li));
      });
    }
  }
}

function reveal(el: HTMLImageElement, mobile: boolean) {
  const src = (mobile && el.dataset.srcM) || el.dataset.src;
  if (src && el.getAttribute("src") !== src) el.src = src;
  el.removeAttribute("data-src");
}
