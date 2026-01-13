const ARTIFACT_MIN = 30;
const ARTIFACT_MAX = 50;
const LEVEL_WIDTH = 1024;
const LEVEL_HEIGHT = 683;
const GROUND_Y = 559;
const ARTIFACT_WIDTH = 20;
const TRASH_CAN_WIDTH = 90;
const TRASH_CAN_HEIGHT = 110;
const TILE_SIZE = 32;
const OBSTACLE_HEIGHT_MAX = 32;
const OBSTACLE_WIDTH_MAX = 64;
const OBSTACLE_WIDTH_MIN = 32;
const SAFE_ZONE_START = 120;
const SAFE_ZONE_END_PADDING = 160;
const MIN_OBSTACLE_GAP = 80;

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateTerrain(trashBounds) {
  const terrain = [];

  terrain.push({
    id: `terrain_ground`,
    type: "ground",
    bounds: { x: 0, y: GROUND_Y, width: LEVEL_WIDTH, height: LEVEL_HEIGHT - GROUND_Y },
  });

  const obstacleCount = randomInt(10, 14);
  const earlyCount = randomInt(3, 4);
  const elevatedTierOne = 2;
  const elevatedTierTwo = 2;
  const totalCount = obstacleCount + earlyCount;
  const placed = [];
  const floatOffsets = [];

  for (let i = 0; i < elevatedTierOne; i += 1) {
    floatOffsets.push(TILE_SIZE * 2);
  }
  for (let i = 0; i < elevatedTierTwo; i += 1) {
    floatOffsets.push(TILE_SIZE * 4);
  }
  while (floatOffsets.length < totalCount) {
    const roll = Math.random();
    if (roll < 0.6) {
      floatOffsets.push(TILE_SIZE * 2);
    } else {
      floatOffsets.push(TILE_SIZE * 4);
    }
  }

  for (let i = 0; i < totalCount; i += 1) {
    const width = randomInt(OBSTACLE_WIDTH_MIN, OBSTACLE_WIDTH_MAX);
    const height = OBSTACLE_HEIGHT_MAX;
    const floatOffset = floatOffsets[i];
    let x = 0;
    let attempts = 0;
    while (attempts < 10) {
      x = i < earlyCount
        ? randomInt(200, 760)
        : randomInt(SAFE_ZONE_START, LEVEL_WIDTH - SAFE_ZONE_END_PADDING);
      const overlaps = placed.some((range) => {
        return x < range.end + MIN_OBSTACLE_GAP && x + width > range.start - MIN_OBSTACLE_GAP;
      });
      const overlapsTrash = trashBounds
        ? x < trashBounds.x + trashBounds.width + MIN_OBSTACLE_GAP &&
          x + width > trashBounds.x - MIN_OBSTACLE_GAP
        : false;
      if (!overlaps && !overlapsTrash) {
        placed.push({ start: x, end: x + width });
        break;
      }
      attempts += 1;
    }
    if (attempts >= 10) {
      continue;
    }
    const y = GROUND_Y - height - floatOffset;

    terrain.push({
      id: `terrain_${i}`,
      type: "stone",
      bounds: { x, y, width, height },
    });
  }

  return terrain;
}

function generateArtifacts(trashCanX, terrain) {
  const artifacts = [];
  const count = randomInt(ARTIFACT_MIN, ARTIFACT_MAX);
  const maxX = Math.max(80, trashCanX - ARTIFACT_WIDTH * 3);
  const surfaces = terrain.filter((segment) => segment.bounds.y <= GROUND_Y);

  for (let i = 0; i < count; i += 1) {
    let placed = false;
    for (let attempt = 0; attempt < 8; attempt += 1) {
      const surface = surfaces[randomInt(0, surfaces.length - 1)];
      const minX = Math.max(40, surface.bounds.x + 8);
      const maxSurfaceX = Math.min(maxX, surface.bounds.x + surface.bounds.width - 8);
      if (maxSurfaceX <= minX) {
        continue;
      }
      const x = randomInt(minX, maxSurfaceX);
      const y = surface.bounds.y;
      artifacts.push({
        id: `artifact_${i}`,
        position: { x, y },
        status: "ground",
      });
      placed = true;
      break;
    }

    if (placed) {
      continue;
    }

    const x = randomInt(40, maxX);
    artifacts.push({
      id: `artifact_${i}`,
      position: { x, y: GROUND_Y },
      status: "ground",
    });
  }

  return artifacts;
}

function generateLevel({ seed, validateLevel, includeArtifacts = true }) {
  const trashCanX = LEVEL_WIDTH - TRASH_CAN_WIDTH - 30 - 27;
  const trashCanY = GROUND_Y - TRASH_CAN_HEIGHT;

  let attempts = 0;
  while (attempts < 10) {
    const terrain = generateTerrain({ x: trashCanX, y: trashCanY, width: TRASH_CAN_WIDTH, height: TRASH_CAN_HEIGHT });
    const artifacts = includeArtifacts ? generateArtifacts(trashCanX, terrain) : [];
    const trashCan = {
      position: { x: trashCanX, y: trashCanY },
      bounds: { x: trashCanX, y: trashCanY, width: TRASH_CAN_WIDTH, height: TRASH_CAN_HEIGHT },
    };

    const level = { seed, terrain, artifacts, trashCan };
    if (!validateLevel || validateLevel(level).valid) {
      return level;
    }
    attempts += 1;
  }

  const terrain = generateTerrain({ x: trashCanX, y: trashCanY, width: TRASH_CAN_WIDTH, height: TRASH_CAN_HEIGHT });
  const artifacts = includeArtifacts ? generateArtifacts(trashCanX, terrain) : [];
  const trashCan = {
    position: { x: trashCanX, y: trashCanY },
    bounds: { x: trashCanX, y: trashCanY, width: TRASH_CAN_WIDTH, height: TRASH_CAN_HEIGHT },
  };

  return { seed, terrain, artifacts, trashCan };
}

module.exports = {
  generateLevel,
  LEVEL_WIDTH,
  LEVEL_HEIGHT,
  GROUND_Y,
};
