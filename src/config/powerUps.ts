import { Color3 } from "@babylonjs/core/Maths/math.color";

export type PowerUpTypeId = "repair" | "rapidFire" | "shield" | "scoreMultiplier";

export type PowerUpConfig = {
  id: PowerUpTypeId;
  spawnWeight: number;
  collisionRadius: number;
  durationSeconds: number;
  effectStrength: number;
  color: Color3;
  emissiveColor: Color3;
  visualScale: {
    x: number;
    y: number;
    z: number;
  };
};

export const POWER_UP_ORDER: PowerUpTypeId[] = [
  "repair",
  "rapidFire",
  "shield",
  "scoreMultiplier"
];

export const POWER_UP_CONFIG = {
  poolSize: 8,
  speed: 6,
  spawnZ: 48,
  deactivateZ: -9,
  spawnIntervalSeconds: {
    min: 8,
    max: 13
  },
  spawnBounds: {
    x: 4,
    yMin: -2,
    yMax: 2.4
  },
  types: {
    repair: {
      id: "repair",
      spawnWeight: 25,
      collisionRadius: 0.55,
      durationSeconds: 0,
      effectStrength: 1,
      color: new Color3(0.25, 1, 0.42),
      emissiveColor: new Color3(0.05, 0.55, 0.16),
      visualScale: { x: 0.7, y: 0.7, z: 0.7 }
    },
    rapidFire: {
      id: "rapidFire",
      spawnWeight: 30,
      collisionRadius: 0.5,
      durationSeconds: 8,
      effectStrength: 0.55,
      color: new Color3(0.2, 0.95, 1),
      emissiveColor: new Color3(0.04, 0.38, 0.65),
      visualScale: { x: 0.55, y: 0.55, z: 0.85 }
    },
    shield: {
      id: "shield",
      spawnWeight: 25,
      collisionRadius: 0.58,
      durationSeconds: 7,
      effectStrength: 1,
      color: new Color3(0.35, 0.55, 1),
      emissiveColor: new Color3(0.08, 0.16, 0.65),
      visualScale: { x: 0.82, y: 0.82, z: 0.32 }
    },
    scoreMultiplier: {
      id: "scoreMultiplier",
      spawnWeight: 20,
      collisionRadius: 0.5,
      durationSeconds: 9,
      effectStrength: 2,
      color: new Color3(1, 0.9, 0.22),
      emissiveColor: new Color3(0.65, 0.42, 0.04),
      visualScale: { x: 0.65, y: 0.65, z: 0.65 }
    }
  } satisfies Record<PowerUpTypeId, PowerUpConfig>
} as const;
