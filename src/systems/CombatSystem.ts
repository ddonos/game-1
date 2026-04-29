import { GAME_CONFIG } from "../config/gameConfig";
import { EnemyPool } from "./EnemyPool";
import { HitFeedbackPool } from "./HitFeedbackPool";
import { ProjectilePool } from "./ProjectilePool";

export class CombatSystem {
  private pendingScore = 0;
  private pendingCurrency = 0;

  constructor(
    private readonly projectiles: ProjectilePool,
    private readonly enemies: EnemyPool,
    private readonly hitFeedback: HitFeedbackPool
  ) {}

  update(): void {
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
          enemy.deactivate();
          this.pendingScore += GAME_CONFIG.enemies.scoreReward;
          this.pendingCurrency += GAME_CONFIG.enemies.currencyReward;
          break;
        }
      }
    }
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
}
