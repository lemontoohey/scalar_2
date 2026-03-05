import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLumaOpacity(hex: string, baseOpacity: number): number {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  // Perceived Luminance (Standard weighting)
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const lumaNorm = luma / 255;

  // INVERTED CURVE:
  // If dark (luma < 0.2), boost opacity by 2.5x.
  // If bright (luma > 0.8), cut opacity by 0.5x.
  // This equalizes "visual power" across the spectrum.
  const powerCurve = 1 + (1 - lumaNorm) * 1.5;

  return Math.min(baseOpacity * powerCurve, 1.0);
}

/** Hue-aware glow: boosts darkness by hue to prevent yellows/magentas blowing out. */
export function getGlowColor(hex: string, boostAmount: number = 0): string {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  const hueDeg = h * 360;
  let dynamicBoost = boostAmount;

  if (hueDeg >= 40 && hueDeg <= 70) {
    dynamicBoost *= 0.15;
  } else if (hueDeg >= 280 && hueDeg <= 330) {
    dynamicBoost *= 0.3;
  } else if (hueDeg >= 200 && hueDeg <= 260) {
    dynamicBoost *= 1.8;
  } else if (hueDeg >= 340 || hueDeg <= 20) {
    dynamicBoost *= 1.4;
  }

  l = Math.min(l + dynamicBoost + (l < 0.2 ? 0.15 : 0), 0.85);

  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  const rHex = Math.round(hue2rgb(p, q, h + 1/3) * 255).toString(16).padStart(2, '0');
  const gHex = Math.round(hue2rgb(p, q, h) * 255).toString(16).padStart(2, '0');
  const bHex = Math.round(hue2rgb(p, q, h - 1/3) * 255).toString(16).padStart(2, '0');

  return `#${rHex}${gHex}${bHex}`;
}
