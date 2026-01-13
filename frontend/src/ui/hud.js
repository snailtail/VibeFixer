const HUD_HEIGHT = 32;

export function drawHud(ctx, { score, timeRemaining, isGameOver }) {
  ctx.save();
  ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
  ctx.fillRect(0, 0, ctx.canvas.width, HUD_HEIGHT);

  ctx.fillStyle = "#f5f5f5";
  ctx.font = "16px monospace";
  ctx.textBaseline = "middle";

  const timeText = `Time: ${Math.max(0, Math.ceil(timeRemaining))}s`;
  const scoreText = `Unchecked code on ground: ${score}`;

  ctx.fillText(scoreText, 16, HUD_HEIGHT / 2);
  ctx.fillText(timeText, ctx.canvas.width - 180, HUD_HEIGHT / 2);

  if (isGameOver) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
    ctx.fillRect(0, ctx.canvas.height / 2 - 30, ctx.canvas.width, 60);
    ctx.fillStyle = "#f5f5f5";
    ctx.font = "20px monospace";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", ctx.canvas.width / 2, ctx.canvas.height / 2 - 6);
    ctx.font = "14px monospace";
    ctx.fillText("Reload the page to try again", ctx.canvas.width / 2, ctx.canvas.height / 2 + 16);
    ctx.textAlign = "left";
  }
  ctx.restore();
}
