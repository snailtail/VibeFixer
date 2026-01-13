import { createInputState } from "./game/input.js";
import { startGame } from "./game/game-loop.js";
import { preloadAssets } from "./game/assets.js";

function bootstrap() {
  const gameWrap = document.getElementById("game-wrap");
  const logList = document.getElementById("event-log-list");
  const poImage = document.getElementById("po-status-image");
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 683;
  canvas.id = "vibefixer-canvas";
  if (gameWrap) {
    gameWrap.appendChild(canvas);
  } else {
    document.body.appendChild(canvas);
  }

  const input = createInputState();
  preloadAssets();
  startGame(canvas, input, { logList, poImage });
}

window.addEventListener("DOMContentLoaded", bootstrap);
