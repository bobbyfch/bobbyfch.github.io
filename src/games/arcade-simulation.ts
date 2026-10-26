import { games, type GameId, type ArcadeFamily, type OriginalGameId } from "./catalog";
import { adventureStatus, createBobAdventure, updateBobAdventure, type BobAdventureModel } from "./bobs-adventure";

export type GamePhase = "ready" | "playing" | "won" | "over";
export type GameAction = "left" | "right" | "up" | "down" | "action";
export type ActionSet = ReadonlySet<GameAction>;

interface BaseModel {
  id: GameId;
  phase: GamePhase;
  score: number;
  message: string;
}

interface CRTModel extends BaseModel {
  id: "crt";
  reticle: { x: number; y: number };
  target: { x: number; y: number; radius: number };
  shots: number;
  cooldown: number;
}

interface BoardModel extends BaseModel {
  id: "bertie" | "oxo";
  cells: Array<"X" | "O" | null>;
  cursor: number;
  turn: "player" | "computer";
  computerFirst: boolean;
  aiDelay: number;
}

interface NimModel extends BaseModel {
  id: "nimrod";
  piles: number[];
  selectedPile: number;
  takeCount: number;
  turn: "player" | "computer";
  aiDelay: number;
}

interface TennisModel extends BaseModel {
  id: "tennis";
  ball: { x: number; y: number; vx: number; vy: number };
  angle: number;
  hits: number;
  cooldown: number;
}

interface SpacewarModel extends BaseModel {
  id: "spacewar";
  player: { x: number; y: number; angle: number; vx: number; vy: number; lives: number };
  enemy: { x: number; y: number; angle: number; vx: number; vy: number; lives: number };
  bullets: Array<{ x: number; y: number; vx: number; vy: number; owner: "player" | "enemy" }>;
  fireCooldown: number;
  aiClock: number;
}

interface ComputerSpaceModel extends BaseModel {
  id: "computer-space";
  ship: { x: number; y: number; angle: number; vx: number; vy: number; lives: number };
  rocks: Array<{ x: number; y: number; vx: number; vy: number; radius: number }>;
  bullets: Array<{ x: number; y: number; vx: number; vy: number }>;
  fireCooldown: number;
  invulnerability: number;
}

interface PongModel extends BaseModel {
  id: "pong";
  ball: { x: number; y: number; vx: number; vy: number };
  playerY: number;
  computerY: number;
  playerPoints: number;
  computerPoints: number;
  serveDelay: number;
}

interface InvadersModel extends BaseModel {
  id: "invaders";
  playerX: number;
  aliens: Array<{ x: number; y: number; row: number; alive: boolean }>;
  bullets: Array<{ x: number; y: number; velocity: number; owner: "player" | "enemy" }>;
  bunkers: Array<{ x: number; hits: number }>;
  direction: number;
  stepClock: number;
  shotClock: number;
  fireCooldown: number;
  invulnerability: number;
  lives: number;
}

interface OriginalObject {
  x: number;
  y: number;
  kind: "hazard" | "target";
  size: number;
  drift: number;
}

interface OriginalDot {
  column: number;
  row: number;
  collected: boolean;
}

interface OriginalModel extends BaseModel {
  id: OriginalGameId;
  family: ArcadeFamily;
  playerX: number;
  playerY: number;
  velocityY: number;
  objects: OriginalObject[];
  bullets: Array<{ x: number; y: number }>;
  dots: OriginalDot[];
  lives: number;
  elapsed: number;
  spawnClock: number;
  moveClock: number;
  fireClock: number;
  marker: number;
  markerDirection: number;
}

export type ArcadeModel =
  | CRTModel
  | BoardModel
  | NimModel
  | TennisModel
  | SpacewarModel
  | ComputerSpaceModel
  | PongModel
  | InvadersModel
  | BobAdventureModel
  | OriginalModel;

function isOriginalModel(model: ArcadeModel): model is OriginalModel {
  return "family" in model;
}

const WIDTH = 640;
const HEIGHT = 360;

function wrapped(value: number, max: number) {
  if (value < 0) return value + max;
  if (value >= max) return value - max;
  return value;
}

function emptyState(id: GameId, message: string): BaseModel {
  return { id, phase: "ready", score: 0, message };
}

function makeBoard(id: "bertie" | "oxo", computerFirst = false): BoardModel {
  return {
    ...emptyState(id, "Pilih MULAI untuk bermain."),
    id,
    cells: Array(9).fill(null),
    cursor: 4,
    turn: "player",
    computerFirst,
    aiDelay: 0,
  };
}

function winner(cells: Array<"X" | "O" | null>) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) return cells[a];
  }
  return null;
}

function minimax(cells: Array<"X" | "O" | null>, player: "X" | "O"): { score: number; move: number } {
  const win = winner(cells);
  if (win === "O") return { score: 10, move: -1 };
  if (win === "X") return { score: -10, move: -1 };
  if (cells.every(Boolean)) return { score: 0, move: -1 };

  const moves: Array<{ score: number; move: number }> = [];
  for (let index = 0; index < cells.length; index += 1) {
    if (cells[index]) continue;
    cells[index] = player;
    const next = minimax(cells, player === "O" ? "X" : "O");
    moves.push({ score: next.score, move: index });
    cells[index] = null;
  }
  return player === "O"
    ? moves.reduce((best, move) => move.score > best.score ? move : best)
    : moves.reduce((best, move) => move.score < best.score ? move : best);
}

function heuristicMove(cells: Array<"X" | "O" | null>) {
  for (const mark of ["O", "X"] as const) {
    for (let index = 0; index < cells.length; index += 1) {
      if (cells[index]) continue;
      cells[index] = mark;
      const wins = winner(cells) === mark;
      cells[index] = null;
      if (wins) return index;
    }
  }
  if (!cells[4]) return 4;
  const corners = [0, 2, 6, 8].filter((index) => !cells[index]);
  if (corners.length) return corners[Math.floor(Math.random() * corners.length)];
  const edges = [1, 3, 5, 7].filter((index) => !cells[index]);
  return edges.length ? edges[Math.floor(Math.random() * edges.length)] : -1;
}

function optimalNimMove(piles: number[]) {
  const xor = piles.reduce((sum, pile) => sum ^ pile, 0);
  if (xor !== 0) {
    for (let index = 0; index < piles.length; index += 1) {
      const remainder = piles[index] ^ xor;
      if (remainder < piles[index]) return { pile: index, take: piles[index] - remainder };
    }
  }
  const pile = piles.findIndex((value) => value > 0);
  return { pile, take: 1 };
}

function newCRT(): CRTModel {
  return {
    ...emptyState("crt", "Move the sight and hit the target."),
    id: "crt",
    reticle: { x: WIDTH / 2, y: HEIGHT / 2 },
    target: { x: 455, y: 135, radius: 21 },
    shots: 0,
    cooldown: 0,
  };
}

function newNimrod(): NimModel {
  return {
    ...emptyState("nimrod", "Take turns removing counters from one pile. Take the last one to win."),
    id: "nimrod",
    piles: [3, 4, 5],
    selectedPile: 1,
    takeCount: 1,
    turn: "player",
    aiDelay: 0,
  };
}

function newTennis(): TennisModel {
  return {
    ...emptyState("tennis", "Set your angle, then hit the ball across the net."),
    id: "tennis",
    ball: { x: 105, y: 270, vx: 0, vy: 0 },
    angle: -0.4,
    hits: 0,
    cooldown: 0,
  };
}

function newSpacewar(): SpacewarModel {
  return {
    ...emptyState("spacewar", "Pilot, thrust, and fire. First to three hits wins."),
    id: "spacewar",
    player: { x: 150, y: 180, angle: 0, vx: 0, vy: 0, lives: 3 },
    enemy: { x: 490, y: 180, angle: Math.PI, vx: 0, vy: 0, lives: 3 },
    bullets: [],
    fireCooldown: 0,
    aiClock: 0,
  };
}

function newComputerSpace(): ComputerSpaceModel {
  return {
    ...emptyState("computer-space", "Clear the drifting field before the ship runs out of lives."),
    id: "computer-space",
    ship: { x: WIDTH / 2, y: HEIGHT / 2, angle: -Math.PI / 2, vx: 0, vy: 0, lives: 3 },
    rocks: [
      { x: 100, y: 85, vx: 33, vy: 20, radius: 27 },
      { x: 510, y: 90, vx: -28, vy: 31, radius: 24 },
      { x: 145, y: 280, vx: 27, vy: -24, radius: 20 },
      { x: 510, y: 280, vx: -20, vy: -28, radius: 27 },
      { x: 320, y: 70, vx: 19, vy: 25, radius: 17 },
    ],
    bullets: [],
    fireCooldown: 0,
    invulnerability: 0,
  };
}

function newPong(): PongModel {
  return {
    ...emptyState("pong", "First to five points wins."),
    id: "pong",
    ball: { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0 },
    playerY: HEIGHT / 2,
    computerY: HEIGHT / 2,
    playerPoints: 0,
    computerPoints: 0,
    serveDelay: -1,
  };
}

function newInvaders(): InvadersModel {
  const aliens: InvadersModel["aliens"] = [];
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 9; column += 1) {
      aliens.push({ x: 160 + column * 34, y: 65 + row * 25, row, alive: true });
    }
  }
  return {
    ...emptyState("invaders", "Clear the formation before it reaches your ship."),
    id: "invaders",
    playerX: WIDTH / 2,
    aliens,
    bullets: [],
    bunkers: [135, 265, 395, 525].map((x) => ({ x, hits: 0 })),
    direction: 1,
    stepClock: 0,
    shotClock: 0,
    fireCooldown: 0,
    invulnerability: 0,
    lives: 3,
  };
}

function mazeWall(column: number, row: number) {
  if (column < 0 || column >= 16 || row < 0 || row >= 8) return true;
  const walls = [
    "................",
    "..##....##......",
    "................",
    ".....##....##...",
    "................",
    "..##....##......",
    "................",
    "................",
  ];
  return walls[row]?.[column] === "#";
}

function newOriginal(id: OriginalGameId): OriginalModel {
  const definition = games.find((game) => game.id === id);
  const family = definition?.family;
  if (!family) throw new Error("The original game is missing its play style.");
  const dots: OriginalDot[] = [];
  if (family === "maze") {
    for (let row = 0; row < 8; row += 1) {
      for (let column = 0; column < 16; column += 1) {
        if (!mazeWall(column, row) && (column * 3 + row * 5) % 7 === 0 && !(column === 0 && row === 0)) {
          dots.push({ column, row, collected: false });
        }
      }
    }
  }
  return {
    ...emptyState(id, "Ready when you are."),
    id,
    family,
    playerX: family === "maze" ? 32 : WIDTH / 2,
    playerY: family === "maze" ? 36 : 306,
    velocityY: 0,
    objects: [],
    bullets: [],
    dots,
    lives: 3,
    elapsed: 0,
    spawnClock: 0,
    moveClock: 0,
    fireClock: 0,
    marker: 0.08,
    markerDirection: 1,
  };
}

export function createModel(id: GameId, computerFirst = false): ArcadeModel {
  switch (id) {
    case "bobs-adventure": return createBobAdventure();
    case "crt": return newCRT();
    case "bertie":
    case "oxo": return makeBoard(id, computerFirst);
    case "nimrod": return newNimrod();
    case "tennis": return newTennis();
    case "spacewar": return newSpacewar();
    case "computer-space": return newComputerSpace();
    case "pong": return newPong();
    case "invaders": return newInvaders();
    default: return newOriginal(id);
  }
}

export class ArcadeSimulation {
  model: ArcadeModel;
  private fireQueued = false;
  private pointer = { x: WIDTH / 2, y: HEIGHT / 2 };

  constructor(id: GameId = "bobs-adventure") {
    this.model = createModel(id);
  }

  select(id: GameId, computerFirst = false) {
    this.model = createModel(id, computerFirst);
    this.fireQueued = false;
  }

  start() {
    this.model.phase = "playing";
    this.model.message = "Game on.";
    if (this.model.id === "oxo" && this.model.computerFirst) {
      this.model.turn = "computer";
      this.model.aiDelay = 450;
    }
  }

  restart() {
    const id = this.model.id;
    const computerFirst = this.model.id === "oxo" ? this.model.computerFirst : false;
    this.select(id, computerFirst);
    this.start();
  }

  setPointer(x: number, y: number) {
    this.pointer.x = Math.max(0, Math.min(WIDTH, x));
    this.pointer.y = Math.max(0, Math.min(HEIGHT, y));
    if (this.model.id === "crt") {
      this.model.reticle.x = this.pointer.x;
      this.model.reticle.y = this.pointer.y;
    } else if (isOriginalModel(this.model) && this.model.family !== "maze" && this.model.family !== "timing") {
      this.model.playerX = this.pointer.x;
    }
  }

  action(action: GameAction) {
    if (this.model.phase !== "playing") return;
    const model = this.model;
    if (model.id === "bobs-adventure") {
      if (action === "up" || action === "action") {
        model.jumpQueued = true;
      } else if (action === "left" || action === "right") {
        const direction = action === "left" ? -1 : 1;
        model.player.facing = direction;
        model.tapMoveDirection = direction;
        model.tapMoveTimer = 110;
      } else if (action === "down" && model.player.grounded) {
        model.dropTimer = 180;
        model.coyoteTime = 0;
        model.jumpBuffer = 0;
        model.player.grounded = false;
        model.player.y += 3;
      }
      return;
    }
    if (model.id === "crt") {
      if (action === "action") this.fireQueued = true;
      return;
    }
    if (model.id === "bertie" || model.id === "oxo") {
      if (action === "left") model.cursor = model.cursor % 3 === 0 ? model.cursor + 2 : model.cursor - 1;
      if (action === "right") model.cursor = model.cursor % 3 === 2 ? model.cursor - 2 : model.cursor + 1;
      if (action === "up") model.cursor = (model.cursor + 6) % 9;
      if (action === "down") model.cursor = (model.cursor + 3) % 9;
      if (action === "action") this.playBoardCell(model.cursor);
      return;
    }
    if (model.id === "nimrod") {
      if (action === "left") model.selectedPile = (model.selectedPile + model.piles.length - 1) % model.piles.length;
      if (action === "right") model.selectedPile = (model.selectedPile + 1) % model.piles.length;
      if (action === "up") model.takeCount = Math.min(3, model.takeCount + 1);
      if (action === "down") model.takeCount = Math.max(1, model.takeCount - 1);
      if (action === "action") this.takeFromPile(model.selectedPile, model.takeCount);
      return;
    }
    if (action === "action") this.fireQueued = true;
  }

  pointerAction(x: number, y: number) {
    this.setPointer(x, y);
    const model = this.model;
    if (model.phase !== "playing") return;
    if (model.id === "bobs-adventure") {
      model.jumpQueued = true;
      return;
    }
    if (model.id === "bertie" || model.id === "oxo") {
      const column = Math.floor((x - 130) / 126);
      const row = Math.floor((y - 48) / 88);
      if (column >= 0 && column < 3 && row >= 0 && row < 3) this.playBoardCell(row * 3 + column);
    } else if (isOriginalModel(model)) {
      this.fireQueued = true;
    } else if (model.id === "crt" || model.id === "tennis" || model.id === "spacewar" || model.id === "computer-space" || model.id === "invaders") {
      this.fireQueued = true;
    }
  }

  private playBoardCell(index: number) {
    if (this.model.id !== "bertie" && this.model.id !== "oxo") return;
    const model = this.model;
    if (model.turn !== "player" || model.cells[index]) return;
    model.cells[index] = "X";
    if (winner(model.cells) === "X") {
      model.phase = "won";
      model.message = "You beat the machine.";
      model.score += 1;
      return;
    }
    if (model.cells.every(Boolean)) {
      model.phase = "over";
      model.message = "A draw. The board is yours to try again.";
      return;
    }
    model.turn = "computer";
    model.aiDelay = 440;
  }

  private takeFromPile(pile: number, amount: number) {
    if (this.model.id !== "nimrod" || this.model.turn !== "player") return;
    const model = this.model;
    if (model.piles[pile] < amount) {
      model.message = "There are not that many counters in that pile.";
      return;
    }
    model.piles[pile] -= amount;
    if (model.piles.every((value) => value === 0)) {
      model.phase = "won";
      model.message = "You took the last counter.";
      model.score += 1;
      return;
    }
    model.turn = "computer";
    model.aiDelay = 650;
    model.message = "The machine is thinking.";
  }

  private computerBoardTurn(model: BoardModel) {
    const move = model.id === "bertie" ? minimax(model.cells.slice(), "O").move : heuristicMove(model.cells.slice());
    if (move >= 0 && !model.cells[move]) model.cells[move] = "O";
    if (winner(model.cells) === "O") {
      model.phase = "over";
      model.message = "The machine wins this round.";
    } else if (model.cells.every(Boolean)) {
      model.phase = "over";
      model.message = "A draw. The board is yours to try again.";
    } else {
      model.turn = "player";
      model.message = "Your turn. Place an X.";
    }
  }

  update(delta: number, held: ActionSet) {
    const model = this.model;
    if (model.phase !== "playing") {
      this.fireQueued = false;
      return;
    }
    const seconds = Math.min(delta, 40) / 1000;

    if (model.id === "bobs-adventure") {
      updateBobAdventure(model, delta, held);
    } else if (model.id === "bertie" || model.id === "oxo") {
      if (model.turn === "computer") {
        model.aiDelay -= delta;
        if (model.aiDelay <= 0) this.computerBoardTurn(model);
      }
    } else if (model.id === "nimrod" && model.turn === "computer") {
      model.aiDelay -= delta;
      if (model.aiDelay <= 0) {
        const move = optimalNimMove(model.piles);
        if (move.pile >= 0) model.piles[move.pile] -= move.take;
        if (model.piles.every((value) => value === 0)) {
          model.phase = "over";
          model.message = "The machine took the last counter.";
        } else {
          model.turn = "player";
          model.message = "Your turn. Choose a pile and a number.";
        }
      }
    } else if (model.id === "crt") {
      if (held.has("left")) model.reticle.x -= 260 * seconds;
      if (held.has("right")) model.reticle.x += 260 * seconds;
      if (held.has("up")) model.reticle.y -= 260 * seconds;
      if (held.has("down")) model.reticle.y += 260 * seconds;
      model.reticle.x = Math.max(22, Math.min(WIDTH - 22, model.reticle.x));
      model.reticle.y = Math.max(22, Math.min(HEIGHT - 22, model.reticle.y));
      model.cooldown -= delta;
      if ((this.fireQueued || held.has("action")) && model.cooldown <= 0) {
        model.shots += 1;
        model.cooldown = 280;
        const distance = Math.hypot(model.reticle.x - model.target.x, model.reticle.y - model.target.y);
        if (distance <= model.target.radius) {
          model.score += Math.max(10, Math.round((model.target.radius - distance + 1) * 3));
          model.target = {
            x: 70 + ((model.shots * 127) % (WIDTH - 140)),
            y: 65 + ((model.shots * 83) % (HEIGHT - 130)),
            radius: 18 + (model.shots % 3) * 3,
          };
          if (model.score >= 100) {
            model.phase = "won";
            model.message = "Nice shot. The target range is clear.";
          }
        }
      }
    } else if (model.id === "tennis") {
      if (held.has("left")) model.angle = Math.max(-0.9, model.angle - seconds * 1.1);
      if (held.has("right")) model.angle = Math.min(0.2, model.angle + seconds * 1.1);
      model.cooldown -= delta;
      if ((this.fireQueued || held.has("action")) && model.cooldown <= 0 && model.ball.vx === 0) {
        model.ball.vx = 225;
        model.ball.vy = -Math.sin(Math.abs(model.angle) + 0.3) * 190;
        model.cooldown = 250;
      }
      if (model.ball.vx !== 0) {
        model.ball.x += model.ball.vx * seconds;
        model.ball.y += model.ball.vy * seconds;
        model.ball.vy += 275 * seconds;
        if (model.ball.y > 286) {
          model.ball.y = 286;
          model.ball.vy *= -0.82;
        }
        if (model.ball.x > 548) {
          model.ball.x = 548;
          model.ball.vx = -225;
          model.ball.vy = -Math.max(80, Math.abs(model.ball.vy) + 25);
        }
        if (model.ball.x < 100) {
          model.ball.vx = 0;
          model.ball.vy = 0;
          model.ball.x = 105;
          model.ball.y = 270;
          model.hits += 1;
          model.score += 10;
          model.cooldown = 250;
          model.message = model.hits >= 5 ? "Rally complete. Nice timing." : "Ball back on your side. Set your angle and hit.";
          if (model.hits >= 5) {
            model.phase = "won";
            model.message = "Five returns. Rally complete.";
          }
        }
      }
    } else if (model.id === "spacewar") {
      this.updateSpacewar(model, seconds, delta, held);
    } else if (model.id === "computer-space") {
      this.updateComputerSpace(model, seconds, delta, held);
    } else if (model.id === "pong") {
      this.updatePong(model, seconds, held);
    } else if (model.id === "invaders") {
      this.updateInvaders(model, seconds, delta, held);
    } else if (isOriginalModel(model)) {
      this.updateOriginal(model, seconds, delta, held);
    }
    this.fireQueued = false;
  }

  private updateOriginal(model: OriginalModel, seconds: number, delta: number, held: ActionSet) {
    const { family } = model;
    model.elapsed += delta;

    if (family === "maze") {
      model.moveClock -= delta;
      if (model.moveClock <= 0) {
        let column = Math.round((model.playerX - 32) / 36);
        let row = Math.round((model.playerY - 36) / 36);
        if (held.has("left")) column -= 1;
        else if (held.has("right")) column += 1;
        else if (held.has("up")) row -= 1;
        else if (held.has("down")) row += 1;
        if (!mazeWall(column, row)) {
          model.playerX = 32 + column * 36;
          model.playerY = 36 + row * 36;
          const dot = model.dots.find((item) => !item.collected && item.column === column && item.row === row);
          if (dot) {
            dot.collected = true;
            model.score += 1;
            if (model.score >= 12) {
              model.phase = "won";
              model.message = "The maze is clear. Nice route.";
            }
          }
        }
        model.moveClock = 115;
      }
      return;
    }

    if (family === "timing") {
      model.marker += model.markerDirection * seconds * 0.58;
      if (model.marker >= 1) {
        model.marker = 1;
        model.markerDirection = -1;
      } else if (model.marker <= 0) {
        model.marker = 0;
        model.markerDirection = 1;
      }
      model.fireClock -= delta;
      if ((this.fireQueued || held.has("action")) && model.fireClock <= 0) {
        model.fireClock = 270;
        const tolerance = model.id === "word-rush" ? 0.14 : model.id === "yo-yo" ? 0.05 : 0.07;
        if (model.marker >= 0.5 - tolerance && model.marker <= 0.5 + tolerance) {
          model.score += 1;
          model.message = "Right on the mark.";
          if (model.score >= 8) {
            model.phase = "won";
            model.message = "Eight clean hits. Perfect timing.";
          }
        } else {
          model.lives -= 1;
          model.message = "Too soon. Watch the marker.";
          if (model.lives <= 0) {
            model.phase = "over";
            model.message = "Three misses. Give it another go.";
          }
        }
      }
      return;
    }

    const horizontalSpeed = family === "jump" ? 245 : 280;
    if (held.has("left")) model.playerX -= horizontalSpeed * seconds;
    if (held.has("right")) model.playerX += horizontalSpeed * seconds;
    model.playerX = Math.max(28, Math.min(WIDTH - 28, model.playerX));

    if (family === "jump") {
      const floor = HEIGHT - 48;
      if ((held.has("up") || this.fireQueued || held.has("action")) && model.playerY >= floor - 1) {
        model.velocityY = -370;
      }
      model.velocityY += 900 * seconds;
      model.playerY = Math.min(floor, model.playerY + model.velocityY * seconds);
      if (model.playerY >= floor) model.velocityY = 0;
    }

    model.spawnClock += delta;
    const spawnDelay = family === "shoot" ? 960 : family === "jump" ? 1080 : 800;
    if (model.spawnClock >= spawnDelay) {
      model.spawnClock = 0;
      const targetChance = family === "catch" ? 0.78 : family === "jump" ? 0.48 : 0;
      model.objects.push({
        x: 36 + Math.random() * (WIDTH - 72),
        y: family === "jump" ? HEIGHT - 48 : -18,
        kind: Math.random() < targetChance ? "target" : "hazard",
        size: family === "dodge" && model.id === "laser-lane" ? 24 : family === "jump" ? 14 : 11,
        drift: family === "jump" ? -(115 + Math.random() * 75) : 0,
      });
    }

    if (family === "shoot") {
      model.fireClock -= delta;
      if ((this.fireQueued || held.has("action")) && model.fireClock <= 0) {
        model.bullets.push({ x: model.playerX, y: model.playerY - 17 });
        model.fireClock = 230;
      }
      model.bullets = model.bullets.filter((bullet) => {
        bullet.y -= 330 * seconds;
        return bullet.y > 0;
      });
    }

    const nextObjects: OriginalObject[] = [];
    for (const object of model.objects) {
      if (family === "jump") {
        object.x += object.drift * seconds;
      } else {
        object.y += (family === "shoot" ? 92 : 112) * seconds;
        object.x += object.drift * seconds;
      }

      if (family === "shoot" && object.kind === "hazard") {
        const bulletIndex = model.bullets.findIndex((bullet) => Math.abs(bullet.x - object.x) < object.size + 4 && Math.abs(bullet.y - object.y) < object.size + 7);
        if (bulletIndex >= 0) {
          model.bullets.splice(bulletIndex, 1);
          model.score += 1;
          if (model.score >= 12) {
            model.phase = "won";
            model.message = "The sky is clear. Good shooting.";
          }
          continue;
        }
      }

      const playerY = family === "jump" ? model.playerY : model.playerY;
      const nearPlayer = Math.abs(object.x - model.playerX) < object.size + 19 && Math.abs(object.y - playerY) < object.size + 16;
      if (nearPlayer) {
        if (object.kind === "target" && family !== "shoot" && family !== "dodge") {
          model.score += 1;
          if (model.score >= 10) {
            model.phase = "won";
            model.message = "Bag full. Lovely catching.";
          }
        } else if (object.kind === "hazard" && model.elapsed > 500) {
          model.lives -= 1;
          model.message = "That was close. Keep moving.";
          model.playerX = WIDTH / 2;
          if (family === "jump") model.playerY = HEIGHT - 48;
          if (model.lives <= 0) {
            model.phase = "over";
            model.message = "Three hits. Take another run.";
          }
        }
        continue;
      }

      if (family === "catch" && object.kind === "target" && object.y > HEIGHT - 22) {
        model.lives -= 1;
        model.message = "One slipped by. Keep an eye out.";
        if (model.lives <= 0) {
          model.phase = "over";
          model.message = "Three got away. Try once more.";
        }
        continue;
      }
      if (family === "shoot" && object.y > HEIGHT - 18) {
        model.lives -= 1;
        model.message = "A ship got through.";
        if (model.lives <= 0) {
          model.phase = "over";
          model.message = "The fleet broke through. Try again.";
        }
        continue;
      }
      if ((family === "jump" && object.x < -24) || (family !== "jump" && object.y < HEIGHT + 24)) nextObjects.push(object);
    }
    model.objects = nextObjects;

    if (family === "dodge" && model.elapsed >= 22000) {
      model.phase = "won";
      model.message = "Clean run. You made it through.";
    }
  }

  private updateSpacewar(model: SpacewarModel, seconds: number, delta: number, held: ActionSet) {
    const player = model.player;
    const enemy = model.enemy;
    if (held.has("left")) player.angle -= 3.2 * seconds;
    if (held.has("right")) player.angle += 3.2 * seconds;
    if (held.has("up")) {
      player.vx += Math.cos(player.angle) * 180 * seconds;
      player.vy += Math.sin(player.angle) * 180 * seconds;
    }
    if (this.fireQueued || held.has("action")) {
      if (model.fireCooldown <= 0) {
        model.bullets.push({ x: player.x, y: player.y, vx: Math.cos(player.angle) * 320 + player.vx, vy: Math.sin(player.angle) * 320 + player.vy, owner: "player" });
        model.fireCooldown = 250;
      }
    }
    model.fireCooldown -= delta;
    model.aiClock += delta;
    if (model.aiClock > 470) {
      enemy.angle += (Math.random() - 0.5) * 1.2;
      if (Math.random() > 0.45) {
        enemy.vx += Math.cos(enemy.angle) * 110 * seconds;
        enemy.vy += Math.sin(enemy.angle) * 110 * seconds;
      }
      if (Math.random() > 0.55) model.bullets.push({ x: enemy.x, y: enemy.y, vx: Math.cos(enemy.angle) * 260 + enemy.vx, vy: Math.sin(enemy.angle) * 260 + enemy.vy, owner: "enemy" });
      model.aiClock = 0;
    }
    const pullToStar = (ship: SpacewarModel["player"]) => {
      const dx = WIDTH / 2 - ship.x;
      const dy = HEIGHT / 2 - ship.y;
      const distance = Math.max(80, Math.hypot(dx, dy));
      ship.vx += (dx / distance) * 23 * seconds;
      ship.vy += (dy / distance) * 23 * seconds;
      ship.x = wrapped(ship.x + ship.vx * seconds, WIDTH);
      ship.y = wrapped(ship.y + ship.vy * seconds, HEIGHT);
      ship.vx *= 0.998;
      ship.vy *= 0.998;
    };
    pullToStar(player);
    pullToStar(enemy);
    if (model.bullets.length > 24) model.bullets.splice(0, model.bullets.length - 24);
    model.bullets = model.bullets.filter((bullet) => {
      bullet.x = wrapped(bullet.x + bullet.vx * seconds, WIDTH);
      bullet.y = wrapped(bullet.y + bullet.vy * seconds, HEIGHT);
      if (bullet.owner === "player" && Math.hypot(bullet.x - enemy.x, bullet.y - enemy.y) < 21) {
        enemy.lives -= 1;
        model.score += 100;
        if (enemy.lives <= 0) {
          model.phase = "won";
          model.message = "The rival ship is out of the duel.";
        } else {
          enemy.x = 500;
          enemy.y = 70 + (3 - enemy.lives) * 100;
        }
        return false;
      }
      if (bullet.owner === "enemy" && Math.hypot(bullet.x - player.x, bullet.y - player.y) < 21) {
        player.lives -= 1;
        if (player.lives <= 0) {
          model.phase = "over";
          model.message = "Your ship is out of the duel.";
        } else {
          player.x = 140;
          player.y = 180;
          player.vx = 0;
          player.vy = 0;
        }
        return false;
      }
      return true;
    });
  }

  private updateComputerSpace(model: ComputerSpaceModel, seconds: number, delta: number, held: ActionSet) {
    const ship = model.ship;
    if (held.has("left")) ship.angle -= 3 * seconds;
    if (held.has("right")) ship.angle += 3 * seconds;
    if (held.has("up")) {
      ship.vx += Math.cos(ship.angle) * 175 * seconds;
      ship.vy += Math.sin(ship.angle) * 175 * seconds;
    }
    ship.x = wrapped(ship.x + ship.vx * seconds, WIDTH);
    ship.y = wrapped(ship.y + ship.vy * seconds, HEIGHT);
    ship.vx *= 0.999;
    ship.vy *= 0.999;
    model.fireCooldown -= delta;
    if ((this.fireQueued || held.has("action")) && model.fireCooldown <= 0) {
      model.bullets.push({ x: ship.x, y: ship.y, vx: Math.cos(ship.angle) * 340 + ship.vx, vy: Math.sin(ship.angle) * 340 + ship.vy });
      model.fireCooldown = 250;
    }
    model.invulnerability = Math.max(0, model.invulnerability - delta);
    for (const rock of model.rocks) {
      rock.x = wrapped(rock.x + rock.vx * seconds, WIDTH);
      rock.y = wrapped(rock.y + rock.vy * seconds, HEIGHT);
      if (model.invulnerability <= 0 && Math.hypot(rock.x - ship.x, rock.y - ship.y) < rock.radius + 13) {
        ship.lives -= 1;
        model.invulnerability = 1200;
        ship.x = WIDTH / 2;
        ship.y = HEIGHT / 2;
        ship.vx = 0;
        ship.vy = 0;
        if (ship.lives <= 0) {
          model.phase = "over";
          model.message = "The flight is over. Try another run.";
        }
      }
    }
    model.bullets = model.bullets.filter((bullet) => {
      bullet.x = wrapped(bullet.x + bullet.vx * seconds, WIDTH);
      bullet.y = wrapped(bullet.y + bullet.vy * seconds, HEIGHT);
      const rockIndex = model.rocks.findIndex((rock) => Math.hypot(rock.x - bullet.x, rock.y - bullet.y) < rock.radius);
      if (rockIndex >= 0) {
        const [rock] = model.rocks.splice(rockIndex, 1);
        model.score += 100;
        if (rock && rock.radius > 19) {
          model.rocks.push({ x: rock.x - 7, y: rock.y, vx: -rock.vx * 1.35, vy: rock.vy * 1.25, radius: 11 });
          model.rocks.push({ x: rock.x + 7, y: rock.y, vx: rock.vx * 1.3, vy: -rock.vy * 1.2, radius: 11 });
        }
        if (model.rocks.length === 0) {
          model.phase = "won";
          model.message = "The flight path is clear.";
        }
        return false;
      }
      return true;
    });
  }

  private updatePong(model: PongModel, seconds: number, held: ActionSet) {
    if (held.has("up")) model.playerY = Math.max(58, model.playerY - 245 * seconds);
    if (held.has("down")) model.playerY = Math.min(HEIGHT - 58, model.playerY + 245 * seconds);
    model.computerY += (model.ball.y - model.computerY) * Math.min(1, seconds * 2.7);
    if (model.serveDelay < 0) {
      if (this.fireQueued || held.has("action")) {
        model.ball.vx = (model.playerPoints + model.computerPoints) % 2 === 0 ? 220 : -220;
        model.ball.vy = (Math.random() - 0.5) * 180;
        model.serveDelay = 0;
      } else {
        return;
      }
    }
    if (model.serveDelay > 0) {
      model.serveDelay -= seconds;
      return;
    }
    const ball = model.ball;
    ball.x += ball.vx * seconds;
    ball.y += ball.vy * seconds;
    if (ball.y < 14 || ball.y > HEIGHT - 14) ball.vy *= -1;
    if (ball.x < 56 && Math.abs(ball.y - model.playerY) < 55 && ball.vx < 0) {
      ball.vx = Math.abs(ball.vx) * 1.05;
      ball.vy += (ball.y - model.playerY) * 1.1;
    } else if (ball.x > WIDTH - 56 && Math.abs(ball.y - model.computerY) < 55 && ball.vx > 0) {
      ball.vx = -Math.abs(ball.vx) * 1.03;
      ball.vy += (ball.y - model.computerY) * 0.9;
    }
    if (ball.x < 0 || ball.x > WIDTH) {
      if (ball.x > WIDTH) model.playerPoints += 1;
      else model.computerPoints += 1;
      model.score = model.playerPoints;
      if (model.playerPoints >= 5 || model.computerPoints >= 5) {
        model.phase = model.playerPoints >= 5 ? "won" : "over";
        model.message = model.playerPoints >= 5 ? "Point, set, game." : "The computer takes the match.";
      } else {
        ball.x = WIDTH / 2;
        ball.y = HEIGHT / 2;
        ball.vx = 0;
        ball.vy = 0;
        model.serveDelay = -1;
      }
    }
  }

  private updateInvaders(model: InvadersModel, seconds: number, delta: number, held: ActionSet) {
    if (held.has("left")) model.playerX -= 260 * seconds;
    if (held.has("right")) model.playerX += 260 * seconds;
    model.playerX = Math.max(25, Math.min(WIDTH - 25, model.playerX));
    model.fireCooldown -= delta;
    if ((this.fireQueued || held.has("action")) && model.fireCooldown <= 0) {
      model.bullets.push({ x: model.playerX, y: 314, velocity: -340, owner: "player" });
      model.fireCooldown = 310;
    }
    const alive = model.aliens.filter((alien) => alien.alive);
    if (alive.length === 0) {
      model.phase = "won";
      model.message = "The orbit is clear.";
      return;
    }
    model.stepClock += delta;
    const step = Math.max(82, 470 - (36 - alive.length) * 9);
    if (model.stepClock >= step) {
      model.stepClock = 0;
      const minX = Math.min(...alive.map((alien) => alien.x));
      const maxX = Math.max(...alive.map((alien) => alien.x + 20));
      if (maxX > WIDTH - 22 || minX < 22) {
        model.direction *= -1;
        for (const alien of alive) alien.y += 12;
      } else {
        for (const alien of alive) alien.x += model.direction * 9;
      }
      if (alive.some((alien) => alien.y > 275)) {
        model.phase = "over";
        model.message = "The formation reached your orbit.";
      }
    }
    model.shotClock += delta;
    if (model.shotClock > 900 && alive.length > 0) {
      const shooter = alive[Math.floor(Math.random() * alive.length)];
      if (shooter) model.bullets.push({ x: shooter.x + 10, y: shooter.y + 17, velocity: 125, owner: "enemy" });
      model.shotClock = 0;
    }
    model.invulnerability = Math.max(0, model.invulnerability - delta);
    model.bullets = model.bullets.filter((bullet) => {
      bullet.y += bullet.velocity * seconds;
      if (bullet.y < 0 || bullet.y > HEIGHT) return false;
      const bunker = model.bunkers.find((item) => item.hits < 5 && bullet.x > item.x - 25 && bullet.x < item.x + 25 && bullet.y > 274 && bullet.y < 290);
      if (bunker) {
        bunker.hits += 1;
        return false;
      }
      if (bullet.owner === "player") {
        const target = model.aliens.find((alien) => alien.alive && Math.abs(alien.x + 10 - bullet.x) < 13 && Math.abs(alien.y + 8 - bullet.y) < 15);
        if (target) {
          target.alive = false;
          model.score += (4 - target.row) * 10;
          return false;
        }
      } else if (Math.abs(bullet.x - model.playerX) < 15 && bullet.y > 305 && bullet.y < 335) {
        if (model.invulnerability <= 0) {
          model.lives -= 1;
          model.invulnerability = 1000;
          if (model.lives <= 0) {
            model.phase = "over";
            model.message = "Three hits. The aliens have won this round.";
          }
        }
        return false;
      }
      return true;
    });
  }

  get status() {
    const model = this.model;
    if (model.id === "bobs-adventure") return adventureStatus(model);
    if (isOriginalModel(model)) {
      if (model.family === "maze") return "STARS " + String(model.score).padStart(2, "0") + " / 12";
      if (model.family === "timing") return "HITS " + model.score + " / 8 · " + model.lives + " LIVES";
      return "SCORE " + String(model.score).padStart(2, "0") + " · " + model.lives + " LIVES";
    }
    if (model.id === "pong") return model.playerPoints + " — " + model.computerPoints + (model.serveDelay < 0 ? " · SERVE" : "");
    if (model.id === "invaders" || model.id === "spacewar" || model.id === "computer-space") {
      const lives = model.id === "invaders" ? model.lives : model.id === "spacewar" ? model.player.lives : model.ship.lives;
      return "SCORE " + String(model.score).padStart(4, "0") + " · " + lives + " LIVES";
    }
    if (model.id === "crt") return "SCORE " + String(model.score).padStart(4, "0") + " · " + model.shots + " SHOTS";
    if (model.id === "nimrod") return model.turn === "computer" ? "MACHINE MOVE" : "PILE " + (model.selectedPile + 1) + " · TAKE " + model.takeCount;
    if (model.id === "tennis") return "RALLY " + model.hits + " / 5";
    if (model.id === "bertie" || model.id === "oxo") return model.turn === "computer" ? "MACHINE THINKING" : "YOUR TURN · X";
    return "READY";
  }

  setComputerFirst(value: boolean) {
    if (this.model.id !== "oxo" || this.model.phase !== "ready") return;
    this.model.computerFirst = value;
    this.model.message = value ? "The machine takes the first move." : "You take the first move.";
  }
}

export const WORLD = { width: WIDTH, height: HEIGHT };
