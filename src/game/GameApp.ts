import { Engine } from "@babylonjs/core/Engines/engine";

import { GAME_CONFIG } from "../config/gameConfig";
import { PlayerShip } from "../entities/PlayerShip";
import { InputController } from "../systems/InputController";
import { Starfield } from "../systems/Starfield";
import type { HudController } from "../ui/hud";
import { createScene } from "./createScene";

export class GameApp {
  private readonly engine: Engine;
  private readonly input = new InputController();
  private readonly resizeObserver: ResizeObserver;
  private player?: PlayerShip;
  private starfield?: Starfield;

  constructor(
    canvas: HTMLCanvasElement,
    private readonly hud: HudController
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
    this.starfield = new Starfield();
    void this.starfield.create(scene);

    this.hud.update({
      lives: GAME_CONFIG.initialLives,
      score: GAME_CONFIG.initialScore,
      currency: GAME_CONFIG.initialCurrency,
      stage: GAME_CONFIG.initialStage
    });

    this.engine.runRenderLoop(() => {
      const deltaSeconds = this.engine.getDeltaTime() / 1000;
      const movement = this.input.getMovement();

      this.player?.update(deltaSeconds, movement);
      this.starfield?.update(deltaSeconds);

      scene.render();
    });
  }

  dispose(): void {
    this.resizeObserver.disconnect();
    this.starfield?.dispose();
    this.player?.dispose();
    this.input.dispose();
    this.engine.dispose();
  }
}
