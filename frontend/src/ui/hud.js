const HUD_HEIGHT = 32;
export function drawHud(
  ctx,
  {
    score,
    timeRemaining,
    isGameOver,
    blockerCount = 0,
    gameOverMessage = "",
    fomoState = "",
    soundOn = true,
    strings,
  }
) {
  const hudStrings = strings?.hud || {};
  const uncheckedLabel = hudStrings.unchecked || "Unchecked code on ground";
  const blockersLabel = hudStrings.blockers || "Blockers";
  const soundLabel = hudStrings.sound || "Sound";
  const soundOnLabel = hudStrings.on || "On";
  const soundOffLabel = hudStrings.off || "Off";
  const sprintLabel = hudStrings.sprintEndsIn || "Sprint ends in";
  const gameOverLabel = hudStrings.gameOver || "Game Over";
  const reloadLabel = hudStrings.reload || "Reload the page to try again";
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, ctx.canvas.width, HUD_HEIGHT);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "16px monospace";
  ctx.textBaseline = "middle";

  const timeText = `${sprintLabel}: ${Math.max(0, Math.ceil(timeRemaining))}s`;
  const scoreText = `${uncheckedLabel}: ${score}`;
  const blockerText = `${blockersLabel}: ${blockerCount}`;
  const soundText = `${soundLabel}: ${soundOn ? soundOnLabel : soundOffLabel}`;

  ctx.textAlign = "left";
  ctx.fillText(scoreText, 16, HUD_HEIGHT / 2);
  const rightEdge = ctx.canvas.width - 16;
  ctx.textAlign = "right";
  ctx.fillText(timeText, rightEdge, HUD_HEIGHT / 2);

  const blockerWidth = ctx.measureText(blockerText).width;
  const mid = ctx.canvas.width / 2;
  ctx.textAlign = "left";
  ctx.fillText(blockerText, mid - blockerWidth - 20, HUD_HEIGHT / 2);
  ctx.fillText(soundText, mid + 20, HUD_HEIGHT / 2);

  if (isGameOver && fomoState !== "enraged") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, ctx.canvas.height / 2 - 30, ctx.canvas.width, 60);
    ctx.fillStyle = "#f5f5f5";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.fillText(gameOverLabel, ctx.canvas.width / 2, ctx.canvas.height / 2 - 22);
    ctx.font = "14px monospace";
    if (gameOverMessage) {
      ctx.fillText(gameOverMessage, ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
    ctx.fillText(reloadLabel, ctx.canvas.width / 2, ctx.canvas.height / 2 + 22);
    ctx.textAlign = "left";
  }

  ctx.restore();
}
