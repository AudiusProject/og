import React from "react";

interface ContentTagProps {
  text: string;
  size?: "small" | "medium" | "large";
  variant?: "light" | "dark";
  color?: string;
  shadow?: boolean;
}

export const ContentTag = ({ text, variant = "light", color: colorProp, shadow = false }: ContentTagProps) => {
  const background = variant === "dark" ? "#A3A0B4" : "#fff";
  const color = colorProp || (variant === "dark" ? "#fff" : "#000");

  return (
    <div
      style={{
        background,
        borderRadius: "8px",
        fontWeight: 800,
        fontSize: "22px",
        padding: "4px 8px",
        letterSpacing: "4px",
        textTransform: "uppercase",
        color,
        fontFamily: "Avenir Next LT Pro",
        boxShadow: shadow ? "0 4px 4px rgba(0, 0, 0, 0.10)" : "none",
      }}
    >
      {text}
    </div>
  );
};
