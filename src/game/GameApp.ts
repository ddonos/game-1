import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import { GAME_CONFIG } from "../config/gameConfig";
import { PlayerShip } from "../entities/PlayerShip";
import { CombatSystem } from "../systems/CombatSystem";
import { EnemyPool } from "../systems/EnemyPool";
import { HitFeedbackPool } from "../systems/HitFeedbackPool";
import { InputController } from "../systems/InputController";
import { ProjectilePool } from "../systems/ProjectilePool";
import { Starfield } from "../systems/Starfield";
import type { GameOverOverlayController } from "../ui/gameOverOverlay";
import type { HudController } from "../ui/hud";
import type { GameState } from "../utils/types";
import { createScene } from "./createScene";

export class GameApp {
  private readonly engine: Engine;
  private readonly input = new InputController();
  private readonly fireOrigin = new Vector3();
  private readonly gameState: GameState = {
    lives: GAME_CONFIG.initialLives,
    score: GAME_CONFIG.initialScore,
    currency: GAME_CONFIG.initialCurrency,
    stage: GAME_CONFIG.initialStage
  };
  private readonly resizeObserver: ResizeObserver;
  private combat?: CombatSystem;
  private player?: PlayerShip;
  private enemies?: EnemyPool;
  private hitFeedback?: HitFeedbackPool;
  private isGameOver = false;
  private projectiles?: ProjectilePool;
  private starfield?: Starfield;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly hud: HudController,
    private readonly gameOverOverlay: GameOverOverlayController
  ) {
    this.engine = new Engine(canvas, true, {
      antialias: true,
      adaptToDeviceRatio: true,
      preserveDrawingBuffer: false,
      stencil: false,
      premultipliedAlpha: false
    });

    this.resizeObserver = new ResizeObserver(() => {
      this.engine.resize();
    });
    this.resizeObserver.observe(canvas);
  }

  start(): void {
    const scene = createScene(this.engine);
    this.player = new PlayerShip(scene);
    this.enemies = new EnemyPool(scene);
    this.projectiles = new ProjectilePool(scene);
    this.hitFeedback = new HitFeedbackPool(scene);
    this.combat = new CombatSystem(this.projectiles, this.enemies, this.hitFeedback);
    this.starfield = new Starfield();
    void this.starfield.create(scene);

    this.hud.update(this.gameState);

    this.engine.runRenderLoop(() => {
      const deltaSeconds = this.engine.getDeltaTime() / 1000;
      const shouldRestart = this.input.consumeRestart();

      if (this.isGameOver) {
        if (shouldRestart) {
          this.restartRun();
        }

        this.starfield?.update(deltaSeconds);
        scene.render();
        return;
      }

      const movement = this.input.getMovement();
      const shouldFire = this.input.isFirePressed() || this.input.consumePointerFire();

      this.player?.update(deltaSeconds, movement);
      this.player?.writeMuzzlePositionToRef(this.fireOrigin);
      this.projectiles?.update(deltaSeconds, shouldFire, this.fireOrigin);
      this.enemies?.update(deltaSeconds);
      if (this.player) {
        this.combat?.update(this.player);
      }
      this.applyCombatResults();
      this.hitFeedback?.update(deltaSeconds);
      this.starfield?.update(deltaSeconds);

      scene.render();
    });
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.starfield?.dispose();
    this.hitFeedback?.dispose();
    this.projectiles?.dispose();
    this.enemies?.dispose();
    this.player?.dispose();
    this.input.dispose();
    this.engine.dispose();
  }

  restartRun(): void {
    this.gameState.lives = GAME_CONFIG.initialLives;
    this.gameState.score = GAME_CONFIG.initialScore;
    this.gameState.currency = GAME_CONFIG.initialCurrency;
    this.gameState.stage = GAME_CONFIG.initialStage;
    this.isGameOver = false;

    this.combat?.reset();
    this.enemies?.deactivateAll();
    this.projectiles?.deactivateAll();
    this.hitFeedback?.deactivateAll();
    this.player?.reset();
    this.hud.update(this.gameState);
    this.gameOverOverlay.hide();
  }

  private applyCombatResults(): void {
    if (!this.combat) {
      return;
    }

    const score = this.combat.consumeScore();
    const currency = this.combat.consumeCurrency();
    const lifeLoss = this.combat.consumeLifeLoss();

    if (score === 0 && currency === 0 && lifeLoss === 0) {
      return;
    }

    this.gameState.score += score;
    this.gameState.currency += currency;
    this.gameState.lives = Math.max(0, this.gameState.lives - lifeLoss);
    this.hud.update(this.gameState);

    if (lifeLoss > 0 && this.gameState.lives > 0) {
      this.player?.startInvulnerability();
    }

    if (this.gameState.lives === 0) {
      this.enterGameOver();
    }
  }

  private enterGameOver(): void {
    this.isGameOver = true;
    this.enemies?.deactivateAll();
    this.projectiles?.deactivateAll();
    this.hitFeedback?.deactivateAll();
    this.gameOverOverlay.show(this.gameState);
  }
}
