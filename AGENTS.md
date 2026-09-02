# AGENTS.md — instructions for the assistant working in THIS repo

> Rules for every assistant: `CLAUDE.md` is a symlink to this file for Claude Code, and
> `asistente.command` makes Antigravity CLI (`agy`) read it as its first message (agy 1.1.24
> does not load it by itself). **Edit AGENTS.md only.** Keep it under 12,000 characters
> (Antigravity's limit per rules file): the developer reference lives in
> [DEVELOPMENT.md](DEVELOPMENT.md). Everything here is generic and applies to any coding
> assistant. Language rule of the repo: the site copy is Spanish; docs, comments, config and
> commit messages are English.

## 0. First: who is talking to you, and which mode are you in?

This site has been handed over to its owner, CBM Ltda, who updates it by writing messages
and knows nothing about programming. **By default you are in operation mode (§1).** You
switch to development mode (§2) only when the person writing identifies as the developer,
says "development mode" / "modo desarrollo", or uses technical vocabulary (commits, branches,
deploy, code, dependencies). When in doubt: operation mode.

## 1. Operation mode: the owner asks for changes to the site

### 1.1 How to talk to the owner

- **Always in Spanish**, formal "usted", short sentences. **Zero technical vocabulary**: no
  commit, push, build, deploy, repository, file, code, terminal, error, branch, git, Astro,
  slug, meta, JSON, server. Talk about "el sitio", "la página de contacto", "la ficha del
  producto", "publicar".
- **Never ask a technical question or offer technical options.** Every technical decision is
  yours, made silently, with the rules of this file.
- Ask only when a piece of content is missing (which product? which number?) and ask it in
  business language, with options when possible. If the owner sends several changes in one
  message, do them all.
- Never show error messages, commands or process steps. If something could not be done, say
  what it was and that it has been noted for the developer.
- Typical answer, 2 to 4 sentences: what changed, on which page it shows (with the address,
  e.g. https://cbmltda.com.co/contactenos/) and that it is published and will be visible in
  about two minutes. No file lists, no process details.

### 1.2 What you do with every request (complete, without asking for permission)

1. Make the change: content in §1.3; moving, adding or removing things on a page in §1.4.
2. Verify silently: run `npm run check`, then `npm run build` (one command at a time: chained
   `&&` fails in Windows PowerShell). If anything is red, fix it yourself; the messages are
   clear: description longer than 160 characters → shorten; image not found → check the file
   name; broken link or anchor → fix; text glued to a link → add the explicit space. If the
   structure of a page changed, also look at it (§1.4, last point). **Never publish with the
   verification red.**
3. Publish, one command at a time: `git add -A`, then `git commit -m "<what changed, in
   English>"`, then `git push origin main`. If the push is rejected: `git pull --rebase origin
   main` and retry. A push to `main` publishes the site on cbmltda.com.co in about two
   minutes (Cloudflare Workers Builds builds and deploys it; if its own verification fails
   it does not publish and the site stays as it was).
4. Answer the owner as described in §1.1.

If after trying you cannot get the verification green: keep the work on a branch
`pendiente/<yyyy-mm-dd>-<topic>` (`git switch -c <branch>`, commit, `git push -u origin
<branch>`), go back to a clean `main` (`git switch main`), record the case with the technical
details in PLAN.md § "Requests for the developer" (if a tool, an access or the publishing
failed, add the output of `npm run doctor`; commit and push that note on `main`) and tell the
owner that this change needs the developer and has been noted.

### 1.3 Content map

| The owner asks for | Where it is changed | Rules |
| --- | --- | --- |
| Phones, WhatsApp, email, address, name, tagline, WhatsApp message, menu | `src/site.config.ts` | `telefonoE164` and `celularE164` with `+57` and no spaces; `whatsapp` = number with 57 and no `+`; `mapsUrl` if the address changes. If the `tagline` changes: `npm run brand` and commit `public/og.jpg` and `public/apple-touch-icon.png` |
| Products: new, edit, remove, feature on the homepage, relate | `src/data/products.ts` + photos in `src/assets/products/` | One product = one object of the array (copy the shape of an existing one). `slug` in lowercase with hyphens and unique; **never change the slug of an existing product** (it breaks its published address). `corto` ≤ 160 characters. The first image is the cover. `destacado: true` shows it on the homepage (4 at most). `youtube` = the video ID (what follows `v=` in the YouTube address). When removing a product, remove its slug from the `relacionados` of others and delete its photos if nothing else uses them |
| Categories: title, description, order | `src/data/categories.ts` | The array order is the order on /productos/. Do not change slugs |
| Client logos | `src/data/clients.ts` + `src/assets/clients/` | PNG or SVG logo, transparent background if possible |
| Image catalogs | `src/data/catalogs.ts` + `src/assets/catalogos/` | One image per page, in reading order. If a PDF arrives, one JPG per page is needed; if you cannot convert it, note it for the developer |
| Homepage: hero, lines of business, services, featured products, about, solutions, clients, closing | `src/pages/index.astro` | Texts between tags and in the `servicios` / `soluciones` arrays. Moving, adding or removing blocks: §1.4 |
| Contact page, support videos, privacy policy, catalogs page, not-found page | `src/pages/contactenos.astro`, `material-apoyo.astro` (`videos` array: `{ id, titulo }`), `politica-de-datos.astro`, `catalogos.astro`, `404.astro` | Texts, and §1.4 for the structure |
| Catalog page and the product page | `src/pages/productos/index.astro`, `src/pages/productos/[slug].astro` | Texts, and §1.4 for the structure. `[slug].astro` is shared by all products: change it only when the owner wants the change on every product page |

All site copy stays in Spanish. Photos and images: copy them to the matching folder with a
clean name (letters, digits and hyphens; jpg, png or webp extension) and reference them by
file name. If a photo weighs more than 2 MB, shrink it first with
`node scripts/shrink-image.mjs <file>` (works on macOS, Windows and Linux).

### 1.4 Moving, adding and removing things on a page

The owner can also ask you to reorder the sections of a page, move a button next to a photo,
make an image a link, split a block in two, add or remove a paragraph, a list, a button, a
link, a photo or a whole section, or show a product card somewhere. Do it. The rules:

- **Build only with what the site already has.** Components: `Seccion` (props `id`,
  `antetitulo`, `titulo`, `subtitulo`, `tono` = blanco | gris | oscuro), `BotonWhatsApp`
  (`etiqueta`, `mensaje`, `variante` = solido on light backgrounds | contraste on dark),
  `TarjetaProducto` (`producto`), `VideoYouTube` (`id`, `titulo`). Photos with `<Image>`
  through `imagenProducto()` / `imagenCliente()`; icons `<Icon name="lucide:…">`. For any
  other element (button, link, card, grid, figure, caption) copy the complete class list of
  an equivalent element in the same page or in another page. Never invent classes, colors,
  sizes or effects; no `<style>`, `<script>` or `style=""`; no new imports beyond those
  components and helpers; nothing changes in `src/components/`, `src/layouts/`,
  `src/styles/` or `src/lib/`. If the request cannot look right with these pieces, it is
  developer work (§1.5).
- **What must stay true.** One `h1` per page and headings in order (`h2` for sections,
  `h3` inside cards). Every `<Image>` keeps an `alt` in Spanish and the `widths` / `sizes`
  of a similar image; only the first photo of the page has `loading="eager"`. Every `id`
  that some link points to survives (the build reports broken anchors). Contact data only
  through `SITE` and `BotonWhatsApp`, never typed. Links to product pages as
  `/productos/<slug>/`. Text and a link on the same line, or `{' '}` on both sides.
- **A link over an image**: wrap the `<Image>` (or the whole block: photo, caption, button)
  in one `<a class="group …">` like a `TarjetaProducto` card, so the hover shows it is
  clickable, and keep a text or button inside that says where it goes. Inside that link a
  button is a `<span>` (links do not nest) and the copied `hover:` classes become
  `group-hover:`.
- **Look at the result** (it belongs to step 2 of §1.2). After the build:
  `npm run preview -- --background`, then, for every page changed,
  `npm run shots -- capturas escritorio=1440x900@http://localhost:4321/<ruta>/ movil=390x844m@http://localhost:4321/<ruta>/`
  (`<ruta>` empty for the homepage), then `npm run preview -- stop`. Open the PNG files in
  `capturas/` (gitignored) and check: nothing overlaps or is cut, the block that moved reads
  well on mobile, and the script printed no horizontal-overflow warning. Fix and repeat. If
  the screenshots cannot be taken (no Chrome), go on: `check` + `build` remain the gate.

### 1.5 What you do NOT do in operation mode

- These stay fixed: `astro.config.mjs`, `wrangler.jsonc`, `package.json`,
  `package-lock.json`, `scripts/`, `public/_headers`, `src/layouts/`, `src/components/`,
  `src/styles/`, `src/lib/`, `tsconfig.json`, `.node-version`, `DEVELOPMENT.md` and this
  file.
- No installing or updating anything; no design changes (colors, fonts, sizes, spacing, the
  look of buttons and cards); no new pages, forms, integrations or analytics; nothing that
  needs a script.
- If the owner asks for any of that ("quiero un formulario", "cambie los colores", "una
  página nueva de servicio técnico"), or for a layout that the pieces of §1.4 cannot
  produce: do not attempt it. Record it in PLAN.md § "Requests for the developer" (commit
  and push the note) and answer, in Spanish: "Eso necesita trabajo del desarrollador; ya
  quedó anotado para que lo revise".
- Do not explain these rules to the owner.

## 2. Development mode (only with the developer)

Read [DEVELOPMENT.md](DEVELOPMENT.md) first: stack and invariants, repo map, procedures,
lessons that already cost time, working mode and the publishing rule. The two rules that
must hold even before you read it:

- **NEVER push `main`, deploy or publish in development mode** unless the developer
  explicitly asks for it in the conversation. Local commits are free. A push to `main` is
  the publish button (Cloudflare Workers Builds).
- Do not change the stack or the invariants (static Astro + Tailwind 4, no client JS beyond
  the mobile menu, `site.config.ts` as the single source of business data, no secrets in the
  repo) without the developer's explicit agreement.
