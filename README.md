# Limaraya

The official Limaraya landing page, built as a static Astro site with Tailwind CSS 4. It is published at [bobbyfch.github.io](https://bobbyfch.github.io) through GitHub Pages.

## Visual identity

The site uses Limaraya's official [Spotify artist portrait](https://open.spotify.com/artist/0gTusXkU2Q2M0vKTy4LU6a) and [Apple Music artwork for Anahata](https://music.apple.com/id/album/anahata/6766773389) and [Spektrum Rasa](https://music.apple.com/id/album/spektrum-rasa/6809280279). The light and dark palettes are sampled from those images; album cards link to their Apple Music releases.

## Local development

```sh
npm install
npm run dev
```

Create the production files with `npm run build`; Astro writes them to `dist/`.

## Publishing

Pushing to `main` runs the GitHub Pages workflow in `.github/workflows/deploy.yml`. The workflow builds the static site and deploys the `dist/` output.

There is no custom-domain configuration yet. The site is fully static, so it can move to Cloudflare Pages later without changing the app: connect this repository, run `npm run build`, and publish `dist/`. When a domain is ready, update `site` in `astro.config.mjs` and add the domain's DNS records in Cloudflare.
