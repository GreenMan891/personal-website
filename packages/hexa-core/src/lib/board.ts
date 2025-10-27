import type { GameObjects } from "phaser";
import {
  BASE_TRIANGLE_HEIGHT,
  BASE_TRIANGLE_WIDTH,
  type Colour,
  colourMap,
  INNER_LINE_COLOR,
  INNER_LINE_WIDTH,
  type PowerUp,
} from "../constants";
import { Triangle } from "./triangle";
import { Vector2D } from "./vector2d";

class TriangleNotFoundError extends Error {
  constructor(x: number, y: number) {
    super(`Triangle not found at ${x}, ${y}`);
  }
}

export type Hexagon = Triangle[];

export class Board {
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
  scoringHexa: boolean = false;

  constructor(
    graphics: GameObjects.Graphics,
    cursorImage: GameObjects.Image,
    twoXGroup: GameObjects.Image[],
    bombGroup: GameObjects.Image[],
    wildGroup: GameObjects.Sprite[],
    lineWidths: number[],
    x: number,
    y: number,
    time: Phaser.Time.Clock,
    colourQueue?: Colour[],
    powerupQueue?: PowerUp[],
  ) {
    this.graphics = graphics;

    this.lineWidths = lineWidths;
    this.height = lineWidths.length;
    this.width = Math.max(...lineWidths);
    this.center = new Vector2D(x, y);
    this.scale = new Vector2D(1, 1);

    this.triangles = [];
    this.colourQueue = colourQueue ?? [];
    this.powerupQueue = powerupQueue ?? [];
    console.log(this.powerupQueue);

    this.cursor = new Vector2D(
      Math.floor(this.width / 2),
      Math.floor(this.height / 2),
    );

    this.cursorImage = cursorImage;
    this.twoXGroup = twoXGroup;
    this.bombGroup = bombGroup;
    this.wildGroup = wildGroup;
    this.time = time;

    this.create();
  }

  checkCursorPos(x: number, y: number) {
    if (y < 0 || y >= this.height) return false;
    const row = this.lineWidths[y];
    if (!row) return false;
    const offset = (this.width - row) / 2 - 1 + (y % 2);
    if (x < offset || x >= offset + row) return false;
    return true;
  }

  getHexagon(x: number, y: number) {
    const topLeftX = x * 2 + ((y + 1) % 2);
    const topLeftY = y;

    const deltas = [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
      [2, 0],
      [1, 0],
    ];

    return deltas.map(([dx, dy]) => {
      if (dx === undefined || dy === undefined)
        throw new Error("Should never happen");
      const newX = topLeftX + dx;
      const newY = topLeftY + dy;
      if (typeof this.triangles[newY] === "undefined")
        throw new TriangleNotFoundError(newX, newY);
      const triangle = this.triangles[newY][newX];
      if (typeof triangle === "undefined")
        throw new TriangleNotFoundError(newX, newY);
      return triangle;
    });
  }

  checkHexa(
    callback: (hexas: number, hexagon: Triangle[]) => void,
    combo: number = 0,
    internal = false,
  ) {
    if (this.scoringHexa && !internal) return;
    const deltas = [
      [0, 0],
      [-1, 0],
      [1, 0],
      [0, -1],
      [-1, -1],
      [1, -1],
      [0, 1],
      [-1, 1],
      [1, 1],
    ];

    let hexas = 0;
    const hexagons: Hexagon[] = [];
    deltas.forEach(([dx, dy]) => {
      if (typeof dx === "undefined" || typeof dy === "undefined")
        throw new Error("Should never happen");
      try {
        const hexagon = this.getHexagon(this.cursor.x + dx, this.cursor.y + dy);
        const firstNonWild = hexagon.find((t) => t.powerup !== "Wild");
        if (firstNonWild) {
          const targetColour = firstNonWild.colour;
          const isMatch = hexagon.every((triangle) => {
            return (
              triangle.colour === targetColour || triangle.powerup === "Wild"
            );
          });
          if (isMatch) {
            hexas += 1;
            hexagons.push(hexagon);
          }
        }
      } catch (e: unknown) {
        if (e instanceof TriangleNotFoundError) {
          return;
        }
        throw e;
      }
    });

    if (hexas === 0) {
      if (internal) {
        this.scoringHexa = false;
      }
      return;
    }

    if (hexas > 0) {
      if (!this.scoringHexa) {
        this.scoringHexa = true;
      }
      const scene = this.graphics.scene as Phaser.Scene;
      const flashDuration = 100;

      const processHexagonAt = (index: number, currentCombo: number) => {
        if (index >= hexagons.length) {
          scene.time.delayedCall(10, () => {
            this.checkHexa(callback, currentCombo, true);
          });
          return;
        }

        const hexagon = hexagons[index];
        if (!hexagon) throw new Error("should never happen");

        const flashColours = hexagon.map((triangle) => {
          const mapped =
            typeof triangle.colour !== "undefined"
              ? colourMap[triangle.colour]
              : 0x000000;
          return mapped === 0xffffff ? 0x888888 : 0xffffff;
        });

        const pitch = 1.0 + currentCombo * 0.1;

        const doSingleFlash = (onComplete: () => void) => {
          hexagon.forEach((triangle, idx) => {
            (triangle as any).flashColour = flashColours[idx];
          });

          try {
            scene.sound.play("flash", { rate: pitch });
          } catch (e) {
            console.error("Sound play failed:", e);
          }

          scene.time.delayedCall(flashDuration, () => {
            hexagon.forEach((triangle) => {
              delete (triangle as any).flashColour;
            });
            onComplete();
          });
        };
        doSingleFlash(() => {
          scene.time.delayedCall(flashDuration, () => {
            doSingleFlash(() => {
              scene.time.delayedCall(flashDuration, () => {
                try {
                  callback(hexas, hexagon);
                } catch (e) {
                  console.error(e);
                }
                hexagon.forEach((triangle) => {
                  triangle.colour = this.colourQueue.shift() as Colour;
                  triangle.powerup = this.powerupQueue.shift() as PowerUp;
                  triangle.twoxImage?.setVisible(triangle.powerup === "2x");
                  triangle.bombImage?.setVisible(triangle.powerup === "Bomb");
                  triangle.wildImage?.setVisible(triangle.powerup === "Wild");
                });
                scene.time.delayedCall(30, () => {
                  processHexagonAt(index + 1, currentCombo + 1);
                });
              });
            });
          });
        });
      };
      processHexagonAt(0, combo);
    }
  }

  explode() {
    this.triangles.forEach((line) => {
      line.forEach((triangle) => {
        if (triangle) {
          triangle.colour = this.colourQueue.shift() as Colour;
          triangle.powerup = this.powerupQueue.shift() as PowerUp;
          triangle.twoxImage?.setVisible(triangle.powerup === "2x");
          triangle.bombImage?.setVisible(triangle.powerup === "Bomb");
          triangle.wildImage?.setVisible(triangle.powerup === "Wild");
        }
      });
    });
  }

  rotate(clockwise: boolean) {
    const hexagon = this.getHexagon(this.cursor.x, this.cursor.y);

    if (clockwise) {
      hexagon.reverse();
    }

    let previous: Colour | undefined;
    let previousPowerup: PowerUp | undefined;
    hexagon.forEach((triangle) => {
      if (typeof previous === "undefined") {
        previous = triangle.colour;
        previousPowerup = triangle.powerup;
        return;
      }

      const temp = triangle.colour;
      const tempPowerup = triangle.powerup;
      triangle.colour = previous;
      triangle.powerup = previousPowerup;
      previous = temp;
      previousPowerup = tempPowerup;
    });
    hexagon[0]!.colour = previous!;
    hexagon[0]!.powerup = previousPowerup!;
    hexagon.forEach((triangle) => {
      triangle.twoxImage?.setVisible(triangle.powerup === "2x");
      triangle.bombImage?.setVisible(triangle.powerup === "Bomb");
      triangle.wildImage?.setVisible(triangle.powerup === "Wild");
      if (triangle.wildAnimationMask && triangle.powerup !== "Wild") {
        triangle.wildAnimationMask.destroy();
      }
    });
  }

  create() {
    let parity: boolean | undefined;

    this.lineWidths.forEach((count, ind) => {
      if (typeof parity === "undefined") {
        parity = count % 2 === 1;
      } else {
        if (parity === (count % 2 === 1)) {
          throw new Error("Each line should have different parity.");
        }
        parity = !parity;
      }

      for (let i = 0; i < 2; i++) {
        const y = ind + i;
        if (y + 1 > this.triangles.length) {
          this.triangles.push(new Array(this.width * 2 + 1));
        }
        const offset = this.width - count;
        for (let j = 0; j < count * 2 + 1; j++) {
          if (typeof this.triangles[y] === "undefined") {
            throw new Error("Something AWFUL happened!!!");
          }
          const colour = this.colourQueue.shift();
          const powerUp = this.powerupQueue.shift();
          const twoxImage: GameObjects.Image | undefined =
            this.twoXGroup.shift();
          const bombImage: GameObjects.Image | undefined =
            this.bombGroup.shift();
          const wildImage: GameObjects.Sprite | undefined =
            this.wildGroup.shift();
          twoxImage?.setVisible(false);
          bombImage?.setVisible(false);
          wildImage?.setVisible(false);
          const triangle = new Triangle(
            this,
            j + offset,
            ind + i,
            colour,
            powerUp,
            twoxImage,
            bombImage,
            wildImage,
          );
          triangle.twoxImage?.setVisible(triangle.powerup === "2x");
          triangle.bombImage?.setVisible(triangle.powerup === "Bomb");
          this.triangles[y][offset + j] = triangle;
        }
      }
    });
  }

  draw() {
    this.drawOutline();
    this.drawTriangles();
    this.drawCursor();
  }

  drawTriangles() {
    this.triangles.forEach((line) => {
      line.forEach((triangle) => {
        if (
          typeof triangle === "undefined" ||
          typeof triangle.colour === "undefined"
        ) {
          return;
        }

        const { point, left, right } = triangle.getMappedCorners();
        const triangleCoords: [number, number, number, number, number, number] =
          [
            this.center.x + point.x * this.scale.x,
            this.center.y + point.y * this.scale.y,
            this.center.x + left.x * this.scale.x,
            this.center.y + left.y * this.scale.y,
            this.center.x + right.x * this.scale.x,
            this.center.y + right.y * this.scale.y,
          ];

        let fillColor: number;
        const flashColour = (triangle as any).flashColour as number | undefined;
        if (typeof flashColour !== "undefined") {
          fillColor = flashColour;
        } else {
          fillColor = colourMap[triangle.colour] ?? 0x000000;
        }
        this.graphics.fillStyle(fillColor);
        this.graphics.fillTriangle(...triangleCoords);

        if (triangle.powerup === "2x" && triangle.twoxImage) {
          const middleX =
            (triangleCoords[0] + triangleCoords[2] + triangleCoords[4]) / 3;
          const middleY =
            (triangleCoords[1] + triangleCoords[3] + triangleCoords[5]) / 3;
          triangle.twoxImage.setPosition(middleX, middleY);
          triangle.twoxImage.setScale(0.3 * this.scale.x);
          triangle.twoxImage.setVisible(true);
        }

        if (triangle.powerup === "Bomb" && triangle.bombImage) {
          const middleX =
            (triangleCoords[0] + triangleCoords[2] + triangleCoords[4]) / 3;
          const middleY =
            (triangleCoords[1] + triangleCoords[3] + triangleCoords[5]) / 3;
          triangle.bombImage.setPosition(middleX, middleY);
          triangle.bombImage.setScale(0.3 * this.scale.x);
          triangle.bombImage.setVisible(true);
        }

        if (triangle.powerup === "Wild" && triangle.wildImage) {
          const sprite = triangle.wildImage;
          sprite.setDepth(0);
          sprite.setOrigin(0.5, 0.5);

          const middleX =
            (triangleCoords[0] + triangleCoords[2] + triangleCoords[4]) / 3;
          const middleY =
            (triangleCoords[1] + triangleCoords[3] + triangleCoords[5]) / 3;

          if (triangle.flipped()) {
            sprite.angle = 0;
            sprite.setPosition(middleX, middleY + 7.5 * this.scale.y);
          } else {
            sprite.angle = 180;
            sprite.setPosition(middleX, middleY - 7.5 * this.scale.y);
          }
          sprite.setScale(this.scale.x * 0.105, this.scale.x * 0.1);
          sprite.setVisible(true);

          sprite.setVisible(true);
        } else if (triangle.wildImage) {
          triangle.wildImage.setVisible(false);
        }

        this.graphics.lineStyle(
          INNER_LINE_WIDTH * this.scale.x,
          INNER_LINE_COLOR,
        );
        this.graphics.strokeTriangle(...triangleCoords);
      });
    });
  }

  drawCursor() {
    const mappedX =
      (this.cursor.x - (this.width - 1) / 2) * BASE_TRIANGLE_WIDTH +
      (((this.cursor.y + 1) % 2) * BASE_TRIANGLE_WIDTH) / 2;
    const mappedY =
      (this.cursor.y - (this.height - 1) / 2) * BASE_TRIANGLE_HEIGHT;

    this.cursorImage.setPosition(
      this.center.x + mappedX * this.scale.x,
      this.center.y + mappedY * this.scale.y,
    );
    this.cursorImage.setScale(this.scale.x / 5, this.scale.y / 5);
    this.cursorImage.setDepth(1);
  }

  drawOutline(thickness = 18) {
    //shitty chatgpt code
    // 1) Build an edge map counting occurrences (same order-independent key approach)
    type Pt = { x: number; y: number };
    const edgeMap = new Map<string, { a: Pt; b: Pt; count: number }>();

    const makeKey = (p: Pt, q: Pt) =>
      p.x < q.x || (p.x === q.x && p.y <= q.y)
        ? `${p.x},${p.y}|${q.x},${q.y}`
        : `${q.x},${q.y}|${p.x},${p.y}`;

    const pushEdgeGrid = (p1: Pt, p2: Pt) => {
      const key = makeKey(p1, p2);
      const existing = edgeMap.get(key);
      if (existing) {
        existing.count += 1;
      } else {
        // store in canonical order
        const [a, b] =
          p1.x < p2.x || (p1.x === p2.x && p1.y <= p2.y) ? [p1, p2] : [p2, p1];
        edgeMap.set(key, {
          a: { x: a.x, y: a.y },
          b: { x: b.x, y: b.y },
          count: 1,
        });
      }
    };

    // collect edges from triangles
    this.triangles.forEach((line) => {
      line.forEach((triangle) => {
        if (!triangle || typeof triangle.colour === "undefined") return;
        const { point, left, right } = triangle.getMappedCorners();
        pushEdgeGrid(point, left);
        pushEdgeGrid(left, right);
        pushEdgeGrid(right, point);
      });
    });

    // 2) Build adjacency for only boundary edges (count === 1)
    const adj = new Map<string, Set<string>>();
    const keyToPt = new Map<string, Pt>(); // store pointKey -> grid Pt

    const pointKey = (p: Pt) => `${p.x},${p.y}`;

    edgeMap.forEach((entry) => {
      if (entry.count !== 1) return; // only boundary edges
      const aKey = pointKey(entry.a);
      const bKey = pointKey(entry.b);

      keyToPt.set(aKey, entry.a);
      keyToPt.set(bKey, entry.b);

      if (!adj.has(aKey)) adj.set(aKey, new Set());
      if (!adj.has(bKey)) adj.set(bKey, new Set());
      adj.get(aKey)?.add(bKey);
      adj.get(bKey)?.add(aKey);
    });

    // 3) Extract continuous loops from adjacency
    const loops: Pt[][] = [];
    const removeEdgeFromAdj = (u: string, v: string) => {
      const su = adj.get(u);
      if (su) {
        su.delete(v);
        if (su.size === 0) adj.delete(u);
      }
      const sv = adj.get(v);
      if (sv) {
        sv.delete(u);
        if (sv.size === 0) adj.delete(v);
      }
    };

    while (adj.size > 0) {
      // start from any vertex
      const startKey = adj.keys().next().value as string;
      const loop: Pt[] = [];
      let curr = startKey;
      let prev: string | null = null;

      // walk until we return to startKey
      do {
        // push current point coords
        const currPt = keyToPt.get(curr);
        if (!currPt) break; // safety
        loop.push({ x: currPt.x, y: currPt.y });

        const neighbors = adj.get(curr);
        if (!neighbors || neighbors.size === 0) break;

        // choose next neighbor: if prev exists choose neighbor !== prev; otherwise pick any
        let next: string | undefined;
        if (prev === null) {
          next = neighbors.values().next().value;
        } else {
          for (const n of neighbors) {
            if (n !== prev) {
              next = n;
              break;
            }
          }
          // if there is no neighbor other than prev, then this will close the loop
          if (!next) {
            next = neighbors.values().next().value;
          }
        }

        // remove the traversed edge from adjacency
        if (typeof next === "string") {
          removeEdgeFromAdj(curr, next);
          prev = curr;
          curr = next;
        } else {
          break;
        }
      } while (curr !== startKey && adj.size > 0);

      if (loop.length >= 2) {
        loops.push(loop);
      }
    }

    if (loops.length === 0) return; // nothing to draw

    // 4) Convert grid coords -> pixel coords and stroke each loop as a closed path.
    // Scale thickness by board scale so it looks consistent
    const scaleFactor = Math.max(this.scale.x, this.scale.y) || 1;
    const finalThickness = thickness * scaleFactor;

    // IMPORTANT: begin a fresh path for each loop to ensure good joins
    loops.forEach((loop) => {
      this.graphics.lineStyle(finalThickness, 0xffffff, 1);
      this.graphics.beginPath();

      for (let i = 0; i < loop.length; i++) {
        const g = loop[i];
        if (!g) continue;
        const px = this.center.x + g.x * this.scale.x;
        const py = this.center.y + g.y * this.scale.y;
        if (i === 0) this.graphics.moveTo(px, py);
        else this.graphics.lineTo(px, py);
      }

      // close path and stroke
      // close to first point
      const first = loop[0];
      if (first) {
        const fx = this.center.x + first.x * this.scale.x;
        const fy = this.center.y + first.y * this.scale.y;
        this.graphics.lineTo(fx, fy);
      }
      this.graphics.strokePath();
    });
  }
}
