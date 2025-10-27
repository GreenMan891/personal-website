import * as Phaser from 'phaser';
import { Scene } from "phaser";
import { asset } from "../main";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    this.add
      .image(window.innerWidth / 2, window.innerHeight / 3, "web_logo")
      .setScale(0.5);
  }

  preload() {
    const assetPrefix = this.registry.get('assetPrefix') || '';

    
    this.load.image("cursor", `${assetPrefix}assets/cursor.png`);
    this.load.image("2x", `${assetPrefix}assets/2xart.png`);
    this.load.image("Bomb", `${assetPrefix}assets/bomb.png`);
    this.load.spritesheet("wild-anim-sheet", `${assetPrefix}assets/wildtiles.png`, {
      frameWidth: 560,
      frameHeight: 470,
    });
    this.load.image("stars", `${assetPrefix}assets/stars.png`);
    this.load.image("mainmenulogo", `${assetPrefix}assets/mainmenulogo.png`);

    this.load.audio("flash", `${assetPrefix}assets/hexaprep.wav`);
    this.load.audio("move", `${assetPrefix}assets/move.wav`);
    this.load.audio("swap", `${assetPrefix}assets/swap2.wav`);
    this.load.audio("hexa", `${assetPrefix}assets/hexa.wav`);
    this.load.audio("select", `${assetPrefix}assets/select.wav`);
    this.load.audio("boom", `${assetPrefix}assets/boom.wav`);
    //this.load.image("web_logo", "web_logo.png");
  }

  create() {
    if (!this.scene.isActive("Stars")) {
      this.scene.launch("Stars");
    }
    this.scene.start("MainMenu");
  }
}
