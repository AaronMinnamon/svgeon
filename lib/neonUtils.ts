"use client";

import type { NeonOptions, FlickerSpeed } from "@/store/svgStore";

// Lightens a hex color toward white — produces the glass tube color
function lightenColor(hex: string, amount = 0.55): string {
  const clamp = (v: number) => Math.min(255, Math.max(0, Math.round(v)));
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return (
    "#" +
    clamp(r + (255 - r) * amount).toString(16).padStart(2, "0") +
    clamp(g + (255 - g) * amount).toString(16).padStart(2, "0") +
    clamp(b + (255 - b) * amount).toString(16).padStart(2, "0")
  );
}

// Your exact CodePen flicker keyframes
const FLICKER_KEYFRAMES = `@keyframes neon-flicker {
  from  { opacity: 1; }
  4%    { opacity: .9; }
  6%    { opacity: .85; }
  8%    { opacity: .95; }
  10%   { opacity: .90; }
  11%   { opacity: .922; }
  12%   { opacity: .9; }
  14%   { opacity: .95; }
  16%   { opacity: .98; }
  17%   { opacity: .9; }
  19%   { opacity: .93; }
  20%   { opacity: .99; }
  24%   { opacity: 1; }
  26%   { opacity: .94; }
  28%   { opacity: .98; }
  37%   { opacity: .93; }
  38%   { opacity: .5; }
  39%   { opacity: .96; }
  42%   { opacity: 1; }
  44%   { opacity: .97; }
  46%   { opacity: .94; }
  56%   { opacity: .9; }
  58%   { opacity: .9; }
  60%   { opacity: .99; }
  68%   { opacity: 1; }
  70%   { opacity: .9; }
  72%   { opacity: .95; }
  93%   { opacity: .93; }
  95%   { opacity: .95; }
  97%   { opacity: .93; }
  to    { opacity: 1; }
}`;

const FLICKER_DURATIONS: Record<FlickerSpeed, string> = {
  none:   "0s",
  slow:   "4s",
  medium: "2s",
  fast:   "0.8s",
};

export function applyNeonEffect(tracedSvg: string, options: NeonOptions): string {
  const { color, glowIntensity, strokeWidth, flickerSpeed } = options;
  const tubeColor = lightenColor(color);

  const parser = new DOMParser();
  const doc = parser.parseFromString(tracedSvg, "image/svg+xml");
  const original = doc.documentElement;

  const viewBox = original.getAttribute("viewBox") || "0 0 800 800";
  const preserveAR = original.getAttribute("preserveAspectRatio") || "xMidYMid meet";
  const vb = viewBox.trim().split(/[\s,]+/).map(Number);
  const [vx, vy, vw, vh] = vb.length === 4 ? vb : [0, 0, 800, 800];

  const ns = "http://www.w3.org/2000/svg";
  const newDoc = parser.parseFromString(`<svg xmlns="${ns}"></svg>`, "image/svg+xml");
  const svg = newDoc.documentElement;
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("width", String(vw));
  svg.setAttribute("height", String(vh));
  svg.setAttribute("preserveAspectRatio", preserveAR);

  // Defs: two filters + animation
  const duration = FLICKER_DURATIONS[flickerSpeed];
  const animRule = flickerSpeed !== "none"
    ? `.neon-sign { animation: neon-flicker ${duration} linear infinite; }`
    : "";

  const defs = newDoc.createElementNS(ns, "defs");
  defs.innerHTML = `
    <filter id="static_blur" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
      <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" />
    </filter>
    <filter id="neon_glow" x="-50%" y="-50%" width="200%" height="200%" filterUnits="userSpaceOnUse">
      <feGaussianBlur in="SourceGraphic" stdDeviation="${glowIntensity}" />
    </filter>
    <style>${FLICKER_KEYFRAMES}\n${animRule}</style>`;
  svg.appendChild(defs);

  // Dark background
  const bg = newDoc.createElementNS(ns, "rect");
  bg.setAttribute("x", String(vx));
  bg.setAttribute("y", String(vy));
  bg.setAttribute("width", String(vw));
  bg.setAttribute("height", String(vh));
  bg.setAttribute("fill", "#050510");
  svg.appendChild(bg);

  // Flicker wrapper
  const sign = newDoc.createElementNS(ns, "g");
  sign.setAttribute("class", "neon-sign");
  svg.appendChild(sign);

  // Glow layer — vivid color, larger blur = colored light emanating outward
  const glowLayer = newDoc.createElementNS(ns, "g");
  glowLayer.setAttribute("filter", "url(#neon_glow)");
  glowLayer.setAttribute("fill", "none");
  glowLayer.setAttribute("stroke", color);
  glowLayer.setAttribute("stroke-width", String(strokeWidth + 1));

  // Static layer — lightened color, tiny blur = the glass tube itself
  const staticLayer = newDoc.createElementNS(ns, "g");
  staticLayer.setAttribute("filter", "url(#static_blur)");
  staticLayer.setAttribute("fill", "none");
  staticLayer.setAttribute("stroke", tubeColor);
  staticLayer.setAttribute("stroke-width", String(strokeWidth));

  // Clone paths into each layer — potrace outputs filled paths, convert to strokes
  function cloneAsStrokes(target: Element) {
    original.querySelectorAll("path, circle, ellipse, rect, polygon, polyline, line").forEach((el) => {
      const clone = newDoc.importNode(el, true) as Element;
      clone.setAttribute("fill", "none");
      clone.removeAttribute("stroke"); // inherit from parent group
      target.appendChild(clone);
    });
  }

  cloneAsStrokes(glowLayer);
  cloneAsStrokes(staticLayer);

  sign.appendChild(glowLayer);
  sign.appendChild(staticLayer);

  return new XMLSerializer().serializeToString(svg);
}
