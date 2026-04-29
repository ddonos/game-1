import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { ENEMY_TYPES, type EnemyTypeId } from "../config/enemyTypes";
import { GAME_CONFIG } from "../config/gameConfig";
import {
  EnemyProjectile,
  type EnemyProjectileSpawn
} from "../entities/EnemyProjectile";

export class EnemyProjectilePool {
  private readonly projectiles: EnemyProjectile[] = [];
  private nextIndex = 0;

  constructor(scene: Scene) {
    const materials = createMaterials(scene);

    for (let index = 0; index < GAME_CONFIG.enemyProjectiles.poolSize; index += 1) {
      this.projectiles.push(new EnemyProjectile(scene, materials, index));
    }
  }

  fire(spawn: EnemyProjectileSpawn): void {
    const projectile = this.findAvailableProjectile();

    if (!projectile) {
      return;
    }

    projectile.fire(spawn);
  }

  update(deltaSeconds: number): void {
    for (const projectile of this.projectiles) {
      projectile.update(deltaSeconds);
    }
  }

  getActiveProjectiles(): readonly EnemyProjectile[] {
    return this.projectiles;
  }

  deactivateAll(): void {
    for (const projectile of this.projectiles) {
      projectile.deactivate();
    }
  }

  dispose(): void {
    for (const projectile of this.projectiles) {
      projectile.dispose();
    }
  }

  private findAvailableProjectile(): EnemyProjectile | undefined {
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

function createMaterials(scene: Scene): Record<EnemyTypeId, StandardMaterial> {
  return {
    basic: createMaterial(scene, "enemy-basic-projectile-material", "basic"),
    fast: createMaterial(scene, "enemy-fast-projectile-material", "fast"),
    tank: createMaterial(scene, "enemy-tank-projectile-material", "tank")
  };
}

function createMaterial(
  scene: Scene,
  name: string,
  type: EnemyTypeId
): StandardMaterial {
  const material = new StandardMaterial(name, scene);
  material.diffuseColor = ENEMY_TYPES[type].firing.color;
  material.emissiveColor = ENEMY_TYPES[type].firing.emissiveColor;
  return material;
}
