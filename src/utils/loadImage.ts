import { Context } from "hono";

export async function loadImage(c: Context, imagePath: string): Promise<string | null> {
  try {
    // If it's already a data URL, return it as is
    if (imagePath.startsWith("data:")) {
      return imagePath;
    }

    if (!c.env?.ASSETS) {
      throw new Error("ASSETS binding is not configured");
    }
    const isExternalPath = imagePath.startsWith("https://") || imagePath.startsWith("http://");
    const imageUrl = new URL(imagePath, c.req.url).toString();
    let imageData = isExternalPath ? await fetch(imageUrl) : await c.env.ASSETS.fetch(imageUrl);

    // Get content-type from response
    const contentType = imageData.headers.get("content-type") || "image/png";

    const arrayBuffer = await imageData.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");
    return `data:${contentType};base64,${base64Image}`;
  } catch (error) {
    console.warn(`Failed to load image ${imagePath}:`, error);
    return null;
  }
}
