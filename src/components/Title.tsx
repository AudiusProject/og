import { sanitizeText } from "../utils/sanitizeText";

interface TitleProps {
  children: string;
  shadow?: boolean;
  style?: React.CSSProperties;
}

export function Title({ children, shadow = false, style = {} }: TitleProps) {
  const sanitizedTitle = sanitizeText(children);

  return (
    <div
      style={{
        display: "flex",
        width: "490px",
        fontWeight: 800,
        fontSize: "40px",
        lineHeight: "49px",
        color: "#fff",
        fontFamily: "Avenir Next LT Pro",
        overflow: "hidden",
        marginBottom: "24px",
        maxHeight: "147px", // 3 * 49px lineHeight
        textShadow: shadow ? "0 4px 4px rgba(0, 0, 0, 0.10)" : "none",
        ...style,
      }}
    >
      {sanitizedTitle}
    </div>
  );
}
