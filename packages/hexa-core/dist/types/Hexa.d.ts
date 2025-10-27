import * as Phaser from 'phaser';
import { type GetScoresFn, type PostScoreFn } from "./externalApi";
export interface IRefHexa {
    game: Phaser.Game | null;
    scene: Phaser.Scene | null;
}
interface IHexaProps {
    onSceneChange?: (scene: Phaser.Scene) => void;
    assetPrefix?: string;
    initialWidth: number;
    initialHeight: number;
    getScores?: GetScoresFn;
    postScore?: PostScoreFn;
}
export declare const Hexa: import("react").ForwardRefExoticComponent<IHexaProps & import("react").RefAttributes<IRefHexa>>;
export {};
//# sourceMappingURL=Hexa.d.ts.map