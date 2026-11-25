import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';

const sharp = createRequire(new URL('../ai-website-cloner-template/package.json', import.meta.url))('sharp');
const directions = ['front', 'left', 'right', 'back'];
const actions = ['idle', 'walk', 'jump', 'hug', 'hold'];
const frames = {};
const sources = {};

function separator(projection, target, radius) {
  let best = Math.round(target);
  for (let i = Math.max(1, Math.floor(target - radius)); i < Math.min(projection.length - 1, target + radius); i++) {
    if (projection[i] < projection[best] || (projection[i] === projection[best] && Math.abs(i - target) < Math.abs(best - target))) best = i;
  }
  assert.equal(projection[best], 0, `图集中没有可用透明间隔: ${target}`);
  return best;
}

for (const expression of ['neutral', 'happy', 'shy', 'sad']) {
  const png = await readFile(new URL(`./assets/${expression}-atlas.png`, import.meta.url));
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 4);
  const rowProjection = new Uint32Array(info.height);
  for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
    if (data[(y * info.width + x) * 4 + 3] > 32) rowProjection[y]++;
  }
  const rows = [0, ...[1, 2, 3].map(n => separator(rowProjection, info.height * n / 4, info.height * .04)), info.height];
  sources[expression] = { width: info.width, height: info.height, sha256: createHash('sha256').update(png).digest('hex') };
  for (let row = 0; row < 4; row++) {
    if (row === 3 && expression !== 'neutral') continue;
    const columnProjection = new Uint32Array(info.width);
    for (let y = rows[row]; y < rows[row + 1]; y++) for (let x = 0; x < info.width; x++) {
      if (data[(y * info.width + x) * 4 + 3] > 32) columnProjection[x]++;
    }
    const columns = [0, ...[1, 2, 3, 4].map(n => separator(columnProjection, info.width * n / 5, info.width * .045)), info.width];
    for (let col = 0; col < 5; col++) {
      const region = { left: columns[col], top: rows[row], width: columns[col + 1] - columns[col], height: rows[row + 1] - rows[row] };
      const sprite = await sharp(png).extract(region).png().toBuffer();
      const stats = await sharp(sprite).stats();
      assert.ok(stats.channels[3].min === 0 && stats.channels[3].max === 255, `${expression}/${row}/${col} 透明度异常`);
      frames[`${directions[row]}:${expression}:${actions[col]}`] = { data: `data:image/png;base64,${sprite.toString('base64')}`, ...region };
    }
  }
}

const reference = await readFile(new URL('./角色设定图-v2.png', import.meta.url));
const assets = { version: 2, referenceSha256: createHash('sha256').update(reference).digest('hex'), sources, frames };
assert.equal(Object.keys(frames).length, 65);
await writeFile(new URL('./assets/character-sprites.json', import.meta.url), JSON.stringify(assets));
console.log(JSON.stringify({ status: 'ok', frames: 65, sources, referenceSha256: assets.referenceSha256 }));
