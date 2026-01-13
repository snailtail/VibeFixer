function getBounds(player) {
  return {
    x: player.position.x,
    y: player.position.y - player.height,
    width: player.width,
    height: player.height,
  };
}

function intersects(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

export function resolveTerrainCollision(state, terrain) {
  const player = state.player;
  const bounds = getBounds(player);
  let grounded = false;

  terrain.forEach((segment) => {
    const obstacle = segment.bounds;
    if (!intersects(bounds, obstacle)) {
      return;
    }

    const overlapBottom = bounds.y + bounds.height - obstacle.y;
    const overlapTop = obstacle.y + obstacle.height - bounds.y;
    const overlapLeft = bounds.x + bounds.width - obstacle.x;
    const overlapRight = obstacle.x + obstacle.width - bounds.x;
    const minOverlap = Math.min(overlapBottom, overlapTop, overlapLeft, overlapRight);

    if (minOverlap === overlapBottom) {
      player.position.y = obstacle.y;
      player.velocity.y = 0;
      grounded = true;
    } else if (minOverlap === overlapTop) {
      player.position.y = obstacle.y + obstacle.height + player.height;
      player.velocity.y = 0;
    } else if (minOverlap === overlapLeft) {
      player.position.x = obstacle.x - bounds.width;
      player.velocity.x = 0;
    } else if (minOverlap === overlapRight) {
      player.position.x = obstacle.x + obstacle.width;
      player.velocity.x = 0;
    }
  });

  player.isGrounded = grounded;
}
