import React from "react";
import styles from "./ImageOverlay.module.css";

type Props = {
  src?: string;
  alt?: string;
  pointerEvents?: "none" | "auto";
};

export default function ImageOverlay({
  src,
  alt = "",
  pointerEvents = "none",
}: Props) {
  if (!src) {
    return null;
  }

  return (
    <div className={styles.overlayWrap} aria-hidden={pointerEvents === "none"}>
      <img className={styles.overlayImg} src={src} alt={alt} />
    </div>
  );
}