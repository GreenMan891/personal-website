import { type GameObjects, Input, Scene } from "phaser";
export declare class MainMenu extends Scene {
    buttons: Phaser.GameObjects.Container[];
    buttonIndex: number;
    logo: GameObjects.Image;
    text: Phaser.GameObjects.Text;
    aKey: Input.Keyboard.Key;
    dKey: Input.Keyboard.Key;
    jKey: Input.Keyboard.Key;
    constructor();
    init(): void;
    create(): void;
    createButton(text: string, x: number, action: () => void): GameObjects.Container;
    selectButton(index: number): void;
    selectNextButton(): void;
    selectPreviousButton(): void;
    update(): void;
    confirmSelection(): void;
}
//# sourceMappingURL=MainMenu.d.ts.map