import { startSession, endSession, spawnArtifact, updateArtifactStatus } from "./session-api.js";
import { triggerRateLimitToast } from "./toast.js";
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
const SECOND_CODER_TOAST_DURATION = TOAST_DURATION + 2;
const CODER_SPAWN_BUFFER = 90;
const CODER_SPAWN_GAP = 140;
const IMP_FIRST_APPEAR_MIN = 10;
const IMP_FIRST_APPEAR_MAX = 20;
const IMP_SECOND_APPEAR_TIME = 40;
const IMP_SECOND_APPEAR_WINDOW = 10;
const IMP_SECOND_APPEAR_CHANCE = 0.5;
const IMP_MAX_PLACEMENTS = 5;
const IMP_MIN_PLACEMENTS = 1;
const IMP_PLACEMENT_WINDOW = 2.0;
const IMP_PLACEMENT_INTERVAL = 0.35;
const IMP_OBSTACLE_SIZE = 32;
const IMP_VISIBILITY_SECONDS = 4.0;
const IMP_MAX_HEIGHT_TILES = 7;
const PO_IMAGES = {
  happy: "/src/assets/po_happy.png",
  content: "/src/assets/po_content.png",
  sad: "/src/assets/po_sad.png",
};

export async function startGame(canvas, input, ui = {}) {
  const ctx = canvas.getContext("2d");
  const audio = createAudioManager();
  const logList = ui.logList || null;
  const poImage = ui.poImage || null;
  const initialStrings = ui.strings || null;
  const onGameEnd = typeof ui.onGameEnd === "function" ? ui.onGameEnd : null;
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
    groundY: 0,
    imp: null,
    eventLog: [],
    logDirty: false,
    blockerCount: 0,
    poMood: null,
    isMuted: false,
    fomoState: null,
    gameOverMessage: "",
    playerSpeedPercent: 100,
    strings: initialStrings,
    loadingSession: false,
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
    state.timeRemaining = session.durationSeconds;
    state.score = 0;
    state.playerSpeedPercent = session.playerSpeedPercent ?? 100;
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
    state.groundY = groundY;
    state.player.velocity = { x: 0, y: 0 };
    state.player.isGrounded = true;
    state.player.isMoving = false;
    state.player.walkFrame = 0;
    state.player.walkTimer = 0;
    state.ended = false;
    state.vibecoders = [];
    state.toast = null;
    state.secondCoderEnabled = false;
    state.secondCoderTime = randomInRange(SECOND_CODER_TIME_MIN, SECOND_CODER_TIME_MAX);
    state.lastCountdownSecond = null;
    state.debris = [];
    state.imp = createImpState();
    state.eventLog = [];
    state.logDirty = true;
    state.blockerCount = countBlockers(state);
    state.fomoState = null;
    state.gameOverMessage = "";
    state.isMuted = audio.isMuted();
    updatePOMood(state, poImage);
  }

  let lastFrame = performance.now();

  async function update(dt) {
    if (state.ended) {
      return;
    }

    if (state.input.toggleMute) {
      audio.toggleMute();
      state.input.toggleMute = false;
      state.isMuted = audio.isMuted();
    }

    if (!state.started) {
      if (state.input.action && !state.lastAction && !state.loadingSession) {
        state.loadingSession = true;
        await loadSession();
        state.started = true;
        state.startTime = performance.now();
        audio.setGameStarted();
        state.loadingSession = false;
      }
      state.lastAction = state.input.action;
      return;
    }

    state.timeRemaining = Math.max(0, state.durationSeconds - (performance.now() - state.startTime) / 1000);
    if (state.timeRemaining <= 0) {
      state.ended = true;
      state.carriedArtifactId = null;
      const remainingUnchecked = state.artifacts.filter((artifact) => artifact.status !== "deposited").length;
      state.fomoState = remainingUnchecked === 0 ? "defeated" : "enraged";
      const gameOverStrings = state.strings?.gameOver || {};
      state.gameOverMessage = state.fomoState === "defeated"
        ? gameOverStrings.defeated || "FOMO Demon defeated! The code is clean."
        : gameOverStrings.enraged || "FOMO Demon enraged! Unchecked code remains.";
      audio.stopMusic();
      if (state.fomoState === "enraged") {
        audio.playSfx("fomoAngry");
        const logStrings = state.strings?.log || {};
        addEventLog(state, logStrings.fomoRise || "The FOMO Demon rises. Unchecked code feeds its rage.");
      } else {
        audio.playSfx("gameOver");
      }
      const result = state.fomoState === "defeated" ? "won" : "lost";
      await endSession(state.sessionId, result);
      if (onGameEnd) {
        onGameEnd({
          result,
          remainingUnchecked,
        });
      }
      return;
    }

    applyPhysics(state, dt);
    const breakEvents = resolveTerrainCollision(state, state.terrain);
    if (breakEvents.length) {
      audio.playSfx("break");
      breakEvents.forEach((event) => spawnDebris(state, event));
      const logStrings = state.strings?.log || {};
      const breaker = logStrings.brokeBlockers;
      addEventLog(
        state,
        typeof breaker === "function"
          ? breaker(breakEvents.length)
          : `Broke ${breakEvents.length} blocker${breakEvents.length === 1 ? "" : "s"}.`
      );
    }
    updatePlayerAnimation(state, dt);
    if (state.player.justJumped) {
      audio.playSfx("jump");
    }

    updateVibeCoders(state, dt, audio);
    await updateArtifactDrops(state, dt, audio);
    updateImp(state, dt, audio);

    state.score = state.artifacts.filter((artifact) => artifact.status === "ground").length;
    state.blockerCount = countBlockers(state);
    updatePOMood(state, poImage);

    state.cameraX = 0;

    const justPressed = state.input.action && !state.lastAction;
    if (justPressed) {
      const actionResult = await handleAction(state);
      if (actionResult === "trash") {
        audio.playSfx("trash");
        const logStrings = state.strings?.log || {};
        addEventLog(state, logStrings.deposited || "Deposited unchecked code in the bin.");
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

    if (state.logDirty && logList) {
      renderEventLog(logList, state.eventLog);
      state.logDirty = false;
    }
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

  return {
    setStrings(nextStrings) {
      state.strings = nextStrings;
      state.poMood = null;
      updatePOMood(state, poImage);
    },
  };
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

function randomInt(min, max) {
  return Math.floor(randomInRange(min, max + 1));
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
    const toastStrings = state.strings?.toast || {};
    state.toast = {
      message:
        toastStrings.secondCoderWarning ||
        "Uh oh, the customer has hired another vibe coder. Let’s try to keep up!",
      until: performance.now() + SECOND_CODER_TOAST_DURATION * 1000,
    };
    audio.playSfx("warning");
    const logStrings = state.strings?.log || {};
    addEventLog(state, logStrings.warningSecond || "Warning: vibe coder #2 is about to join.");
  }

  if (!state.secondCoderEnabled && elapsed >= state.secondCoderTime) {
    const firstDirection = state.vibecoders[0]?.direction || 1;
    const avoidX = state.vibecoders[0]?.position?.x ?? null;
    const spawnX = pickSpawnX(state.levelWidth, avoidX);
    state.vibecoders.push(createVibeCoder({ x: spawnX, direction: firstDirection * -1 }));
    state.secondCoderEnabled = true;
    const logStrings = state.strings?.log || {};
    addEventLog(state, logStrings.secondJoined || "Vibe coder #2 joined the chaos.");
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
  for (let index = 0; index < state.vibecoders.length; index += 1) {
    const coder = state.vibecoders[index];
    if (!coder.nextDropAt) {
      coder.nextDropAt = now + CODER_DROP_INTERVAL;
    }
    if (now >= coder.nextDropAt) {
      try {
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
          const logStrings = state.strings?.log || {};
          const coderDrop = logStrings.coderDrop;
          addEventLog(
            state,
            typeof coderDrop === "function"
              ? coderDrop(index + 1)
              : `Vibe coder #${index + 1} dropped unchecked code.`
          );
        }
      } catch (error) {
        if (error && error.status === 429) {
          triggerRateLimitToast(state);
        }
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
      updateArtifactStatus(state.sessionId, artifact.id, "ground").catch((error) => {
        if (error && error.status === 429) {
          triggerRateLimitToast(state);
        }
      });
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

function createImpState() {
  const firstAppearance = randomInRange(IMP_FIRST_APPEAR_MIN, IMP_FIRST_APPEAR_MAX);
  const secondAppearance = Math.random() < IMP_SECOND_APPEAR_CHANCE
    ? randomInRange(IMP_SECOND_APPEAR_TIME, IMP_SECOND_APPEAR_TIME + IMP_SECOND_APPEAR_WINDOW)
    : null;

  return {
    firstAppearance,
    secondAppearance,
    active: false,
    placements: [],
    nextPlacementAt: 0,
    visibleUntil: 0,
    position: null,
    firstTriggered: false,
    secondTriggered: false,
  };
}

function updateImp(state, dt, audio) {
  const elapsed = (performance.now() - state.startTime) / 1000;
  if (!state.imp) {
    state.imp = createImpState();
  }

  if (!state.imp.firstTriggered && elapsed >= state.imp.firstAppearance) {
    state.imp.firstTriggered = true;
    triggerImpAppearance(state, audio, true);
  }

  if (
    state.imp.secondAppearance !== null &&
    !state.imp.secondTriggered &&
    elapsed >= state.imp.secondAppearance
  ) {
    state.imp.secondTriggered = true;
    triggerImpAppearance(state, audio, true);
  }

  if (state.imp.active && state.imp.placements.length) {
    const now = performance.now() / 1000;
    if (now >= state.imp.nextPlacementAt) {
      const placement = state.imp.placements.shift();
      if (placement) {
        addImpObstacle(state, placement);
        state.imp.position = {
          x: placement.x + placement.width / 2,
          y: placement.y,
        };
        state.imp.visibleUntil = now + IMP_VISIBILITY_SECONDS;
        audio.playSfx("impWhoosh");
      }
      state.imp.nextPlacementAt = now + IMP_PLACEMENT_INTERVAL;
      if (!state.imp.placements.length) {
        state.imp.active = false;
      }
    }
  }
}

function triggerImpAppearance(state, audio, showToast) {
  const placements = buildImpPlacements(state);
  if (!placements.length) {
    return;
  }
  state.imp.active = true;
  state.imp.placements = placements;
  state.imp.nextPlacementAt = performance.now() / 1000;
  state.imp.position = {
    x: placements[0].x + placements[0].width / 2,
    y: placements[0].y,
  };
  state.imp.visibleUntil = performance.now() / 1000 + IMP_VISIBILITY_SECONDS;
  if (showToast) {
    const toastStrings = state.strings?.toast || {};
    state.toast = {
      message:
        toastStrings.impWarning || "Oh no Imp Ediment is out and about placing blockers, look out!",
      until: performance.now() + TOAST_DURATION * 1000 * 2,
    };
  }
  const logStrings = state.strings?.log || {};
  const impAppeared = logStrings.impAppeared;
  addEventLog(
    state,
    typeof impAppeared === "function"
      ? impAppeared(placements.length)
      : `Imp Ediment appeared: placing ${placements.length} blocker${placements.length === 1 ? "" : "s"}.`
  );
  audio.playSfx("impWhoosh");
}

function buildImpPlacements(state) {
  const count = randomInt(IMP_MIN_PLACEMENTS, IMP_MAX_PLACEMENTS);
  const placements = [];
  const start = performance.now() / 1000;
  const attemptsPerPlacement = 20;

  for (let i = 0; i < count; i += 1) {
    let placed = false;
    for (let attempt = 0; attempt < attemptsPerPlacement; attempt += 1) {
      if (performance.now() / 1000 - start > IMP_PLACEMENT_WINDOW) {
        return placements;
      }
      const candidate = pickImpPlacement(state);
      if (candidate && !overlapsPlacement(candidate, placements)) {
        placements.push(candidate);
        placed = true;
        break;
      }
    }
    if (!placed) {
      continue;
    }
  }

  return placements;
}

function pickImpPlacement(state) {
  const bounds = getSpawnBounds(state.levelWidth);
  const trashTop = state.trashCan.bounds.y;
  const minY = trashTop - 96;
  const maxY = trashTop;
  if (maxY <= minY) {
    return null;
  }
  const x = clamp(alignToTile(randomInRange(bounds.minX, bounds.maxX)), bounds.minX, bounds.maxX - IMP_OBSTACLE_SIZE);
  const y = clamp(alignToTile(randomInRange(minY, maxY)), minY, maxY);
  const placement = { x, y, width: IMP_OBSTACLE_SIZE, height: IMP_OBSTACLE_SIZE };

  if (!isPlacementValid(state, placement)) {
    return null;
  }
  return placement;
}

function isPlacementValid(state, placement) {
  if (rectsOverlap(placement, state.trashCan.bounds)) {
    return false;
  }

  const playerBounds = {
    x: state.player.position.x,
    y: state.player.position.y - state.player.height,
    width: state.player.width,
    height: state.player.height,
  };
  if (rectsOverlap(placement, playerBounds)) {
    return false;
  }

  for (const segment of state.terrain) {
    if (segment.type !== "ground" && rectsOverlap(placement, segment.bounds)) {
      return false;
    }
  }

  for (const artifact of state.artifacts) {
    if (artifact.status === "deposited") {
      continue;
    }
    const artifactBounds = {
      x: artifact.position.x,
      y: artifact.position.y - 36,
      width: 48,
      height: 48,
    };
    if (rectsOverlap(placement, artifactBounds)) {
      return false;
    }
  }

  return true;
}

function overlapsPlacement(candidate, placements) {
  return placements.some((placement) => rectsOverlap(candidate, placement));
}

function addImpObstacle(state, placement) {
  state.terrain.push({
    id: `imp_obstacle_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
    type: "stone",
    bounds: { ...placement },
  });
}

function addEventLog(state, message) {
  if (!message) {
    return;
  }
  const timeMark = Math.max(0, Math.floor(state.durationSeconds - state.timeRemaining));
  const entry = `[${timeMark}s] ${message}`;
  state.eventLog.unshift(entry);
  const maxEntries = 8;
  if (state.eventLog.length > maxEntries) {
    state.eventLog.length = maxEntries;
  }
  state.logDirty = true;
}

function countBlockers(state) {
  return state.terrain.filter((segment) => segment.type !== "ground").length;
}

function getPOMood(blockerCount) {
  if (blockerCount === 0) {
    return "happy";
  }
  if (blockerCount <= 3) {
    return "content";
  }
  return "sad";
}

function updatePOMood(state, poImage) {
  const nextMood = getPOMood(state.blockerCount);
  if (nextMood === state.poMood) {
    return;
  }
  state.poMood = nextMood;
  if (!poImage) {
    return;
  }
  poImage.src = PO_IMAGES[nextMood];
  const moodStrings = state.strings?.poMood || {};
  const label = moodStrings[nextMood] || nextMood.charAt(0).toUpperCase() + nextMood.slice(1);
  const prefix = state.strings?.ui?.poStatusTitle || "PO Status";
  poImage.alt = `${prefix}: ${label}`;
  poImage.title = `${prefix}: ${label}`;
  const logStrings = state.strings?.log || {};
  const moodMessage = typeof logStrings.poMoodChange === "function"
    ? logStrings.poMoodChange(label)
    : `PO mood is now ${label}.`;
  addEventLog(state, moodMessage);
}

function renderEventLog(logList, entries) {
  if (!logList) {
    return;
  }
  logList.innerHTML = "";
  entries.forEach((entry) => {
    const item = document.createElement("li");
    item.textContent = entry;
    logList.appendChild(item);
  });
}

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function alignToTile(value) {
  return Math.round(value / IMP_OBSTACLE_SIZE) * IMP_OBSTACLE_SIZE;
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
