import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

import { GAME_CONFIG } from "../config/gameConfig";
import { Projectile } from "../entities/Projectile";

export class ProjectilePool {
  private readonly projectiles: Projectile[] = [];
  private cooldownRemaining = 0;
  private nextIndex = 0;

  constructor(scene: Scene) {
    const material = Projectile.createMaterial(scene);

    for (let index = 0; index < GAME_CONFIG.projectiles.poolSize; index += 1) {
      this.projectiles.push(new Projectile(scene, material, index));
    }
  }

  update(deltaSeconds: number, shouldFire: boolean, origin: Vector3): void {
    this.cooldownRemaining = Math.max(0, this.cooldownRemaining - deltaSeconds);

    if (shouldFire && this.cooldownRemaining === 0) {
      this.fire(origin);
      this.cooldownRemaining = GAME_CONFIG.projectiles.fireCooldownSeconds;
    }

    for (const projectile of this.projectiles) {
      projectile.update(deltaSeconds);
    }
  }

  dispose(): void {
    for (const projectile of this.projectiles) {
      projectile.dispose();
    }
  }

  private fire(origin: Vector3): void {
    const projectile = this.findAvailableProjectile();

    if (!projectile) {
      return;
    }

    projectile.fire(origin);
  }

  private findAvailableProjectile(): Projectile | undefined {
    for (let offset = 0; offset < this.projectiles.length; offset += 1) {
      const index = (this.nextIndex + offset) % this.projectiles.length;
      const projectile = this.projectiles[index];

      if (!projectile.isActive) {
        this.nextIndex = (index + 1) % this.projectiles.length;
        return projectile;
      }
    }

    return undefined;
  }
}
