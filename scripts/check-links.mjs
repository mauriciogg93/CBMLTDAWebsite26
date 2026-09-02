// Post-build checks over dist/**/*.html. Runs automatically after `npm run build`
// (postbuild) — locally AND in CI (Workers Builds / GitHub Actions), so a problem blocks
// the deploy. Zero dependencies.
//   1. Every root-relative href/src/srcset resolves to a file in dist/          (error)
//   2. Every #fragment (same page or /page/#id) points at an existing id         (error)
//   3. Every page has a <title> and a meta description                          (error)
//      <title> longer than 60 chars warns; description longer than 160 chars fails —
//      search results cut both, and the limit is fully under the project's control.
//   4. Inline elements glued to the next word (Astro whitespace collapse)       (warning)
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';

const dist = resolve('dist');
const TITLE_MAX = 60;
const DESCRIPTION_MAX = 160;

if (!existsSync(dist)) {
  console.error('check-links: dist/ not found — run `npm run build` first.');
  process.exit(1);
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

const htmlFiles = walk(dist).filter((f) => f.endsWith('.html'));
const attrPattern = /\b(?:href|src|srcset)=["']([^"']+)["']/g;
const problems = [];
const warnings = [];
let checked = 0;
let anchors = 0;

const decode = (s) => s.replace(/&amp;/g, '&').replace(/&#39;/g, '’').replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>');
const pageOf = (file) => '/' + relative(dist, file).split(sep).join('/');

function candidates(urlPath) {
  const clean = decodeURIComponent(urlPath.split('#')[0].split('?')[0]);
  const fsPath = join(dist, ...clean.split('/').filter(Boolean));
  if (clean.endsWith('/')) return [join(fsPath, 'index.html')];
  return [fsPath];
}

const htmlCache = new Map();
const read = (file) => {
  if (!htmlCache.has(file)) htmlCache.set(file, readFileSync(file, 'utf8'));
  return htmlCache.get(file);
};
const hasId = (file, id) => new RegExp(`\\sid=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(read(file));

// Astro collapses newline whitespace next to inline elements: "<a>Impossible Code</a>\n with"
// renders as "Codewith". Warn (never fail: CI must not block on a heuristic) when an inline
// element whose content ends in a non-space character is immediately followed by a letter.
const gluedPattern = /[^\s>]<\/(a|span|strong|em)>[A-Za-z]/g;

for (const file of htmlFiles) {
  const html = read(file);
  const page = pageOf(file);

  for (const match of html.matchAll(attrPattern)) {
    const raw = match[1];
    // srcset: "url 480w, url 960w" → each url
    const urls = raw.split(',').map((part) => part.trim().split(/\s+/)[0]);
    for (const url of urls) {
      const isFragmentOnly = url.startsWith('#');
      if (!isFragmentOnly && (!url.startsWith('/') || url.startsWith('//'))) continue; // only root-relative + same-page anchors
      let target = file;
      if (!isFragmentOnly) {
        checked += 1;
        const found = candidates(url).find((p) => existsSync(p) && statSync(p).isFile());
        if (!found) {
          problems.push(`${page} → ${url}`);
          continue;
        }
        target = found;
      }
      const hash = url.includes('#') ? url.slice(url.indexOf('#') + 1) : '';
      if (hash && target.endsWith('.html')) {
        anchors += 1;
        if (!hasId(target, decodeURIComponent(hash))) problems.push(`${page} → ${url} (no element with id="${hash}")`);
      }
    }
  }

  const title = decode(html.match(/<title>([^<]*)<\/title>/)?.[1] ?? '');
  const description = decode(html.match(/<meta name="description" content="([^"]*)"/)?.[1] ?? '');
  if (!title) problems.push(`${page}: missing <title>`);
  else if (title.length > TITLE_MAX) warnings.push(`${page}: <title> is ${title.length} chars (> ${TITLE_MAX}): "${title}"`);
  if (!description) problems.push(`${page}: missing meta description`);
  else if (description.length > DESCRIPTION_MAX) problems.push(`${page}: meta description is ${description.length} chars (> ${DESCRIPTION_MAX})`);

  for (const match of html.matchAll(gluedPattern)) {
    const start = Math.max(0, match.index - 30);
    warnings.push(`${page}: inline element glued to the next word — …${html.slice(start, match.index + 14).replace(/\s+/g, ' ')}… (put {' '} around the inline element)`);
  }
}

for (const w of warnings) console.warn(`check-links: warning — ${w}`);

if (problems.length > 0) {
  console.error(`check-links: ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  ${p}`);
  process.exit(1);
}

console.log(`check-links: ${checked} internal references and ${anchors} anchors OK across ${htmlFiles.length} pages; titles and descriptions within limits.`);
