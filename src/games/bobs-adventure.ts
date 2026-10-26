import type { ActionSet } from "./arcade-simulation";

export interface AdventurePlatform {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AdventureSpike {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface AdventureEnemy {
  x: number;
  y: number;
  minX: number;
  maxX: number;
  speed: number;
  direction: -1 | 1;
  alive: boolean;
}

export interface AdventureCoin {
  x: number;
  y: number;
  collected: boolean;
}

export interface BobAdventureModel {
  id: "bobs-adventure";
  phase: "ready" | "playing" | "won" | "over";
  score: number;
  message: string;
  level: number;
  levelName: string;
  theme: number;
  worldWidth: number;
  platforms: AdventurePlatform[];
  spikes: AdventureSpike[];
  enemies: AdventureEnemy[];
  coins: AdventureCoin[];
  exitX: number;
  checkpointX: number;
  checkpointReached: boolean;
  player: { x: number; y: number; width: number; height: number; vx: number; vy: number; grounded: boolean; facing: -1 | 1 };
  lives: number;
  invulnerable: number;
  jumpQueued: boolean;
  jumpBuffer: number;
  coyoteTime: number;
  jumpCutGrace: number;
  jumpCutAvailable: boolean;
  tapMoveDirection: -1 | 0 | 1;
  tapMoveTimer: number;
  dropTimer: number;
  levelTransition: number;
  elapsed: number;
}

interface Chunk {
  ground: Array<[startX: number, endX: number]>;
  ledges: Array<[number, number, number]>;
  spikes?: Array<{ x: number; y?: number; width: number; height?: number }>;
  coins?: Array<[number, number]>;
  enemies?: Array<[number, number, number]>;
}

interface LevelPlan {
  name: string;
  route: number[];
}

const GROUND_Y = 320;
const CHUNK_WIDTH = 480;
const PLAYER_WIDTH = 20;
const PLAYER_HEIGHT = 28;

const chunks: Chunk[] = [
  // Ubud: rice terraces, bamboo crossings, and a gentle first route.
  { ground: [[0, 480]], ledges: [[84, 270, 72], [186, 236, 74], [296, 202, 72]], spikes: [{ x: 420, width: 22 }], coins: [[106, 240], [210, 206], [320, 172]] },
  { ground: [[0, 182], [270, 480]], ledges: [[144, 270, 82], [226, 232, 76], [322, 260, 76]], coins: [[163, 240], [246, 202], [345, 230]], enemies: [[398, 350, 452]] },
  { ground: [[0, 480]], ledges: [[70, 278, 68], [162, 242, 68], [254, 206, 68], [350, 248, 70]], spikes: [{ x: 210, width: 28 }], coins: [[91, 248], [183, 212], [275, 176], [371, 218]], enemies: [[420, 380, 454]] },
  { ground: [[0, 480]], ledges: [[120, 266, 76], [214, 232, 76], [312, 198, 76]], spikes: [{ x: 238, y: 210, width: 28, height: 20 }], coins: [[141, 236], [234, 202], [332, 168]], enemies: [[422, 382, 455]] },
  { ground: [[0, 160], [286, 480]], ledges: [[145, 270, 80], [222, 232, 74], [300, 264, 66], [376, 222, 62]], spikes: [{ x: 335, width: 30 }], coins: [[166, 240], [243, 202], [321, 234], [397, 192]], enemies: [[428, 380, 457]] },

  // Merapi: ash ridges, lava gaps, and narrower safe landings.
  { ground: [[0, 480]], ledges: [[88, 258, 72], [204, 218, 68], [326, 258, 68]], coins: [[109, 228], [225, 188], [347, 228]], enemies: [[414, 370, 454]] },
  { ground: [[0, 166], [268, 480]], ledges: [[132, 256, 72], [216, 220, 70], [300, 264, 72]], spikes: [{ x: 354, width: 32 }], coins: [[151, 226], [235, 190], [319, 234]], enemies: [[408, 350, 452]] },
  { ground: [[0, 104], [220, 340], [410, 480]], ledges: [[78, 270, 68], [154, 230, 68], [286, 218, 68], [362, 270, 64]], spikes: [{ x: 238, width: 30 }], coins: [[97, 240], [173, 200], [305, 188], [381, 240]], enemies: [[312, 278, 332]] },
  { ground: [[0, 480]], ledges: [[98, 252, 72], [208, 210, 70], [326, 252, 70]], spikes: [{ x: 126, width: 28 }, { x: 288, width: 32 }], coins: [[119, 216], [229, 174], [347, 216]], enemies: [[420, 378, 454]] },
  { ground: [[0, 142], [300, 480]], ledges: [[124, 264, 68], [198, 222, 64], [272, 180, 68], [352, 232, 60]], spikes: [{ x: 323, width: 34 }], coins: [[144, 228], [218, 186], [292, 144], [372, 196]], enemies: [[424, 374, 458]] },

  // Raja Ampat: coral shelves, tide pools, and island-to-island jumps.
  { ground: [[0, 480]], ledges: [[100, 272, 80], [224, 232, 72], [342, 274, 68]], coins: [[121, 236], [245, 196], [363, 238]], enemies: [[412, 370, 452]] },
  { ground: [[0, 158], [236, 318], [390, 480]], ledges: [[126, 260, 76], [205, 224, 70], [310, 244, 64], [365, 208, 62]], coins: [[145, 224], [224, 188], [329, 208], [384, 172]], enemies: [[288, 250, 308]] },
  { ground: [[0, 480]], ledges: [[72, 266, 68], [160, 228, 68], [248, 190, 68], [342, 238, 68]], spikes: [{ x: 194, y: 206, width: 24, height: 18 }], coins: [[92, 230], [180, 192], [268, 154], [362, 202]], enemies: [[420, 380, 454]] },
  { ground: [[0, 138], [242, 480]], ledges: [[112, 266, 76], [190, 228, 70], [274, 252, 70], [354, 214, 64]], spikes: [{ x: 315, width: 30 }], coins: [[132, 230], [210, 192], [294, 216], [374, 178]], enemies: [[398, 342, 456]] },
  { ground: [[0, 126], [224, 302], [410, 480]], ledges: [[90, 260, 66], [164, 220, 66], [278, 224, 66], [350, 184, 62]], spikes: [{ x: 244, width: 26 }], coins: [[109, 224], [183, 184], [297, 188], [369, 148]], enemies: [[282, 258, 294], [436, 396, 462]] },

  // Kalimantan: rooted canopy paths and river breaks.
  { ground: [[0, 480]], ledges: [[82, 270, 76], [196, 232, 74], [316, 258, 74]], coins: [[102, 234], [216, 196], [336, 222]], enemies: [[406, 350, 452]] },
  { ground: [[0, 164], [270, 480]], ledges: [[128, 258, 80], [214, 222, 72], [300, 258, 76]], spikes: [{ x: 356, width: 28 }], coins: [[148, 222], [234, 186], [320, 222]], enemies: [[408, 350, 454]] },
  { ground: [[0, 480]], ledges: [[72, 276, 64], [158, 238, 64], [244, 200, 64], [330, 238, 64]], spikes: [{ x: 186, y: 216, width: 26, height: 18 }, { x: 358, width: 28 }], coins: [[91, 240], [177, 202], [263, 164], [349, 202]], enemies: [[422, 380, 456]] },
  { ground: [[0, 146], [250, 344], [424, 480]], ledges: [[112, 260, 74], [188, 222, 70], [326, 228, 64], [394, 190, 60]], coins: [[131, 224], [207, 186], [345, 192], [413, 154]], enemies: [[294, 258, 330]] },
  { ground: [[0, 136], [246, 326], [420, 480]], ledges: [[100, 264, 70], [174, 226, 66], [302, 226, 62], [372, 186, 58]], spikes: [{ x: 263, width: 28 }], coins: [[119, 228], [193, 190], [321, 190], [391, 150]], enemies: [[286, 252, 318], [440, 402, 464]] },

  // Papua: highland steps, wind-cut ridges, and precise late-game landings.
  { ground: [[0, 480]], ledges: [[86, 270, 72], [196, 230, 68], [306, 190, 66]], coins: [[106, 234], [216, 194], [326, 154]], enemies: [[414, 372, 452]] },
  { ground: [[0, 174], [288, 480]], ledges: [[136, 256, 74], [214, 216, 66], [294, 250, 64], [372, 208, 62]], spikes: [{ x: 320, width: 28 }], coins: [[155, 220], [233, 180], [313, 214], [391, 172]], enemies: [[424, 380, 458]] },
  { ground: [[0, 480]], ledges: [[72, 274, 64], [158, 234, 64], [244, 194, 64], [330, 234, 64]], spikes: [{ x: 191, y: 212, width: 28, height: 18 }, { x: 364, width: 30 }], coins: [[92, 238], [178, 198], [264, 158], [350, 198]], enemies: [[414, 376, 454]] },
  { ground: [[0, 148], [246, 322], [418, 480]], ledges: [[114, 254, 68], [188, 214, 64], [300, 222, 60], [366, 180, 58]], spikes: [{ x: 270, width: 26 }], coins: [[133, 218], [207, 178], [319, 186], [385, 144]], enemies: [[292, 256, 316], [436, 396, 464]] },
  { ground: [[0, 132], [252, 324], [424, 480]], ledges: [[96, 258, 64], [164, 218, 60], [286, 218, 58], [352, 174, 56]], spikes: [{ x: 271, width: 32 }, { x: 386, width: 28 }], coins: [[114, 222], [182, 182], [304, 182], [370, 138]], enemies: [[292, 254, 314], [440, 400, 466]] },
];

const levelNames = [
  "Pagi di Ubud", "Pematang Sawah", "Jembatan Bambu", "Pasar Desa", "Jalan ke Kintamani",
  "Kaki Merapi", "Batu Lava", "Kebun Teh", "Lereng Hujan", "Puncak Merapi",
  "Pantai Raja Ampat", "Teluk Kecil", "Pulau Karang", "Hutan Bakau", "Laut Biru",
  "Sungai Kalimantan", "Rimba Hujan", "Rumah Panggung", "Jembatan Akar", "Kanopi Borneo",
  "Dataran Tinggi Papua", "Lembah Baliem", "Punggung Pegunungan", "Puncak Senja", "Jalan Pulang",
];

const levelPlans: LevelPlan[] = levelNames.map((name, index) => {
  const biomeStart = Math.floor(index / 5) * 5;
  const pattern = index % 5;
  return {
    name,
    route: [biomeStart + pattern, biomeStart + (pattern + 1) % 5, biomeStart + (pattern + 2) % 5],
  };
});

function addChunk(model: BobAdventureModel, chunk: Chunk, offset: number, level: number) {
  for (const [start, end] of chunk.ground) {
    const width = end - start;
    if (width <= 0) continue;
    model.platforms.push({ x: offset + start, y: GROUND_Y, width, height: 40 });
  }
  for (const [x, y, width] of chunk.ledges) {
    model.platforms.push({ x: offset + x, y, width, height: 14 });
  }
  for (const spike of chunk.spikes ?? []) {
    const height = Math.max(12, spike.height ?? 22);
    const preferredBottom = spike.y === undefined ? GROUND_Y : spike.y + height;
    const worldX = offset + spike.x;
    const support = model.platforms
      .filter((platform) => worldX + spike.width > platform.x && worldX < platform.x + platform.width)
      .sort((a, b) => Math.abs(a.y - preferredBottom) - Math.abs(b.y - preferredBottom))[0];
    model.spikes.push({
      x: worldX,
      y: (support?.y ?? GROUND_Y) - height,
      width: spike.width,
      height,
    });
  }
  for (const [x, y] of chunk.coins ?? []) {
    model.coins.push({ x: offset + x, y, collected: false });
  }
  for (const [x, minX, maxX] of chunk.enemies ?? []) {
    const proposedX = offset + x;
    const floor = model.platforms
      .filter((platform) => platform.y === GROUND_Y && platform.x < offset + CHUNK_WIDTH && platform.x + platform.width > offset)
      .sort((a, b) => {
        const aContains = proposedX >= a.x && proposedX + 23 <= a.x + a.width;
        const bContains = proposedX >= b.x && proposedX + 23 <= b.x + b.width;
        if (aContains !== bContains) return aContains ? -1 : 1;
        return Math.abs(proposedX - a.x) - Math.abs(proposedX - b.x);
      })[0];
    if (!floor || floor.width < 24) continue;
    const minAllowed = floor.x;
    const maxAllowed = floor.x + floor.width - 23;
    const patrolMin = Math.max(minAllowed, offset + minX);
    const patrolMax = Math.min(maxAllowed, offset + maxX);
    const safeMin = patrolMax - patrolMin >= 20 ? patrolMin : minAllowed;
    const safeMax = patrolMax - patrolMin >= 20 ? patrolMax : maxAllowed;
    model.enemies.push({
      x: Math.max(safeMin, Math.min(safeMax, proposedX)),
      y: GROUND_Y - 23,
      minX: safeMin,
      maxX: safeMax,
      speed: 52 + level * 3,
      direction: -1,
      alive: true,
    });
  }
}

function addProgressionSpikes(model: BobAdventureModel) {
  const highestEarlierCount = levelPlans
    .slice(0, model.level)
    .reduce((highest, plan) => Math.max(highest, plan.route.reduce((count, chunkId) => count + (chunks[chunkId]?.spikes?.length ?? 0), 0)), 0);
  const targetCount = Math.max(highestEarlierCount, 1 + Math.floor((model.level - 1) / 4));
  if (model.spikes.length >= targetCount) return;
  const width = 18 + Math.min(3, Math.floor((model.level - 1) / 8)) * 2;
  const choices: Array<Array<{ x: number; y: number }>> = [[], [], []];

  for (let chunkIndex = 0; chunkIndex < choices.length; chunkIndex += 1) {
    const chunkStart = chunkIndex * CHUNK_WIDTH;
    const ground = model.platforms.filter((platform) =>
      platform.y === GROUND_Y && platform.x < chunkStart + CHUNK_WIDTH && platform.x + platform.width > chunkStart,
    );
    for (const platform of ground) {
      const left = Math.max(platform.x + 34, chunkStart + 62);
      const right = Math.min(platform.x + platform.width - width - 34, chunkStart + CHUNK_WIDTH - 40);
      if (right - left < 28) continue;
      for (const fraction of [0.38, 0.62, 0.78]) {
        const x = Math.round(left + (right - left) * fraction);
        choices[chunkIndex]?.push({ x, y: platform.y - 18 });
      }
    }
  }

  let placed = true;
  while (model.spikes.length < targetCount && placed) {
    placed = false;
    for (const candidates of choices) {
      while (candidates.length > 0) {
        const candidate = candidates.shift();
        if (!candidate) break;
        const overlapsSpike = model.spikes.some((spike) => candidate.x < spike.x + spike.width + 24 && candidate.x + width + 24 > spike.x);
        const overlapsEnemy = model.enemies.some((enemy) => candidate.x < enemy.x + 32 && candidate.x + width > enemy.x - 12);
        if (overlapsSpike || overlapsEnemy || candidate.x < 72 || candidate.x + width > model.exitX - 34) continue;
        model.spikes.push({ ...candidate, width, height: 18 });
        placed = true;
        break;
      }
      if (model.spikes.length >= targetCount) break;
    }
  }
}

export function createBobAdventure(level = 1, score = 0): BobAdventureModel {
  const safeLevel = Math.max(1, Math.min(levelPlans.length, level));
  const plan = levelPlans[safeLevel - 1]!;
  const difficulty = Math.floor((safeLevel - 1) / 5);
  const worldWidth = plan.route.length * CHUNK_WIDTH + 180;
  const model: BobAdventureModel = {
    id: "bobs-adventure",
    phase: "ready",
    score,
    message: "Run, jump, collect coins, and reach the little gate.",
    level: safeLevel,
    levelName: plan.name,
    theme: difficulty,
    worldWidth,
    platforms: [],
    spikes: [],
    enemies: [],
    coins: [],
    exitX: worldWidth - 86,
    checkpointX: Math.floor(plan.route.length / 2) * CHUNK_WIDTH + 38,
    checkpointReached: false,
    player: { x: 40, y: GROUND_Y - PLAYER_HEIGHT, width: PLAYER_WIDTH, height: PLAYER_HEIGHT, vx: 0, vy: 0, grounded: true, facing: 1 },
    lives: 3,
    invulnerable: 0,
    jumpQueued: false,
    jumpBuffer: 0,
    coyoteTime: 100,
    jumpCutGrace: 0,
    jumpCutAvailable: false,
    tapMoveDirection: 0,
    tapMoveTimer: 0,
    dropTimer: 0,
    levelTransition: 0,
    elapsed: 0,
  };

  plan.route.forEach((chunkId, index) => {
    const chunk = chunks[chunkId];
    if (chunk) addChunk(model, chunk, index * CHUNK_WIDTH, safeLevel);
  });
  model.platforms.push({ x: plan.route.length * CHUNK_WIDTH, y: GROUND_Y, width: 180, height: 40 });
  addProgressionSpikes(model);
  return model;
}

function overlaps(a: { x: number; y: number; width: number; height: number }, b: { x: number; y: number; width: number; height: number }) {
  return a.x < b.x + b.width && a.x + a.width > b.x && a.y < b.y + b.height && a.y + a.height > b.y;
}

function approach(value: number, target: number, amount: number) {
  return value < target ? Math.min(target, value + amount) : Math.max(target, value - amount);
}

function respawn(model: BobAdventureModel) {
  model.lives -= 1;
  if (model.lives <= 0) {
    model.phase = "over";
    model.message = "That was the last heart. Try the level again.";
    return;
  }
  model.player.x = model.checkpointReached ? model.checkpointX : 40;
  model.player.y = GROUND_Y - model.player.height;
  model.player.vx = 0;
  model.player.vy = 0;
  model.player.grounded = true;
  model.coyoteTime = 100;
  model.jumpBuffer = 0;
  model.jumpCutGrace = 0;
  model.jumpCutAvailable = false;
  model.tapMoveDirection = 0;
  model.tapMoveTimer = 0;
  model.invulnerable = 1150;
  model.message = model.checkpointReached ? "Back at the flag. Keep going!" : "A little stumble. Have another go!";
}

export function updateBobAdventure(model: BobAdventureModel, delta: number, held: ActionSet) {
  if (model.phase !== "playing") {
    model.jumpQueued = false;
    return;
  }

  if (model.levelTransition > 0) {
    model.levelTransition -= delta;
    if (model.levelTransition <= 0) {
      if (model.level === levelPlans.length) {
        model.phase = "won";
        model.message = "You made it home. All 25 levels are complete!";
      } else {
        const next = createBobAdventure(model.level + 1, model.score);
        Object.assign(model, next);
        model.phase = "playing";
        model.message = "Next up: " + model.levelName + ".";
      }
    }
    return;
  }

  const seconds = Math.min(delta, 40) / 1000;
  const player = model.player;
  const previousBottom = player.y + player.height;
  const heldDirection = Number(held.has("right")) - Number(held.has("left"));
  let direction = heldDirection;
  if (model.tapMoveTimer > 0) {
    if (heldDirection === 0) direction = model.tapMoveDirection;
    model.tapMoveTimer = Math.max(0, model.tapMoveTimer - delta);
  } else {
    model.tapMoveDirection = 0;
  }
  const maxSpeed = 232 + Math.floor((model.level - 1) / 5) * 3;
  const wasGrounded = player.grounded;
  model.jumpBuffer = model.jumpQueued ? 150 : Math.max(0, model.jumpBuffer - delta);
  model.jumpQueued = false;
  model.coyoteTime = wasGrounded ? 105 : Math.max(0, model.coyoteTime - delta);
  if (direction !== 0) {
    const acceleration = wasGrounded ? 2050 : 1180;
    player.vx = approach(player.vx, direction * maxSpeed, acceleration * seconds);
    player.facing = direction < 0 ? -1 : 1;
  } else {
    const friction = wasGrounded ? 1980 : 520;
    player.vx = approach(player.vx, 0, friction * seconds);
  }

  if (held.has("down") && player.grounded) {
    model.dropTimer = 180;
    model.coyoteTime = 0;
    model.jumpBuffer = 0;
    player.grounded = false;
    player.y += 3;
  }
  model.dropTimer = Math.max(0, model.dropTimer - delta);

  if (model.jumpBuffer > 0 && (player.grounded || model.coyoteTime > 0)) {
    player.vy = -455;
    player.grounded = false;
    model.coyoteTime = 0;
    model.jumpBuffer = 0;
    model.jumpCutGrace = 105;
    model.jumpCutAvailable = true;
  }
  const jumpHeld = held.has("up") || held.has("action");
  model.jumpCutGrace = Math.max(0, model.jumpCutGrace - delta);
  if (!jumpHeld && model.jumpCutAvailable && model.jumpCutGrace <= 0 && player.vy < -150) {
    player.vy *= 0.58;
    model.jumpCutAvailable = false;
  }
  if (player.vy >= 0) model.jumpCutAvailable = false;
  const gravity = jumpHeld && player.vy < 0 ? 860 : 1260;
  player.vy = Math.min(560, player.vy + gravity * seconds);

  player.x = Math.max(0, Math.min(model.worldWidth - player.width, player.x + player.vx * seconds));
  player.y += player.vy * seconds;
  player.grounded = false;

  if (model.dropTimer <= 0 && player.vy >= 0) {
    const bottom = player.y + player.height;
    for (const platform of model.platforms) {
      const horizontalOverlap = player.x + player.width - 3 > platform.x && player.x + 3 < platform.x + platform.width;
      if (horizontalOverlap && previousBottom <= platform.y + 5 && bottom >= platform.y) {
        player.y = platform.y - player.height;
        player.vy = 0;
        player.grounded = true;
        break;
      }
    }
  }

  for (const enemy of model.enemies) {
    if (!enemy.alive) continue;
    enemy.x += enemy.direction * enemy.speed * seconds;
    if (enemy.x <= enemy.minX || enemy.x >= enemy.maxX) {
      enemy.x = Math.max(enemy.minX, Math.min(enemy.maxX, enemy.x));
      enemy.direction = enemy.direction === 1 ? -1 : 1;
    }
  }

  for (const coin of model.coins) {
    if (!coin.collected && overlaps({ x: player.x, y: player.y, width: player.width, height: player.height }, { x: coin.x - 9, y: coin.y - 9, width: 18, height: 18 })) {
      coin.collected = true;
      model.score += 10;
      model.message = "Nice find! Keep an eye out for more coins.";
    }
  }

  const playerBox = { x: player.x + 2, y: player.y + 2, width: player.width - 4, height: player.height - 2 };
  if (model.invulnerable <= 0) {
    if (model.spikes.some((spike) => overlaps(playerBox, spike))) {
      respawn(model);
      return;
    }
    for (const enemy of model.enemies) {
      if (!enemy.alive) continue;
      const enemyBox = { x: enemy.x, y: enemy.y, width: 23, height: 23 };
      if (!overlaps(playerBox, enemyBox)) continue;
      if (player.vy > 40 && previousBottom <= enemy.y + 10) {
        enemy.alive = false;
        player.vy = -255;
        player.grounded = false;
        model.score += 50;
        model.message = "Bonk! That little critter is out of the way.";
      } else {
        respawn(model);
        return;
      }
    }
  }
  model.invulnerable = Math.max(0, model.invulnerable - delta);

  if (!model.checkpointReached && player.x >= model.checkpointX) {
    model.checkpointReached = true;
    model.message = "Checkpoint! The little flag has you covered.";
  }
  if (player.y > 390) {
    respawn(model);
    return;
  }

  if (player.grounded && player.x + player.width >= model.exitX) {
    model.levelTransition = 850;
    model.message = model.level === levelPlans.length ? "Home is just ahead!" : "Level clear! On to the next one.";
    return;
  }
  model.elapsed += delta;
}

export function adventureStatus(model: BobAdventureModel) {
  const level = String(model.level).padStart(2, "0");
  const collected = model.coins.filter((coin) => coin.collected).length;
  return `LEVEL ${level} / 25 · COINS ${collected}/${model.coins.length} · ${model.lives} HEARTS`;
}
