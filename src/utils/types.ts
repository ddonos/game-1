export type GameState = {
  lives: number;
  score: number;
  currency: number;
  stage: number;
  stageTimeRemaining: number;
  effects: {
    rapidFireSeconds: number;
    shieldSeconds: number;
    scoreMultiplierSeconds: number;
  };
};
