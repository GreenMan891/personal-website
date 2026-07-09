import React, { useEffect, useMemo, useRef } from "react";
import type { FC } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { useVolume } from "./VolumeContext";

type UnityGameProps = {
  buildPath?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  onReady?: () => void;
};

const UnityGame: FC<UnityGameProps> = ({
  buildPath = "/unity/WebBuild",
  width = "100%",
  height = 600,
  className,
  onReady,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { volumeMultiplier } = useVolume();
  const gainNodeRef = useRef<GainNode | null>(null);

  const loaderUrl = useMemo(() => `${buildPath}/Build/WebBuild.loader.js`, [buildPath]);
  const dataUrl = useMemo(() => `${buildPath}/Build/WebBuild.data.unityweb`, [buildPath]);
  const frameworkUrl = useMemo(() => `${buildPath}/Build/WebBuild.framework.js.unityweb`, [buildPath]);
  const codeUrl = useMemo(() => `${buildPath}/Build/WebBuild.wasm.unityweb`, [buildPath]);

  const { unityProvider, isLoaded, loadingProgression, unload } = useUnityContext({
    loaderUrl,
    dataUrl,
    frameworkUrl,
    codeUrl,
  });

  useEffect(() => {
    if (isLoaded && typeof onReady === "function") onReady();
  }, [isLoaded, onReady]);

  // Monkey-patch AudioContext to intercept Unity's audio with a master gain node.
  // This runs once on mount (before Unity creates its AudioContext) and
  // redirects all connect(destination) calls through our gain node.
  useEffect(() => {
    const win = window as any;
    if (win.__unityVolumePatchApplied) return;
    win.__unityVolumePatchApplied = true;

    const OrigAudioContext = win.AudioContext || win.webkitAudioContext;
    if (!OrigAudioContext) return;

    const origPrototypeConnect = AudioNode.prototype.connect;

    win.AudioContext = function (...args: any[]) {
      const ctx = new OrigAudioContext(...args);
      const masterGain = ctx.createGain();
      masterGain.gain.value = volumeMultiplier;
      origPrototypeConnect.call(masterGain, ctx.destination);

      gainNodeRef.current = masterGain;

      // Store the real destination and our gain on the context
      (ctx as any).__realDestination = ctx.destination;
      (ctx as any).__masterGain = masterGain;

      // Override the destination property to return our gain node
      Object.defineProperty(ctx, 'destination', {
        get() {
          return masterGain;
        }
      });

      return ctx;
    };
    win.AudioContext.prototype = OrigAudioContext.prototype;

    if (win.webkitAudioContext) {
      win.webkitAudioContext = win.AudioContext;
    }

    return () => {
      // Restore on unmount
      win.AudioContext = OrigAudioContext;
      if (win.webkitAudioContext) {
        win.webkitAudioContext = OrigAudioContext;
      }
      win.__unityVolumePatchApplied = false;
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Update gain when volume changes
  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volumeMultiplier;
    }
  }, [volumeMultiplier]);

  const findCanvas = () => {
    const root = containerRef.current;
    let canvas: HTMLCanvasElement | null = null;
    if (root) canvas = root.querySelector("canvas");
    if (!canvas) canvas = document.querySelector("canvas");
    return canvas;
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const onPointerDown = (e: PointerEvent) => {
      const canvas = findCanvas();
      if (!canvas) return;
      if (!canvas.hasAttribute("tabindex")) canvas.setAttribute("tabindex", "0");
      requestAnimationFrame(() => {
        try {
          (canvas as HTMLElement).focus({ preventScroll: true } as FocusOptions);
        } catch {
          (canvas as HTMLElement).focus();
        }
      });
    };

    root.addEventListener("pointerdown", onPointerDown, { passive: true });
    root.addEventListener("click", onPointerDown, { passive: true });

    return () => {
      root.removeEventListener("pointerdown", onPointerDown);
      root.removeEventListener("click", onPointerDown);
    };
  }, []);

  useEffect(() => {
    const onUnhandledRejection = (ev: PromiseRejectionEvent) => {
      try { ev.preventDefault(); } catch {}
      console.groupCollapsed("DEBUG: caught unhandledrejection (Unity/loader)");
      console.log("PromiseRejectionEvent:", ev);
      console.log("reason:", ev.reason);
      if (ev.reason && (ev.reason as any).stack) console.error((ev.reason as any).stack);
      else console.trace("Trace where unhandledrejection was caught");
      console.groupEnd();
    };

    const onError = (ev: ErrorEvent) => {
      try { ev.preventDefault(); } catch {}
      console.groupCollapsed("DEBUG: caught window.error (Unity/loader)");
      console.error("ErrorEvent:", ev);
      if (ev.error && (ev.error as any).stack) console.error((ev.error as any).stack);
      else console.trace("Trace where window.error was caught");
      console.groupEnd();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Space" || e.key === " ") {
        const root = containerRef.current;
        const active = document.activeElement;
        const activeIsInside = root ? root.contains(active) : false;

        if (!activeIsInside) {
          e.preventDefault();
          e.stopImmediatePropagation();
        }
      }
    };

    window.addEventListener("unhandledrejection", onUnhandledRejection);
    window.addEventListener("error", onError);
    window.addEventListener("keydown", onKeyDown, true);

    return () => {
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      window.removeEventListener("error", onError);
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, []);

  useEffect(() => {
    return () => {
      const safeUnload = async () => {
        try {
          const r = unload && (unload as any)();
          if (r && typeof r.then === "function") await r;
        } catch (err) {
          console.warn("Unity unload() threw: ", err);
        }
      };
      safeUnload();
    };
  }, [unload]);

  return (
    <div className={className} style={{ width }} ref={containerRef}>
      <div style={{ width, height }}>
        <Unity unityProvider={unityProvider} style={{ width: "100%", height: "100%", outline: "none" }} />
      </div>

      {!isLoaded && <div aria-hidden style={{ marginTop: 8 }}>Loading Unity: {(loadingProgression * 100).toFixed(0)}%</div>}
    </div>
  );
};

export default UnityGame;