import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { GAME_CONFIG } from "../config/gameConfig";

export class Enemy {
  private readonly root: TransformNode;
  private active = false;

  constructor(scene: Scene, material: StandardMaterial, index: number) {
    this.root = new TransformNode(`enemy-${index}`, scene);

    const body = MeshBuilder.CreateCylinder(
      `enemy-${index}-body`,
      {
        diameterTop: 0.2,
        diameterBottom: 0.8,
        height: 1.25,
        tessellation: 6
      },
      scene
    );
    body.material = material;
    body.rotation.x = -Math.PI / 2;
    body.parent = this.root;

    const fin = this.createFin(`enemy-${index}-top-fin`, scene, material);
    fin.position.y = 0.34;

    const bottomFin = this.createFin(`enemy-${index}-bottom-fin`, scene, material);
    bottomFin.position.y = -0.34;
    bottomFin.rotation.z = Math.PI;

    this.root.setEnabled(false);
  }

  static createMaterial(scene: Scene): StandardMaterial {
    const material = new StandardMaterial("enemy-placeholder-material", scene);
    material.diffuseColor = new Color3(1, 0.28, 0.18);
    material.emissiveColor = new Color3(0.22, 0.04, 0.02);
    return material;
  }

  get isActive(): boolean {
    return this.active;
  }

  get position(): Vector3 {
    return this.root.position;
  }

  get collisionRadius(): number {
    return GAME_CONFIG.enemies.collisionRadius;
  }

  spawn(position: Vector3): void {
    this.active = true;
    this.root.position.copyFrom(position);
    this.root.rotation.y = 0;
    this.root.setEnabled(true);
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    this.root.position.z -= GAME_CONFIG.enemies.speed * deltaSeconds;
    this.root.rotation.z += deltaSeconds * 1.8;

    if (this.root.position.z <= GAME_CONFIG.enemies.deactivateZ) {
      this.deactivate();
    }
  }

  deactivate(): void {
    this.active = false;
    this.root.setEnabled(false);
  }

  dispose(): void {
    this.root.dispose(false, true);
  }

  private createFin(name: string, scene: Scene, material: StandardMaterial): Mesh {
    const fin = MeshBuilder.CreateBox(
      name,
      {
        width: 0.16,
        height: 0.35,
        depth: 0.58
      },
      scene
    );
    fin.material = material;
    fin.position.z = 0.06;
    fin.parent = this.root;
    return fin;
  }
}
