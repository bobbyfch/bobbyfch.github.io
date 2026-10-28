# Repository workflow

- `main` is the only routine development and production branch. Work directly on `main`; do not create Codex, AI, feature, preview, temporary branches, pull requests or extra worktrees unless the owner explicitly asks.
- This static Astro website deploys exclusively through Cloudflare Workers Builds. GitHub is source control, not a deployment host. Never reintroduce GitHub Pages or GitHub Actions deploy workflows.
- Before configuring Cloudflare, verify whether Worker `bobby-pocket-arcade` exists; connect the existing one instead of creating a duplicate. Intended custom domain: `arcade.limaraya.com`.
- Build command: `npm run build`; deploy command: `npx wrangler deploy`; Node.js 24; production branch `main`.
- Run `npm ci && npm run build` locally before committing. Do not run another production deploy manually when Workers Builds is connected.
