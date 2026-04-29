import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Scene } from "@babylonjs/core/scene";

import { GAME_CONFIG } from "../config/gameConfig";
import { HitBurst } from "../entities/HitBurst";

export class HitFeedbackPool {
  private readonly bursts: HitBurst[] = [];
  private nextIndex = 0;

  constructor(scene: Scene) {
    const material = HitBurst.createMaterial(scene);

    for (let index = 0; index < GAME_CONFIG.hitFeedback.poolSize; index += 1) {
      this.bursts.push(new HitBurst(scene, material, index));
    }
  }

  spawn(position: Vector3): void {
    const burst = this.findAvailableBurst();

    if (!burst) {
      return;
    }

    burst.spawn(position);
  }

  update(deltaSeconds: number): void {
    for (const burst of this.bursts) {
      burst.update(deltaSeconds);
    }
  }

  dispose(): void {
    for (const burst of this.bursts) {
      burst.dispose();
    }
  }

  private findAvailableBurst(): HitBurst | undefined {
    for (let offset = 0; offset < this.bursts.length; offset += 1) {
      const index = (this.nextIndex + offset) % this.bursts.length;
      const burst = this.bursts[index];

      if (!burst.isActive) {
        this.nextIndex = (index + 1) % this.bursts.length;
        return burst;
      }
    }

    return undefined;
  }
}
