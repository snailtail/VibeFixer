import { drawHud } from "../ui/hud.js";
import { getAsset } from "./assets.js";

const COLORS = {
  background: "#1e1e2f",
  uiText: "#f5f5f5",
};

function drawTiled(ctx, image, x, y, width, height, tileSize) {
  if (!image) {
    ctx.fillStyle = "#4a4a4a";
    ctx.fillRect(x, y, width, height);
    return;
  }
  for (let ty = y; ty < y + height; ty += tileSize) {
    for (let tx = x; tx < x + width; tx += tileSize) {
      ctx.drawImage(image, tx, ty, tileSize, tileSize);
    }
  }
}

function drawImage(ctx, image, x, y, width, height) {
  if (!image) {
    ctx.fillStyle = "#ff6b6b";
    ctx.fillRect(x, y, width, height);
    return;
  }
  ctx.drawImage(image, x, y, width, height);
}

function drawTerrain(ctx, terrain, cameraX) {
  const stoneTile = getAsset("stone");

  terrain.forEach((segment) => {
    if (segment.type === "ground") {
      return;
    }
    const { x, y, width, height } = segment.bounds;
    drawTiled(ctx, stoneTile, x - cameraX, y, width, height, 32);
  });
}

function drawArtifacts(ctx, artifacts, player, carriedArtifactId, cameraX) {
  const artifactSprite = getAsset("artifact");
  artifacts.forEach((artifact) => {
    if (artifact.status === "deposited" || artifact.id === carriedArtifactId) {
      return;
    }
    drawImage(ctx, artifactSprite, artifact.position.x - cameraX, artifact.position.y - 36, 48, 48);
  });

  if (carriedArtifactId) {
    const offsetX = player.position.x + player.width / 2 - 24 - cameraX;
    const offsetY = player.position.y - player.height - 36;
    drawImage(ctx, artifactSprite, offsetX, offsetY, 48, 48);
  }
}

function drawDebris(ctx, debris, cameraX) {
  if (!debris || !debris.length) {
    return;
  }
  ctx.save();
  ctx.fillStyle = "rgba(200, 220, 255, 0.8)";
  debris.forEach((piece) => {
    ctx.fillRect(piece.x - cameraX, piece.y, piece.size, piece.size);
  });
  ctx.restore();
}

function drawPlayer(ctx, player, cameraX) {
  let sprite = getAsset("playerIdle");
  if (!player.isGrounded) {
    sprite = getAsset("playerJump");
  } else if (player.isMoving) {
    sprite = player.walkFrame === 0 ? getAsset("playerWalkA") : getAsset("playerWalkB");
  }

  ctx.save();
  const drawX = player.position.x - cameraX + player.width / 2;
  ctx.translate(drawX, player.position.y);
  ctx.scale(player.facing, 1);
  drawImage(ctx, sprite, -player.width / 2, -player.height, player.width, player.height);
  ctx.restore();
}

function drawVibeCoder(ctx, vibecoder, cameraX) {
  const coderSprite = vibecoder.frameIndex === 1 ? getAsset("vibecoderB") : getAsset("vibecoderA");
  drawImage(
    ctx,
    coderSprite,
    vibecoder.position.x - cameraX - vibecoder.width / 2,
    vibecoder.position.y - vibecoder.height,
    vibecoder.width,
    vibecoder.height
  );
}

export function renderGame(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const background = getAsset("background");
  if (background) {
    ctx.drawImage(background, 0, 0, ctx.canvas.width, ctx.canvas.height);
  } else {
    ctx.fillStyle = COLORS.background;
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  }

  drawTerrain(ctx, state.terrain, state.cameraX);
  drawDebris(ctx, state.debris, state.cameraX);
  drawArtifacts(ctx, state.artifacts, state.player, state.carriedArtifactId, state.cameraX);
  state.vibecoders.forEach((coder) => drawVibeCoder(ctx, coder, state.cameraX));
  drawPlayer(ctx, state.player, state.cameraX);
  if (!state.started && !state.ended) {
    drawStartOverlay(ctx);
  }
  if (state.toast) {
    drawToast(ctx, state.toast.message);
  }
  drawHud(ctx, {
    score: state.score,
    timeRemaining: state.timeRemaining,
    isGameOver: state.ended,
  });
}

function drawToast(ctx, message) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(40, 40, ctx.canvas.width - 80, 44);
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "14px monospace";
  ctx.textAlign = "center";
  ctx.fillText(message, ctx.canvas.width / 2, 68);
  ctx.restore();
}

function drawStartOverlay(ctx) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "20px monospace";
  ctx.textAlign = "center";
  ctx.fillText("Press Space to Start", ctx.canvas.width / 2, ctx.canvas.height / 2 - 80);

  ctx.font = "14px monospace";
  const lines = [
    "A vibe coder is on the loose on the top floor of the municipality,",
    "dropping fresh unchecked code into the basement.",
    "You’re the Vibe Fixer —> grab as much as you can and toss it into the Code Review Bin.",
    "Hurry up: your sprint ends in 60 seconds, as requested by the demanding customers.",
    "Press M to mute or unmute the music.",
  ];
  const startY = ctx.canvas.height / 2 - 40;
  lines.forEach((line, index) => {
    ctx.fillText(line, ctx.canvas.width / 2, startY + index * 18);
  });

  ctx.restore();
}
