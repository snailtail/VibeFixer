import { startSession, endSession, spawnArtifact, updateArtifactStatus } from "./session-api.js";
import { renderGame } from "./renderer.js";
import { handleAction } from "./interactions.js";
import { applyPhysics } from "./physics.js";
import { resolveTerrainCollision } from "./collision.js";
import { createAudioManager } from "./audio.js";

const PLAYER_WIDTH = 64;
const PLAYER_HEIGHT = 64;
const CODER_BASE_SPEED = 20;
const CODER_DROP_INTERVAL = 6.0;
const CODER_SPEED_MIN_MULT = 0.5;
const CODER_SPEED_MAX_MULT = 1.6;
const CODER_SPEED_CHANGE_MIN = 1.0;
const CODER_SPEED_CHANGE_MAX = 3.0;
const SECOND_CODER_TIME_MIN = 27;
const SECOND_CODER_TIME_MAX = 33;
const TOAST_LEAD_TIME = 3;
const TOAST_DURATION = 3.5;
const CODER_SPAWN_BUFFER = 90;
const CODER_SPAWN_GAP = 140;

export async function startGame(canvas, input) {
  const ctx = canvas.getContext("2d");
  const audio = createAudioManager();
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
    levelHeight: 0,
    cameraX: 0,
    vibecoders: [],
    toast: null,
    secondCoderEnabled: false,
    secondCoderTime: SECOND_CODER_TIME_MIN,
    started: false,
    remainingArtifacts: 0,
    carriedArtifactId: null,
    debris: [],
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
    lastCountdownSecond: null,
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
    state.levelHeight = canvas.height;
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
    state.secondCoderTime = randomInRange(SECOND_CODER_TIME_MIN, SECOND_CODER_TIME_MAX);
    state.lastCountdownSecond = null;
    state.debris = [];
  }

  await loadSession();

  let lastFrame = performance.now();

  async function update(dt) {
    if (state.ended) {
      return;
    }

    if (state.input.toggleMute) {
      audio.toggleMute();
      state.input.toggleMute = false;
    }

    if (!state.started) {
      if (state.input.action && !state.lastAction) {
        state.started = true;
        state.startTime = performance.now();
        audio.setGameStarted();
      }
      state.lastAction = state.input.action;
      return;
    }

    state.timeRemaining = Math.max(0, state.durationSeconds - (performance.now() - state.startTime) / 1000);
    if (state.timeRemaining <= 0) {
      state.ended = true;
      state.carriedArtifactId = null;
      audio.stopMusic();
      audio.playSfx("gameOver");
      await endSession(state.sessionId);
      return;
    }

    applyPhysics(state, dt);
    const breakEvents = resolveTerrainCollision(state, state.terrain);
    if (breakEvents.length) {
      audio.playSfx("break");
      breakEvents.forEach((event) => spawnDebris(state, event));
    }
    updatePlayerAnimation(state, dt);
    if (state.player.justJumped) {
      audio.playSfx("jump");
    }

    updateVibeCoders(state, dt, audio);
    await updateArtifactDrops(state, dt, audio);

    state.score = state.artifacts.filter((artifact) => artifact.status === "ground").length;

    state.cameraX = 0;

    const justPressed = state.input.action && !state.lastAction;
    if (justPressed) {
      const actionResult = await handleAction(state);
      if (actionResult === "trash") {
        audio.playSfx("trash");
      } else if (actionResult === "drop") {
        audio.playSfx("drop");
      }
    }
    state.lastAction = state.input.action;

    if (state.timeRemaining <= 10) {
      const second = Math.ceil(state.timeRemaining);
      if (second > 0 && second !== state.lastCountdownSecond) {
        audio.playSfx("countdown");
        state.lastCountdownSecond = second;
      }
    }

    updateDebris(state, dt);
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

function spawnDebris(state, event) {
  const count = 6;
  for (let i = 0; i < count; i += 1) {
    state.debris.push({
      x: event.x + Math.random() * event.width,
      y: event.y + Math.random() * event.height,
      vx: (Math.random() - 0.5) * 80,
      vy: -randomInRange(120, 220),
      size: randomInRange(2, 4),
      life: randomInRange(0.6, 1.1),
    });
  }
}

function updateDebris(state, dt) {
  if (!state.debris.length) {
    return;
  }
  const gravity = 520;
  state.debris = state.debris.filter((piece) => {
    piece.life -= dt;
    piece.vy += gravity * dt;
    piece.x += piece.vx * dt;
    piece.y += piece.vy * dt;
    return piece.life > 0 && piece.y < state.levelHeight + 40;
  });
}

function randomInRange(min, max) {
  return min + Math.random() * (max - min);
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
  const speed = randomCoderSpeed();
  return {
    position: { x, y: TOP_FLOOR_Y },
    direction,
    speed,
    width: 48,
    height: 48,
    frameIndex: 0,
    frameTimer: 0,
    nextDropAt: 0,
    nextSpeedChangeAt: 0,
  };
}

function updateVibeCoders(state, dt, audio) {
  const elapsed = (performance.now() - state.startTime) / 1000;

  if (!state.vibecoders.length) {
    const spawnX = pickSpawnX(state.levelWidth);
    const direction = Math.random() < 0.5 ? -1 : 1;
    state.vibecoders.push(createVibeCoder({ x: spawnX, direction }));
  }

  if (!state.secondCoderEnabled && !state.toast && elapsed >= state.secondCoderTime - TOAST_LEAD_TIME) {
    state.toast = {
      message: "Uh oh, the customer has hired another vibe coder. Let’s try to keep up!",
      until: performance.now() + TOAST_DURATION * 1000,
    };
    audio.playSfx("warning");
  }

  if (!state.secondCoderEnabled && elapsed >= state.secondCoderTime) {
    const firstDirection = state.vibecoders[0]?.direction || 1;
    const avoidX = state.vibecoders[0]?.position?.x ?? null;
    const spawnX = pickSpawnX(state.levelWidth, avoidX);
    state.vibecoders.push(createVibeCoder({ x: spawnX, direction: firstDirection * -1 }));
    state.secondCoderEnabled = true;
  }

  if (state.toast && performance.now() > state.toast.until) {
    state.toast = null;
  }

  const minX = getSpawnBounds(state.levelWidth).minX;
  const maxX = getSpawnBounds(state.levelWidth).maxX;
  state.vibecoders.forEach((coder) => {
    if (!coder.nextSpeedChangeAt) {
      coder.nextSpeedChangeAt = elapsed + randomInRange(CODER_SPEED_CHANGE_MIN, CODER_SPEED_CHANGE_MAX);
    } else if (elapsed >= coder.nextSpeedChangeAt) {
      coder.speed = randomCoderSpeed();
      coder.nextSpeedChangeAt = elapsed + randomInRange(CODER_SPEED_CHANGE_MIN, CODER_SPEED_CHANGE_MAX);
    }
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

async function updateArtifactDrops(state, dt, audio) {
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
        audio.playSfx("drop");
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

function getSpawnBounds(levelWidth) {
  return {
    minX: 80 + CODER_SPAWN_BUFFER,
    maxX: levelWidth - 80 - CODER_SPAWN_BUFFER,
  };
}

function pickSpawnX(levelWidth, avoidX = null) {
  const bounds = getSpawnBounds(levelWidth);
  let candidate = randomInRange(bounds.minX, bounds.maxX);
  if (avoidX == null) {
    return candidate;
  }
  for (let attempt = 0; attempt < 6; attempt += 1) {
    if (Math.abs(candidate - avoidX) >= CODER_SPAWN_GAP) {
      return candidate;
    }
    candidate = randomInRange(bounds.minX, bounds.maxX);
  }
  return clamp(avoidX + CODER_SPAWN_GAP, bounds.minX, bounds.maxX);
}

function randomCoderSpeed() {
  return CODER_BASE_SPEED * randomInRange(CODER_SPEED_MIN_MULT, CODER_SPEED_MAX_MULT);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
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
