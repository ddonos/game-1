import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { GAME_CONFIG } from "../config/gameConfig";

export class HitBurst {
  private readonly mesh: Mesh;
  private elapsed = 0;
  private active = false;

  constructor(scene: Scene, material: StandardMaterial, index: number) {
    this.mesh = MeshBuilder.CreateSphere(
      `hit-burst-${index}`,
      {
        diameter: 1,
        segments: 8
      },
      scene
    );
    this.mesh.material = material;
    this.mesh.setEnabled(false);
  }

  static createMaterial(scene: Scene): StandardMaterial {
    const material = new StandardMaterial("hit-burst-material", scene);
    material.diffuseColor = new Color3(1, 0.82, 0.22);
    material.emissiveColor = new Color3(1, 0.48, 0.08);
    material.alpha = 0.55;
    return material;
  }

  get isActive(): boolean {
    return this.active;
  }

  spawn(position: Vector3): void {
    this.active = true;
    this.elapsed = 0;
    this.mesh.position.copyFrom(position);
    this.mesh.scaling.setAll(GAME_CONFIG.hitFeedback.startScale);
    this.mesh.setEnabled(true);
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    this.elapsed += deltaSeconds;
    const progress = Math.min(this.elapsed / GAME_CONFIG.hitFeedback.durationSeconds, 1);
    const scale =
      GAME_CONFIG.hitFeedback.startScale +
      (GAME_CONFIG.hitFeedback.endScale - GAME_CONFIG.hitFeedback.startScale) *
        progress;
    this.mesh.scaling.setAll(scale);

    if (progress >= 1) {
      this.deactivate();
    }
  }

  dispose(): void {
    this.mesh.dispose();
  }

  deactivate(): void {
    this.active = false;
    this.mesh.setEnabled(false);
  }
}
