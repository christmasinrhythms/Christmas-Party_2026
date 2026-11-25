const cycle = (value, count) => (value % count + count) % count;

export function attachOutfitGallery(root, currentRoom) {
  let drag, suppressClick = false, wheelAt = 0;

  function draw(position, pulling = false) {
    const gallery = currentRoom();
    const stage = root.querySelector('[data-outfit-stage]');
    if (!stage || !gallery?.photos.length) return;
    const current = position ?? gallery.focused;
    const count = gallery.photos.length;
    const spacing = Math.min(276, stage.clientWidth * (stage.clientWidth<600 ? .31 : .24));
    stage.toggleAttribute('data-pulling', pulling);
    for (const card of stage.querySelectorAll('[data-value]')) {
      const index = Number(card.dataset.value);
      const delta = cycle(index - current + count/2,count) - count/2;
      const distance = Math.abs(delta);
      const selected = index === gallery.focused;
      card.style.setProperty('--fan-x',delta * spacing + 'px');
      card.style.setProperty('--fan-y',Math.min(140,distance * (stage.clientWidth<600 ? 25 : 35)) + 'px');
      card.style.setProperty('--fan-depth',Math.max(-280,-distance*84) + 'px');
      card.style.setProperty('--fan-angle',Math.max(-47,Math.min(47,delta*15)) + 'deg');
      card.style.setProperty('--fan-turn',Math.max(-45,Math.min(45,-delta*17)) + 'deg');
      card.style.setProperty('--fan-light',String(Math.max(.43,1-distance*.17)));
      card.style.zIndex = String(50-Math.round(distance*8));
      card.toggleAttribute('data-offstage',distance>3.2);
      card.toggleAttribute('data-current',selected);
      card.setAttribute('aria-current',String(selected));
      card.tabIndex = selected ? 0 : -1;
    }
    root.querySelector('[data-outfit-count]').textContent = `${gallery.focused+1} / ${count}`;
  }

  function select(index) {
    const gallery = currentRoom();
    if (!gallery?.photos.length) return;
    gallery.focused = cycle(index,gallery.photos.length);
    draw();
  }

  function step(direction) {
    const gallery = currentRoom();
    if (gallery) select(gallery.focused+direction);
  }

  root.addEventListener('pointerdown',event=>{
    const stage=event.target.closest('[data-outfit-stage]');
    if (!stage || !currentRoom()?.photos.length || !event.isPrimary || event.button!==0) return;
    suppressClick=false;
    drag={stage,id:event.pointerId,x:event.clientX,y:event.clientY,active:false,focused:currentRoom().focused,lastX:event.clientX,time:performance.now(),speed:0};
  });

  root.addEventListener('pointermove',event=>{
    if (drag?.id!==event.pointerId) return;
    const dx=event.clientX-drag.x;
    const dy=event.clientY-drag.y;
    if (!drag.active) {
      if (Math.abs(dy)>12&&Math.abs(dy)>Math.abs(dx)) { drag=null;return; }
      if (Math.abs(dx)<8) return;
      drag.stage.setPointerCapture(event.pointerId);
      drag.active=true;
    }
    event.preventDefault();
    const now=performance.now();
    const speed = (event.clientX-drag.lastX)/Math.max(8,now-drag.time);
    drag.speed = drag.speed*.48 + speed*.52;
    drag.time=now;
    drag.lastX=event.clientX;
    draw(drag.focused-dx/Math.max(94,Math.min(236,drag.stage.clientWidth*.26)),true);
  });

  function endDrag(event) {
    if (drag?.id!==event.pointerId) return;
    // On touch, capture moves from the pressed card to the stage when dragging starts.
    if (event.type==='lostpointercapture'&&event.target!==drag.stage) return;
    if (drag.active) {
      suppressClick=true;
      const distance=event.clientX-drag.x;
      const coast=performance.now()-drag.time<120 ? Math.max(-120,Math.min(120,drag.speed*92)) : 0;
      const moved=-(distance+coast)/Math.max(94,Math.min(236,drag.stage.clientWidth*.26));
      select(drag.focused+(event.type==='pointerup'?Math.round(moved):0));
    }
    drag=null;
  }
  for (const event of ['pointerup','pointercancel','lostpointercapture']) root.addEventListener(event,endDrag);

  root.addEventListener('click',event=>{
    if(!suppressClick||!event.target.closest('[data-outfit-stage]')) return;
    suppressClick=false;
    event.stopImmediatePropagation();
  },true);

  root.addEventListener('wheel',event=>{
    if (event.ctrlKey || !event.target.closest('[data-outfit-stage]') || (currentRoom()?.photos.length||0)<2) return;
    const delta=Math.abs(event.deltaX)>Math.abs(event.deltaY)?event.deltaX:event.deltaY;
    if(Math.abs(delta)<2)return;
    event.preventDefault();
    const now=performance.now();
    if(now-wheelAt<155)return;
    wheelAt=now;
    step(Math.sign(delta));
  },{passive:false});

  root.addEventListener('keydown',event=>{
    if(!event.target.closest('.outfit-gallery')||!['ArrowLeft','ArrowRight'].includes(event.key))return;
    event.preventDefault();
    step(event.key==='ArrowLeft'?-1:1);
    const card=root.querySelector('[data-outfit-stage] [data-current]');
    card?.focus({preventScroll:true});
  });
  return {draw,select,step};
}
