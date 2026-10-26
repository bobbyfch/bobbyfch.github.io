export type GameId =
  | "crt"
  | "bertie"
  | "nimrod"
  | "oxo"
  | "tennis"
  | "spacewar"
  | "computer-space"
  | "pong"
  | "invaders";

export interface GameDefinition {
  id: GameId;
  name: string;
  year: string;
  shortName: string;
  kind: string;
  description: string;
  controls: string;
  source: string;
  sourceUrl: string;
}

export const games: GameDefinition[] = [
  {
    id: "crt",
    name: "CRT Amusement Device",
    year: "1947",
    shortName: "CRT",
    kind: "AIM & FIRE",
    description: "A modern target-game reimagining of the 1947 cathode-ray amusement-device patent. The original was a design concept, not a released arcade game.",
    controls: "Move the sight with arrows or pointer, then fire.",
    source: "1947 patent",
    sourceUrl: "https://patents.google.com/patent/US2455992A/en",
  },
  {
    id: "bertie",
    name: "Bertie the Brain",
    year: "1950",
    shortName: "BERTIE",
    kind: "TIC-TAC-TOE",
    description: "Take on the electronic brain in a quick round of noughts and crosses.",
    controls: "Move across the grid and choose a square.",
    source: "Leaside Heritage Preservation Society",
    sourceUrl: "https://leasidelife.com/worlds-first-video-game-built-in-leaside/",
  },
  {
    id: "nimrod",
    name: "Nimrod",
    year: "1951",
    shortName: "NIM",
    kind: "TAKE-AWAY",
    description: "A nim strategy match inspired by the computer built to demonstrate Nim at the 1951 Festival of Britain.",
    controls: "Choose a pile and how many counters to take.",
    source: "Computer History Museum",
    sourceUrl: "https://www.computerhistory.org/timeline/graphics-games/",
  },
  {
    id: "oxo",
    name: "OXO",
    year: "1952",
    shortName: "OXO",
    kind: "TIC-TAC-TOE",
    description: "Play noughts and crosses against the EDSAC-inspired computer. Choose who takes the first turn.",
    controls: "Move across the grid and choose a square.",
    source: "Computer History Museum",
    sourceUrl: "https://www.computerhistory.org/timeline/graphics-games/",
  },
  {
    id: "tennis",
    name: "Tennis for Two",
    year: "1958",
    shortName: "TENNIS",
    kind: "RALLY",
    description: "A compact browser reimagining of the oscilloscope tennis exhibit shown at Brookhaven in 1958.",
    controls: "Aim with left and right, then hit when the ball returns.",
    source: "Brookhaven National Laboratory",
    sourceUrl: "https://www.bnl.gov/about/history/firstvideo.php",
  },
  {
    id: "spacewar",
    name: "Spacewar!",
    year: "1962",
    shortName: "SPACEWAR",
    kind: "SPACE DUEL",
    description: "Pilot a tiny ship in a one-player duel inspired by the two-ship PDP-1 game from MIT.",
    controls: "Left/right to turn, up to thrust, action to fire.",
    source: "Computer History Museum",
    sourceUrl: "https://www.computerhistory.org/pdp-1/spacewar/",
  },
  {
    id: "computer-space",
    name: "Computer Space",
    year: "1971",
    shortName: "COMPUTER SPACE",
    kind: "ASTEROID RUN",
    description: "A solo arcade-flight reimagining of the first commercial arcade video game, released by Nutting Associates in 1971.",
    controls: "Turn, thrust and fire to clear a safe path.",
    source: "Australian Centre for the Moving Image",
    sourceUrl: "https://www.acmi.net.au/works/118095--computer-space/",
  },
  {
    id: "pong",
    name: "Pong",
    year: "1972",
    shortName: "PONG",
    kind: "TABLE TENNIS",
    description: "Keep the ball in play and get it past the opposing paddle.",
    controls: "Move your paddle up and down.",
    source: "Smithsonian National Museum of American History",
    sourceUrl: "https://www.si.edu/spotlight/the-father-of-the-video-game-the-ralph-baer-prototypes-and-electronic-games/video-game-history",
  },
  {
    id: "invaders",
    name: "Space Invaders",
    year: "1978",
    shortName: "INVADERS",
    kind: "FIXED SHOOTER",
    description: "Hold the line against the descending formation in this monochrome arcade tribute.",
    controls: "Move left/right and fire.",
    source: "Taito Corporation",
    sourceUrl: "https://taito.co.jp/en/corporate/about/history",
  },
];
