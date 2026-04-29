import { GAME_CONFIG } from "../config/gameConfig";
import { POWER_UP_CONFIG, type PowerUpTypeId } from "../config/powerUps";

export type ActiveEffectSnapshot = {
  rapidFireSeconds: number;
  shieldSeconds: number;
  scoreMultiplierSeconds: number;
};

export class EffectSystem {
  private rapidFireRemaining = 0;
  private shieldRemaining = 0;
  private scoreMultiplierRemaining = 0;
  private pendingRepair = 0;

  update(deltaSeconds: number): void {
    this.rapidFireRemaining = Math.max(0, this.rapidFireRemaining - deltaSeconds);
    this.shieldRemaining = Math.max(0, this.shieldRemaining - deltaSeconds);
    this.scoreMultiplierRemaining = Math.max(
      0,
      this.scoreMultiplierRemaining - deltaSeconds
    );
  }

  applyPowerUp(type: PowerUpTypeId, shieldDurationBonusSeconds = 0): void {
    const config = POWER_UP_CONFIG.types[type];

    if (type === "repair") {
      this.pendingRepair += config.effectStrength;
      return;
    }

    if (type === "rapidFire") {
      this.rapidFireRemaining = config.durationSeconds;
      return;
    }

    if (type === "shield") {
      this.shieldRemaining = config.durationSeconds + shieldDurationBonusSeconds;
      return;
    }

    this.scoreMultiplierRemaining = config.durationSeconds;
  }

  consumeRepair(): number {
    const repair = this.pendingRepair;
    this.pendingRepair = 0;
    return repair;
  }

  getFireCooldownSeconds(
    fireCooldownSeconds: number = GAME_CONFIG.projectiles.fireCooldownSeconds
  ): number {
    const baseCooldown = Math.max(
      GAME_CONFIG.projectiles.minFireCooldownSeconds,
      fireCooldownSeconds
    );

    if (this.rapidFireRemaining <= 0) {
      return baseCooldown;
    }

    return Math.max(
      GAME_CONFIG.projectiles.rapidFireMinCooldownSeconds,
      baseCooldown * POWER_UP_CONFIG.types.rapidFire.effectStrength
    );
  }

  getScoreMultiplier(): number {
    if (this.scoreMultiplierRemaining <= 0) {
      return 1;
    }

    return POWER_UP_CONFIG.types.scoreMultiplier.effectStrength;
  }

  absorbDamage(): boolean {
    return this.shieldRemaining > 0;
  }

  clear(): void {
    this.rapidFireRemaining = 0;
    this.shieldRemaining = 0;
    this.scoreMultiplierRemaining = 0;
    this.pendingRepair = 0;
  }

  getSnapshot(): ActiveEffectSnapshot {
    return {
      rapidFireSeconds: this.rapidFireRemaining,
      shieldSeconds: this.shieldRemaining,
      scoreMultiplierSeconds: this.scoreMultiplierRemaining
    };
  }
}
