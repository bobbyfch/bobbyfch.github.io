import { games, type GameId } from "../games/catalog";
import type { ArcadeController } from "../games/arcade-scene";

const themeToggle = document.querySelector<HTMLButtonElement>("#theme-toggle");
const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
const viewButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-view]"));
const panels = Array.from(document.querySelectorAll<HTMLElement>("[role='tabpanel']"));
const gameButtons = Array.from(document.querySelectorAll<HTMLButtonElement>("[data-game-select]"));
const gameTitle = document.querySelector<HTMLElement>("#selected-game-name");
const gameDescription = document.querySelector<HTMLElement>("#game-description");
const gameSource = document.querySelector<HTMLAnchorElement>("#game-source");
const gameStatus = document.querySelector<HTMLOutputElement>("#arcade-status");
const gamePicker = document.querySelector<HTMLElement>("#game-picker");
const previousGameButton = document.querySelector<HTMLButtonElement>("#game-picker-prev");
const nextGameButton = document.querySelector<HTMLButtonElement>("#game-picker-next");
const gameOverlay = document.querySelector<HTMLElement>("#game-overlay");
const overlayKicker = document.querySelector<HTMLElement>("#overlay-kicker");
const overlayMessage = document.querySelector<HTMLElement>("#overlay-message");
const startButton = document.querySelector<HTMLButtonElement>("#game-start");
const stage = document.querySelector<HTMLElement>("#arcade-canvas");
const controlsCopy = document.querySelector<HTMLElement>("#controls-copy");
const firstTurnToggle = document.querySelector<HTMLButtonElement>("#first-turn-toggle");
const actionLabel = document.querySelector<HTMLElement>("#action-label");

let controller: ArcadeController | undefined;
let booting: Promise<ArcadeController> | undefined;
let selectedGame: GameId = games[0]?.id ?? "invaders";
let computerFirst = false;

function applyTheme(theme: "light" | "dark") {
  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute("aria-pressed", String(theme === "dark"));
  themeToggle?.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
  if (themeColor) themeColor.content = theme === "dark" ? "#111111" : "#f7f7f5";
}

function setView(view: string) {
  for (const button of viewButtons) {
    const active = button.dataset.view === view;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-selected", String(active));
    button.tabIndex = active ? 0 : -1;
  }
  for (const panel of panels) panel.classList.toggle("is-active", panel.id === "panel-" + view);
}

function setState(phase: string, message: string, status: string) {
  if (gameStatus) gameStatus.textContent = phase === "playing" ? status : phase.toUpperCase();
  if (overlayKicker) {
    overlayKicker.textContent = phase === "ready" ? "READY PLAYER" : phase === "won" ? "WELL PLAYED" : phase === "over" ? "GAME OVER" : "";
  }
  if (overlayMessage) overlayMessage.textContent = message;
  if (gameOverlay) gameOverlay.hidden = phase === "playing";
  if (startButton) startButton.innerHTML = phase === "ready" ? "<span aria-hidden='true'>▶</span> START GAME" : "<span aria-hidden='true'>↻</span> PLAY AGAIN";
  stage?.setAttribute("aria-label", "Arcade playfield. " + message + " " + status);
}

async function loadArcade() {
  if (controller) return controller;
  if (!booting) {
    booting = import("../games/arcade-scene")
      .then(({ bootArcade }) => {
        if (!stage) throw new Error("Arcade playfield is missing.");
        controller = bootArcade(stage, (model, status) => setState(model.phase, model.message, status));
        controller.select(selectedGame);
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
  const definition = games.find((game) => game.id === id);
  if (!definition) return;
  selectedGame = id;
  computerFirst = false;
  for (const button of gameButtons) button.setAttribute("aria-pressed", String(button.dataset.gameSelect === id));
  const selectedButton = gameButtons.find((button) => button.dataset.gameSelect === id);
  if (selectedButton && gamePicker) {
    const target = selectedButton.offsetLeft + selectedButton.offsetWidth / 2 - gamePicker.clientWidth / 2;
    gamePicker.scrollTo({ left: target, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  if (gameTitle) gameTitle.textContent = definition.shortName;
  if (gameDescription) gameDescription.textContent = definition.description;
  if (gameSource) {
    gameSource.href = definition.sourceUrl;
    gameSource.setAttribute("aria-label", "Read historical background from " + definition.source);
    gameSource.hidden = !definition.sourceUrl;
  }
  if (controlsCopy) controlsCopy.textContent = definition.controls + " · Press ENTER to start";
  if (actionLabel) {
    actionLabel.textContent = id === "pong" ? "SERVE"
      : id === "bertie" || id === "oxo" || id === "nimrod" ? "SELECT"
        : definition.family === "timing" ? "HIT"
          : definition.family === "jump" ? "JUMP"
            : definition.family === "shoot" || id === "crt" || id === "spacewar" || id === "computer-space" || id === "invaders" ? "FIRE"
              : definition.family === "catch" ? "CATCH" : "GO";
  }
  if (firstTurnToggle) {
    firstTurnToggle.hidden = id !== "oxo";
    firstTurnToggle.textContent = "YOU MOVE FIRST";
    firstTurnToggle.setAttribute("aria-pressed", "false");
  }
  if (gameStatus) {
    const position = String(games.indexOf(definition) + 1).padStart(2, "0");
    gameStatus.textContent = definition.letter + " · " + position + "/" + games.length + (definition.year === "ORIGINAL" ? " · POCKET" : " · " + definition.year);
  }
  if (overlayKicker) overlayKicker.textContent = "A LITTLE ARCADE HISTORY";
  if (overlayMessage) overlayMessage.textContent = definition.description;
  if (gameOverlay) gameOverlay.hidden = false;
  if (startButton) startButton.innerHTML = "<span aria-hidden='true'>▶</span> START GAME";
  if (controller) controller.select(id);
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

for (const button of viewButtons) {
  button.addEventListener("click", () => setView(button.dataset.view ?? "orbit"));
  button.addEventListener("keydown", (event) => {
    if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
    event.preventDefault();
    const current = viewButtons.indexOf(button);
    const next = event.key === "ArrowRight" ? (current + 1) % viewButtons.length : (current + viewButtons.length - 1) % viewButtons.length;
    const nextButton = viewButtons[next];
    if (nextButton) {
      setView(nextButton.dataset.view ?? "orbit");
      nextButton.focus();
    }
  });
}

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

function selectAdjacentGame(direction: -1 | 1) {
  const current = games.findIndex((game) => game.id === selectedGame);
  const next = games[(current + direction + games.length) % games.length];
  if (next) selectGame(next.id);
}

previousGameButton?.addEventListener("click", () => selectAdjacentGame(-1));
nextGameButton?.addEventListener("click", () => selectAdjacentGame(1));

startButton?.addEventListener("click", async () => {
  startButton.disabled = true;
  if (gameStatus) gameStatus.textContent = "LOADING";
  try {
    const arcade = await loadArcade();
    arcade.select(selectedGame);
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
  if (overlayKicker?.textContent === "READY PLAYER" || overlayKicker?.textContent === "A LITTLE ARCADE HISTORY") controller.start();
  else controller.restart();
});
