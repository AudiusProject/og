import React from "react";

interface ContentTagProps {
  text: string;
  size?: "small" | "medium" | "large";
}

export const ContentTag = ({ text, size = "medium" }: ContentTagProps) => {
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

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "4px",
        padding: style.padding,
        fontWeight: 800,
        fontSize: style.fontSize,
        letterSpacing: style.letterSpacing,
        textTransform: "uppercase",
        color: "#000",
        fontFamily: "Avenir Next LT Pro",
      }}
    >
      {text}
    </div>
  );
};
