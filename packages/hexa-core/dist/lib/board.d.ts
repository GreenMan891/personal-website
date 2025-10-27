import type { GameObjects } from "phaser";
import { type Colour, type PowerUp } from "../constants";
import { Triangle } from "./triangle";
import { Vector2D } from "./vector2d";
export type Hexagon = Triangle[];
export declare class Board {
    graphics: GameObjects.Graphics;
    width: number;
    height: number;
    lineWidths: number[];
    center: Vector2D;
    scale: Vector2D;
    cursor: Vector2D;
    cursorImage: GameObjects.Image;
    twoXGroup: GameObjects.Image[];
    bombGroup: GameObjects.Image[];
    wildGroup: GameObjects.Sprite[];
    colourQueue: Colour[];
    powerupQueue: PowerUp[];
    triangles: (Triangle | undefined)[][];
    time: Phaser.Time.Clock;
    scoringHexa: boolean;
    constructor(graphics: GameObjects.Graphics, cursorImage: GameObjects.Image, twoXGroup: GameObjects.Image[], bombGroup: GameObjects.Image[], wildGroup: GameObjects.Sprite[], lineWidths: number[], x: number, y: number, time: Phaser.Time.Clock, colourQueue?: Colour[], powerupQueue?: PowerUp[]);
    checkCursorPos(x: number, y: number): boolean;
    getHexagon(x: number, y: number): Triangle[];
    checkHexa(callback: (hexas: number, hexagon: Triangle[]) => void, combo?: number, internal?: boolean): void;
    explode(): void;
    rotate(clockwise: boolean): void;
    create(): void;
    draw(): void;
    drawTriangles(): void;
    drawCursor(): void;
    drawOutline(thickness?: number): void;
}
//# sourceMappingURL=board.d.ts.map