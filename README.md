# cbmltda.com.co — static site

Website of **CBM Ltda** (banking and packaging equipment, Medellín, since 1983), migrated
from WordPress to a 100 % static site built with [Astro](https://astro.build) + Tailwind
CSS 4. No database, no backend: all the content lives in TypeScript data files that are
easy to edit by hand or with an AI assistant. The site copy is in Spanish; everything else
in this repo (docs, comments, config) is in English.

> **Handed over to the owner.** CBM updates the site by talking to an assistant (Antigravity
> CLI, or any other that reads `AGENTS.md`): they ask for the change in their own words and
> the assistant makes it and publishes it. The owner's guide is
> [GUIA-PARA-CBM.md](GUIA-PARA-CBM.md) (in Spanish, on purpose); the assistant's rules are
> in [AGENTS.md](AGENTS.md) (operation mode by default, development mode for the developer).
> Everything below is for the developer.

## Commands

| Command           | What it does                                                             |
| ----------------- | ------------------------------------------------------------------------ |
| `npm install`     | Install dependencies                                                     |
| `npm run dev`     | Dev server at `http://localhost:4321`                                    |
| `npm run check`   | Type check (must end with 0 errors)                                      |
| `npm run build`   | Build the site into `dist/` and run the `postbuild` gate: every internal link and anchor resolves, every page has a `<title>` and a meta description (≤ 160 chars) |
| `npm run preview` | Serve `dist/` locally to review the build                                |
| `npm run verify`  | Post-deploy verification against the published URL (`-- <url>` for another URL) |
| `npm run shots`   | Full-page screenshots with the local Chrome, for visual QA               |
| `npm run brand`   | Regenerate `public/og.jpg` and `public/apple-touch-icon.png` from the site's tokens and copy |
| `npm run doctor`  | Check the machine: tools (Node, npm, git, Chrome, assistant CLI), `node_modules`, repo state, network and read/write access to GitHub (`git push --dry-run`: nothing is pushed). Run it on a new machine and whenever the assistant reports a failure |
| `npm run deploy`  | `check` + `build` + manual deploy to Cloudflare Workers (`npx wrangler login` first) |

## Where everything lives

- **Business data** (phones, WhatsApp, address, email, navigation, URL):
  [src/site.config.ts](src/site.config.ts). Header, footer, SEO and every contact button
  read from here — no contact data is written anywhere else.
- **Products**: [src/data/products.ts](src/data/products.ts). One product = one object in
  the array. Its photos go in `src/assets/products/` and are referenced by file name.
  `destacado: true` shows it on the homepage.
- **Categories**: [src/data/categories.ts](src/data/categories.ts) (title, description and
  order of the sections of `/productos/`).
- **Clients** (homepage logos): [src/data/clients.ts](src/data/clients.ts) + image in
  `src/assets/clients/`.
- **Catalogs** (images shown on `/catalogos/`): [src/data/catalogs.ts](src/data/catalogs.ts)
  + images in `src/assets/catalogos/`.
- **Pages**: `src/pages/`. Product pages are generated from the products array
  (`productos/[slug].astro`).
- **Generated brand assets**: `public/og.jpg` (the 1200×630 image WhatsApp, LinkedIn or
  Slack show when a link is shared) and `public/apple-touch-icon.png` (iOS/Android
  home-screen icon) come out of `npm run brand`
  ([scripts/brand-assets.mjs](scripts/brand-assets.mjs)) and are committed.
- **Cloudflare delivery**: [wrangler.jsonc](wrangler.jsonc) (the whole deploy config) and
  [public/_headers](public/_headers) (cache and security headers).
- **Quality scripts**: [scripts/](scripts/) — zero dependencies, they use Node and the
  Chrome installed on the machine.

## Frequent tasks

- **Add a product**: copy its photos to `src/assets/products/`, add ONE object to the array
  in `src/data/products.ts`. The product page, the index and the sitemap are generated. The
  `corto` field is the page's meta description: 160 characters max (the build fails above).
- **Change a phone number or the WhatsApp**: edit `src/site.config.ts`.
- **Change the tagline, the colors or the hero photo**: edit where it belongs and run
  `npm run brand` to regenerate the link-preview image and the icon.
- **Enable the contact form**: create a free access key at [web3forms.com](https://web3forms.com)
  with the contact email and paste it into `web3formsKey` in `src/site.config.ts`. While it
  is empty the form is not rendered (the contact page keeps working with WhatsApp/email).
- **Change the domain**: edit `url` in `src/site.config.ts` and the `routes` block of
  `wrangler.jsonc`, then push; canonical, sitemap and robots.txt follow, and Cloudflare
  creates the DNS records and the certificate of the new domain (see "Publishing").

## Publishing

**The golden rule: a push to `main` is the publish button.** Cloudflare Workers Builds
(Cloudflare's CI/CD connected to the repo; how to connect it is in the runbook of
[PLAN.md](PLAN.md)) installs the dependencies, runs `npm run check && npm run build` (with
the link/meta `postbuild` gate: if it fails, nothing is deployed) and publishes the Worker.
There is no GitHub workflow and no secret to create or rotate: Cloudflare mints its own
token. A full build takes about a minute and the log ends with
`Deployed cbmltdawebsite26 triggers`.

- **Branches other than `main`** produce a Worker *version* with no traffic, not a deploy:
  the bot's "Deployment successful" comment on a PR does not mean it is live. There is a
  preview link only once Preview URLs are enabled (runbook).
- **After every deploy**: `npm run verify` (while the domain still points at WordPress,
  `npm run verify -- https://cbmltdawebsite26.<account>.workers.dev`). CI does not run
  it.
- **Manual deploy** (first deploy or debugging): `npx wrangler login` once, then
  `npm run deploy`. Same `wrangler.jsonc`, same result as a Cloudflare build.
- **Pre-flight without logging in**: `npx wrangler deploy --dry-run --outdir /tmp/wr`
  validates the config and lists the ignored assets; `npx wrangler dev --port 8790` serves
  `dist/` through the real runtime to test the trailing-slash redirect (307), the custom
  404 and the `_headers` output.
- **Custom domain**: declarative, in the `routes` block of `wrangler.jsonc` (commented out
  today: cbmltda.com.co still points at WordPress and its DNS is at DigitalOcean). When
  WordPress is to be switched off: move the DNS zone to Cloudflare, uncomment `routes` and
  push; that deploy creates the DNS records and the certificate. Then come the zone
  settings of the runbook (Always Use HTTPS, www → root redirect, the scripts the zone
  injects).
- **Rollback**: `git revert` the commit and push.

## Documents

- [PLAN.md](PLAN.md) — living plan: what is done, what is pending and the runbook of manual
  actions (connect Workers Builds, move the DNS, zone settings, etc.).
- [GUIA-PARA-CBM.md](GUIA-PARA-CBM.md) — one-page guide for the owner, in Spanish, with
  nothing technical.
- [AGENTS.md](AGENTS.md) — rules for every assistant (`asistente.command` makes Antigravity
  CLI read it first; `CLAUDE.md` is a symlink for Claude Code): operation mode for the owner,
  and a pointer to development mode. Kept under 12,000 characters, Antigravity's limit per
  rules file.
- [DEVELOPMENT.md](DEVELOPMENT.md) — the developer reference: stack, invariants, repo map,
  procedures, lessons and the publishing rule. `asistente.command` (macOS) and
  `asistente.cmd` (Windows) open Antigravity CLI with a double click, with automatic
  approval of every action and a first message that loads AGENTS.md.
