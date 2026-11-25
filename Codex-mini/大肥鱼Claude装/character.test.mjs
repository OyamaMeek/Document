import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createRequire } from 'node:module';
import { drawCharacter } from './character.js';

const sharp = createRequire(new URL('../ai-website-cloner-template/package.json', import.meta.url))('sharp');
const svg = (body) => `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="650" viewBox="-200 -110 400 650">${body}</svg>`;
const render = (options) => sharp(Buffer.from(svg(drawCharacter(options)))).png().toBuffer();
const directions = ['front', 'left', 'right', 'back'];
const expressions = ['neutral', 'happy', 'shy', 'sad'];
const actions = ['idle', 'walk', 'jump', 'hug', 'hold'];

test('确认稿角色使用内嵌透明素材，不含旧矢量角色或外部图像路径', async () => {
  const result = drawCharacter();
  assert.match(result, /data-character="da-fei-yu-claude-v2"/);
  assert.match(result, /<image[^>]+href="data:image\/png;base64,/);
  assert.doesNotMatch(result, /<path|<text|file:|https?:\/\/(?!www\.w3\.org)/);
  const match = result.match(/href="data:image\/png;base64,([^"]+)"/);
  const png = Buffer.from(match[1], 'base64');
  const metadata = await sharp(png).metadata();
  assert.equal(metadata.hasAlpha, true);
  const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  assert.equal(info.channels, 4);
  assert.equal(data[3], 0);
  assert.ok(data.some((v, i) => i % 4 === 3 && v === 255));
});

test('全部80种朝向、表情与动作可真实渲染，动作全周期不越过画布', async () => {
  for (const direction of directions) for (const expression of expressions) for (const action of actions) {
    for (const phase of [0, .25, .5, .75]) {
      const png = await render({ direction, expression, action, phase });
      const { data, info } = await sharp(png).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
      assert.ok(png.length > 5000);
      for (let row = 0; row < info.height; row++) {
        assert.equal(data[row * info.width * 4 + 3], 0);
        assert.equal(data[(row * info.width + info.width - 1) * 4 + 3], 0);
      }
      for (let col = 0; col < info.width; col++) {
        assert.equal(data[col * 4 + 3], 0);
        assert.equal(data[((info.height - 1) * info.width + col) * 4 + 3], 0);
      }
    }
  }
});

test('每个朝向和表情都有独立动作素材，背面表情保持背面', () => {
  for (const direction of directions) for (const expression of expressions) {
    const sources = actions.map(action => drawCharacter({ direction, expression, action }).match(/href="([^"]+)"/)[1]);
    assert.equal(new Set(sources).size, 5, `${direction}/${expression}`);
  }
  for (const direction of ['front', 'left', 'right']) {
    const sources = expressions.map(expression => drawCharacter({ direction, expression }).match(/href="([^"]+)"/)[1]);
    assert.equal(new Set(sources).size, 4, direction);
  }
  const sources = expressions.map(expression => drawCharacter({ direction: 'back', expression }).match(/href="([^"]+)"/)[1]);
  assert.equal(new Set(sources).size, 1);
});

test('循环稳定，中间帧改变姿态；手与麦克风始终属于同一个素材', async () => {
  for (const action of ['walk', 'jump', 'hug', 'hold']) {
    const start = await render({ action, phase: 0 });
    assert.deepEqual(start, await render({ action, phase: 1 }));
    assert.notDeepEqual(start, await render({ action, phase: .25 }));
    const frame = drawCharacter({ action, phase: .25 });
    assert.equal((frame.match(/<image/g) || []).length, 1);
    assert.match(frame, /data-part="pose"/);
  }
});

test('非法输入明确失败，不支持的道具不会静默替换', () => {
  for (const options of [{ direction: 'up' }, { expression: 'angry' }, { action: 'fly' }, { phase: NaN }, { scale: 0 }, { scale: -1 }, { x: Infinity }, { y: '1' }, { prop: 'flower' }, { prop: '<script/>' }]) {
    assert.throws(() => drawCharacter(options));
  }
});
