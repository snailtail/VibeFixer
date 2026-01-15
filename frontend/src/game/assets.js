const ASSET_PATHS = {
  playerIdle: "/assets/kenney/Sprites/Characters/Double/character_green_idle.png",
  playerJump: "/assets/kenney/Sprites/Characters/Double/character_green_jump.png",
  playerWalkA: "/assets/kenney/Sprites/Characters/Double/character_green_walk_a.png",
  playerWalkB: "/assets/kenney/Sprites/Characters/Double/character_green_walk_b.png",
  artifact: "/assets/kenney/Sprites/Tiles/Double/star.png",
  stone: "/assets/kenney/Sprites/Tiles/Default/block_empty.png",
  vibecoderA: "/assets/kenney/Sprites/Enemies/Default/barnacle_attack_a.png",
  vibecoderB: "/assets/kenney/Sprites/Enemies/Default/barnacle_attack_b.png",
  background: "/src/assets/kommun_bg.png",
  backgroundKommun: "/src/assets/kommun_bg.png",
  backgroundDanger: "/src/assets/danger_bg.png",
  impEdiment: "/src/assets/imp_ediment.png",
  fomoDemon: "/src/assets/fomo_demon.png",
};

const images = new Map();
let loadingStarted = false;

function loadImage(name, src) {
  const image = new Image();
  image.src = src;
  images.set(name, { image, loaded: false });
  image.onload = () => {
    const entry = images.get(name);
    if (entry) {
      entry.loaded = true;
    }
  };
}

export function preloadAssets() {
  if (loadingStarted) {
    return;
  }
  loadingStarted = true;
  Object.entries(ASSET_PATHS).forEach(([name, src]) => {
    loadImage(name, src);
  });
}

export function getAsset(name) {
  const entry = images.get(name);
  if (!entry || !entry.loaded) {
    return null;
  }
  return entry.image;
}
