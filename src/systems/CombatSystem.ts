import { GAME_CONFIG } from "../config/gameConfig";
import type { PlayerShip } from "../entities/PlayerShip";
import { EnemyPool } from "./EnemyPool";
import { EnemyProjectilePool } from "./EnemyProjectilePool";
import { HitFeedbackPool } from "./HitFeedbackPool";
import { ProjectilePool } from "./ProjectilePool";

export class CombatSystem {
  private pendingScore = 0;
  private pendingCurrency = 0;
  private pendingLifeLoss = 0;

  constructor(
    private readonly projectiles: ProjectilePool,
    private readonly enemyProjectiles: EnemyProjectilePool,
    private readonly enemies: EnemyPool,
    private readonly hitFeedback: HitFeedbackPool
  ) {}

  update(player: PlayerShip): void {
    this.checkProjectileEnemyCollisions();
    this.checkEnemyProjectilePlayerCollisions(player);
    this.checkEnemyPlayerCollisions(player);
  }

  consumeScore(): number {
    const score = this.pendingScore;
    this.pendingScore = 0;
    return score;
  }

  consumeCurrency(): number {
    const currency = this.pendingCurrency;
    this.pendingCurrency = 0;
    return currency;
  }

  consumeLifeLoss(): number {
    const lifeLoss = this.pendingLifeLoss;
    this.pendingLifeLoss = 0;
    return lifeLoss;
  }

  reset(): void {
    this.pendingScore = 0;
    this.pendingCurrency = 0;
    this.pendingLifeLoss = 0;
  }

  private checkProjectileEnemyCollisions(): void {
    for (const projectile of this.projectiles.getActiveProjectiles()) {
      if (!projectile.isActive) {
        continue;
      }

      for (const enemy of this.enemies.getActiveEnemies()) {
        if (!enemy.isActive) {
          continue;
        }

        const radius = projectile.collisionRadius + enemy.collisionRadius;
        const dx = projectile.position.x - enemy.position.x;
        const dy = projectile.position.y - enemy.position.y;
        const dz = projectile.position.z - enemy.position.z;
        const distanceSquared = dx * dx + dy * dy + dz * dz;

        if (distanceSquared <= radius * radius) {
          this.hitFeedback.spawn(enemy.position);
          projectile.deactivate();

          if (enemy.takeHit(GAME_CONFIG.projectiles.damage)) {
            enemy.deactivate();
            this.pendingScore += enemy.scoreReward;
            this.pendingCurrency += enemy.currencyReward;
          }

          break;
        }
      }
    }
  }

  private checkEnemyPlayerCollisions(player: PlayerShip): void {
    if (player.isInvulnerable) {
      return;
    }

    for (const enemy of this.enemies.getActiveEnemies()) {
      if (!enemy.isActive) {
        continue;
      }

      const radius = player.collisionRadius + enemy.collisionRadius;
      const dx = player.position.x - enemy.position.x;
      const dy = player.position.y - enemy.position.y;
      const dz = player.position.z - enemy.position.z;
      const distanceSquared = dx * dx + dy * dy + dz * dz;

      if (distanceSquared <= radius * radius) {
        this.hitFeedback.spawn(enemy.position);
        enemy.deactivate();
        this.pendingLifeLoss += 1;
        break;
      }
    }
  }

  private checkEnemyProjectilePlayerCollisions(player: PlayerShip): void {
    if (player.isInvulnerable) {
      return;
    }

    for (const projectile of this.enemyProjectiles.getActiveProjectiles()) {
      if (!projectile.isActive) {
        continue;
      }

      const radius = player.collisionRadius + projectile.collisionRadius;
      const dx = player.position.x - projectile.position.x;
      const dy = player.position.y - projectile.position.y;
      const dz = player.position.z - projectile.position.z;
      const distanceSquared = dx * dx + dy * dy + dz * dz;

      if (distanceSquared <= radius * radius) {
        this.hitFeedback.spawn(projectile.position);
        projectile.deactivate();
        this.pendingLifeLoss += 1;
        break;
      }
    }
  }
}
