import { GAME_CONFIG } from "../config/gameConfig";
import {
  UPGRADE_CONFIG,
  UPGRADE_ORDER,
  type UpgradeId
} from "../config/upgrades";

export type UpgradeSnapshot = {
  id: UpgradeId;
  displayName: string;
  level: number;
  maxLevel: number;
  cost: number | null;
  canBuy: boolean;
  description: string;
};

type UpgradeLevels = Record<UpgradeId, number>;

export class UpgradeSystem {
  private readonly levels: UpgradeLevels = {
    fireRate: 0,
    projectileDamage: 0,
    projectileSpeed: 0,
    shieldDuration: 0,
    scoreBonus: 0
  };

  canAffordAny(currency: number): boolean {
    return UPGRADE_ORDER.some((id) => {
      const cost = this.getCost(id);
      return cost !== null && currency >= cost;
    });
  }

  buy(id: UpgradeId, currency: number): number | null {
    const cost = this.getCost(id);

    if (cost === null || currency < cost) {
      return null;
    }

    this.levels[id] += 1;
    return currency - cost;
  }

  getBaseFireCooldownSeconds(): number {
    const reduction =
      this.levels.fireRate * UPGRADE_CONFIG.fireRate.effectPerLevel;

    return Math.max(
      GAME_CONFIG.projectiles.minFireCooldownSeconds,
      GAME_CONFIG.projectiles.fireCooldownSeconds - reduction
    );
  }

  getProjectileDamage(): number {
    return (
      GAME_CONFIG.projectiles.damage +
      this.levels.projectileDamage *
        UPGRADE_CONFIG.projectileDamage.effectPerLevel
    );
  }

  getProjectileSpeed(): number {
    return (
      GAME_CONFIG.projectiles.speed +
      this.levels.projectileSpeed *
        UPGRADE_CONFIG.projectileSpeed.effectPerLevel
    );
  }

  getShieldDurationBonusSeconds(): number {
    return (
      this.levels.shieldDuration *
      UPGRADE_CONFIG.shieldDuration.effectPerLevel
    );
  }

  getScoreMultiplier(): number {
    return (
      1 +
      this.levels.scoreBonus * UPGRADE_CONFIG.scoreBonus.effectPerLevel
    );
  }

  getSnapshots(currency: number): UpgradeSnapshot[] {
    return UPGRADE_ORDER.map((id) => {
      const config = UPGRADE_CONFIG[id];
      const cost = this.getCost(id);

      return {
        id,
        displayName: config.displayName,
        level: this.levels[id],
        maxLevel: config.maxLevel,
        cost,
        canBuy: cost !== null && currency >= cost,
        description: this.getDescription(id)
      };
    });
  }

  reset(): void {
    for (const id of UPGRADE_ORDER) {
      this.levels[id] = 0;
    }
  }

  private getCost(id: UpgradeId): number | null {
    const config = UPGRADE_CONFIG[id];
    const level = this.levels[id];

    if (level >= config.maxLevel) {
      return null;
    }

    return config.baseCost + level * config.costIncrease;
  }

  private getDescription(id: UpgradeId): string {
    if (id === "fireRate") {
      return "-35ms cooldown per level";
    }

    if (id === "projectileDamage") {
      return "+1 projectile damage per level";
    }

    if (id === "projectileSpeed") {
      return "+5 projectile speed per level";
    }

    if (id === "shieldDuration") {
      return "+1.5s shield duration per level";
    }

    return "+15% score from destroyed enemies per level";
  }
}
