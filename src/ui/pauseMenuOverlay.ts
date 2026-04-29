export type PauseMenuOverlayController = {
  show: () => void;
  hide: () => void;
};

export function createPauseMenuOverlay(
  root: HTMLElement,
  actions: {
    onResume: () => void;
    onRestartRun: () => void;
    onMainMenu: () => void;
  }
): PauseMenuOverlayController {
  const overlay = document.createElement("section");
  overlay.className = "pause-menu";
  overlay.hidden = true;
  overlay.setAttribute("aria-label", "Pause menu");

  const title = document.createElement("h1");
  title.className = "pause-menu__title";
  title.textContent = "PAUSED";

  const resumeButton = createButton("Resume", actions.onResume);
  const restartButton = createButton("Restart Run", actions.onRestartRun);
  const mainMenuButton = createButton("Back to Main Menu", actions.onMainMenu);

  overlay.append(title, resumeButton, restartButton, mainMenuButton);
  root.append(overlay);

  return {
    show() {
      overlay.hidden = false;
      resumeButton.focus();
    },
    hide() {
      overlay.hidden = true;
    }
  };
}

function createButton(label: string, onClick: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.className = "menu-button";
  button.type = "button";
  button.textContent = label;
  button.addEventListener("click", onClick);
  return button;
}
