import type { GameArt, GameDefinition } from "./catalog";
import { BOB_SPRITE_WIDTH, bobSpritePalette, bobSprites } from "./bobs-sprites";

type World = "space" | "grove" | "sky" | "water" | "maze";

const sprites: Record<GameArt, string[]> = {
  pilot: ["...@....", "..##@#..", ".#######", "########", ".##.##..", "..#..#..", ".@....@."],
  board: ["#..#..#.", "#..#..#.", "########", "#..#..#.", "#..#..#.", "########", "#..#..#.", "#..#..#."],
  target: ["..@@@@..", ".@####@.", "@##++##@", "@#+@+##@", "@##++##@", ".@####@.", "..@@@@.."],
  dodge: [".@....@.", "..#..#..", "...##...", ".######.", "..#..#..", ".##..##.", "@......@"],
  basket: ["...@@...", "..@##@..", "..####..", "...##...", ".#....#.", ".######.", "..####.."],
  runner: ["..@@....", ".####...", "..##.##..", "..######.", "...##....", "..#..#..", ".##..##."],
  shooter: [".@....@.", "..#..#..", ".######.", "...##...", "..####..", ".######.", "########"],
  alien: ["..##..##..", ".########.", "##.####.##", "##########", "##..##..##", "..##..##.."],
  maze: ["##########", "#..#.....#", "#..#.###.#", "#....#...#", "###..#.#.#", "#.....#..#", "##########"],
  jetpack: ["...##....", "..####...", "...##+...", "..######.", ".##.##.##", "...##....", "..@..@..."],
  catch: ["...##...", "..####..", "...##...", ".#....#.", "..####..", "..#..#..", "###..###"],
  laser: ["##########", "..........", "..####....", "..........", "....######", "..........", "##########"],
  meteor: ["...####...", ".########.", "##.####.##", "##########", "..######..", "...####...", "....##...."],
  nim: [".#..#..#.", ".#..#..#.", ".#..#..#.", "##########", "#..#..#..#", "#..#..#..#", "#..#..#..#"],
  paddle: ["##......##", "##......##", "##..@@..##", "##......##", "##......##", "##......##"],
  timing: ["##########", "##......##", "##..@@..##", "##...+..##", "##......##", "##########"],
  rescue: ["....##....", "..######..", ".##.##.##.", "##########", "..######..", "...####...", "....##...."],
  duel: ["#..#....@..@", "##..#..@..##", ".######.###.", "..##....##..", ".###.##.###.", "@..#....#..#"],
  tennis: ["##........##", "##...@@...##", "##........##", "..########..", "...######...", "..##....##.."],
  jump: ["....##....", "...####...", "..######..", "....##....", "...#..#...", "..##..##..", "##......##"],
  vault: ["..########..", ".##......##.", "##..@@@@..##", "##..####..##", "##........##", "############"],
  wind: ["....##....", "..######..", ".##....##.", "..##..##..", "....##....", "..######..", ".##....##."],
  xeno: ["...##...", "..####..", ".##++##.", "########", "..####..", ".##..##.", "##....##"],
  yoyo: ["....##....", "....##....", "....##....", "....##....", "...####...", "..######..", "...####..."],
  trail: ["##........", ".##.......", "..##..@@..", "...##.##..", "....###...", ".....##...", "......##.."],
};

const worlds: Record<GameArt, World> = {
  pilot: "space", board: "grove", target: "sky", dodge: "grove", basket: "grove",
  runner: "grove", shooter: "space", alien: "space", maze: "maze", jetpack: "sky",
  catch: "sky", laser: "maze", meteor: "space", nim: "grove", paddle: "water",
  timing: "sky", rescue: "water", duel: "space", tennis: "grove", jump: "grove",
  vault: "maze", wind: "sky", xeno: "space", yoyo: "sky", trail: "grove",
};

function drawSprite(rows: string[], colors: Record<string, string>) {
  const pixel = 8;
  const columns = Math.max(...rows.map((row) => row.length));
  const startX = Math.round((240 - columns * pixel) / 2);
  const startY = 48;
  let output = "";
  rows.forEach((row, y) => {
    [...row].forEach((cell, x) => {
      const color = colors[cell];
      if (color) output += `<rect x="${startX + x * pixel}" y="${startY + y * pixel}" width="${pixel}" height="${pixel}" fill="${color}"/>`;
    });
  });
  return output;
}

function drawCharacter(rows: string[], x: number, y: number, pixel: number) {
  let output = "";
  rows.forEach((row, rowIndex) => {
    const offset = Math.floor((BOB_SPRITE_WIDTH - row.length) / 2);
    [...row].forEach((cell, columnIndex) => {
      const value = bobSpritePalette[cell];
      if (value === undefined) return;
      const color = "#" + value.toString(16).padStart(6, "0");
      const left = x + (offset + columnIndex) * pixel;
      const top = y + rowIndex * pixel;
      output += `<rect x="${left}" y="${top}" width="${pixel}" height="${pixel}" fill="${color}"/>`;
    });
  });
  return output;
}

function drawWorld(world: World, colors: GameDefinition["palette"]) {
  const { background: bg, primary: light, secondary: mid, accent } = colors;
  const skyMarks = `<path d="M34 24h24v8H34zM46 16h16v8H46zM168 31h16v8h-16zM180 23h24v8h-24z" fill="${light}" opacity=".82"/>`;

  if (world === "space") {
    return `<rect width="240" height="136" fill="${bg}"/><circle cx="182" cy="44" r="26" fill="${mid}"/><path d="M161 50c12-10 31-12 46-5-7 15-21 25-38 25-7-5-10-12-8-20z" fill="${accent}"/><path d="M0 103 35 87l32 13 41-27 39 31 35-19 58 18v33H0z" fill="${mid}" opacity=".72"/><path d="M0 117h240v19H0z" fill="${bg}" opacity=".9"/><path d="M20 27h5v5h-5zM72 47h4v4h-4zM123 17h5v5h-5zM221 72h4v4h-4zM34 66h3v3h-3zM205 18h3v3h-3z" fill="${light}"/>`;
  }

  if (world === "water") {
    return `<rect width="240" height="136" fill="${bg}"/><circle cx="184" cy="36" r="18" fill="${light}"/><path d="M0 58h240v78H0z" fill="${mid}"/><path d="M0 72h40l8 7h32l8-7h30l8 7h32l8-7h40l8 7h26v8h-26l-8-7h-40l-8 7h-32l-8-7h-30l-8 7H48l-8-7H0z" fill="${light}" opacity=".78"/><path d="M0 103h52l8 7h34l8-7h47l8 7h34l8-7h41v33H0z" fill="${bg}" opacity=".64"/><path d="M24 57h7v18h-7zm7-9h7v9h-7zm162 22h7v19h-7zm7-10h7v10h-7z" fill="${accent}"/>`;
  }

  if (world === "maze") {
    return `<rect width="240" height="136" fill="${bg}"/><path d="M0 0h240v17H0zM0 17h18v30H0zM222 17h18v26h-18zM18 39h48v15H18zM82 17h15v45H82zM116 17h47v15h-47zM178 31h44v15h-44zM0 103h240v17H0zM18 86h46v17H18zM82 77h15v43H82zM116 91h48v15h-48zM180 75h15v45h-15zM211 59h29v17h-29z" fill="${mid}"/><path d="M18 17h48v8H18zM116 32h47v8h-47zM18 86h46v7H18zM116 91h48v7h-48z" fill="${light}" opacity=".76"/><path d="M104 70h8v8h-8zm32-31h8v8h-8zm40 40h8v8h-8z" fill="${accent}"/>`;
  }

  if (world === "sky") {
    return `<rect width="240" height="136" fill="${bg}"/><circle cx="188" cy="39" r="22" fill="${light}"/><path d="M0 96 39 77l34 17 37-25 40 26 40-18 50 19v40H0z" fill="${mid}"/><path d="M0 108 45 91l36 18 41-20 40 18 38-15 40 16v28H0z" fill="${accent}" opacity=".75"/><path d="M0 122h240v14H0z" fill="${bg}" opacity=".55"/>${skyMarks}`;
  }

  return `<rect width="240" height="136" fill="${bg}"/>${skyMarks}<path d="M0 92 29 82l25 10 27-22 31 21 32-16 27 18 35-23 34 20v46H0z" fill="${mid}"/><path d="M0 108 34 99l27 10 30-16 35 18 30-15 29 12 30-16 25 13v31H0z" fill="${accent}" opacity=".78"/><path d="M0 122h240v14H0z" fill="${bg}" opacity=".58"/><path d="M20 72h8v16h-8zm8-9h8v9h-8zm8 9h8v16h-8zm152-5h8v22h-8zm8-12h8v12h-8zm8 12h8v22h-8z" fill="${bg}" opacity=".62"/>`;
}

export function gameCoverArt(game: GameDefinition) {
  if (game.id === "bobs-adventure") return adventureScene();
  if (game.id === "frog-hop") return foxfireScene(game);
  const colors = {
    "#": game.palette.primary,
    "+": game.palette.secondary,
    "@": game.palette.accent,
  };
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 136" shape-rendering="crispEdges" aria-hidden="true">${drawWorld(worlds[game.art], game.palette)}${drawSprite(sprites[game.art], colors)}</svg>`;
}

function adventureScene() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" shape-rendering="crispEdges" aria-hidden="true">
    <rect width="480" height="320" fill="#59c5df"/>
    <rect x="60" y="30" width="56" height="8" fill="#fff2c5"/><rect x="44" y="38" width="88" height="8" fill="#fff2c5"/><rect x="340" y="65" width="40" height="8" fill="#fff2c5"/><rect x="324" y="73" width="72" height="8" fill="#fff2c5"/>
    <rect x="214" y="25" width="48" height="48" fill="#ffdc69"/><rect x="222" y="17" width="32" height="8" fill="#ffdc69"/><rect x="222" y="73" width="32" height="8" fill="#ffdc69"/>
    <path d="M0 174h42v-25h34v-20h42v20h42v-29h40v29h44v-19h38v19h42v-28h42v28h42v25h40v53H0z" fill="#72a9cb"/>
    <path d="M0 202h46v-15h38v15h35v-24h43v24h43v-19h42v19h37v-26h46v26h37v-15h42v15h35v15h35v58H0z" fill="#498a8c"/>
    <path d="M0 239h480v81H0z" fill="#9a603d"/><path d="M0 231h480v22H0z" fill="#48a85d"/><path d="M0 231h480v8H0z" fill="#b8e76e"/>
    <path d="M0 265h480v8H0zM0 301h480v8H0z" fill="#79472f"/>
    <path d="M32 207h12v24H32zm12-12h12v12H44zm12 12h12v24H56zm360 3h12v21h-12zm12-16h12v16h-12zm12 16h12v21h-12z" fill="#72503b"/>
    <path d="M22 195h20v-20h20v-15h25v15h22v20h18v16H22zm344 1h20v-19h20v-17h26v17h20v19h20v16H366z" fill="#2d7358"/>
    <path d="M124 205h104v-14h-104zM286 158h104v-14H286z" fill="#a85838"/><path d="M124 190h104v-8h-104zM286 143h104v-8H286z" fill="#f1c05f"/>
    <path d="M132 206h14v14h-14zm28 0h14v14h-14zm28 0h14v14h-14zm106-47h14v14h-14zm28 0h14v14h-14zm28 0h14v14h-14z" fill="#d88343"/>
    <path d="M148 161h8v8h-8zm27 4h8v8h-8zm151-49h8v8h-8zm26 4h8v8h-8zm37-62h8v8h-8z" fill="#fff2c5"/>
    <path d="M151 131h8v23h-8zm-8 8h24v8h-24zm170-39h8v23h-8zm-8 8h24v8h-24z" fill="#ffdc69"/>
    <path d="M244 228h96v6h-96z" fill="#24485a" opacity=".42"/>
    ${drawCharacter(bobSprites.idle, 245, 138, 5)}
    <path d="M395 201h8v31h-8zm8-34h8v34h-8zm8 8h25v16h-25z" fill="#fff2c5"/><path d="M411 175h16v12h-16z" fill="#f05d61"/>
    <path d="M73 224h8v8h-8zm20 4h8v8h-8zm286-4h8v8h-8z" fill="#f57546"/>
    <path d="M20 12h100v27H20z" fill="#24354a"/><path d="M28 20h8v8h-8zm13 0h8v8h-8zm13 0h8v8h-8zm42 1h16v6H96z" fill="#ffdc69"/>
  </svg>`;
}

function foxfireScene(game: GameDefinition) {
  const { primary, secondary, accent } = game.palette;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 320" shape-rendering="crispEdges" aria-hidden="true">
    <rect width="480" height="320" fill="#57c8df"/>
    <rect x="48" y="31" width="48" height="8" fill="#fff4c9"/><rect x="32" y="39" width="72" height="8" fill="#fff4c9"/><rect x="336" y="57" width="32" height="8" fill="#fff4c9"/><rect x="320" y="65" width="64" height="8" fill="#fff4c9"/>
    <rect x="376" y="28" width="40" height="40" fill="#ffdf72"/><rect x="384" y="20" width="24" height="8" fill="#ffdf72"/><rect x="384" y="68" width="24" height="8" fill="#ffdf72"/>
    <path d="M0 165h44v-18h34v-16h38v16h36v-24h44v24h42v-15h38v15h44v-25h40v25h36v18h44v64H0z" fill="#70ac84"/>
    <path d="M0 191h35v-19h33v-15h32v15h32v-23h42v23h31v-16h38v16h35v-21h40v21h30v-15h36v15h35v19h35v83H0z" fill="#3c8465"/>
    <path d="M0 229h34v-15h30v15h30v-21h34v21h26v-13h31v13h34v-23h38v23h31v-14h33v14h33v-18h36v18h30v-15h34v15h35v91H0z" fill="#55a956"/>
    <path d="M0 253h55v-12h28v12h42v-11h37v11h42v-15h38v15h42v-10h37v10h43v-14h37v14h34v-10h45v77H0z" fill="#277448"/>
    <path d="M0 277h78v-10h34v10h55v-12h42v12h48v-9h40v9h52v-12h39v12h44v-9h48v52H0z" fill="#184d46"/>
    <path d="M176 320v-32h21v-15h22v-15h26v15h22v15h21v32z" fill="#f2bd6b"/>
    <path d="M0 293h57v-8h21v8h45v-9h25v9h32v-7h29v7h34v-8h23v8h40v-7h26v7h39v-9h28v9h36v-8h45v27H0z" fill="#f6d181"/>
    <path d="M25 180h10v45H25zm10-18h10v18H35zm10 18h10v45H45zm10 11h10v34H55zM400 171h10v54h-10zm10-22h10v22h-10zm10 22h10v54h-10zm10 8h10v46h-10z" fill="#74523f"/>
    <path d="M5 157h20v-20h20v-20h24v20h21v20h21v20H5zm346 1h20v-20h20v-17h24v17h23v20h25v20H351z" fill="#275c55"/>
    <path d="M18 134h15v-18h22v18h18v18H18zm347 0h17v-19h22v19h18v18h-57z" fill="#3c8465"/>
    <path d="M63 226h9v9h-9zm18 18h8v8h-8zm286-31h9v9h-9zm-30 32h8v8h-8z" fill="${primary}"/>
    <path d="M106 205h8v8h-8zm18 16h8v8h-8zm244-16h8v8h-8zm-31 19h8v8h-8z" fill="${accent}"/>
    <path d="M198 257h79v9h-79z" fill="#153b3a" opacity=".42"/>
    <path d="M213 196h-16v-13h-14v-10h-17v9h-12v18h12v14h20v9h17v-12h10z" fill="#b94d3f"/>
    <path d="M197 194h-14v-8h-15v8h-8v10h16v12h14v9h12v-13h9v-8h-14z" fill="#f4c16c"/>
    <path d="M208 178h16v-26h16v-16h16v16h16v-16h16v16h16v26h17v35h-17v17h-15v-9h-13v9h-16v-9h-13v9h-16v-17h-17z" fill="#e77b3f"/>
    <path d="M200 178h16v-27h16v-18h16v19h16v-9h16v9h16v-9h16v18h16v28h17v33h-17v17h-14v-10h-14v10h-20v-9h-12v9h-19v-9h-12v10h-18v-18h-18z" fill="#b94d3f"/>
    <path d="M216 175h16v-27h16v-17h16v18h16v-9h16v9h16v-9h16v18h16v26h16v33h-16v16h-15v-9h-12v9h-19v-9h-12v9h-19v-9h-12v9h-18v-16h-16z" fill="#f58d3f"/>
    <path d="M232 149h16v-17h16v17h16v-9h16v9h16v-9h16v9h16v25h-16v9h-16v-9h-16v9h-16v-9h-16v9h-16v-9h-16z" fill="#f58d3f"/>
    <path d="M240 149h8v-17h8v17h8v-9h8v9h8v-9h8v9h8v9h-8v8h-8v-8h-8v8h-8v-8h-8v8h-8v-8h-8z" fill="#f4c16c"/>
    <path d="M248 164h8v8h-8zm32 0h8v8h-8z" fill="#1c263b"/><path d="M264 181h24v8h-24z" fill="#fff1ca"/>
    <path d="M216 196h16v8h-16zm104 0h16v8h-16z" fill="#e95f55"/>
    <path d="M232 213h16v17h-16zm70 0h16v17h-16z" fill="#f4c16c"/><path d="M224 229h24v9h-24zm69 0h24v9h-24z" fill="#1c263b"/>
    <path d="M175 133h8v8h-8zm111-18h8v8h-8zm87 76h8v8h-8zm-220-17h8v8h-8z" fill="#ffdf72"/>
    <path d="M31 275h10v10H31zm400-23h10v10h-10z" fill="#e87958"/>
    <path d="M138 96h40v8h-40zm16-8h8v8h-8zm184 89h40v8h-40z" fill="#17324a"/>
    <path d="M12 12h108v28H12z" fill="#1c263b"/><path d="M20 20h10v10H20zm16 0h10v10H36zm16 0h10v10H52z" fill="#ffdf72"/><path d="M80 21h28v8H80z" fill="#fff8ea"/>
  </svg>`;
}
