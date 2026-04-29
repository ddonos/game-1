import { Color4 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { PointsCloudSystem } from "@babylonjs/core/Particles/pointsCloudSystem";
import { Scene } from "@babylonjs/core/scene";
import type { CloudPoint } from "@babylonjs/core/Particles/cloudPoint";

import { GAME_CONFIG } from "../config/gameConfig";
import { randomRange } from "../utils/math";

export class Starfield {
  private mesh?: Mesh;

  async create(scene: Scene): Promise<void> {
    const points = new PointsCloudSystem("starfield", 1, scene);

    points.addPoints(GAME_CONFIG.starfield.count, (particle: CloudPoint) => {
      particle.position = new Vector3(
        randomRange(-GAME_CONFIG.starfield.width / 2, GAME_CONFIG.starfield.width / 2),
        randomRange(-GAME_CONFIG.starfield.height / 2, GAME_CONFIG.starfield.height / 2),
        randomRange(6, GAME_CONFIG.starfield.depth)
      );
      particle.color = new Color4(0.75, 0.85, 1, randomRange(0.45, 1));
    });

    this.mesh = await points.buildMeshAsync();
    this.mesh.alwaysSelectAsActiveMesh = true;
  }

  update(deltaSeconds: number): void {
    if (!this.mesh) {
      return;
    }

    this.mesh.position.z -= deltaSeconds * 2.8;

    if (this.mesh.position.z < -GAME_CONFIG.starfield.depth * 0.5) {
      this.mesh.position.z = 0;
    }
  }

  dispose(): void {
    this.mesh?.dispose();
  }
}
