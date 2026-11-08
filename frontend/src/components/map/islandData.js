// Turns the pre-baked Sri Lanka data (src/data/sriLankaMap.json) into the
// stylised "storybook" island: a sandy base, softly sculpted hills painted in
// wet-zone / dry-zone greens, and helpers to place things on the land.
// Regenerate the JSON with scripts/build-sri-lanka-map.py.
//
// Scene coordinates: 1 unit = 10 km, x = east, z = south (north is -z), y = up.
// The JSON outlines and heightmap use y = north, i.e. y = -z.
import * as THREE from 'three';
import mapData from '../../data/sriLankaMap.json';

const { lon0, lat0, kx, ky } = mapData.meta;
const hm = mapData.heightmap;

export const outlines = mapData.outlines; // [[x, yNorth], ...] per landmass
export const WATER_Y = 0.2; // sea surface
export const BEACH_Y = 0.34; // top of the sandy island base

// Latitude/longitude -> scene x/z
export const toScene = (lat, lng) => ({
  x: (lng - lon0) * kx,
  z: -(lat - lat0) * ky,
});

const smoothstep = (a, b, v) => {
  const t = Math.min(1, Math.max(0, (v - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

// Small deterministic value noise, used for painterly colour patches and forest clumps.
const hash = (i, j) => {
  const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453;
  return s - Math.floor(s);
};
const valueNoise = (x, y) => {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;
  const u = fx * fx * (3 - 2 * fx);
  const v = fy * fy * (3 - 2 * fy);
  const a = hash(i, j);
  const b = hash(i + 1, j);
  const c = hash(i, j + 1);
  const d = hash(i + 1, j + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};
const fbm = (x, y) => 0.6 * valueNoise(x * 0.22, y * 0.22) + 0.4 * valueNoise(x * 0.6 + 13.1, y * 0.6 + 7.7);

// Elevation in metres at (x, yNorth), bilinear from the smoothed heightmap.
const metresAt = (x, y) => {
  const fx = (x - hm.x0) / hm.step;
  const fy = (hm.y0 - y) / hm.step;
  const i = Math.floor(fx);
  const j = Math.floor(fy);
  if (i < 0 || j < 0 || i >= hm.cols - 1 || j >= hm.rows - 1) return 0;
  const tx = fx - i;
  const ty = fy - j;
  const m = hm.metres;
  const c = hm.cols;
  const top = m[j * c + i] * (1 - tx) + m[j * c + i + 1] * tx;
  const bottom = m[(j + 1) * c + i] * (1 - tx) + m[(j + 1) * c + i + 1] * tx;
  return top * (1 - ty) + bottom * ty;
};

// Wet zone (lush, south-west) vs dry zone (golden, north & east), 0..1
const wetness = (x, y, m) =>
  Math.min(1, 1 - smoothstep(5.5, 12, Math.hypot(x + 5.5, y + 14)) + smoothstep(350, 1100, m) * 0.6);

/* ---------------- coastline distance (bucketed segments) ---------------- */

const BUCKET = 0.75;
const buckets = new Map();
const bkey = (i, j) => `${i},${j}`;
outlines.forEach((poly) => {
  for (let k = 0; k < poly.length; k++) {
    const a = poly[k];
    const b = poly[(k + 1) % poly.length];
    const i0 = Math.floor(Math.min(a[0], b[0]) / BUCKET);
    const i1 = Math.floor(Math.max(a[0], b[0]) / BUCKET);
    const j0 = Math.floor(Math.min(a[1], b[1]) / BUCKET);
    const j1 = Math.floor(Math.max(a[1], b[1]) / BUCKET);
    for (let i = i0; i <= i1; i++) {
      for (let j = j0; j <= j1; j++) {
        const kk = bkey(i, j);
        if (!buckets.has(kk)) buckets.set(kk, []);
        buckets.get(kk).push([a[0], a[1], b[0], b[1]]);
      }
    }
  }
});

// Distance to the nearest coastline, capped at BUCKET (all we ever need).
const coastDistance = (x, y) => {
  const bi = Math.floor(x / BUCKET);
  const bj = Math.floor(y / BUCKET);
  let best = BUCKET * BUCKET;
  for (let i = bi - 1; i <= bi + 1; i++) {
    for (let j = bj - 1; j <= bj + 1; j++) {
      const segs = buckets.get(bkey(i, j));
      if (!segs) continue;
      for (const [ax, ay, bx, by] of segs) {
        const dx = bx - ax;
        const dy = by - ay;
        const len = dx * dx + dy * dy || 1e-9;
        const t = Math.min(1, Math.max(0, ((x - ax) * dx + (y - ay) * dy) / len));
        const ex = ax + dx * t - x;
        const ey = ay + dy * t - y;
        const d = ex * ex + ey * ey;
        if (d < best) best = d;
      }
    }
  }
  return Math.sqrt(best);
};

/* ---------------- terrain grid ---------------- */

const STEP = 0.15;
const allX = outlines.flatMap((o) => o.map((p) => p[0]));
const allY = outlines.flatMap((o) => o.map((p) => p[1]));
const GX0 = Math.min(...allX) - STEP * 2;
const GY0 = Math.max(...allY) + STEP * 2; // north edge
const NX = Math.ceil((Math.max(...allX) - GX0) / STEP) + 3;
const NY = Math.ceil((GY0 - Math.min(...allY)) / STEP) + 3;

// Height of the land above the beach for a given elevation (gently exaggerated).
const lift = (m) => Math.pow(Math.max(0, m) / 1900, 0.9) * 3.0;

const gridY = new Float32Array(NX * NY);
const gridInside = new Uint8Array(NX * NY);
const gridDist = new Float32Array(NX * NY);
const gridMetres = new Float32Array(NX * NY);

for (let j = 0; j < NY; j++) {
  const y = GY0 - j * STEP;
  // scanline: where does this row cross the coast?
  const crossings = [];
  outlines.forEach((poly) => {
    for (let k = 0, l = poly.length - 1; k < poly.length; l = k++) {
      const [ax, ay] = poly[k];
      const [bx, by] = poly[l];
      if (ay > y !== by > y) crossings.push(ax + ((y - ay) / (by - ay)) * (bx - ax));
    }
  });
  crossings.sort((a, b) => a - b);
  let c = 0;
  for (let i = 0; i < NX; i++) {
    const x = GX0 + i * STEP;
    while (c < crossings.length && crossings[c] < x) c++;
    const idx = j * NX + i;
    const inside = c % 2 === 1;
    gridInside[idx] = inside ? 1 : 0;
    if (!inside) {
      gridY[idx] = BEACH_Y - 0.08;
      continue;
    }
    const d = coastDistance(x, y);
    const m = metresAt(x, y);
    // the land rises out of a sandy beach a couple of km wide; lowlands get soft rolling bumps
    const rise = smoothstep(0.1, 0.6, d);
    const rolling = (fbm(x * 1.6, y * 1.6) - 0.5) * 0.12 * (1 - smoothstep(200, 600, m));
    gridDist[idx] = d;
    gridMetres[idx] = m;
    gridY[idx] = BEACH_Y - 0.05 + rise * (0.09 + lift(m) + rolling);
  }
}

// Height of the land surface at a scene position.
export const terrainY = (x, z) => {
  const fx = (x - GX0) / STEP;
  const fy = (GY0 + z) / STEP;
  const i = Math.min(NX - 2, Math.max(0, Math.floor(fx)));
  const j = Math.min(NY - 2, Math.max(0, Math.floor(fy)));
  const tx = Math.min(1, Math.max(0, fx - i));
  const ty = Math.min(1, Math.max(0, fy - j));
  const a = gridY[j * NX + i] * (1 - tx) + gridY[j * NX + i + 1] * tx;
  const b = gridY[(j + 1) * NX + i] * (1 - tx) + gridY[(j + 1) * NX + i + 1] * tx;
  return Math.max(BEACH_Y, a * (1 - ty) + b * ty);
};

const nearestCell = (x, z) => {
  const i = Math.round((x - GX0) / STEP);
  const j = Math.round((GY0 + z) / STEP);
  if (i < 0 || j < 0 || i >= NX || j >= NY) return -1;
  return j * NX + i;
};

/* ---------------- colours ---------------- */

const col = (hex) => new THREE.Color(hex);
const PALETTE = {
  dry: col('#b4c06e'),
  dryAlt: col('#a3b763'),
  wet: col('#8cc061'),
  wetAlt: col('#76b158'),
  hill: col('#5c9a4e'),
  high: col('#3f7a4b'),
  peak: col('#86a283'),
};
const tmpA = new THREE.Color();
const tmpB = new THREE.Color();

const landColor = (x, y, m, out) => {
  const n = fbm(x, y);
  const w = wetness(x, y, m + (n - 0.5) * 300);
  tmpA.lerpColors(PALETTE.dry, PALETTE.dryAlt, n);
  tmpB.lerpColors(PALETTE.wet, PALETTE.wetAlt, 1 - n);
  out.lerpColors(tmpA, tmpB, w);
  out.lerp(PALETTE.hill, smoothstep(180, 700, m) * 0.85);
  out.lerp(PALETTE.high, smoothstep(700, 1350, m));
  out.lerp(PALETTE.peak, smoothstep(1550, 1880, m) * 0.7);
  // faint patchwork of fields so the lowlands aren't flat colour up close
  return out.multiplyScalar(0.95 + valueNoise(x * 2.4 + 5, y * 2.4 - 3) * 0.1);
};

/* ---------------- terrain mesh ---------------- */

export const buildTerrainGeometry = () => {
  const positions = new Float32Array(NX * NY * 3);
  const colors = new Float32Array(NX * NY * 3);
  const c = new THREE.Color();
  for (let j = 0; j < NY; j++) {
    for (let i = 0; i < NX; i++) {
      const idx = j * NX + i;
      const x = GX0 + i * STEP;
      const y = GY0 - j * STEP;
      positions.set([x, gridY[idx], -y], idx * 3);
      landColor(x, y, gridMetres[idx], c);
      colors.set([c.r, c.g, c.b], idx * 3);
    }
  }
  // keep only triangles safely inside the coast; the sandy base covers the rest
  const ok = (idx) => gridInside[idx] && gridDist[idx] > 0.08;
  const index = [];
  for (let j = 0; j < NY - 1; j++) {
    for (let i = 0; i < NX - 1; i++) {
      const a = j * NX + i;
      const b = a + 1;
      const d = a + NX;
      const e = d + 1;
      if (ok(a) && ok(d) && ok(b)) index.push(a, d, b);
      if (ok(b) && ok(d) && ok(e)) index.push(b, d, e);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.setIndex(index);
  g.computeVertexNormals();
  return g;
};

/* ---------------- trees ---------------- */

const mulberry32 = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const TREE_GREENS = ['#5c9e45', '#4b8f3e', '#6aab4c', '#55963f'].map(col);
const DRY_GREENS = ['#7fa04a', '#8fab50', '#6f9644'].map(col);
const PINE = col('#3a7046');

// Scatter low-poly trees: dense forest in the wet zone and hills, sparse scrub in the dry zone.
// `keepClear` is a list of {x, z, r} circles (pins, landmarks) to leave empty.
export const scatterTrees = (keepClear = []) => {
  const rand = mulberry32(1948);
  const broadleaf = [];
  const pines = [];
  const SPACING = 0.5;
  for (let y = GY0; y > GY0 - NY * STEP; y -= SPACING) {
    for (let x = GX0; x < GX0 + NX * STEP; x += SPACING) {
      const px = x + (rand() - 0.5) * SPACING * 0.9;
      const py = y + (rand() - 0.5) * SPACING * 0.9;
      const pz = -py;
      const idx = nearestCell(px, pz);
      if (idx < 0 || !gridInside[idx] || gridDist[idx] < 0.4) {
        rand();
        continue;
      }
      if (keepClear.some((k) => Math.hypot(k.x - px, k.z - pz) < k.r)) continue;
      const m = gridMetres[idx];
      const w = wetness(px, py, m);
      const clump = fbm(px * 1.3 + 40, py * 1.3 - 20);
      const grove = smoothstep(0.42, 0.62, clump); // trees gather into groves, leaving open fields
      const p = (0.12 + 0.45 * w + 0.35 * smoothstep(300, 1200, m)) * (0.2 + grove * 1.3);
      if (rand() > p) continue;
      const tree = {
        x: px,
        y: terrainY(px, pz),
        z: pz,
        scale: 0.85 + rand() * 0.6,
        rot: rand() * Math.PI * 2,
      };
      if (m > 1000 && rand() < 0.55) {
        pines.push({ ...tree, color: PINE.clone().multiplyScalar(0.9 + rand() * 0.2) });
      } else {
        const palette = w > 0.45 ? TREE_GREENS : DRY_GREENS;
        broadleaf.push({ ...tree, color: palette[Math.floor(rand() * palette.length)].clone() });
      }
    }
  }
  return { broadleaf, pines };
};

// A rough course of the Mahaweli, Sri Lanka's longest river (lat, lng).
export const MAHAWELI = [
  [6.84, 80.66], [6.98, 80.62], [7.12, 80.57], [7.24, 80.6], [7.29, 80.68],
  [7.24, 80.8], [7.2, 80.92], [7.3, 81.0], [7.5, 81.04], [7.75, 81.08],
  [7.95, 81.11], [8.15, 81.15], [8.32, 81.2], [8.46, 81.24],
];

// Hand-placed heritage landmarks (purely decorative). `clear` lists circles
// [dx, dz, radius] around each one that the forest leaves open.
export const LANDMARKS = [
  { id: 'stupa', name: 'Anuradhapura', lat: 8.35, lng: 80.4, clear: [[0, 0, 0.8]] },
  {
    id: 'sigiriya', name: 'Sigiriya', lat: 7.957, lng: 80.76, labelZ: 1.0,
    clear: [[0, 0, 0.9]], // forest grows right up to the foot of the rock
  },
  { id: 'lighthouse', name: 'Galle', lat: 6.03, lng: 80.24, clear: [[0, 0, 0.8]] },
];
