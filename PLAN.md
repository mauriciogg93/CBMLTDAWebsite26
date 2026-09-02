# PLAN.md — living plan of the project

Legend: `[x]` done · `[ ]` pending · 🤖 the assistant does it · 🧑 only the human can
(see the runbook below) · 🤝 the human provides the data and the assistant applies it.

## 1. Technical foundation

- [x] 🤖 Astro 7 + Tailwind 4 + sitemap scaffold, strict TypeScript
- [x] 🤖 `trailingSlash: 'always'` + `build.format: 'directory'` + robots.txt endpoint
- [x] 🤖 Data architecture: `site.config.ts` + `src/data/*` as the single source
- [x] 🤖 `wrangler.jsonc` (Workers static assets); CI/CD by Cloudflare Workers Builds, no
      GitHub workflow and no GitHub secrets (template v2.2)
- [x] 🤖 Quality scripts from the template: `postbuild` (links, anchors, `<title>`, metas ≤ 160),
      `verify`, `shots`, `brand`; `.node-version` so CI uses the same Node
- [x] 🤖 Cache and security headers (`public/_headers`). Pre-flight with
      `wrangler deploy --dry-run` and `wrangler dev`
- [x] 🤖 `check` and `build` green with the `postbuild` free of warnings

## 2. Real content (migrated from cbmltda.com.co on 2026-08-31)

- [x] 🤖 26 products with descriptions, features, images and videos from the WordPress site
- [x] 🤖 6 categories, 9 client logos, 2 image catalogs (17 scanned pages)
- [x] 🤖 Contact data: address, landline, mobile/WhatsApp, email
- [x] 🤖 Support-material page (2 YouTube how-to videos)
- [x] 🤖 Link-preview image (`og.jpg`) and home-screen icon, generated from the tokens and the
      TBM EP100 photo (`npm run brand`)
- [x] 🤖 Review of the migrated copy: accents (más, pérdidas, catálogo, Semiautomática), raw
      URLs moved to "Más información" (TBM, ECB test), dead Bosch link removed, strap supplier
      named without a link (ciaempaques.com.co does not answer). The remaining 40 external
      links and the 3 YouTube videos answer

### Markers and data to confirm with CBM

| Pending | Where it shows | What to ask for |
| --- | --- | --- |
| `[PENDIENTE: revisión del texto legal…]` | `/politica-de-datos/` | CBM (or their lawyer) reviews the base text of the privacy policy |
| WhatsApp of the CTA | Every green button | Confirm that 312 296 2040 receives customer WhatsApp messages |
| Empty `web3formsKey` | `/contactenos/` (hidden form) | Decide whether to enable the form (runbook R7) |
| Password-protected page "Material Apoyo TBM EP100" | Not migrated | It was password-protected in WordPress; decide whether it is needed and with what content |

## 3. Page-by-page review

- [ ] 🤝 Homepage: review the hero and services copy (written from the original site)
- [ ] 🤝 `/productos/` and the 26 product pages: review prices/availability if they are to be shown
- [ ] 🤝 `/catalogos/`: are the 2022 catalogs still current? If there are new PDFs, the images get replaced
- [ ] 🤝 `/politica-de-datos/`: approve the legal text
- [ ] 🤝 Link preview: look at `public/og.jpg` (TBM EP100 photo + tagline); for another photo or
      text, change `scripts/brand-assets.mjs` / `site.config.ts` and regenerate

## 4. Design and quality

- [x] 🤖 Mobile-first, accessible mobile menu (Escape, aria), skip link, visible focus
- [x] 🤖 Images optimized by Astro (WebP, ~20 MB → what each page needs)
- [x] 🤖 Metas ≤ 160 characters on all 33 pages; catalog anchors verified
- [x] 🤖 "(abre en una pestaña nueva)" hint for screen readers on external links
- [x] 🤖 Mobile Lighthouse on the local build (2026-09-01): 100/100/100/100 on the homepage,
      /productos/, /catalogos/ and /contactenos/; product pages 100/100/96/100 (the 96 in best
      practices is the cookie set by the YouTube embed, see open decisions)
- [x] 🤖 AA contrast of the green WhatsApp button (4.1:1 → 5.5:1); CLS 0 on product pages
      (photos and logos reserve their space before loading)
- [x] 🤖 Basic SEO: title/description per page, canonical, Open Graph with image and
      dimensions, twitter:card, theme-color, Store JSON-LD with image and map; on every
      product page Product JSON-LD (with brand) + BreadcrumbList and og:image with the product photo
- [x] 🤖 Business H1 on the homepage ("Contadoras de billetes, monedas y zunchadoras en
      Medellín"); the TBM EP100 stays as the flagship product with photo, caption and button
- [x] 🤖 Floating WhatsApp button in the dark green of the CTAs (white icon 5.5:1)
- [x] 🤖 Dependencies up to date: wrangler 4.128. TypeScript stays on 6.x because 7 is not
      compatible with `astro check` (@astrojs/check 0.9). `npm audit` clean
- [ ] 🤖 Repeat Lighthouse against the published URL
      (`npx lighthouse <url> --output=json --output-path=./lh.json --chrome-flags="--headless=new"`)

## 5. Go-live (Cloudflare Workers)

- [ ] 🧑 R1: connect the repo to Cloudflare Workers Builds (it makes the first deploy)
- [ ] 🤖 Post-deploy verification: `npm run verify -- https://cbmltda.<account>.workers.dev`
- [ ] 🤝 Review the site on workers.dev and decide when to switch WordPress off
- [ ] 🧑 R2: move the DNS of cbmltda.com.co to Cloudflare (at DigitalOcean today)
- [ ] 🤖 Enable the `routes` block of `wrangler.jsonc` and push: that deploy creates the DNS
      records and the certificate for `cbmltda.com.co` and `www.cbmltda.com.co`
- [ ] 🧑 R3: zone settings after the first deploy with the domain (Always Use HTTPS, www → root)
- [ ] 🧑 R4: switch off the scripts the zone injects (JavaScript Detections, Web Analytics)
- [ ] 🤖 `npm run verify` all green with zero warnings; Lighthouse
- [ ] 🧑 R5 (optional): Preview URLs so PRs get a preview link
- [ ] 🧑 R6: Google Search Console with the new sitemap
- [ ] 🧑 R8: handover to the owner in operation mode (CBM's computer ready, assistant tested
      end to end, developer's contact in GUIA-PARA-CBM.md)

## 6. Post-launch

- [ ] 🤝 Redirects for old WordPress URLs (`/product/...`, `/product-category/...`) if Search Console shows relevant 404s
- [ ] 🤝 Update the catalogs when there is a new portfolio
- [ ] 🤖 Technical post-launch review (template §10): favicon in the final accent, `og:image`
      and touch icon answering 200, `/_headers` not public, headers, `npm outdated` /
      `npm audit`, injected scripts, `verify` without warnings
- [ ] 🤝 Content and UX review (template §10): hero subtitle ≤ 2 lines with the CTA above the
      fold at 390×844 · WhatsApp as the main channel with email and landline always visible ·
      prices and availability: show them or omit them on purpose, never "missing" · no
      contradictions between copy pieces

## Runbook (actions only the human can do)

- **R1 — Connect Workers Builds**: dash.cloudflare.com → Workers & Pages → Create → Workers →
  *Connect to Git* / *Import a repository* → authorize GitHub and pick `jacoboisaza/cbmltda`
  (a private repo needs the Cloudflare GitHub app granted on it) → the "Set up your
  application" form: **Project name** `cbmltda` (must equal `name` in `wrangler.jsonc`) ·
  **Build command** comes prefilled as `npm run build`: replace it with
  `npm run check && npm run build` · **Deploy command** `npx wrangler deploy` · *Builds for
  non-production branches* on · Advanced: non-production deploy command
  `npx wrangler versions upload` (default), Path `/`, **API token** "Create new token"
  (Cloudflare mints it), no variables → **Deploy**. It takes ~1 minute; the production log
  ends with `Deployed cbmltda triggers`. If the Worker already exists from a manual deploy,
  connect from Worker → Settings → Build. Report back: the last lines of the log and the
  `workers.dev` URL. (No `CLOUDFLARE_*` GitHub secrets exist in this flow.)
- **R2 — DNS to Cloudflare**: dash.cloudflare.com → Add a domain → `cbmltda.com.co` → Free
  plan → Cloudflare imports the existing records: check that the **email MX records**
  (contacto@cbmltda.com.co) and the A records of the current WordPress are there → at the
  domain registrar, change the nameservers from DigitalOcean to the two `*.ns.cloudflare.com`
  it shows → wait for activation (Cloudflare email; `dig NS cbmltda.com.co`). WordPress keeps
  serving meanwhile. Report back: the assistant enables `routes` and pushes when the order to
  switch WordPress off is given.
- **R3 — Zone: HTTPS and www** (after the first deploy with the domain, two minutes):
  SSL/TLS → Edge Certificates → **Always Use HTTPS** on. Rules → **Overview** (not Rules →
  Settings, that tab is Bulk Redirects) → Create rule → Redirect Rule → template *"Redirect
  from WWW to Root"* → replace `example.com` with `cbmltda.com.co` → Deploy. Report back: the
  assistant runs `npm run verify` and expects every check green (the first run, before this
  step, fails exactly on https and www).
- **R4 — Zone: injected scripts**: Security → Bots → **JavaScript Detections** off (and Bot
  Fight Mode if unwanted); Analytics & Logs → **Web Analytics** → disable, or keep it
  (cookie-free) and say so. The assistant re-runs `verify` (script count) and Lighthouse.
  Traffic numbers stay available without any script in the zone's HTTP analytics.
- **R5 — Preview URLs (optional)**: Worker `cbmltda` → Settings → Domains & Routes → enable
  the `workers.dev` subdomain and Preview URLs. Without this a PR has no preview link (the
  bot still says "Deployment successful", but it is a version with no traffic).
- **R6 — Search Console**: search.google.com/search-console → add the domain property →
  submit `https://cbmltda.com.co/sitemap-index.xml`. Check "Pages not indexed" to decide on
  301 redirects for the old WordPress URLs.
- **R7 — Form**: web3forms.com → Create Access Key with contacto@cbmltda.com.co → paste the
  key into `web3formsKey` in `src/site.config.ts` (or hand it to the assistant).
- **R8 — Handover to the owner (operation mode)**: on CBM's computer install Git, Node 24
  (the one in `.node-version`), Google Chrome and Antigravity CLI (macOS:
  `curl -fsSL https://antigravity.google/cli/install.sh | bash`; Windows, in PowerShell:
  `irm https://antigravity.google/cli/install.ps1 | iex`, plus Git for Windows and the Node 24
  installer; Gemini CLI stopped serving individual users on 2026-06-18) and sign in once with
  the owner's Google account (run `agy` and follow the sign-in; check the quota of that
  account with `/usage`) → clone the repo, `npm install`, then `npm run doctor` and
  `npm run build` green (the doctor checks tools, access and configuration; it pushes nothing) → push
  permission: that computer's SSH key as a *deploy key* with write access, or the owner as a
  collaborator (on Windows the easiest: HTTPS with the Git Credential Manager that Git for
  Windows bundles, a browser sign-in on the first push), and the owner's
  `git config user.name` / `user.email` → test `git push` with a trivial change → open
  `asistente.command` (macOS) or `asistente.cmd` (Windows) (it launches
  `agy --dangerously-skip-permissions` with a first message
  that makes the assistant read AGENTS.md and greet the owner in Spanish; no confirmation
  prompt should appear, and if one does, allow it) and ask for a real change end to end until
  it is published → write the developer's contact in GUIA-PARA-CBM.md. If the assistant ever
  answers like a generic helper (offers analytics, asks which technology the site uses), it
  was started without the launcher: close it and double-click the launcher again.
  Prerequisite: R1 done and the domain live (or the owner reviews on workers.dev).

## Requests for the developer

The assistant in operation mode records here what the owner asked for that is neither
content nor its layout on a page (design, new pages, forms, integrations) and the changes it
could not publish (with the `pendiente/…` branch and the technical details). Empty = nothing
pending.

## Open decisions

| Topic | Status |
| --- | --- |
| When to switch WordPress off and point the domain? | Pending on the human after reviewing the site on workers.dev (R1) and moving the DNS (R2) |
| 301 redirects for old URLs? | Wait for Search Console data; the Worker can add them if needed |
| Show prices or availability on product pages? | Pending on CBM; omitted on purpose today |
| YouTube embeds | The iframe (youtube-nocookie) sets a cookie and lowers Best Practices to 96 on product pages with a video. A facade (thumbnail + click) avoids it but needs a small script, and today the only JS is the menu |
| Opening hours, social networks, testimonials and figures | Decided on 2026-09-01: not published. The site promises no schedule ("un asesor le responde en horario laboral"), the JSON-LD carries no `openingHours` or `sameAs`, and the social proof is the client logos. Do not ask for them again |

## Iteration log

- **2026-08-31** — Full initial migration from WordPress: 33 pages built (homepage, catalog
  with 26 product pages, catalogs, support material, contact, privacy policy, 404), CI/CD to
  Cloudflare Workers, documentation. `check` + `build` green, internal links verified.
- **2026-09-01** — Icons moved to a standard library (astro-icon + Iconify, Lucide and Simple
  Icons sets, inline SVG at build time with no client JS): WhatsApp (button and floating),
  mobile menu, and replacement of the clipart PNGs of the homepage services/satisfaction
  blocks. Cleanup of 9 orphan images in `src/assets/` (the whole `home/` folder, 2 duplicate
  logos, 1 unreferenced product photo). `check` + `build` green.
- **2026-09-01** — Sync with template v2.2 (`static-site-template`): CI/CD moves from GitHub
  Actions with secrets to Cloudflare Workers Builds (workflow removed, the domain's `routes`
  ready but commented out); `postbuild`, `verify`, `shots` and `brand` scripts;
  `public/_headers`, `.assetsignore` and security headers also in `.htaccess`; `og:image` +
  `apple-touch-icon` generated; new-tab hints. The new `postbuild` surfaced, and got fixed:
  7 metas longer than 160 characters, the broken `/productos/#zuncho` anchor (the strap and
  the metal seal were under "Zunchadoras"), the text glued to the email on the privacy page
  and "WhatsApp:" glued to the number in the footer; the screenshots (`npm run shots`) showed
  a long URL overflowing the TBM EP100 page on desktop and mobile (`wrap-anywhere`).
  Validated with `wrangler deploy --dry-run`, `wrangler dev` and desktop/mobile screenshots.
- **2026-09-01** — UX/SEO review with Lighthouse (mobile, local build) and more: AA contrast of
  the green CTA; CLS 0 on product pages; per-product og:image (JPG 1200 px or palette PNG
  800 px, ≤ 143 KB, declared dimensions) + Product and BreadcrumbList JSON-LD; theme-color,
  twitter:card, Store with image and map; accents and raw URLs in the migrated copy; dead
  link removed; every external link and video verified; `npm audit` clean. Result:
  100/100/100/100 on the main pages, product pages 100/100/96/100.
- **2026-09-01** — Recommended improvements applied: business H1 on the homepage with the
  TBM EP100 as the flagship product, floating button in dark green (3:1 for icons), wrangler
  4.128 and lockfile regenerated from scratch (`npm install` had dropped `@emnapi/*`, which
  `npm ci` needs on Linux). TypeScript 7 tried and discarded: `astro check` rejects it.
  Homepage 100/100/100/100 on mobile Lighthouse.
- **2026-09-01** — Handover harness: AGENTS.md starts in operation mode (the owner asks for
  content in their own words; the assistant changes, verifies, commits and pushes, and
  answers without technical vocabulary) and reserves development mode for the developer.
  `GEMINI.md` symlink to AGENTS.md, `.gemini/settings.json` with the allowed commands,
  `asistente.command` to open it with a double click, GUIA-PARA-CBM.md for the owner, R8
  with the handover checklist and the requests section. Everything specific to one
  assistant was generalized.
- **2026-09-01** — Cleanup: removed TEMPLATE-PROMPT.md (spec already folded into AGENTS.md
  and scripts), the Apache hosting plan B (`.htaccess`, `.assetsignore`, `npm run package`),
  `.env.example` (Workers Builds uses no secrets), LICENSE (the template's MIT; a client site
  keeps all rights reserved), `.vscode/launch.json` and the empty `src/icons/`. `check` +
  `build` green without warnings.
- **2026-09-01** — Language rule: site copy stays Spanish; docs, code comments, config,
  scripts and commit messages translated to English. GUIA-PARA-CBM.md stays Spanish because
  it is for the owner. Identifiers untouched.
- **2026-09-01** — Assistant switched to Antigravity CLI (`agy`): Gemini CLI stopped serving
  individual users on 2026-06-18. `agy` reads AGENTS.md by itself, so `GEMINI.md` and
  `.gemini/settings.json` are gone; the launcher runs `agy --dangerously-skip-permissions`.
  AGENTS.md trimmed to operation mode plus a pointer (Antigravity caps rules files at 12,000
  characters) and the developer reference moved to DEVELOPMENT.md. Verified with agy 1.1.24 in
  print mode: it does not load AGENTS.md on its own (a plain owner question got a generic
  answer offering analytics and asking about the site's technology), so the launcher's first
  message makes it read the file; with that, a second turn stayed in operation mode.
- **2026-09-01** — Windows support for the handover: `asistente.cmd` launcher, `.gitattributes`
  (LF everywhere, CRLF for the .cmd), `scripts/shrink-image.mjs` replaces macOS-only `sips`,
  per-platform Chrome path in `scripts/lib/chrome.mjs`, operation-mode commands one at a time
  (Windows PowerShell 5 rejects `&&`), R8 and the owner's guide cover both systems. The .cmd
  could not be run here (no Windows machine); it is part of the R8 end-to-end test.
- **2026-09-01** — Operation mode widened to the layout of the content: the owner can now
  ask to move, add or remove blocks on a page (a button next to a photo, an image as a link,
  section order, a paragraph, a card, a whole section), not only edit text. AGENTS.md §1.4
  fixes the rules: build only with the existing components and class lists, keep h1/headings,
  alt, eager/lazy, anchors and `SITE` data, and add a visual check to the verification
  (`npm run preview -- --background`, `npm run shots -- capturas …`, `npm run preview --
  stop`; `capturas/` gitignored). Design, new pages, forms and integrations stay with the
  developer. GUIA-PARA-CBM.md updated. AGENTS.md stays under 12,000 characters.
- **2026-09-01** — First structural change under the new rules, the owner's pending request:
  on the homepage hero the TBM EP100 block (photo, caption, "Ver la contadora TBM EP100"
  button) is now one link to the product page, in the pattern of a `TarjetaProducto` card
  (`group`, hover scale, button as a `<span>` with `group-hover:`), and the text column keeps
  only the WhatsApp CTA. `check` + `build` green; desktop and mobile screenshots reviewed. The
  test refined AGENTS.md §1.4 (span instead of nested link, `hover:` → `group-hover:`).
- **2026-09-02** — `npm run doctor` (`scripts/doctor.mjs`, zero dependencies, macOS / Windows /
  Linux): checks the machine the assistant runs on — Node against `.node-version` and the
  `brand` minimum, npm, git, headless Chrome, `agy` / `claude`, the launchers, `node_modules`
  and `sharp`, the `@emnapi` lockfile entries, `CLAUDE.md` as a symlink (Windows checkouts
  without `core.symlinks` turn it into a text file), git identity, origin, branch and clean
  tree, network, read and write access to origin (`git push --dry-run`, nothing pushed) and
  port 4321. AGENTS.md asks for its output in the developer note when a tool, an access or the
  publishing fails; R8 runs it on the owner's computer. Tested on macOS only; the Windows and
  Linux branches are part of the R8 end-to-end test.
