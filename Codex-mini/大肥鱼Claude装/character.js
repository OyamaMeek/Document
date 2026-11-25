import assets from './assets/character-sprites.json' with { type: 'json' };

export const CHARACTER_PALETTE = Object.freeze({
  hair: '#3659a0', hairLight: '#65b6df', hairDark: '#293d78',
  skin: '#ffeadc', cream: '#fff7eb', orange: '#edac69',
  brown: '#8b5c41', ink: '#354369',
});

if (assets.version !== 2 || !assets.frames || Object.keys(assets.frames).length !== 65) {
  throw new Error('角色素材不完整，请运行 build-assets.mjs');
}

export function drawCharacter({ direction = 'front', expression = 'neutral', action = 'idle', phase = 0, prop = 'microphone', x = 0, y = 0, scale = 1 } = {}) {
  for (const [key, value, allowed] of [
    ['direction', direction, ['front', 'left', 'right', 'back']],
    ['expression', expression, ['neutral', 'happy', 'shy', 'sad']],
    ['action', action, ['idle', 'walk', 'jump', 'hug', 'hold']],
    ['prop', prop, ['microphone']],
  ]) if (!allowed.includes(value)) throw new RangeError(`${key}: ${value}`);
  for (const [key, value] of Object.entries({ phase, x, y, scale })) {
    if (!Number.isFinite(value) || (key === 'scale' && value <= 0)) {
      throw new RangeError(`${key} must be finite${key === 'scale' ? ' and positive' : ''}`);
    }
  }
  const key = `${direction}:${direction === 'back' ? 'neutral' : expression}:${action}`;
  const frame = assets.frames[key];
  if (!frame || typeof frame.data !== 'string' || !frame.data.startsWith('data:image/png;base64,')) {
    throw new Error(`缺少角色素材: ${key}`);
  }
  const t = ((phase % 1) + 1) % 1;
  const wave = Math.sin(t * Math.PI * 2);
  const lift = action === 'jump' ? -65 * Math.sin(t * Math.PI)
    : action === 'walk' ? -4 * Math.abs(wave)
    : action === 'hug' || action === 'hold' ? -1.5 * wave : 0;
  const sway = action === 'walk' ? 1.2 * wave : action === 'hug' || action === 'hold' ? .5 * wave : 0;
  // shortcut: 每个动作采用一张关键姿势和周期变换，需要完整逐帧步态时补充行走序列。
  return `<g data-character="da-fei-yu-claude-v2" data-direction="${direction}" data-expression="${expression}" data-action="${action}" transform="translate(${x} ${y}) scale(${scale})">
    <g data-part="pose" data-frame="${key}" transform="translate(0 ${lift}) rotate(${sway} 0 470)">
      <image data-part="character-sprite" x="-160" y="-20" width="320" height="500" preserveAspectRatio="xMidYMin meet" href="${frame.data}"/>
    </g>
  </g>`;
}
