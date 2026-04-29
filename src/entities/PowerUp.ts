import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import {
  POWER_UP_CONFIG,
  type PowerUpConfig,
  type PowerUpTypeId
} from "../config/powerUps";

export class PowerUp {
  private readonly mesh: Mesh;
  private active = false;
  private collisionRadiusValue = POWER_UP_CONFIG.types.repair.collisionRadius;
  private typeValue: PowerUpTypeId = "repair";

  constructor(
    scene: Scene,
    private readonly materials: Record<PowerUpTypeId, StandardMaterial>,
    index: number
  ) {
    this.mesh = MeshBuilder.CreatePolyhedron(
      `power-up-${index}`,
      {
        type: 1,
        size: 1
      },
      scene
    );
    this.mesh.material = materials.repair;
    this.mesh.setEnabled(false);
  }

  static createMaterials(scene: Scene): Record<PowerUpTypeId, StandardMaterial> {
    return {
      repair: createMaterial(scene, POWER_UP_CONFIG.types.repair),
      rapidFire: createMaterial(scene, POWER_UP_CONFIG.types.rapidFire),
      shield: createMaterial(scene, POWER_UP_CONFIG.types.shield),
      scoreMultiplier: createMaterial(scene, POWER_UP_CONFIG.types.scoreMultiplier)
    };
  }

  get isActive(): boolean {
    return this.active;
  }

  get position(): Vector3 {
    return this.mesh.position;
  }

  get collisionRadius(): number {
    return this.collisionRadiusValue;
  }

  get type(): PowerUpTypeId {
    return this.typeValue;
  }

  spawn(position: Vector3, config: PowerUpConfig): void {
    this.active = true;
    this.typeValue = config.id;
    this.collisionRadiusValue = config.collisionRadius;
    this.mesh.material = this.materials[config.id];
    this.mesh.position.copyFrom(position);
    this.mesh.scaling.set(
      config.visualScale.x,
      config.visualScale.y,
      config.visualScale.z
    );
    this.mesh.setEnabled(true);
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    this.mesh.position.z -= POWER_UP_CONFIG.speed * deltaSeconds;
    this.mesh.rotation.y += deltaSeconds * 1.6;
    this.mesh.rotation.z += deltaSeconds * 1.1;

    if (this.mesh.position.z <= POWER_UP_CONFIG.deactivateZ) {
      this.deactivate();
    }
  }

  deactivate(): void {
    this.active = false;
    this.mesh.setEnabled(false);
  }

  dispose(): void {
    this.mesh.dispose();
  }
}

function createMaterial(scene: Scene, config: PowerUpConfig): StandardMaterial {
  const material = new StandardMaterial(`power-up-${config.id}-material`, scene);
  material.diffuseColor = config.color;
  material.emissiveColor = config.emissiveColor;
  return material;
}
