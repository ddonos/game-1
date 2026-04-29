export const GAME_CONFIG = {
  initialLives: 3,
  initialScore: 0,
  initialCurrency: 0,
  initialStage: 1,
  player: {
    speed: 9,
    collisionRadius: 0.75,
    invulnerabilitySeconds: 1.5,
    blinkIntervalSeconds: 0.12,
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
    fireCooldownSeconds: 0.16,
    collisionRadius: 0.32,
    damage: 1
  },
  enemyProjectiles: {
    poolSize: 36,
    maxTravelDistance: 72
  },
  enemies: {
    poolSize: 10,
    baseSpeed: 8,
    spawnZ: 54,
    deactivateZ: -9,
    spawnBounds: {
      x: 4.2,
      yMin: -2.1,
      yMax: 2.5
    }
  },
  hitFeedback: {
    poolSize: 8,
    durationSeconds: 0.16,
    startScale: 0.35,
    endScale: 1.15
  }
} as const;
