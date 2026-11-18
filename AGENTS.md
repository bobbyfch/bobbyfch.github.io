# Repository workflow

- `main` is the only routine development and production branch. Work directly on `main`; do not create Codex, AI, feature, preview, temporary branches, pull requests or extra worktrees unless the owner explicitly asks.
- This static Astro website deploys exclusively through Cloudflare Workers Builds. GitHub is source control, not a deployment host. Never reintroduce GitHub Pages or GitHub Actions deploy workflows.
- Before configuring Cloudflare, verify whether Worker `bobby-pocket-arcade` exists; connect the existing one instead of creating a duplicate. Intended custom domain: `arcade.limaraya.com`.
- Build command: `npm run build`; deploy command: `npx wrangler deploy`; Node.js 24; production branch `main`.
- Run `npm ci && npm run build` locally before committing. Do not run another production deploy manually when Workers Builds is connected.

## Apple-first UI/UX execution contract — 18 Nov 2026

Apply **Apple Human Interface Guidelines (HIG)** as the default grammar for every UI, navigation, layout, component and responsive task, without asking the owner to re-explain shapes, switches or layout. Keep existing branding, architecture, accessibility, security and native platform OS conventions. User's explicit different UI direction overrides this default for that task.

- First inspect existing repo controls, CSS tokens, SDK, navigation, tests and constraints. Prefer reuse over new general UI kits.
- Control semantics: destinations → tab/sidebar; contextual commands → toolbar; boolean immediate setting → switch; few exclusive local modes → segmented; many choices → picker; continuous value → slider; bounded count → stepper; temporary task → sheet; critical prompt → alert. Distinguish button action from link navigation.
- Adaptive: phone usually 1-column/content-first; tablet/sidebar or list-detail only when room and task justify; desktop multi-pane for genuine workflow needs; TV remote D-pad with visible focus. Preserve resize/orientation/keyboard/back/URL, safe-area, localization and font scaling.
- Semantic design tokens and coherent text/spacing/shape/icons; Liquid Glass only purposeful navigation/control chrome, with opaque/reduced transparency fallback. No glass-on-glass; don't ship proprietary SF assets on web/Android without license.
- Use platform's existing UI implementation (native HTML/CSS, React accessible primitive, Kotlin/Compose, etc.). Google Material 3 Expressive, Fluent 2, Spectrum 2 and Primer are the **only backup design guidelines** and require reasoned platform/task exceptions.
- QA changed screens across supported mobile/tablet/desktop/TV sizes, dark/light/high contrast, large type/zoom, reduced motion, touch/keyboard/TalkBack/remote, focus, disabled/loading/error/offline, settings persistence and meaningful recovery. Record PASS/FAIL/NOT TESTED accurately; don't claim Apple HIG certification.
- Preserve all existing main-branch/deployment policies. Documentation changes should not introduce parallel deploy pathways, workflows, new branch policy or dependencies.

Knowledge base: [00 Operating Standard](https://docs.google.com/document/d/1w-1h4fe4ttDmoWW9jMSWBS9QkA6nqgTRSsr1nOLGAGA/edit) · [01 UI Patternbook](https://docs.google.com/document/d/1GG4RlD6YZq8Z7SnLOg7obJz5iUoCEHnVbrVHU_RHk7I/edit) · [02 Engineering & QA](https://docs.google.com/document/d/1tKbQvPvWdwBlNEUDoe2nBvA3z8Rp4TcMR7AjRKdaBSg/edit) · [03 Project Playbooks](https://docs.google.com/document/d/1h1olqr5dLNQmjnl7PTMYAknFNDI-R26o-a8fc9AAV1s/edit) · [04 Research Sources](https://docs.google.com/document/d/1DxcMfR9J293ncqLZgJjI-fQ2yPcUTfqwBx19p7ImcsM/edit). Google Drive isn't always available to coding agents: apply these self-contained rules and consult links when connected.

This is a static browser UI: mobile/tablet/desktop navigation, focus and performance; preserve existing Astro and Workers Builds setup. Use the current app's actual product identity.
