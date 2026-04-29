export type MainMenuOverlayController = {
  show: () => void;
  hide: () => void;
};

export function createMainMenuOverlay(
  root: HTMLElement,
  onPlay: () => void
): MainMenuOverlayController {
  const overlay = document.createElement("section");
  overlay.className = "main-menu";
  overlay.setAttribute("aria-label", "Main menu");

  const title = document.createElement("h1");
  title.className = "main-menu__title";
  title.textContent = "RAIL SPACE SHOOTER";

  const nav = document.createElement("div");
  nav.className = "main-menu__nav";

  const playButton = createButton("Play", onPlay);
  const howToPlayButton = createButton("How to Play", () => {
    showPanel("how-to-play");
  });
  const missionsButton = createButton("Missions", () => {
    showPanel("missions");
  });
  nav.append(playButton, howToPlayButton, missionsButton);

  const panel = document.createElement("div");
  panel.className = "main-menu__panel";
  panel.id = "how-to-play";
  panel.append(
    createPanelTitle("How to Play"),
    createPanelList([
      "Move with WASD or Arrow Keys.",
      "Fire with Spacebar, click, or touch.",
      "Survive each stage until the timer reaches zero.",
      "Destroy enemies for score and currency.",
      "Avoid enemy contact.",
      "Clear stages before losing all lives."
    ])
  );

  const missions = document.createElement("div");
  missions.className = "main-menu__panel";
  missions.id = "missions";
  missions.hidden = true;
  missions.append(
    createPanelTitle("Missions"),
    createPanelList([
      "Missions will be implemented in a later phase.",
      "Example: Destroy 10 enemies.",
      "Example: Clear a stage without losing a life."
    ])
  );

  const footer = document.createElement("p");
  footer.className = "main-menu__footer";
  footer.textContent = "Phase 6 menu shell";

  overlay.append(title, nav, panel, missions, footer);
  root.append(overlay);

  function showPanel(id: "how-to-play" | "missions"): void {
    panel.hidden = id !== "how-to-play";
    missions.hidden = id !== "missions";
  }

  return {
    show() {
      overlay.hidden = false;
      playButton.focus();
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

function createPanelTitle(label: string): HTMLHeadingElement {
  const title = document.createElement("h2");
  title.className = "main-menu__panel-title";
  title.textContent = label;
  return title;
}

function createPanelList(items: string[]): HTMLUListElement {
  const list = document.createElement("ul");
  list.className = "main-menu__list";

  for (const item of items) {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.append(listItem);
  }

  return list;
}
