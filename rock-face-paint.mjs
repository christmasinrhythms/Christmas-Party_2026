// MediaPipe landmark indices around the skin boundary, eyelids and vermilion.
const oval = [10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288, 397, 365, 379, 378, 400, 377, 152,
  148, 176, 149, 150, 136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109];
const eyes = [
  [33, 246, 161, 160, 159, 158, 157, 173, 133, 155, 154, 153, 145, 144, 163, 7],
  [362, 398, 384, 385, 386, 387, 388, 466, 263, 249, 390, 373, 374, 380, 381, 382],
];
const lips = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291, 375, 321, 405, 314, 17, 84, 181, 91, 146];
const mouth = [78, 191, 80, 81, 82, 13, 312, 311, 310, 415, 308, 324, 318, 402, 317, 14, 87, 178, 88, 95];
const mix = (a, b, weight = .5) => ({x: a.x + (b.x - a.x) * weight, y: a.y + (b.y - a.y) * weight});

function trace(path, points) {
  const first = mix(points[0], points.at(-1));
  path.moveTo(first.x, first.y);
  for (let i = 0; i < points.length; i += 1) {
    const at = points[i];
    const next = mix(at, points[(i + 1) % points.length]);
    path.quadraticCurveTo(at.x, at.y, next.x, next.y);
  }
  path.closePath();
}

function outline(indices, points, path = new Path2D()) {
  trace(path, indices.map((index) => points[index]));
  return path;
}

export function paintRockFace(ctx, points) {
  const forehead = points[10];
  const chin = points[152];
  const nose = points[1];
  const leftTemple = points[234];
  const rightTemple = points[454];
  const faceWidth = Math.hypot(rightTemple.x - leftTemple.x, rightTemple.y - leftTemple.y);
  const faceHeight = Math.hypot(forehead.x - chin.x, forehead.y - chin.y);
  if (faceWidth < 26 || faceHeight < 29) return;

  const skin = outline(oval, points);
  for (const eye of eyes) outline(eye, points, skin);
  outline(lips, points, skin);
  const pale = ctx.createRadialGradient(nose.x, nose.y, faceWidth * .06, nose.x, nose.y, faceWidth * .71);
  pale.addColorStop(0, 'rgba(250,245,235,.55)');
  pale.addColorStop(.73, 'rgba(252,246,236,.53)');
  pale.addColorStop(1, 'rgba(235,225,214,.34)');

  ctx.save();
  ctx.fillStyle = pale;
  ctx.filter = `blur(${Math.max(.7, faceWidth * .009)}px)`;
  ctx.fill(skin, 'evenodd');
  ctx.filter = 'none';
  ctx.clip(skin, 'evenodd');

  // The star follows the wearer's left eye. The same geometry flips with the selfie feed.
  const outer = points[263];
  const inner = points[362];
  const center = mix(inner, outer, .47);
  const eyeWidth = Math.hypot(outer.x - inner.x, outer.y - inner.y);
  const across = {x: (outer.x - inner.x) / eyeWidth, y: (outer.y - inner.y) / eyeWidth};
  const headUp = {x: (forehead.x - chin.x) / faceHeight, y: (forehead.y - chin.y) / faceHeight};
  const direction = Math.sign(across.x * headUp.y - across.y * headUp.x) || -1;
  const up = {x: -across.y * direction, y: across.x * direction};
  const radiusX = Math.min(faceWidth * .29, eyeWidth * 1.54);
  const radiusY = Math.min(faceHeight * .29, eyeWidth * 1.64);
  if (eyeWidth > 3) {
    const star = new Path2D();
    for (let i = 0; i < 10; i += 1) {
      const angle = i * Math.PI / 5;
      const radius = i % 2 ? .42 : 1;
      const x = Math.sin(angle) * radiusX * radius, y = Math.cos(angle) * radiusY * radius;
      const px = center.x + x * across.x + y * up.x;
      const py = center.y + x * across.y + y * up.y;
      if (i) star.lineTo(px, py);
      else star.moveTo(px, py);
    }
    star.closePath();
    ctx.fillStyle = 'rgba(22,13,20,.94)';
    ctx.fill(star);
    ctx.strokeStyle = 'rgba(149,122,109,.68)';
    ctx.lineWidth = Math.max(1, faceWidth * .008);
    ctx.stroke(star);
  }
  ctx.restore();

  const lipstick = outline(lips, points);
  outline(mouth, points, lipstick);
  ctx.save();
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgba(172,19,54,.68)';
  ctx.fill(lipstick, 'evenodd');
  ctx.restore();
}
