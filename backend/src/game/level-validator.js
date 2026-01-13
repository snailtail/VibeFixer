const { LEVEL_WIDTH, GROUND_Y } = require("./level-generator");

const MAX_JUMP_HEIGHT = 160;
const MAX_GAP = 160;
const MIN_GROUND_GAP = 24;

function isReachable(artifact, terrain) {
  if (artifact.position.y >= GROUND_Y - 10) {
    return true;
  }

  return terrain.some((segment) => {
    const topY = segment.bounds.y;
    const withinHeight = GROUND_Y - topY <= MAX_JUMP_HEIGHT;
    const withinRange = Math.abs(segment.bounds.x - artifact.position.x) <= MAX_GAP;
    return withinHeight && withinRange;
  });
}

function validateArtifacts(artifacts, terrain) {
  return artifacts.every((artifact) => isReachable(artifact, terrain));
}

function validateLevel(level) {
  if (!validateArtifacts(level.artifacts, level.terrain)) {
    return { valid: false, reason: "unreachable-artifact" };
  }

  const groundObstacles = level.terrain
    .filter((segment) => segment.bounds.y + segment.bounds.height === GROUND_Y)
    .filter((segment) => segment.bounds.height <= MAX_JUMP_HEIGHT)
    .sort((a, b) => a.bounds.x - b.bounds.x);

  for (let i = 1; i < groundObstacles.length; i += 1) {
    const prev = groundObstacles[i - 1].bounds;
    const next = groundObstacles[i].bounds;
    const gap = next.x - (prev.x + prev.width);
    if (gap < MIN_GROUND_GAP) {
      return { valid: false, reason: "blocked-ground-path" };
    }
  }

  const lastArtifact = level.artifacts.reduce((max, artifact) => {
    return artifact.position.x > max ? artifact.position.x : max;
  }, 0);

  if (LEVEL_WIDTH - lastArtifact < 60) {
    return { valid: false, reason: "artifact-too-close-to-end" };
  }

  return { valid: true };
}

module.exports = {
  validateLevel,
  validateArtifacts,
};
