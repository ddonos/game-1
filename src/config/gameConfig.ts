export const GAME_CONFIG = {
  initialLives: 3,
  initialScore: 0,
  initialCurrency: 0,
  initialStage: 1,
  player: {
    speed: 9,
    muzzleOffset: {
      x: 0,
      y: 0,
      z: 0.9
    },
    bounds: {
      x: 4.5,
      yMin: -2.4,
      yMax: 2.8
    },
    startPosition: {
      x: 0,
      y: 0,
      z: -6
    }
  },
  stagePlan: {
    totalStages: 30,
    normalStageDurationSeconds: {
      min: 30,
      max: 40
    },
    bossStageInterval: 5
  },
  starfield: {
    count: 420,
    width: 42,
    height: 24,
    depth: 95
  },
  projectiles: {
    poolSize: 24,
    speed: 44,
    maxTravelDistance: 70,
    fireCooldownSeconds: 0.16
  }
} as const;
