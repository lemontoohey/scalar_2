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

/** Spectral decomposition: converts flat pigment into thermal light map (core, corona, atmosphere). Handles invalid hex, pure black, pure white. */
export function computeSpectralLayers(hex: string): { core: string; corona: string; atmosphere: string } {
  const validHex = /^#([0-9A-F]{3}){1,2}$/i.test(hex);
  if (!hex || !validHex) return { core: '#ffffff', corona: '#ffffff', atmosphere: '#000000' };

  const expanded = hex.length === 4 ? `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}` : hex;
  let r = parseInt(expanded.slice(1, 3), 16) / 255;
  let g = parseInt(expanded.slice(3, 5), 16) / 255;
  let b = parseInt(expanded.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0,
    l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  if (l < 0.05) l = 0.05;
  if (s < 0.05) s = 0.05;

  const satAtm = Math.min(s * 1.5, 1);
  const lumAtm = Math.max(l * 0.4, 0.02);
  const satCor = s;
  const lumCor = Math.min(l * 1.2, 0.85);
  const satCore = Math.max(s * 0.2, 0);
  const lumCore = 0.94;

  const hslToHex = (hVal: number, sVal: number, lVal: number): string => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = lVal < 0.5 ? lVal * (1 + sVal) : lVal + sVal - lVal * sVal;
    const p = 2 * lVal - q;
    const toHex = (x: number) => Math.round(x * 255).toString(16).padStart(2, '0');
    return `#${toHex(hue2rgb(p, q, hVal + 1 / 3))}${toHex(hue2rgb(p, q, hVal))}${toHex(hue2rgb(p, q, hVal - 1 / 3))}`;
  };

  return {
    core: hslToHex(h, satCore, lumCore),
    corona: hslToHex(h, satCor, lumCor),
    atmosphere: hslToHex(h, satAtm, lumAtm),
  };
}
