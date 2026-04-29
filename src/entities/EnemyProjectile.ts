import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { GAME_CONFIG } from "../config/gameConfig";
import type { EnemyTypeId } from "../config/enemyTypes";

export type EnemyProjectileSpawn = {
  origin: Vector3;
  target: Vector3;
  speed: number;
  collisionRadius: number;
  scale: {
    x: number;
    y: number;
    z: number;
  };
  type: EnemyTypeId;
};

export class EnemyProjectile {
  private readonly direction = new Vector3();
  private readonly mesh: Mesh;
  private active = false;
  private collisionRadiusValue = 0.25;
  private speed = 0;
  private travelDistance = 0;

  constructor(
    scene: Scene,
    private readonly materials: Record<EnemyTypeId, StandardMaterial>,
    index: number
  ) {
    this.mesh = MeshBuilder.CreateBox(
      `enemy-projectile-${index}`,
      {
        width: 1,
        height: 1,
        depth: 1
      },
      scene
    );
    this.mesh.material = materials.basic;
    this.mesh.setEnabled(false);
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

  fire(spawn: EnemyProjectileSpawn): void {
    this.active = true;
    this.collisionRadiusValue = spawn.collisionRadius;
    this.speed = spawn.speed;
    this.travelDistance = 0;
    this.mesh.material = this.materials[spawn.type];
    this.mesh.position.copyFrom(spawn.origin);
    this.mesh.scaling.set(spawn.scale.x, spawn.scale.y, spawn.scale.z);
    this.direction.copyFrom(spawn.target).subtractInPlace(spawn.origin).normalize();
    this.mesh.setEnabled(true);
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    const distance = this.speed * deltaSeconds;
    this.mesh.position.x += this.direction.x * distance;
    this.mesh.position.y += this.direction.y * distance;
    this.mesh.position.z += this.direction.z * distance;
    this.travelDistance += distance;

    if (
      this.travelDistance >= GAME_CONFIG.enemyProjectiles.maxTravelDistance ||
      this.mesh.position.z <= GAME_CONFIG.enemies.deactivateZ
    ) {
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
