import { createInputState } from "./game/input.js";
import { startGame } from "./game/game-loop.js";
import { preloadAssets } from "./game/assets.js";

function bootstrap() {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 683;
  canvas.id = "vibefixer-canvas";
  document.body.appendChild(canvas);

  const input = createInputState();
  preloadAssets();
  startGame(canvas, input);
}

window.addEventListener("DOMContentLoaded", bootstrap);
