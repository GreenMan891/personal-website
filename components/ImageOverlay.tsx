import React, { CSSProperties } from "react";
import styles from "./ImageOverlay.module.css";

type Props = {
  src?: string;
  alt?: string;
  y?: number;
  scale?: number;
  pointerEvents?: "none" | "auto";
  maxWidth?: string;
};

export default function ImageOverlay({
  src,
  alt = "",
  y = 0,
  scale = 1,
  pointerEvents = "none",
  maxWidth = "80%",
}: Props) {
  if (!src) {
    return null;
  }

  const wrapperStyle: CSSProperties = {
    transform: `translate(-50%, calc(-50% + ${y}px)) scale(${scale})`,
    pointerEvents,
    maxWidth,
  };

  return (
    <div className={styles.overlayWrap} style={wrapperStyle} aria-hidden={pointerEvents === "none"}>
      <img className={styles.overlayImg} src={src} alt={alt} />
    </div>
  );
}