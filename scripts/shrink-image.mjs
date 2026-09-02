// Shrink a photo in place so its longest side is at most 1600 px (or the given size), keeping
// its format. Cross-platform (macOS, Windows, Linux): it uses the sharp that Astro already
// installs, so there is nothing else to install.
//   node scripts/shrink-image.mjs <file> [maxPx]
import { renameSync } from 'node:fs';
import sharp from 'sharp';

const [file, max = '1600'] = process.argv.slice(2);
if (!file) {
  console.error('usage: node scripts/shrink-image.mjs <file> [maxPx]');
  process.exit(1);
}
const tmp = file.replace(/(\.[^./\\]+)$/, '.tmp$1');
const info = await sharp(file)
  .rotate() // apply the EXIF orientation so the file is upright everywhere
  .resize({ width: +max, height: +max, fit: 'inside', withoutEnlargement: true })
  .toFile(tmp);
renameSync(tmp, file);
console.log(`${file}: ${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB`);
