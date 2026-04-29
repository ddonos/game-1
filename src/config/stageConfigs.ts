import type { EnemyTypeId } from "./enemyTypes";

export type EnemyWeights = Record<EnemyTypeId, number>;

export type StageConfig = {
  stageNumber: number;
  durationSeconds: number;
  spawnIntervalSeconds: {
    min: number;
    max: number;
  };
  enemySpeedMultiplier: number;
  enemyTypeWeights: EnemyWeights;
  scoreMultiplier: number;
  currencyMultiplier: number;
  bossStage: boolean;
};

const normalDuration = 35;

export const STAGE_CONFIGS: StageConfig[] = [
  stage(1, 1.8, 1.2, 1, weights(100, 0, 0)),
  stage(2, 1.75, 1.15, 1.03, weights(90, 10, 0)),
  stage(3, 1.7, 1.1, 1.06, weights(82, 18, 0)),
  stage(4, 1.65, 1.05, 1.1, weights(74, 22, 4)),
  stage(5, 1.6, 1.0, 1.12, weights(70, 24, 6), true),
  stage(6, 1.55, 0.98, 1.16, weights(66, 26, 8)),
  stage(7, 1.5, 0.96, 1.2, weights(62, 28, 10)),
  stage(8, 1.46, 0.94, 1.24, weights(58, 30, 12)),
  stage(9, 1.42, 0.92, 1.28, weights(54, 32, 14)),
  stage(10, 1.38, 0.9, 1.32, weights(50, 34, 16), true),
  stage(11, 1.34, 0.88, 1.36, weights(48, 34, 18)),
  stage(12, 1.3, 0.86, 1.4, weights(46, 34, 20)),
  stage(13, 1.26, 0.84, 1.44, weights(44, 34, 22)),
  stage(14, 1.22, 0.82, 1.48, weights(42, 34, 24)),
  stage(15, 1.18, 0.8, 1.52, weights(40, 34, 26), true),
  stage(16, 1.15, 0.78, 1.56, weights(38, 34, 28)),
  stage(17, 1.12, 0.76, 1.6, weights(36, 34, 30)),
  stage(18, 1.09, 0.74, 1.64, weights(34, 34, 32)),
  stage(19, 1.06, 0.72, 1.68, weights(32, 34, 34)),
  stage(20, 1.03, 0.7, 1.72, weights(30, 34, 36), true),
  stage(21, 1.0, 0.68, 1.76, weights(29, 34, 37)),
  stage(22, 0.98, 0.66, 1.8, weights(28, 34, 38)),
  stage(23, 0.96, 0.64, 1.84, weights(27, 34, 39)),
  stage(24, 0.94, 0.62, 1.88, weights(26, 34, 40)),
  stage(25, 0.92, 0.6, 1.92, weights(25, 34, 41), true),
  stage(26, 0.9, 0.58, 1.96, weights(24, 34, 42)),
  stage(27, 0.88, 0.56, 2.0, weights(23, 34, 43)),
  stage(28, 0.86, 0.54, 2.04, weights(22, 34, 44)),
  stage(29, 0.84, 0.52, 2.08, weights(21, 34, 45)),
  stage(30, 0.82, 0.5, 2.12, weights(20, 34, 46), true)
];

export function getStageConfig(stageNumber: number): StageConfig {
  return (
    STAGE_CONFIGS.find((config) => config.stageNumber === stageNumber) ??
    STAGE_CONFIGS[STAGE_CONFIGS.length - 1]
  );
}

function weights(basic: number, fast: number, tank: number): EnemyWeights {
  return { basic, fast, tank };
}

function stage(
  stageNumber: number,
  spawnMax: number,
  spawnMin: number,
  enemySpeedMultiplier: number,
  enemyTypeWeights: EnemyWeights,
  bossStage = false
): StageConfig {
  const rewardMultiplier = 1 + Math.floor((stageNumber - 1) / 5) * 0.1;

  return {
    stageNumber,
    durationSeconds: normalDuration,
    spawnIntervalSeconds: {
      min: spawnMin,
      max: spawnMax
    },
    enemySpeedMultiplier,
    enemyTypeWeights,
    scoreMultiplier: rewardMultiplier,
    currencyMultiplier: rewardMultiplier,
    bossStage
  };
}
