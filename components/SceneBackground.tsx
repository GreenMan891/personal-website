import React, { CSSProperties } from "react";
import styles from "./SceneBackground.module.css";

type Props = {
  tileSize?: number;
  color?: string;
  borderRadius?: number | string;
  duration?: number;
  layerOpacity?: number;
};

function makeSvgDataUrl(tileSize: number, fill: string, radius: number | string) {
  const rx = typeof radius === "number" ? `${radius}` : radius;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${tileSize}' height='${tileSize}' viewBox='0 0 ${tileSize} ${tileSize}'>
    <rect x='${Math.round(tileSize * 0.08)}' y='${Math.round(tileSize * 0.08)}' width='${Math.round(
    tileSize * 0.84
  )}' height='${Math.round(tileSize * 0.84)}' rx='${rx}' ry='${rx}' fill='${fill}'/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const SceneBackground: React.FC<Props> = ({
  tileSize = 100,
  color = "rgba(255,255,255,0.18)",
  borderRadius = 8,
  duration = 18,
  layerOpacity = 1,
}) => {
  const dataUrl = makeSvgDataUrl(tileSize, color, borderRadius);
  const layerStyle: CSSProperties = {
    backgroundImage: `url("${dataUrl}")`,
    backgroundRepeat: "repeat",
    backgroundSize: `${tileSize}px ${tileSize}px`,
    ["--tile-size" as any]: `${tileSize}px`,
    ["--anim-duration" as any]: `${duration}s`,
    ["--layer-opacity" as any]: String(layerOpacity),
  };

  return (
    <div className={styles.backgroundWrapper} aria-hidden>
      <div className={styles.gridLayerStatic} style={layerStyle} />
      <div className={styles.gridLayerMoving} style={layerStyle} />
    </div>
  );
};

export default SceneBackground;