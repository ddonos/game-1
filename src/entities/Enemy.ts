import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";

import { GAME_CONFIG } from "../config/gameConfig";
import {
  ENEMY_TYPES,
  type EnemyTypeConfig,
  type EnemyTypeId
} from "../config/enemyTypes";
import type { StageConfig } from "../config/stageConfigs";
import type { EnemyProjectilePool } from "../systems/EnemyProjectilePool";

export class Enemy {
  private readonly root: TransformNode;
  private readonly body: Mesh;
  private readonly fins: Mesh[] = [];
  private active = false;
  private collisionRadiusValue = ENEMY_TYPES.basic.collisionRadius;
  private currentHealth = ENEMY_TYPES.basic.health;
  private currencyRewardValue = ENEMY_TYPES.basic.currencyReward;
  private fireCooldownRemaining = 0;
  private fireCooldownSeconds = ENEMY_TYPES.basic.firing.cooldownSeconds;
  private fireEnabled = false;
  private projectileRadius = ENEMY_TYPES.basic.firing.projectileRadius;
  private projectileScale = ENEMY_TYPES.basic.firing.projectileScale;
  private projectileSpeed = ENEMY_TYPES.basic.firing.projectileSpeed;
  private projectileType = ENEMY_TYPES.basic.id;
  private scoreRewardValue = ENEMY_TYPES.basic.scoreReward;
  private speed: number = GAME_CONFIG.enemies.baseSpeed;

  constructor(
    scene: Scene,
    private readonly materials: Record<EnemyTypeId, StandardMaterial>,
    index: number
  ) {
    this.root = new TransformNode(`enemy-${index}`, scene);

    this.body = MeshBuilder.CreateCylinder(
      `enemy-${index}-body`,
      {
        diameterTop: 0.2,
        diameterBottom: 0.8,
        height: 1.25,
        tessellation: 6
      },
      scene
    );
    this.body.material = materials.basic;
    this.body.rotation.x = -Math.PI / 2;
    this.body.parent = this.root;

    const fin = this.createFin(`enemy-${index}-top-fin`, scene);
    fin.position.y = 0.34;

    const bottomFin = this.createFin(`enemy-${index}-bottom-fin`, scene);
    bottomFin.position.y = -0.34;
    bottomFin.rotation.z = Math.PI;

    this.root.setEnabled(false);
  }

  static createMaterials(scene: Scene): Record<EnemyTypeId, StandardMaterial> {
    return {
      basic: createMaterial(scene, ENEMY_TYPES.basic),
      fast: createMaterial(scene, ENEMY_TYPES.fast),
      tank: createMaterial(scene, ENEMY_TYPES.tank)
    };
  }

  get isActive(): boolean {
    return this.active;
  }

  get position(): Vector3 {
    return this.root.position;
  }

  get collisionRadius(): number {
    return this.collisionRadiusValue;
  }

  get currencyReward(): number {
    return this.currencyRewardValue;
  }

  get scoreReward(): number {
    return this.scoreRewardValue;
  }

  spawn(position: Vector3, type: EnemyTypeConfig, stageConfig: StageConfig): void {
    this.active = true;
    this.currentHealth = type.health;
    this.collisionRadiusValue = type.collisionRadius;
    this.fireEnabled = stageConfig.stageNumber >= type.firing.enabledFromStage;
    this.fireCooldownSeconds =
      type.firing.cooldownSeconds / stageConfig.enemyFireRateMultiplier;
    this.fireCooldownRemaining = this.fireCooldownSeconds * randomCooldownOffset();
    this.projectileRadius = type.firing.projectileRadius;
    this.projectileScale = type.firing.projectileScale;
    this.projectileSpeed = type.firing.projectileSpeed;
    this.projectileType = type.id;
    this.speed =
      GAME_CONFIG.enemies.baseSpeed *
      type.speedMultiplier *
      stageConfig.enemySpeedMultiplier;
    this.scoreRewardValue = Math.round(type.scoreReward * stageConfig.scoreMultiplier);
    this.currencyRewardValue = Math.round(
      type.currencyReward * stageConfig.currencyMultiplier
    );
    this.root.position.copyFrom(position);
    this.root.rotation.y = 0;
    this.root.scaling.set(type.visualScale.x, type.visualScale.y, type.visualScale.z);
    this.setMaterial(this.materials[type.id]);
    this.root.setEnabled(true);
  }

  takeHit(damage: number): boolean {
    this.currentHealth -= damage;
    return this.currentHealth <= 0;
  }

  update(deltaSeconds: number): void {
    if (!this.active) {
      return;
    }

    this.root.position.z -= this.speed * deltaSeconds;
    this.root.rotation.z += deltaSeconds * 1.8;

    if (this.root.position.z <= GAME_CONFIG.enemies.deactivateZ) {
      this.deactivate();
    }
  }

  updateFiring(
    deltaSeconds: number,
    playerPosition: Vector3,
    enemyProjectiles: EnemyProjectilePool
  ): void {
    if (!this.active || !this.fireEnabled) {
      return;
    }

    this.fireCooldownRemaining -= deltaSeconds;

    if (this.fireCooldownRemaining > 0) {
      return;
    }

    enemyProjectiles.fire({
      origin: this.root.position,
      target: playerPosition,
      speed: this.projectileSpeed,
      collisionRadius: this.projectileRadius,
      scale: this.projectileScale,
      type: this.projectileType
    });
    this.fireCooldownRemaining = this.fireCooldownSeconds;
  }

  deactivate(): void {
    this.active = false;
    this.fireCooldownRemaining = 0;
    this.root.setEnabled(false);
  }

  dispose(): void {
    this.root.dispose(false, true);
  }

  private createFin(name: string, scene: Scene): Mesh {
    const fin = MeshBuilder.CreateBox(
      name,
      {
        width: 0.16,
        height: 0.35,
        depth: 0.58
      },
      scene
    );
    fin.material = this.materials.basic;
    fin.position.z = 0.06;
    fin.parent = this.root;
    this.fins.push(fin);
    return fin;
  }

  private setMaterial(material: StandardMaterial): void {
    this.body.material = material;

    for (const fin of this.fins) {
      fin.material = material;
    }
  }
}

function randomCooldownOffset(): number {
  return 0.45 + Math.random() * 0.7;
}

function createMaterial(scene: Scene, type: EnemyTypeConfig): StandardMaterial {
  const material = new StandardMaterial(`enemy-${type.id}-material`, scene);
  material.diffuseColor = type.color;
  material.emissiveColor = type.emissiveColor;
  return material;
}
