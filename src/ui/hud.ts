import type { GameState } from "../utils/types";

export type HudController = {
  update: (state: GameState) => void;
  show: () => void;
  hide: () => void;
};

export function createHud(root: HTMLElement): HudController {
  const hud = document.createElement("section");
  hud.className = "hud";
  hud.setAttribute("aria-label", "Game status");

  const fields = {
    lives: createHudField("Lives"),
    score: createHudField("Score"),
    currency: createHudField("Currency"),
    stage: createHudField("Stage"),
    time: createHudField("Time")
  };

  for (const field of Object.values(fields)) {
    hud.append(field.element);
  }

  root.append(hud);

  return {
    update(state) {
      fields.lives.value.textContent = String(state.lives);
      fields.score.value.textContent = String(state.score);
      fields.currency.value.textContent = String(state.currency);
      fields.stage.value.textContent = String(state.stage);
      fields.time.value.textContent = formatStageTime(state.stageTimeRemaining);
    },
    show() {
      hud.hidden = false;
    },
    hide() {
      hud.hidden = true;
    }
  };
}

function createHudField(label: string): {
  element: HTMLElement;
  value: HTMLElement;
} {
  const element = document.createElement("div");
  element.className = "hud__item";

  const labelElement = document.createElement("span");
  labelElement.className = "hud__label";
  labelElement.textContent = label;

  const value = document.createElement("strong");
  value.className = "hud__value";
  value.textContent = "0";

  element.append(labelElement, value);
  return { element, value };
}

function formatStageTime(timeRemaining: number): string {
  return Math.ceil(Math.max(0, timeRemaining)).toString();
}
