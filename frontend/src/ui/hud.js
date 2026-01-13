const HUD_HEIGHT = 32;

export function drawHud(ctx, { score, timeRemaining, isGameOver, blockerCount = 0, gameOverMessage = "", fomoState = "", soundOn = true }) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, ctx.canvas.width, HUD_HEIGHT);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "16px monospace";
  ctx.textBaseline = "middle";

  const timeText = `Sprint ends in: ${Math.max(0, Math.ceil(timeRemaining))}s`;
  const scoreText = `Unchecked code on ground: ${score}`;
  const blockerText = `Blockers: ${blockerCount}`;
  const soundText = `Sound: ${soundOn ? "On" : "Off"}`;

  ctx.fillText(scoreText, 16, HUD_HEIGHT / 2);
  ctx.fillText(timeText, ctx.canvas.width - 195, HUD_HEIGHT / 2);
  ctx.fillText(blockerText, ctx.canvas.width / 2 - 120, HUD_HEIGHT / 2);
  ctx.fillText(soundText, ctx.canvas.width / 2 + 70, HUD_HEIGHT / 2);

  if (isGameOver && fomoState !== "enraged") {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, ctx.canvas.height / 2 - 30, ctx.canvas.width, 60);
    ctx.fillStyle = "#f5f5f5";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 2 - 22);
    ctx.font = "14px monospace";
    if (gameOverMessage) {
      ctx.fillText(gameOverMessage, ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
    ctx.fillText("Reload the page to try again", ctx.canvas.width / 2, ctx.canvas.height / 2 + 22);
    ctx.textAlign = "left";
  }
  ctx.restore();
}
