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
  private shieldCharges = 0;

  update(deltaSeconds: number): void {
    this.rapidFireRemaining = Math.max(0, this.rapidFireRemaining - deltaSeconds);
    this.shieldRemaining = Math.max(0, this.shieldRemaining - deltaSeconds);
    this.scoreMultiplierRemaining = Math.max(
      0,
      this.scoreMultiplierRemaining - deltaSeconds
    );

    if (this.shieldRemaining === 0) {
      this.shieldCharges = 0;
    }
  }

  applyPowerUp(type: PowerUpTypeId): void {
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
      this.shieldRemaining = config.durationSeconds;
      this.shieldCharges = config.effectStrength;
      return;
    }

    this.scoreMultiplierRemaining = config.durationSeconds;
  }

  consumeRepair(): number {
    const repair = this.pendingRepair;
    this.pendingRepair = 0;
    return repair;
  }

  getFireCooldownSeconds(): number {
    if (this.rapidFireRemaining <= 0) {
      return GAME_CONFIG.projectiles.fireCooldownSeconds;
    }

    return (
      GAME_CONFIG.projectiles.fireCooldownSeconds *
      POWER_UP_CONFIG.types.rapidFire.effectStrength
    );
  }

  getScoreMultiplier(): number {
    if (this.scoreMultiplierRemaining <= 0) {
      return 1;
    }

    return POWER_UP_CONFIG.types.scoreMultiplier.effectStrength;
  }

  absorbDamage(): boolean {
    if (this.shieldRemaining <= 0 || this.shieldCharges <= 0) {
      return false;
    }

    this.shieldCharges -= 1;

    if (this.shieldCharges <= 0) {
      this.shieldRemaining = 0;
    }

    return true;
  }

  clear(): void {
    this.rapidFireRemaining = 0;
    this.shieldRemaining = 0;
    this.scoreMultiplierRemaining = 0;
    this.pendingRepair = 0;
    this.shieldCharges = 0;
  }

  getSnapshot(): ActiveEffectSnapshot {
    return {
      rapidFireSeconds: this.rapidFireRemaining,
      shieldSeconds: this.shieldRemaining,
      scoreMultiplierSeconds: this.scoreMultiplierRemaining
    };
  }
}
