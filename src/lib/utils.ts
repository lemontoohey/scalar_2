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
