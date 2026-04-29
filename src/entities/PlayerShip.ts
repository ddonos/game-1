import { Color3 } from "@babylonjs/core/Maths/math.color";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";
import { Mesh } from "@babylonjs/core/Meshes/mesh";
import { MeshBuilder } from "@babylonjs/core/Meshes/meshBuilder";
import { Scene } from "@babylonjs/core/scene";
import { StandardMaterial } from "@babylonjs/core/Materials/standardMaterial";
import { TransformNode } from "@babylonjs/core/Meshes/transformNode";

import { GAME_CONFIG } from "../config/gameConfig";
import type { MovementVector } from "../systems/InputController";

export class PlayerShip {
  private readonly root: TransformNode;
  private readonly visualMeshes: Mesh[] = [];
  private invulnerabilityRemaining = 0;

  constructor(scene: Scene) {
    this.root = new TransformNode("player-ship", scene);
    this.root.position = new Vector3(
      GAME_CONFIG.player.startPosition.x,
      GAME_CONFIG.player.startPosition.y,
      GAME_CONFIG.player.startPosition.z
    );

    const hullMaterial = new StandardMaterial("player-hull-material", scene);
    hullMaterial.diffuseColor = new Color3(0.25, 0.8, 1);
    hullMaterial.emissiveColor = new Color3(0.04, 0.16, 0.22);

    const wingMaterial = new StandardMaterial("player-wing-material", scene);
    wingMaterial.diffuseColor = new Color3(0.9, 0.95, 1);
    wingMaterial.emissiveColor = new Color3(0.08, 0.08, 0.12);

    const hull = MeshBuilder.CreateCylinder(
      "player-hull",
      {
        diameterTop: 0.18,
        diameterBottom: 0.72,
        height: 1.35,
        tessellation: 4
      },
      scene
    );
    hull.material = hullMaterial;
    hull.rotation.x = Math.PI / 2;
    hull.parent = this.root;
    this.visualMeshes.push(hull);

    const leftWing = this.createWing("player-left-wing", scene, wingMaterial);
    leftWing.position.x = -0.48;
    leftWing.rotation.z = 0.25;
    this.visualMeshes.push(leftWing);

    const rightWing = this.createWing("player-right-wing", scene, wingMaterial);
    rightWing.position.x = 0.48;
    rightWing.rotation.z = -0.25;
    this.visualMeshes.push(rightWing);
  }

  update(deltaSeconds: number, movement: MovementVector): void {
    const nextX =
      this.root.position.x + movement.x * GAME_CONFIG.player.speed * deltaSeconds;
    const nextY =
      this.root.position.y + movement.y * GAME_CONFIG.player.speed * deltaSeconds;

    this.root.position.x = clamp(
      nextX,
      -GAME_CONFIG.player.bounds.x,
      GAME_CONFIG.player.bounds.x
    );
    this.root.position.y = clamp(
      nextY,
      GAME_CONFIG.player.bounds.yMin,
      GAME_CONFIG.player.bounds.yMax
    );

    this.root.rotation.z = -movement.x * 0.22;
    this.root.rotation.x = movement.y * 0.12;
    this.updateInvulnerability(deltaSeconds);
  }

  get position(): Vector3 {
    return this.root.position;
  }

  get collisionRadius(): number {
    return GAME_CONFIG.player.collisionRadius;
  }

  get isInvulnerable(): boolean {
    return this.invulnerabilityRemaining > 0;
  }

  startInvulnerability(): void {
    this.invulnerabilityRemaining = GAME_CONFIG.player.invulnerabilitySeconds;
  }

  reset(): void {
    this.root.position.set(
      GAME_CONFIG.player.startPosition.x,
      GAME_CONFIG.player.startPosition.y,
      GAME_CONFIG.player.startPosition.z
    );
    this.root.rotation.set(0, 0, 0);
    this.invulnerabilityRemaining = 0;
    this.setVisualsVisible(true);
  }

  writeMuzzlePositionToRef(target: Vector3): void {
    target.set(
      this.root.position.x + GAME_CONFIG.player.muzzleOffset.x,
      this.root.position.y + GAME_CONFIG.player.muzzleOffset.y,
      this.root.position.z + GAME_CONFIG.player.muzzleOffset.z
    );
  }

  dispose(): void {
    this.root.dispose(false, true);
  }

  private createWing(name: string, scene: Scene, material: StandardMaterial): Mesh {
    const wing = MeshBuilder.CreateBox(
      name,
      {
        width: 0.7,
        height: 0.08,
        depth: 0.8
      },
      scene
    );
    wing.material = material;
    wing.position.z = -0.12;
    wing.parent = this.root;
    return wing;
  }

  private updateInvulnerability(deltaSeconds: number): void {
    if (this.invulnerabilityRemaining <= 0) {
      this.setVisualsVisible(true);
      return;
    }

    this.invulnerabilityRemaining = Math.max(
      0,
      this.invulnerabilityRemaining - deltaSeconds
    );

    if (this.invulnerabilityRemaining === 0) {
      this.setVisualsVisible(true);
      return;
    }

    const blinkIndex = Math.floor(
      this.invulnerabilityRemaining / GAME_CONFIG.player.blinkIntervalSeconds
    );
    this.setVisualsVisible(blinkIndex % 2 === 0);
  }

  private setVisualsVisible(isVisible: boolean): void {
    for (const mesh of this.visualMeshes) {
      mesh.isVisible = isVisible;
    }
  }
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
