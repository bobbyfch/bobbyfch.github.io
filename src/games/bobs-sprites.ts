export type BobPose = "idle" | "runA" | "runB" | "jump" | "hurt";

export const BOB_SPRITE_WIDTH = 18;
export const BOB_SPRITE_PIXEL = 2;

export const bobSpritePalette: Record<string, number> = {
  o: 0x26344a,
  R: 0xd54846,
  r: 0xff9472,
  H: 0x563b3a,
  S: 0xf2c293,
  E: 0x302c39,
  W: 0xfff3d5,
  T: 0x46aa9c,
  t: 0x28736f,
  Y: 0xf3c653,
  y: 0xc9873f,
  B: 0x45649a,
  D: 0x393848,
  P: 0xe99477,
};

const idle = [
  "........rr........",
  ".......rRRRR......",
  "......RRRRRRRR....",
  ".....oRRRRRRRRRo..",
  "...oHHHHHHHHHHHo..",
  "..oHSSSSSSSSSSSHo.",
  "..oSSWSESSSSSSSHo.",
  "...oSSSSSSSSPSSHo.",
  "....oHHHHHHHHHo...",
  ".....oRRRRRo......",
  "....oTTTTTTTo.....",
  "...oTTtTTTTTTo....",
  "...oTTYYYYTTTo....",
  "....oTYYyYYTTo....",
  "....oBBBBBBBo.....",
  "...oBB..BBBBo.....",
  "..oDDD....DDDo....",
  "..DDD......DDD....",
];

function pose(changes: Record<number, string>): string[] {
  return idle.map((row, index) => changes[index] ?? row);
}

export const bobSprites: Record<BobPose, string[]> = {
  idle,
  runA: pose({
    9: "....oRRRRRo......",
    10: "...oTTTTTTTo.....",
    11: "..oTTtTTTTTTo....",
    14: "....oBBBBBBBo.....",
    15: "...oBBB..BBBo.....",
    16: "..oDDDD....DDDo...",
    17: "..DDDD......DDD...",
  }),
  runB: pose({
    9: "......oRRRRRo....",
    10: "....oTTTTTTTo....",
    11: "...oTTtTTTTTTo...",
    14: "....oBBBBBBBo.....",
    15: "....oBB..BBBBo....",
    16: "...oDD....DDDDDo..",
    17: "...DDD......DDDD..",
  }),
  jump: [
    "........rr........",
    ".......rRRRR......",
    "......RRRRRRRR....",
    ".....oRRRRRRRRRo..",
    "...oHHHHHHHHHHHo..",
    "..oHSSSSSSSSSSSHo.",
    "..oSSWSESSSSSSSHo.",
    "...oSSSSSSSSPSSHo.",
    "....oHHHHHHHHHo...",
    "..oRRRo..oRRRRo...",
    ".oTTTTTTTTTTTTo...",
    "oTTtTTTTTTTTTTo...",
    "..oTTYYYYTTTo.....",
    "...oTYYyYYTTo.....",
    "....oBBBBBBBo.....",
    "...oBBB....BBBo...",
    "..oDDD......DDDo..",
    "..DDD........DDD..",
  ],
  hurt: pose({
    6: "..oSSWESSWSSSSSHo.",
    7: "...oSSSSSSSSPSSHo.",
    9: ".....oRRRRRo......",
    10: "....oTTTTTTTo.....",
    11: "...oTTtTTTTTTo....",
  }),
};

export const kancilSpritePalette: Record<string, number> = {
  o: 0x493c42,
  C: 0xb96f49,
  c: 0xe8a36b,
  W: 0xffdfb6,
  E: 0x332f3b,
  P: 0xd97868,
};

export const kancilSprite = [
  "....o..o....",
  "...oCc.oCc..",
  "..oCCCCCCCCo",
  ".oCCcCCCCcCCo",
  ".oCCEWCCCCECCo",
  "..oCCCCCCPCCo.",
  "...oCCCCCCCo..",
  "....oCCWCCo...",
  "...oCCWWCCo...",
  "..oCC....CCo..",
  "..oDD....DDo..",
  "...DD....DD...",
];

export const kancilSpriteWidth = 14;

export const coinSpritePalette: Record<string, number> = {
  o: 0x98612c,
  G: 0xf1bd42,
  g: 0xd98932,
  W: 0xfff2b0,
};

export const coinSprite = [
  "....oo....",
  "...oGGGo..",
  "..oGGGWWo.",
  ".oGGGWWGGo",
  ".oGGGGGGGo",
  ".oGGGgGGGo",
  ".oGGGGGGGo",
  ".oGGGgGGGo",
  ".oGGGGGGGo",
  "..oGGGWWo.",
  "...oGGGo..",
  "....oo....",
];

export const coinSpriteWidth = 10;
