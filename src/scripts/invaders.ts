type GamePhase = "ready" | "playing" | "gameover" | "won";
type BulletOwner = "player" | "invader";
type ControlName = "left" | "right" | "fire";

interface Invader {
  x: number;
  y: number;
  row: number;
  alive: boolean;
}

interface Bullet {
  x: number;
  y: number;
  velocity: number;
  owner: BulletOwner;
}

interface Bunker {
  x: number;
  hits: number;
}

const canvas = document.querySelector<HTMLCanvasElement>("#arcade-canvas");
const startButton = document.querySelector<HTMLButtonElement>("#game-start");
const scoreOutput = document.querySelector<HTMLOutputElement>("#score");
const bestOutput = document.querySelector<HTMLOutputElement>("#best-score");
const livesOutput = document.querySelector<HTMLOutputElement>("#lives");
const statusOutput = document.querySelector<HTMLElement>("#game-status");

if (canvas && startButton && scoreOutput && bestOutput && livesOutput && statusOutput) {
  const context = canvas.getContext("2d", { alpha: false });

  if (context) {
    const width = canvas.width;
    const height = canvas.height;
    const spriteWidth = 16;
    const spriteHeight = 12;
    const invaderSprites = [
      ["....##....##....", ".....##..##.....", "....########....", "..##.######.##..", "################", "##..########..##", "##..##....##..##", "....##....##...."],
      ["......##........", "....######......", "..##########....", "##..##.##.##..##", "################", "..##..####..##..", "##..##....##..##", "....##....##...."],
      ["......##........", ".....####.......", "....######......", "..##.####.##....", "..############..", "##..##.##.##..##", "....##....##....", "..##........##.."],
    ];
    const playerSprite = ["......##......", ".....####.....", "....######....", "################", "################", "###..######..###", "##....####....##"];
    const bunkerSprite = ["..############..", ".##############.", "################", "################", "#######..#######", "######....######", "#####......#####"];
    const stars = Array.from({ length: 44 }, (_, index) => ({
      x: (index * 73 + 19) % width,
      y: (index * 47 + 11) % (height - 20),
      size: index % 7 === 0 ? 2 : 1,
    }));
    const held: Record<ControlName, boolean> = { left: false, right: false, fire: false };

    let phase: GamePhase = "ready";
    let playerX = width / 2;
    let invaders: Invader[] = [];
    let bullets: Bullet[] = [];
    let bunkers: Bunker[] = [];
    let direction = 1;
    let alienStepTime = 0;
    let fireCooldown = 0;
    let enemyShotTime = 0;
    let invulnerability = 0;
    let score = 0;
    let lives = 3;
    let highScore = 0;
    let previousFrame = 0;
    let frameRequest = 0;

    try {
      const storedScore = Number(localStorage.getItem("bobby-space-best-score"));
      if (Number.isFinite(storedScore) && storedScore > 0) highScore = storedScore;
    } catch {
      // The game remains playable when local storage is unavailable.
    }

    function announce(message: string) {
      statusOutput.textContent = message;
    }

    function updateScoreboard() {
      scoreOutput.textContent = String(score).padStart(4, "0");
      bestOutput.textContent = String(highScore).padStart(4, "0");
      livesOutput.textContent = String(lives).padStart(2, "0");
    }

    function resetFormation() {
      invaders = [];
      for (let row = 0; row < 4; row += 1) {
        for (let column = 0; column < 8; column += 1) {
          invaders.push({ x: 73 + column * 22, y: 45 + row * 18, row, alive: true });
        }
      }
      direction = 1;
      alienStepTime = 0;
      enemyShotTime = 0;
    }

    function resetGame() {
      phase = "playing";
      playerX = width / 2;
      bullets = [];
      bunkers = [30, 106, 182, 258].map((x) => ({ x, hits: 0 }));
      score = 0;
      lives = 3;
      invulnerability = 0;
      fireCooldown = 0;
      previousFrame = 0;
      resetFormation();
      updateScoreboard();
      startButton.textContent = "MAIN ULANG";
      announce("Permainan dimulai. Bergerak dengan tombol panah atau A dan D, lalu tekan spasi untuk menembak.");
      canvas.focus({ preventScroll: true });
      cancelAnimationFrame(frameRequest);
      frameRequest = requestAnimationFrame(frame);
    }

    function drawSprite(sprite: string[], x: number, y: number, pixel = 2) {
      for (let row = 0; row < sprite.length; row += 1) {
        for (let column = 0; column < sprite[row].length; column += 1) {
          if (sprite[row][column] === "#") context.fillRect(Math.round(x + column * pixel), Math.round(y + row * pixel), pixel, pixel);
        }
      }
    }

    function draw() {
      const styles = getComputedStyle(document.documentElement);
      const background = styles.getPropertyValue("--screen").trim() || "#f0f0ed";
      const ink = styles.getPropertyValue("--ink").trim() || "#171717";
      const faint = styles.getPropertyValue("--line").trim() || "#d6d6d1";

      context.fillStyle = background;
      context.fillRect(0, 0, width, height);
      context.fillStyle = faint;
      for (const star of stars) context.fillRect(star.x, star.y, star.size, star.size);

      context.fillStyle = ink;
      for (const invader of invaders) {
        if (!invader.alive) continue;
        const sprite = invaderSprites[invader.row % invaderSprites.length];
        drawSprite(sprite, invader.x, invader.y, 1);
      }

      for (const bunker of bunkers) {
        if (bunker.hits < 4) drawSprite(bunkerSprite, bunker.x, 177, 1);
      }

      for (const bullet of bullets) {
        context.fillRect(Math.round(bullet.x), Math.round(bullet.y), 2, 6);
      }

      if (phase !== "gameover" && !(invulnerability > 0 && Math.floor(invulnerability / 90) % 2 === 0)) {
        drawSprite(playerSprite, playerX - 7, 204, 1);
      }

      context.fillRect(10, 222, width - 20, 1);
      context.font = "8px Courier New, monospace";
      context.textAlign = "center";

      if (phase === "ready") {
        context.fillText("READY WHEN YOU ARE", width / 2, 112);
        context.font = "6px Courier New, monospace";
        context.fillText("DEFEND YOUR LITTLE CORNER", width / 2, 125);
      } else if (phase === "gameover") {
        context.fillText("GAME OVER", width / 2, 111);
        context.font = "6px Courier New, monospace";
        context.fillText("PRESS PLAY TO TRY AGAIN", width / 2, 124);
      } else if (phase === "won") {
        context.fillText("WELL PLAYED", width / 2, 111);
        context.font = "6px Courier New, monospace";
        context.fillText("THE ORBIT IS CLEAR", width / 2, 124);
      }

      context.textAlign = "left";
    }

    function finishGame(nextPhase: "gameover" | "won") {
      phase = nextPhase;
      held.left = false;
      held.right = false;
      held.fire = false;
      startButton.textContent = "MAIN LAGI";
      announce(nextPhase === "won" ? `Kamu menang dengan skor ${score}.` : `Permainan selesai dengan skor ${score}. Tekan Main Lagi untuk mencoba kembali.`);
      draw();
    }

    function damagePlayer() {
      if (invulnerability > 0 || phase !== "playing") return;
      lives -= 1;
      invulnerability = 900;
      updateScoreboard();
      if (lives <= 0) finishGame("gameover");
    }

    function update(delta: number) {
      const seconds = delta / 1000;
      if (held.left) playerX -= 138 * seconds;
      if (held.right) playerX += 138 * seconds;
      playerX = Math.max(13, Math.min(width - 13, playerX));

      fireCooldown -= delta;
      if (held.fire && fireCooldown <= 0) {
        bullets.push({ x: playerX - 1, y: 198, velocity: -210, owner: "player" });
        fireCooldown = 310;
      }

      const remaining = invaders.filter((invader) => invader.alive);
      const step = Math.max(105, 520 - (32 - remaining.length) * 12);
      alienStepTime += delta;
      if (alienStepTime >= step) {
        alienStepTime = 0;
        const leftEdge = Math.min(...remaining.map((invader) => invader.x));
        const rightEdge = Math.max(...remaining.map((invader) => invader.x + spriteWidth));
        if (rightEdge > width - 13 || leftEdge < 13) {
          direction *= -1;
          for (const invader of remaining) invader.y += 8;
        } else {
          for (const invader of remaining) invader.x += direction * 5;
        }
        if (remaining.some((invader) => invader.y + spriteHeight >= 188)) finishGame("gameover");
      }

      enemyShotTime += delta;
      if (enemyShotTime > 980 && remaining.length > 0) {
        const shooter = remaining[Math.floor(Math.random() * remaining.length)];
        if (shooter) bullets.push({ x: shooter.x + spriteWidth / 2, y: shooter.y + spriteHeight, velocity: 105, owner: "invader" });
        enemyShotTime = 0;
      }

      if (invulnerability > 0) invulnerability -= delta;
      for (const bullet of bullets) bullet.y += bullet.velocity * seconds;

      bullets = bullets.filter((bullet) => {
        if (bullet.y < 2 || bullet.y > height) return false;

        const bunker = bunkers.find((item) => item.hits < 4 && bullet.x >= item.x && bullet.x <= item.x + 16 && bullet.y >= 177 && bullet.y <= 184);
        if (bunker) {
          bunker.hits += 1;
          return false;
        }

        if (bullet.owner === "player") {
          const target = invaders.find((invader) => invader.alive && bullet.x >= invader.x - 1 && bullet.x <= invader.x + spriteWidth + 1 && bullet.y >= invader.y - 2 && bullet.y <= invader.y + spriteHeight + 2);
          if (target) {
            target.alive = false;
            score += (4 - target.row) * 10;
            if (score > highScore) {
              highScore = score;
              try {
                localStorage.setItem("bobby-space-best-score", String(highScore));
              } catch {
                // Keep the current score even when it cannot be stored.
              }
            }
            updateScoreboard();
            if (!invaders.some((invader) => invader.alive)) finishGame("won");
            return false;
          }
        } else if (Math.abs(bullet.x - playerX) < 10 && bullet.y >= 199 && bullet.y <= 213) {
          damagePlayer();
          return false;
        }

        return true;
      });
    }

    function frame(now: number) {
      if (phase !== "playing") return;
      const delta = previousFrame === 0 ? 16 : Math.min(now - previousFrame, 40);
      previousFrame = now;
      update(delta);
      draw();
      if (phase === "playing") frameRequest = requestAnimationFrame(frame);
    }

    function setControl(control: ControlName, pressed: boolean) {
      held[control] = pressed;
    }

    startButton.addEventListener("click", resetGame);
    canvas.addEventListener("click", () => canvas.focus({ preventScroll: true }));

    window.addEventListener("keydown", (event) => {
      if (phase !== "playing") return;
      const key = event.key.toLowerCase();
      const target = event.target;
      if (target instanceof HTMLElement && target.closest("a, button, input, textarea, select, [contenteditable='true']")) return;

      if (["arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
      if (key === "arrowleft" || key === "a") setControl("left", true);
      if (key === "arrowright" || key === "d") setControl("right", true);
      if (key === " ") setControl("fire", true);
    });

    window.addEventListener("keyup", (event) => {
      const key = event.key.toLowerCase();
      if (key === "arrowleft" || key === "a") setControl("left", false);
      if (key === "arrowright" || key === "d") setControl("right", false);
      if (key === " ") setControl("fire", false);
    });

    window.addEventListener("blur", () => {
      held.left = false;
      held.right = false;
      held.fire = false;
    });

    document.querySelectorAll<HTMLButtonElement>("[data-control]").forEach((button) => {
      const control = button.dataset.control as ControlName | undefined;
      if (!control) return;
      button.addEventListener("pointerdown", (event) => {
        event.preventDefault();
        button.setPointerCapture(event.pointerId);
        setControl(control, true);
      });
      const release = () => setControl(control, false);
      button.addEventListener("pointerup", release);
      button.addEventListener("pointercancel", release);
      button.addEventListener("lostpointercapture", release);
    });

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        held.left = false;
        held.right = false;
        held.fire = false;
      }
    });

    new MutationObserver(draw).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    updateScoreboard();
    draw();
  }
}
