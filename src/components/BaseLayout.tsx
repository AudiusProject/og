import { ReactNode } from "react";

interface BaseLayoutProps {
  children: ReactNode;
  backgroundImage?: string;
  backgroundColor?: string;
}

export const BaseLayout = ({ children, backgroundImage, backgroundColor = "#FFF" }: BaseLayoutProps) => {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        backgroundColor,
      }}
    >
      {backgroundImage && (
        <img
          src={backgroundImage}
          alt="Background"
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
      <div
        style={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
      >
        {children}
      </div>
    </div>
  );
};
