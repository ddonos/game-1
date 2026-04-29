import { GameApp } from "./game/GameApp";
import { createHud } from "./ui/hud";
import "./ui/styles.css";

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("App root not found.");
}

const canvas = document.createElement("canvas");
canvas.id = "game-canvas";
root.append(canvas);

const hud = createHud(root);
const game = new GameApp(canvas, hud);

game.start();

window.addEventListener("beforeunload", () => {
  game.dispose();
});
