# Bobby Fajar · Orbital Gate

The personal gate at [bobbyfch.github.io](https://bobbyfch.github.io/): a small monochrome Space Invaders game and a hand-drawn orbit map for Bobby's social links and Limaraya.

The largest planet opens [limaraya.com](https://limaraya.com/). Social destinations use the profile links already published on Bobby's previous site.

## Stack

- Astro, pre-rendered as a static site
- Tailwind CSS 4 for the Vite build pipeline
- TypeScript and the browser's Canvas 2D API for the game
- GitHub Pages with GitHub Actions

## Local development

```sh
npm ci
npm run dev
```

Build the static output with `npm run build`; Astro writes it to `dist/`.

## Publishing

Pushing to `main` runs `.github/workflows/deploy.yml` and publishes the `dist/` output to GitHub Pages.
