// blendWithWhite.ts

/**
 * Blends a hex or rgb color with white at a given opacity (0-1).
 * @param color - The base color as hex (e.g. #123456) or rgb(r,g,b)
 * @param opacity - The opacity of white to blend in (0 = no white, 1 = all white)
 * @returns The blended color as rgb(r,g,b)
 */
export function blendWithWhite(color: string, opacity = 0.1): string {
  let r: number, g: number, b: number;
  if (color.startsWith("#")) {
    color = color.replace("#", "");
    r = parseInt(color.substring(0, 2), 16);
    g = parseInt(color.substring(2, 4), 16);
    b = parseInt(color.substring(4, 6), 16);
  } else if (color.startsWith("rgb")) {
    [r, g, b] = color.match(/\d+/g)!.map(Number);
  } else {
    r = g = b = 255;
  }
  r = Math.round((1 - opacity) * r + opacity * 255);
  g = Math.round((1 - opacity) * g + opacity * 255);
  b = Math.round((1 - opacity) * b + opacity * 255);
  return `rgb(${r},${g},${b})`;
}
