import { Color3 } from "@babylonjs/core/Maths/math.color";

export type EnemyTypeId = "basic" | "fast" | "tank";

export type EnemyTypeConfig = {
  id: EnemyTypeId;
  health: number;
  speedMultiplier: number;
  scoreReward: number;
  currencyReward: number;
  collisionRadius: number;
  visualScale: {
    x: number;
    y: number;
    z: number;
  };
  color: Color3;
  emissiveColor: Color3;
  firing: {
    enabledFromStage: number;
    cooldownSeconds: number;
    projectileSpeed: number;
    projectileRadius: number;
    projectileScale: {
      x: number;
      y: number;
      z: number;
    };
    color: Color3;
    emissiveColor: Color3;
  };
};

export const ENEMY_TYPE_ORDER: EnemyTypeId[] = ["basic", "fast", "tank"];

export const ENEMY_TYPES: Record<EnemyTypeId, EnemyTypeConfig> = {
  basic: {
    id: "basic",
    health: 1,
    speedMultiplier: 1,
    scoreReward: 100,
    currencyReward: 3,
    collisionRadius: 0.72,
    visualScale: { x: 1, y: 1, z: 1 },
    color: new Color3(1, 0.28, 0.18),
    emissiveColor: new Color3(0.22, 0.04, 0.02),
    firing: {
      enabledFromStage: 3,
      cooldownSeconds: 3.2,
      projectileSpeed: 13,
      projectileRadius: 0.26,
      projectileScale: { x: 0.12, y: 0.12, z: 0.7 },
      color: new Color3(1, 0.32, 0.16),
      emissiveColor: new Color3(1, 0.18, 0.05)
    }
  },
  fast: {
    id: "fast",
    health: 1,
    speedMultiplier: 1.45,
    scoreReward: 80,
    currencyReward: 2,
    collisionRadius: 0.5,
    visualScale: { x: 0.72, y: 0.72, z: 0.9 },
    color: new Color3(1, 0.82, 0.18),
    emissiveColor: new Color3(0.25, 0.15, 0.02),
    firing: {
      enabledFromStage: 8,
      cooldownSeconds: 4.6,
      projectileSpeed: 15,
      projectileRadius: 0.22,
      projectileScale: { x: 0.09, y: 0.09, z: 0.58 },
      color: new Color3(1, 0.9, 0.18),
      emissiveColor: new Color3(1, 0.55, 0.04)
    }
  },
  tank: {
    id: "tank",
    health: 3,
    speedMultiplier: 0.72,
    scoreReward: 240,
    currencyReward: 7,
    collisionRadius: 0.98,
    visualScale: { x: 1.35, y: 1.35, z: 1.18 },
    color: new Color3(0.75, 0.3, 1),
    emissiveColor: new Color3(0.13, 0.04, 0.22),
    firing: {
      enabledFromStage: 5,
      cooldownSeconds: 4,
      projectileSpeed: 11,
      projectileRadius: 0.34,
      projectileScale: { x: 0.18, y: 0.18, z: 0.9 },
      color: new Color3(0.95, 0.38, 1),
      emissiveColor: new Color3(0.65, 0.12, 1)
    }
  }
} as const;
