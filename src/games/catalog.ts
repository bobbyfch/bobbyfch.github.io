export type OriginalGameId =
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
  | "bobs-adventure"
  | "computer-space"
  | "bertie"
  | "crt"
  | OriginalGameId
  | "invaders"
  | "nimrod"
  | "oxo"
  | "pong"
  | "spacewar"
  | "tennis";

export type ArcadeFamily = "dodge" | "catch" | "jump" | "shoot" | "maze" | "timing";
export type GameArt = "pilot" | "board" | "target" | "dodge" | "basket" | "runner" | "shooter" | "alien" | "maze" | "jetpack" | "catch" | "laser" | "meteor" | "nim" | "paddle" | "timing" | "rescue" | "duel" | "tennis" | "jump" | "vault" | "wind" | "xeno" | "yoyo" | "trail";

export interface GameDefinition {
  id: GameId;
  letter: string;
  name: string;
  shortName: string;
  kind: string;
  description: string;
  controls: string;
  art: GameArt;
  palette: { background: string; primary: string; secondary: string; accent: string };
  family?: ArcadeFamily;
}

export const games: GameDefinition[] = [
  {
    id: "computer-space", letter: "A", name: "Astro Dash", shortName: "ASTRO DASH", kind: "STARFIELD FLIGHT", art: "pilot", palette: { background: "#17324a", primary: "#ffe8a6", secondary: "#5bc5c6", accent: "#f06b5d" },
    description: "Thread a nimble starship through comet shards, then clear a path through the sky.",
    controls: "← → turn · ↑ thrust · SPACE fire",
  },
  {
    id: "bertie", letter: "B", name: "Botany Brawl", shortName: "BOTANY BRAWL", kind: "GARDEN STRATEGY", art: "board", palette: { background: "#354039", primary: "#f8e5a1", secondary: "#86c66f", accent: "#ed7580" },
    description: "Outplant the garden bot in a quick three-in-a-row duel.",
    controls: "Arrows move · SPACE or tap to plant",
  },
  {
    id: "crt", letter: "C", name: "Cloud Cannon", shortName: "CLOUD CANNON", kind: "TARGET SHOT", art: "target", palette: { background: "#24435c", primary: "#fff0bf", secondary: "#6dcae3", accent: "#f28b64" },
    description: "Line up the sight and pop the drifting cloud targets before they float away.",
    controls: "Move the sight · SPACE or tap to fire",
  },
  {
    id: "dot-dodge", letter: "D", name: "Dandelion Drift", shortName: "DANDELION DRIFT", kind: "DODGE", art: "dodge", palette: { background: "#4b3441", primary: "#fff0bd", secondary: "#e9a75f", accent: "#ef7180" },
    description: "Swerve between windblown seeds and stay aloft until the breeze settles.",
    controls: "← → move", family: "dodge",
  },
  {
    id: "egg-catch", letter: "E", name: "Eggventure", shortName: "EGGVENTURE", kind: "CATCH", art: "basket", palette: { background: "#344454", primary: "#fff0bc", secondary: "#70cbb5", accent: "#efaa59" },
    description: "Gather the painted eggs, dodge the pebbles, and fill your basket.",
    controls: "← → move · catch 10 eggs", family: "catch",
  },
  {
    id: "frog-hop", letter: "F", name: "Foxfire Hop", shortName: "FOXFIRE HOP", kind: "JUMP & DODGE", art: "runner", palette: { background: "#244a3c", primary: "#ffefb3", secondary: "#80c95d", accent: "#f6a34d" },
    description: "Hop over forest paths, catch fireflies, and reach the other side.",
    controls: "← → move · ↑ or SPACE jump", family: "jump",
  },
  {
    id: "galaxy-guard", letter: "G", name: "Glimmer Guard", shortName: "GLIMMER GUARD", kind: "STAR SHOOTER", art: "shooter", palette: { background: "#243355", primary: "#fff0be", secondary: "#a591eb", accent: "#69cfe3" },
    description: "Keep the night sky bright by turning back a mischievous star fleet.",
    controls: "← → move · SPACE fire", family: "shoot",
  },
  {
    id: "invaders", letter: "H", name: "Hollow Star", shortName: "HOLLOW STAR", kind: "FOREST DEFENSE", art: "alien", palette: { background: "#244446", primary: "#fff0b9", secondary: "#75cc95", accent: "#ef786e" },
    description: "Defend the moon garden from a descending swarm of curious sprites.",
    controls: "← → move · SPACE fire",
  },
  {
    id: "ice-maze", letter: "I", name: "Icebound Trail", shortName: "ICEBOUND TRAIL", kind: "MAZE RUN", art: "maze", palette: { background: "#2b465c", primary: "#fff2c4", secondary: "#6dc9dd", accent: "#a894e8" },
    description: "Follow the frosted passages, collect the crystals, and find the way home.",
    controls: "Arrow keys · collect 12 crystals", family: "maze",
  },
  {
    id: "jetpack", letter: "J", name: "Jade Jumper", shortName: "JADE JUMPER", kind: "JETPACK RUN", art: "jetpack", palette: { background: "#4b3341", primary: "#fff1c4", secondary: "#ed806f", accent: "#e8c35f" },
    description: "Burst through jungle gates and scoop up the floating jade stars.",
    controls: "← → move · ↑ or SPACE boost", family: "jump",
  },
  {
    id: "keep-up", letter: "K", name: "Kite Keeper", shortName: "KITE KEEPER", kind: "CATCH & KEEP", art: "catch", palette: { background: "#353752", primary: "#fff0c0", secondary: "#b198e6", accent: "#eac75d" },
    description: "Keep your kite in the air and catch each gust before it slips away.",
    controls: "← → move · catch 10 gusts", family: "catch",
  },
  {
    id: "laser-lane", letter: "L", name: "Lantern Run", shortName: "LANTERN RUN", kind: "DODGE", art: "laser", palette: { background: "#44364c", primary: "#fff0c6", secondary: "#e27fb2", accent: "#73cde0" },
    description: "Read the glowing gates and guide your lantern safely through the grove.",
    controls: "← → move", family: "dodge",
  },
  {
    id: "meteor-miner", letter: "M", name: "Meteor Munch", shortName: "METEOR MUNCH", kind: "SHOOT & COLLECT", art: "meteor", palette: { background: "#4a3931", primary: "#fff0c1", secondary: "#efac61", accent: "#ed705f" },
    description: "Break the wandering meteors into bright stardust before time runs out.",
    controls: "← → move · SPACE fire", family: "shoot",
  },
  {
    id: "nimrod", letter: "N", name: "Nimble Grove", shortName: "NIMBLE GROVE", kind: "TAKE-AWAY STRATEGY", art: "nim", palette: { background: "#29483d", primary: "#fff0bc", secondary: "#72c6a4", accent: "#eebd5b" },
    description: "Take turns gathering branches from the grove. Plan ahead to take the last one.",
    controls: "← → choose pile · ↑ ↓ set amount · SPACE take",
  },
  {
    id: "oxo", letter: "O", name: "Orchard Orbit", shortName: "ORCHARD ORBIT", kind: "GARDEN STRATEGY", art: "board", palette: { background: "#34445a", primary: "#fff1bd", secondary: "#83aee8", accent: "#e98088" },
    description: "Set a course through the orchard and beat the clever little keeper.",
    controls: "Arrows move · SPACE or tap to choose",
  },
  {
    id: "pong", letter: "P", name: "Pogo Paddle", shortName: "POGO PADDLE", kind: "PADDLE RALLY", art: "paddle", palette: { background: "#254c49", primary: "#fff1c0", secondary: "#65cbb4", accent: "#f1c560" },
    description: "Trade quick returns across the pond and send the ball past the other paddle.",
    controls: "↑ ↓ move paddle · SPACE serve",
  },
  {
    id: "quick-draw", letter: "Q", name: "Quickstep Quokka", shortName: "QUICKSTEP QUOKKA", kind: "TIMING", art: "timing", palette: { background: "#4d392f", primary: "#fff0bd", secondary: "#eab95b", accent: "#ed7663" },
    description: "Wait for the signal, then tap in time with the quickstep beat.",
    controls: "SPACE when the marker enters the target", family: "timing",
  },
  {
    id: "rocket-rescue", letter: "R", name: "Reef Runner", shortName: "REEF RUNNER", kind: "DODGE & RESCUE", art: "rescue", palette: { background: "#284754", primary: "#fff2c5", secondary: "#67c7dc", accent: "#ef846e" },
    description: "Guide a tiny sub through falling coral and bring the crew back safely.",
    controls: "← → move", family: "dodge",
  },
  {
    id: "spacewar", letter: "S", name: "Stardust Skirmish", shortName: "STARDUST SKIRMISH", kind: "STARSHIP DUEL", art: "duel", palette: { background: "#2b3154", primary: "#fff0c5", secondary: "#9d98e3", accent: "#ec8e9b" },
    description: "Pilot, turn, and boost through a one-on-one starship duel.",
    controls: "← → turn · ↑ thrust · SPACE fire",
  },
  {
    id: "tennis", letter: "T", name: "Treetop Rally", shortName: "TREETOP RALLY", kind: "RACKET RALLY", art: "tennis", palette: { background: "#443451", primary: "#fff0ca", secondary: "#e99bd0", accent: "#70cfdd" },
    description: "Pick your angle and keep the treetop rally moving.",
    controls: "← → aim · SPACE hit",
  },
  {
    id: "updraft", letter: "U", name: "Updraft", shortName: "UPDRAFT", kind: "HOP & DODGE", art: "wind", palette: { background: "#2b4a5c", primary: "#fff2c3", secondary: "#70c2de", accent: "#f1d167" },
    description: "Ride the warm air, dodge the clouds, and collect the high-flying stars.",
    controls: "← → move · ↑ or SPACE boost", family: "jump",
  },
  {
    id: "vault", letter: "V", name: "Velvet Vault", shortName: "VELVET VAULT", kind: "JUMP & COLLECT", art: "vault", palette: { background: "#4b3d2f", primary: "#fff2c2", secondary: "#e6bd61", accent: "#df7c6b" },
    description: "Leap each barrier, gather the tokens, and open the old garden vault.",
    controls: "← → move · ↑ or SPACE jump", family: "jump",
  },
  {
    id: "word-rush", letter: "W", name: "Wildwood Whistle", shortName: "WILDWOOD WHISTLE", kind: "TIMING", art: "timing", palette: { background: "#354654", primary: "#fff0c4", secondary: "#8cb6df", accent: "#e784b5" },
    description: "Stop the whistle on its mark and wake the sleepy woodland.",
    controls: "SPACE when the marker enters the target", family: "timing",
  },
  {
    id: "xeno-sweep", letter: "X", name: "Xeno Bloom", shortName: "XENO BLOOM", kind: "GARDEN SHOOTER", art: "xeno", palette: { background: "#393454", primary: "#fff0c5", secondary: "#bd8fde", accent: "#67d2bd" },
    description: "Sweep the sky clear of seed ships before they reach the flower beds.",
    controls: "← → move · SPACE fire", family: "shoot",
  },
  {
    id: "yo-yo", letter: "Y", name: "Yeti Yo-Yo", shortName: "YETI YO-YO", kind: "RHYTHM TIMING", art: "yoyo", palette: { background: "#433750", primary: "#fff1c9", secondary: "#e0a5d7", accent: "#6dcfc3" },
    description: "Catch the yo-yo at the bottom of its swing and keep a mountain rhythm.",
    controls: "SPACE when the marker enters the target", family: "timing",
  },
  {
    id: "zigzag", letter: "Z", name: "Zephyr Zigzag", shortName: "ZEPHYR ZIGZAG", kind: "MAZE RUN", art: "trail", palette: { background: "#343b55", primary: "#fff0c5", secondary: "#a7a0df", accent: "#efb170" },
    description: "Wind through the switchback trail and gather every last firefly.",
    controls: "Arrow keys · collect 12 fireflies", family: "maze",
  },
];

export const featuredAdventure: GameDefinition = {
  id: "bobs-adventure",
  letter: "★",
  name: "Bob’s Adventure",
  shortName: "BOB’S ADVENTURE",
  kind: "25-LEVEL PLATFORMER",
  description: "Cross 25 levels inspired by Indonesia’s rice terraces, volcanoes, islands, rainforests, and highlands. Run, jump, collect coins, and find the exit.",
  controls: "← → move · ↑ or SPACE jump · ↓ drop through",
  art: "runner",
  palette: { background: "#56bfdc", primary: "#fff0c5", secondary: "#63bd65", accent: "#f57546" },
  family: "jump",
};

export function getGameDefinition(id: GameId) {
  return id === "bobs-adventure" ? featuredAdventure : games.find((game) => game.id === id);
}
