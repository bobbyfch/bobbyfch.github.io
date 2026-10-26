export type PocketGameId =
  | "dot-dodge"
  | "egg-catch"
  | "frog-hop"
  | "galaxy-guard"
  | "ice-maze"
  | "jetpack"
  | "keep-up"
  | "laser-lane"
  | "meteor-miner"
  | "quick-draw"
  | "rocket-rescue"
  | "updraft"
  | "vault"
  | "word-rush"
  | "xeno-sweep"
  | "yo-yo"
  | "zigzag";

export type GameId =
  | "computer-space"
  | "bertie"
  | "crt"
  | PocketGameId
  | "invaders"
  | "nimrod"
  | "oxo"
  | "pong"
  | "spacewar"
  | "tennis";

export type PocketFamily = "dodge" | "catch" | "jump" | "shoot" | "maze" | "timing";

export interface GameDefinition {
  id: GameId;
  letter: string;
  name: string;
  year: string;
  shortName: string;
  kind: string;
  description: string;
  controls: string;
  source: string;
  sourceUrl: string;
  family?: PocketFamily;
}

export const games: GameDefinition[] = [
  {
    id: "computer-space", letter: "A", name: "Asteroid Run · Computer Space", year: "1971", shortName: "ASTEROID RUN", kind: "ASTEROID FLIGHT",
    description: "Steer through an asteroid field in a pocket-sized salute to Computer Space, the first commercial arcade video game.",
    controls: "← → turn · ↑ thrust · SPACE fire", source: "Australian Centre for the Moving Image", sourceUrl: "https://www.acmi.net.au/works/118095--computer-space/",
  },
  {
    id: "bertie", letter: "B", name: "Bertie the Brain", year: "1950", shortName: "BERTIE", kind: "TIC-TAC-TOE",
    description: "Take on the electronic brain in a quick round of noughts and crosses.",
    controls: "Arrows move · SPACE or tap to choose", source: "Leaside Heritage Preservation Society", sourceUrl: "https://leasidelife.com/worlds-first-video-game-built-in-leaside/",
  },
  {
    id: "crt", letter: "C", name: "CRT Target Range", year: "1947", shortName: "CRT RANGE", kind: "AIM & FIRE",
    description: "A modern target-game reimagining of the 1947 cathode-ray amusement-device patent. It was a design concept, not a released arcade game.",
    controls: "Move the sight · SPACE or tap to fire", source: "1947 patent", sourceUrl: "https://patents.google.com/patent/US2455992A/en",
  },
  {
    id: "dot-dodge", letter: "D", name: "Dot Dodge", year: "ORIGINAL", shortName: "DOT DODGE", kind: "DODGE",
    description: "Slip between falling pixels and stay in the game until the timer runs out.",
    controls: "← → move", source: "", sourceUrl: "", family: "dodge",
  },
  {
    id: "egg-catch", letter: "E", name: "Egg Catch", year: "ORIGINAL", shortName: "EGG CATCH", kind: "CATCH",
    description: "Catch the bright eggs, let the stones pass, and fill your basket.",
    controls: "← → move · catch 10 eggs", source: "", sourceUrl: "", family: "catch",
  },
  {
    id: "frog-hop", letter: "F", name: "Frog Hop", year: "ORIGINAL", shortName: "FROG HOP", kind: "JUMP & DODGE",
    description: "Hop over traffic, grab the fireflies, and make it across the screen.",
    controls: "← → move · ↑ or SPACE jump", source: "", sourceUrl: "", family: "jump",
  },
  {
    id: "galaxy-guard", letter: "G", name: "Galaxy Guard", year: "ORIGINAL", shortName: "GALAXY GUARD", kind: "FIXED SHOOTER",
    description: "Clear the incoming pixel fleet before it reaches your ship.",
    controls: "← → move · SPACE fire", source: "", sourceUrl: "", family: "shoot",
  },
  {
    id: "invaders", letter: "H", name: "Space Invaders", year: "1978", shortName: "INVADERS", kind: "FIXED SHOOTER",
    description: "Hold the line against the descending formation in this monochrome arcade tribute.",
    controls: "← → move · SPACE fire", source: "Taito Corporation", sourceUrl: "https://taito.co.jp/en/corporate/about/history",
  },
  {
    id: "ice-maze", letter: "I", name: "Ice Maze", year: "ORIGINAL", shortName: "ICE MAZE", kind: "MAZE RUN",
    description: "Trace the open passages, pick up the stars, and find your way through the frozen grid.",
    controls: "Arrow keys · collect 12 stars", source: "", sourceUrl: "", family: "maze",
  },
  {
    id: "jetpack", letter: "J", name: "Jetpack Dash", year: "ORIGINAL", shortName: "JETPACK DASH", kind: "HOP & DODGE",
    description: "Tap the thrusters to clear the gates and scoop up the floating stars.",
    controls: "← → move · ↑ or SPACE boost", source: "", sourceUrl: "", family: "jump",
  },
  {
    id: "keep-up", letter: "K", name: "Keep-Up Rally", year: "ORIGINAL", shortName: "KEEP-UP", kind: "CATCH",
    description: "Keep a tiny ball in the air and catch it before it falls out of reach.",
    controls: "← → move · catch 10 balls", source: "", sourceUrl: "", family: "catch",
  },
  {
    id: "laser-lane", letter: "L", name: "Laser Lane", year: "ORIGINAL", shortName: "LASER LANE", kind: "DODGE",
    description: "Read each warning line and weave through the laser gates.",
    controls: "← → move", source: "", sourceUrl: "", family: "dodge",
  },
  {
    id: "meteor-miner", letter: "M", name: "Meteor Miner", year: "ORIGINAL", shortName: "METEOR MINER", kind: "SHOOT & COLLECT",
    description: "Break the drifting rocks into stardust before your fuel runs out.",
    controls: "← → move · SPACE fire", source: "", sourceUrl: "", family: "shoot",
  },
  {
    id: "nimrod", letter: "N", name: "Nimrod", year: "1951", shortName: "NIMROD", kind: "TAKE-AWAY",
    description: "A Nim strategy match inspired by the computer built to demonstrate Nim at the 1951 Festival of Britain.",
    controls: "← → choose pile · ↑ ↓ set amount · SPACE take", source: "Computer History Museum", sourceUrl: "https://www.computerhistory.org/timeline/graphics-games/",
  },
  {
    id: "oxo", letter: "O", name: "OXO", year: "1952", shortName: "OXO", kind: "TIC-TAC-TOE",
    description: "Play noughts and crosses against the EDSAC-inspired computer. Choose who takes the first turn.",
    controls: "Arrows move · SPACE or tap to choose", source: "Computer History Museum", sourceUrl: "https://www.computerhistory.org/timeline/graphics-games/",
  },
  {
    id: "pong", letter: "P", name: "Pong", year: "1972", shortName: "PONG", kind: "TABLE TENNIS",
    description: "Keep the ball in play and get it past the opposing paddle.",
    controls: "↑ ↓ move paddle · SPACE serve", source: "Smithsonian National Museum of American History", sourceUrl: "https://www.si.edu/spotlight/the-father-of-the-video-game-the-ralph-baer-prototypes-and-electronic-games/video-game-history",
  },
  {
    id: "quick-draw", letter: "Q", name: "Quick Draw", year: "ORIGINAL", shortName: "QUICK DRAW", kind: "TIMING",
    description: "Wait for the center mark, then press at just the right moment. Three strikes and you are out.",
    controls: "SPACE when the marker enters the box", source: "", sourceUrl: "", family: "timing",
  },
  {
    id: "rocket-rescue", letter: "R", name: "Rocket Rescue", year: "ORIGINAL", shortName: "ROCKET RESCUE", kind: "DODGE & RESCUE",
    description: "Guide the rescue capsule through a meteor shower and keep the crew safe.",
    controls: "← → move", source: "", sourceUrl: "", family: "dodge",
  },
  {
    id: "spacewar", letter: "S", name: "Spacewar!", year: "1962", shortName: "SPACEWAR!", kind: "SPACE DUEL",
    description: "Pilot a tiny ship in a one-player duel inspired by the two-ship PDP-1 game from MIT.",
    controls: "← → turn · ↑ thrust · SPACE fire", source: "Computer History Museum", sourceUrl: "https://www.computerhistory.org/pdp-1/spacewar/",
  },
  {
    id: "tennis", letter: "T", name: "Tennis for Two", year: "1958", shortName: "TENNIS", kind: "RALLY",
    description: "A compact browser reimagining of the oscilloscope tennis exhibit shown at Brookhaven in 1958.",
    controls: "← → aim · SPACE hit", source: "Brookhaven National Laboratory", sourceUrl: "https://www.bnl.gov/about/history/firstvideo.php",
  },
  {
    id: "updraft", letter: "U", name: "Updraft", year: "ORIGINAL", shortName: "UPDRAFT", kind: "HOP & DODGE",
    description: "Ride the updraft, stay clear of the clouds, and gather the high-flying stars.",
    controls: "← → move · ↑ or SPACE boost", source: "", sourceUrl: "", family: "jump",
  },
  {
    id: "vault", letter: "V", name: "Vault Jump", year: "ORIGINAL", shortName: "VAULT JUMP", kind: "HOP & DODGE",
    description: "Jump each low barrier, land cleanly, and collect enough tokens to open the vault.",
    controls: "← → move · ↑ or SPACE jump", source: "", sourceUrl: "", family: "jump",
  },
  {
    id: "word-rush", letter: "W", name: "Word Rush", year: "ORIGINAL", shortName: "WORD RUSH", kind: "TIMING",
    description: "Stop the cursor on the word-sized target before the signal slips away.",
    controls: "SPACE when the marker enters the box", source: "", sourceUrl: "", family: "timing",
  },
  {
    id: "xeno-sweep", letter: "X", name: "Xeno Sweep", year: "ORIGINAL", shortName: "XENO SWEEP", kind: "SHOOTER",
    description: "Sweep the sky clear of visitors and keep their ships from getting past you.",
    controls: "← → move · SPACE fire", source: "", sourceUrl: "", family: "shoot",
  },
  {
    id: "yo-yo", letter: "Y", name: "Yo-Yo Timing", year: "ORIGINAL", shortName: "YO-YO", kind: "TIMING",
    description: "Catch the yo-yo at the bottom of its swing and keep a perfect rhythm.",
    controls: "SPACE when the marker enters the box", source: "", sourceUrl: "", family: "timing",
  },
  {
    id: "zigzag", letter: "Z", name: "Zigzag Run", year: "ORIGINAL", shortName: "ZIGZAG RUN", kind: "MAZE RUN",
    description: "Turn at the corners, follow the little trail, and collect every last pixel.",
    controls: "Arrow keys · collect 12 stars", source: "", sourceUrl: "", family: "maze",
  },
];

export const pocketGames = games.filter((game) => game.year === "ORIGINAL");
