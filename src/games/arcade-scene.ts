import Phaser from "phaser";
import { ArcadeSimulation, WORLD, type ActionSet, type ArcadeModel } from "./arcade-simulation";
import type { GameId } from "./catalog";

const sprites = {
  alienA: ["....##....##....", ".....##..##.....", "....########....", "..##.######.##..", "################", "##..########..##", "##..##....##..##", "....##....##...."],
  alienB: ["......##........", "....######......", "..##########....", "##..##.##.##..##", "################", "..##..####..##..", "##..##....##..##", "....##....##...."],
  alienC: ["......##........", ".....####.......", "....######......", "..##.####.##....", "..############..", "##..##.##.##..##", "....##....##....", "..##........##.."],
  ship: ["......##......", ".....####.....", "....######....", "################", "################", "###..######..###", "##....####....##"],
  bunker: ["..############..", ".##############.", "################", "################", "#######..#######", "######....######", "#####......#####"],
};

const pocketMazeWalls = [
  "................",
  "..##....##......",
  "................",
  ".....##....##...",
  "................",
  "..##....##......",
  "................",
  "................",
];

const starPoints = Array.from({ length: 68 }, (_, index) => ({
  x: (index * 97 + 31) % WORLD.width,
  y: (index * 61 + 19) % WORLD.height,
  size: index % 11 === 0 ? 2 : 1,
}));

function cssColor(name: string, fallback: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  const color = value || fallback;
  return Number("0x" + color.replace("#", "")) || Number("0x" + fallback.replace("#", ""));
}

export class ArcadeScene extends Phaser.Scene {
  private graphics!: Phaser.GameObjects.Graphics;
  private ink = 0x171717;
  private screen = 0xf0f0ed;
  private faint = 0xd6d6d1;
  private changeHandler: (model: ArcadeModel, status: string) => void;
  private lastState = "";

  constructor(
    private simulation: ArcadeSimulation,
    private heldActions: Set<string>,
    changeHandler: (model: ArcadeModel, status: string) => void,
  ) {
    super("MonochromeArcade");
    this.changeHandler = changeHandler;
  }

  create() {
    this.graphics = this.add.graphics();
    this.readTheme();
    this.events.on("theme-change", this.readTheme, this);
    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      this.simulation.setPointer(pointer.worldX, pointer.worldY);
    });
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.simulation.pointerAction(pointer.worldX, pointer.worldY);
    });
  }

  private readTheme() {
    this.ink = cssColor("--ink", "#171717");
    this.screen = cssColor("--screen", "#f0f0ed");
    this.faint = cssColor("--line", "#d6d6d1");
  }

  update(_time: number, delta: number) {
    this.simulation.update(delta, this.heldActions as ActionSet);
    this.drawFrame();
    const state = this.simulation.model;
    const signature = state.phase + "|" + state.score + "|" + this.simulation.status + "|" + state.message;
    if (signature !== this.lastState) {
      this.lastState = signature;
      this.changeHandler(state, this.simulation.status);
    }
  }

  private drawFrame() {
    const g = this.graphics;
    g.clear();
    g.fillStyle(this.screen, 1);
    g.fillRect(0, 0, WORLD.width, WORLD.height);
    g.fillStyle(this.faint, 0.68);
    for (const star of starPoints) g.fillRect(star.x, star.y, star.size, star.size);
    g.lineStyle(1, this.faint, 0.8);
    g.strokeRect(12.5, 12.5, WORLD.width - 25, WORLD.height - 25);

    const model = this.simulation.model;
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
      default: this.drawPocket(model); break;
    }
  }

  private drawPocket(model: Extract<ArcadeModel, { family: string }>) {
    const g = this.graphics;
    g.fillStyle(this.faint, 1);
    g.fillRect(28, 38, 30, 2);
    g.fillRect(WORLD.width - 58, 38, 30, 2);
    g.lineStyle(1, this.faint, 0.8);
    for (let life = 0; life < model.lives; life += 1) g.strokeRect(34 + life * 15, 48, 8, 8);

    if (model.family === "maze") {
      for (let row = 0; row < 8; row += 1) {
        for (let column = 0; column < 16; column += 1) {
          if (pocketMazeWalls[row]?.[column] === "#") {
            g.fillStyle(this.faint, 1);
            g.fillRect(33 + column * 36, 37 + row * 36, 34, 34);
          }
        }
      }
      g.fillStyle(this.ink, 1);
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
      g.lineStyle(1, this.faint, 1);
      g.strokeRect(left + width * (0.5 - targetWidth / 2), 157, width * targetWidth, 46);
      g.fillStyle(this.ink, 1);
      g.fillRect(left + model.marker * width - 3, 155, 6, 50);
      g.lineStyle(1, this.faint, 1);
      for (let index = 1; index < 8; index += 1) g.lineBetween(left + index * width / 8, 164, left + index * width / 8, 196);
      return;
    }

    g.lineStyle(1, this.faint, 0.8);
    g.lineBetween(28, 326, WORLD.width - 28, 326);
    for (const object of model.objects) {
      if (object.kind === "target") {
        g.fillStyle(this.ink, 1);
        g.fillCircle(object.x, object.y, object.size * 0.48);
        g.lineStyle(1, this.screen, 1);
        g.strokeCircle(object.x, object.y, object.size * 0.72);
      } else if (model.id === "laser-lane") {
        g.fillStyle(this.ink, 1);
        g.fillRect(object.x - 30, object.y - 3, 60, 6);
        g.fillStyle(this.faint, 1);
        g.fillRect(object.x - 33, object.y - 6, 4, 12);
        g.fillRect(object.x + 29, object.y - 6, 4, 12);
      } else {
        g.fillStyle(this.ink, 1);
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
      g.fillStyle(this.ink, 1);
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

    g.fillStyle(this.ink, 1);
    g.fillRect(28, WORLD.height - 23, Math.max(4, (model.score / 12) * (WORLD.width - 56)), 3);
    g.lineStyle(1, this.faint, 0.75);
    g.strokeRect(28, WORLD.height - 23, WORLD.width - 56, 3);
  }

  private drawCRT(model: Extract<ArcadeModel, { id: "crt" }>) {
    const g = this.graphics;
    g.lineStyle(1, this.faint, 0.8);
    for (const radius of [model.target.radius, model.target.radius * 0.66, model.target.radius * 0.28]) {
      g.strokeCircle(model.target.x, model.target.y, radius);
    }
    g.fillStyle(this.ink, 1);
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
    g.lineStyle(2, this.ink, 1);
    for (let i = 1; i < 3; i += 1) {
      g.lineBetween(left + i * cellW, top, left + i * cellW, top + 3 * cellH);
      g.lineBetween(left, top + i * cellH, left + 3 * cellW, top + i * cellH);
    }
    g.lineStyle(1, this.faint, 1);
    const col = model.cursor % 3;
    const row = Math.floor(model.cursor / 3);
    g.strokeRect(left + col * cellW + 5, top + row * cellH + 5, cellW - 10, cellH - 10);
    for (let i = 0; i < model.cells.length; i += 1) {
      const mark = model.cells[i];
      if (!mark) continue;
      const x = left + (i % 3) * cellW + cellW / 2;
      const y = top + Math.floor(i / 3) * cellH + cellH / 2;
      g.lineStyle(5, this.ink, 1);
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
        g.lineStyle(1, this.faint, 1);
        g.strokeRect(x - 42, 84, 84, 178);
      }
      for (let count = 0; count < model.piles[pile]; count += 1) {
        const y = 230 - count * 26;
        g.lineStyle(3, this.ink, 1);
        g.lineBetween(x - 24, y - 14, x + 23, y + 14);
        g.lineStyle(1, this.faint, 1);
        g.lineBetween(x - 17, y - 12, x - 10, y - 8);
        g.lineBetween(x + 17, y + 12, x + 22, y + 13);
      }
      g.fillStyle(this.faint, 1);
      g.fillRect(x - 35, 246, 70, 2);
    }
  }

  private drawTennis(model: Extract<ArcadeModel, { id: "tennis" }>) {
    const g = this.graphics;
    g.lineStyle(1, this.faint, 1);
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
    g.fillStyle(this.ink, 1);
    g.fillCircle(model.ball.x, model.ball.y, 6);
    g.lineStyle(1, this.ink, 1);
    g.strokeCircle(model.ball.x, model.ball.y, 8);
  }

  private drawSpacewar(model: Extract<ArcadeModel, { id: "spacewar" }>) {
    const g = this.graphics;
    g.lineStyle(1, this.faint, 0.8);
    g.strokeCircle(WORLD.width / 2, WORLD.height / 2, 48);
    g.fillStyle(this.ink, 1);
    g.fillCircle(WORLD.width / 2, WORLD.height / 2, 3);
    this.drawShip(model.player.x, model.player.y, model.player.angle, 1);
    this.drawShip(model.enemy.x, model.enemy.y, model.enemy.angle, 0.6);
    g.fillStyle(this.ink, 1);
    for (const bullet of model.bullets) g.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);
    g.lineStyle(1, this.ink, 1);
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
      this.drawShip(model.ship.x, model.ship.y, model.ship.angle, 1);
    }
    g.fillStyle(this.ink, 1);
    for (const bullet of model.bullets) g.fillRect(bullet.x - 2, bullet.y - 2, 4, 4);
    for (let i = 0; i < model.ship.lives; i += 1) this.drawShip(35 + i * 22, 34, -Math.PI / 2, 0.55);
  }

  private drawPong(model: Extract<ArcadeModel, { id: "pong" }>) {
    const g = this.graphics;
    g.fillStyle(this.faint, 1);
    for (let y = 26; y < WORLD.height - 26; y += 18) g.fillRect(WORLD.width / 2 - 1, y, 2, 9);
    g.fillStyle(this.ink, 1);
    g.fillRect(37, model.playerY - 34, 8, 68);
    g.fillRect(WORLD.width - 45, model.computerY - 34, 8, 68);
    g.fillRect(model.ball.x - 7, model.ball.y - 7, 14, 14);
    g.fillRect(95, 40, 50, 2);
    g.fillRect(WORLD.width - 145, 40, 50, 2);
  }

  private drawInvaders(model: Extract<ArcadeModel, { id: "invaders" }>) {
    const g = this.graphics;
    for (const alien of model.aliens) {
      if (!alien.alive) continue;
      const sprite = [sprites.alienA, sprites.alienB, sprites.alienC][alien.row % 3];
      if (sprite) this.drawPixelSprite(sprite, alien.x, alien.y, 2);
    }
    for (const bunker of model.bunkers) {
      if (bunker.hits < 5) this.drawPixelSprite(sprites.bunker, bunker.x - 16, 276, 2);
    }
    if (model.invulnerability <= 0 || Math.floor(model.invulnerability / 100) % 2 === 0) {
      this.drawPixelSprite(sprites.ship, model.playerX - 16, 318, 2);
    }
    g.fillStyle(this.ink, 1);
    for (const bullet of model.bullets) g.fillRect(bullet.x - 2, bullet.y - 5, 4, 10);
  }

  private drawShip(x: number, y: number, angle: number, scale: number) {
    const g = this.graphics;
    const point = (distance: number, side: number) => ({
      x: x + Math.cos(angle) * distance * scale + Math.cos(angle + Math.PI / 2) * side * scale,
      y: y + Math.sin(angle) * distance * scale + Math.sin(angle + Math.PI / 2) * side * scale,
    });
    const nose = point(19, 0);
    const rearA = point(-12, -12);
    const rearB = point(-7, 0);
    const rearC = point(-12, 12);
    g.lineStyle(2, this.ink, 1);
    g.beginPath();
    g.moveTo(nose.x, nose.y);
    g.lineTo(rearA.x, rearA.y);
    g.lineTo(rearB.x, rearB.y);
    g.lineTo(rearC.x, rearC.y);
    g.closePath();
    g.strokePath();
  }

  private drawPixelSprite(sprite: string[], x: number, y: number, pixel: number) {
    const g = this.graphics;
    g.fillStyle(this.ink, 1);
    for (let row = 0; row < sprite.length; row += 1) {
      for (let column = 0; column < (sprite[row]?.length ?? 0); column += 1) {
        if (sprite[row]?.[column] === "#") g.fillRect(x + column * pixel, y + row * pixel, pixel, pixel);
      }
    }
  }
}

export interface ArcadeController {
  select: (id: GameId) => void;
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
    backgroundColor: "#f0f0ed",
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

  const select = (id: GameId) => simulation.select(id);
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
    if (active instanceof HTMLElement && active.closest("a, button, input, textarea, select, [contenteditable='true']")) return;
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

  const observer = new MutationObserver(() => game.events.emit("theme-change"));
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

  return {
    select,
    start,
    restart,
    setComputerFirst,
    destroy: () => {
      observer.disconnect();
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
      clearHeld();
      game.destroy(true);
    },
  };
}
