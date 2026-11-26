function loadImage(src) {
  const image = new Image();
  image.src = src;
  return image.decode().then(() => image);
}

export async function createSchoolFrame(genre, school, width, height) {
  const [wall, crest] = await Promise.all([
    loadImage(`assets/interior/${genre}.webp`),
    loadImage(`assets/interior/crest-${genre}.webp`),
  ]);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  const rail = 54;
  const opening = new Path2D();
  opening.roundRect(rail, 100, width - rail * 2, height - 232, 33);
  const border = new Path2D();
  border.rect(0, 0, width, height);
  border.addPath(opening);

  ctx.save();
  ctx.clip(border, 'evenodd');
  ctx.fillStyle = school.tint;
  ctx.fillRect(0, 0, width, height);
  const wallWidth = height * wall.naturalWidth / wall.naturalHeight;
  ctx.globalAlpha = .78;
  ctx.drawImage(wall, (width - wallWidth) / 2, 0, wallWidth, height);
  ctx.globalAlpha = 1;
  const glaze = ctx.createLinearGradient(0, 0, width, height);
  glaze.addColorStop(0, school.tint + 'fb');
  glaze.addColorStop(.18, school.accent + 'd7');
  glaze.addColorStop(.42, school.tint + '72');
  glaze.addColorStop(.69, school.highlight + 'a6');
  glaze.addColorStop(.87, school.accent + 'e1');
  glaze.addColorStop(1, school.tint + 'f4');
  ctx.fillStyle = glaze;
  ctx.fillRect(0, 0, width, height);

  // Darken only the title band for the gold lettering. Leave the rails bright.
  const topShade = ctx.createLinearGradient(0, 0, 0, 100);
  topShade.addColorStop(0, school.tint + 'b0');
  topShade.addColorStop(1, school.tint + 'ed');
  ctx.fillStyle = topShade;
  ctx.fillRect(53, 13, width - 106, 79);
  ctx.restore();

  const edge = ctx.createLinearGradient(0, 0, width, height);
  edge.addColorStop(0, school.trim);
  edge.addColorStop(.48, school.highlight);
  edge.addColorStop(.73, '#fff5ce');
  edge.addColorStop(1, school.trim);
  ctx.strokeStyle = edge;
  ctx.lineWidth = 5;
  ctx.stroke(opening);
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(14, 12, width - 28, height - 24, 29);
  ctx.stroke();

  for (const x of [rail / 2 + 3, width - rail / 2 - 3]) {
    for (let y = 49; y < height - 30; y += 60) {
      ctx.fillStyle = school.highlight;
      ctx.globalAlpha = .65;
      ctx.beginPath();
      ctx.ellipse(x, y + 23, 2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = .88;
      ctx.fillStyle = school.trim;
      ctx.beginPath();
      ctx.moveTo(x, y - 9);
      ctx.lineTo(x + 5, y);
      ctx.lineTo(x, y + 9);
      ctx.lineTo(x - 5, y);
      ctx.closePath();
      ctx.fill();
    }
  }
  ctx.globalAlpha = 1;

  const crestHeight = 71;
  const crestWidth = crestHeight * crest.naturalWidth / crest.naturalHeight;
  for (const x of [59, width - 59 - crestWidth]) {
    ctx.drawImage(crest, x, height - crestHeight - 30, crestWidth, crestHeight);
  }
  return canvas;
}
