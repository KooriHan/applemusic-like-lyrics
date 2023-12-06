import { Container as C } from "@pixi/display";
import { Application as z } from "@pixi/app";
import { BlurFilter as y } from "@pixi/filter-blur";
import { ColorMatrixFilter as P } from "@pixi/filter-color-matrix";
import { Texture as D } from "@pixi/core";
import { Sprite as S } from "@pixi/sprite";
import { BulgePinchFilter as b } from "@pixi/filter-bulge-pinch";
import { create as I } from "jss";
import k from "jss-preset-default";
class B extends C {
  time = 0;
}
class A {
  constructor(e) {
    this.canvas = e;
    const t = e.getBoundingClientRect();
    this.canvas.width = t.width * this.currerntRenderScale, this.canvas.height = t.height * this.currerntRenderScale, this.observer = new ResizeObserver(() => {
      const i = e.getBoundingClientRect();
      this.canvas.width = Math.max(1, i.width), this.canvas.height = Math.max(1, i.height), this.app.renderer.resize(
        this.canvas.width * this.currerntRenderScale,
        this.canvas.height * this.currerntRenderScale
      ), this.app.ticker.start(), this.rebuildFilters();
    }), this.observer.observe(e), this.app = new z({
      view: e,
      resizeTo: this.canvas,
      powerPreference: "low-power",
      backgroundAlpha: 0
    }), this.rebuildFilters(), this.app.ticker.maxFPS = 30, this.app.ticker.add(this.onTick), this.app.ticker.start();
  }
  observer;
  app;
  curContainer;
  staticMode = !1;
  lastContainer = /* @__PURE__ */ new Set();
  onTick = (e) => {
    for (const t of this.lastContainer)
      t.alpha = Math.max(0, t.alpha - e / 60), t.alpha <= 0 && (this.app.stage.removeChild(t), this.lastContainer.delete(t), t.destroy(!0));
    if (this.curContainer) {
      this.curContainer.alpha = Math.min(
        1,
        this.curContainer.alpha + e / 60
      );
      const [t, i, s, r] = this.curContainer.children, n = Math.max(this.app.screen.width, this.app.screen.height);
      t.position.set(this.app.screen.width / 2, this.app.screen.height / 2), i.position.set(
        this.app.screen.width / 2.5,
        this.app.screen.height / 2.5
      ), s.position.set(this.app.screen.width / 2, this.app.screen.height / 2), r.position.set(this.app.screen.width / 2, this.app.screen.height / 2), t.width = n * Math.sqrt(2), t.height = t.width, i.width = n * 0.8, i.height = i.width, s.width = n * 0.5, s.height = s.width, r.width = n * 0.25, r.height = r.width, this.curContainer.time += e * this.flowSpeed, t.rotation += e / 1e3 * this.flowSpeed, i.rotation -= e / 500 * this.flowSpeed, s.rotation += e / 1e3 * this.flowSpeed, r.rotation -= e / 750 * this.flowSpeed, s.x = this.app.screen.width / 2 + this.app.screen.width / 4 * Math.cos(this.curContainer.time / 1e3 * 0.75), s.y = this.app.screen.height / 2 + this.app.screen.width / 4 * Math.cos(this.curContainer.time / 1e3 * 0.75), r.x = this.app.screen.width / 2 + this.app.screen.width / 4 * 0.1 + Math.cos(this.curContainer.time * 6e-3 * 0.75), r.y = this.app.screen.height / 2 + this.app.screen.width / 4 * 0.1 + Math.cos(this.curContainer.time * 6e-3 * 0.75), this.curContainer.alpha >= 1 && this.lastContainer.size === 0 && this.staticMode && this.app.ticker.stop();
    }
  };
  flowSpeed = 2;
  currerntRenderScale = 0.75;
  /**
   * 修改背景的流动速度，数字越大越快，默认为 2
   * @param speed 背景的流动速度，默认为 2
   */
  setFlowSpeed(e) {
    this.flowSpeed = e;
  }
  /**
   * 修改背景的渲染比例，默认是 0.5
   *
   * 一般情况下这个程度既没有明显瑕疵也不会特别吃性能
   * @param scale 背景的渲染比例
   */
  setRenderScale(e) {
    this.currerntRenderScale = e;
    const t = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.max(1, t.width), this.canvas.height = Math.max(1, t.height), this.app.renderer.resize(
      this.canvas.width * this.currerntRenderScale,
      this.canvas.height * this.currerntRenderScale
    ), this.rebuildFilters();
  }
  rebuildFilters() {
    const e = Math.min(this.canvas.width, this.canvas.height), t = Math.max(this.canvas.width, this.canvas.height), i = new P();
    i.saturate(1.2, !1);
    const s = new P();
    s.brightness(0.6, !1);
    const r = new P();
    r.contrast(0.3, !0), this.app.stage.filters?.forEach((n) => {
      n.destroy();
    }), this.app.stage.filters = [], this.app.stage.filters.push(new y(5, 1)), this.app.stage.filters.push(new y(10, 1)), this.app.stage.filters.push(new y(20, 2)), this.app.stage.filters.push(new y(40, 2)), this.app.stage.filters.push(new y(80, 2)), e > 768 && this.app.stage.filters.push(new y(160, 4)), e > 768 * 2 && this.app.stage.filters.push(new y(320, 4)), this.app.stage.filters.push(i, s, r), this.app.stage.filters.push(new y(5, 1)), Math.random() > 0.5 ? (this.app.stage.filters.push(
      new b({
        radius: (t + e) / 2,
        strength: 1,
        center: [0.25, 1]
      })
    ), this.app.stage.filters.push(
      new b({
        radius: (t + e) / 2,
        strength: 1,
        center: [0.75, 0]
      })
    )) : (this.app.stage.filters.push(
      new b({
        radius: (t + e) / 2,
        strength: 1,
        center: [0.75, 1]
      })
    ), this.app.stage.filters.push(
      new b({
        radius: (t + e) / 2,
        strength: 1,
        center: [0.25, 0]
      })
    ));
  }
  /**
   * 是否启用静态模式，即图片在更换后就会保持静止状态并禁用更新，以节省性能
   * @param enable 是否启用静态模式
   */
  setStaticMode(e = !1) {
    this.staticMode = e, this.app.ticker.start();
  }
  /**
   * 修改背景动画帧率，默认是 30 FPS
   *
   * 如果设置成 0 则会停止动画
   * @param fps 目标帧率，默认 30 FPS
   */
  setFPS(e) {
    this.app.ticker.maxFPS = e;
  }
  /**
   * 暂停背景动画，画面即便是更新了图片也不会发生变化
   */
  pause() {
    this.app.ticker.stop(), this.app.render();
  }
  /**
   * 恢复播放背景动画
   */
  resume() {
    this.app.ticker.start();
  }
  /**
   * 设置背景专辑图片，图片材质加载并设置完成后会返回
   * @param albumUrl 图片的目标链接
   */
  async setAlbumImage(e) {
    const t = new Image();
    t.src = e, t.crossOrigin = "anonymous";
    let i = 5, s;
    for (; !s?.baseTexture?.resource?.valid && i > 0; )
      try {
        await t.decode(), s = D.from(t, {
          resourceOptions: {
            autoLoad: !1
          }
        }), await s.baseTexture.resource.load();
      } catch (h) {
        console.warn(
          `failed on loading album image, retrying (${i})`,
          e,
          h
        ), s = void 0, i--;
      }
    if (!s)
      return;
    const r = new B(), n = new S(s), a = new S(s), o = new S(s), l = new S(s);
    n.anchor.set(0.5, 0.5), a.anchor.set(0.5, 0.5), o.anchor.set(0.5, 0.5), l.anchor.set(0.5, 0.5), n.rotation = Math.random() * Math.PI * 2, a.rotation = Math.random() * Math.PI * 2, o.rotation = Math.random() * Math.PI * 2, l.rotation = Math.random() * Math.PI * 2, r.addChild(n, a, o, l), this.curContainer && this.lastContainer.add(this.curContainer), this.curContainer = r, this.app.stage.addChild(this.curContainer), this.curContainer.alpha = 0, this.app.ticker.start();
  }
  dispose() {
    this.observer.disconnect(), this.app.ticker.remove(this.onTick), this.app.destroy(!0);
  }
}
class se extends A {
  element;
  constructor() {
    const e = document.createElement("canvas");
    super(e), this.element = e, e.style.pointerEvents = "none", e.style.zIndex = "-1", e.style.contain = "strict";
  }
  getElement() {
    return this.element;
  }
  dispose() {
    super.dispose(), this.element.remove();
  }
}
const O = (c, e) => c.size === e.size && [...c].every((t) => e.has(t));
class L {
  currentPosition = 0;
  targetPosition = 0;
  currentTime = 0;
  params = {};
  currentSolver;
  getV;
  getV2;
  queueParams;
  queuePosition;
  constructor(e = 0) {
    this.targetPosition = e, this.currentPosition = this.targetPosition, this.currentSolver = () => this.targetPosition, this.getV = () => 0, this.getV2 = () => 0;
  }
  resetSolver() {
    const e = this.getV(this.currentTime);
    this.currentTime = 0, this.currentSolver = F(
      this.currentPosition,
      e,
      this.targetPosition,
      0,
      this.params
    ), this.getV = x(this.currentSolver), this.getV2 = x(this.getV);
  }
  arrived() {
    return Math.abs(this.targetPosition - this.currentPosition) < 0.01 && this.getV(this.currentTime) < 0.01 && this.getV2(this.currentTime) < 0.01 && this.queueParams === void 0 && this.queuePosition === void 0;
  }
  setPosition(e) {
    this.targetPosition = e, this.currentPosition = e, this.currentSolver = () => this.targetPosition, this.getV = () => 0, this.getV2 = () => 0;
  }
  update(e = 0) {
    this.currentTime += e, this.currentPosition = this.currentSolver(this.currentTime), this.queueParams && (this.queueParams.time -= e, this.queueParams.time <= 0 && this.updateParams({
      ...this.queueParams
    })), this.queuePosition && (this.queuePosition.time -= e, this.queuePosition.time <= 0 && this.setTargetPosition(this.queuePosition.position)), this.arrived() && this.setPosition(this.targetPosition);
  }
  updateParams(e, t = 0) {
    t > 0 ? this.queueParams = {
      ...this.queuePosition ?? {},
      ...e,
      time: t
    } : (this.queuePosition = void 0, this.params = {
      ...this.params,
      ...e
    }, this.resetSolver());
  }
  setTargetPosition(e, t = 0) {
    t > 0 ? this.queuePosition = {
      ...this.queuePosition ?? {},
      position: e,
      time: t
    } : (this.queuePosition = void 0, this.targetPosition = e, this.resetSolver());
  }
  getCurrentPosition() {
    return this.currentPosition;
  }
}
function F(c, e, t, i = 0, s) {
  const r = s?.soft ?? !1, n = s?.stiffness ?? 100, a = s?.damping ?? 10, o = s?.mass ?? 1, l = t - c;
  if (r || 1 <= a / (2 * Math.sqrt(n * o))) {
    const h = -Math.sqrt(n / o), u = -h * l - e;
    return (p) => (p -= i, p < 0 ? c : t - (l + p * u) * Math.E ** (p * h));
  } else {
    const h = Math.sqrt(
      4 * o * n - a ** 2
    ), u = (a * l - 2 * o * e) / h, p = 0.5 * h / o, f = -(0.5 * a) / o;
    return (d) => (d -= i, d < 0 ? c : t - (Math.cos(d * p) * l + Math.sin(d * p) * u) * Math.E ** (d * f));
  }
}
function $(c) {
  return (t) => (c(t + 1e-3) - c(t - 1e-3)) / (2 * 1e-3);
}
function x(c) {
  return $(c);
}
class Y {
  constructor(e) {
    this.lyricPlayer = e, this.element.setAttribute(
      "class",
      this.lyricPlayer.style.classes.lyricLine
    ), this.rebuildStyle();
  }
  element = document.createElement("div");
  left = 0;
  top = 0;
  delay = 0;
  // 由 LyricPlayer 来设置
  lineSize = [0, 0];
  lineTransforms = {
    posX: new L(0),
    posY: new L(0)
  };
  measureSize() {
    return [
      this.element.clientWidth,
      this.element.clientHeight
    ];
  }
  lastStyle = "";
  show() {
    this.rebuildStyle();
  }
  hide() {
    this.rebuildStyle();
  }
  rebuildStyle() {
    let e = `transform:translate(${this.lineTransforms.posX.getCurrentPosition().toFixed(2)}px,${this.lineTransforms.posY.getCurrentPosition().toFixed(2)}px);`;
    !this.lyricPlayer.getEnableSpring() && this.isInSight && (e += `transition-delay:${this.delay}ms;`), e !== this.lastStyle && (this.lastStyle = e, this.element.setAttribute("style", e));
  }
  getElement() {
    return this.element;
  }
  setTransform(e = this.left, t = this.top, i = !1, s = 0) {
    this.left = e, this.top = t, this.delay = s * 1e3 | 0, i || !this.lyricPlayer.getEnableSpring() ? (i && this.element.classList.add(
      this.lyricPlayer.style.classes.tmpDisableTransition
    ), this.lineTransforms.posX.setPosition(e), this.lineTransforms.posY.setPosition(t), this.lyricPlayer.getEnableSpring() ? this.rebuildStyle() : this.show(), i && requestAnimationFrame(() => {
      this.element.classList.remove(
        this.lyricPlayer.style.classes.tmpDisableTransition
      );
    })) : (this.lineTransforms.posX.setTargetPosition(e, s), this.lineTransforms.posY.setTargetPosition(t, s));
  }
  update(e = 0) {
    this.lyricPlayer.getEnableSpring() && (this.lineTransforms.posX.update(e), this.lineTransforms.posY.update(e), this.isInSight ? this.show() : this.hide());
  }
  get isInSight() {
    const e = this.lineTransforms.posX.getCurrentPosition(), t = this.lineTransforms.posY.getCurrentPosition(), i = e + this.lineSize[0], s = t + this.lineSize[1], r = this.lyricPlayer.size[0], n = this.lyricPlayer.size[1];
    return !(e > r || t > n || i < 0 || s < 0);
  }
  dispose() {
    this.element.remove();
  }
}
function _(c) {
  const t = 2.5949095;
  return c < 0.5 ? Math.pow(2 * c, 2) * ((t + 1) * 2 * c - t) / 2 : (Math.pow(2 * c - 2, 2) * ((t + 1) * (c * 2 - 2) + t) + 2) / 2;
}
const g = (c, e, t) => Math.max(c, Math.min(e, t));
class q {
  constructor(e) {
    this.lyricPlayer = e, this.element.className = this.lyricPlayer.style.classes.interludeDots, this.element.appendChild(this.dot0), this.element.appendChild(this.dot1), this.element.appendChild(this.dot2);
  }
  element = document.createElement("div");
  dot0 = document.createElement("span");
  dot1 = document.createElement("span");
  dot2 = document.createElement("span");
  left = 0;
  top = 0;
  scale = 1;
  lastStyle = "";
  currentInterlude;
  currentTime = 0;
  targetBreatheDuration = 1500;
  getElement() {
    return this.element;
  }
  setTransform(e = this.left, t = this.top) {
    this.left = e, this.top = t, this.update();
  }
  setInterlude(e) {
    this.currentInterlude = e, this.currentTime = e?.[0] ?? 0;
  }
  update(e = 0) {
    this.currentTime += e;
    let t = "";
    if (t += `transform:translate(${this.left.toFixed(
      2
    )}px, ${this.top.toFixed(2)}px)`, this.currentInterlude) {
      const i = this.currentInterlude[1] - this.currentInterlude[0], s = this.currentTime - this.currentInterlude[0];
      if (s <= i) {
        const r = i / Math.ceil(i / this.targetBreatheDuration);
        let n = 1, a = 1;
        n *= Math.sin(1.5 * Math.PI - s / r * 2) / 10 + 1, s < 1e3 && (n *= 1 - Math.pow((1e3 - s) / 1e3, 2)), s < 500 ? a = 0 : s < 1e3 && (a *= (s - 500) / 500), i - s < 750 && (n *= 1 - _(
          (750 - (i - s)) / 750 / 2
        )), i - s < 375 && (a *= g(
          0,
          (i - s) / 375,
          1
        )), n = Math.max(0, n), t += ` scale(${n})`;
        const o = g(
          0.25,
          s * 3 / i * 0.75,
          1
        ), l = g(
          0.25,
          (s - i / 3) * 3 / i * 0.75,
          1
        ), h = g(
          0.25,
          (s - i / 3 * 2) * 3 / i * 0.75,
          1
        );
        this.dot0.style.opacity = `${g(
          0,
          Math.max(0, a * o),
          1
        )}`, this.dot1.style.opacity = `${g(
          0,
          Math.max(0, a * l),
          1
        )}`, this.dot2.style.opacity = `${g(
          0,
          Math.max(0, a * h),
          1
        )}`;
      } else
        t += " scale(0)", this.dot0.style.opacity = "0", this.dot1.style.opacity = "0", this.dot2.style.opacity = "0";
    } else
      t += " scale(0)", this.dot0.style.opacity = "0", this.dot1.style.opacity = "0", this.dot2.style.opacity = "0";
    t += ";", this.lastStyle !== t && (this.element.setAttribute("style", t), this.lastStyle = t);
  }
  dispose() {
    this.element.remove();
  }
}
const R = /^[\p{Unified_Ideograph}\u0800-\u9FFC]+$/u;
function W(c, e = "rgba(0,0,0,0.85)", t = "rgba(0,0,0,0.5)") {
  const i = 2 + c, s = c / i, r = (1 - s) / 2;
  return [
    `linear-gradient(to right,${e} ${r * 100}%,${t} ${(r + s) * 100}%)`,
    s,
    i
  ];
}
function X(c, e) {
  let t = [], i = [];
  const s = [];
  for (const r of c) {
    const n = e(r);
    t.push(n), i.push(r), n.length > 0 && n.trim().length === 0 ? (t.pop(), i.pop(), i.length === 1 ? s.push(i[0]) : i.length > 1 && s.push(i), s.push(r), t = [], i = []) : (!/^\s*[^\s]*\s*$/.test(t.join("")) || R.test(n)) && (t.pop(), i.pop(), i.length === 1 ? s.push(i[0]) : i.length > 1 && s.push(i), t = [n], i = [r]);
  }
  return i.length === 1 ? s.push(i[0]) : s.push(i), s;
}
function v(c) {
  return c.endTime - c.startTime >= 1e3 && c.word.length <= 7;
}
class H extends MouseEvent {
  constructor(e, t) {
    super(t.type, t), this.line = e;
  }
}
class G extends EventTarget {
  // rome-ignore lint/correctness/noUnreachableSuper: <explanation>
  constructor(e, t = {
    words: [],
    translatedLyric: "",
    romanLyric: "",
    startTime: 0,
    endTime: 0,
    isBG: !1,
    isDuet: !1
  }) {
    super(), this.lyricPlayer = e, this.lyricLine = t, this._prevParentEl = e.getElement(), this.element.setAttribute(
      "class",
      this.lyricPlayer.style.classes.lyricLine
    ), this.lyricLine.isBG && this.element.classList.add(this.lyricPlayer.style.classes.lyricBgLine), this.lyricLine.isDuet && this.element.classList.add(this.lyricPlayer.style.classes.lyricDuetLine), this.element.appendChild(document.createElement("div")), this.element.appendChild(document.createElement("div")), this.element.appendChild(document.createElement("div"));
    const i = this.element.children[0], s = this.element.children[1], r = this.element.children[2];
    i.setAttribute("class", this.lyricPlayer.style.classes.lyricMainLine), s.setAttribute("class", this.lyricPlayer.style.classes.lyricSubLine), r.setAttribute("class", this.lyricPlayer.style.classes.lyricSubLine), this.rebuildElement(), this.rebuildStyle();
  }
  element = document.createElement("div");
  left = 0;
  top = 0;
  scale = 1;
  blur = 0;
  delay = 0;
  splittedWords = [];
  // 由 LyricPlayer 来设置
  lineSize = [0, 0];
  lineTransforms = {
    posX: new L(0),
    posY: new L(0),
    scale: new L(1)
  };
  listenersMap = /* @__PURE__ */ new Map();
  onMouseEvent = (e) => {
    const t = new H(this, e);
    for (const i of this.listenersMap.get(e.type) ?? [])
      i.call(this, t);
    if (!this.dispatchEvent(t) || t.defaultPrevented)
      return e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation(), !1;
  };
  addMouseEventListener(e, t, i) {
    if (t) {
      const s = this.listenersMap.get(e) ?? /* @__PURE__ */ new Set();
      s.size === 0 && this.element.addEventListener(e, this.onMouseEvent), s.add(t), this.listenersMap.set(e, s);
    }
  }
  removeMouseEventListener(e, t, i) {
    if (t) {
      const s = this.listenersMap.get(e);
      s && (s.delete(t), s.size === 0 && this.element.removeEventListener(e, this.onMouseEvent));
    }
  }
  isEnabled = !1;
  enable() {
    this.isEnabled = !0, this.element.classList.add("active");
    const e = this.element.children[0];
    this.splittedWords.forEach((t) => {
      t.elementAnimations.forEach((i) => {
        i.currentTime = 0, i.playbackRate = 1, i.play();
      });
    }), e.classList.add("active");
  }
  measureSize() {
    this._hide && (this._prevParentEl && this._prevParentEl.appendChild(this.element), this.element.style.display = "", this.element.style.visibility = "hidden");
    const e = [
      this.element.clientWidth,
      this.element.clientHeight
    ];
    return this._hide && (this._prevParentEl && this.element.remove(), this.element.style.display = "none", this.element.style.visibility = ""), e;
  }
  disable() {
    this.isEnabled = !1, this.element.classList.remove("active");
    const e = this.element.children[0];
    this.splittedWords.forEach((t) => {
      t.elementAnimations.forEach((i) => {
        i.id === "float-word" && (i.playbackRate = -1, i.play());
      });
    }), e.classList.remove("active");
  }
  setLine(e) {
    this.lyricLine = e, this.lyricLine.isBG ? this.element.classList.add(this.lyricPlayer.style.classes.lyricBgLine) : this.element.classList.remove(this.lyricPlayer.style.classes.lyricBgLine), this.lyricLine.isDuet ? this.element.classList.add(this.lyricPlayer.style.classes.lyricDuetLine) : this.element.classList.remove(
      this.lyricPlayer.style.classes.lyricDuetLine
    ), this.rebuildElement(), this.rebuildStyle();
  }
  getLine() {
    return this.lyricLine;
  }
  _hide = !0;
  _prevParentEl = null;
  lastStyle = "";
  show() {
    this._hide = !1, this._prevParentEl && (this._prevParentEl.appendChild(this.element), this._prevParentEl = null), this.rebuildStyle();
  }
  hide() {
    this._hide = !0, this.element.parentElement && (this._prevParentEl = this.element.parentElement, this.element.remove()), this.rebuildStyle();
  }
  rebuildStyle() {
    if (this._hide) {
      this.lastStyle !== "display:none;transform:translate(0,-10000px);" && (this.lastStyle = "display:none;transform:translate(0,-10000px);", this.element.setAttribute(
        "style",
        "display:none;transform:translate(0,-10000px);"
      ));
      return;
    }
    let e = `transform:translate(${this.lineTransforms.posX.getCurrentPosition().toFixed(2)}px,${this.lineTransforms.posY.getCurrentPosition().toFixed(2)}px) scale(${this.lineTransforms.scale.getCurrentPosition().toFixed(4)});`;
    !this.lyricPlayer.getEnableSpring() && this.isInSight && (e += `transition-delay:${this.delay}ms;`), e += `filter:blur(${Math.min(32, this.blur)}px);`, e !== this.lastStyle && (this.lastStyle = e, this.element.setAttribute("style", e));
  }
  rebuildElement() {
    const e = this.element.children[0], t = this.element.children[1], i = this.element.children[2];
    if (this.lyricPlayer._getIsNonDynamic()) {
      e.innerText = this.lyricLine.words.map((r) => r.word).join(""), t.innerText = this.lyricLine.translatedLyric, i.innerText = this.lyricLine.romanLyric;
      return;
    }
    const s = X(this.lyricLine.words, (r) => r.word);
    e.innerHTML = "", this.splittedWords = [];
    for (const r of s)
      if (r instanceof Array) {
        const n = r.map((l) => v(l)).reduce((l, h) => l || h, !1), a = r.reduce(
          (l, h) => (l.endTime = Math.max(l.endTime, h.endTime), l.startTime = Math.min(l.startTime, h.startTime), l.word += h.word, l),
          { word: "", startTime: 1 / 0, endTime: -1 / 0 }
        ), o = document.createElement("span");
        for (const l of r) {
          const h = document.createElement("span"), u = this.initFloatAnimation(
            a,
            h
          );
          if (n) {
            h.classList.add("emphasize");
            const p = [];
            for (const d of l.word.trim().split("")) {
              const m = document.createElement("span");
              m.innerText = d, p.push(m), h.appendChild(m);
            }
            const f = {
              ...l,
              mainElement: h,
              subElements: p,
              elementAnimations: [u],
              width: 0,
              height: 0,
              shouldEmphasize: n
            };
            f.elementAnimations.push(
              ...this.initEmphasizeAnimation(f)
            ), this.splittedWords.push(f);
          } else
            h.innerText = l.word, this.splittedWords.push({
              ...l,
              mainElement: h,
              subElements: [],
              elementAnimations: [u],
              width: 0,
              height: 0,
              shouldEmphasize: n
            });
          o.appendChild(h);
        }
        a.word.trimStart() !== a.word && e.appendChild(document.createTextNode(" ")), e.appendChild(o), a.word.trimEnd() !== a.word && e.appendChild(document.createTextNode(" "));
      } else if (r.word.trim().length === 0)
        e.appendChild(document.createTextNode(" "));
      else {
        const n = v(r), a = document.createElement("span"), o = {
          ...r,
          mainElement: a,
          subElements: [],
          elementAnimations: [this.initFloatAnimation(r, a)],
          width: 0,
          height: 0,
          shouldEmphasize: n
        };
        if (n) {
          a.classList.add("emphasize");
          const l = [];
          for (const h of r.word.trim().split("")) {
            const u = document.createElement("span");
            u.innerText = h, l.push(u), a.appendChild(u);
          }
          o.subElements = l, o.elementAnimations.push(
            ...this.initEmphasizeAnimation(o)
          );
        } else
          a.innerText = r.word.trim();
        r.word.trimStart() !== r.word && e.appendChild(document.createTextNode(" ")), e.appendChild(a), r.word.trimEnd() !== r.word && e.appendChild(document.createTextNode(" ")), this.splittedWords.push(o);
      }
    t.innerText = this.lyricLine.translatedLyric, i.innerText = this.lyricLine.romanLyric;
  }
  initFloatAnimation(e, t) {
    const i = e.startTime - this.lyricLine.startTime, s = Math.max(1e3, e.endTime - e.startTime), r = t.animate(
      [
        {
          transform: "translateY(0px)"
        },
        {
          transform: "translateY(-3%)"
        }
      ],
      {
        duration: isFinite(s) ? s : 0,
        delay: isFinite(i) ? i : 0,
        id: "float-word",
        composite: "add",
        fill: "both"
      }
    );
    return r.pause(), r;
  }
  initEmphasizeAnimation(e) {
    const t = e.startTime - this.lyricLine.startTime, i = e.endTime - e.startTime;
    return e.subElements.map((s, r, n) => {
      const a = Math.max(1e3, e.endTime - e.startTime), o = t + i / n.length * r, l = s.animate(
        [
          {
            offset: 0,
            transform: "translate3d(0, 0, 0px)",
            filter: "drop-shadow(0 0 0 var(--amll-lyric-view-color,white))"
          },
          {
            offset: 0.5,
            transform: "translate3d(0, -0.02em, 20px)",
            filter: "drop-shadow(0 0 0.05em var(--amll-lyric-view-color,white))"
          },
          {
            offset: 1,
            transform: "translate3d(0, 0, 0)",
            filter: "drop-shadow(0 0 0 var(--amll-lyric-view-color,white))"
          }
        ],
        {
          duration: isFinite(a) ? a : 0,
          delay: isFinite(o) ? o : 0,
          id: "glow-word",
          iterations: 1,
          composite: "replace",
          easing: "ease-in-out",
          fill: "both"
        }
      );
      return l.pause(), l;
    });
  }
  updateMaskImage() {
    this._hide && (this._prevParentEl && this._prevParentEl.appendChild(this.element), this.element.style.display = "", this.element.style.visibility = "hidden"), this.splittedWords.forEach((e) => {
      const t = e.mainElement;
      if (t) {
        e.width = t.clientWidth, e.height = t.clientHeight;
        const i = e.height / 2, [s, r, n] = W(
          i / e.width,
          "rgba(0,0,0,0.85)",
          "rgba(0,0,0,0.25)"
        ), a = `${n * 100}% 100%`;
        this.lyricPlayer.supportMaskImage ? (t.style.maskImage = s, t.style.maskRepeat = "no-repeat", t.style.maskOrigin = "left", t.style.maskSize = a) : (t.style.webkitMaskImage = s, t.style.webkitMaskRepeat = "no-repeat", t.style.webkitMaskOrigin = "left", t.style.webkitMaskSize = a);
        const o = e.width + i, l = `clamp(${-o}px,calc(${-o}px + (var(--amll-player-time) - ${e.startTime})*${o / Math.abs(e.endTime - e.startTime)}px),0px) 0px, left top`;
        t.style.maskPosition = l, t.style.webkitMaskPosition = l;
      }
    }), this._hide && (this._prevParentEl && this.element.remove(), this.element.style.display = "none", this.element.style.visibility = "");
  }
  getElement() {
    return this.element;
  }
  setTransform(e = this.left, t = this.top, i = this.scale, s = 1, r = 0, n = !1, a = 0) {
    const o = this.isInSight, l = this.lyricPlayer.getEnableSpring();
    this.left = e, this.top = t, this.scale = i, this.delay = a * 1e3 | 0;
    const h = this.element.children[0], u = this.element.children[1], p = this.element.children[2];
    if (h.style.opacity = `${s}`, u.style.opacity = `${s / 2}`, p.style.opacity = `${s / 2}`, n || !l) {
      if (this.blur = Math.min(32, r), n && this.element.classList.add(
        this.lyricPlayer.style.classes.tmpDisableTransition
      ), this.lineTransforms.posX.setPosition(e), this.lineTransforms.posY.setPosition(t), this.lineTransforms.scale.setPosition(i), l)
        this.rebuildStyle();
      else {
        const f = this.isInSight;
        o || f ? this.show() : this.hide();
      }
      n && requestAnimationFrame(() => {
        this.element.classList.remove(
          this.lyricPlayer.style.classes.tmpDisableTransition
        );
      });
    } else
      this.lineTransforms.posX.setTargetPosition(e, a), this.lineTransforms.posY.setTargetPosition(t, a), this.lineTransforms.scale.setTargetPosition(i), this.blur !== Math.min(32, r) && (this.blur = Math.min(32, r), this.element.style.filter = `blur(${Math.min(32, r)}px)`);
  }
  update(e = 0) {
    this.lyricPlayer.getEnableSpring() && (this.lineTransforms.posX.update(e), this.lineTransforms.posY.update(e), this.lineTransforms.scale.update(e), this.isInSight ? this.show() : this.hide());
  }
  _getDebugTargetPos() {
    return `[位移: ${this.left}, ${this.top}; 缩放: ${this.scale}; 延时: ${this.delay}]`;
  }
  get isInSight() {
    const e = this.lineTransforms.posX.getCurrentPosition(), t = this.lineTransforms.posY.getCurrentPosition(), i = e + this.lineSize[0], s = t + this.lineSize[1], r = this.lyricPlayer.size[0], n = this.lyricPlayer.size[1];
    return !(e > r || i < 0 || t > n || s < 0);
  }
  dispose() {
    this.element.remove();
  }
}
const V = I(k());
class N extends MouseEvent {
  constructor(e, t, i) {
    super(`line-${i.type}`, i), this.lineIndex = e, this.line = t;
  }
}
class ne extends EventTarget {
  element = document.createElement("div");
  currentTime = 0;
  lyricLines = [];
  processedLines = [];
  lyricLinesEl = [];
  lyricLinesSize = /* @__PURE__ */ new WeakMap();
  lyricLinesIndexes = /* @__PURE__ */ new WeakMap();
  hotLines = /* @__PURE__ */ new Set();
  bufferedLines = /* @__PURE__ */ new Set();
  scrollToIndex = 0;
  allowScroll = !0;
  scrolledHandler = 0;
  isScrolled = !1;
  invokedByScrollEvent = !1;
  scrollOffset = 0;
  hidePassedLines = !1;
  resizeObserver = new ResizeObserver((e) => {
    const t = e[0].contentRect;
    this.size[0] = t.width, this.size[1] = t.height;
    const i = getComputedStyle(e[0].target), s = this.element.clientWidth - parseFloat(i.paddingLeft) - parseFloat(i.paddingRight), r = this.element.clientHeight - parseFloat(i.paddingTop) - parseFloat(i.paddingBottom);
    this.innerSize[0] = s, this.innerSize[1] = r, this.rebuildStyle(), this.calcLayout(!0, !0), this.lyricLinesEl.forEach((n) => n.updateMaskImage());
  });
  posXSpringParams = {
    mass: 1,
    damping: 10,
    stiffness: 100
  };
  posYSpringParams = {
    mass: 1,
    damping: 15,
    stiffness: 100
  };
  scaleSpringParams = {
    mass: 1,
    damping: 20,
    stiffness: 100
  };
  emUnit = Math.max(Math.min(innerHeight * 0.05, innerWidth * 0.1), 12);
  padding = this.emUnit;
  enableBlur = !0;
  enableScale = !0;
  interludeDots;
  interludeDotsSize = [0, 0];
  bottomLine;
  supportPlusLighter = CSS.supports("mix-blend-mode", "plus-lighter");
  supportMaskImage = CSS.supports("mask-image", "none");
  disableSpring = !1;
  alignAnchor = "center";
  alignPosition = 0.5;
  isNonDynamic = !1;
  scrollBoundary = [0, 0];
  size = [0, 0];
  innerSize = [0, 0];
  onLineClickedHandler = (e) => {
    const t = new N(
      this.lyricLinesIndexes.get(e.line) ?? -1,
      e.line,
      e
    );
    this.dispatchEvent(t) || (e.preventDefault(), e.stopPropagation(), e.stopImmediatePropagation());
  };
  _getIsNonDynamic() {
    return this.isNonDynamic;
  }
  /**
   * 设置是否使用物理弹簧算法实现歌词动画效果，默认启用
   *
   * 如果启用，则会通过弹簧算法实时处理歌词位置，但是需要性能足够强劲的电脑方可流畅运行
   *
   * 如果不启用，则会回退到基于 `transition` 的过渡效果，对低性能的机器比较友好，但是效果会比较单一
   */
  setEnableSpring(e = !0) {
    this.disableSpring = !e, e ? this.element.classList.remove(this.style.classes.disableSpring) : this.element.classList.add(this.style.classes.disableSpring), this.calcLayout(!0);
  }
  /**
   * 获取当前是否启用了物理弹簧
   * @returns 是否启用物理弹簧
   */
  getEnableSpring() {
    return !this.disableSpring;
  }
  /**
   * 是否启用歌词行缩放效果，默认启用
   *
   * 如果启用，非选中的歌词行会轻微缩小以凸显当前播放歌词行效果
   *
   * 此效果对性能影响微乎其微，推荐启用
   * @param enable 是否启用歌词行缩放效果
   */
  setEnableScale(e = !0) {
    this.enableScale = e, this.calcLayout();
  }
  /**
   * 获取当前是否启用了歌词行缩放效果
   * @returns 是否启用歌词行缩放效果
   */
  getEnableScale() {
    return this.enableScale;
  }
  style = V.createStyleSheet({
    lyricPlayer: {
      userSelect: "none",
      fontSize: "var(--amll-lyric-player-font-size,max(min(5vh, 10vw), 12px))",
      padding: "1em",
      margin: "-1em",
      width: "100%",
      height: "100%",
      overflow: "hidden",
      boxSizing: "content-box",
      maxWidth: "100%",
      maxHeight: "100%",
      zIndex: 1,
      color: "var(--amll-lyric-view-color,white)",
      mixBlendMode: "plus-lighter",
      contain: "strict",
      "&:hover": {
        "& $lyricLine": {
          filter: "unset !important"
        }
      }
    },
    lyricLine: {
      position: "absolute",
      transformOrigin: "left",
      width: "var(--amll-lyric-player-width,100%)",
      height: "fit-content",
      padding: "2vh 1.05em",
      margin: "0 -1em",
      contain: "content",
      willChange: "filter,transform,opacity",
      transition: "filter 0.25s, background-color 0.25s, box-shadow 0.25s",
      boxSizing: "content-box",
      borderRadius: "8px",
      "&:hover": {
        backgroundColor: "var(--amll-lyric-view-hover-bg-color,#fff1)",
        boxShadow: "0 0 0 8px var(--amll-lyric-view-hover-bg-color,#fff1)"
      },
      "&:active": {
        boxShadow: "0 0 0 4px var(--amll-lyric-view-hover-bg-color,#fff1)"
      }
    },
    "@media (max-width: 1024px)": {
      lyricLine: {
        padding: "1vh 1em"
      }
    },
    lyricDuetLine: {
      textAlign: "right",
      transformOrigin: "right"
    },
    lyricBgLine: {
      opacity: 0,
      fontSize: "max(50%, 10px)",
      transition: "opacity 0.25s",
      "&.active": {
        transition: "opacity 0.25s 0.25s",
        opacity: 0.75
      }
    },
    lyricMainLine: {
      transition: "opacity 0.3s 0.25s",
      willChange: "opacity",
      margin: "-1em",
      padding: "1em",
      "& span": {
        display: "inline-block"
      },
      "& > span": {
        whiteSpace: "pre-wrap",
        maxLines: "1",
        // willChange: "transform,display,mask-image",
        "&.emphasize": {
          transformStyle: "preserve-3d",
          perspective: "50vw",
          padding: "1em",
          margin: "-1em"
        }
      }
    },
    lyricSubLine: {
      fontSize: "max(0.5em, 10px)",
      transition: "opacity 0.3s 0.25s",
      opacity: 0.5
    },
    disableSpring: {
      "& > *": {
        transition: "filter 0.25s, transform 0.5s, background-color 0.25s, box-shadow 0.25s"
      }
    },
    interludeDots: {
      height: "clamp(0.5em,1vh,3em)",
      transformOrigin: "center",
      width: "fit-content",
      padding: "2.5% 0",
      position: "absolute",
      display: "flex",
      gap: "0.25em",
      left: "1em",
      "& > *": {
        height: "clamp(0.5em,1vh,3em)",
        display: "inline-block",
        borderRadius: "50%",
        aspectRatio: "1 / 1",
        backgroundColor: "var(--amll-lyric-view-color,white)",
        marginRight: "4px"
      },
      "&.duet": {
        right: "1em",
        transformOrigin: "center"
      }
    },
    "@supports (mix-blend-mode: plus-lighter)": {
      lyricSubLine: {
        opacity: 0.3
      }
    },
    tmpDisableTransition: {
      transition: "none !important"
    }
  });
  onPageShow = () => {
    this.calcLayout(!0, !0);
  };
  constructor() {
    super(), this.interludeDots = new q(this), this.bottomLine = new Y(this), this.element.setAttribute("class", this.style.classes.lyricPlayer), this.disableSpring && this.element.classList.add(this.style.classes.disableSpring), this.rebuildStyle(), this.resizeObserver.observe(this.element), this.element.appendChild(this.interludeDots.getElement()), this.element.appendChild(this.bottomLine.getElement()), this.style.attach(), this.interludeDots.setTransform(0, 200), window.addEventListener("pageshow", this.onPageShow);
    let e = 0, t = "none", i = 0, s = 0, r = 0, n = Symbol("amll-scroll"), a = 0, o = 0;
    this.element.addEventListener("touchstart", (l) => {
      this.beginScrollHandler() && (l.preventDefault(), e = this.scrollOffset, i = l.touches[0].screenY, a = i, s = Date.now(), r = 0);
    }), this.element.addEventListener("touchmove", (l) => {
      if (this.beginScrollHandler()) {
        l.preventDefault();
        const h = l.touches[0].screenY, u = h - i, p = h - a, f = p > 0 ? "down" : p < 0 ? "up" : "none";
        t !== f ? (t = f, e = this.scrollOffset, i = h, s = Date.now()) : this.scrollOffset = e - u, a = h, o = Date.now(), this.limitScrollOffset(), this.calcLayout(!0);
      }
    }), this.element.addEventListener("touchend", (l) => {
      if (this.beginScrollHandler()) {
        l.preventDefault(), i = 0;
        const h = Date.now();
        if (h - o > 100)
          return this.endScrollHandler();
        const u = h - s;
        r = (this.scrollOffset - e) / u * 1e3;
        let p = 0;
        const f = Symbol("amll-scroll");
        n = f;
        const d = (m) => {
          p ||= m, n === f && this.beginScrollHandler() && (this.scrollOffset += r * (m - p) / 1e3, r *= 0.99, this.limitScrollOffset(), this.calcLayout(!0), Math.abs(r) > 1 && !this.scrollBoundary.includes(this.scrollOffset) && requestAnimationFrame(d), this.endScrollHandler(), p = m);
        };
        requestAnimationFrame(d), this.endScrollHandler();
      }
    }), this.element.addEventListener("wheel", (l) => {
      this.beginScrollHandler() && (l.deltaMode === l.DOM_DELTA_PIXEL ? (this.scrollOffset += l.deltaY, this.limitScrollOffset(), this.calcLayout(!0)) : (this.scrollOffset += l.deltaY * 50, this.limitScrollOffset(), this.calcLayout(!1)), this.endScrollHandler());
    });
  }
  beginScrollHandler() {
    const e = this.allowScroll;
    return e && (this.isScrolled = !0, this.invokedByScrollEvent = !0, clearTimeout(this.scrolledHandler), this.scrolledHandler = setTimeout(() => {
      this.isScrolled = !1, this.scrollOffset = 0;
    }, 5e3)), e;
  }
  endScrollHandler() {
    this.invokedByScrollEvent = !1;
  }
  limitScrollOffset() {
    this.scrollOffset = Math.max(
      Math.min(this.scrollBoundary[1], this.scrollOffset),
      this.scrollBoundary[0]
    );
  }
  /**
   * 获取当前播放时间里是否处于间奏区间
   * 如果是则会返回单位为毫秒的始末时间
   * 否则返回 undefined
   *
   * 这个只允许内部调用
   * @returns [开始时间,结束时间,大概处于的歌词行ID,下一句是否为对唱歌词] 或 undefined 如果不处于间奏区间
   */
  getCurrentInterlude() {
    if (this.bufferedLines.size > 0)
      return;
    const e = this.currentTime + 20, t = this.scrollToIndex;
    if (t === 0) {
      if (this.processedLines[0]?.startTime && this.processedLines[0].startTime > e)
        return [
          e,
          this.processedLines[0].startTime,
          -2,
          this.processedLines[0].isDuet
        ];
    } else if (this.processedLines[t]?.endTime && this.processedLines[t + 1]?.startTime && this.processedLines[t + 1].startTime > e && this.processedLines[t].endTime < e)
      return [
        Math.max(this.processedLines[t].endTime, e),
        this.processedLines[t + 1].startTime,
        t,
        this.processedLines[t + 1].isDuet
      ];
  }
  /**
   * 重建样式
   *
   * 这个只允许内部调用
   */
  rebuildStyle() {
    let e = "";
    e += "--amll-lyric-player-width:", e += this.innerSize[0] - this.padding * 2, e += "px;", e += "--amll-lyric-player-height:", e += this.innerSize[1] - this.padding * 2, e += "px;", this.element.setAttribute("style", e);
  }
  /**
   * 设置是否隐藏已经播放过的歌词行，默认不隐藏
   * @param hide 是否隐藏已经播放过的歌词行，默认不隐藏
   */
  setHidePassedLines(e) {
    this.hidePassedLines = e, this.calcLayout();
  }
  /**
   * 设置是否启用歌词行的模糊效果
   * @param enable 是否启用
   */
  setEnableBlur(e) {
    this.enableBlur !== e && (this.enableBlur = e, this.calcLayout());
  }
  /**
   * 设置当前播放歌词，要注意传入后这个数组内的信息不得修改，否则会发生错误
   * @param lines 歌词数组
   */
  setLyricLines(e) {
    this.lyricLines = e;
    const t = 750;
    this.processedLines = e.filter(
      (i) => i.words.reduce((s, r) => s + r.word.trim().length, 0) > 0
    ).map((i, s, r) => {
      if (i.isBG)
        return {
          ...i
        };
      if (s === 0)
        return {
          ...i,
          startTime: Math.max(i.startTime - t, 0)
        };
      {
        const n = r[s - 1], a = r[s - 2];
        if (n?.isBG && a) {
          if (a.endTime < i.startTime)
            return {
              ...i,
              startTime: Math.max(a.endTime, i.startTime - t) || i.startTime
            };
        } else if (n?.endTime && n.endTime < i.startTime)
          return {
            ...i,
            startTime: Math.max(n?.endTime, i.startTime - t) || i.startTime
          };
        return {
          ...i
        };
      }
    }), this.isNonDynamic = !0;
    for (const i of this.processedLines)
      if (i.words.length > 1) {
        this.isNonDynamic = !1;
        break;
      }
    this.processedLines.forEach((i, s, r) => {
      const n = r[s + 1], a = i.words[i.words.length - 1];
      a && v(a) && (n ? n.startTime > i.endTime && (i.endTime = Math.min(i.endTime + 1500, n.startTime)) : i.endTime = i.endTime + 1500);
    }), this.processedLines.forEach((i, s, r) => {
      if (i.isBG)
        return;
      const n = r[s + 1];
      n?.isBG && (n.startTime = Math.min(n.startTime, i.startTime));
    }), this.lyricLinesEl.forEach((i) => {
      i.removeMouseEventListener("click", this.onLineClickedHandler), i.removeMouseEventListener("contextmenu", this.onLineClickedHandler), i.dispose();
    }), this.lyricLinesEl = this.processedLines.map((i) => {
      const s = new G(this, i);
      return s.addMouseEventListener("click", this.onLineClickedHandler), s.addMouseEventListener("contextmenu", this.onLineClickedHandler), s;
    }), this.lyricLinesEl.forEach((i, s) => {
      this.element.appendChild(i.getElement()), this.lyricLinesIndexes.set(i, s), i.updateMaskImage();
    }), this.interludeDots.setInterlude(void 0), this.hotLines.clear(), this.bufferedLines.clear(), this.setLinePosXSpringParams({}), this.setLinePosYSpringParams({}), this.setLineScaleSpringParams({}), this.setCurrentTime(0, !0), this.calcLayout(!0, !0);
  }
  /**
   * 重置用户滚动状态
   *
   * 请在用户完成滚动点击跳转歌词时调用本事件再调用 `calcLayout` 以正确滚动到目标位置
   */
  resetScroll() {
    this.isScrolled = !1, this.scrollOffset = 0, this.invokedByScrollEvent = !1, clearTimeout(this.scrolledHandler), this.scrolledHandler = 0;
  }
  /**
   * 重新布局定位歌词行的位置，调用完成后再逐帧调用 `update`
   * 函数即可让歌词通过动画移动到目标位置。
   *
   * 函数有一个 `force` 参数，用于指定是否强制修改布局，也就是不经过动画直接调整元素位置和大小。
   *
   * 此函数还有一个 `reflow` 参数，用于指定是否需要重新计算布局
   *
   * 因为计算布局必定会导致浏览器重排布局，所以会大幅度影响流畅度和性能，故请只在以下情况下将其​设置为 true：
   *
   * 1. 歌词页面大小发生改变时（这个组件会自行处理）
   * 2. 加载了新的歌词时（不论前后歌词是否完全一样）
   * 3. 用户自行跳转了歌曲播放位置（不论距离远近）
   *
   * @param force 是否不经过动画直接修改布局定位
   * @param reflow 是否进行重新布局（重新计算每行歌词大小）
   */
  calcLayout(e = !1, t = !1) {
    t && (this.emUnit = parseFloat(getComputedStyle(this.element).fontSize), this.lyricLinesEl.forEach((d) => {
      const m = d.measureSize();
      this.lyricLinesSize.set(d, m), d.lineSize = m;
    }), this.interludeDotsSize[0] = this.interludeDots.getElement().clientWidth, this.interludeDotsSize[1] = this.interludeDots.getElement().clientHeight, this.bottomLine.lineSize = this.bottomLine.measureSize());
    const i = this.getCurrentInterlude();
    let s = -this.scrollOffset, r = this.scrollToIndex, n = 0;
    i ? (n = i[1] - i[0], n >= 5e3 && this.lyricLinesEl[i[2] + 1] && (r = i[2] + 1)) : this.interludeDots.setInterlude(void 0);
    const a = this.enableScale ? 0.95 : 1, o = this.lyricLinesEl.slice(0, r).reduce(
      (d, m) => d + (m.getLine().isBG ? 0 : this.lyricLinesSize.get(m)?.[1] ?? 0),
      0
    );
    this.scrollBoundary[0] = -o, s -= o, s += this.size[1] * this.alignPosition;
    const l = this.lyricLinesEl[r];
    if (l) {
      const d = this.lyricLinesSize.get(l)?.[1] ?? 0;
      switch (this.alignAnchor) {
        case "bottom":
          s -= d;
          break;
        case "center":
          s -= d / 2;
          break;
      }
    }
    const h = Math.max(...this.bufferedLines);
    let u = 0, p = 0.05, f = !1;
    this.lyricLinesEl.forEach((d, m) => {
      const T = this.bufferedLines.has(m), w = T || m >= this.scrollToIndex && m < h, E = d.getLine();
      E.isDuet && this.size[0] - (this.lyricLinesSize.get(d)?.[0] ?? 0), !f && n >= 5e3 && (m === this.scrollToIndex && i?.[2] === -2 || m === this.scrollToIndex + 1) && (f = !0, this.interludeDots.setTransform(this.padding, s), i && this.interludeDots.setInterlude([i[0], i[1]]), s += this.interludeDotsSize[1]);
      const M = this.hidePassedLines && m < (i ? i[2] + 1 : this.scrollToIndex) ? 0 : T ? 1 : 1 / 3;
      d.setTransform(
        this.padding,
        s,
        w ? 1 : a,
        M,
        !this.invokedByScrollEvent && this.enableBlur ? w ? 0 : 1 + (m < this.scrollToIndex ? Math.abs(this.scrollToIndex - m) : Math.abs(m - Math.max(this.scrollToIndex, h))) : 0,
        e,
        u
      ), E.isBG && w ? s += this.lyricLinesSize.get(d)?.[1] ?? 0 : E.isBG || (s += this.lyricLinesSize.get(d)?.[1] ?? 0), s >= 0 && (u += p, p /= 1.2);
    }), this.scrollBoundary[1] = s + this.scrollOffset - this.size[1] / 2, this.bottomLine.setTransform(this.padding, s, e, u);
  }
  /**
   * 获取当前歌词的播放位置
   *
   * 一般和最后调用 `setCurrentTime` 给予的参数一样
   * @returns 当前播放位置
   */
  getCurrentTime() {
    return this.currentTime;
  }
  /**
   * 获取当前歌词数组
   *
   * 一般和最后调用 `setLyricLines` 给予的参数一样
   * @returns 当前歌词数组
   */
  getLyricLines() {
    return this.lyricLines;
  }
  getElement() {
    return this.element;
  }
  /**
   * 获取一个特殊的底栏元素，默认是空白的，可以往内部添加任意元素
   *
   * 这个元素始终在歌词的底部，可以用于显示歌曲创作者等信息
   *
   * 但是请勿删除该元素，只能在内部存放元素
   *
   * @returns 一个元素，可以往内部添加任意元素
   */
  getBottomLineElement() {
    return this.bottomLine.getElement();
  }
  /**
   * 设置目标歌词行的对齐方式，默认为 `center`
   *
   * - 设置成 `top` 的话将会向目标歌词行的顶部对齐
   * - 设置成 `bottom` 的话将会向目标歌词行的底部对齐
   * - 设置成 `center` 的话将会向目标歌词行的垂直中心对齐
   * @param alignAnchor 歌词行对齐方式，详情见函数说明
   */
  setAlignAnchor(e) {
    this.alignAnchor = e;
  }
  /**
   * 设置默认的歌词行对齐位置，相对于整个歌词播放组件的大小位置，默认为 `0.5`
   * @param alignPosition 一个 `[0.0-1.0]` 之间的任意数字，代表组件高度由上到下的比例位置
   */
  setAlignPosition(e) {
    this.alignPosition = e;
  }
  /**
   * 设置当前播放进度，单位为毫秒且**必须是整数**，此时将会更新内部的歌词进度信息
   * 内部会根据调用间隔和播放进度自动决定如何滚动和显示歌词，所以这个的调用频率越快越准确越好
   *
   * 调用完成后，可以每帧调用 `update` 函数来执行歌词动画效果
   * @param time 当前播放进度，单位为毫秒
   */
  setCurrentTime(e, t = !1) {
    if (this.currentTime = e, this._getIsNonDynamic() || this.element.style.setProperty("--amll-player-time", `${e}`), this.isScrolled)
      return;
    const i = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Set(), r = /* @__PURE__ */ new Set();
    this.hotLines.forEach((n) => {
      const a = this.processedLines[n];
      if (a) {
        if (a.isBG)
          return;
        const o = this.processedLines[n + 1];
        if (o?.isBG) {
          const l = Math.min(a.startTime, o?.startTime), h = Math.max(a.endTime, o?.endTime);
          (l > e || h <= e) && (this.hotLines.delete(n), i.add(n), this.hotLines.delete(n + 1), i.add(n + 1), t && (this.lyricLinesEl[n].disable(), this.lyricLinesEl[n + 1].disable()));
        } else
          (a.startTime > e || a.endTime <= e) && (this.hotLines.delete(n), i.add(n), t && this.lyricLinesEl[n].disable());
      } else
        this.hotLines.delete(n), i.add(n), t && this.lyricLinesEl[n].disable();
    }), this.processedLines.forEach((n, a, o) => {
      !n.isBG && n.startTime <= e && n.endTime > e && (this.hotLines.has(a) || (this.hotLines.add(a), r.add(a), t && this.lyricLinesEl[a].enable(), o[a + 1]?.isBG && (this.hotLines.add(a + 1), r.add(a + 1), t && this.lyricLinesEl[a + 1].enable())));
    }), this.bufferedLines.forEach((n) => {
      this.hotLines.has(n) || (s.add(n), t && this.lyricLinesEl[n].disable());
    }), t ? (this.bufferedLines.size > 0 ? this.scrollToIndex = Math.min(...this.bufferedLines) : this.scrollToIndex = this.processedLines.findIndex(
      (n) => n.startTime >= e
    ), this.bufferedLines.clear(), this.hotLines.forEach((n) => this.bufferedLines.add(n)), this.calcLayout(!0)) : (s.size > 0 || r.size > 0) && (s.size === 0 && r.size > 0 ? (r.forEach((n) => {
      this.bufferedLines.add(n), this.lyricLinesEl[n].enable();
    }), this.scrollToIndex = Math.min(...this.bufferedLines), this.calcLayout()) : r.size === 0 && s.size > 0 ? O(s, this.bufferedLines) && (this.bufferedLines.forEach((n) => {
      this.hotLines.has(n) || (this.bufferedLines.delete(n), this.lyricLinesEl[n].disable());
    }), this.calcLayout()) : (r.forEach((n) => {
      this.bufferedLines.add(n), this.lyricLinesEl[n].enable();
    }), s.forEach((n) => {
      this.bufferedLines.delete(n), this.lyricLinesEl[n].disable();
    }), this.bufferedLines.size > 0 && (this.scrollToIndex = Math.min(...this.bufferedLines)), this.calcLayout()));
  }
  /**
   * 更新动画，这个函数应该被逐帧调用或者在以下情况下调用一次：
   *
   * 1. 刚刚调用完设置歌词函数的时候
   * @param delta 距离上一次被调用到现在的时长，单位为毫秒（可为浮点数）
   */
  update(e = 0) {
    const t = e / 1e3;
    this.interludeDots.update(e), this.bottomLine.update(t), this.lyricLinesEl.forEach((i) => i.update(t));
  }
  /**
   * 设置所有歌词行在横坐标上的弹簧属性，包括重量、弹力和阻力。
   *
   * @param params 需要设置的弹簧属性，提供的属性将会覆盖原来的属性，未提供的属性将会保持原样
   */
  setLinePosXSpringParams(e) {
    this.posXSpringParams = {
      ...this.posXSpringParams,
      ...e
    }, this.bottomLine.lineTransforms.posX.updateParams(this.posXSpringParams), this.lyricLinesEl.forEach(
      (t) => t.lineTransforms.posX.updateParams(this.posXSpringParams)
    );
  }
  /**
   * 设置所有歌词行在​纵坐标上的弹簧属性，包括重量、弹力和阻力。
   *
   * @param params 需要设置的弹簧属性，提供的属性将会覆盖原来的属性，未提供的属性将会保持原样
   */
  setLinePosYSpringParams(e) {
    this.posYSpringParams = {
      ...this.posYSpringParams,
      ...e
    }, this.bottomLine.lineTransforms.posY.updateParams(this.posYSpringParams), this.lyricLinesEl.forEach(
      (t) => t.lineTransforms.posY.updateParams(this.posYSpringParams)
    );
  }
  /**
   * 设置所有歌词行在​缩放大小上的弹簧属性，包括重量、弹力和阻力。
   *
   * @param params 需要设置的弹簧属性，提供的属性将会覆盖原来的属性，未提供的属性将会保持原样
   */
  setLineScaleSpringParams(e) {
    this.scaleSpringParams = {
      ...this.scaleSpringParams,
      ...e
    }, this.lyricLinesEl.forEach(
      (t) => t.lineTransforms.scale.updateParams(this.scaleSpringParams)
    );
  }
  dispose() {
    this.element.remove(), this.resizeObserver.disconnect(), this.style.detach(), this.lyricLinesEl.forEach((e) => e.dispose()), window.removeEventListener("pageshow", this.onPageShow), this.bottomLine.dispose(), this.interludeDots.dispose();
  }
}
export {
  se as BackgroundRender,
  ne as LyricPlayer
};
//# sourceMappingURL=amll-core.mjs.map
