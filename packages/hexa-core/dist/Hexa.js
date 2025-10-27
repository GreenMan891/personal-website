"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { forwardRef, useEffect, useLayoutEffect, useRef } from "react";
import { GAME_CONTAINER_ID } from "./constants";
import { EventBus } from "./EventBus";
import { externalApi } from "./externalApi";
import { StartGame } from "./main";
export const Hexa = forwardRef((props, ref) => {
    const game = useRef(null);
    const localContainerRef = useRef(null);
    useLayoutEffect(() => {
        if (game.current === null && localContainerRef.current) {
            game.current = StartGame(localContainerRef.current, props.initialWidth, props.initialHeight, props.assetPrefix);
            if (typeof ref === "function") {
                ref({ game: game.current, scene: null });
            }
            else if (ref) {
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
        EventBus.on("current-scene-ready", (scene_instance) => {
            if (props.onSceneChange && typeof props.onSceneChange === "function") {
                props.onSceneChange(scene_instance);
            }
            if (typeof ref === "function") {
                ref({ game: game.current, scene: scene_instance });
            }
            else if (ref) {
                ref.current = { game: game.current, scene: scene_instance };
            }
        });
        return () => {
            EventBus.removeListener("current-scene-ready");
        };
    }, [props, ref]);
    return (_jsx("div", { ref: localContainerRef, id: GAME_CONTAINER_ID, className: "w-full h-full" }));
});
Hexa.displayName = "Hexa";
