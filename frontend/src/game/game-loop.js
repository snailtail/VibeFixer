import { startSession, endSession, spawnArtifact, updateArtifactStatus } from "./session-api.js";
import { renderGame } from "./renderer.js";
import { handleAction } from "./interactions.js";
import { applyPhysics } from "./physics.js";
import { resolveTerrainCollision } from "./collision.js";

const PLAYER_WIDTH = 64;
const PLAYER_HEIGHT = 64;
const CODER_BASE_SPEED = 20;
const CODER_DROP_INTERVAL = 6.0;
const SECOND_CODER_TIME = 30;
const TOAST_LEAD_TIME = 3;
const TOAST_DURATION = 3.5;

export async function startGame(canvas, input) {
  const ctx = canvas.getContext("2d");
  const state = {
    sessionId: null,
    durationSeconds: 120,
    startTime: 0,
    timeRemaining: 120,
    score: 0,
    artifacts: [],
    terrain: [],
    trashCan: null,
    levelWidth: 0,
    cameraX: 0,
    vibecoders: [],
    toast: null,
    secondCoderEnabled: false,
    started: false,
    remainingArtifacts: 0,
    carriedArtifactId: null,
    player: {
      position: { x: 60, y: canvas.height - 60 },
      velocity: { x: 0, y: 0 },
      width: PLAYER_WIDTH,
      height: PLAYER_HEIGHT,
      isGrounded: true,
      isMoving: false,
      facing: 1,
      walkTimer: 0,
      walkFrame: 0,
    },
    input,
    lastAction: false,
    ended: false,
  };

  async function loadSession() {
    const session = await startSession();
    const groundY = session.terrain.reduce((maxY, segment) => {
      return segment.bounds.y > maxY ? segment.bounds.y : maxY;
    }, 0);
    state.sessionId = session.sessionId;
    state.durationSeconds = session.durationSeconds;
    state.startTime = null;
    state.timeRemaining = session.durationSeconds;
    state.score = 0;
    state.artifacts = session.artifacts.map((artifact) => ({
      ...artifact,
      status: "ground",
    }));
    state.terrain = session.terrain;
    state.trashCan = session.trashCan;
    state.remainingArtifacts = session.artifacts.length;
    state.carriedArtifactId = null;
    state.player.position = { x: 80, y: groundY };
    state.levelWidth = canvas.width;
    state.player.velocity = { x: 0, y: 0 };
    state.player.isGrounded = true;
    state.player.isMoving = false;
    state.player.walkFrame = 0;
    state.player.walkTimer = 0;
    state.ended = false;
    state.started = false;
    state.vibecoders = [];
    state.toast = null;
    state.secondCoderEnabled = false;
  }

  await loadSession();

  let lastFrame = performance.now();

  async function update(dt) {
    if (state.ended) {
      return;
    }

    if (!state.started) {
      if (state.input.action && !state.lastAction) {
        state.started = true;
        state.startTime = performance.now();
      }
      state.lastAction = state.input.action;
      return;
    }

    state.timeRemaining = Math.max(0, state.durationSeconds - (performance.now() - state.startTime) / 1000);
    if (state.timeRemaining <= 0) {
      state.ended = true;
      state.carriedArtifactId = null;
      await endSession(state.sessionId);
      return;
    }

    applyPhysics(state, dt);
    resolveTerrainCollision(state, state.terrain);
    updatePlayerAnimation(state, dt);

    updateVibeCoders(state, dt);
    await updateArtifactDrops(state, dt);

    state.score = state.artifacts.filter((artifact) => artifact.status === "ground").length;

    state.cameraX = 0;

    const justPressed = state.input.action && !state.lastAction;
    if (justPressed) {
      await handleAction(state);
    }
    state.lastAction = state.input.action;
  }

  function frame() {
    const now = performance.now();
    const dt = Math.min(0.032, (now - lastFrame) / 1000);
    lastFrame = now;

    update(dt).then(() => {
      renderGame(ctx, state);
      if (!state.ended) {
        requestAnimationFrame(frame);
      }
    });
  }

  requestAnimationFrame(frame);
}

function updatePlayerAnimation(state, dt) {
  const player = state.player;
  if (!player.isMoving || !player.isGrounded) {
    player.walkTimer = 0;
    return;
  }
  player.walkTimer += dt;
  if (player.walkTimer >= 0.18) {
    player.walkTimer = 0;
    player.walkFrame = player.walkFrame === 0 ? 1 : 0;
  }
}

function createVibeCoder({ x, direction }) {
  return {
    position: { x, y: TOP_FLOOR_Y },
    direction,
    speed: CODER_BASE_SPEED,
    width: 48,
    height: 48,
    frameIndex: 0,
    frameTimer: 0,
    nextDropAt: 0,
  };
}

function updateVibeCoders(state, dt) {
  const elapsed = (performance.now() - state.startTime) / 1000;

  if (!state.vibecoders.length) {
    state.vibecoders.push(createVibeCoder({ x: 200, direction: 1 }));
  }

  if (!state.secondCoderEnabled && !state.toast && elapsed >= SECOND_CODER_TIME - TOAST_LEAD_TIME) {
    state.toast = {
      message: "Uh oh, the customer has hired another vibe coder. Let’s try to keep up!",
      until: performance.now() + TOAST_DURATION * 1000,
    };
  }

  if (!state.secondCoderEnabled && elapsed >= SECOND_CODER_TIME) {
    const firstDirection = state.vibecoders[0]?.direction || 1;
    state.vibecoders.push(createVibeCoder({ x: state.levelWidth - 240, direction: firstDirection * -1 }));
    state.secondCoderEnabled = true;
  }

  if (state.toast && performance.now() > state.toast.until) {
    state.toast = null;
  }

  const minX = 80;
  const maxX = state.levelWidth - 80;
  state.vibecoders.forEach((coder) => {
    coder.position.x += coder.direction * coder.speed * dt;
    coder.frameTimer += dt;
    if (coder.frameTimer >= 0.2) {
      coder.frameTimer = 0;
      coder.frameIndex = coder.frameIndex === 0 ? 1 : 0;
    }

    if (coder.position.x <= minX) {
      coder.position.x = minX;
      coder.direction = 1;
    }
    if (coder.position.x >= maxX) {
      coder.position.x = maxX;
      coder.direction = -1;
    }
  });
}

async function updateArtifactDrops(state, dt) {
  const now = performance.now() / 1000;
  for (const coder of state.vibecoders) {
    if (!coder.nextDropAt) {
      coder.nextDropAt = now + CODER_DROP_INTERVAL;
    }
    if (now >= coder.nextDropAt) {
      const spawnResponse = await spawnArtifact(state.sessionId, {
        x: coder.position.x,
        y: coder.position.y + 8,
      });
      if (spawnResponse && spawnResponse.artifact) {
        state.artifacts.push({
          ...spawnResponse.artifact,
          velocityY: 0,
        });
      }
      coder.nextDropAt = now + CODER_DROP_INTERVAL;
    }
  }

  const GRAVITY = 700;
  const surfaces = state.terrain;
  for (const artifact of state.artifacts) {
    if (artifact.status !== "inAir") {
      continue;
    }
    artifact.velocityY = (artifact.velocityY || 0) + GRAVITY * dt;
    artifact.position.y += artifact.velocityY * dt;

    const landingY = getSurfaceY(surfaces, artifact.position.x);
    if (artifact.position.y >= landingY) {
      artifact.position.y = landingY;
      artifact.velocityY = 0;
      artifact.status = "ground";
      updateArtifactStatus(state.sessionId, artifact.id, "ground");
    }
  }

  for (const artifact of state.artifacts) {
    if (artifact.status !== "flying" || !artifact.target) {
      continue;
    }
    const dx = artifact.target.x - artifact.position.x;
    const dy = artifact.target.y - artifact.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    if (distance < 8) {
      artifact.status = "deposited";
      artifact.target = null;
      continue;
    }
    const speed = 220;
    artifact.position.x += (dx / distance) * speed * dt;
    artifact.position.y += (dy / distance) * speed * dt;
  }
}

function getSurfaceY(terrain, x) {
  let topY = Infinity;
  terrain.forEach((segment) => {
    if (x >= segment.bounds.x && x <= segment.bounds.x + segment.bounds.width) {
      if (segment.bounds.y < topY) {
        topY = segment.bounds.y;
      }
    }
  });
  return Number.isFinite(topY) ? topY : 0;
}
const BACKGROUND_WIDTH = 1536;
const BACKGROUND_HEIGHT = 1024;
const VIEW_WIDTH = 1024;
const VIEW_HEIGHT = Math.round(BACKGROUND_HEIGHT * (VIEW_WIDTH / BACKGROUND_WIDTH));
const SCALE = VIEW_WIDTH / BACKGROUND_WIDTH;
const BOTTOM_FLOOR_FROM_BOTTOM = 186;
const TOP_FLOOR_FROM_BOTTOM = 709;
const BOTTOM_FLOOR_Y = VIEW_HEIGHT - Math.round(BOTTOM_FLOOR_FROM_BOTTOM * SCALE);
const TOP_FLOOR_Y = VIEW_HEIGHT - Math.round(TOP_FLOOR_FROM_BOTTOM * SCALE);
