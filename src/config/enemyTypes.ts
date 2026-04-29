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
    emissiveColor: new Color3(0.22, 0.04, 0.02)
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
    emissiveColor: new Color3(0.25, 0.15, 0.02)
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
    emissiveColor: new Color3(0.13, 0.04, 0.22)
  }
} as const;
