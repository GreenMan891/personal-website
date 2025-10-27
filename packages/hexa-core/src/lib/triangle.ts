import type { GameObjects } from "phaser";
import {
  BASE_TRIANGLE_HEIGHT,
  BASE_TRIANGLE_WIDTH,
  type Colour,
  type PowerUp,
} from "../constants";
import type { Board } from "./board";
import { Vector2D } from "./vector2d";

export class Triangle {
  board: Board;

  colour?: Colour;
  powerup?: PowerUp;
  twoxImage?: GameObjects.Image;
  bombImage?: GameObjects.Image;
  wildImage?: GameObjects.Sprite;
  wildAnimationMask?: Phaser.Display.Masks.GeometryMask;

  pos: Vector2D;

  constructor(
    board: Board,
    x: number,
    y: number,
    colour?: Colour,
    powerup?: PowerUp,
    twoxImage?: GameObjects.Image,
    bombImage?: GameObjects.Image,
    wildImage?: GameObjects.Sprite,
  ) {
    this.board = board;
    this.pos = new Vector2D(x, y);

    this.colour = colour;
    this.powerup = powerup;
    this.twoxImage = twoxImage;
    this.bombImage = bombImage;
    this.wildImage = wildImage;
    if (this.powerup === "2x") {
      this.twoxImage?.setVisible(true);
    }
    if (this.powerup === "Bomb") {
      this.bombImage?.setVisible(true);
    }
    if (this.powerup === "Wild") {
      this.wildImage?.setVisible(true);
    } else {
      this.wildImage?.setVisible(false);
    }
  }

  _flipped?: boolean;
  flipped() {
    if (this._flipped) return this._flipped;
    this._flipped = (this.pos.x + this.pos.y) % 2 === 0;
    return this._flipped;
  }

  getMappedCorners() {
    const mappedX = ((this.pos.x - this.board.width) * BASE_TRIANGLE_WIDTH) / 2;
    const mappedY = (this.pos.y - this.board.height / 2) * BASE_TRIANGLE_HEIGHT;

    return {
      point: new Vector2D(
        mappedX,
        this.flipped()
          ? mappedY + BASE_TRIANGLE_HEIGHT / 2
          : mappedY - BASE_TRIANGLE_HEIGHT / 2,
      ),
      left: new Vector2D(
        mappedX - BASE_TRIANGLE_WIDTH / 2,
        this.flipped()
          ? mappedY - BASE_TRIANGLE_HEIGHT / 2
          : mappedY + BASE_TRIANGLE_HEIGHT / 2,
      ),
      right: new Vector2D(
        mappedX + BASE_TRIANGLE_WIDTH / 2,
        this.flipped()
          ? mappedY - BASE_TRIANGLE_HEIGHT / 2
          : mappedY + BASE_TRIANGLE_HEIGHT / 2,
      ),
    };
  }
}
