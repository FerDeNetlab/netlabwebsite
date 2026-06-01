import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svgPath = join(root, 'public/icon.svg');

const png32 = await sharp(svgPath).resize(32, 32).png().toBuffer();
const png16 = await sharp(svgPath).resize(16, 16).png().toBuffer();

function buildIco(images) {
  const count = images.length;
  const headerSize = 6 + 16 * count;
  let dataOffset = headerSize;
  const entries = images.map(({ size, buf }) => {
    const entry = { size, buf, offset: dataOffset };
    dataOffset += buf.length;
    return entry;
  });

  const total = dataOffset;
  const out = Buffer.alloc(total);

  out.writeUInt16LE(0, 0);     // reserved
  out.writeUInt16LE(1, 2);     // type ICO
  out.writeUInt16LE(count, 4); // count

  entries.forEach(({ size, buf, offset }, i) => {
    const base = 6 + 16 * i;
    out.writeUInt8(size >= 256 ? 0 : size, base);
    out.writeUInt8(size >= 256 ? 0 : size, base + 1);
    out.writeUInt8(0, base + 2);
    out.writeUInt8(0, base + 3);
    out.writeUInt16LE(1, base + 4);
    out.writeUInt16LE(32, base + 6);
    out.writeUInt32LE(buf.length, base + 8);
    out.writeUInt32LE(offset, base + 12);
    buf.copy(out, offset);
  });

  return out;
}

const ico = buildIco([
  { size: 16, buf: png16 },
  { size: 32, buf: png32 },
]);

const dest = join(root, 'app/favicon.ico');
writeFileSync(dest, ico);
console.log(`favicon.ico generado: ${ico.length} bytes → ${dest}`);

// También generar apple-icon.png desde SVG
const apple = await sharp(svgPath).resize(180, 180).png().toBuffer();
writeFileSync(join(root, 'public/apple-icon.png'), apple);
console.log('apple-icon.png generado (180x180)');
