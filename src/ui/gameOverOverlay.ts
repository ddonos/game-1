import type { GameState } from "../utils/types";

export type GameOverOverlayController = {
  show: (state: GameState) => void;
  hide: () => void;
};

export function createGameOverOverlay(
  root: HTMLElement,
  onRestart: () => void
): GameOverOverlayController {
  const overlay = document.createElement("section");
  overlay.className = "game-over";
  overlay.hidden = true;
  overlay.setAttribute("aria-label", "Game over");

  const title = document.createElement("h1");
  title.className = "game-over__title";
  title.textContent = "GAME OVER";

  const stats = document.createElement("div");
  stats.className = "game-over__stats";

  const score = createStat("Final Score");
  const currency = createStat("Final Currency");
  stats.append(score.element, currency.element);

  const restartButton = document.createElement("button");
  restartButton.className = "game-over__button";
  restartButton.type = "button";
  restartButton.textContent = "Restart";
  restartButton.addEventListener("click", onRestart);

  const hint = document.createElement("p");
  hint.className = "game-over__hint";
  hint.textContent = "Press R or restart";

  overlay.append(title, stats, restartButton, hint);
  root.append(overlay);

  return {
    show(state) {
      score.value.textContent = String(state.score);
      currency.value.textContent = String(state.currency);
      overlay.hidden = false;
      restartButton.focus();
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
  element.className = "game-over__stat";

  const labelElement = document.createElement("span");
  labelElement.className = "game-over__stat-label";
  labelElement.textContent = label;

  const value = document.createElement("strong");
  value.className = "game-over__stat-value";
  value.textContent = "0";

  element.append(labelElement, value);
  return { element, value };
}
