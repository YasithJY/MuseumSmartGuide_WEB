"""Build compact Sri Lanka map data (coastline + smooth elevation heightmap).

Usage: python3 -I build_map.py <download_dir> <out_json>
  download_dir must contain countries-10m.json (world-atlas) and tiles/t_X_Y.png
  (AWS Terrarium elevation tiles, zoom 8).
"""
import json, math, sys, os
from PIL import Image

dl, out = sys.argv[1], sys.argv[2]

LON0, LAT0 = 80.7, 7.87
KX = 111.32 * math.cos(math.radians(LAT0)) / 10.0  # 1 unit = 10 km
KY = 110.57 / 10.0

def proj(lon, lat):
    return ((lon - LON0) * KX, (lat - LAT0) * KY)

def unproj(x, y):
    return (x / KX + LON0, y / KY + LAT0)

# ---------- coastline from TopoJSON ----------
topo = json.load(open(os.path.join(dl, 'countries-10m.json')))
sc, tr = topo['transform']['scale'], topo['transform']['translate']
arcs = []
for arc in topo['arcs']:
    x = y = 0
    pts = []
    for dx, dy in arc:
        x += dx; y += dy
        pts.append((x * sc[0] + tr[0], y * sc[1] + tr[1]))
    arcs.append(pts)

def ring(idx_list):
    pts = []
    for i in idx_list:
        a = arcs[i] if i >= 0 else arcs[~i][::-1]
        pts.extend(a if not pts else a[1:])
    return pts

geom = next(g for g in topo['objects']['countries']['geometries']
            if g.get('properties', {}).get('name') == 'Sri Lanka')
polys = geom['arcs'] if geom['type'] == 'MultiPolygon' else [geom['arcs']]

def area(p):
    return 0.5 * sum(p[i][0] * p[i - 1][1] - p[i - 1][0] * p[i][1] for i in range(len(p)))

def dp(points, tol):
    if len(points) < 3:
        return points
    (x1, y1), (x2, y2) = points[0], points[-1]
    dx, dy = x2 - x1, y2 - y1
    L = math.hypot(dx, dy) or 1e-12
    dmax, imax = 0, 0
    for i in range(1, len(points) - 1):
        px, py = points[i]
        d = abs(dy * px - dx * py + x2 * y1 - y2 * x1) / L
        if d > dmax:
            dmax, imax = d, i
    if dmax > tol:
        return dp(points[:imax + 1], tol)[:-1] + dp(points[imax:], tol)
    return [points[0], points[-1]]

outlines = []
for poly in polys:
    outer = [proj(*p) for p in ring(poly[0])]
    if abs(area(outer)) < 0.3:  # drop islets smaller than ~30 km²
        continue
    if outer[0] == outer[-1]:
        outer = outer[:-1]
    # closed ring: split at the point farthest from the start, simplify both halves
    far = max(range(len(outer)), key=lambda i: math.dist(outer[0], outer[i]))
    simp = dp(outer[:far + 1], 0.025)[:-1] + dp(outer[far:] + [outer[0]], 0.025)[:-1]
    if area(simp) < 0:
        simp = simp[::-1]  # counter-clockwise
    outlines.append(simp)

def inside(x, y):
    hit = False
    for poly in outlines:
        n = len(poly)
        j = n - 1
        for i in range(n):
            xi, yi = poly[i]; xj, yj = poly[j]
            if (yi > y) != (yj > y) and x < (xj - xi) * (y - yi) / (yj - yi) + xi:
                hit = not hit
            j = i
    return hit

# ---------- elevation from Terrarium tiles ----------
Z = 8
tiles = {}
def tile(tx, ty):
    if (tx, ty) not in tiles:
        p = os.path.join(dl, 'tiles', f't_{tx}_{ty}.png')
        tiles[(tx, ty)] = Image.open(p).convert('RGB').load() if os.path.exists(p) else None
    return tiles[(tx, ty)]

def elev(lon, lat):
    n = 256 * 2 ** Z
    px = (lon + 180) / 360 * n
    py = (1 - math.asinh(math.tan(math.radians(lat))) / math.pi) / 2 * n
    t = tile(int(px // 256), int(py // 256))
    if t is None:
        return 0
    r, g, b = t[int(px % 256), int(py % 256)]
    return r * 256 + g + b / 256 - 32768

# ---------- smooth heightmap (for the stylised, sculpted terrain) ----------
STEP = 0.4  # grid spacing in units (4 km)
xs = [p[0] for o in outlines for p in o]; ys = [p[1] for o in outlines for p in o]
x0, y1 = min(xs) - STEP, max(ys) + STEP          # top-left corner (north-west)
cols = int((max(xs) - x0) / STEP) + 2
rows = int((y1 - min(ys)) / STEP) + 2
grid = [[0.0] * cols for _ in range(rows)]
for j in range(rows):
    for i in range(cols):
        cx, cy = x0 + i * STEP, y1 - j * STEP
        samples = [(cx + dx * STEP / 3, cy + dy * STEP / 3) for dx in (-1, 0, 1) for dy in (-1, 0, 1)]
        e = sum(max(0, elev(*unproj(sx, sy))) for sx, sy in samples) / len(samples)
        grid[j][i] = e if inside(cx, cy) else 0.0

# gentle gaussian blur (sigma ~ 1 cell) so hills read as soft, rounded forms
kernel = [math.exp(-(k * k) / 2.0) for k in range(-2, 3)]
ks = sum(kernel)
def blur(g):
    h = [[sum(kernel[k + 2] * g[j][min(cols - 1, max(0, i + k))] for k in range(-2, 3)) / ks
          for i in range(cols)] for j in range(rows)]
    return [[sum(kernel[k + 2] * h[min(rows - 1, max(0, j + k))][i] for k in range(-2, 3)) / ks
             for i in range(cols)] for j in range(rows)]
grid = blur(grid)

data = {
    'meta': {
        'unitKm': 10, 'lon0': LON0, 'lat0': LAT0, 'kx': round(KX, 6), 'ky': round(KY, 6),
        'source': 'Coastline: Natural Earth via world-atlas (public domain). '
                  'Elevation: AWS Terrain Tiles (Mapzen terrarium; SRTM et al.).',
    },
    'outlines': [[[round(x, 3), round(y, 3)] for x, y in o] for o in outlines],
    # metres, row-major from the north-west corner; y is north-up
    'heightmap': {'x0': round(x0, 3), 'y0': round(y1, 3), 'step': STEP, 'cols': cols, 'rows': rows,
                  'metres': [int(round(v)) for row in grid for v in row]},
}
json.dump(data, open(out, 'w'), separators=(',', ':'))
print('outlines', [len(o) for o in outlines], 'grid', cols, 'x', rows,
      'max elev', max(data['heightmap']['metres']), 'bytes', os.path.getsize(out))
