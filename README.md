# Bobby Fajar Christian — Pocket Arcade

A small corner of the web for a longer adventure or a quick round. Explore **Bob’s Adventure**, a 25-level platform game set across Indonesian landscapes, then pick from **26 original arcade games**. When you’re done, head to [Limaraya.com](https://limaraya.com/) for Bobby’s music and stories.

**[Play the arcade](https://bobbyfch.github.io/)** · **[Visit Limaraya.com](https://limaraya.com/)**

## Inside the arcade

- **Bob’s Adventure** — the featured platformer, with 25 levels inspired by Ubud’s rice terraces, Merapi, Raja Ampat, Kalimantan, and Papua.
- **An A–Z shelf of games** — 26 short, original games with distinct pixel scenes, palettes, and controls.
- **A direct route to Limaraya** — the main feature links to [Limaraya.com](https://limaraya.com/), Bobby’s home for music and stories.
- **Personal links** — find Bobby on GitHub, Instagram, Threads, LinkedIn, and YouTube.

Play in the browser without an account or download. The page scrolls naturally on desktop and mobile, includes keyboard and on-screen controls, supports light and dark themes, and respects the reduced-motion setting.

## The A–Z games

| Letter | Game | Style |
| --- | --- | --- |
| A | Astro Dash | Starship flight |
| B | Botany Brawl | Garden strategy |
| C | Cloud Cannon | Target shooting |
| D | Dandelion Drift | Dodge |
| E | Eggventure | Catch and collect |
| F | Foxfire Hop | Jump and dodge |
| G | Glimmer Guard | Star shooter |
| H | Hollow Star | Forest defense |
| I | Icebound Trail | Maze run |
| J | Jade Jumper | Jetpack run |
| K | Kite Keeper | Catch and keep |
| L | Lantern Run | Dodge |
| M | Meteor Munch | Shoot and collect |
| N | Nimble Grove | Take-away strategy |
| O | Orchard Orbit | Garden strategy |
| P | Pogo Paddle | Paddle rally |
| Q | Quickstep Quokka | Timing |
| R | Reef Runner | Dodge and rescue |
| S | Stardust Skirmish | Starship duel |
| T | Treetop Rally | Racket rally |
| U | Updraft | Hop and dodge |
| V | Velvet Vault | Jump and collect |
| W | Wildwood Whistle | Timing |
| X | Xeno Bloom | Garden shooter |
| Y | Yeti Yo-Yo | Rhythm timing |
| Z | Zephyr Zigzag | Maze run |

The game names, settings, and artwork are original to this site. The arcade borrows the pick-up-and-play spirit of handheld games while running as a browser experience; it does not emulate Nintendo hardware or use Nintendo branding.

## Design and access

The site uses a warm paper background with cobalt, coral, mint, and yellow accents. Each game has its own palette and pixel-art scene. Theme selection follows the device preference on first visit and is saved in browser storage when available. Keyboard and on-screen controls provide ways to play, and the interface honors reduced-motion preferences.

## Built with

- [Astro](https://astro.build/) for the static site.
- [Tailwind CSS 4](https://tailwindcss.com/) through Vite for styling.
- [Phaser](https://phaser.io/) for the interactive game canvas, loaded when play begins.
- TypeScript for game rules, input, and site interactions.
- GitHub Actions and GitHub Pages for build and deployment.

## Run locally

Requirements: Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Create the production build with:

```sh
npm run build
```

The static output is written to `dist/`. Pushing to `main` runs [the Pages workflow](.github/workflows/deploy.yml) and publishes the site at [bobbyfch.github.io](https://bobbyfch.github.io/).

## Project map

```text
src/
  games/
    arcade-scene.ts       Phaser renderer and input bridge
    arcade-simulation.ts  Shared arcade rules and state
    bobs-adventure.ts     Platform movement, routes, coins, hazards, checkpoints
    bobs-sprites.ts       Bob’s pixel-art poses and palette
    catalog.ts            Featured game and A–Z game definitions
    cover-art.ts          Pixel-art game cover illustrations
    socials.ts            Social profiles and destinations
  pages/
    index.astro           Page structure, metadata, game shelf, and links
  scripts/
    site.ts               Theme toggle, game selection, and arcade startup
  styles/
    global.css            Palette, layout, responsive rules, and themes
public/
  favicon.svg
  robots.txt
  sitemap.xml
```
