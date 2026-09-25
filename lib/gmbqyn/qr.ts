/**
 * Minimal QR Code encoder — byte mode, error-correction level M, versions 1-10.
 *
 * Written in-repo so GMBQYN stays dependency-free. Covers review URLs up to
 * ~265 characters, which is far beyond `gmbqyn.in/r/<slug>`.
 *
 * Reference: ISO/IEC 18004.
 */

const EC_FORMAT_BITS_M = 0b00;
const PENALTY_N1 = 3;
const PENALTY_N2 = 3;
const PENALTY_N3 = 40;
const PENALTY_N4 = 10;

/** [totalCodewords, ecPerBlock, blocks, shortBlockDataLen, longBlockCount] — level M, v1..v10. */
const EC_TABLE_M: Array<[number, number, number, number, number]> = [
  [26, 10, 1, 16, 0],
  [44, 16, 1, 28, 0],
  [70, 26, 1, 44, 0],
  [100, 18, 2, 32, 0],
  [134, 24, 2, 43, 0],
  [172, 16, 4, 27, 0],
  [196, 18, 4, 31, 0],
  [242, 22, 4, 38, 2],
  [292, 22, 5, 36, 2],
  [346, 26, 5, 43, 1],
];

const ALIGNMENT_POSITIONS: number[][] = [
  [],
  [6, 18],
  [6, 22],
  [6, 26],
  [6, 30],
  [6, 34],
  [6, 22, 38],
  [6, 24, 42],
  [6, 26, 46],
  [6, 28, 50],
];

const MAX_VERSION = EC_TABLE_M.length;

// ---- GF(256) arithmetic ---------------------------------------------------
const EXP = new Uint8Array(512);
const LOG = new Uint8Array(256);
(() => {
  let x = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = x;
    LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i += 1) EXP[i] = EXP[i - 255];
})();

const gfMul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]]);

const generatorPoly = (degree: number) => {
  let poly = [1];
  for (let i = 0; i < degree; i += 1) {
    const next = new Array<number>(poly.length + 1).fill(0);
    for (let j = 0; j < poly.length; j += 1) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], EXP[i]);
    }
    poly = next;
  }
  return poly;
};

const reedSolomon = (data: number[], ecLen: number) => {
  const gen = generatorPoly(ecLen);
  const result = new Array<number>(ecLen).fill(0);
  for (const byte of data) {
    const factor = byte ^ result[0];
    result.shift();
    result.push(0);
    for (let i = 0; i < ecLen; i += 1) result[i] ^= gfMul(gen[i + 1], factor);
  }
  return result;
};

// ---- bit helpers -----------------------------------------------------------
const getBit = (value: number, index: number) => ((value >>> index) & 1) !== 0;

const appendBits = (value: number, length: number, out: number[]) => {
  for (let i = length - 1; i >= 0; i -= 1) out.push((value >>> i) & 1);
};

const utf8Bytes = (text: string) => Array.from(new TextEncoder().encode(text));

// ---- capacity --------------------------------------------------------------
const dataCodewordCount = (version: number) => {
  const [total, ecPerBlock, blocks] = EC_TABLE_M[version - 1];
  return total - ecPerBlock * blocks;
};

const charCountBits = (version: number) => (version <= 9 ? 8 : 16);

export const qrByteCapacity = (version: number) =>
  Math.floor((dataCodewordCount(version) * 8 - 4 - charCountBits(version)) / 8);

const pickVersion = (byteLength: number) => {
  for (let version = 1; version <= MAX_VERSION; version += 1) {
    if (byteLength <= qrByteCapacity(version)) return version;
  }
  return 0;
};

// ---- matrix construction ---------------------------------------------------
const buildDataCodewords = (bytes: number[], version: number) => {
  const totalData = dataCodewordCount(version);
  const bits: number[] = [];

  appendBits(0b0100, 4, bits); // byte mode
  appendBits(bytes.length, charCountBits(version), bits);
  bytes.forEach((byte) => appendBits(byte, 8, bits));

  const capacityBits = totalData * 8;
  appendBits(0, Math.min(4, capacityBits - bits.length), bits);
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    let byte = 0;
    for (let j = 0; j < 8; j += 1) byte = (byte << 1) | bits[i + j];
    codewords.push(byte);
  }
  for (let pad = 0xec; codewords.length < totalData; pad ^= 0xec ^ 0x11) codewords.push(pad);

  return codewords;
};

const interleave = (codewords: number[], version: number) => {
  const [, ecPerBlock, blocks, shortLen, longCount] = EC_TABLE_M[version - 1];
  const dataBlocks: number[][] = [];
  const ecBlocks: number[][] = [];

  let offset = 0;
  for (let b = 0; b < blocks; b += 1) {
    const len = shortLen + (b < longCount ? 1 : 0);
    const chunk = codewords.slice(offset, offset + len);
    offset += len;
    dataBlocks.push(chunk);
    ecBlocks.push(reedSolomon(chunk, ecPerBlock));
  }

  const result: number[] = [];
  const maxLen = Math.max(...dataBlocks.map((block) => block.length));
  for (let i = 0; i < maxLen; i += 1) {
    dataBlocks.forEach((block) => {
      if (i < block.length) result.push(block[i]);
    });
  }
  for (let i = 0; i < ecPerBlock; i += 1) {
    ecBlocks.forEach((block) => result.push(block[i]));
  }
  return result;
};

const maskAt = (mask: number, x: number, y: number) => {
  switch (mask) {
    case 0:
      return (x + y) % 2 === 0;
    case 1:
      return y % 2 === 0;
    case 2:
      return x % 3 === 0;
    case 3:
      return (x + y) % 3 === 0;
    case 4:
      return (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0;
    case 5:
      return ((x * y) % 2) + ((x * y) % 3) === 0;
    case 6:
      return (((x * y) % 2) + ((x * y) % 3)) % 2 === 0;
    default:
      return (((x + y) % 2) + ((x * y) % 3)) % 2 === 0;
  }
};

const P1 = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0];
const P2 = [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1];

const penaltyScore = (m: number[], size: number) => {
  let result = 0;

  for (let y = 0; y < size; y += 1) {
    let run = 1;
    for (let x = 1; x < size; x += 1) {
      if (m[y * size + x] === m[y * size + x - 1]) {
        run += 1;
      } else {
        if (run >= 5) result += PENALTY_N1 + (run - 5);
        run = 1;
      }
    }
    if (run >= 5) result += PENALTY_N1 + (run - 5);
  }

  for (let x = 0; x < size; x += 1) {
    let run = 1;
    for (let y = 1; y < size; y += 1) {
      if (m[y * size + x] === m[(y - 1) * size + x]) {
        run += 1;
      } else {
        if (run >= 5) result += PENALTY_N1 + (run - 5);
        run = 1;
      }
    }
    if (run >= 5) result += PENALTY_N1 + (run - 5);
  }

  for (let y = 0; y < size - 1; y += 1) {
    for (let x = 0; x < size - 1; x += 1) {
      const c = m[y * size + x];
      if (c === m[y * size + x + 1] && c === m[(y + 1) * size + x] && c === m[(y + 1) * size + x + 1]) {
        result += PENALTY_N2;
      }
    }
  }

  const scan = (get: (i: number) => number) => {
    for (let start = 0; start + 11 <= size; start += 1) {
      let hitP1 = true;
      let hitP2 = true;
      for (let i = 0; i < 11; i += 1) {
        const value = get(start + i);
        if (value !== P1[i]) hitP1 = false;
        if (value !== P2[i]) hitP2 = false;
      }
      if (hitP1 || hitP2) result += PENALTY_N3;
    }
  };

  for (let y = 0; y < size; y += 1) scan((i) => m[y * size + i]);
  for (let x = 0; x < size; x += 1) scan((i) => m[i * size + x]);

  let dark = 0;
  for (let i = 0; i < m.length; i += 1) dark += m[i];
  const total = size * size;
  result += (Math.ceil(Math.abs(dark * 20 - total * 10) / total) - 1) * PENALTY_N4;

  return result;
};

export interface QrMatrix {
  size: number;
  version: number;
  modules: number[];
  isDark: (x: number, y: number) => boolean;
}

export const encodeQr = (text: string): QrMatrix => {
  const bytes = utf8Bytes(text);
  const version = pickVersion(bytes.length);
  if (version === 0) {
    throw new Error(`QR payload too long (${bytes.length} bytes, max ${qrByteCapacity(MAX_VERSION)}).`);
  }

  const size = version * 4 + 17;
  const modules = new Array<number>(size * size).fill(0);
  const reserved = new Array<boolean>(size * size).fill(false);

  const setFunction = (x: number, y: number, dark: boolean) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    modules[y * size + x] = dark ? 1 : 0;
    reserved[y * size + x] = true;
  };

  const drawFinder = (cx: number, cy: number) => {
    for (let dy = -4; dy <= 4; dy += 1) {
      for (let dx = -4; dx <= 4; dx += 1) {
        const dist = Math.max(Math.abs(dx), Math.abs(dy));
        setFunction(cx + dx, cy + dy, dist !== 2 && dist !== 4);
      }
    }
  };

  // Timing first: the finder patterns deliberately overwrite the timing
  // modules where the two overlap.
  for (let i = 0; i < size; i += 1) {
    setFunction(6, i, i % 2 === 0);
    setFunction(i, 6, i % 2 === 0);
  }

  drawFinder(3, 3);
  drawFinder(size - 4, 3);
  drawFinder(3, size - 4);

  const positions = ALIGNMENT_POSITIONS[version - 1];
  for (let i = 0; i < positions.length; i += 1) {
    for (let j = 0; j < positions.length; j += 1) {
      const first = i === 0;
      const last = i === positions.length - 1;
      if ((first && j === 0) || (first && j === positions.length - 1) || (last && j === 0)) continue;
      const cx = positions[i];
      const cy = positions[j];
      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          setFunction(cx + dx, cy + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
        }
      }
    }
  }

  const drawFormat = (mask: number) => {
    const data = (EC_FORMAT_BITS_M << 3) | mask;
    let rem = data;
    for (let i = 0; i < 10; i += 1) rem = (rem << 1) ^ ((rem >>> 9) * 0x537);
    const bits = (((data << 10) | rem) ^ 0x5412) & 0x7fff;

    for (let i = 0; i <= 5; i += 1) setFunction(8, i, getBit(bits, i));
    setFunction(8, 7, getBit(bits, 6));
    setFunction(8, 8, getBit(bits, 7));
    setFunction(7, 8, getBit(bits, 8));
    for (let i = 9; i < 15; i += 1) setFunction(14 - i, 8, getBit(bits, i));

    for (let i = 0; i < 8; i += 1) setFunction(size - 1 - i, 8, getBit(bits, i));
    for (let i = 8; i < 15; i += 1) setFunction(8, size - 15 + i, getBit(bits, i));
    setFunction(8, size - 8, true);
  };

  drawFormat(0);

  if (version >= 7) {
    let rem = version;
    for (let i = 0; i < 12; i += 1) rem = (rem << 1) ^ ((rem >>> 11) * 0x1f25);
    const bits = (version << 12) | rem;
    for (let i = 0; i < 18; i += 1) {
      const bit = getBit(bits, i);
      const a = size - 11 + (i % 3);
      const b = Math.floor(i / 3);
      setFunction(a, b, bit);
      setFunction(b, a, bit);
    }
  }

  const codewords = interleave(buildDataCodewords(bytes, version), version);

  const applyMask = (mask: number) => {
    let bitIndex = 0;
    for (let right = size - 1; right >= 1; right -= 2) {
      // Skip the vertical timing column: shifting the counter itself (rather
      // than a local copy) keeps every column visited exactly once.
      if (right === 6) right = 5;
      const column = right;
      for (let vert = 0; vert < size; vert += 1) {
        for (let j = 0; j < 2; j += 1) {
          const x = column - j;
          const upward = ((column + 1) & 2) === 0;
          const y = upward ? size - 1 - vert : vert;
          if (reserved[y * size + x]) continue;
          let dark = 0;
          if (bitIndex < codewords.length * 8) {
            dark = (codewords[bitIndex >>> 3] >>> (7 - (bitIndex & 7))) & 1;
          }
          bitIndex += 1;
          modules[y * size + x] = maskAt(mask, x, y) ? dark ^ 1 : dark;
        }
      }
    }
    drawFormat(mask);
  };

  let best: { mask: number; score: number } = { mask: 0, score: Number.POSITIVE_INFINITY };
  for (let mask = 0; mask < 8; mask += 1) {
    applyMask(mask);
    const score = penaltyScore(modules, size);
    if (score < best.score) best = { mask, score };
  }
  applyMask(best.mask);

  return {
    size,
    version,
    modules,
    isDark: (x, y) => x >= 0 && y >= 0 && x < size && y < size && modules[y * size + x] === 1,
  };
};

export interface QrRenderOptions {
  /** Target edge length in pixels. Takes precedence over `scale` when set. */
  size?: number;
  /** Device pixels per module, used when `size` is omitted. */
  scale?: number;
  /** Colour of the dark modules. */
  dark?: string;
  /** Background colour. */
  light?: string;
  /** Quiet-zone width in modules (spec minimum is 4). */
  margin?: number;
  /** Draw a knockout badge with `logoText` in the centre. */
  showLogo?: boolean;
  /** Text rendered inside the badge, usually business initials. */
  logoText?: string;
  /** Badge accent colour, defaults to `dark`. */
  accent?: string;
}

/**
 * Renders a QR matrix onto a canvas.
 *
 * The badge option reserves a square of light modules under the centre badge
 * so the code stays scannable with branding applied — the knockout zone is
 * sized to keep a solid ring of data modules around it.
 */
export const drawQrToCanvas = (
  canvas: HTMLCanvasElement,
  matrix: QrMatrix,
  options: QrRenderOptions = {}
) => {
  const {
    size,
    scale = 8,
    dark = '#0A0A0A',
    light = '#FFFFFF',
    margin = 4,
    showLogo = false,
    logoText = '',
    accent = dark,
  } = options;

  const dimension =
    size ?? (matrix.size + margin * 2) * scale;
  const moduleSize = dimension / (matrix.size + margin * 2);
  const half = matrix.size / 2;

  // Centre badge spans ~22% of the symbol; the knockout is only 2 modules wider.
  const badgeModules = showLogo ? Math.max(4, Math.floor(matrix.size * 0.22) | 1) : 0;
  const knockoutModules = showLogo ? badgeModules + 2 : 0;
  const knockoutStart = Math.round(half - knockoutModules / 2);
  const knockoutEnd = knockoutStart + knockoutModules;

  const inKnockout = (x: number, y: number) =>
    showLogo && x >= knockoutStart && x < knockoutEnd && y >= knockoutStart && y < knockoutEnd;

  canvas.width = dimension;
  canvas.height = dimension;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.fillStyle = light;
  ctx.fillRect(0, 0, dimension, dimension);
  ctx.fillStyle = dark;
  for (let y = 0; y < matrix.size; y += 1) {
    for (let x = 0; x < matrix.size; x += 1) {
      if (matrix.isDark(x, y) && !inKnockout(x, y)) {
        ctx.fillRect((x + margin) * moduleSize, (y + margin) * moduleSize, moduleSize, moduleSize);
      }
    }
  }

  if (showLogo && badgeModules > 0) {
    const badgeSize = badgeModules * moduleSize;
    const cx = dimension / 2;
    const cy = dimension / 2;
    const radius = badgeSize * 0.28;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(cx - badgeSize / 2, cy - badgeSize / 2, badgeSize, badgeSize, radius);
    ctx.fillStyle = accent;
    ctx.fill();
    ctx.restore();

    const fontSize = badgeSize * 0.52;
    ctx.save();
    ctx.fillStyle = light;
    ctx.font = `700 ${fontSize}px ${'Inter, system-ui, sans-serif'}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(logoText.slice(0, 2).toUpperCase(), cx, cy + fontSize * 0.04);
    ctx.restore();
  }
};
