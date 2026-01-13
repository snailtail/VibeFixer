const MUSIC_TRACK = "/assets/audio/chiptune_crazy.ogg";
const SFX_SOURCES = {
  break: "/assets/audio/sfx_break.mp3",
  countdown: "/assets/audio/sfx_countdown.wav",
  drop: "/assets/audio/sfx_drop.wav",
  fomoAngry: "/assets/audio/sfx_fomo_angry.wav",
  gameOver: "/assets/audio/game_over.mp3",
  impWhoosh: "/assets/audio/sfx_imp_whoosh.wav",
  jump: "/assets/audio/sfx_jump.wav",
  trash: "/assets/audio/sfx_trash.wav",
  warning: "/assets/audio/sfx_warning.wav",
};
const STORAGE_KEY = "vibefixer:muted";
const MUSIC_VOLUME = 0.5;
const SFX_VOLUME = 0.6;

export function createAudioManager() {
  const audio = new Audio(MUSIC_TRACK);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = MUSIC_VOLUME;
  const sfxCache = Object.entries(SFX_SOURCES).reduce((acc, [name, src]) => {
    const sfx = new Audio(src);
    sfx.preload = "auto";
    acc[name] = sfx;
    return acc;
  }, {});

  let gameStarted = false;
  let muted = loadMutedPreference();
  audio.muted = muted;

  function loadMutedPreference() {
    try {
      return localStorage.getItem(STORAGE_KEY) === "true";
    } catch (error) {
      return false;
    }
  }

  function persistMutedPreference() {
    try {
      localStorage.setItem(STORAGE_KEY, muted ? "true" : "false");
    } catch (error) {
      // Ignore storage errors to keep the game playable.
    }
  }

  function applyMuteState() {
    if (muted) {
      audio.pause();
      audio.muted = true;
      return;
    }
    audio.muted = false;
    if (gameStarted) {
      audio.play().catch(() => {
        // Ignore autoplay restrictions or transient errors.
      });
    }
  }

  function setGameStarted() {
    gameStarted = true;
    applyMuteState();
  }

  function stopMusic() {
    audio.pause();
    audio.currentTime = 0;
  }

  function toggleMute() {
    muted = !muted;
    persistMutedPreference();
    applyMuteState();
  }

  function playSfx(name) {
    if (muted) {
      return;
    }
    const base = sfxCache[name];
    if (!base) {
      return;
    }
    const sfx = base.cloneNode();
    sfx.volume = SFX_VOLUME;
    sfx.play().catch(() => {
      // Ignore transient playback errors.
    });
  }

  function isMuted() {
    return muted;
  }

  return {
    setGameStarted,
    stopMusic,
    toggleMute,
    playSfx,
    isMuted,
  };
}
