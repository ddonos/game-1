import { Engine } from "@babylonjs/core/Engines/engine";
import { Vector3 } from "@babylonjs/core/Maths/math.vector";

import { GAME_CONFIG } from "../config/gameConfig";
import { getStageConfig } from "../config/stageConfigs";
import { PlayerShip } from "../entities/PlayerShip";
import { CombatSystem } from "../systems/CombatSystem";
import { EffectSystem } from "../systems/EffectSystem";
import { EnemyProjectilePool } from "../systems/EnemyProjectilePool";
import { EnemyPool } from "../systems/EnemyPool";
import { HitFeedbackPool } from "../systems/HitFeedbackPool";
import { InputController } from "../systems/InputController";
import { ProjectilePool } from "../systems/ProjectilePool";
import { PowerUpPool } from "../systems/PowerUpPool";
import { StageSystem } from "../systems/StageSystem";
import { Starfield } from "../systems/Starfield";
import type { GameOverOverlayController } from "../ui/gameOverOverlay";
import type { HudController } from "../ui/hud";
import type { MainMenuOverlayController } from "../ui/mainMenuOverlay";
import type { PauseMenuOverlayController } from "../ui/pauseMenuOverlay";
import type { StageClearOverlayController } from "../ui/stageClearOverlay";
import type { GameState } from "../utils/types";
import { createScene } from "./createScene";

type RunState =
  | "mainMenu"
  | "playing"
  | "paused"
  | "stageClear"
  | "gameOver"
  | "runComplete";

export class GameApp {
  private readonly engine: Engine;
  private readonly input = new InputController();
  private readonly fireOrigin = new Vector3();
  private readonly gameState: GameState = {
    lives: GAME_CONFIG.initialLives,
    score: GAME_CONFIG.initialScore,
    currency: GAME_CONFIG.initialCurrency,
    stage: GAME_CONFIG.initialStage,
    stageTimeRemaining: getStageConfig(GAME_CONFIG.initialStage).durationSeconds,
    effects: {
      rapidFireSeconds: 0,
      shieldSeconds: 0,
      scoreMultiplierSeconds: 0
    }
  };
  private readonly resizeObserver: ResizeObserver;
  private combat?: CombatSystem;
  private effects = new EffectSystem();
  private player?: PlayerShip;
  private enemies?: EnemyPool;
  private enemyProjectiles?: EnemyProjectilePool;
  private hitFeedback?: HitFeedbackPool;
  private powerUps?: PowerUpPool;
  private projectiles?: ProjectilePool;
  private runState: RunState = "mainMenu";
  private stageSystem = new StageSystem();
  private starfield?: Starfield;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly hud: HudController,
    private readonly mainMenuOverlay: MainMenuOverlayController,
    private readonly pauseMenuOverlay: PauseMenuOverlayController,
    private readonly gameOverOverlay: GameOverOverlayController,
    private readonly stageClearOverlay: StageClearOverlayController
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
    this.enemyProjectiles = new EnemyProjectilePool(scene);
    this.projectiles = new ProjectilePool(scene);
    this.powerUps = new PowerUpPool(scene);
    this.hitFeedback = new HitFeedbackPool(scene);
    this.combat = new CombatSystem(
      this.projectiles,
      this.enemyProjectiles,
      this.enemies,
      this.hitFeedback
    );
    this.starfield = new Starfield();
    void this.starfield.create(scene);

    this.hud.update(this.gameState);
    this.hud.hide();
    this.mainMenuOverlay.show();

    this.engine.runRenderLoop(() => {
      const deltaSeconds = this.engine.getDeltaTime() / 1000;
      const shouldRestart = this.input.consumeRestart();
      const shouldContinue = this.input.consumeContinue();
      const shouldPause = this.input.consumePause();

      if (this.runState === "mainMenu") {
        this.starfield?.update(deltaSeconds);
        scene.render();
        return;
      }

      if (this.runState === "gameOver") {
        if (shouldRestart) {
          this.restartRun();
        }

        this.starfield?.update(deltaSeconds);
        scene.render();
        return;
      }

      if (this.runState === "stageClear" || this.runState === "runComplete") {
        if (shouldContinue) {
          this.continueFromStageClear();
        }

        this.starfield?.update(deltaSeconds);
        scene.render();
        return;
      }

      if (this.runState === "paused") {
        if (shouldPause) {
          this.resumeGameplay();
        }

        this.starfield?.update(deltaSeconds);
        scene.render();
        return;
      }

      if (shouldPause) {
        this.pauseGameplay();
        scene.render();
        return;
      }

      const movement = this.input.getMovement();
      const shouldFire = this.input.isFirePressed() || this.input.consumePointerFire();

      this.player?.update(deltaSeconds, movement);
      this.player?.writeMuzzlePositionToRef(this.fireOrigin);
      this.effects.update(deltaSeconds);
      this.projectiles?.update(
        deltaSeconds,
        shouldFire,
        this.fireOrigin,
        this.effects.getFireCooldownSeconds()
      );
      this.enemies?.update(deltaSeconds);
      if (this.player && this.enemyProjectiles) {
        this.enemies?.updateFiring(
          deltaSeconds,
          this.player.position,
          this.enemyProjectiles
        );
        this.enemyProjectiles.update(deltaSeconds);
        this.combat?.update(this.player);
        this.powerUps?.update(deltaSeconds, this.player, this.effects);
      }
      this.applyCombatResults();
      this.applyPowerUpResults();
      this.hitFeedback?.update(deltaSeconds);
      this.updateStageTimer(deltaSeconds);
      this.starfield?.update(deltaSeconds);

      scene.render();
    });
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.starfield?.dispose();
    this.hitFeedback?.dispose();
    this.projectiles?.dispose();
    this.enemyProjectiles?.dispose();
    this.powerUps?.dispose();
    this.enemies?.dispose();
    this.player?.dispose();
    this.input.dispose();
    this.engine.dispose();
  }

  restartRun(): void {
    this.resetRunState();
    this.runState = "playing";
    this.hud.show();
    this.hideAllOverlays();
  }

  startRunFromMainMenu(): void {
    this.restartRun();
  }

  resumeGameplay(): void {
    if (this.runState !== "paused") {
      return;
    }

    this.runState = "playing";
    this.pauseMenuOverlay.hide();
    this.hud.show();
  }

  pauseGameplay(): void {
    if (this.runState !== "playing") {
      return;
    }

    this.runState = "paused";
    this.pauseMenuOverlay.show();
  }

  returnToMainMenu(): void {
    this.resetRunState();
    this.runState = "mainMenu";
    this.hideAllOverlays();
    this.hud.hide();
    this.mainMenuOverlay.show();
  }

  private resetRunState(): void {
    this.gameState.lives = GAME_CONFIG.initialLives;
    this.gameState.score = GAME_CONFIG.initialScore;
    this.gameState.currency = GAME_CONFIG.initialCurrency;
    this.gameState.stage = GAME_CONFIG.initialStage;
    this.effects.clear();
    this.gameState.effects = this.effects.getSnapshot();
    this.stageSystem.setStage(this.gameState.stage);
    this.enemies?.setStageConfig(this.stageSystem.config);
    this.gameState.stageTimeRemaining = this.stageSystem.remainingSeconds;

    this.combat?.reset();
    this.enemies?.deactivateAll();
    this.projectiles?.deactivateAll();
    this.enemyProjectiles?.deactivateAll();
    this.powerUps?.deactivateAll();
    this.hitFeedback?.deactivateAll();
    this.player?.reset();
    this.hud.update(this.gameState);
  }

  continueFromStageClear(): void {
    if (this.runState !== "stageClear" && this.runState !== "runComplete") {
      return;
    }

    if (this.runState === "runComplete") {
      this.restartRun();
      return;
    }

    this.gameState.stage += 1;
    this.stageSystem.setStage(this.gameState.stage);
    this.enemies?.setStageConfig(this.stageSystem.config);
    this.gameState.stageTimeRemaining = this.stageSystem.remainingSeconds;
    this.runState = "playing";

    this.combat?.reset();
    this.enemies?.deactivateAll();
    this.projectiles?.deactivateAll();
    this.enemyProjectiles?.deactivateAll();
    this.powerUps?.deactivateAll();
    this.hitFeedback?.deactivateAll();
    this.player?.reset();
    this.stageClearOverlay.hide();
    this.hud.show();
    this.hud.update(this.gameState);
  }

  private applyCombatResults(): void {
    if (!this.combat) {
      return;
    }

    this.combat.applyScoreMultiplier(this.effects.getScoreMultiplier());
    this.combat.absorbPendingDamage(this.effects);
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

  private applyPowerUpResults(): void {
    const repair = this.effects.consumeRepair();
    this.gameState.effects = this.effects.getSnapshot();

    if (repair > 0) {
      this.gameState.lives = Math.min(
        GAME_CONFIG.initialLives,
        this.gameState.lives + repair
      );
    }

    if (repair > 0 || hasActiveEffect(this.gameState.effects)) {
      this.hud.update(this.gameState);
    }
  }

  private updateStageTimer(deltaSeconds: number): void {
    if (this.runState !== "playing") {
      return;
    }

    const isStageComplete = this.stageSystem.update(deltaSeconds);
    this.gameState.stageTimeRemaining = this.stageSystem.remainingSeconds;
    this.hud.update(this.gameState);

    if (isStageComplete && this.gameState.lives > 0) {
      this.enterStageClear();
    }
  }

  private enterGameOver(): void {
    this.runState = "gameOver";
    this.enemies?.deactivateAll();
    this.projectiles?.deactivateAll();
    this.enemyProjectiles?.deactivateAll();
    this.powerUps?.deactivateAll();
    this.effects.clear();
    this.gameState.effects = this.effects.getSnapshot();
    this.hitFeedback?.deactivateAll();
    this.hud.update(this.gameState);
    this.pauseMenuOverlay.hide();
    this.stageClearOverlay.hide();
    this.gameOverOverlay.show(this.gameState);
  }

  private enterStageClear(): void {
    const isRunComplete = this.stageSystem.isFinalStage(this.gameState.stage);
    this.runState = isRunComplete ? "runComplete" : "stageClear";
    this.enemies?.deactivateAll();
    this.projectiles?.deactivateAll();
    this.enemyProjectiles?.deactivateAll();
    this.powerUps?.deactivateAll();
    this.hitFeedback?.deactivateAll();
    this.stageClearOverlay.show({
      clearedStage: this.gameState.stage,
      isRunComplete,
      state: this.gameState
    });
  }

  private hideAllOverlays(): void {
    this.mainMenuOverlay.hide();
    this.pauseMenuOverlay.hide();
    this.gameOverOverlay.hide();
    this.stageClearOverlay.hide();
  }
}

function hasActiveEffect(effects: GameState["effects"]): boolean {
  return (
    effects.rapidFireSeconds > 0 ||
    effects.shieldSeconds > 0 ||
    effects.scoreMultiplierSeconds > 0
  );
}
