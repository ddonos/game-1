import { GameApp } from "./game/GameApp";
import { createGameOverOverlay } from "./ui/gameOverOverlay";
import { createHud } from "./ui/hud";
import { createStageClearOverlay } from "./ui/stageClearOverlay";
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
const gameOverOverlay = createGameOverOverlay(root, () => {
  game.restartRun();
});
const stageClearOverlay = createStageClearOverlay(root, () => {
  game.continueFromStageClear();
});
game = new GameApp(canvas, hud, gameOverOverlay, stageClearOverlay);

game.start();

window.addEventListener("beforeunload", () => {
  game.dispose();
});
