# Bobby Fajar Christian · Solar System

**A little corner of my universe.** Follow the orbit, play a tiny piece of game history, and make yourself at home.

[Visit the live site](https://bobbyfch.github.io/) · [Visit Limaraya](https://limaraya.com/)

## What’s inside

- A monochrome solar system with rotating, clickable planets for Limaraya and my social profiles.
- A prominent route to [Limaraya](https://limaraya.com/), the main planet.
- Nine short arcade reinterpretations, from a 1947 CRT amusement-device concept to *Space Invaders*.
- Light and dark themes, keyboard and touch controls, and reduced-motion support.
- A compact layout designed to fit one viewport on common desktop and phone screens.

## The arcade

| Game | Year | Play |
| --- | ---: | --- |
| CRT Amusement Device | 1947 | Aim and fire at a moving target |
| Bertie the Brain | 1950 | Play noughts and crosses against the machine |
| Nimrod | 1951 | Take counters from piles using Nim strategy |
| OXO | 1952 | Play noughts and crosses; choose who starts |
| Tennis for Two | 1958 | Set an angle and keep a rally going |
| Spacewar! | 1962 | Pilot a ship in a one-player space duel |
| Computer Space | 1971 | Turn, thrust and clear a field of asteroids |
| Pong | 1972 | Keep the table-tennis ball in play |
| Space Invaders | 1978 | Defend against a descending alien formation |

These are original, small browser-game interpretations inspired by historical milestones; they are not ports or exact hardware emulations. “First video game” depends on how the term is defined. The 1947 CRT Amusement Device was a patent for an electronic target-shooting concept, so that mode is explicitly a modern reimagining. The arcade’s dates and context are documented by the [patent](https://patents.google.com/patent/US2455992A/en), [Leaside Heritage Preservation Society](https://leasidelife.com/worlds-first-video-game-built-in-leaside/), [Computer History Museum](https://www.computerhistory.org/timeline/graphics-games/), [Brookhaven National Laboratory](https://www.bnl.gov/about/history/firstvideo.php), [Computer History Museum’s PDP-1 archive](https://www.computerhistory.org/pdp-1/spacewar/), [Australian Centre for the Moving Image](https://www.acmi.net.au/works/118095--computer-space/), [Smithsonian](https://www.si.edu/spotlight/the-father-of-the-video-game-the-ralph-baer-prototypes-and-electronic-games/video-game-history), and [Taito](https://taito.co.jp/en/corporate/about/history).

## Controls

| Input | Action |
| --- | --- |
| Arrow keys or WASD | Move, aim, choose a pile, or navigate a board |
| Space or Enter | Fire, confirm a move, or start/restart |
| Pointer or touch | Select a Tic-Tac-Toe square, aim, or use the on-screen controls |

The exact controls change with the selected game and are shown in the arcade.

## Stack

- [Astro](https://astro.build/) pre-renders the site as static HTML.
- [Tailwind CSS 4](https://tailwindcss.com/) is integrated through Vite.
- [Phaser 4.2.1](https://phaser.io/) renders the arcade; its client code is loaded only after an arcade interaction.
- TypeScript holds the game catalog and simulation rules; DOM controls provide the responsive, accessible shell.
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
    catalog.ts              Game copy, dates, and source links
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
