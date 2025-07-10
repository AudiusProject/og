import React from "react";

interface ContentTagProps {
  text: string;
  size?: "small" | "medium" | "large";
  variant?: "light" | "dark";
  color?: string;
}

export const ContentTag = ({ text, variant = "light", color: colorProp }: ContentTagProps) => {
  const background = variant === "dark" ? "#A3A0B4" : "#fff";
  const color = colorProp || (variant === "dark" ? "#fff" : "#000");

  return (
    <div
      style={{
        background,
        borderRadius: "8px",
        fontWeight: 800,
        fontSize: "22px",
        padding: "8px",
        letterSpacing: "4px",
        textTransform: "uppercase",
        color,
        fontFamily: "Avenir Next LT Pro",
      }}
    >
      {text}
    </div>
  );
};
