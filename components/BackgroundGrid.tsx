import React from "react";


export interface Nintendo3DSBackgroundProps {
  width?: string | number; // CSS width (e.g. '400px' or '100%')
  height?: string | number; // CSS height
  rows?: number;
  cols?: number;
  /** color of the squares (defaults to a soft white) */
  squareColor?: string;
}


const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));


const Nintendo3DSBackground: React.FC<Nintendo3DSBackgroundProps> = ({
  width = "100%",
  height = 220,
  rows = 4,
  cols = 12,
  squareColor = "255,255,255",
}) => {
  const r = clamp(rows, 1, 12);
  const c = clamp(cols, 1, 32);

  const cells = Array.from({ length: r * c });

  const wrapperStyle: React.CSSProperties = {
    width,
    height,
    position: "relative",
    overflow: "hidden",
    borderRadius: 15,
    background: "linear-gradient(180deg,#eef0f3,#e9ebee)",
  };

  const css = `
.n3ds-bg{display:block}
.n3ds-bg__layer{position:absolute;inset:0;display:grid;grid-template-columns:repeat(var(--cols),1fr);gap:10px;padding:12px;box-sizing:border-box;}
.n3ds-bg__cell{position:relative}
.n3ds-bg__cell::before{content:"";display:block;padding-top:100%}
.n3ds-bg__square{position:absolute;inset:0;border-radius:15px;transform-origin:center;}


/* the individual squares are semi-transparent on each layer. When two layers line up visually their alpha adds up, producing an opaque look. */
.n3ds-bg__square { background: rgba(${squareColor},0.45); }


/* subtle soft inner shadow to feel less flat */
.n3ds-bg__square::after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 2px 6px rgba(0,0,0,0.06)}


/* two animated layers move slowly in different rhythms */
.n3ds-bg__layer--a { animation: moveA 10s ease-in-out infinite; }
.n3ds-bg__layer--b { animation: moveB 14s ease-in-out infinite; }


@keyframes moveA{
0%{ transform: translate3d(0,0,0) }
25%{ transform: translate3d(14px,-8px,0) }
50%{ transform: translate3d(0,10px,0) }
75%{ transform: translate3d(-10px,6px,0) }
100%{ transform: translate3d(0,0,0) }
}
@keyframes moveB{
0%{ transform: translate3d(0,0,0) }
20%{ transform: translate3d(-18px,12px,0) }
40%{ transform: translate3d(8px,-10px,0) }
60%{ transform: translate3d(0,6px,0) }
100%{ transform: translate3d(0,0,0) }
}


/* smaller screens: reduce gaps so layout remains consistent */
@media (max-width:420px){ .n3ds-bg__layer{gap:6px;padding:8px} }
`;



  return (
    <div style={wrapperStyle} className="n3ds-bg" aria-hidden>
      <style>{css}</style>

      <div
        className="n3ds-bg__layer n3ds-bg__layer--a"
        style={{ ['--cols' as any]: c }}
      >
        {cells.map((_, i) => (
          <div className="n3ds-bg__cell" key={"a" + i}>
            <div className="n3ds-bg__square" />
          </div>
        ))}
      </div>


      <div
        className="n3ds-bg__layer n3ds-bg__layer--b"
        style={{ ['--cols' as any]: c, mixBlendMode: 'normal' }}
      >
        {cells.map((_, i) => (
          <div className="n3ds-bg__cell" key={"b" + i}>
            <div className="n3ds-bg__square" />
          </div>
        ))}
      </div>
    </div>
  );
};


export default Nintendo3DSBackground;