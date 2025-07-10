import { Vibrant } from "node-vibrant/node";

export const DEFAULT_DOMINANT_COLOR = "rgb(126,27,204)";

export async function getDominantColor(imageUrl: string): Promise<string> {
  try {
    const palette = await Vibrant.from(imageUrl).getPalette();
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
