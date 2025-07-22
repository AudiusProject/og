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
        boxShadow:
          size >= 598
            ? "0px 100px 80px rgba(0,0,0,0.07), 0px 41.78px 33.42px rgba(0,0,0,0.05), 0px 22.34px 17.87px rgba(0,0,0,0.04), 0px 12.52px 10.02px rgba(0,0,0,0.035), 0px 6.65px 5.32px rgba(0,0,0,0.028), 0px 2.77px 2.21px rgba(0,0,0,0.02)"
            : "none",
        position: "relative",
        overflow: "hidden",
        border: size >= 598 ? `2px solid ${borderColor}` : `1px solid ${borderColor}`,
        borderRadius: size >= 598 ? "24px" : "10px",
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
