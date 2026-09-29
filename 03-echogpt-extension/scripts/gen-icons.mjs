#!/usr/bin/env node
/**
 * Generates the extension's 16/32/48/128px PNG icons from the EchoGPT mark.
 *
 * There is no canvas, no sharp and no image dependency in this project, and the
 * brief forbids adding one — so this rasterises the mark directly into an RGBA
 * buffer and writes a PNG by hand. Node's own zlib supplies the only thing a
 * PNG really needs that is awkward to do from scratch (deflate), and the rest
 * is four chunks and a CRC.
 *
 * The shape is the same one `src/components/ui/logo.tsx` draws: a rounded
 * square with a violet → cyan diagonal gradient, a solid dot, and two echo
 * arcs radiating from it.
 */
import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = resolve(HERE, "../extension/icons");
const SIZES = [16, 32, 48, 128];
/** Samples per axis. 3×3 is enough to keep the 16px arcs from crawling. */
const SS = 3;

// ---------------------------------------------------------------- colour ---

const STOPS = [
  { at: 0.0, rgb: [0xa0, 0x76, 0xff] },
  { at: 0.55, rgb: [0x6d, 0x28, 0xf5] },
  { at: 1.0, rgb: [0x06, 0xb6, 0xd4] },
];

function gradientAt(t) {
  const clamped = Math.min(1, Math.max(0, t));
  for (let i = 1; i < STOPS.length; i++) {
    const a = STOPS[i - 1];
    const b = STOPS[i];
    if (clamped <= b.at) {
      const local = (clamped - a.at) / (b.at - a.at);
      return [
        Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * local),
        Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * local),
        Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * local),
      ];
    }
  }
  return STOPS[STOPS.length - 1].rgb;
}

// ----------------------------------------------------------- mark shapes ---

/**
 * Signed-distance test for a rounded square, in 0..1 unit space.
 *
 * The standard rounded-box SDF: push the point into the corner-circle's frame,
 * take the positive part for the rounded region and the negative part for the
 * straight edges. Testing the two axes independently does not work — it leaves
 * the space between the corner circles uncovered.
 */
function insideRoundedSquare(x, y, radius) {
  const qx = Math.abs(x - 0.5) - (0.5 - radius);
  const qy = Math.abs(y - 0.5) - (0.5 - radius);
  const outside = Math.hypot(Math.max(qx, 0), Math.max(qy, 0));
  const inside = Math.min(Math.max(qx, qy), 0);
  return outside + inside - radius <= 0;
}

/**
 * True inside the white foreground: the dot plus two arcs.
 * Coordinates match the 32-unit viewBox used by the SVG logo.
 */
function insideMark(x, y) {
  const ux = x * 32;
  const uy = y * 32;

  // Solid dot at (11.5, 16), r 2.6.
  if (Math.hypot(ux - 11.5, uy - 16) <= 2.7) return true;

  // Both arcs are centred on the dot and open to the right.
  const dx = ux - 11.5;
  const dy = uy - 16;
  const dist = Math.hypot(dx, dy);
  const angle = Math.abs(Math.atan2(dy, dx));
  const withinSweep = angle <= Math.PI * 0.42;
  if (!withinSweep) return false;

  const inner = Math.abs(dist - 7.4) <= 1.15; // matches the r=6.6 path
  const outer = Math.abs(dist - 12.1) <= 1.15; // matches the r=10.4 path
  return inner || outer;
}

// ---------------------------------------------------------------- raster ---

function renderRGBA(size) {
  const buffer = Buffer.alloc(size * size * 4);
  const radius = 0.28; // 9/32, the SVG's rx

  for (let py = 0; py < size; py++) {
    for (let px = 0; px < size; px++) {
      let coverage = 0;
      let markCoverage = 0;
      let rSum = 0;
      let gSum = 0;
      let bSum = 0;

      for (let sy = 0; sy < SS; sy++) {
        for (let sx = 0; sx < SS; sx++) {
          const x = (px + (sx + 0.5) / SS) / size;
          const y = (py + (sy + 0.5) / SS) / size;
          if (!insideRoundedSquare(x, y, radius)) continue;
          coverage++;
          const [r, g, b] = gradientAt((x + y) / 2);
          rSum += r;
          gSum += g;
          bSum += b;
          if (insideMark(x, y)) markCoverage++;
        }
      }

      const samples = SS * SS;
      const offset = (py * size + px) * 4;
      if (coverage === 0) continue;

      const alpha = coverage / samples;
      const markRatio = markCoverage / coverage;
      // Blend the white mark over the gradient by its own coverage.
      const base = [rSum / coverage, gSum / coverage, bSum / coverage];
      buffer[offset] = Math.round(base[0] * (1 - markRatio) + 255 * markRatio);
      buffer[offset + 1] = Math.round(base[1] * (1 - markRatio) + 255 * markRatio);
      buffer[offset + 2] = Math.round(base[2] * (1 - markRatio) + 255 * markRatio);
      buffer[offset + 3] = Math.round(alpha * 255);
    }
  }
  return buffer;
}

// ------------------------------------------------------------ PNG writer ---

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const typed = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typed), 0);
  return Buffer.concat([length, typed, crc]);
}

function encodePNG(rgba, size) {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type: RGBA
  ihdr[10] = 0; // deflate
  ihdr[11] = 0; // adaptive filtering
  ihdr[12] = 0; // no interlace

  // One filter byte (0 = None) per scanline.
  const stride = size * 4;
  const raw = Buffer.alloc((stride + 1) * size);
  for (let y = 0; y < size; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }

  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk("IHDR", ihdr),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

// ------------------------------------------------------------------ main ---

mkdirSync(OUT_DIR, { recursive: true });

for (const size of SIZES) {
  const png = encodePNG(renderRGBA(size), size);
  const file = resolve(OUT_DIR, `icon-${size}.png`);
  writeFileSync(file, png);
  console.log(`  icon-${size}.png  ${String(png.length).padStart(6)} bytes`);
}

console.log(`\nWrote ${SIZES.length} icons to extension/icons/`);
