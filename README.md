# Limaraya

The official Limaraya landing page, built as a static Astro site with Tailwind CSS 4. It is published at [bobbyfch.github.io](https://bobbyfch.github.io) through GitHub Pages.

## Local development

```sh
npm install
npm run dev
```

Create the production files with `npm run build`; Astro writes them to `dist/`.

## Publishing

Pushing to `main` runs the GitHub Pages workflow in `.github/workflows/deploy.yml`. The workflow builds the static site and deploys the `dist/` output.

There is no custom-domain configuration yet. When a domain is ready, update `site` in `astro.config.mjs`, add the domain's DNS records, and configure that domain in the eventual hosting provider.
