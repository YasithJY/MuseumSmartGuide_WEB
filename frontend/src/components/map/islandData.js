// Turns the pre-baked Sri Lanka data (src/data/sriLankaMap.json) into
// scene-ready numbers. Regenerate the JSON with scripts/build-sri-lanka-map.py.
//
// Scene coordinates: 1 unit = 10 km, x = east, z = south (north is -z), y = up.
import * as THREE from 'three';
import mapData from '../../data/sriLankaMap.json';

const { lon0, lat0, kx, ky, hexRadius } = mapData.meta;

export const HEX_RADIUS = hexRadius;
export const SLAB_DEPTH = 0.45; // thickness of the island base under the hex columns
const MAX_ELEVATION = 2300; // metres; tallest averaged hex is ~2230 m (Pidurutalagala)

// Elevation in metres -> column height in scene units (strongly exaggerated).
export const columnHeight = (metres) =>
  0.08 + Math.pow(Math.max(0, metres) / MAX_ELEVATION, 0.8) * 3.2;

// Latitude/longitude -> scene x/z
export const toScene = (lat, lng) => ({
  x: (lng - lon0) * kx,
  z: -(lat - lat0) * ky,
});

export const outlines = mapData.outlines; // [[x, yNorth], ...] per landmass

// Hypsometric palette tuned to the site's heritage tones.
const RAMP = [
  [0, '#b9c98f'],
  [120, '#94ae70'],
  [400, '#6a8c55'],
  [900, '#527047'],
  [1500, '#8d6e63'],
  [2100, '#efe6d2'],
];
const rampColor = (m) => {
  const out = new THREE.Color();
  if (m <= RAMP[0][0]) return out.set(RAMP[0][1]);
  for (let i = 1; i < RAMP.length; i++) {
    if (m <= RAMP[i][0]) {
      const [m0, c0] = RAMP[i - 1];
      const [m1, c1] = RAMP[i];
      return out.lerpColors(new THREE.Color(c0), new THREE.Color(c1), (m - m0) / (m1 - m0));
    }
  }
  return out.set(RAMP[RAMP.length - 1][1]);
};
export const legendStops = RAMP.map(([m, c]) => ({ metres: m, color: c }));

const SQRT3 = Math.sqrt(3);
const key = (q, r) => `${q},${r}`;

// Pointy-top axial hex grid, same layout as the Python generator.
const raw = mapData.hexes;
const heightByCell = new Map();
export const hexes = [];
for (let i = 0; i < raw.length; i += 3) {
  const q = raw[i];
  const r = raw[i + 1];
  const metres = raw[i + 2];
  const h = columnHeight(metres);
  // tiny deterministic brightness jitter so the tiles read as hand-made
  const noise = Math.sin(q * 12.9898 + r * 78.233) * 43758.5453;
  const jitter = 1 + ((noise - Math.floor(noise)) * 0.04 - 0.02);
  hexes.push({
    x: hexRadius * SQRT3 * (q + r / 2),
    z: -hexRadius * 1.5 * r,
    height: h,
    color: rampColor(metres).multiplyScalar(jitter),
  });
  heightByCell.set(key(q, r), h);
}

// Height of the land surface (top of the hex column) at a scene position.
export const surfaceHeight = (x, z) => {
  const y = -z;
  const qf = (SQRT3 / 3 * x - y / 3) / hexRadius;
  const rf = (2 / 3 * y) / hexRadius;
  // cube rounding
  let q = Math.round(qf);
  let r = Math.round(rf);
  const s = Math.round(-qf - rf);
  const dq = Math.abs(q - qf);
  const dr = Math.abs(r - rf);
  const ds = Math.abs(s + qf + rf);
  if (dq > dr && dq > ds) q = -r - s;
  else if (dr > ds) r = -q - s;

  const exact = heightByCell.get(key(q, r));
  if (exact !== undefined) return SLAB_DEPTH + exact;
  // coastal points can fall just outside the grid: use the highest neighbour
  const around = [[1, 0], [-1, 0], [0, 1], [0, -1], [1, -1], [-1, 1]]
    .map(([a, b]) => heightByCell.get(key(q + a, r + b)))
    .filter((v) => v !== undefined);
  return SLAB_DEPTH + (around.length ? Math.max(...around) : 0);
};

// Latitude/longitude graticule for the "antique chart" lines on the sea.
export const graticule = {
  lats: [6, 7, 8, 9, 10],
  lngs: [79, 80, 81, 82],
  latRange: [5.4, 10.4],
  lngRange: [78.6, 82.6],
};
