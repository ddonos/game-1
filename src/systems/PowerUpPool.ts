import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

import {
  POWER_UP_CONFIG,
  POWER_UP_ORDER,
  type PowerUpTypeId
} from "../config/powerUps";
import { PowerUp } from "../entities/PowerUp";
import type { PlayerShip } from "../entities/PlayerShip";
import { randomRange } from "../utils/math";
import type { EffectSystem } from "./EffectSystem";

export class PowerUpPool {
  private readonly powerUps: PowerUp[] = [];
  private readonly spawnPosition = new Vector3();
  private nextIndex = 0;
  private spawnTimer = 0;

  constructor(scene: Scene) {
    const materials = PowerUp.createMaterials(scene);

    for (let index = 0; index < POWER_UP_CONFIG.poolSize; index += 1) {
      this.powerUps.push(new PowerUp(scene, materials, index));
    }

    this.resetSpawnTimer();
  }

  update(deltaSeconds: number, player: PlayerShip, effects: EffectSystem): void {
    this.spawnTimer -= deltaSeconds;

    if (this.spawnTimer <= 0) {
      this.spawnPowerUp();
      this.resetSpawnTimer();
    }

    for (const powerUp of this.powerUps) {
      powerUp.update(deltaSeconds);
    }

    this.collectActivePowerUps(player, effects);
  }

  deactivateAll(): void {
    for (const powerUp of this.powerUps) {
      powerUp.deactivate();
    }

    this.resetSpawnTimer();
  }

  dispose(): void {
    for (const powerUp of this.powerUps) {
      powerUp.dispose();
    }
  }

  private collectActivePowerUps(player: PlayerShip, effects: EffectSystem): void {
    for (const powerUp of this.powerUps) {
      if (!powerUp.isActive) {
        continue;
      }

      const radius = player.collisionRadius + powerUp.collisionRadius;
      const dx = player.position.x - powerUp.position.x;
      const dy = player.position.y - powerUp.position.y;
      const dz = player.position.z - powerUp.position.z;
      const distanceSquared = dx * dx + dy * dy + dz * dz;

      if (distanceSquared <= radius * radius) {
        effects.applyPowerUp(powerUp.type);
        powerUp.deactivate();
      }
    }
  }

  private spawnPowerUp(): void {
    const powerUp = this.findAvailablePowerUp();

    if (!powerUp) {
      return;
    }

    this.spawnPosition.set(
      randomRange(
        -POWER_UP_CONFIG.spawnBounds.x,
        POWER_UP_CONFIG.spawnBounds.x
      ),
      randomRange(
        POWER_UP_CONFIG.spawnBounds.yMin,
        POWER_UP_CONFIG.spawnBounds.yMax
      ),
      POWER_UP_CONFIG.spawnZ
    );
    powerUp.spawn(
      this.spawnPosition,
      POWER_UP_CONFIG.types[this.pickPowerUpType()]
    );
  }

  private findAvailablePowerUp(): PowerUp | undefined {
    for (let offset = 0; offset < this.powerUps.length; offset += 1) {
      const index = (this.nextIndex + offset) % this.powerUps.length;
      const powerUp = this.powerUps[index];

      if (!powerUp.isActive) {
        this.nextIndex = (index + 1) % this.powerUps.length;
        return powerUp;
      }
    }

    return undefined;
  }

  private pickPowerUpType(): PowerUpTypeId {
    let totalWeight = 0;

    for (const type of POWER_UP_ORDER) {
      totalWeight += POWER_UP_CONFIG.types[type].spawnWeight;
    }

    let roll = Math.random() * totalWeight;

    for (const type of POWER_UP_ORDER) {
      roll -= POWER_UP_CONFIG.types[type].spawnWeight;

      if (roll <= 0) {
        return type;
      }
    }

    return "repair";
  }

  private resetSpawnTimer(): void {
    this.spawnTimer = randomRange(
      POWER_UP_CONFIG.spawnIntervalSeconds.min,
      POWER_UP_CONFIG.spawnIntervalSeconds.max
    );
  }
}
