import React from "react";

interface ContentTagProps {
  text: string;
  size?: "small" | "medium" | "large";
  variant?: "light" | "dark";
}

export const ContentTag = ({ text, size = "medium", variant = "light" }: ContentTagProps) => {
  const sizeStyles = {
    small: {
      fontSize: "16px",
      padding: "6px",
      letterSpacing: "2px",
    },
    medium: {
      fontSize: "22px",
      padding: "8px",
      letterSpacing: "4px",
    },
    large: {
      fontSize: "28px",
      padding: "10px",
      letterSpacing: "6px",
    },
  };

  const style = sizeStyles[size];

  const background = variant === "dark" ? "#A3A0B4" : "#fff";
  const color = variant === "dark" ? "#fff" : "#000";

  return (
    <div
      style={{
        background,
        borderRadius: "8px",
        padding: style.padding,
        fontWeight: 800,
        fontSize: style.fontSize,
        letterSpacing: style.letterSpacing,
        textTransform: "uppercase",
        color,
        fontFamily: "Avenir Next LT Pro",
      }}
    >
      {text}
    </div>
  );
};
