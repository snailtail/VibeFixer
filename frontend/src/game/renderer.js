import { drawHud } from "../ui/hud.js";
import { getAsset } from "./assets.js";

const COLORS = {
  background: "#1e1e2f",
  uiText: "#f5f5f5",
};
const BACKGROUND_ASSETS = {
  kommun: "backgroundKommun",
  danger: "backgroundDanger",
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
  const now = performance.now() / 1000;
  const isStunned = vibecoder.stunnedUntil && vibecoder.stunnedUntil > now;
  const flicker = isStunned && Math.floor(performance.now() / 120) % 2 === 0;
  if (flicker) {
    ctx.save();
    ctx.globalAlpha = 0.4;
  }
  drawImage(
    ctx,
    coderSprite,
    vibecoder.position.x - cameraX - vibecoder.width / 2,
    vibecoder.position.y - vibecoder.height,
    vibecoder.width,
    vibecoder.height
  );
  if (flicker) {
    ctx.restore();
  }
}

function drawImpEdiment(ctx, imp, cameraX) {
  if (!imp || !imp.position) {
    return;
  }
  const now = performance.now() / 1000;
  if (imp.visibleUntil && now > imp.visibleUntil) {
    return;
  }
  const sprite = getAsset("impEdiment");
  const size = 96;
  drawImage(ctx, sprite, imp.position.x - cameraX - size / 2, imp.position.y - size, size, size);
}

function drawFomoDemon(ctx, state) {
  if (!state.ended || state.fomoState !== "enraged") {
    return;
  }
  const sprite = getAsset("fomoDemon");
  const size = 160;
  const x = ctx.canvas.width / 2 - size / 2;
  const y = ctx.canvas.height / 2 - size - 40;
  drawImage(ctx, sprite, x, y, size, size);
}

function drawFomoEnragedOverlay(ctx, state, strings) {
  if (!state.ended || state.fomoState !== "enraged") {
    return;
  }
  const overlayStrings = strings?.overlays || {};
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  const sprite = getAsset("fomoDemon");
  const size = 220;
  const spriteX = ctx.canvas.width / 2 - size / 2;
  const spriteY = ctx.canvas.height / 2 - size - 60;
  drawImage(ctx, sprite, spriteX, spriteY, size, size);

  const boxWidth = ctx.canvas.width - 120;
  const boxHeight = 90;
  const boxX = 60;
  const boxY = ctx.canvas.height / 2 + 20;
  ctx.fillStyle = "rgba(80, 0, 0, 0.75)";
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  ctx.strokeStyle = "#ff4b4b";
  ctx.lineWidth = 3;
  ctx.strokeRect(boxX + 2, boxY + 2, boxWidth - 4, boxHeight - 4);
  ctx.fillStyle = "#ffe5e5";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.fillText(overlayStrings.fomoGameOver || "GAME OVER", ctx.canvas.width / 2, boxY + 28);
  ctx.font = "bold 16px monospace";
  ctx.fillText(overlayStrings.fomoTitle || "FOMO DEMON ENRAGED", ctx.canvas.width / 2, boxY + 50);
  ctx.font = "14px monospace";
  ctx.fillText(
    overlayStrings.fomoLine || "Unchecked code remains. The demon is furious.",
    ctx.canvas.width / 2,
    boxY + 72
  );
  ctx.restore();
}

export function renderGame(ctx, state) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const assetKey = BACKGROUND_ASSETS[state.backgroundKey] || BACKGROUND_ASSETS.kommun;
  const fallbackKey = BACKGROUND_ASSETS.kommun;
  const selectedBackground = getAsset(assetKey);
  const fallbackBackground = assetKey !== fallbackKey ? getAsset(fallbackKey) : null;
  const background = selectedBackground || fallbackBackground;
  const backgroundFallback = Boolean(!selectedBackground && fallbackBackground);
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
  drawImpEdiment(ctx, state.imp, state.cameraX);
  drawPlayer(ctx, state.player, state.cameraX);
  if (!state.started && !state.ended) {
    drawStartOverlay(ctx, state.strings);
  }
  if (state.toast) {
    drawToast(ctx, state.toast.message);
  }
  drawFomoEnragedOverlay(ctx, state, state.strings);
  drawHud(ctx, {
    score: state.score,
    timeRemaining: state.timeRemaining,
    isGameOver: state.ended,
    blockerCount: state.blockerCount,
    gameOverMessage: state.gameOverMessage,
    fomoState: state.fomoState,
    soundOn: !state.isMuted,
    strings: state.strings,
  });
}

function drawToast(ctx, message) {
  ctx.save();
  const boxWidth = ctx.canvas.width - 120;
  const boxHeight = 76;
  const boxX = 60;
  const boxY = 24;
  ctx.fillStyle = "rgba(8, 8, 20, 0.9)";
  ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
  ctx.strokeStyle = "#ff5cff";
  ctx.lineWidth = 3;
  ctx.shadowColor = "rgba(255, 92, 255, 0.6)";
  ctx.shadowBlur = 12;
  ctx.strokeRect(boxX + 2, boxY + 2, boxWidth - 4, boxHeight - 4);
  ctx.shadowBlur = 0;
  ctx.fillStyle = "#f5f5f5";
  ctx.font = "bold 18px monospace";
  ctx.textAlign = "center";
  ctx.fillText(message, ctx.canvas.width / 2, boxY + 48);
  ctx.restore();
}

function drawStartOverlay(ctx, strings) {
  const overlayStrings = strings?.overlays || {};
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "20px monospace";
  ctx.textAlign = "center";
  ctx.fillText(
    overlayStrings.pressStart || "Press Space to Start",
    ctx.canvas.width / 2,
    ctx.canvas.height / 2 - 80
  );

  ctx.font = "14px monospace";
  const lines = overlayStrings.startLines || [
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
