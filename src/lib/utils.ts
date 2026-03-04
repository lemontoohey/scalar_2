import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getLumaOpacity(hex: string, baseOpacity: number): number {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b // ITU-R BT.709
  const lumaNorm = luma / 255
  const adjustment = Math.max(0.25, 1.2 - lumaNorm)
  return baseOpacity * adjustment
}
