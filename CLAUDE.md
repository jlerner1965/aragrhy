# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository layout — read this first

This git repository does **not** contain the site source directly. The entire
project is checked in as a single archive, `aragocor-minerals-website-code.zip`,
at the repo root. Before doing any work:

```bash
unzip aragocor-minerals-website-code.zip -d <workdir>
```

All paths below (`app/`, `worker/`, `db/`, `scripts/`, etc.) refer to the
contents of that archive, not the repo root. If you make changes, edit the
extracted files and re-zip (or otherwise sync) back into
`aragocor-minerals-website-code.zip` at the repo root — that archive is the
artifact this repo actually tracks. The archive also contains a stale `dist/`
(previous build output) and `.wrangler/` (local Wrangler state); treat both as
disposable build artifacts, not source.

## What this is

A single-page marketing site for **Aragocor Minerals** (bulk oolitic
aragonite / calcium carbonate supplier), built on **vinext**
(https://github.com/cloudflare/vinext) — a Next.js App Router runtime that
deploys to a **Cloudflare Worker** instead of a Node server. This is a
generated "Sites" project from an OpenAI ChatGPT/Codex app-builder platform:
note `.openai/hosting.json`, the `codex-preview` metadata tag in
`app/layout.tsx`, the dispatch-owned "Sign in with ChatGPT" (SIWC) routes, and
the `.sites-runtime/` sandboxed environment used by the lifecycle scripts.
Optional Cloudflare D1 (SQLite) + Drizzle ORM support is scaffolded but unused
by default.

## Commands (run from the extracted project root)

- `npm run install:ci` — the **only** supported install path. Runs
  `scripts/install-ci.sh`: a single non-retrying `npm ci`, guarded by `flock`
  against concurrent installs, that preflights and integrity-verifies the
  `vinext` tarball pinned in `package-lock.json` before installing. Do **not**
  run `npm install` directly.
- `npm run dev` — start the Vite/vinext dev server (Wrangler-backed).
- `npm run build` — runs `scripts/build-verified.sh`: a time-bounded
  `vinext build` followed by artifact validation.
- `npm run start` — run the built Worker via `vinext start`.
- `npm test` — `npm run build` then `node --test tests/rendered-html.test.mjs`
  (there is one test file; it imports the **built** `dist/server/index.js`
  Worker and asserts it serves HTML with the expected preview metadata). To
  run just that check after a build, use
  `node --test tests/rendered-html.test.mjs`, or narrow further with
  `node --test --test-name-pattern="renders development preview metadata" tests/rendered-html.test.mjs`.
- `npm run validate:artifact` — re-checks an already-built `dist/` (worker has
  an ESM `default.fetch` export, `dist/.openai/hosting.json` is valid JSON)
  without rebuilding. Use for diagnosing a failed remote build, not routinely.
- `npm run lint` — ESLint (`eslint-config-next` core-web-vitals + typescript).
- `npm run db:generate` — `drizzle-kit generate`, only needed after editing
  `db/schema.ts`.

All of the above scripts (except `dev`/`start`, which are invoked directly)
re-exec themselves through `scripts/sites-env.sh` if `SITES_ENV_READY` isn't
set, which redirects `HOME`, the npm cache, `TMPDIR`, and Wrangler's log path
into a project-local `.sites-runtime/` directory. Linux with `flock`, `curl`,
GNU `timeout`, and `sha256sum` is required; these scripts are not portable to
macOS. Install/build timeouts are overridable via `SITES_INSTALL_TIMEOUT`,
`SITES_INSTALL_KILL_AFTER`, `SITES_BUILD_TIMEOUT`, `SITES_BUILD_KILL_AFTER`.
Per the README, the remote Sites builder runs `npm run build` on every pushed
commit — don't treat local install/build as a routine pre-commit step.

## Architecture

- **`app/page.tsx`** — the entire public site as one client component
  (`"use client"`). Content (industries, features, specs, process steps) is
  authored as inline data arrays and mapped over; markup is dense/single-line
  by convention. `app/layout.tsx` sets fonts (Geist via `next/font/google`),
  page metadata, and favicon.
- **`app/globals.css`** — hand-rolled design system (custom properties,
  semantic classes like `.hero`, `.cards`, `.specs`). Tailwind is imported
  (`@import "tailwindcss"`) but the page does not use Tailwind utility
  classes — follow the existing custom-class convention rather than
  introducing utility classes.
- **`app/chatgpt-auth.ts`** — "Sign in with ChatGPT" (SIWC) helpers:
  `getChatGPTUser()` (optional identity from the
  `oai-authenticated-user-email` / `-full-name` request headers),
  `requireChatGPTUser(returnTo)` (redirect-if-anonymous), and
  `chatGPTSignInPath`/`chatGPTSignOutPath`. The platform's dispatch layer
  owns `/signin-with-chatgpt`, `/signout-with-chatgpt`, and `/callback` —
  never implement app routes at those paths. SIWC only proves identity, not
  workspace membership; enforce authorization separately if needed. Pages
  using these helpers must set `export const dynamic = "force-dynamic"`
  since they depend on per-request headers.
- **`worker/index.ts`** — the actual Cloudflare Worker entry point (not a
  Node server). Intercepts `/_vinext/image` for image optimization
  (`vinext/server/image-optimization`) and otherwise delegates to vinext's
  `app-router-entry` handler, which runs the Next.js App Router.
- **`db/index.ts`** / **`db/schema.ts`** — optional D1 + Drizzle wiring.
  `getDb()` reads the `DB` binding from `cloudflare:workers` env and throws if
  it's unset; `schema.ts` is intentionally empty by default. `examples/d1/`
  shows the opt-in pattern (a `notes` table + a `GET`/`POST` API route under
  `app/api/notes/`) to copy in when a site actually needs persistence.
- **`build/sites-vite-plugin.ts`** — a Vite plugin (`sites()`) that runs on
  `closeBundle` and copies `.openai/hosting.json` and the `drizzle/`
  migrations directory into `dist/.openai/`, so the deployable artifact
  carries its own hosting manifest and migrations.
- **`vite.config.ts`** — wires the `vinext()`, `sites()`, and Cloudflare
  (`@cloudflare/vite-plugin`) Vite plugins together. D1/R2 Wrangler bindings
  are derived from `.openai/hosting.json` (`d1`/`r2` fields, both nullable);
  when set, only the relevant binding is added to the local Wrangler
  simulation. `.openai/hosting.json` is a per-deployment manifest injected by
  the hosting platform — it is not present in this source snapshot and must
  exist for `vite.config.ts` to load.
- **`drizzle.config.ts`** — SQLite dialect config for `drizzle-kit`, schema at
  `db/schema.ts`, migrations output to `drizzle/`.
- **`scripts/`** — the install/build/validate lifecycle described above,
  plus `sites-env.sh`, the shared environment shim every other script
  re-execs through.

## Conventions

- Node `>=22.13.0`.
- Never call `npm install` or `npm ci` directly — use `npm run install:ci`.
- No `wrangler.jsonc`; Worker bindings are declared via `.openai/hosting.json`
  and consumed in `vite.config.ts`.
- Match `app/page.tsx`'s existing style (inline data arrays, terse single-line
  JSX, semantic custom CSS classes) rather than reformatting or introducing a
  different component structure when making content edits.
