# Bobby Fajar Christian · Solar System

**A little corner of my universe.** Follow the orbit, pick a pocket-sized game from A to Z, and make yourself at home.

[Visit the live site](https://bobbyfch.github.io/) · [Visit Limaraya](https://limaraya.com/)

## What’s inside

- A monochrome solar system with rotating, clickable planets for Limaraya and my social profiles.
- A prominent route to [Limaraya](https://limaraya.com/), the main planet.
- A 26-game, A–Z pocket arcade with original mini-games and nine playable nods to early game history.
- Light and dark themes, keyboard and touch controls, and reduced-motion support.
- A compact layout designed to fit one viewport on common desktop and phone screens.

## The pocket arcade

| Key | Game | Play style |
| --- | --- | --- |
| A | Asteroid Run · Computer Space | Pilot through an asteroid field |
| B | Bertie the Brain · 1950 | Noughts and crosses against the machine |
| C | CRT Target Range · 1947 | Aim at a moving target |
| D | Dot Dodge | Avoid falling pixels |
| E | Egg Catch | Catch eggs, dodge stones |
| F | Frog Hop | Jump traffic and catch fireflies |
| G | Galaxy Guard | Clear the incoming fleet |
| H | Space Invaders · 1978 | Defend against the descending formation |
| I | Ice Maze | Collect stars through a maze |
| J | Jetpack Dash | Boost through gates |
| K | Keep-Up Rally | Keep the ball in play |
| L | Laser Lane | Weave between laser gates |
| M | Meteor Miner | Shoot the drifting rocks |
| N | Nimrod · 1951 | Take counters using Nim strategy |
| O | OXO · 1952 | Noughts and crosses against the machine |
| P | Pong · 1972 | Keep the table-tennis ball in play |
| Q | Quick Draw | Hit the timing window |
| R | Rocket Rescue | Guide a capsule through a meteor shower |
| S | Spacewar! · 1962 | Pilot a one-player space duel |
| T | Tennis for Two · 1958 | Set an angle and keep a rally going |
| U | Updraft | Ride the air currents and collect stars |
| V | Vault Jump | Jump barriers and collect tokens |
| W | Word Rush | Stop the cursor on the target |
| X | Xeno Sweep | Clear ships from the sky |
| Y | Yo-Yo Timing | Catch the beat at the bottom of the swing |
| Z | Zigzag Run | Follow the trail and collect pixels |

The pocket games are small, original browser recreations made for this site. The history-inspired entries are not ports or exact hardware emulations. “First video game” depends on how the term is defined. The 1947 CRT Target Range is a modern reimagining of a patent concept, not a released videogame. Historical dates and context are documented by the [patent](https://patents.google.com/patent/US2455992A/en), [Leaside Heritage Preservation Society](https://leasidelife.com/worlds-first-video-game-built-in-leaside/), [Computer History Museum](https://www.computerhistory.org/timeline/graphics-games/), [Brookhaven National Laboratory](https://www.bnl.gov/about/history/firstvideo.php), [Computer History Museum’s PDP-1 archive](https://www.computerhistory.org/pdp-1/spacewar/), [Australian Centre for the Moving Image](https://www.acmi.net.au/works/118095--computer-space/), [Smithsonian](https://www.si.edu/spotlight/the-father-of-the-video-game-the-ralph-baer-prototypes-and-electronic-games/video-game-history), and [Taito](https://taito.co.jp/en/corporate/about/history).

## Controls

| Input | Action |
| --- | --- |
| Arrow keys or WASD | Move, aim, jump, choose a pile, or navigate a maze/board |
| Space or Enter | Fire, jump, time an action, confirm a move, or start/restart |
| Pointer or touch | Select a Tic-Tac-Toe square, aim, or use the on-screen controls |

The exact controls change with the selected game and are shown in the arcade.

## Stack

- [Astro](https://astro.build/) pre-renders the site as static HTML.
- [Tailwind CSS 4](https://tailwindcss.com/) is integrated through Vite.
- [Phaser 4.2.1](https://phaser.io/) renders the arcade; its client code is loaded only after an arcade interaction.
- TypeScript holds the A–Z game catalog and simulation rules; DOM controls provide the responsive, accessible shell.
- GitHub Actions builds and publishes the static output to GitHub Pages.

## Local development

~~~sh
npm ci
npm run dev
~~~

Create a production build with:

~~~sh
npm run build
~~~

Astro writes the static site to dist/. Pushes to main publish through .github/workflows/deploy.yml.

## Project map

~~~text
src/
  games/
    arcade-scene.ts         Phaser renderer and input bridge
    arcade-simulation.ts    Game rules and state
    catalog.ts              A–Z games, copy, controls, and history links
  pages/
    index.astro             Page shell and social planet links
  scripts/
    site.ts                 Theme, view tabs, and lazy arcade startup
  styles/
    global.css              Theme tokens, orbit motion, responsive layout
public/
  favicon.svg
  robots.txt
  sitemap.xml
~~~

## Design notes

- The solar-system artwork and all arcade sprites are drawn in code; no remote game assets are required.
- The social planets and Limaraya remain ordinary links when scripts are unavailable.
- Theme choice is stored locally when browser storage is available.
- prefers-reduced-motion turns off orbit animation.
