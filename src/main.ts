import { GameApp } from "./game/GameApp";
import { createGameOverOverlay } from "./ui/gameOverOverlay";
import { createHud } from "./ui/hud";
import { createMainMenuOverlay } from "./ui/mainMenuOverlay";
import { createPauseMenuOverlay } from "./ui/pauseMenuOverlay";
import { createShopOverlay } from "./ui/shopOverlay";
import { createStageClearOverlay } from "./ui/stageClearOverlay";
import { createWaveBanner } from "./ui/waveBanner";
import "./ui/styles.css";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("App root not found.");
}

const canvas = document.createElement("canvas");
canvas.id = "game-canvas";
root.append(canvas);

const hud = createHud(root);
let game: GameApp;
const mainMenuOverlay = createMainMenuOverlay(root, () => {
  game.startRunFromMainMenu();
});
const pauseMenuOverlay = createPauseMenuOverlay(root, {
  onResume: () => {
    game.resumeGameplay();
  },
  onRestartRun: () => {
    game.restartRun();
  },
  onMainMenu: () => {
    game.returnToMainMenu();
  }
});
const gameOverOverlay = createGameOverOverlay(root, () => {
  game.restartRun();
});
const shopOverlay = createShopOverlay(
  root,
  (id) => {
    game.buyShopUpgrade(id);
  },
  () => {
    game.skipShop();
  }
);
const stageClearOverlay = createStageClearOverlay(root, () => {
  game.continueFromStageClear();
});
const waveBanner = createWaveBanner(root);
game = new GameApp(
  canvas,
  hud,
  mainMenuOverlay,
  pauseMenuOverlay,
  shopOverlay,
  gameOverOverlay,
  stageClearOverlay,
  waveBanner
);

game.start();

window.addEventListener("beforeunload", () => {
  game.dispose();
});
