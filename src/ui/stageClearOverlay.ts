import type { GameState } from "../utils/types";

export type StageClearOverlayState = {
  clearedStage: number;
  isRunComplete: boolean;
  state: GameState;
};

export type StageClearOverlayController = {
  show: (overlayState: StageClearOverlayState) => void;
  hide: () => void;
};

export function createStageClearOverlay(
  root: HTMLElement,
  onContinue: () => void
): StageClearOverlayController {
  const overlay = document.createElement("section");
  overlay.className = "stage-clear";
  overlay.hidden = true;
  overlay.setAttribute("aria-label", "Run complete");

  const title = document.createElement("h1");
  title.className = "stage-clear__title";

  const stats = document.createElement("div");
  stats.className = "stage-clear__stats";

  const stage = createStat("Stage");
  const score = createStat("Score");
  const currency = createStat("Currency");
  const lives = createStat("Lives");
  stats.append(stage.element, score.element, currency.element, lives.element);

  const continueButton = document.createElement("button");
  continueButton.className = "stage-clear__button";
  continueButton.type = "button";
  continueButton.addEventListener("click", onContinue);

  const hint = document.createElement("p");
  hint.className = "stage-clear__hint";

  overlay.append(title, stats, continueButton, hint);
  root.append(overlay);

  return {
    show(overlayState) {
      title.textContent = overlayState.isRunComplete ? "RUN COMPLETE" : "WAVE PASSED";
      stage.value.textContent = String(overlayState.clearedStage);
      score.value.textContent = String(overlayState.state.score);
      currency.value.textContent = String(overlayState.state.currency);
      lives.value.textContent = String(overlayState.state.lives);
      continueButton.textContent = overlayState.isRunComplete ? "Restart" : "Close";
      hint.textContent = overlayState.isRunComplete
        ? "Press Enter to restart"
        : "Normal waves advance automatically";
      overlay.hidden = false;
      continueButton.focus();
    },
    hide() {
      overlay.hidden = true;
    }
  };
}

function createStat(label: string): {
  element: HTMLElement;
  value: HTMLElement;
} {
  const element = document.createElement("div");
  element.className = "stage-clear__stat";

  const labelElement = document.createElement("span");
  labelElement.className = "stage-clear__stat-label";
  labelElement.textContent = label;

  const value = document.createElement("strong");
  value.className = "stage-clear__stat-value";
  value.textContent = "0";

  element.append(labelElement, value);
  return { element, value };
}
