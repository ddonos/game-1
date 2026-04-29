import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

import { GAME_CONFIG } from "../config/gameConfig";
import { Enemy } from "../entities/Enemy";
import { randomRange } from "../utils/math";

export class EnemyPool {
  private readonly enemies: Enemy[] = [];
  private readonly spawnPosition = new Vector3();
  private nextIndex = 0;
  private spawnTimer = 0;

  constructor(scene: Scene) {
    const material = Enemy.createMaterial(scene);

    for (let index = 0; index < GAME_CONFIG.enemies.poolSize; index += 1) {
      this.enemies.push(new Enemy(scene, material, index));
    }

    this.resetSpawnTimer();
  }

  update(deltaSeconds: number): void {
    this.spawnTimer -= deltaSeconds;

    if (this.spawnTimer <= 0) {
      this.spawnEnemy();
      this.resetSpawnTimer();
    }

    for (const enemy of this.enemies) {
      enemy.update(deltaSeconds);
    }
  }

  getActiveEnemies(): readonly Enemy[] {
    return this.enemies;
  }

  dispose(): void {
    for (const enemy of this.enemies) {
      enemy.dispose();
    }
  }

  private spawnEnemy(): void {
    const enemy = this.findAvailableEnemy();

    if (!enemy) {
      return;
    }

    this.spawnPosition.set(
      randomRange(-GAME_CONFIG.enemies.spawnBounds.x, GAME_CONFIG.enemies.spawnBounds.x),
      randomRange(
        GAME_CONFIG.enemies.spawnBounds.yMin,
        GAME_CONFIG.enemies.spawnBounds.yMax
      ),
      GAME_CONFIG.enemies.spawnZ
    );
    enemy.spawn(this.spawnPosition);
  }

  private findAvailableEnemy(): Enemy | undefined {
    for (let offset = 0; offset < this.enemies.length; offset += 1) {
      const index = (this.nextIndex + offset) % this.enemies.length;
      const enemy = this.enemies[index];

      if (!enemy.isActive) {
        this.nextIndex = (index + 1) % this.enemies.length;
        return enemy;
      }
    }

    return undefined;
  }

  private resetSpawnTimer(): void {
    this.spawnTimer = randomRange(
      GAME_CONFIG.enemies.spawnIntervalSeconds.min,
      GAME_CONFIG.enemies.spawnIntervalSeconds.max
    );
  }
}
