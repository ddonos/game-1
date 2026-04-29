import { GAME_CONFIG } from "../config/gameConfig";
import { getStageConfig, type StageConfig } from "../config/stageConfigs";

export class StageSystem {
  private currentStageConfig: StageConfig = getStageConfig(GAME_CONFIG.initialStage);
  private timeRemaining: number = this.currentStageConfig.durationSeconds;

  get config(): StageConfig {
    return this.currentStageConfig;
  }

  get remainingSeconds(): number {
    return this.timeRemaining;
  }

  update(deltaSeconds: number): boolean {
    this.timeRemaining = Math.max(0, this.timeRemaining - deltaSeconds);
    return this.timeRemaining === 0;
  }

  setStage(stageNumber: number): void {
    this.currentStageConfig = getStageConfig(stageNumber);
    this.resetTimer();
  }

  resetTimer(): void {
    this.timeRemaining = this.currentStageConfig.durationSeconds;
  }

  isFinalStage(stage: number): boolean {
    return stage >= GAME_CONFIG.stagePlan.totalStages;
  }
}
