// Visual QA: full-page screenshots via the Chrome DevTools Protocol (see lib/chrome.mjs).
// Reports the page size and flags horizontal overflow. Output is split into 2400 px chunks.
// Lazy images are forced to load before the capture: otherwise every `loading="lazy"` photo
// below the fold comes out as a blank box and reads as a layout bug.
//   npm run shots -- <outDir> name=WxH[m]@url ...      (m = mobile emulation; append "|click:<selector>" to click first)
//   e.g. npm run shots -- /tmp/shots home=1440x900@http://localhost:4321/ menu=390x844m@http://localhost:4321/|click:#menu-button
import { mkdirSync, writeFileSync } from 'node:fs';
import { launchChrome, sleep } from './lib/chrome.mjs';

const [, , outDir, ...specs] = process.argv;
if (!outDir || specs.length === 0) {
  console.error('usage: node scripts/screenshots.mjs <outDir> name=WxH[m]@url ...');
  process.exit(1);
}
mkdirSync(outDir, { recursive: true });

const chrome = await launchChrome({ userDataDir: `${outDir}/udd` });
try {
  for (const spec of specs) {
    const m = spec.match(/^([^=]+)=(\d+)x(\d+)(m?)@(.+)$/);
    if (!m) { console.error('bad spec:', spec); continue; }
    const [, name, w, h, mobile, rawUrl] = m;
    const [url, clickSel] = rawUrl.split('|click:');
    const { cdp, close } = await chrome.open(url, { width: +w, height: +h, mobile: !!mobile });
    await sleep(1500); // fonts + entrance animation
    await cdp.eval(`(async () => {
      document.querySelector('astro-dev-toolbar')?.remove();
      const imgs = [...document.querySelectorAll('img[loading="lazy"]')];
      for (const img of imgs) img.loading = 'eager';
      await Promise.allSettled(imgs.map((img) => img.decode()));
      await document.fonts.ready;
    })()`);
    if (clickSel) {
      await cdp.eval(`document.querySelector(${JSON.stringify(clickSel)}).click(); 0`);
      await sleep(300);
    }
    const d = await cdp.eval('({sw: document.documentElement.scrollWidth, cw: document.documentElement.clientWidth, sh: document.documentElement.scrollHeight})');
    const chunk = 2400;
    const parts = Math.max(1, Math.ceil(d.sh / chunk));
    for (let i = 0; i < parts; i++) {
      const y = i * chunk;
      const height = Math.min(chunk, d.sh - y);
      const shot = await cdp.send('Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true,
        clip: { x: 0, y, width: +w, height, scale: 1 },
      });
      const file = parts > 1 ? `${outDir}/${name}-${i + 1}.png` : `${outDir}/${name}.png`;
      writeFileSync(file, Buffer.from(shot.data, 'base64'));
    }
    console.log(`${name}: viewport ${w}x${h}${mobile ? ' (mobile)' : ''} → page ${d.sw}x${d.sh}, ${parts} file(s)${d.sw > d.cw ? '  ⚠ HORIZONTAL OVERFLOW' : ''}`);
    await close();
  }
} finally {
  chrome.kill();
}
