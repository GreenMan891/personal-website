import type { GameObjects } from "phaser";
import { type Colour, type PowerUp } from "../constants";
import type { Board } from "./board";
import { Vector2D } from "./vector2d";
export declare class Triangle {
    board: Board;
    colour?: Colour;
    powerup?: PowerUp;
    twoxImage?: GameObjects.Image;
    bombImage?: GameObjects.Image;
    wildImage?: GameObjects.Sprite;
    wildAnimationMask?: Phaser.Display.Masks.GeometryMask;
    pos: Vector2D;
    constructor(board: Board, x: number, y: number, colour?: Colour, powerup?: PowerUp, twoxImage?: GameObjects.Image, bombImage?: GameObjects.Image, wildImage?: GameObjects.Sprite);
    _flipped?: boolean;
    flipped(): boolean;
    getMappedCorners(): {
        point: Vector2D;
        left: Vector2D;
        right: Vector2D;
    };
}
//# sourceMappingURL=triangle.d.ts.map