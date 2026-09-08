import { blendWithWhite } from "../utils/blendWithWhite";

const BORDER_WIDTH = 2;

interface ArtworkCollageProps {
  /**
   * Up to four artwork URLs, in display order: top-left, top-right,
   * bottom-left, bottom-right. Fewer than four are padded with `fallback`.
   */
  srcs: string[];
  fallback: string;
  size?: number;
  gap?: number;
  dominantColor?: string;
  style?: React.CSSProperties;
}

/**
 * A 2x2 grid of artwork in the same frame `Artwork` uses, for surfaces that
 * have no single cover image of their own (a generated mix, a lineup). A
 * single image is not special-cased into a full-bleed square: the grid is
 * the visual signature of "this is a set of tracks", and a one-track set is
 * still a set.
 */
export function ArtworkCollage({
  srcs,
  fallback,
  size = 598,
  gap = 4,
  dominantColor,
  style = {},
}: ArtworkCollageProps) {
  const borderColor = dominantColor ? blendWithWhite(dominantColor.replace("#", ""), 0.1) : "#FFF";
  const cells = [0, 1, 2, 3].map((i) => srcs[i] ?? fallback);
  // Satori lays out border-box, so the border comes out of the inner width.
  // A cell sized from the outer width doesn't fit two per row and the grid
  // silently collapses into a single column.
  const innerSize = size - 2 * BORDER_WIDTH;
  const cellSize = (innerSize - gap) / 2;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#E7E7EA",
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        gap: `${gap}px`,
        position: "relative",
        overflow: "hidden",
        boxSizing: "border-box",
        border: `${BORDER_WIDTH}px solid ${borderColor}`,
        borderRadius: "20px",
        ...style,
      }}
    >
      {cells.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`Artwork ${i + 1}`}
          style={{
            width: `${cellSize}px`,
            height: `${cellSize}px`,
            objectFit: "cover",
          }}
        />
      ))}
    </div>
  );
}
