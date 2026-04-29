export type UpgradeId =
  | "fireRate"
  | "projectileDamage"
  | "projectileSpeed"
  | "shieldDuration"
  | "scoreBonus";

export type UpgradeConfig = {
  id: UpgradeId;
  displayName: string;
  maxLevel: number;
  baseCost: number;
  costIncrease: number;
  effectPerLevel: number;
};

export const UPGRADE_ORDER: UpgradeId[] = [
  "fireRate",
  "projectileDamage",
  "projectileSpeed",
  "shieldDuration",
  "scoreBonus"
];

export const UPGRADE_CONFIG = {
  fireRate: {
    id: "fireRate",
    displayName: "Fire Rate",
    maxLevel: 5,
    baseCost: 24,
    costIncrease: 18,
    effectPerLevel: 0.035
  },
  projectileDamage: {
    id: "projectileDamage",
    displayName: "Projectile Damage",
    maxLevel: 3,
    baseCost: 40,
    costIncrease: 26,
    effectPerLevel: 1
  },
  projectileSpeed: {
    id: "projectileSpeed",
    displayName: "Projectile Speed",
    maxLevel: 4,
    baseCost: 22,
    costIncrease: 16,
    effectPerLevel: 5
  },
  shieldDuration: {
    id: "shieldDuration",
    displayName: "Shield Duration",
    maxLevel: 4,
    baseCost: 18,
    costIncrease: 16,
    effectPerLevel: 1.5
  },
  scoreBonus: {
    id: "scoreBonus",
    displayName: "Score Bonus",
    maxLevel: 4,
    baseCost: 30,
    costIncrease: 22,
    effectPerLevel: 0.15
  }
} satisfies Record<UpgradeId, UpgradeConfig>;
