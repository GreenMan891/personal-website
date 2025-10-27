import { type GameObjects, Input, Scene } from "phaser";
import { Board } from "../lib/board";
export declare class Game extends Scene {
    constructor();
    alternateMode: boolean;
    hexagons: number[];
    init(data: {
        alternateMode?: boolean;
    }): void;
    wKey: Input.Keyboard.Key;
    aKey: Input.Keyboard.Key;
    sKey: Input.Keyboard.Key;
    dKey: Input.Keyboard.Key;
    jKey: Input.Keyboard.Key;
    kKey: Input.Keyboard.Key;
    graphics: GameObjects.Graphics;
    cursor: GameObjects.Image;
    twox: GameObjects.Image;
    twoxgroup: GameObjects.Image[];
    score: number;
    scoreText: Phaser.GameObjects.Text;
    bestText: Phaser.GameObjects.Text;
    totalHexas: number;
    board: Board;
    comboMult: number;
    movesBonus: number;
    timerText: Phaser.GameObjects.Text;
    timerEvent: Phaser.Time.TimerEvent;
    timeLeft: number;
    gameStartTime: number;
    totalTimePlayed: number;
    lastHorizontalLeft?: boolean;
    highScore: number;
    isGameOver: boolean;
    gameOverContainer: Phaser.GameObjects.Container;
    gameOverScreenShownAt: number | null;
    volumeSliderContainer: Phaser.GameObjects.Container;
    volumeSliderHandle: Phaser.GameObjects.Container;
    create(): void;
    onResize(gameSize: {
        width: number;
        height: number;
    }): void;
    updateScore: (hexagon: {
        colour?: number;
        powerup?: string;
    }[], comboMult: number) => void;
    updateTimer(): void;
    resetTimer: (twox: boolean) => void;
    hexa: (hexas: number, hexagon: {
        colour?: number;
        powerup?: string;
    }[]) => void;
    update(time: number, _delta: number): void;
    gameOverScreen(): void;
    resetCombo(): void;
    readInput(): void;
    createVolumeSlider(): void;
}
//# sourceMappingURL=Game.d.ts.map