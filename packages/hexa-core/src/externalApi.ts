export type GetScoresOptions = {
  limit?: number;
  offset?: number;
  startDate?: Date;
  endDate?: Date;
  orderBy?: "createdAt" | "score";
  orderDirection?: "asc" | "desc";
};

export type ScoreRow = { id?: string; score: number; userId?: string; createdAt?: string };

export type GetScoresFn = (options?: GetScoresOptions) => Promise<ScoreRow[]>;
export type PostScoreFn = (score: number) => Promise<unknown>;

export const externalApi: {
  getScores: GetScoresFn | undefined;
  postScore: PostScoreFn | undefined;
} = {
  getScores: undefined,
  postScore: undefined,
};


