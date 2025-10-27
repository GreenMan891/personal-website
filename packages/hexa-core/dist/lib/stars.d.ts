import { Scene, GameObjects } from "phaser";
export declare class Stars extends Scene {
    backgroundFar: GameObjects.TileSprite;
    farSpeed: number;
    nearSpeed: number;
    speedMultiplier: number;
    constructor();
    create(): void;
    update(_time: number, delta: number): void;
    shutdown(): void;
}
//# sourceMappingURL=stars.d.ts.map