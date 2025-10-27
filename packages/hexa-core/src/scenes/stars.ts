import * as Phaser from 'phaser';
import { type GameObjects, Scene } from "phaser";
import { EventBus } from "../EventBus";

export class Stars extends Scene {
  backgroundFar!: GameObjects.TileSprite;

  farSpeed = 80;
  nearSpeed = 420;
  speedMultiplier = 1;

  constructor() {
    super("Stars");
  }

  create() {
    const w = this.scale.width;
    const h = this.scale.height;

    this.backgroundFar = this.add
      .tileSprite(0, 0, w, h, "stars")
      .setOrigin(0, 0)
      .setScrollFactor(0)
      .setDepth(-100);

    this.scale.on("resize", (gameSize: Phaser.Structs.Size) => {
      this.backgroundFar.setSize(gameSize.width, gameSize.height);
    });
  }

  update(_time: number, delta: number) {
    const dt = delta / 1000;
    this.backgroundFar.tilePositionY +=
      this.farSpeed * this.speedMultiplier * dt;
    this.backgroundFar.tilePositionX +=
      this.farSpeed * this.speedMultiplier * dt;
  }

  shutdown() {
    EventBus.off("starfield-set-multiplier");
  }
}
