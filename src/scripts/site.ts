import { featuredAdventure, games, getGameDefinition, type GameId } from "../games/catalog";
import type { ArcadeController } from "../games/arcade-scene";

const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const gameButtons = Array.from(document.querySelectorAll<HTMLButtonElement>(".game-choice"));
const featuredPlayButton = document.querySelector<HTMLButtonElement>(".feature-play");
const gameTitle = document.querySelector<HTMLElement>("#selected-game-name");
const gameDescription = document.querySelector<HTMLElement>("#game-description");
const gameStatus = document.querySelector<HTMLOutputElement>("#arcade-status");
const arcadeStage = document.querySelector<HTMLElement>("#arcade-stage");
const gameOverlay = document.querySelector<HTMLElement>("#game-overlay");
const overlayKicker = document.querySelector<HTMLElement>("#overlay-kicker");
const overlayTitle = document.querySelector<HTMLElement>("#overlay-title");
const overlayMessage = document.querySelector<HTMLElement>("#overlay-message");
const startButton = document.querySelector<HTMLButtonElement>("#game-start");
const stage = document.querySelector<HTMLElement>("#arcade-canvas");
const controlsCopy = document.querySelector<HTMLElement>("#controls-copy");
const firstTurnToggle = document.querySelector<HTMLButtonElement>("#first-turn-toggle");
const actionLabel = document.querySelector<HTMLElement>("#action-label");
const upControl = document.querySelector<HTMLButtonElement>('[data-action="up"]');
const downControl = document.querySelector<HTMLButtonElement>('[data-action="down"]');

let controller: ArcadeController | undefined;
let booting: Promise<ArcadeController> | undefined;
let selectedGame: GameId = featuredAdventure.id;
let computerFirst = false;

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  if (themeColor) themeColor.content = theme === "dark" ? "#141a29" : "#fff8ea";
}

function setState(model: import("../games/arcade-simulation").ArcadeModel, status: string) {
  const { phase, message } = model;
  const definition = getGameDefinition(model.id);
  if (gameStatus && definition) {
    const position = String(games.findIndex((game) => game.id === definition.id) + 1).padStart(2, "0");
    gameStatus.textContent = phase === "playing" ? status : definition.id === "bobs-adventure" ? "LEVEL " + String(model.level).padStart(2, "0") + " / 25" : position + " / " + games.length + " · ORIGINAL";
  }
  if (gameDescription && definition) {
    gameDescription.textContent = model.id === "bobs-adventure" && phase !== "ready"
      ? model.levelName + " · " + definition.description
      : definition.description;
  }
  if (overlayTitle && definition) overlayTitle.textContent = definition.name;
  if (overlayKicker) {
    overlayKicker.textContent = model.id === "bobs-adventure"
      ? phase === "ready" ? "LEVEL 01 / 25" : phase === "won" ? "ADVENTURE COMPLETE" : phase === "over" ? "TRY AGAIN" : ""
      : phase === "ready" ? "READY TO PLAY" : phase === "won" ? "NICE RUN" : phase === "over" ? "ROUND COMPLETE" : "";
  }
  if (overlayMessage) overlayMessage.textContent = message;
  if (gameOverlay) gameOverlay.hidden = phase === "playing";
  if (startButton) startButton.innerHTML = phase === "ready" ? "<span aria-hidden='true'>▶</span> PLAY" : "<span aria-hidden='true'>↻</span> PLAY AGAIN";
  stage?.setAttribute("aria-label", "Arcade playfield. " + message + " " + status);
}

async function loadArcade() {
  if (controller) return controller;
  if (!booting) {
    booting = import("../games/arcade-scene")
      .then(({ bootArcade }) => {
        if (!stage) throw new Error("Arcade playfield is missing.");
        controller = bootArcade(stage, setState);
        controller.select(selectedGame, computerFirst);
        return controller;
      })
      .catch((error: unknown) => {
        booting = undefined;
        const message = error instanceof Error ? error.message : "The arcade could not start.";
        if (gameStatus) gameStatus.textContent = "LOAD ERROR";
        if (overlayKicker) overlayKicker.textContent = "ARCADE OFFLINE";
        if (overlayMessage) overlayMessage.textContent = message;
        if (gameOverlay) gameOverlay.hidden = false;
        throw error;
      });
  }
  return booting;
}

function selectGame(id: GameId) {
  const definition = getGameDefinition(id);
  if (!definition) return;
  selectedGame = id;
  if (arcadeStage) {
    arcadeStage.dataset.gameId = definition.id;
    arcadeStage.style.setProperty("--stage-bg", definition.palette.background);
    arcadeStage.style.setProperty("--stage-light", definition.palette.secondary);
  }
  computerFirst = false;
  for (const button of gameButtons) button.setAttribute("aria-pressed", String(button.dataset.gameSelect === id));
  if (gameTitle) gameTitle.textContent = definition.name;
  if (overlayTitle) overlayTitle.textContent = definition.name;
  if (gameDescription) gameDescription.textContent = definition.description;
  if (controlsCopy) controlsCopy.textContent = definition.controls + " · Press ENTER to start";
  if (actionLabel) {
    actionLabel.textContent = id === "bobs-adventure" ? "JUMP"
      : id === "pong" ? "SERVE"
      : id === "bertie" || id === "oxo" || id === "nimrod" ? "SELECT"
        : definition.family === "timing" ? "HIT"
          : definition.family === "jump" ? "JUMP"
            : definition.family === "shoot" || id === "crt" || id === "spacewar" || id === "computer-space" || id === "invaders" ? "FIRE"
              : definition.family === "catch" ? "CATCH" : "GO";
  }
  upControl?.setAttribute("aria-label", id === "bobs-adventure" ? "Jump" : "Move up or thrust");
  downControl?.setAttribute("aria-label", id === "bobs-adventure" ? "Drop through a platform" : "Move down");
  if (firstTurnToggle) {
    firstTurnToggle.hidden = id !== "oxo";
    firstTurnToggle.textContent = "YOU MOVE FIRST";
    firstTurnToggle.setAttribute("aria-pressed", "false");
  }
  if (gameStatus) {
    const position = String(games.findIndex((game) => game.id === id) + 1).padStart(2, "0");
    gameStatus.textContent = id === "bobs-adventure" ? "LEVEL 01 / 25" : position + " / " + games.length + " · ORIGINAL";
  }
  if (overlayKicker) overlayKicker.textContent = "ORIGINAL GAME";
  if (overlayMessage) overlayMessage.textContent = definition.description;
  if (gameOverlay) gameOverlay.hidden = false;
  if (startButton) startButton.innerHTML = "<span aria-hidden='true'>▶</span> PLAY";
  if (controller) controller.select(id);
  arcadeStage?.scrollIntoView({
    behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    block: "center",
  });
}

applyTheme(document.documentElement.dataset.theme === "dark" ? "dark" : "light");
themeToggle?.addEventListener("click", () => {
  const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("bobby-space-theme", next);
  } catch {
    // The theme still changes for this page view if storage is unavailable.
  }
});

for (const button of gameButtons) {
  button.addEventListener("click", () => {
    const id = button.dataset.gameSelect as GameId | undefined;
    if (!id) return;
    selectGame(id);
  });
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const current = gameButtons.indexOf(button);
    const next = event.key === "ArrowRight" ? (current + 1) % gameButtons.length : (current + gameButtons.length - 1) % gameButtons.length;
    const nextButton = gameButtons[next];
    const id = nextButton?.dataset.gameSelect as GameId | undefined;
    if (nextButton && id) {
      selectGame(id);
      nextButton.focus();
    }
  });
}

featuredPlayButton?.addEventListener("click", () => {
  const id = featuredPlayButton.dataset.featureGame as GameId | undefined;
  if (!id) return;
  selectGame(id);
  startButton?.click();
});

startButton?.addEventListener("click", async () => {
  startButton.disabled = true;
  if (gameStatus) gameStatus.textContent = "LOADING";
  try {
    const arcade = await loadArcade();
    arcade.select(selectedGame, computerFirst);
    arcade.start();
    stage?.focus({ preventScroll: true });
  } catch {
    return;
  } finally {
    if (startButton) startButton.disabled = false;
  }
});

firstTurnToggle?.addEventListener("click", () => {
  computerFirst = !computerFirst;
  firstTurnToggle.textContent = computerFirst ? "MACHINE MOVES FIRST" : "YOU MOVE FIRST";
  firstTurnToggle.setAttribute("aria-pressed", String(computerFirst));
  controller?.setComputerFirst(computerFirst);
});

window.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" || event.repeat) return;
  const active = document.activeElement;
  if (!(active instanceof HTMLElement) || active.id !== "arcade-canvas") return;
  event.preventDefault();
  if (gameOverlay?.hidden || !controller) return;
  if (overlayKicker?.textContent === "READY TO PLAY" || overlayKicker?.textContent === "ORIGINAL GAME") controller.start();
  else controller.restart();
  event.stopImmediatePropagation();
});
