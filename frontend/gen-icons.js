/**
 * 生成 TabBar 所需的 PNG 图标
 * 使用纯 Buffer 写入最小合法 PNG（1x1 透明像素骨架 + 自定义尺寸）
 * 实际上我们直接写预编码的 81x81 PNG base64 数据
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'src/assets/icons');
fs.mkdirSync(outDir, { recursive: true });

// 最小合法 24x24 PNG (base64)，每个图标用不同颜色
// 用 Node 的 Buffer 自己拼一个简单的 PNG

function createSimplePNG(r, g, b, size = 24) {
  // PNG signature
  const sig = Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A]);

  function crc32(buf) {
    let crc = 0xFFFFFFFF;
    const table = [];
    for (let i = 0; i < 256; i++) {
      let c = i;
      for (let j = 0; j < 8; j++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
      table[i] = c;
    }
    for (let i = 0; i < buf.length; i++) crc = table[(crc ^ buf[i]) & 0xFF] ^ (crc >>> 8);
    return (crc ^ 0xFFFFFFFF) >>> 0;
  }

  function chunk(type, data) {
    const typeBytes = Buffer.from(type, 'ascii');
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
    const crcInput = Buffer.concat([typeBytes, data]);
    const crcVal = Buffer.alloc(4); crcVal.writeUInt32BE(crc32(crcInput));
    return Buffer.concat([len, typeBytes, data, crcVal]);
  }

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);   // width
  ihdrData.writeUInt32BE(size, 4);   // height
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // color type RGB
  ihdrData[10] = 0; ihdrData[11] = 0; ihdrData[12] = 0;
  const ihdr = chunk('IHDR', ihdrData);

  // IDAT - raw scanlines with zlib
  const zlib = require('zlib');
  const raw = [];
  for (let y = 0; y < size; y++) {
    raw.push(0); // filter byte
    for (let x = 0; x < size; x++) {
      // 画一个简单图案：中心圆形
      const cx = size / 2, cy = size / 2, rad = size / 2 - 2;
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);
      if (dist <= rad) {
        raw.push(r, g, b);
      } else {
        raw.push(245, 245, 245); // 背景灰白
      }
    }
  }
  const rawBuf = Buffer.from(raw);
  const compressed = zlib.deflateSync(rawBuf);
  const idat = chunk('IDAT', compressed);

  // IEND
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// 图标定义：name, 普通颜色(灰), 激活颜色(绿)
const icons = [
  { name: 'home',      normal: [153, 153, 153], active: [76, 175, 80] },
  { name: 'stats',     normal: [153, 153, 153], active: [76, 175, 80] },
  { name: 'community', normal: [153, 153, 153], active: [76, 175, 80] },
  { name: 'mine',      normal: [153, 153, 153], active: [76, 175, 80] },
];

icons.forEach(({ name, normal, active }) => {
  const normalPng = createSimplePNG(...normal, 81);
  const activePng = createSimplePNG(...active, 81);
  fs.writeFileSync(path.join(outDir, `${name}.png`), normalPng);
  fs.writeFileSync(path.join(outDir, `${name}-active.png`), activePng);
  console.log(`✅ ${name}.png & ${name}-active.png`);
});

console.log('\n🎉 所有图标生成完毕！');
