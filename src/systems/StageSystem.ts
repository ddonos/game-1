import { GAME_CONFIG } from "../config/gameConfig";

export class StageSystem {
  private timeRemaining: number = GAME_CONFIG.stagePlan.normalStageDurationSeconds;

  get remainingSeconds(): number {
    return this.timeRemaining;
  }

  update(deltaSeconds: number): boolean {
    this.timeRemaining = Math.max(0, this.timeRemaining - deltaSeconds);
    return this.timeRemaining === 0;
  }

  resetTimer(): void {
    this.timeRemaining = GAME_CONFIG.stagePlan.normalStageDurationSeconds;
  }

  isFinalStage(stage: number): boolean {
    return stage >= GAME_CONFIG.stagePlan.totalStages;
  }
}
