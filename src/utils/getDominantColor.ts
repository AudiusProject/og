import { Vibrant } from "node-vibrant/node";
import { fetchImageWithFallback } from "./fetchImageWithFallback";

export const DEFAULT_DOMINANT_COLOR = "rgb(126,27,204)";

/**
 * Get the dominant color from an image URL with mirror fallback support.
 * @param imageUrl - The primary image URL
 * @param mirrors - Optional array of mirror hostnames to try if primary fails
 * @returns RGB color string
 */
export async function getDominantColor(imageUrl: string | undefined, mirrors?: string[]): Promise<string> {
  if (!imageUrl) return DEFAULT_DOMINANT_COLOR;

  try {
    // Try to fetch a working URL with mirror fallback
    const workingUrl = await fetchImageWithFallback(imageUrl, mirrors);
    if (!workingUrl) return DEFAULT_DOMINANT_COLOR;

    const palette = await Vibrant.from(workingUrl).getPalette();
    // Prefer Vibrant swatch, fallback to Muted, then default
    const swatch = palette.Vibrant || palette.Muted;
    if (!swatch) return DEFAULT_DOMINANT_COLOR;
    const [r, g, b] = swatch.rgb.map(Math.round);
    return `rgb(${r},${g},${b})`;
  } catch (e) {
    console.log("error", e);
    return DEFAULT_DOMINANT_COLOR;
  }
}
