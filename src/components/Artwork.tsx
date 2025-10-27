import { blendWithWhite } from "../utils/blendWithWhite";

interface ArtworkProps {
  src: string;
  alt?: string;
  size?: number;
  dominantColor?: string;
  style?: React.CSSProperties;
}

export function Artwork({ src, alt = "Artwork", size = 598, dominantColor, style = {} }: ArtworkProps) {
  const borderColor = dominantColor ? blendWithWhite(dominantColor.replace("#", ""), 0.1) : "#FFF";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#E7E7EA",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
        border: size >= 598 ? `2px solid ${borderColor}` : `1px solid ${borderColor}`,
        borderRadius: size >= 598 ? "20px" : "10px",
        ...style,
      }}
    >
      <img
        src={src}
        alt={alt}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "contain",
        }}
      />
    </div>
  );
}
