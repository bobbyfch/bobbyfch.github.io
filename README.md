# Bobby Fajar Christian

Personal homepage of Bobby Fajar Christian, built as a static Astro site with Tailwind CSS 4 and published at [bobbyfch.github.io](https://bobbyfch.github.io) through GitHub Pages. It introduces the Sela project and keeps Limaraya's music catalogue, platform links, players, and band socials together on the same page.

## Visual identity

The Limaraya section uses its official [Spotify artist portrait](https://open.spotify.com/artist/0gTusXkU2Q2M0vKTy4LU6a) and original [Apple Music artwork for Anahata](https://music.apple.com/id/album/anahata/6766773389) and [Spektrum Rasa](https://music.apple.com/id/album/spektrum-rasa/6809280279). It presents those two albums with full, uncropped covers and official players for Spotify, Apple Music, Audiomack, and TIDAL. YouTube and SoundCloud have separate official embeds. Player frames load only when opened.

Platform marks use a small local subset of [Webicons](https://github.com/adamfairhead/webicons); attribution and license details are in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md).

## Local development

```sh
npm install
npm run dev
```

Create the production files with `npm run build`; Astro writes them to `dist/`.

## Publishing

Pushing to `main` runs the GitHub Pages workflow in `.github/workflows/deploy.yml`. The workflow builds the static site and deploys the `dist/` output.

There is no custom-domain configuration yet. The site is fully static, so it can move to Cloudflare Pages later without changing the app: connect this repository, run `npm run build`, and publish `dist/`. When a domain is ready, update `site` in `astro.config.mjs` and add the domain's DNS records in Cloudflare.
