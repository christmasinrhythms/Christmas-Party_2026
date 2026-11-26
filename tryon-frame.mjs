function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image.decode().then(() => image);
}

export async function createSchoolFrame(genre, school, width, height) {
  if (genre === 'rock') return loadImage('assets/tryon/rock-3d/christmas-rock-frame.webp');
  const [wall, crest] = await Promise.all([
    loadImage(`assets/interior/${genre}.webp`),
    loadImage(`assets/interior/crest-${genre}.webp`),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const opening = new Path2D();
  opening.roundRect(21, 15, width - 42, height - 131, [50, 50, 37, 37]);
  const border = new Path2D();
  border.rect(0, 0, width, height);
  border.addPath(opening);
  ctx.save();
  ctx.clip(border, 'evenodd');
  ctx.fillStyle = school.tint;
  ctx.fillRect(0, 0, width, height);
  ctx.globalAlpha = .92;
  const wallWidth = height * wall.naturalWidth / wall.naturalHeight;
  ctx.drawImage(wall, (width - wallWidth) / 2, 0, wallWidth, height);
  ctx.globalAlpha = .28;
  ctx.fillStyle = school.tint;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
  const shade = ctx.createLinearGradient(0, height - 175, 0, height);
  shade.addColorStop(0, 'transparent');
  shade.addColorStop(.72, school.tint + 'cd');
  shade.addColorStop(1, school.tint);
  ctx.fillStyle = shade;
  ctx.fillRect(20, height - 173, width - 40, 173);
  ctx.strokeStyle = school.trim;
  ctx.lineWidth = 3;
  ctx.stroke(opening);
  ctx.globalAlpha = .66;
  ctx.lineWidth = 1.3;
  ctx.strokeRect(9, 9, width - 18, height - 18);
  ctx.globalAlpha = 1;
  for (const sign of [-1, 1]) {
    const x = width / 2 + sign * 217;
    for (const [distance, size] of [[0, 7], [25, 4], [45, 2]]) {
      const at = x + sign * distance;
      ctx.beginPath();
      ctx.moveTo(at, 44 - size);
      ctx.lineTo(at + size, 44);
      ctx.lineTo(at, 44 + size);
      ctx.lineTo(at - size, 44);
      ctx.closePath();
      ctx.fillStyle = school.trim;
      ctx.fill();
    }
  }
  const crestHeight = 69;
  const crestWidth = crestHeight * crest.naturalWidth / crest.naturalHeight;
  for (const x of [58, width - 58 - crestWidth]) {
    ctx.drawImage(crest, x, height - crestHeight - 27, crestWidth, crestHeight);
  }
  return canvas;
}
