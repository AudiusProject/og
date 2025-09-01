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
          width: "100%", // Use full available width instead of fixed
          fontWeight: 800,
          fontSize: "28px", // Reduced from 40px for smaller image
          lineHeight: "34px", // Reduced proportionally
          color: "#fff",
          fontFamily: "Inter",
          overflow: "hidden",
          marginBottom: "16px", // Reduced from 24px
          maxHeight: "102px", // 3 * 34px lineHeight
          textShadow: shadow ? "0 2px 2px rgba(0, 0, 0, 0.10)" : "none", // Reduced shadow
          ...style,
        }}
      >
      {sanitizedTitle}
    </div>
  );
}
