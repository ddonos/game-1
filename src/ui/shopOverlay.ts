import type { UpgradeId } from "../config/upgrades";
import type { UpgradeSnapshot } from "../systems/UpgradeSystem";

export type ShopOverlayState = {
  currency: number;
  clearedStage: number;
  upgrades: UpgradeSnapshot[];
};

export type ShopOverlayController = {
  show: (state: ShopOverlayState) => void;
  hide: () => void;
};

export function createShopOverlay(
  root: HTMLElement,
  onBuy: (id: UpgradeId) => void,
  onSkip: () => void
): ShopOverlayController {
  const overlay = document.createElement("section");
  overlay.className = "shop";
  overlay.hidden = true;
  overlay.setAttribute("aria-label", "Between-stage shop");

  const title = document.createElement("h1");
  title.className = "shop__title";
  title.textContent = "SHOP";

  const meta = document.createElement("p");
  meta.className = "shop__meta";

  const grid = document.createElement("div");
  grid.className = "shop__grid";

  const skipButton = document.createElement("button");
  skipButton.className = "menu-button";
  skipButton.type = "button";
  skipButton.textContent = "Skip / Continue";
  skipButton.addEventListener("click", onSkip);

  overlay.append(title, meta, grid, skipButton);
  root.append(overlay);

  return {
    show(state) {
      meta.textContent = `Wave ${state.clearedStage} passed  |  Currency ${state.currency}`;
      grid.replaceChildren(
        ...state.upgrades.map((upgrade) => createUpgradeCard(upgrade, onBuy))
      );
      overlay.hidden = false;
      skipButton.focus();
    },
    hide() {
      overlay.hidden = true;
    }
  };
}

function createUpgradeCard(
  upgrade: UpgradeSnapshot,
  onBuy: (id: UpgradeId) => void
): HTMLElement {
  const card = document.createElement("article");
  card.className = "shop__card";

  const title = document.createElement("h2");
  title.className = "shop__upgrade-title";
  title.textContent = upgrade.displayName;

  const level = document.createElement("p");
  level.className = "shop__line";
  level.textContent = `Level ${upgrade.level} / ${upgrade.maxLevel}`;

  const description = document.createElement("p");
  description.className = "shop__description";
  description.textContent = upgrade.description;

  const cost = document.createElement("p");
  cost.className = "shop__line";
  cost.textContent =
    upgrade.cost === null ? "Max level" : `Cost ${upgrade.cost}`;

  const buyButton = document.createElement("button");
  buyButton.className = "shop__buy";
  buyButton.type = "button";
  buyButton.textContent = upgrade.cost === null ? "Maxed" : "Buy";
  buyButton.disabled = !upgrade.canBuy;
  buyButton.addEventListener("click", () => {
    onBuy(upgrade.id);
  });

  card.append(title, level, description, cost, buyButton);
  return card;
}
