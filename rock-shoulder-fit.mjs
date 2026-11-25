const median = (values) => values.sort((a, b) => a - b)[Math.floor(values.length / 2)];

export function measureShoulderOutline(mask, shoulders, face, layout) {
  if (!mask || !shoulders?.[0] || !shoulders[1] || !face) return null;
  const [left, right] = shoulders[0].x <= shoulders[1].x ? shoulders : [...shoulders].reverse();
  if (Math.min(left.visibility ?? 1, right.visibility ?? 1) < .55) return null;
  const span = right.x - left.x;
  const chin = face[152];
  const headHeight = chin.y - face[10].y;
  const headWidth = Math.abs(face[454].x - face[234].x);
  const center = (left.x + right.x) * .5;
  if (span < .06 || headHeight < .035 || Math.abs(chin.x - center) > span * .25) return null;

  let data;
  try { data = mask.getAsFloat32Array(); } catch { return null; }
  const mx = mask.width, my = mask.height;
  const at = (x, y) => x < 0 || y < 0 || x >= 1 || y >= 1 ? 0 : data[Math.floor(y * my) * mx + Math.floor(x * mx)];
  const stepY = 1 / my;
  const firstY = Math.max(stepY, chin.y - headHeight * .18);
  const lastY = Math.min(1 - stepY * 3, chin.y + headHeight * .54);

  function ridge(shoulder) {
    const direction = Math.sign(shoulder.x - center);
    const distance = Math.abs(shoulder.x - center);
    const probe = center + direction * Math.max(headWidth * .60, distance * .83);
    const candidates = [];
    for (const delta of [-.055, -.027, 0, .027, .055]) {
      const x = probe + span * delta;
      if (x < .015 || x > .985 || at(x, firstY) > .42) continue;
      for (let y = firstY + stepY; y <= lastY; y += stepY) {
        if (at(x, y) >= .56 && at(x, y + stepY * 2) >= .62) {
          candidates.push(y);
          break;
        }
      }
    }
    if (candidates.length < 3 || Math.max(...candidates) - Math.min(...candidates) > headHeight * .30) return null;
    return { x: probe, y: median(candidates) };
  }

  const a = ridge(left), b = ridge(right);
  if (!a || !b || Math.abs(a.y - b.y) > headHeight * .30) return null;
  const y = (a.y + b.y) * .5;
  const stepX = 1 / mx;
  function outside(point, direction) {
    const sampleY = point.y + headHeight * .135;
    for (let x = point.x; x > .018 && x < .982 && Math.abs(x - point.x) < span * .26; x += direction * stepX) {
      if (at(x, sampleY) < .42 && at(x + direction * stepX, sampleY) < .42) return x;
    }
    return null;
  }
  const edgeLeft = outside(a, -1), edgeRight = outside(b, 1);
  const edgeSpan = edgeLeft == null || edgeRight == null ? null : (edgeRight - edgeLeft) * layout.w;
  return { y: -(layout.y + y * layout.h), width: edgeSpan };
}
