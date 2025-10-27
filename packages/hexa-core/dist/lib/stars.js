import { Scene } from "phaser";
import { EventBus } from "../EventBus";
export class Stars extends Scene {
    backgroundFar;
    // speeds in pixels/second
    farSpeed = 80;
    nearSpeed = 420;
    speedMultiplier = 1;
    constructor() {
        super("Starfield");
    }
    create() {
        // full-screen tiles
        const w = this.scale.width;
        const h = this.scale.height;
        // far layer
        this.backgroundFar = this.add
            .tileSprite(0, 0, w, h, "stars")
            .setOrigin(0, 0)
            .setScrollFactor(0)
            .setDepth(-100);
        // Keep tile sprites sized on resize
        this.scale.on("resize", (gameSize) => {
            this.backgroundFar.setSize(gameSize.width, gameSize.height);
        });
    }
    update(_time, delta) {
        const dt = delta / 1000;
        this.backgroundFar.tilePositionY += this.farSpeed * this.speedMultiplier * dt;
        // particles move themselves via emitter config
    }
    // Clean up event listeners if scene ever shuts down
    shutdown() {
        EventBus.off("starfield-set-multiplier");
    }
}
