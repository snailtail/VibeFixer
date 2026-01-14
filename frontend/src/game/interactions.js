import { depositArtifact, updateArtifactStatus } from "./session-api.js";
import { triggerRateLimitToast } from "./toast.js";

function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getPlayerBounds(player) {
  return {
    x: player.position.x,
    y: player.position.y - player.height,
    width: player.width,
    height: player.height,
  };
}

function getArtifactBounds(artifact) {
  return {
    x: artifact.position.x,
    y: artifact.position.y - 36,
    width: 48,
    height: 48,
  };
}

function rectEdgeDistance(a, b) {
  const dx = Math.max(a.x - (b.x + b.width), b.x - (a.x + a.width), 0);
  const dy = Math.max(a.y - (b.y + b.height), b.y - (a.y + a.height), 0);
  return Math.sqrt(dx * dx + dy * dy);
}

function isInTrashZone(player, trashBounds) {
  const playerBox = {
    x: player.position.x,
    y: player.position.y - player.height,
    width: player.width,
    height: player.height,
  };
  return (
    playerBox.x < trashBounds.x + trashBounds.width &&
    playerBox.x + playerBox.width > trashBounds.x &&
    playerBox.y < trashBounds.y + trashBounds.height &&
    playerBox.y + playerBox.height > trashBounds.y
  );
}

export async function handleAction(state) {
  if (state.carriedArtifactId) {
    if (isInTrashZone(state.player, state.trashCan.bounds)) {
      const trashCenter = {
        x: state.trashCan.bounds.x + state.trashCan.bounds.width / 2,
        y: state.trashCan.bounds.y + state.trashCan.bounds.height / 2,
      };
      const artifactId = state.carriedArtifactId;
      const artifact = state.artifacts.find((item) => item.id === artifactId);
      if (artifact) {
        artifact.position = {
          x: state.player.position.x + state.player.width / 2,
          y: state.player.position.y - state.player.height,
        };
        artifact.status = "flying";
        artifact.target = { ...trashCenter };
      }
      state.carriedArtifactId = null;
      try {
        const response = await depositArtifact(state.sessionId, artifactId);
        state.score = response.score;
        state.remainingArtifacts = response.remainingArtifacts;
      } catch (error) {
        if (error && error.status === 429) {
          triggerRateLimitToast(state);
        }
      }
      return "trash";
    }

    const artifact = state.artifacts.find((item) => item.id === state.carriedArtifactId);
    if (artifact) {
      artifact.status = "ground";
      artifact.position = {
        x: state.player.position.x,
        y: state.player.position.y,
      };
      try {
        await updateArtifactStatus(state.sessionId, artifact.id, "ground");
      } catch (error) {
        if (error && error.status === 429) {
          triggerRateLimitToast(state);
        }
      }
    }
    state.carriedArtifactId = null;
    return "drop";
  }

  let nearest = null;
  let nearestDistance = Infinity;
  for (const artifact of state.artifacts) {
    if (artifact.status !== "ground") {
      continue;
    }
    const dist = rectEdgeDistance(getPlayerBounds(state.player), getArtifactBounds(artifact));
    if (dist < nearestDistance) {
      nearestDistance = dist;
      nearest = artifact;
    }
  }

  if (nearest && nearestDistance <= 15) {
    nearest.status = "carried";
    state.carriedArtifactId = nearest.id;
    try {
      await updateArtifactStatus(state.sessionId, nearest.id, "carried");
    } catch (error) {
      if (error && error.status === 429) {
        triggerRateLimitToast(state);
      }
    }
    return "pickup";
  }

  return null;
}
