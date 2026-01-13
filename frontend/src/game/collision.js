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

const TILE_SIZE = 32;

function splitObstacle(segment, breakBounds) {
  const { x, y, width, height } = segment.bounds;
  const leftWidth = Math.max(0, breakBounds.x - x);
  const rightX = breakBounds.x + breakBounds.width;
  const rightWidth = Math.max(0, x + width - rightX);
  const pieces = [];

  if (leftWidth > 0) {
    pieces.push({
      ...segment,
      id: `${segment.id}_left`,
      bounds: { x, y, width: leftWidth, height },
    });
  }
  if (rightWidth > 0) {
    pieces.push({
      ...segment,
      id: `${segment.id}_right`,
      bounds: { x: rightX, y, width: rightWidth, height },
    });
  }

  return pieces;
}

export function resolveTerrainCollision(state, terrain) {
  const player = state.player;
  const bounds = getBounds(player);
  let grounded = false;
  const breakEvents = [];
  const removedIds = new Set();
  const addSegments = [];
  let topHitId = null;
  let topHitOverlap = Infinity;

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

    if (
      segment.type !== "ground" &&
      player.velocity.y < 0 &&
      minOverlap === overlapTop &&
      overlapTop < topHitOverlap
    ) {
      topHitOverlap = overlapTop;
      topHitId = segment.id;
    }
  });

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
      if (segment.type !== "ground" && segment.id === topHitId) {
        const playerCenterX = player.position.x + player.width / 2;
        const tileCount = Math.max(1, Math.ceil(obstacle.width / TILE_SIZE));
        const rawIndex = Math.floor((playerCenterX - obstacle.x) / TILE_SIZE);
        const tileIndex = Math.min(tileCount - 1, Math.max(0, rawIndex));
        const breakX = obstacle.x + tileIndex * TILE_SIZE;
        const breakBounds = {
          x: breakX,
          y: obstacle.y,
          width: Math.min(TILE_SIZE, obstacle.width - tileIndex * TILE_SIZE),
          height: obstacle.height,
        };
        removedIds.add(segment.id);
        if (obstacle.width > TILE_SIZE) {
          addSegments.push(...splitObstacle(segment, breakBounds));
        }
        breakEvents.push(breakBounds);
        const obstacleTop = obstacle.y;
        state.artifacts.forEach((artifact) => {
          if (artifact.status !== "ground") {
            return;
          }
          const withinX = artifact.position.x >= breakBounds.x && artifact.position.x <= breakBounds.x + breakBounds.width;
          if (withinX && Math.abs(artifact.position.y - obstacleTop) <= 1) {
            artifact.status = "inAir";
            artifact.velocityY = 0;
          }
        });
      }
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
  if (removedIds.size) {
    const kept = terrain.filter((segment) => !removedIds.has(segment.id));
    state.terrain = kept.concat(addSegments);
  }
  return breakEvents;
}
