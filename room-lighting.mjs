const gold = '255,205,120';
const warmWhite = '255,244,219';
const cyan = '163,216,255';
const pink = '255,177,238';
const colour = (rgb, alpha) => `rgba(${rgb},${alpha})`;
const between = (min, max) => min + Math.random() * (max - min);

function bloom(ctx, x, y, radius, rgb, strength, squash = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(1, squash);
  const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
  halo.addColorStop(0, colour(rgb, strength));
  halo.addColorStop(.38, colour(rgb, strength * .36));
  halo.addColorStop(1, colour(rgb, 0));
  ctx.fillStyle = halo;
  ctx.fillRect(-radius, -radius, radius * 2, radius * 2);
  ctx.restore();
}

function spotlight(ctx, x, y, targetX, targetY, spread, rgb) {
  const length = Math.hypot(targetX - x, targetY - y);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(Math.atan2(targetY - y, targetX - x) - Math.PI / 2);
  const light = ctx.createLinearGradient(-spread, 0, spread, 0);
  light.addColorStop(0, colour(rgb, 0));
  light.addColorStop(.22, colour(rgb, .04));
  light.addColorStop(.5, colour(rgb, .22));
  light.addColorStop(.78, colour(rgb, .04));
  light.addColorStop(1, colour(rgb, 0));
  ctx.fillStyle = light;
  ctx.beginPath();
  ctx.moveTo(-2, 0);
  ctx.lineTo(-spread, length);
  ctx.quadraticCurveTo(0, length + spread * .22, spread, length);
  ctx.lineTo(2, 0);
  ctx.fill();
  ctx.restore();
  bloom(ctx, targetX, targetY, spread * 1.35, rgb, .35, .33);
  bloom(ctx, x, y, spread * .24, warmWhite, .52);
}

function paperPieces(isDisco) {
  const colours = isDisco ? [gold, '240,171,76', warmWhite] : [pink, cyan, '233,200,255'];
  return Array.from({length:isDisco ? 24 : 34}, (_, index) => ({
    x:between(.03,.97), phase:Math.random(), duration:between(7,14),
    depth:between(.35,1), roll:between(2,5), flutter:between(1,4),
    rgb:colours[index % colours.length],
  }));
}

function drawPaper(ctx, view, seconds, pieces, isDisco) {
  for (const piece of pieces) {
    const progress = (piece.phase + seconds / piece.duration) % 1;
    const sway = Math.sin(seconds * .86 + piece.phase * 12) * .037 * piece.depth;
    const x = view.width * (piece.x + sway);
    const y = view.height * (progress * 1.13 - .065);
    const roll = Math.cos(seconds * piece.roll + piece.phase * 8);
    const size = Math.min(view.height / 690, 1.45) * piece.depth;
    const width = Math.max(.4, Math.abs(roll) * size * (isDisco ? 6 : 4));
    const length = size * (isDisco ? 21 : 8);
    const alpha = Math.sin(progress * Math.PI) * (.3 + piece.depth * .52);
    ctx.save();
    ctx.translate(x,y);
    ctx.rotate(Math.sin(seconds * piece.flutter + piece.phase * 7) * .84);
    const finish = ctx.createLinearGradient(-width/2, 0, width/2, length);
    finish.addColorStop(0, colour(piece.rgb, alpha * .54));
    finish.addColorStop(.48, colour(roll > .48 ? warmWhite : piece.rgb, alpha));
    finish.addColorStop(1, colour(piece.rgb, alpha * .53));
    ctx.fillStyle = finish;
    ctx.beginPath();
    ctx.moveTo(-width/2, -length/2);
    ctx.lineTo(width/2, -length/2 + length * .07);
    ctx.quadraticCurveTo(width,0,width/4,length/2);
    ctx.lineTo(-width/2,length/2);
    ctx.quadraticCurveTo(0,0,-width/2,-length/2);
    ctx.fill();
    ctx.restore();
  }
}

function discoScene() {
  const foil = paperPieces(true);
  const reflections = Array.from({length:42}, () => ({
    x:between(.05,.95), y:between(.15,.96), phase:between(0,Math.PI*2), size:between(.35,1.2)
  }));
  return (ctx, view, seconds) => {
    ctx.globalCompositeOperation = 'screen';
    for (const {x,y,phase,size} of reflections) {
      const shine = Math.max(0, Math.cos(seconds * 1.24 + phase)) ** 16;
      if (shine < .027) continue;
      const radius = view.height * .018 * size;
      const px = view.x(x + Math.sin(seconds * .52 + phase) * .064);
      const py = view.y(y);
      bloom(ctx, px, py, radius, y > .74 ? gold : warmWhite, shine * .48, y > .74 ? .32 : .78);
    }
    for (let i=0; i<7; i++) {
      const angle=seconds*.56+i*.92;
      const shine=Math.max(0, Math.cos(seconds*2.5+i*1.93))**14;
      if(shine<.05)continue;
      const x=view.x(.5+Math.cos(angle)*.102);
      const y=view.y(.32+Math.sin(angle)*.13);
      const radius=view.height*(.017+shine*.027);
      bloom(ctx,x,y,radius,warmWhite,shine*.71);
      bloom(ctx,x,y,radius*1.65,warmWhite,shine*.34,.09);
      bloom(ctx,x,y,radius*.11,warmWhite,shine*.9,6);
    }
    ctx.globalCompositeOperation = 'source-over';
    drawPaper(ctx,view,seconds,foil,true);
  };
}

function stageScene() {
  const confetti = paperPieces(false);
  const fixtures = [[.39,.19,cyan],[.6,.19,pink],[.52,.165,'213,172,255']];
  return (ctx, view, seconds) => {
    ctx.globalCompositeOperation = 'screen';
    fixtures.forEach(([x,y,rgb], index) => {
      const swing = Math.sin(seconds * (.46+index*.07) + index*2.1);
      spotlight(ctx,view.x(x),view.y(y),view.x(x+ swing*.21),view.y(.94),view.height*(.1+index*.016),rgb);
    });
    ctx.globalCompositeOperation = 'source-over';
    drawPaper(ctx,view,seconds,confetti,false);
  };
}

function mistPatch(tinted) {
  const patch = document.createElement('canvas');
  patch.width = 240;
  patch.height = 92;
  const ctx = patch.getContext('2d');
  for (let i=0;i<45;i++) {
    const x = between(0,240);
    const envelope = Math.sin(x/240*Math.PI);
    const radius = between(8,30);
    bloom(ctx,x,between(27,65),radius,tinted ? '219,133,128' : '189,176,187',
      envelope*between(.055,.18),between(.44,.86));
  }
  return patch;
}

function rockScene() {
  const patches = [mistPatch(false), mistPatch(true)];
  const wisps = Array.from({length:12}, (_,i) => ({
    y:between(.66,.90), width:between(.24,.54), phase:i/12, duration:between(16,29),
    opacity:between(.43,.8), patch:patches[i%2]
  })).sort((a,b)=>a.y-b.y);
  return (ctx, view, seconds) => {
    for (const wisp of wisps) {
      const flow=(seconds/wisp.duration+wisp.phase)%1;
      const width=view.artWidth*wisp.width;
      const x=view.x(flow*1.65-.5);
      const y=view.y(wisp.y+Math.sin(seconds*.48+wisp.phase*8)*.026);
      ctx.globalAlpha=wisp.opacity*Math.sin(flow*Math.PI);
      ctx.drawImage(wisp.patch,x,y,width,width*(wisp.y>.76?.31:.24));
    }
    ctx.globalAlpha = 1;
  };
}

function glowNote(ctx, x, y, size, rgb, alpha, secondNote, roll) {
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(roll);
  ctx.fillStyle = colour(warmWhite, alpha);
  ctx.strokeStyle = ctx.fillStyle;
  ctx.shadowColor = colour(rgb, alpha);
  ctx.shadowBlur = size * .84;
  ctx.lineWidth = Math.max(1,size*.105);
  const heads = secondNote ? [0,size*.56] : [0];
  for (const left of heads) {
    ctx.beginPath();
    ctx.ellipse(left,0,size*.19,size*.115,-.38,0,Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(left+size*.14,0);
    ctx.lineTo(left+size*.14,-size*.73);
    ctx.stroke();
  }
  ctx.beginPath();
  ctx.moveTo(size*.14,-size*.73);
  if(secondNote)ctx.lineTo(size*.7,-size*.79);
  else ctx.quadraticCurveTo(size*.64,-size*.58,size*.4,-size*.34);
  ctx.stroke();
  ctx.restore();
}

function jazzScene() {
  const notes=Array.from({length:12},(_,i)=>({
    phase:i/12, x:between(.08,.27), side:i%2===0?1:-1, size:between(.64,1.28),
    life:between(8,12), pair:i%3===0, rgb:i%2===0?gold:cyan
  }));
  return (ctx, view, seconds) => {
    ctx.globalCompositeOperation = 'screen';
    for (const note of notes) {
      const travel = (seconds/note.life+note.phase)%1;
      const alpha = Math.sin(travel*Math.PI) ** .66 * .87;
      const x=view.x(.5)+view.width*note.side*(note.x+travel*.16+Math.sin(travel*6)*.033);
      const y=view.y(.84-travel*.66);
      const size=view.height*.033*note.size*(.75+travel*.35);
      glowNote(ctx,x,y,size,note.rgb,alpha,note.pair,Math.sin(travel*5)*.24);
      for(let i=1; i<=3; i++){
        bloom(ctx,x-i*size*.47,y+i*size*.57,size*.23,note.rgb,alpha*(.32-i*.04));
      }
    }
    ctx.globalCompositeOperation = 'source-over';
  };
}

const createEffects = {rock:rockScene, disco:discoScene, kpop:stageScene, jazz:jazzScene};

export function playRoomLighting(canvas, genre) {
  const ctx = canvas?.getContext('2d');
  if (!ctx) return;
  const photo=canvas.previousElementSibling;
  const effect=createEffects[genre]();
  let view, frame, lastPaint=0;
  const started=performance.now();
  function measure(){
    const {clientWidth:width,clientHeight:height}=canvas;
    if(!width||!height)return;
    const ratio=photo.naturalWidth/photo.naturalHeight||16/9;
    const artWidth=Math.max(width,height*ratio), artHeight=artWidth/ratio;
    const focus=getComputedStyle(photo).objectPosition.split(' ').map(value=>value.endsWith('%')?parseFloat(value)/100:.5);
    const x=(width-artWidth)*(focus[0]??.5), y=(height-artHeight)*(focus[1]??.5);
    const pixels=Math.min(devicePixelRatio||1,1.35,1640/Math.max(width,height));
    canvas.width=Math.max(1,Math.round(width*pixels));
    canvas.height=Math.max(1,Math.round(height*pixels));
    ctx.setTransform(pixels,0,0,pixels,0,0);
    view={width,height,artWidth,x:position=>x+artWidth*position,y:position=>y+artHeight*position};
  }
  function draw(now){
    frame=requestAnimationFrame(draw);
    if(!view||now-lastPaint<30||document.hidden)return;
    lastPaint=now;
    ctx.clearRect(0,0,view.width,view.height);
    effect(ctx,view,(now-started)/1000);
  }
  const observer=new ResizeObserver(measure);
  observer.observe(canvas);
  photo.addEventListener('load',measure);
  measure();
  frame=requestAnimationFrame(draw);
  return ()=>{
    cancelAnimationFrame(frame);
    observer.disconnect();
    photo.removeEventListener('load',measure);
  };
}
