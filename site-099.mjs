const actors = [
  {id:'elf', names:['Elf','小精靈']},
  {id:'snowman', names:['Snowman','雪人']}
];
const lines = [
  ["Com'n In!",'入嚟啦！'],
  ['Merry Xmas!','聖誕快樂！'],
  ['Rock n Roll!','一齊搖滾！']
];

export function atriumCharacters(chinese) {
  const hint = chinese ? '輕按擲雪球，或拖拉瞄準後放手。' : 'Tap to toss snow, or drag and release to aim.';
  return `<div class="hall-companions" data-snowfield>
    ${actors.map(({id,names})=>`<button type="button" class="hall-actor actor-${id}" data-actor="${id}"
      aria-label="${names[+chinese]}. ${hint}" data-face="${id==='elf'?'right':'left'}">
      <span class="actor-shadow" aria-hidden="true"></span>
      <span class="actor-sprite" aria-hidden="true"></span>
      <span class="actor-speech" role="status" hidden></span>
    </button>`).join('')}
    <div class="snow-effects" aria-hidden="true"></div>
  </div>`;
}

const clamp = (value, min, max) => Math.max(min, Math.min(value,max));

export function attachAtriumCharacters(root, {chinese, still}) {
  let field, interval, greeting, aim, suppressActor, beat = 0;

  function sync(active) {
    clearInterval(interval);
    clearTimeout(greeting);
    clearAim();
    field = active ? root.querySelector('[data-snowfield]') : null;
    if (!field || still()) return;
    let turn = 0;
    const perform = () => {
      if (document.hidden || aim || !field?.isConnected) return;
      const pair=[...field.querySelectorAll('[data-actor]')];
      const round=Math.floor(turn/3);
      const actor=pair[round%2];
      const phase=turn++%3;
      if (phase===0) pair.forEach((member,index)=>walk(member,index===0,round%2===0));
      if (phase===1) say(actor);
      if (phase===2) toss(actor,{power:.47,loft:.55},pair.find(member=>member!==actor));
    };
    greeting = setTimeout(()=>say(field.querySelector('[data-actor]')),1000);
    interval = setInterval(perform, 2250);
  }

  function say(actor) {
    freeze(actor);
    const bubble = actor.querySelector('.actor-speech');
    bubble.textContent = lines[beat++ % lines.length][+chinese()];
    bubble.hidden = false;
    actor.dataset.speaking = '';
    const phrase = bubble.textContent;
    setTimeout(() => {
      if (bubble.textContent === phrase) {
        bubble.hidden = true;
        delete actor.dataset.speaking;
      }
    }, 2650);
  }

  function faceOpponent(actor) {
    actor.dataset.face=actor.dataset.actor==='elf'?'right':'left';
  }

  function freeze(actor) {
    if (!('walking' in actor.dataset)) return;
    const stage=field.getBoundingClientRect();
    const rect=actor.getBoundingClientRect();
    actor.style.transitionDuration='0s';
    actor.style.left=((rect.left+rect.width/2-stage.left)/stage.width)*100+'%';
    actor.getBoundingClientRect();
    actor.style.removeProperty('transition-duration');
    delete actor.dataset.walking;
    faceOpponent(actor);
  }

  function walk(actor, leftSide, comingIn) {
    if ('aiming' in actor.dataset || actor.dataset.pose) return;
    const narrow=field.clientWidth<=700;
    const distance=narrow?2:5;
    const home=narrow?39:30;
    const target=home+(comingIn?distance:-distance);
    const x=leftSide?target:100-target;
    const stage=field.getBoundingClientRect();
    const rect=actor.getBoundingClientRect();
    actor.dataset.face=stage.left+stage.width*x/100>rect.left+rect.width/2?'right':'left';
    actor.dataset.walking='';
    actor.style.left=x+'%';
    setTimeout(()=>{delete actor.dataset.walking;faceOpponent(actor);},1475);
  }

  function aimPower(event) {
    const dx = (event.clientX - aim.x) * aim.dir;
    const dy = event.clientY - aim.y;
    const distance = Math.hypot(dx,dy);
    if (distance < 9 || Math.abs(dx) < 4) return null;
    const pull = dx < 0;
    const angle = Math.atan2(Math.max(0, pull ? dy : -dy), Math.abs(dx));
    const loft = clamp((pull ? .58 : .12) + angle * .35, .12, .95);
    return {power:clamp((distance-7)/(field.clientWidth<500 ? 58 : 98),.08,1), loft};
  }

  function arc(actor, {power,loft}, recipient) {
    const stage = field.getBoundingClientRect();
    const actorBox = actor.getBoundingClientRect();
    const direction = actor.dataset.actor === 'elf' ? 1 : -1;
    const x = actorBox.left - stage.left + actorBox.width * (direction > 0 ? .83 : .17);
    const y = actorBox.top - stage.top + actorBox.height * .51;
    const space = direction > 0 ? stage.width - x - 15 : x - 15;
    const recipientBox=recipient?.getBoundingClientRect();
    const distance = recipientBox
      ? recipientBox.left+recipientBox.width/2-stage.left-x
      : direction * clamp(stage.width * (.10 + .35 * power), 22, Math.max(22,space));
    const floor = recipientBox
      ? recipientBox.top+recipientBox.height*.57-stage.top
      : actorBox.bottom - stage.top - 7;
    const peak = 17 + actorBox.height * loft * (1 + power * .35);
    return t => ({x:x+distance*t, y:y+(floor-y)*t-4*peak*t*(1-t)});
  }

  function point(type, {x,y}) {
    const element = document.createElement('i');
    element.className = type;
    element.style.left = x + 'px';
    element.style.top = y + 'px';
    field.querySelector('.snow-effects').append(element);
    return element;
  }

  function toss(actor, power, recipient) {
    if (actor.dataset.pose) return;
    freeze(actor);
    faceOpponent(actor);
    const activeField = field;
    const opponent=field.querySelector(`[data-actor="${actor.dataset.actor==='elf'?'snowman':'elf'}"]`);
    const hitTest = target => {
      const stage=field.getBoundingClientRect();
      const box=opponent.getBoundingClientRect();
      const x=target.x+stage.left,y=target.y+stage.top;
      return x>box.left+box.width*.20&&x<box.right-box.width*.20
        && y>box.top+box.height*.21&&y<box.bottom-box.height*.12;
    };
    const finish = (target,hit) => {
      if (field !== activeField || !field.isConnected) return;
      if (hit) {
        freeze(opponent);
        opponent.dataset.pose='hit';
        setTimeout(()=>{if(opponent.dataset.pose==='hit')delete opponent.dataset.pose;},620);
      }
      const burst = point('snow-burst',target);
      for (let i=0;i<7;i++) {
        const flake = document.createElement('b');
        const theta = (i/6) * Math.PI;
        flake.style.setProperty('--flake-x',(Math.cos(theta) * (19+i*2))+'px');
        flake.style.setProperty('--flake-y',(-Math.sin(theta) * (16+i*2))+'px');
        burst.append(flake);
      }
      setTimeout(()=>burst.remove(),480);
    };
    if (still()) {
      const target=arc(actor,power,recipient)(1);
      finish(target,hitTest(target));
      return;
    }
    actor.dataset.pose='windup';
    setTimeout(()=>{
      if(field!==activeField||!actor.isConnected||actor.dataset.pose!=='windup')return;
      actor.dataset.pose='throw';
      setTimeout(()=>{if(actor.dataset.pose==='throw')delete actor.dataset.pose;},305);
      const path=arc(actor,power,recipient);
      const start=path(0),ball=point('snow-projectile',start);
      const since=performance.now(),duration=470+power.power*435;
      const fly=now=>{
        if(field!==activeField||!ball.isConnected)return;
        const t=Math.min(1,(now-since)/duration);
        const next=path(t);
        const hit=t>.28&&hitTest(next);
        if(t>=1||hit){ball.remove();finish(next,hit);return;}
        ball.style.transform=`translate(${next.x-start.x}px,${next.y-start.y}px) rotate(${t*210}deg)`;
        requestAnimationFrame(fly);
      };
      requestAnimationFrame(fly);
    },230);
  }

  function clearAim() {
    if (!aim) return;
    delete aim.actor.dataset.aiming;
    field?.querySelectorAll('.snow-aim-dot').forEach(dot=>dot.remove());
    aim = null;
  }

  root.addEventListener('pointerdown',event=>{
    const actor = event.target.closest('[data-actor]');
    if (!field || !actor || aim || !event.isPrimary || event.button !== 0) return;
    event.stopPropagation();
    suppressActor = null;
    aim = {actor,id:event.pointerId,x:event.clientX,y:event.clientY,dir:actor.dataset.actor==='elf'?1:-1,moved:false};
    freeze(actor);
    actor.setPointerCapture(event.pointerId);
    actor.dataset.aiming = '';
  },true);

  root.addEventListener('pointermove',event=>{
    if (aim?.id !== event.pointerId) return;
    event.stopPropagation();
    aim.moved ||= Math.hypot(event.clientX-aim.x,event.clientY-aim.y) >= 9;
    field.querySelectorAll('.snow-aim-dot').forEach(dot=>dot.remove());
    const power = aimPower(event);
    if (!power) return;
    const path = arc(aim.actor,power);
    for (let i=1;i<=9;i++) point('snow-aim-dot',path(i/10));
  },true);

  root.addEventListener('pointerup',event=>{
    if (aim?.id !== event.pointerId) return;
    event.stopPropagation();
    const {actor,moved} = aim;
    const power = aimPower(event);
    if (moved || power) suppressActor = actor;
    if (power) toss(actor,power);
    clearAim();
  },true);

  for (const eventType of ['pointercancel','lostpointercapture']) {
    root.addEventListener(eventType,event=>{if (aim?.id === event.pointerId) clearAim();},true);
  }
  root.addEventListener('click',event=>{
    const actor = event.target.closest('[data-actor]');
    if (!field || !actor) return;
    if (suppressActor === actor && event.detail) {suppressActor=null;return;}
    suppressActor=null;
    say(actor);
    toss(actor,{power:.42,loft:.57});
  });
  return sync;
}
