import * as react from 'react';
import * as Phaser from 'phaser';

type GetScoresOptions = {
    limit?: number;
    offset?: number;
    startDate?: Date;
    endDate?: Date;
    orderBy?: "createdAt" | "score";
    orderDirection?: "asc" | "desc";
};
type ScoreRow = {
    id?: string;
    score: number;
    userId?: string;
    createdAt?: string;
};
type GetScoresFn = (options?: GetScoresOptions) => Promise<ScoreRow[]>;
type PostScoreFn = (score: number) => Promise<unknown>;

interface IRefHexa {
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
declare const Hexa: react.ForwardRefExoticComponent<IHexaProps & react.RefAttributes<IRefHexa>>;

export { Hexa };
export type { IRefHexa };
