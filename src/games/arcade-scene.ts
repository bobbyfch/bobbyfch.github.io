import Phaser from "phaser";
import { ArcadeSimulation, WORLD, type ActionSet, type ArcadeModel } from "./arcade-simulation";
import { getGameDefinition, type GameId } from "./catalog";
import type { BobAdventureModel } from "./bobs-adventure";
import {
  BOB_SPRITE_PIXEL,
  BOB_SPRITE_WIDTH,
  bobSpritePalette,
  bobSprites,
  coinSprite,
  coinSpritePalette,
  coinSpriteWidth,
  kancilSprite,
  kancilSpritePalette,
  kancilSpriteWidth,
  type BobPose,
} from "./bobs-sprites";

const sprites = {
  alienA: ["....##....##....", ".....##..##.....", "....########....", "..##.######.##..", "################", "##..########..##", "##..##....##..##", "....##....##...."],
  alienB: ["......##........", "....######......", "..##########....", "##..##.##.##..##", "################", "..##..####..##..", "##..##....##..##", "....##....##...."],
  alienC: ["......##........", ".....####.......", "....######......", "..##.####.##....", "..############..", "##..##.##.##..##", "....##....##....", "..##........##.."],
  ship: ["......##......", ".....####.....", "....######....", "################", "################", "###..######..###", "##....####....##"],
  bunker: ["..############..", ".##############.", "################", "################", "#######..#######", "######....######", "#####......#####"],
};

const mazeWalls = [
  "................",
  "..##....##......",
  "................",
  ".....##....##...",
  "................",
  "..##....##......",
  "................",
  "................",
];
const GROUND_Y = 320;

interface AdventurePalette {
  sky: number;
  far: number;
  hill: number;
  grass: number;
  deep: number;
  dirt: number;
  ledge: number;
  danger: number;
  coin: number;
  enemy: number;
}

const ADVENTURE_THEMES: AdventurePalette[] = [
  { sky: 0x78cce2, far: 0xc4e5d5, hill: 0x6c9c72, grass: 0x65b75d, deep: 0x34734d, dirt: 0x906044, ledge: 0xeac866, danger: 0xe66356, coin: 0xffdf70, enemy: 0xd75d48 },
  { sky: 0xf4aa78, far: 0xd17e66, hill: 0x92564f, grass: 0xc77b4c, deep: 0x81453f, dirt: 0x68413b, ledge: 0xf3ca69, danger: 0xf05d52, coin: 0xffe481, enemy: 0x7e547f },
  { sky: 0x81d9d3, far: 0x75c5bc, hill: 0x328b86, grass: 0x46b97e, deep: 0x176c6a, dirt: 0x745b46, ledge: 0xffd56d, danger: 0xf06b68, coin: 0xffe778, enemy: 0xe07b5a },
  { sky: 0x6dc5b0, far: 0x569a80, hill: 0x367765, grass: 0x4a9c5d, deep: 0x285e4d, dirt: 0x73503d, ledge: 0xe9ca69, danger: 0xeb675b, coin: 0xffdf76, enemy: 0xd98258 },
  { sky: 0x526b91, far: 0x8498aa, hill: 0x5b786e, grass: 0x4f926a, deep: 0x315e4f, dirt: 0x725344, ledge: 0xf0ce75, danger: 0xef7370, coin: 0xffe48a, enemy: 0x9a75a3 },
];

function fillPolygon(g: Phaser.GameObjects.Graphics, points: Array<[number, number]>, color: number, alpha = 1) {
  const [first, ...rest] = points;
  if (!first) return;
  g.fillStyle(color, alpha);
  g.beginPath();
  g.moveTo(first[0], first[1]);
  for (const [x, y] of rest) g.lineTo(x, y);
  g.closePath();
  g.fillPath();
}

function drawPixelCloud(g: Phaser.GameObjects.Graphics, x: number, y: number, color: number) {
  g.fillStyle(color, 0.9);
  g.fillRect(x + 12, y - 7, 28, 7);
  g.fillRect(x + 4, y, 48, 9);
  g.fillRect(x, y + 9, 58, 6);
  g.fillRect(x + 12, y + 15, 35, 5);
}

function drawStiltHouse(g: Phaser.GameObjects.Graphics, x: number, bottom: number, scale: number, wallColor: number, roofColor: number) {
  g.fillStyle(0x614c3e, 1);
  g.fillRect(x + 9 * scale, bottom - 20 * scale, 3 * scale, 20 * scale);
  g.fillRect(x + 37 * scale, bottom - 20 * scale, 3 * scale, 20 * scale);
  g.fillStyle(wallColor, 1);
  g.fillRect(x + 4 * scale, bottom - 39 * scale, 43 * scale, 19 * scale);
  fillPolygon(g, [[x, bottom - 39 * scale], [x + 25 * scale, bottom - 56 * scale], [x + 51 * scale, bottom - 39 * scale]], roofColor);
  g.fillStyle(0x34535a, 1);
  g.fillRect(x + 12 * scale, bottom - 32 * scale, 7 * scale, 8 * scale);
  g.fillRect(x + 31 * scale, bottom - 32 * scale, 7 * scale, 8 * scale);
}

function drawBalineseGate(g: Phaser.GameObjects.Graphics, x: number, bottom: number, scale: number, stone: number, trim: number) {
  g.fillStyle(0x4d5143, 1);
  g.fillRect(x + 4 * scale, bottom - 31 * scale, 8 * scale, 31 * scale);
  g.fillRect(x + 34 * scale, bottom - 31 * scale, 8 * scale, 31 * scale);
  g.fillRect(x, bottom - 36 * scale, 16 * scale, 5 * scale);
  g.fillRect(x + 30 * scale, bottom - 36 * scale, 16 * scale, 5 * scale);
  g.fillStyle(stone, 1);
  g.fillRect(x + 7 * scale, bottom - 29 * scale, 3 * scale, 26 * scale);
  g.fillRect(x + 36 * scale, bottom - 29 * scale, 3 * scale, 26 * scale);
  g.fillRect(x + 13 * scale, bottom - 26 * scale, 18 * scale, 5 * scale);
  g.fillRect(x + 12 * scale, bottom - 35 * scale, 20 * scale, 4 * scale);
  g.fillRect(x + 17 * scale, bottom - 40 * scale, 10 * scale, 5 * scale);
  g.fillStyle(trim, 1);
  g.fillRect(x + 16 * scale, bottom - 33 * scale, 12 * scale, 2 * scale);
  g.fillRect(x + 20 * scale, bottom - 24 * scale, 4 * scale, 20 * scale);
}

const starPoints = Array.from({ length: 68 }, (_, index) => ({
  x: (index * 97 + 31) % WORLD.width,
  y: (index * 61 + 19) % WORLD.height,
  size: index % 11 === 0 ? 2 : 1,
}));

function hexColor(value: string) {
  return Number.parseInt(value.replace("#", ""), 16);
}

export class ArcadeScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private ink = 0xf5f0ff;
  private screen = 0x14142f;
  private faint = 0x67e8f9;
  private secondary = 0x67e8f9;
  private accent = 0xffb45e;
  private paletteId: GameId | undefined;
  private adventureCameraX = 0;
  private adventureCameraLevel = 0;
  private changeHandler: (model: ArcadeModel, status: string) => void;
  private lastState = "";

  constructor(
    private simulation: ArcadeSimulation,
    private heldActions: Set<string>,
    changeHandler: (model: ArcadeModel, status: string) => void,
  ) {
    super("ColorArcade");
    this.changeHandler = changeHandler;
  }

  create() {
    this.graphics = this.add.graphics();
    this.setPalette(this.simulation.model.id);
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.simulation.setPointer(pointer.worldX, pointer.worldY);
    });
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.simulation.pointerAction(pointer.worldX, pointer.worldY);
    });
  }

  private setPalette(id: GameId) {
    if (this.paletteId === id) return;
    const palette = getGameDefinition(id)?.palette;
    if (!palette) return;
    this.paletteId = id;
    this.screen = hexColor(palette.background);
    this.ink = hexColor(palette.primary);
    this.secondary = hexColor(palette.secondary);
    this.accent = hexColor(palette.accent);
    this.faint = this.secondary;
  }

  update(_time: number, delta: number) {
    this.simulation.update(delta, this.heldActions as ActionSet);
    this.drawFrame(delta);
    const state = this.simulation.model;
    const signature = state.id + "|" + state.phase + "|" + state.score + "|" + this.simulation.status + "|" + state.message;
    if (signature !== this.lastState) {
      this.lastState = signature;
      this.changeHandler(state, this.simulation.status);
    }
  }

  private drawFrame(delta: number) {
    const g = this.graphics;
    g.clear();
    const model = this.simulation.model;
    this.setPalette(model.id);
    if (model.id === "bobs-adventure") {
      this.drawAdventure(model, delta);
      return;
    }
    g.fillStyle(this.screen, 1);
    g.fillRect(0, 0, WORLD.width, WORLD.height);
    for (const [index, star] of starPoints.entries()) {
      g.fillStyle(index % 7 === 0 ? this.accent : this.secondary, index % 7 === 0 ? 1 : 0.62);
      g.fillRect(star.x, star.y, star.size, star.size);
    }
    g.lineStyle(1, this.secondary, 0.7);
    g.strokeRect(12.5, 12.5, WORLD.width - 25, WORLD.height - 25);

    switch (model.id) {
      case "crt": this.drawCRT(model); break;
      case "bertie":
      case "oxo": this.drawBoard(model); break;
      case "nimrod": this.drawNimrod(model); break;
      case "tennis": this.drawTennis(model); break;
      case "spacewar": this.drawSpacewar(model); break;
      case "computer-space": this.drawComputerSpace(model); break;
      case "pong": this.drawPong(model); break;
      case "invaders": this.drawInvaders(model); break;
      default: this.drawOriginal(model); break;
    }
  }

  private drawAdventureBackdrop(model: BobAdventureModel, palette: AdventurePalette, cameraX: number) {
    const g = this.graphics;
    const parallaxX = (worldX: number, speed: number) => Math.round(worldX - cameraX * speed);
    const span = model.worldWidth + WORLD.width + 360;
    const cloudCount = Math.ceil(span / 214);

    g.fillStyle(palette.sky, 1);
    g.fillRect(0, 0, WORLD.width, WORLD.height);
    if (model.theme === 2) {
      g.fillStyle(0x2c898e, 1);
      g.fillRect(0, 184, WORLD.width, WORLD.height - 184);
      g.fillStyle(0x43a8a3, 1);
      g.fillRect(0, 184, WORLD.width, 10);
      for (let i = 0; i < 8; i += 1) {
        const x = parallaxX(i * 118 + 22, 0.29);
        const y = 208 + (i % 3) * 28;
        g.fillStyle(i % 2 ? 0x70c8b6 : 0x4ab1a8, 0.82);
        g.fillRect(x, y, 48, 3);
        g.fillRect(x + 13, y + 7, 31, 2);
      }
    } else if (model.theme === 3) {
      g.fillStyle(0x327d78, 1);
      g.fillRect(0, 277, WORLD.width, WORLD.height - 277);
      g.fillStyle(0x66b9a3, 1);
      g.fillRect(0, 277, WORLD.width, 5);
      for (let i = 0; i < 7; i += 1) {
        const x = parallaxX(i * 127 + 18, 0.22);
        g.fillStyle(0x8bd2b5, 0.58);
        g.fillRect(x, 294 + (i % 2) * 12, 57, 2);
      }
    } else {
      const earth = model.theme === 1 ? 0x885447 : model.theme === 4 ? 0x536b63 : 0x567d53;
      g.fillStyle(earth, 1);
      g.fillRect(0, 302, WORLD.width, WORLD.height - 302);
    }

    if (model.theme === 4) {
      g.fillStyle(0xffe7ae, 1);
      g.fillRect(492, 36, 30, 30);
      g.fillRect(484, 44, 46, 14);
      for (let i = 0; i < 36; i += 1) {
        const x = (i * 83 + 27) % WORLD.width;
        const y = 24 + (i * 47) % 132;
        g.fillStyle(i % 5 === 0 ? 0xffe8ad : 0xd1e5d5, i % 5 === 0 ? 1 : 0.72);
        g.fillRect(x, y, i % 5 === 0 ? 3 : 2, i % 5 === 0 ? 3 : 2);
      }
    } else {
      g.fillStyle(model.theme === 1 ? 0xffd89a : 0xffefad, 1);
      g.fillRect(498, 37, 34, 34);
      g.fillRect(490, 45, 50, 18);
      for (let i = 0; i < cloudCount; i += 1) {
        const x = parallaxX(i * 214 + 48, 0.11);
        if (x < -80 || x > WORLD.width + 62) continue;
        drawPixelCloud(g, x, 48 + (i % 3) * 31, model.theme === 1 ? 0xffd2b4 : 0xe9f5dc);
      }
    }

    if (model.theme === 0) {
      // Bali's volcanic ridge and stepped paddies share one continuous foothill.
      for (let i = 0; i < Math.ceil(span / 370); i += 1) {
        const x = parallaxX(i * 370 - 92, 0.12);
        const peak = i % 3 === 0;
        fillPolygon(g, peak
          ? [[x, 307], [x + 74, 247], [x + 142, 124], [x + 208, 204], [x + 286, 307], [x + 286, 360], [x, 360]]
          : [[x, 307], [x + 82, 257], [x + 150, 218], [x + 219, 253], [x + 300, 307], [x + 300, 360], [x, 360]], palette.far);
        if (peak) {
          fillPolygon(g, [[x + 131, 145], [x + 142, 124], [x + 153, 145], [x + 161, 141], [x + 151, 154], [x + 136, 154]], 0x7f756e);
        }
      }
      for (let i = 0; i < Math.ceil(span / 188); i += 1) {
        const x = parallaxX(i * 188 - 72, 0.39);
        const y = 249 + (i % 3) * 9;
        fillPolygon(g, [[x, 320], [x, y + 35], [x + 36, y + 35], [x + 36, y + 21], [x + 81, y + 21], [x + 81, y + 8], [x + 131, y + 8], [x + 131, 320]], i % 2 ? 0x497d56 : 0x588d5c);
        g.fillStyle(0x9acb7c, 1);
        g.fillRect(x + 39, y + 20, 39, 3);
        g.fillRect(x + 84, y + 7, 43, 3);
        g.fillStyle(0x79b9aa, 0.92);
        g.fillRect(x + 37, y + 35, 43, 3);
        g.fillRect(x + 82, y + 22, 47, 3);
      }
      for (let i = 0; i < Math.ceil(span / 420); i += 1) {
        const x = parallaxX(i * 720 + 430, 1);
        if (x > -60 && x < WORLD.width + 30) drawBalineseGate(g, x, 320, 0.92, 0xb89768, 0xe0c487);
      }
    } else if (model.theme === 1) {
      for (let i = 0; i < Math.ceil(span / 530); i += 1) {
        const x = parallaxX(i * 530 - 55, 0.14);
        fillPolygon(g, [[x, 306], [x + 104, 218], [x + 204, 93], [x + 270, 174], [x + 378, 306], [x + 378, 360], [x, 360]], palette.far);
        fillPolygon(g, [[x + 186, 121], [x + 204, 93], [x + 223, 121], [x + 215, 116], [x + 207, 123]], 0x6a534d);
        fillPolygon(g, [[x + 181, 97], [x + 190, 86], [x + 201, 94], [x + 210, 78], [x + 222, 87], [x + 236, 84], [x + 231, 98], [x + 220, 104], [x + 198, 101]], 0xd5a393, 0.82);
      }
      fillPolygon(g, [[0, 306], [121, 272], [231, 294], [372, 250], [512, 279], [640, 306], [640, 360], [0, 360]], 0x9e5945);
      for (let i = 0; i < Math.ceil(span / 170); i += 1) {
        const x = parallaxX(i * 170 - 24, 0.42);
        const y = 281 + (i % 2) * 9;
        g.fillStyle(i % 2 ? 0xa9704c : 0xb87a4d, 1);
        g.fillRect(x, y, 118, 4);
        g.fillRect(x + 15, y + 9, 98, 3);
        g.fillRect(x + 32, y + 18, 82, 3);
        g.fillStyle(0x567a4c, 1);
        for (let shrub = 0; shrub < 4; shrub += 1) g.fillRect(x + 10 + shrub * 25, y - 5, 7, 5);
      }
      for (let i = 0; i < Math.ceil(span / 250); i += 1) {
        const x = parallaxX(i * 250 + 45, 0.5);
        g.fillStyle(0x624b3d, 1);
        g.fillRect(x + 8, 277, 5, 43);
        g.fillStyle(0x47724e, 1);
        g.fillRect(x - 2, 260, 25, 18);
        g.fillRect(x + 3, 250, 15, 12);
      }
    } else if (model.theme === 2) {
      // Raja Ampat's karst islands descend below the tide line into the reef.
      for (let i = 0; i < Math.ceil(span / 286); i += 1) {
        const x = parallaxX(i * 286 - 28, 0.17);
        const top = 155 + (i % 3) * 13;
        fillPolygon(g, [[x, 231], [x + 33, 203], [x + 53, 210], [x + 80, top], [x + 100, top - 14], [x + 120, 182], [x + 148, 211], [x + 172, 190], [x + 203, 220], [x + 223, 232], [x + 218, 281], [x + 232, 320], [x - 3, 320]], palette.far);
        fillPolygon(g, [[x + 28, 233], [x + 72, 216], [x + 102, 225], [x + 136, 213], [x + 181, 233], [x + 175, 263], [x + 35, 263]], palette.hill);
        g.fillStyle(0x285f60, 0.9);
        g.fillRect(x + 12, 284, 184, 7);
      }
      for (let i = 0; i < Math.ceil(span / 145); i += 1) {
        const x = parallaxX(i * 145 + 38, 0.48);
        g.fillStyle(i % 2 ? 0xe68c7e : 0xf2c17b, 1);
        g.fillRect(x + 4, 347, 4, 13);
        g.fillRect(x, 342, 12, 5);
        g.fillRect(x - 3, 353, 18, 4);
        g.fillStyle(0x75c8b0, 1);
        g.fillRect(x + 8, 331, 3, 13);
        g.fillRect(x + 3, 328, 4, 5);
        g.fillRect(x + 12, 334, 4, 5);
      }
      const boatX = parallaxX(300, 0.27);
      if (boatX > -70 && boatX < WORLD.width + 20) {
        fillPolygon(g, [[boatX, 238], [boatX + 58, 238], [boatX + 48, 248], [boatX + 10, 248]], 0x694d40);
        g.fillStyle(0xfff0cf, 1);
        g.fillRect(boatX + 27, 208, 3, 29);
        fillPolygon(g, [[boatX + 31, 211], [boatX + 50, 233], [boatX + 31, 233]], 0xf5dc9c);
      }
    } else if (model.theme === 3) {
      // Tall dipterocarp trunks and buttress roots reach the wet forest floor.
      for (let i = 0; i < Math.ceil(span / 94); i += 1) {
        const x = parallaxX(i * 94 - 12, 0.31);
        const height = 92 + (i % 4) * 20;
        const trunk = i % 2 ? 0x554e3b : 0x68533c;
        g.fillStyle(trunk, 1);
        g.fillRect(x + 17, 320 - height, 10, height);
        fillPolygon(g, [[x + 6, 320], [x + 18, 288], [x + 25, 316], [x + 40, 320]], 0x68533c);
        g.fillRect(x + 12, 320 - height, 20, 6);
        g.fillStyle(i % 2 ? 0x326c57 : 0x3d8060, 1);
        g.fillRect(x - 9, 320 - height, 60, 25);
        g.fillRect(x - 2, 320 - height - 17, 45, 23);
        g.fillRect(x + 8, 320 - height - 31, 27, 18);
        g.fillStyle(0x70a965, 1);
        g.fillRect(x + 3, 320 - height + 4, 34, 3);
      }
      for (let i = 0; i < Math.ceil(span / 520); i += 1) {
        const x = parallaxX(i * 520 + 250, 0.52);
        if (x > -70 && x < WORLD.width + 20) drawStiltHouse(g, x, 320, 0.78, 0xc69b62, 0x684b40);
      }
    } else {
      // Papua's ridge line keeps its snowless limestone peaks joined to the valley.
      for (let i = 0; i < Math.ceil(span / 355); i += 1) {
        const x = parallaxX(i * 355 - 80, 0.13);
        fillPolygon(g, [[x, 307], [x + 54, 220], [x + 105, 245], [x + 181, 105], [x + 239, 186], [x + 294, 145], [x + 374, 307], [x + 374, 360], [x, 360]], palette.far);
        fillPolygon(g, [[x + 164, 135], [x + 181, 105], [x + 203, 137], [x + 193, 130], [x + 181, 142]], 0xd9e0d4);
      }
      for (let i = 0; i < Math.ceil(span / 205); i += 1) {
        const x = parallaxX(i * 205 - 45, 0.4);
        fillPolygon(g, [[x, 321], [x + 48, 274], [x + 102, 289], [x + 155, 249], [x + 224, 321], [x + 224, 360], [x, 360]], i % 2 ? 0x4e806d : 0x477562);
        g.fillStyle(0xa6bc9b, 0.76);
        g.fillRect(x + 75, 292, 27, 3);
        g.fillRect(x + 152, 277, 21, 3);
      }
    }
  }

  private drawAdventure(model: BobAdventureModel, delta: number) {
    const g = this.graphics;
    const palette = ADVENTURE_THEMES[model.theme] ?? ADVENTURE_THEMES[0]!;
    const cameraTarget = Math.max(0, Math.min(model.worldWidth - WORLD.width, model.player.x + model.player.facing * 34 - WORLD.width * 0.38));
    if (model.level !== this.adventureCameraLevel || Math.abs(cameraTarget - this.adventureCameraX) > WORLD.width * 0.62) {
      this.adventureCameraLevel = model.level;
      this.adventureCameraX = cameraTarget;
    } else {
      this.adventureCameraX += (cameraTarget - this.adventureCameraX) * (1 - Math.exp(-Math.max(0, delta) / 88));
    }
    const cameraX = Math.round(this.adventureCameraX);

    this.drawAdventureBackdrop(model, palette, cameraX);

    const supportPoints = (platform: BobAdventureModel["platforms"][number]) =>
      platform.width >= 116
        ? [platform.x + 9, platform.x + Math.floor(platform.width / 2), platform.x + platform.width - 10]
        : [platform.x + 7, platform.x + platform.width - 8];
    for (const platform of model.platforms) {
      if (platform.y >= GROUND_Y) continue;
      const screenLeft = platform.x - cameraX;
      if (screenLeft + platform.width < -10 || screenLeft > WORLD.width + 10) continue;
      if (model.theme === 0) {
        const center = platform.x + platform.width / 2;
        const top = platform.y + platform.height;
        const footing = model.platforms
          .filter((candidate) => candidate !== platform && candidate.y >= top)
          .sort((a, b) => {
            const aGap = center < a.x ? a.x - center : center > a.x + a.width ? center - a.x - a.width : 0;
            const bGap = center < b.x ? b.x - center : center > b.x + b.width ? center - b.x - b.width : 0;
            return (a.y - top) + aGap * 0.35 - ((b.y - top) + bGap * 0.35);
          })[0];
        const bottom = footing?.y ?? GROUND_Y;
        const screenRight = screenLeft + platform.width;
        let lowerLeft = screenLeft - 13;
        let lowerRight = screenRight + 13;
        if (footing) {
          const footingLeft = footing.x - cameraX;
          const footingRight = footingLeft + footing.width;
          if (footingRight < screenLeft + platform.width / 2) lowerLeft = Math.min(lowerLeft, footingRight);
          else if (footingLeft > screenLeft + platform.width / 2) lowerRight = Math.max(lowerRight, footingLeft);
        }
        fillPolygon(g, [[screenLeft + 3, top], [screenRight - 3, top], [lowerRight, bottom], [lowerLeft, bottom]], 0x76533c);
        g.fillStyle(0x986b49, 1);
        g.fillRect(screenLeft + 5, top + 4, Math.max(0, platform.width - 10), 3);
        for (let layer = top + 13, row = 0; layer < bottom - 4; layer += 13, row += 1) {
          const inset = 8 + (row % 2) * 7;
          const lineWidth = Math.max(8, platform.width - inset * 2 - (row % 3) * 7);
          g.fillStyle(0x5f493b, 0.9);
          g.fillRect(screenLeft + inset, layer, lineWidth, 2);
          g.fillStyle(0x8a6346, 1);
          g.fillRect(screenLeft + inset + 5, layer + 4, Math.max(8, lineWidth - 18), 3);
        }
        g.fillStyle(0x423b33, 1);
        g.fillRect(lowerLeft - 2, bottom - 2, lowerRight - lowerLeft + 4, 3);
        continue;
      }
      for (const worldX of supportPoints(platform)) {
        const footing = model.platforms
          .filter((candidate) => candidate !== platform && candidate.y >= platform.y + platform.height && worldX >= candidate.x + 2 && worldX < candidate.x + candidate.width - 2)
          .sort((a, b) => a.y - b.y)[0];
        const bottom = footing?.y ?? GROUND_Y;
        const top = platform.y + platform.height;
        const height = bottom - top;
        if (height < 8) continue;
        const x = Math.round(worldX - cameraX);
        if (model.theme === 3) {
          const timber = 0x624c36;
          g.fillStyle(0x392f2d, 1);
          g.fillRect(x - 4, top, 9, height);
          g.fillStyle(timber, 1);
          g.fillRect(x - 2, top, 4, height);
          g.lineStyle(2, 0x392f2d, 1);
          g.lineBetween(x - 5, top + 7, x + 4, Math.min(bottom - 3, top + height * 0.42));
          g.lineBetween(x + 4, top + 7, x - 5, Math.min(bottom - 3, top + height * 0.42));
        } else if (model.theme === 2) {
          g.fillStyle(0x176c6a, 1);
          g.fillRect(x - 5, top, 11, height);
          g.fillStyle(0x67bca6, 1);
          g.fillRect(x - 2, top, 3, height);
          for (let seam = top + 10; seam < bottom; seam += 15) g.fillRect(x - 4, seam, 9, 2);
        } else {
          g.fillStyle(0x4d413b, 1);
          g.fillRect(x - 6, top, 13, height);
          g.fillStyle(model.theme === 1 ? 0xb77a53 : 0x8e9b83, 1);
          for (let seam = top + 2; seam < bottom; seam += 10) {
            g.fillRect(x - 4, seam, 9, 6);
            g.fillRect(x + (Math.floor(seam / 10) % 2 ? -6 : -1), seam + 6, 6, 2);
          }
        }
        g.fillStyle(model.theme === 2 ? 0x205b59 : 0x403733, 1);
        g.fillRect(x - 7, bottom - 2, 15, 3);
      }
    }

    for (const platform of model.platforms) {
      const x = Math.round(platform.x - cameraX);
      if (x + platform.width < -8 || x > WORLD.width + 8) continue;
      const ground = platform.y >= GROUND_Y;
      const ledgeColors = [0x83c36c, 0xd99a62, 0x76d4b1, 0x82ba71, 0xb4c7a0];
      g.fillStyle(ground ? palette.dirt : model.theme === 2 ? 0x236d67 : palette.deep, 1);
      g.fillRect(x, platform.y, platform.width, platform.height);
      g.fillStyle(ground ? palette.grass : ledgeColors[model.theme] ?? palette.ledge, 1);
      g.fillRect(x, platform.y, platform.width, ground ? 7 : 5);
      g.fillStyle(0x493d38, 0.88);
      g.strokeRect(x + 0.5, platform.y + 0.5, platform.width - 1, platform.height - 1);

      const tileStart = Math.floor(platform.x / 24) * 24;
      for (let worldTile = tileStart; worldTile < platform.x + platform.width; worldTile += 24) {
        const tile = Math.round(worldTile - cameraX);
        if (tile < x - 3 || tile > x + platform.width) continue;
        const variation = Math.abs(Math.floor(worldTile / 24)) % 3;
        if (ground) {
          g.fillStyle(model.theme === 2 ? 0x155a5b : 0x65493c, 0.78);
          g.fillRect(tile + 5 + variation * 3, platform.y + 17, 3, 3);
          g.fillRect(tile + 13, platform.y + 28 - variation * 2, 4, 3);
        } else if (model.theme === 0) {
          g.fillStyle(variation === 0 ? 0xa6d995 : 0x83ba78, 1);
          g.fillRect(tile + 3, platform.y + 1, 8, 2);
          g.fillStyle(0x76563f, 1);
          g.fillRect(tile + 4, platform.y + 6, 2, platform.height - 6);
        } else if (model.theme === 1 || model.theme === 4) {
          g.fillStyle(model.theme === 1 ? 0x9c6349 : 0x728279, 1);
          g.fillRect(tile + 4, platform.y + 7, 8 + variation * 2, 2);
          g.fillRect(tile + 15, platform.y + 11, 5, 2);
        } else if (model.theme === 2) {
          g.fillStyle(variation === 0 ? 0x4b9b84 : 0x33796e, 1);
          g.fillRect(tile + 4, platform.y + 7, 5, 3);
          g.fillRect(tile + 13, platform.y + 11, 7, 2);
        } else {
          g.fillStyle(variation === 0 ? 0x986b43 : 0x3d694d, 1);
          g.fillRect(tile + 7, platform.y + 5, 3, platform.height - 5);
          g.fillRect(tile + 16, platform.y + 9, 4, 2);
        }
      }
    }

    for (const spike of model.spikes) {
      const x = spike.x - cameraX;
      if (x + spike.width < 0 || x > WORLD.width) continue;
      g.fillStyle(palette.danger, 1);
      for (let point = x; point < x + spike.width; point += 14) {
        const tip = Math.min(point + 7, x + spike.width);
        const right = Math.min(point + 14, x + spike.width);
        g.beginPath();
        g.moveTo(point, spike.y + spike.height);
        g.lineTo(tip, spike.y + 2);
        g.lineTo(right, spike.y + spike.height);
        g.closePath();
        g.fillPath();
      }
      g.fillStyle(0xffc4a3, 1);
      g.fillRect(x, spike.y + spike.height - 3, spike.width, 3);
    }

    for (const coin of model.coins) {
      if (coin.collected) continue;
      const x = Math.round(coin.x - cameraX);
      if (x < -16 || x > WORLD.width + 16) continue;
      const bob = Math.round(Math.sin(model.elapsed / 170 + coin.x) * 2);
      this.drawAdventurePixelSprite(
        coinSprite,
        x,
        coin.y - 10 + bob,
        2,
        coinSpritePalette,
        coinSpriteWidth,
      );
    }

    for (const enemy of model.enemies) {
      if (!enemy.alive) continue;
      const x = Math.round(enemy.x - cameraX);
      if (x < -30 || x > WORLD.width + 30) continue;
      g.fillStyle(0x503850, 1);
      g.fillEllipse(x + 11, enemy.y + 24, 27, 4);
      const gait = Math.floor(model.elapsed / 170 + enemy.x / 24) % 2;
      const critter = gait === 0
        ? kancilSprite
        : kancilSprite.map((row, index) => index === 10 ? "..oDDD..DDo.." : index === 11 ? "...DD....DD..." : row);
      this.drawAdventurePixelSprite(
        critter,
        x + 11,
        enemy.y - 1,
        2,
        kancilSpritePalette,
        kancilSpriteWidth,
        enemy.direction < 0,
      );
    }

    const checkpointScreenX = Math.round(model.checkpointX - cameraX);
    if (checkpointScreenX > -24 && checkpointScreenX < WORLD.width + 24) {
      g.fillStyle(0x593f3c, 1);
      g.fillRect(checkpointScreenX, GROUND_Y - 54, 4, 54);
      const flag = model.checkpointReached ? 0x65dda6 : 0xc84443;
      g.fillStyle(0x8e3936, 1);
      g.fillRect(checkpointScreenX + 4, GROUND_Y - 53, 27, 18);
      g.fillStyle(flag, 1);
      g.fillRect(checkpointScreenX + 6, GROUND_Y - 51, 23, 7);
      g.fillStyle(model.checkpointReached ? 0xd8ffe6 : 0xfff1dc, 1);
      g.fillRect(checkpointScreenX + 6, GROUND_Y - 44, 19, 7);
      g.fillStyle(0x593f3c, 1);
      g.fillRect(checkpointScreenX + 4, GROUND_Y - 35, 3, 4);
    }

    const exitScreenX = Math.round(model.exitX - cameraX);
    if (exitScreenX > -34 && exitScreenX < WORLD.width + 34) {
      g.fillStyle(0x433d46, 1);
      g.fillRect(exitScreenX - 2, GROUND_Y - 43, 8, 43);
      g.fillRect(exitScreenX + 28, GROUND_Y - 43, 8, 43);
      g.fillRect(exitScreenX + 3, GROUND_Y - 49, 30, 8);
      g.fillStyle(0x8c6043, 1);
      g.fillRect(exitScreenX + 2, GROUND_Y - 39, 5, 39);
      g.fillRect(exitScreenX + 27, GROUND_Y - 39, 5, 39);
      g.fillRect(exitScreenX + 4, GROUND_Y - 47, 28, 5);
      g.fillStyle(0x6e9561, 1);
      g.fillRect(exitScreenX - 5, GROUND_Y - 54, 42, 5);
      g.fillRect(exitScreenX, GROUND_Y - 59, 32, 5);
      g.fillStyle(0xd9a75a, 1);
      g.fillRect(exitScreenX + 9, GROUND_Y - 24, 14, 24);
      g.fillStyle(0x4c3b3a, 1);
      g.fillRect(exitScreenX + 11, GROUND_Y - 21, 10, 21);
      g.fillStyle(palette.coin, 1);
      g.fillRect(exitScreenX + 18, GROUND_Y - 14, 2, 2);
    }

    const player = model.player;
    const playerX = Math.round(player.x - cameraX);
    const running = player.grounded && Math.abs(player.vx) > 32;
    const gait = running ? Math.floor(model.elapsed / 92) % 2 : 0;
    const pose: BobPose = model.invulnerable > 0
      ? "hurt"
      : !player.grounded
        ? "jump"
        : running
          ? gait === 0 ? "runA" : "runB"
          : "idle";
    const bounce = running && gait === 1 ? -1 : 0;
    const playerY = Math.round(player.y - 4 + bounce);
    if (model.invulnerable <= 0 || Math.floor(model.elapsed / 85) % 2 === 0) {
      g.fillStyle(0x20394b, 0.45);
      g.fillEllipse(playerX + player.width / 2, player.y + player.height + 1, 29, 5);
      this.drawAdventurePixelSprite(
        bobSprites[pose],
        playerX + player.width / 2,
        playerY,
        BOB_SPRITE_PIXEL,
        bobSpritePalette,
        BOB_SPRITE_WIDTH,
        player.facing < 0,
      );
    }

    g.fillStyle(0x26334a, 0.82);
    g.fillRect(14, 13, 232, 18);
    for (let level = 0; level < 25; level += 1) {
      g.fillStyle(level < model.level ? palette.coin : 0x68758a, 1);
      g.fillRect(20 + level * 8, 19, 5, 6);
    }
    if (model.levelTransition > 0) {
      g.fillStyle(0xfff2c5, 1);
      g.fillRect(WORLD.width / 2 - 20, 125, 40, 6);
      g.fillRect(WORLD.width / 2 - 12, 116, 8, 5);
      g.fillRect(WORLD.width / 2 + 7, 116, 8, 5);
    }
  }

  private drawAdventurePixelSprite(
    sprite: string[],
    centerX: number,
    y: number,
    pixel: number,
    palette: Record<string, number>,
    width: number,
    flipX = false,
  ) {
    const g = this.graphics;
    const left = Math.round(centerX - width * pixel / 2);
    for (let row = 0; row < sprite.length; row += 1) {
      const cells = sprite[row] ?? "";
      const offset = Math.floor((width - cells.length) / 2);
      for (let column = 0; column < cells.length; column += 1) {
        const color = palette[cells[column] ?? "."];
        if (color === undefined) continue;
        const targetColumn = flipX ? width - 1 - (offset + column) : offset + column;
        g.fillStyle(color, 1);
        g.fillRect(left + targetColumn * pixel, y + row * pixel, pixel, pixel);
      }
    }
  }

  private drawOriginal(model: Extract<ArcadeModel, { family: string }>) {
    const g = this.graphics;
    g.fillStyle(this.secondary, 1);
    g.fillRect(28, 38, 30, 2);
    g.fillRect(WORLD.width - 58, 38, 30, 2);
    g.lineStyle(1, this.faint, 0.8);
    for (let life = 0; life < model.lives; life += 1) g.strokeRect(34 + life * 15, 48, 8, 8);

    if (model.family === "maze") {
      for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 16; column += 1) {
          if (mazeWalls[row]?.[column] === "#") {
            g.fillStyle(this.secondary, 0.66);
            g.fillRect(33 + column * 36, 37 + row * 36, 34, 34);
          }
        }
      }
      g.fillStyle(this.accent, 1);
      for (const dot of model.dots) {
        if (!dot.collected) g.fillCircle(32 + dot.column * 36, 36 + dot.row * 36, 3);
      }
      g.fillStyle(this.ink, 1);
      g.fillCircle(model.playerX, model.playerY, 10);
      g.fillStyle(this.screen, 1);
      g.fillCircle(model.playerX + 3, model.playerY - 2, 2);
      return;
    }

    if (model.family === "timing") {
      const left = 72;
      const width = WORLD.width - 144;
      const targetWidth = model.id === "word-rush" ? 0.28 : model.id === "yo-yo" ? 0.1 : 0.14;
      g.lineStyle(2, this.ink, 1);
      g.strokeRect(left, 163, width, 34);
      g.lineStyle(2, this.accent, 1);
      g.strokeRect(left + width * (0.5 - targetWidth / 2), 157, width * targetWidth, 46);
      g.fillStyle(this.ink, 1);
      g.fillRect(left + model.marker * width - 3, 155, 6, 50);
      g.lineStyle(1, this.faint, 1);
      for (let index = 1; index < 8; index += 1) g.lineBetween(left + index * width / 8, 164, left + index * width / 8, 196);
      return;
    }

    g.lineStyle(1, this.secondary, 0.65);
    g.lineBetween(28, 326, WORLD.width - 28, 326);
    for (const object of model.objects) {
      if (object.kind === "target") {
        g.fillStyle(this.accent, 1);
        g.fillCircle(object.x, object.y, object.size * 0.48);
        g.lineStyle(1, this.screen, 1);
        g.strokeCircle(object.x, object.y, object.size * 0.72);
      } else if (model.id === "laser-lane") {
        g.fillStyle(this.accent, 1);
        g.fillRect(object.x - 30, object.y - 3, 60, 6);
        g.fillStyle(this.secondary, 1);
        g.fillRect(object.x - 33, object.y - 6, 4, 12);
        g.fillRect(object.x + 29, object.y - 6, 4, 12);
      } else {
        g.fillStyle(this.secondary, 1);
        g.fillRect(object.x - object.size / 2, object.y - object.size / 2, object.size, object.size);
      }
    }

    if (model.family === "shoot") {
      g.lineStyle(2, this.ink, 1);
      g.beginPath();
      g.moveTo(model.playerX, model.playerY - 13);
      g.lineTo(model.playerX - 13, model.playerY + 12);
      g.lineTo(model.playerX + 13, model.playerY + 12);
      g.closePath();
      g.strokePath();
      g.fillStyle(this.accent, 1);
      for (const bullet of model.bullets) g.fillRect(bullet.x - 2, bullet.y - 5, 4, 10);
    } else if (model.family === "jump") {
      g.lineStyle(2, this.ink, 1);
      g.strokeRect(model.playerX - 10, model.playerY - 14, 20, 24);
      g.fillStyle(this.ink, 1);
      g.fillRect(model.playerX - 13, model.playerY + 10, 8, 4);
      g.fillRect(model.playerX + 5, model.playerY + 10, 8, 4);
    } else if (model.family === "catch") {
      g.lineStyle(3, this.ink, 1);
      g.beginPath();
      g.moveTo(model.playerX - 20, model.playerY - 4);
      g.lineTo(model.playerX - 14, model.playerY + 12);
      g.lineTo(model.playerX + 14, model.playerY + 12);
      g.lineTo(model.playerX + 20, model.playerY - 4);
      g.strokePath();
      g.lineBetween(model.playerX - 20, model.playerY - 4, model.playerX + 20, model.playerY - 4);
    } else {
      g.lineStyle(2, this.ink, 1);
      g.beginPath();
      g.moveTo(model.playerX, model.playerY - 13);
      g.lineTo(model.playerX - 12, model.playerY + 10);
      g.lineTo(model.playerX + 12, model.playerY + 10);
      g.closePath();
      g.strokePath();
    }

    g.fillStyle(this.accent, 1);
    g.fillRoundedRect(28, WORLD.height - 24, Math.max(4, (model.score / 12) * (WORLD.width - 56)), 5, 3);
    g.lineStyle(1, this.faint, 0.75);
    g.strokeRoundedRect(28, WORLD.height - 24, WORLD.width - 56, 5, 3);
  }

  private drawCRT(model: Extract<ArcadeModel, { id: "crt" }>) {
    const g = this.graphics;
    g.lineStyle(1, this.faint, 0.8);
    for (const radius of [model.target.radius, model.target.radius * 0.66, model.target.radius * 0.28]) {
      g.strokeCircle(model.target.x, model.target.y, radius);
    }
    g.fillStyle(this.accent, 1);
    g.fillCircle(model.target.x, model.target.y, 2);
    g.lineStyle(1, this.ink, 0.9);
    g.lineBetween(model.reticle.x - 15, model.reticle.y, model.reticle.x - 5, model.reticle.y);
    g.lineBetween(model.reticle.x + 5, model.reticle.y, model.reticle.x + 15, model.reticle.y);
    g.lineBetween(model.reticle.x, model.reticle.y - 15, model.reticle.x, model.reticle.y - 5);
    g.lineBetween(model.reticle.x, model.reticle.y + 5, model.reticle.x, model.reticle.y + 15);
    g.strokeCircle(model.reticle.x, model.reticle.y, 5);
    g.fillStyle(this.ink, 1);
    g.fillRect(35, 320, Math.min(90, model.score), 3);
  }

  private drawBoard(model: Extract<ArcadeModel, { id: "bertie" | "oxo" }>) {
    const g = this.graphics;
    const left = 130;
    const top = 48;
    const cellW = 126;
    const cellH = 88;
    g.lineStyle(2, this.secondary, 0.82);
    for (let i = 1; i < 3; i += 1) {
      g.lineBetween(left + i * cellW, top, left + i * cellW, top + 3 * cellH);
      g.lineBetween(left, top + i * cellH, left + 3 * cellW, top + i * cellH);
    }
    g.lineStyle(2, this.accent, 1);
    const col = model.cursor % 3;
    const row = Math.floor(model.cursor / 3);
    g.strokeRect(left + col * cellW + 5, top + row * cellH + 5, cellW - 10, cellH - 10);
    for (let i = 0; i < model.cells.length; i += 1) {
      const mark = model.cells[i];
      if (!mark) continue;
      const x = left + (i % 3) * cellW + cellW / 2;
      const y = top + Math.floor(i / 3) * cellH + cellH / 2;
      g.lineStyle(5, mark === "X" ? this.ink : this.accent, 1);
      if (mark === "X") {
        g.lineBetween(x - 20, y - 20, x + 20, y + 20);
        g.lineBetween(x + 20, y - 20, x - 20, y + 20);
      } else {
        g.strokeCircle(x, y, 23);
      }
    }
  }

  private drawNimrod(model: Extract<ArcadeModel, { id: "nimrod" }>) {
    const g = this.graphics;
    const baseX = 205;
    const gap = 110;
    for (let pile = 0; pile < model.piles.length; pile += 1) {
      const x = baseX + pile * gap;
      if (pile === model.selectedPile) {
        g.lineStyle(2, this.accent, 1);
        g.strokeRect(x - 42, 84, 84, 178);
      }
      for (let count = 0; count < model.piles[pile]; count += 1) {
        const y = 230 - count * 26;
        g.lineStyle(3, this.secondary, 1);
        g.lineBetween(x - 24, y - 14, x + 23, y + 14);
        g.lineStyle(1, this.accent, 1);
        g.lineBetween(x - 17, y - 12, x - 10, y - 8);
        g.lineBetween(x + 17, y + 12, x + 22, y + 13);
      }
      g.fillStyle(this.secondary, 1);
      g.fillRect(x - 35, 246, 70, 2);
    }
  }

  private drawTennis(model: Extract<ArcadeModel, { id: "tennis" }>) {
    const g = this.graphics;
    g.lineStyle(1, this.secondary, 1);
    g.lineBetween(68, 280, 572, 280);
    g.lineBetween(68, 285, 572, 285);
    g.lineBetween(68, 283, 68, 92);
    g.lineBetween(572, 283, 572, 92);
    g.lineStyle(2, this.ink, 1);
    g.lineBetween(320, 278, 320, 145);
    for (let y = 153; y < 279; y += 13) g.fillRect(315, y, 10, 3);
    g.lineStyle(2, this.ink, 1);
    g.lineBetween(90, 273, 120, 273);
    g.lineBetween(550, 273, 580, 273);
    g.lineStyle(1, this.faint, 1);
    const aimLength = 95;
    g.lineBetween(105, 270, 105 + Math.cos(model.angle) * aimLength, 270 + Math.sin(model.angle) * aimLength);
    g.fillStyle(this.accent, 1);
    g.fillCircle(model.ball.x, model.ball.y, 6);
    g.lineStyle(1, this.ink, 1);
    g.strokeCircle(model.ball.x, model.ball.y, 8);
  }

  private drawSpacewar(model: Extract<ArcadeModel, { id: "spacewar" }>) {
    const g = this.graphics;
    g.lineStyle(1, this.secondary, 0.8);
    g.strokeCircle(WORLD.width / 2, WORLD.height / 2, 48);
    g.fillStyle(this.accent, 1);
    g.fillCircle(WORLD.width / 2, WORLD.height / 2, 3);
    this.drawShip(model.player.x, model.player.y, model.player.angle, 1, this.ink);
    this.drawShip(model.enemy.x, model.enemy.y, model.enemy.angle, 0.6, this.accent);
    for (const bullet of model.bullets) {
      g.fillStyle(bullet.owner === "player" ? this.secondary : this.accent, 1);
      g.fillCircle(bullet.x, bullet.y, 3);
    }
    g.lineStyle(1, this.secondary, 1);
    for (let i = 0; i < model.player.lives; i += 1) g.strokeCircle(35 + i * 20, 34, 5);
    for (let i = 0; i < model.enemy.lives; i += 1) g.strokeCircle(WORLD.width - 35 - i * 20, 34, 5);
  }

  private drawComputerSpace(model: Extract<ArcadeModel, { id: "computer-space" }>) {
    const g = this.graphics;
    g.lineStyle(1, this.ink, 1);
    for (const rock of model.rocks) {
      g.strokeCircle(rock.x, rock.y, rock.radius);
      g.lineBetween(rock.x - rock.radius * 0.55, rock.y - rock.radius * 0.1, rock.x + rock.radius * 0.35, rock.y + rock.radius * 0.4);
      g.lineBetween(rock.x - rock.radius * 0.1, rock.y - rock.radius * 0.65, rock.x + rock.radius * 0.35, rock.y + rock.radius * 0.4);
    }
    if (model.invulnerability <= 0 || Math.floor(model.invulnerability / 100) % 2 === 0) {
      this.drawShip(model.ship.x, model.ship.y, model.ship.angle, 1, this.ink);
    }
    g.fillStyle(this.accent, 1);
    for (const bullet of model.bullets) g.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);
    for (let i = 0; i < model.ship.lives; i += 1) this.drawShip(35 + i * 22, 34, -Math.PI / 2, 0.55, this.secondary);
  }

  private drawPong(model: Extract<ArcadeModel, { id: "pong" }>) {
    const g = this.graphics;
    g.fillStyle(this.secondary, 1);
    for (let y = 26; y < WORLD.height - 26; y += 18) g.fillRect(WORLD.width / 2 - 1, y, 2, 9);
    g.fillStyle(this.ink, 1);
    g.fillRect(37, model.playerY - 34, 8, 68);
    g.fillStyle(this.accent, 1);
    g.fillRect(WORLD.width - 45, model.computerY - 34, 8, 68);
    g.fillStyle(this.secondary, 1);
    g.fillRect(model.ball.x - 7, model.ball.y - 7, 14, 14);
    g.fillStyle(this.ink, 1);
    g.fillRect(95, 40, 50, 2);
    g.fillRect(WORLD.width - 145, 40, 50, 2);
  }

  private drawInvaders(model: Extract<ArcadeModel, { id: "invaders" }>) {
    const g = this.graphics;
    for (const alien of model.aliens) {
      if (!alien.alive) continue;
      const sprite = [sprites.alienA, sprites.alienB, sprites.alienC][alien.row % 3];
      if (sprite) this.drawPixelSprite(sprite, alien.x, alien.y, 2, alien.row === 0 ? this.accent : this.secondary);
    }
    for (const bunker of model.bunkers) {
      if (bunker.hits < 5) this.drawPixelSprite(sprites.bunker, bunker.x - 16, 276, 2, this.secondary);
    }
    if (model.invulnerability <= 0 || Math.floor(model.invulnerability / 100) % 2 === 0) {
      this.drawPixelSprite(sprites.ship, model.playerX - 16, 318, 2, this.ink);
    }
    g.fillStyle(this.accent, 1);
    for (const bullet of model.bullets) g.fillRect(bullet.x - 2, bullet.y - 5, 4, 10);
  }

  private drawShip(x: number, y: number, angle: number, scale: number, color = this.ink) {
    const g = this.graphics;
    const point = (distance: number, side: number) => ({
      x: x + Math.cos(angle) * distance * scale + Math.cos(angle + Math.PI / 2) * side * scale,
      y: y + Math.sin(angle) * distance * scale + Math.sin(angle + Math.PI / 2) * side * scale,
    });
    const nose = point(19, 0);
    const rearA = point(-12, -12);
    const rearB = point(-7, 0);
    const rearC = point(-12, 12);
    g.lineStyle(2, color, 1);
    g.beginPath();
    g.moveTo(nose.x, nose.y);
    g.lineTo(rearA.x, rearA.y);
    g.lineTo(rearB.x, rearB.y);
    g.lineTo(rearC.x, rearC.y);
    g.closePath();
    g.strokePath();
  }

  private drawPixelSprite(sprite: string[], x: number, y: number, pixel: number, color = this.ink) {
    const g = this.graphics;
    g.fillStyle(color, 1);
    for (let row = 0; row < sprite.length; row += 1) {
      for (let column = 0; column < (sprite[row]?.length ?? 0); column += 1) {
        if (sprite[row]?.[column] === "#") g.fillRect(x + column * pixel, y + row * pixel, pixel, pixel);
      }
    }
  }
}

export interface ArcadeController {
  select: (id: GameId, computerFirst?: boolean) => void;
  start: () => void;
  restart: () => void;
  setComputerFirst: (value: boolean) => void;
  destroy: () => void;
}

export function bootArcade(
  parent: HTMLElement,
  onState: (model: ArcadeModel, status: string) => void,
): ArcadeController {
  const simulation = new ArcadeSimulation();
  const heldActions = new Set<string>();
  const scene = new ArcadeScene(simulation, heldActions, onState);
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    width: WORLD.width,
    height: WORLD.height,
    backgroundColor: "#14142f",
    pixelArt: true,
    roundPixels: true,
    render: { antialias: false, pixelArt: true },
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: WORLD.width,
      height: WORLD.height,
    },
    scene: [scene],
    input: { activePointers: 1, smoothFactor: 0 },
    banner: false,
  });

  const select = (id: GameId, computerFirst = false) => simulation.select(id, computerFirst);
  const start = () => simulation.start();
  const restart = () => simulation.restart();
  const setComputerFirst = (value: boolean) => simulation.setComputerFirst(value);
  const clearHeld = () => heldActions.clear();

  const keyToAction = (key: string) => {
    const map: Record<string, string> = {
      ArrowLeft: "left", a: "left",
      ArrowRight: "right", d: "right",
      ArrowUp: "up", w: "up",
      ArrowDown: "down", s: "down",
      " ": "action", Enter: "action",
    };
    return map[key] ?? map[key.toLowerCase()];
  };
  const onKeyDown = (event: KeyboardEvent) => {
    const active = document.activeElement;
    if (active instanceof HTMLElement && active.closest("a, button:not([data-action]), input, textarea, select, [contenteditable='true']")) return;
    const action = keyToAction(event.key);
    if (!action) return;
    event.preventDefault();
    heldActions.add(action);
    if (!event.repeat) simulation.action(action as import("./arcade-simulation").GameAction);
  };
  const onKeyUp = (event: KeyboardEvent) => {
    const action = keyToAction(event.key);
    if (action) heldActions.delete(action);
  };
  const onBlur = () => clearHeld();
  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);

  const controls = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-action]"));
  for (const button of controls) {
    const action = button.dataset.action;
    if (!action) continue;
    button.addEventListener("pointerdown", (event) => {
      event.preventDefault();
      button.setPointerCapture(event.pointerId);
      heldActions.add(action);
      simulation.action(action as import("./arcade-simulation").GameAction);
    });
    const release = () => heldActions.delete(action);
    button.addEventListener("pointerup", release);
    button.addEventListener("pointercancel", release);
    button.addEventListener("lostpointercapture", release);
  }

  return {
    select,
    start,
    restart,
    setComputerFirst,
    destroy: () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      clearHeld();
      game.destroy(true);
    },
  };
}
