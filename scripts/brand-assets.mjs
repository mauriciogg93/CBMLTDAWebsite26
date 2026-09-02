// Brand assets rendered from the site's own tokens, copy and photos — no design tool, no
// new dependency: an HTML card is laid out with the palette (global.css), the copy
// (site.config.ts) and the flagship product photo, then rasterized by the local Chrome
// (lib/chrome.mjs).
//   npm run brand   → public/og.jpg (1200×630 link preview) + public/apple-touch-icon.png (180×180)
// Re-run after changing the tagline, the accent color, the photo or the favicon, then commit
// both files. Requires Node ≥ 22.18 (imports site.config.ts directly).
// Why: a link shared on WhatsApp/LinkedIn/Slack shows no image without og:image, and
// iOS/Android home-screen icons ignore favicon.svg.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { launchChrome } from './lib/chrome.mjs';

// ---- Project knobs (the only thing edited when copying the script) -----------------------
// Web fonts as package paths to woff2 files (null = the system stack, like the site itself).
const DISPLAY_FONT = null;
const LABEL_FONT = null;
// Token names as declared in src/styles/global.css (`--color-<name>`), with fallbacks.
const TOKENS = { bg: 'marca-50', fg: 'marca-900', muted: 'marca-700', accent: 'acento-600', tile: 'marca-600' };
const DEFAULTS = { bg: '#eef0fb', fg: '#171a4a', muted: '#262a7d', accent: '#096773', tile: '#2d3194' };
// Photo on the right of the card (no extension; jpg/jpeg/png/webp; no file = text only).
// 'retrato' crops it full-bleed in grayscale; 'producto' shows it whole and in color.
const PHOTO = 'src/assets/products/TBM_24';
const PHOTO_STYLE = 'producto';
// Site fields used on the card: big line, small line under it, eyebrow above.
const pick = (site) => ({
  headline: site.tagline ?? site.nombre,
  wordmark: site.nombre,
  eyebrow: `${site.ciudad} · desde ${site.fundacion}`,
});
// -----------------------------------------------------------------------------------------

const root = process.cwd();
const { SITE } = await import(pathToFileURL(join(root, 'src/site.config.ts')).href);
const copy = pick(SITE);

const css = readFileSync(join(root, 'src/styles/global.css'), 'utf8');
const declared = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{3,8})/g)].map((m) => [m[1], m[2]]));
const color = Object.fromEntries(
  Object.entries(TOKENS).map(([k, name]) => {
    if (!declared[name]) console.warn(`brand: --color-${name} not found in global.css, using ${DEFAULTS[k]}`);
    return [k, declared[name] ?? DEFAULTS[k]];
  }),
);

// Fonts and the photo are inlined as data URIs: a file:// page cannot load them otherwise.
const dataUri = (path, type) => `data:${type};base64,${readFileSync(path).toString('base64')}`;
const fontFace = (family, pkgPath) =>
  pkgPath ? `@font-face { font-family: "${family}"; src: url(${dataUri(join(root, 'node_modules', pkgPath), 'font/woff2')}) format("woff2-variations"); font-weight: 100 900; }` : '';
const display = DISPLAY_FONT ? '"BrandDisplay", ' : '';
const label = LABEL_FONT ? '"BrandLabel", ' : '';
const photoFile = ['jpg', 'jpeg', 'png', 'webp'].map((ext) => join(root, `${PHOTO}.${ext}`)).find(existsSync);
const photo = photoFile ? dataUri(photoFile, 'image/' + (photoFile.endsWith('png') ? 'png' : photoFile.endsWith('webp') ? 'webp' : 'jpeg')) : null;
const favicon = readFileSync(join(root, 'public/favicon.svg'), 'utf8').replace(/<style>[\s\S]*?<\/style>/, '');

const escape = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
const host = new URL(SITE.url).host;
const photoCss =
  PHOTO_STYLE === 'retrato'
    ? 'right: 0; top: 0; width: 439px; height: 630px; object-fit: cover; filter: grayscale(1);'
    : 'right: 48px; top: 72px; width: 360px; height: 486px; object-fit: contain;';

// 1200×630 Open Graph card: eyebrow, headline with an accent period, wordmark + host;
// photo on the right (or a wider text column when there is no photo).
const og = `<!doctype html><meta charset="utf-8"><style>
  ${fontFace('BrandDisplay', DISPLAY_FONT)} ${fontFace('BrandLabel', LABEL_FONT)}
  html, body { margin: 0; }
  body { position: relative; width: 1200px; height: 630px; overflow: hidden; background: ${color.bg}; color: ${color.fg};
         font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; }
  .text { position: absolute; left: 72px; top: 72px; bottom: 72px; width: ${photo ? 640 : 1056}px; display: flex; flex-direction: column; justify-content: space-between; }
  .eyebrow { font-family: ${label}ui-monospace, monospace; font-weight: 700; font-size: 18px; line-height: 1.3; letter-spacing: 0.2em; text-transform: uppercase; color: ${color.muted}; }
  h1 { margin: 0; font-family: ${display}ui-sans-serif, system-ui, sans-serif; font-weight: 700; font-size: 80px; line-height: 1; letter-spacing: -0.03em; text-wrap: balance; }
  .accent { color: ${color.accent}; }
  .wordmark { margin: 0; font-family: ${label}ui-monospace, monospace; font-weight: 800; font-size: 22px; letter-spacing: 0.18em; text-transform: uppercase; }
  .url { margin: 12px 0 0; font-size: 22px; color: ${color.muted}; }
  .rule { position: absolute; left: 760px; top: 0; bottom: 0; width: 1px; background: color-mix(in srgb, ${color.fg} 15%, transparent); }
  .photo { position: absolute; ${photoCss} }
</style>
<div class="text">
  <p class="eyebrow">${escape(copy.eyebrow)}</p>
  <h1>${escape(copy.headline).replace(/\.$/, '')}<span class="accent">.</span></h1>
  <div><p class="wordmark">${escape(copy.wordmark)}</p><p class="url">${escape(host)}</p></div>
</div>
${photo ? `<div class="rule"></div><img class="photo" src="${photo}" alt="">` : ''}`;

// 180×180 apple-touch-icon: the favicon full-bleed on the brand color (iOS rounds the
// corners itself). The favicon carries its own colors; it is not recolored.
const icon = `<!doctype html><meta charset="utf-8"><style>
  html, body { margin: 0; }
  body { width: 180px; height: 180px; background: ${color.tile}; display: grid; place-items: center; }
  svg { width: 180px; height: 180px; display: block; }
</style>${favicon}`;

const work = join(tmpdir(), `brand-${host.replace(/[^\w.-]/g, '_')}`);
mkdirSync(work, { recursive: true });
writeFileSync(join(work, 'og.html'), og);
writeFileSync(join(work, 'icon.html'), icon);

const chrome = await launchChrome({ port: 9334, userDataDir: join(work, 'udd') });
try {
  const render = async (file, { width, height, format, quality }) => {
    const { cdp, close } = await chrome.open(pathToFileURL(join(work, file)).href, { width, height });
    await cdp.eval('(async () => { await document.fonts.ready; for (const img of document.images) { try { await img.decode(); } catch {} } })()');
    const shot = await cdp.send('Page.captureScreenshot', { format, ...(quality ? { quality } : {}), clip: { x: 0, y: 0, width, height, scale: 1 } });
    await close();
    return Buffer.from(shot.data, 'base64');
  };
  const ogOut = join(root, 'public', (SITE.ogImage || '/og.jpg').replace(/^\//, ''));
  writeFileSync(ogOut, await render('og.html', { width: 1200, height: 630, format: 'jpeg', quality: 88 }));
  console.log(`brand: ${ogOut} (1200×630${photo ? ', with photo' : ', text only'})`);
  const iconOut = join(root, 'public/apple-touch-icon.png');
  writeFileSync(iconOut, await render('icon.html', { width: 180, height: 180, format: 'png' }));
  console.log(`brand: ${iconOut} (180×180)`);
  if (!SITE.ogImage) console.warn('brand: set ogImage: "/og.jpg" in src/site.config.ts so BaseLayout emits the og:image tag');
} finally {
  chrome.kill();
}
