import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { GAME_CONFIG } from "../config/gameConfig";

export class Projectile {
  private readonly mesh: Mesh;
  private travelDistance = 0;
  private active = false;

  constructor(scene: Scene, material: StandardMaterial, index: number) {
    this.mesh = MeshBuilder.CreateBox(
      `player-projectile-${index}`,
      {
        width: 0.08,
        height: 0.08,
        depth: 1.15
      },
      scene
    );
    this.mesh.material = material;
    this.mesh.isVisible = false;
    this.mesh.setEnabled(false);
  }

  static createMaterial(scene: Scene): StandardMaterial {
    const material = new StandardMaterial("player-projectile-material", scene);
    material.diffuseColor = new Color3(0.2, 1, 0.95);
    material.emissiveColor = new Color3(0.15, 1, 0.9);
    return material;
  }

  get isActive(): boolean {
    return this.active;
  }

  fire(origin: Vector3): void {
    this.active = true;
    this.travelDistance = 0;
    this.mesh.position.copyFrom(origin);
    this.mesh.isVisible = true;
    this.mesh.setEnabled(true);
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    const distance = GAME_CONFIG.projectiles.speed * deltaSeconds;
    this.mesh.position.z += distance;
    this.travelDistance += distance;

    if (this.travelDistance >= GAME_CONFIG.projectiles.maxTravelDistance) {
      this.deactivate();
    }
  }

  deactivate(): void {
    this.active = false;
    this.mesh.isVisible = false;
    this.mesh.setEnabled(false);
  }

  dispose(): void {
    this.mesh.dispose();
  }
}
