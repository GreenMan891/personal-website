"use client";
import * as Phaser from 'phaser';
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import { GAME_CONTAINER_ID } from "./constants";
import { EventBus } from "./EventBus";
import { externalApi, type GetScoresFn, type PostScoreFn } from "./externalApi";
import { StartGame } from "./main";

export interface IRefHexa {
  game: Phaser.Game | null;
  scene: Phaser.Scene | null;
}

interface IHexaProps {
  onSceneChange?: (scene: Phaser.Scene) => void;
  assetPrefix?: string;
  initialWidth: number;
  initialHeight: number;
  getScores?: GetScoresFn;
  postScore?: PostScoreFn;
}

export const Hexa = forwardRef<IRefHexa, IHexaProps>((props, ref) => {
  const game = useRef<Phaser.Game | null>(null);
  const localContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (game.current === null && localContainerRef.current) {
      game.current = StartGame(
        localContainerRef.current,
        props.initialWidth,
        props.initialHeight,
        props.assetPrefix,
      );
      game.current.registry.set('assetPrefix', props.assetPrefix);

      if (typeof ref === "function") {
        ref({ game: game.current, scene: null });
      } else if (ref) {
        ref.current = { game: game.current, scene: null };
      }
    }

    return () => {
      if (game.current) {
        game.current.destroy(true);
        if (game.current !== null) {
          game.current = null;
        }
      }
    };
  }, [props.assetPrefix, props.initialWidth, props.initialHeight, ref]);

  useEffect(() => {
    externalApi.getScores = props.getScores;
    externalApi.postScore = props.postScore;
    return () => {
      externalApi.getScores = undefined;
      externalApi.postScore = undefined;
    };
  }, [props.getScores, props.postScore]);

  useEffect(() => {
    EventBus.on("current-scene-ready", (scene_instance: Phaser.Scene) => {
      if (props.onSceneChange && typeof props.onSceneChange === "function") {
        props.onSceneChange(scene_instance);
      }

      if (typeof ref === "function") {
        ref({ game: game.current, scene: scene_instance });
      } else if (ref) {
        ref.current = { game: game.current, scene: scene_instance };
      }
    });
    return () => {
      EventBus.removeListener("current-scene-ready");
    };
  }, [props, ref]);

  return (
    <div
      ref={localContainerRef}
      id={GAME_CONTAINER_ID}
      className="w-full h-full"
    ></div>
  );
});

Hexa.displayName = "Hexa";
