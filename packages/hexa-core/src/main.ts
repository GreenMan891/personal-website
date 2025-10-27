import * as Phaser from 'phaser';
import { AUTO, Game } from "phaser";
import { GAME_BACKGROUND_COLOR } from "./constants";
import { Boot } from "./scenes/Boot";
import { Game as MainGame } from "./scenes/Game";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";
import { Stars } from "./scenes/stars";

let assetPrefix = "";

export const asset = (path: string) => {
  return `${assetPrefix}${path}`;
};

export const StartGame = (
  parent: HTMLElement,
  width: number,
  height: number,
  newAssetPrefix?: string,
): Phaser.Game => {
  const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: width,
    height: height,
    parent: parent,
    backgroundColor: GAME_BACKGROUND_COLOR,
    scale: {
      mode: Phaser.Scale.RESIZE,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [Boot, Preloader, Stars, MainMenu, MainGame],
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200, x: 0 },
      },
    },
  };
  assetPrefix = newAssetPrefix || "";
  return new Game({ ...config, parent });
};
