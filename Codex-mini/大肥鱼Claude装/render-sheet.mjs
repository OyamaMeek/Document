import { writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { drawCharacter, CHARACTER_PALETTE } from './character.js';

const sharp = createRequire(new URL('../ai-website-cloner-template/package.json', import.meta.url))('sharp');
const text = (x, y, value, size = 18, fill = '#354369', extra = '') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" ${extra}>${value}</text>`;
const card = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="20" fill="#ffffff" stroke="#e1e6eb"/>`;
const label = (x, y, number, title, subtitle) => text(x,y,number,12,'#bb8958','letter-spacing="2"') + text(x+35,y,title,19,'#354369','font-weight="600"') + text(x,y+25,subtitle,12,'#7b8799');

const views = [['front','正面','FRONT'], ['right','侧面','PROFILE'], ['back','背面','BACK']];
const expressions = [['neutral','平静'], ['happy','开心'], ['shy','害羞'], ['sad','难过']];
const actions = [['walk','走路',.25], ['jump','跳跃',.5], ['hug','拥抱',.25], ['hold','手持道具',.25]];
const body = `
  <rect width="1800" height="1500" fill="#f3f5f7"/>
  <path d="M0 0H1800V9H0Z" fill="#3659a0"/>
  ${text(66,60,'CHARACTER STUDY  /  01',13,'#8b6c50','letter-spacing="3"')}
  ${text(63,111,'大肥鱼 · Claude 装',39,'#293d61','font-weight="700"')}
  ${text(65,142,'MV 主角设定  ·  character.js 实际绘制结果',17,'#718096')}
  <rect x="1536" y="53" width="198" height="37" rx="18" fill="#fff1dc"/>
  ${text(1635,77,'V2 素材已接入',14,'#9b713f','text-anchor="middle"')}
  ${card(52,177,1116,764)}${card(1190,177,558,764)}
  ${label(78,216,'01','三视图','统一读取确认造型的透明角色素材，正面／左右侧面／背面独立定义')}
  ${views.map(([direction,name,en],i) => {
    const x = 245+i*363;
    return `<path d="M${x-143} 331H${x+143}M${x-143} 554H${x+143}M${x-143} 830H${x+143}" stroke="#edf0f3" stroke-dasharray="5 7"/>
      <ellipse cx="${x}" cy="831" rx="95" ry="9" fill="#e8edf2"/>
      ${drawCharacter({direction,x,y:286,scale:1.13})}
      ${text(x,882,name,22,'#354369','text-anchor="middle" font-weight="600"')}
      ${text(x,908,en,11,'#8994a5','text-anchor="middle" letter-spacing="2"')}`;
  }).join('')}
  ${label(1218,216,'02','表情表','同一角色的平静／开心／害羞／难过表情素材')}
  ${expressions.map(([expression,name],i) => {
    const x=1336+(i%2)*267, y=271+Math.floor(i/2)*312;
    return `<rect x="${x-117}" y="${y}" width="234" height="252" rx="15" fill="#f6f8fb"/>
      <svg x="${x-109}" y="${y+9}" width="218" height="211" viewBox="-115 -22 230 247">${drawCharacter({expression})}</svg>
      ${text(x,y+239,name,18,'#354369','text-anchor="middle"')}`;
  }).join('')}
  ${card(52,963,1696,375)}
  ${label(78,1004,'03','动作与握持','独立动作姿势＋phase 周期变换；手与麦克风保存在同一透明素材中')}
  ${actions.map(([action,name,phase],i) => {
    const x=252+i*420;
    return `<ellipse cx="${x}" cy="1278" rx="60" ry="5" fill="#e8edf2"/>
      ${drawCharacter({action,phase,expression: action==='hug'?'shy':'happy',x,y:1076,scale:.42})}
      ${text(x+103,1164,name,18,'#354369','font-weight="600"')}
      ${text(x+103,1187,action.toUpperCase(),10,'#8794a7','letter-spacing="1"')}
      ${text(x+103,1218,action==='hold'?'手与麦克风整体移动':action==='hug'?'双臂向前伸出':action==='jump'?'腾空姿势 · 整体起落':'迈步姿势 · 身体起伏',11,'#8794a7')}`;
  }).join('')}
  ${text(67,1390,'造型锁定点',14,'#354369','font-weight="600"')}
  ${text(67,1420,'蓝色长卷发 / 鲸鳍耳与鲸尾 / 左侧橙色星芒发夹 / 奶油卫衣 / Claude 胸牌 / 橙裙与棕色玛丽珍鞋',15,'#718096')}
  ${Object.entries(CHARACTER_PALETTE).slice(0,6).map(([,color],i)=>`<circle cx="${1470+i*43}" cy="1396" r="13" fill="${color}" stroke="#d7dce3"/>`).join('')}
  ${text(67,1470,'SOURCE OF TRUTH  character.js  ·  所有视图与动作均由同一绘制接口生成',11,'#8994a5','letter-spacing=".8"')}
  ${text(1733,1470,'V2 / 已接入',12,'#8994a5','text-anchor="end"')}`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1500" viewBox="0 0 1800 1500"><g font-family="PingFang SC,Heiti SC,Arial,sans-serif">${body}</g></svg>`;
await writeFile(new URL('./角色模块预览-v2.svg', import.meta.url), svg);
await writeFile(new URL('./角色模块预览-v2.png', import.meta.url), await sharp(Buffer.from(svg)).png().toBuffer());
console.log(JSON.stringify({status:'ok', svg:'角色模块预览-v2.svg', png:'角色模块预览-v2.png', width:1800, height:1500}));
