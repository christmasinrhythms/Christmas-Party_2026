import {schools,rundown,reelRules} from './interior-content.mjs';
import {reelDirectory,sharedReels} from './room-reels.mjs';
import {createRoomTv} from './room-tv.mjs?v=atrium-mirror-20261126';
import {attachOutfitGallery} from './outfit-gallery.mjs?v=room-polish-20261126';
import {atriumCharacters,attachAtriumCharacters} from './atrium-characters.mjs?v=atrium-mirror-20261126';

const dir='assets/interior/';
const localReels=Object.fromEntries(sharedReels.map(clip=>[clip.id,reelDirectory+clip.file]));
let photoManifest;
function publishedPhotos(){
  if(!photoManifest)photoManifest=fetch(dir+'room-photos.json?v=20261125-pages')
    .then(response=>{
      if(!response.ok)throw new Error('Room photos unavailable');
      return response.json();
    })
    .catch(error=>{photoManifest=null;throw error;});
  return photoManifest;
}
const art=(name,extra='')=>`<img src="${dir}${name}.webp" alt="" draggable="false" ${extra}>`;
const escapeHtml=value=>value.replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
const words={
  enter:['Enter the house','進入大屋'],enterAtrium:['Enter Atrium','進入大堂'],lobby:['Grand Hall','大堂'],outside:['To the doorstep','返回門外'],back:['Back to the hall','返回大堂'],backRoom:['Back to the room','返回房間'],
  rundown:['Rundown','活動流程'],tips:['Before the party','派對前準備'],songTip:['Watch for the official song-guessing practice topics.','留意稍後公布的估歌仔預習題目。'],chair:['Sorting Chair','分類椅'],insideHint:['Drag to explore the four doors','拖曳大堂探索四扇門'],left:['Look left','向左探索'],right:['Look right','向右探索'],
  explore:['Move or drag to look around','移動游標或拖動畫面探索'],pause:['Pause movement','暫停搖擺'],resume:['Resume movement','恢復搖擺'],
  find:['Find your team','找出你的隊伍'],email:['Your RSVP email','你的 RSVP 電郵'],seat:['Find my team','查找我的隊伍'],checking:['Looking up your team…','正在查找你的隊伍…'],
  unknown:['We couldn’t find a team for this email. Check the address you used to RSVP.','找不到這個電郵所屬的隊伍。請核對 RSVP 使用的電郵地址。'],invalid:['Enter a valid email address.','請輸入有效電郵地址。'],
  fullName:['Your full name','你的全名'],useName:['I don’t have an RSVP email','我沒有 RSVP 電郵'],useEmail:['Use my RSVP email','使用我的 RSVP 電郵'],
  unknownName:['We couldn’t find a team under that name. Check your full name with your team representative.','找不到這個姓名所屬的隊伍。請向隊伍代表確認你的全名。'],invalidName:['Enter your full name.','請輸入全名。'],
  lookupError:['The team list couldn’t be loaded. Try again.','未能載入隊伍名單，請重試。'],
  sorting:['The hat is listening…','分類帽正在聆聽…'],hatPause:['The hat has made its decision.','分類帽已作出選擇。'],reveal:['The hat reveals…','分類帽揭曉…'],sortingBanner:['School crest','學院圖騰'],
  choices:['Dress code options','服裝主題選擇'],askRep:['Ask your team representative which dress code your team will wear.','請向你的隊伍代表查詢隊伍選定的服裝主題。'],
  yourTeam:['Your team','你的隊伍'],generalManagement:['General Management','總管理部'],representative:['Team Representative','隊伍代表'],another:['Check another email','查詢其他電郵'],
  date:['24 December 2026 · HKT','2026 年 12 月 24 日 · 香港時間'],
  photos:['Outfit gallery','穿搭相簿'],photo:['Outfit photo','穿搭相片'],galleryHint:['Drag to browse, or select the centre photo to enlarge it.','拖動瀏覽，或按中央相片放大。'],viewGallery:['Back to the gallery','返回相簿'],loadPhotosError:['Could not load the wall photos.','未能載入牆上相片。'],
  hallTv:['Tips for MV Challenge','MV 挑戰貼士'],
  previous:['Previous photo','上一張相片'],next:['Next photo','下一張相片'],
  mirror:['Try-On Mirror','虛擬試穿鏡'],openMirror:['Open Camera','開啟試穿相機'],
  outfitReferences:['Outfit References','穿搭靈感'],
  openStudio:['Try-On The Style','試穿這個造型'],
  studioHint:['Try a room look with your camera or a photo.','用相機或相片試穿這間房的造型。'],
  rules:['Challenge rules','挑戰規則'],rulesShort:['Rules','規則'],deadline:['Submit by 1:00 p.m.','下午 1 時前提交'],everyone:['Everyone is encouraged to take part.','鼓勵每位隊員參與。'],
  watch:['Watch original','觀看原片'],sourceLink:['Original','原片'],instagramPlay:['Use the Instagram player or select Original.','請使用 Instagram 播放器，或選擇原片。'],
  clips:['Clips','短片'],examples:['Choose a Reel','選擇短片'],examplesOpen:['Open source','開啟來源'],playExample:['Play on the TV','在電視播放'],
  videoLoading:['Loading Reel…','正在載入短片…'],videoSlow:['If the clip doesn’t start, select Original.','如短片未能開始，請選擇原片。'],
  fullscreen:['Fullscreen','全螢幕'],exitFullscreen:['Back to TV','返回電視'],fullscreenError:['Fullscreen is unavailable.','未能開啟全螢幕。'],videoError:['The TV video could not be played.','未能播放電視影片。'],
};

export function mountHouseInterior({root,outside,trigger,entrance,onEnter,onReveal,onTvAudio,onTvFullscreen,onSceneChange}){
  const motionQuery=matchMedia('(prefers-reduced-motion: reduce)');
  let scene='outside',panel='',look=0,assignment=null,lookupValue='',lookupMethod='email',error='',checking=false,revealing=false,paused=false,transitioning=false,origin='',sequence=0;
  let exteriorTrigger=trigger,revealTimer;
  let hallPan=0,hallDrag=null;
  const galleries=new Map(Object.keys(schools).map(id=>[id,{photos:[],scroll:0,focused:0,message:'',opening:false}]));
  const motion=()=>paused||motionQuery.matches||document.body.classList.contains('calm');
  const zh=()=>document.documentElement.lang==='zh-Hant';
  const copy=key=>words[key][+zh()];
  const local=label=>label[+zh()];
  const roomTv=createRoomTv(root,zh,onTvAudio,onTvFullscreen);
  const syncAtrium=attachAtriumCharacters(root,{chinese:zh,still:motion});
  const outfitGallery=attachOutfitGallery(root,()=>galleries.get(scene));
  const returnLabel=()=>panel==='photo'?copy('backRoom'):copy('back');
  const crest=id=>art(`crest-${id}`);
  const name=id=>local(schools[id].name);
  const btn=(a,label,classes='',value='')=>`<button class="${classes}" type="button" data-house="${a}"${value?` data-value="${value}"`:''}>${label}</button>`;
  const updateTrigger=()=>{
    trigger.setAttribute('aria-label',copy('enter'));
    entrance.setAttribute('aria-label',copy('enterAtrium'));
    trigger.querySelector('#doorHint').textContent=copy('enter');
  };
  function cancelSorting(){
    clearTimeout(revealTimer);
    checking=false;revealing=false;
  }
  function go(next,watchTv=false){
    if(transitioning||next===scene)return;
    const from=scene;
    center();
    if(document.documentElement.dataset.portraitBlocked==='true')return;
    panel='';cancelSorting();sequence++;
    if(next==='outside'){
      syncAtrium(false);
      scene=next;root.hidden=true;root.inert=true;outside.inert=false;outside.removeAttribute('aria-hidden');
      document.body.classList.remove('inside-house');onSceneChange?.(scene);exteriorTrigger.focus({preventScroll:true});return;
    }
    if(from==='outside'){
      if(next==='lobby')void publishedPhotos().catch(()=>{});
      hallPan=0;
      root.hidden=false;root.inert=false;outside.inert=true;outside.setAttribute('aria-hidden','true');
      document.body.classList.add('inside-house');onEnter();
    }
    scene=next;transitioning=!motion();
    onSceneChange?.(scene);
    if(schools[next])galleries.get(next).opening=true;
    if(next==='lobby'){
      roomTv.reset('lobby');
      roomTv.setFiles('lobby',localReels);
    }
    render();
    if(schools[next])void loadRoomMedia(next);
    const arrived=()=>{
      if(watchTv)focusPanel('tv','tv');
      else root.querySelector('#house-title')?.focus({preventScroll:true});
    };
    if(transitioning){
      const token=sequence;const door=root.querySelector('.house-passage');
      const finish=()=>{
        if(token!==sequence||!transitioning)return;
        transitioning=false;
        door.remove();
        render();
        arrived();
      };
      door.addEventListener('animationend',event=>{if(event.target===door)finish();});setTimeout(finish,820);
    }else arrived();
  }
  function focusPanel(next,source,sourceValue){
    if(transitioning)return;
    origin=sourceValue===undefined?`[data-house="${source}"]`:`[data-house="${source}"][data-value="${sourceValue}"]`;
    panel=next;error='';cancelSorting();render();
    root.querySelector('[data-panel-heading]')?.focus({preventScroll:true});
  }
  function closePanel(){
    if(!panel)return;
    if(panel==='photo'){
      galleries.get(scene).focused=look;
      origin=`[data-house="photo"][data-value="${look}"]`;
    }
    cancelSorting();sequence++;panel='';render();
    const target=root.querySelector(origin)||root.querySelector('#house-title');
    target?.focus({preventScroll:true});
    if(target?.matches('[data-house=photo]'))target.scrollIntoView({block:'nearest',inline:'nearest'});
  }
  function renderHall(){
    const doors=Object.keys(schools).map(id=>btn('room',`<span class="door-sign hall-plaque">
      <span class="plaque-hangers" aria-hidden="true"></span>${crest(id)}<span class="crest-plaque hall-incised">${name(id)}</span>
    </span>`,'school-door',id)).join('');
    const board=btn('rundown',`${art('rundown')}
      <span class="hall-board-face"><span class="hall-incised">${copy('rundown')}</span>
        <span class="hall-board-time" aria-hidden="true">${rundown[0][0]}–${rundown.at(-1)[0]}</span>
        <span class="hall-inspect" aria-hidden="true">↗</span>
      </span>`,'house-prop house-board');
    const chair=btn('chair',`<span class="chair-preview" aria-hidden="true">
      ${art('chair-front')}${art('sorting-hat-rest','class="chair-preview-hat"')}
    </span><span class="hall-chair-label">${copy('chair')} <span aria-hidden="true">↗</span></span>`,'house-prop house-chair');
    const tv=btn('tv',`<span class="hall-tv-screen">
      <strong>${copy('hallTv')}</strong><i aria-hidden="true">▶</i>
    </span>`,'house-prop hall-tv atrium-tv-art');
    return `<div class="hall-world" data-hall-world>
      <div class="hall-doors">${doors}</div>
      <div class="hall-props">${board}${chair}${tv}</div>
    </div>${atriumCharacters(zh())}`;
  }
  function refreshGallery(){
    const gallery=galleries.get(scene);
    const frames=root.querySelector('[data-outfit-stage]');
    frames.innerHTML=gallery.photos.map((photo,index)=>
      `<button type="button" class="outfit-card" data-house="photo" data-value="${index}" aria-label="${copy('photo')} ${index+1}">
        <img src="${photo}" alt="" draggable="false">
      </button>`).join('');
    root.querySelector('.room-wall-status').textContent=gallery.message?copy(gallery.message):'';
    for(const control of root.querySelectorAll('[data-house="gallery-prev"],[data-house="gallery-next"]'))control.disabled=gallery.photos.length<2;
    outfitGallery.draw();
    if(gallery.opening&&gallery.photos.length&&!transitioning){
      gallery.opening=false;
      frames.setAttribute('data-unfold','');
    }
  }
  async function loadRoomMedia(room){
    const gallery=galleries.get(room);
    try{
      const photos=await publishedPhotos();
      gallery.photos=photos[room]||[];
      gallery.focused=Math.min(gallery.focused,Math.max(0,gallery.photos.length-1));
      gallery.message='';
    }catch{
      gallery.message='loadPhotosError';
    }
    if(scene===room&&!transitioning)refreshGallery();
  }
  function roomAtmosphere(){
    const renderParticles=(kind,count,glyphs=[''])=>Array.from({length:count},(_,i)=>{
      const x=(i*37+11)%98;
      const y=(i*29+12)%84;
      const time=6+i%6;
      const tint=i%3;
      return `<i class="${kind}" data-tint="${tint}" style="--x:${x}%;--y:${y}%;--time:${time}s;--delay:-${(i*1.7).toFixed(1)}s">${glyphs[i%glyphs.length]}</i>`;
    }).join('');
    const effects={
      rock:'<i class="room-vapor"></i><i class="room-vapor"></i><i class="room-vapor"></i>',
      disco:renderParticles('room-glint',10)+renderParticles('room-streamer',14),
      jazz:renderParticles('room-note',10,['♪','♫','♩','♬']),
      kpop:'<i class="room-spot"></i><i class="room-spot"></i><i class="room-spot"></i>'+renderParticles('room-confetti',16)
    };
    return `<div class="room-atmosphere" aria-hidden="true">${effects[scene]}</div>`;
  }
  function renderRoom(){
    return `<main class="room-scroll" data-room-scroll>
      <div class="room-layout room-exhibits">
        <section class="outfit-gallery" aria-label="${copy('photos')}" data-room-exhibit="gallery">
          <header class="outfit-section-heading">
            <h3>${copy('outfitReferences')}</h3>
          </header>
          <div class="outfit-stage" data-outfit-stage tabindex="0" aria-label="${copy('photos')}" aria-describedby="outfit-hint"></div>
          <div class="outfit-nav">
            <button class="house-action compact" type="button" data-house="gallery-prev" aria-label="${copy('previous')}">‹</button>
            <span data-outfit-count aria-live="polite"></span>
            <button class="house-action compact" type="button" data-house="gallery-next" aria-label="${copy('next')}">›</button>
          </div>
          <p id="outfit-hint">${copy('galleryHint')}</p>
          <p class="room-wall-status" role="status"></p>
        </section>
        <section class="room-mirror-exhibit" data-room-exhibit="mirror" tabindex="-1" aria-labelledby="mirror-title">
          <h3 id="mirror-title">${copy('mirror')}</h3>
          <p>${copy('studioHint')}</p>
          <a class="room-mirror room-mirror-link" href="tryon.html?genre=${scene}${zh()?'&amp;lang=zh':''}">
            <span class="mirror-surface"><span class="mirror-steam">${copy('openStudio')}</span></span>
          </a>
          ${btn('jump-gallery','↑ '+copy('viewGallery'),'house-action exhibit-jump')}
        </section>
      </div>
    </main>`;
  }
  function displayRundown(){return `<div class="house-rundown"><img class="board-back" src="${dir}rundown.webp" alt=""><div class="paper-rundown"><h2 data-panel-heading tabindex="-1">${copy('rundown')}</h2><p class="rundown-date">${copy('date')}</p><dl>${rundown.map(([time,en,traditionalChinese])=>`<div><dt>${time}</dt><dd>${local([en,traditionalChinese])}</dd></div>`).join('')}</dl><div class="rundown-tip"><strong>${copy('tips')}</strong><p>${copy('songTip')}</p></div></div></div>`;}
  function dressCodeChoices(){
    return `<section class="dress-code-choices" aria-label="${copy('choices')}">
      <h3>${copy('choices')}</h3><ul>${Object.entries(schools).map(([id,school])=>
        `<li>${crest(id)}<span>${local(school.genre)}</span></li>`).join('')}</ul>
      <p>${copy('askRep')}</p>
    </section>`;
  }
  function displayChair(){
    return `<div class="chair-ceremony">
      ${dressCodeChoices()}
      <div class="chair-cutout" aria-hidden="true">
        ${art('chair-front','class="cutout-chair"')}
        ${art('sorting-hat-rest','class="cutout-hat"')}
      </div>
      <div class="chair-words"><h2 data-panel-heading tabindex="-1">${copy('chair')}</h2></div>
    </div>`;
  }
  function displayPhoto(){
    const {photos}=galleries.get(scene);
    const title=`${copy('photo')} ${look+1}`;
    return `<div class="fashion-focus"><img src="${photos[look]}" alt="${title}" draggable="false"><div>
      <h2 data-panel-heading tabindex="-1">${copy('photos')}</h2>
      <div class="house-photo-controls">${photos.length>1?btn('previous','‹','house-action'):''}
      <span class="photo-index" aria-live="polite">${look+1} / ${photos.length}</span>${photos.length>1?btn('next','›','house-action'):''}</div>
    </div></div>`;
  }
  function displayTv(){
    return `<div class="tv-focus atrium-tv-focus">
      <h2 data-panel-heading tabindex="-1">${copy('hallTv')}</h2>
      <div class="room-television" data-room-tv>${roomTv.render('lobby',true)}</div>
      <details class="tv-examples" data-tv-details="rules"><summary>${copy('rules')}</summary>
        <div class="tv-rule-sheet">
          <ol>${reelRules.map(rule=>`<li>${local(rule)}</li>`).join('')}</ol>
          <p>${copy('everyone')}</p>
        </div>
      </details>
      <details class="tv-examples" data-tv-details="clips"><summary>${copy('examples')}</summary><ul>
        ${sharedReels.map((clip,i)=>`<li>${btn('tv-reference',`${escapeHtml(clip.title)}<small>${copy('playExample')}</small>`,'tv-example-choice',String(i))}</li>`).join('')}
      </ul></details>
    </div>`;
  }
  function render(){
    if(scene==='outside')return;
    const previousRoom=galleries.get(root.dataset.scene);
    const previousScroll=root.querySelector('[data-room-scroll]');
    if(previousRoom&&previousScroll)previousRoom.scroll=previousScroll.scrollTop;
    roomTv.disconnect();
    const room=schools[scene];
    root.dataset.scene=scene;
    root.dataset.panel=panel||'none';
    root.dataset.room=String(Boolean(room));
    root.dataset.still=String(motion());
    root.style.setProperty('--house-accent',room?.accent||'#f6d594');
    root.innerHTML=`<div class="house-background" aria-hidden="true">${art(room?.art||'atrium')}</div>
      <div class="house-shade" aria-hidden="true"></div>
      ${room?roomAtmosphere():''}
      <div class="house-scene${room?' room-scene':''}" ${panel?'inert aria-hidden="true"':transitioning?'inert':''}>
        <header class="house-top"><div class="house-top-actions">${room?'':btn('outside','‹ '+copy('outside'),'house-action')}${btn('motion',motion()?'▷':'Ⅱ','house-action compact')}</div>
          <div class="house-heading">${room?crest(scene):''}<h2 id="house-title" tabindex="-1">${room?name(scene):copy('lobby')}</h2></div>
        </header>
        ${room?renderRoom():renderHall()}
        ${room?`<footer class="interior-return">${btn('lobby','‹ '+copy('back'),'house-action return-button')}</footer>`:`<footer class="hall-nav" aria-label="${copy('insideHint')}">${btn('pan-left','‹','house-action compact')}<span>${copy('insideHint')}</span>${btn('pan-right','›','house-action compact')}</footer>`}
      </div>
      ${panel?`<section class="house-focus" role="dialog" aria-modal="true" aria-labelledby="interior-dialog-title"><div class="focus-content">${panel==='rundown'?displayRundown():panel==='chair'?displayChair():panel==='photo'?displayPhoto():displayTv()}</div><footer class="interior-return">${btn('close','‹ '+returnLabel(),'house-action return-button')}</footer></section>`:''}
      ${transitioning?'<div class="house-passage" aria-hidden="true"><i></i><i></i></div>':''}`;
    root.querySelector('[data-panel-heading]')?.setAttribute('id','interior-dialog-title');
    if(room){
      refreshGallery();
      root.querySelector('[data-room-scroll]').scrollTop=galleries.get(scene).scroll;
    }
    syncAtrium(scene==='lobby'&&!panel&&!transitioning);
    if(panel==='tv')roomTv.connect('lobby');
    if(scene==='lobby')placeHall(hallPan);
    const motionButton=root.querySelector('[data-house=motion]');
    motionButton?.setAttribute('aria-label',copy(motion()?'resume':'pause'));
    motionButton?.setAttribute('title',copy(motion()?'resume':'pause'));
    motionButton?.setAttribute('aria-pressed',String(motion()));
    if(motionButton&&(motionQuery.matches||document.body.classList.contains('calm')))motionButton.disabled=true;
    root.querySelector('[data-house=previous]')?.setAttribute('aria-label',copy('previous'));
    root.querySelector('[data-house=next]')?.setAttribute('aria-label',copy('next'));
  }
  for(const button of [trigger,entrance])button.addEventListener('click',()=>{exteriorTrigger=button;go('lobby');});
  const watcher=new MutationObserver(()=>{
    updateTrigger();if(scene!=='outside'&&!transitioning)render();
  });
  watcher.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});updateTrigger();
  motionQuery.addEventListener('change',()=>{
    center();
    if(revealing&&motionQuery.matches)cancelSorting();
    render();
  });
  root.addEventListener('click',event=>{
    const button=event.target.closest('[data-house]');if(!button||transitioning)return;
    const action=button.dataset.house;
    if(action==='outside'||action==='lobby'){go(action);return;}
    if(action==='pan-left'||action==='pan-right'){stepHall(action==='pan-left'?-1:1);return;}
    if(action==='room'){go(button.dataset.value);return;}
    if(action==='close'){closePanel();return;}
    if(action==='motion'){if(motionQuery.matches||document.body.classList.contains('calm'))return;paused=!paused;center();render();root.querySelector('[data-house=motion]').focus();return;}
    if(action==='gallery-prev'||action==='gallery-next'){outfitGallery.step(action==='gallery-prev'?-1:1);return;}
    if(action==='jump-gallery'){
      const section=root.querySelector('[data-room-exhibit="gallery"]');
      section.scrollIntoView({behavior:motion()?'auto':'smooth',block:'start'});
      return;
    }
    if(action==='tv-rules'||action==='tv-clips'){
      const details=root.querySelector(`[data-tv-details="${action.slice(3)}"]`);
      details.open=true;
      details.querySelector('summary').focus({preventScroll:true});
      details.scrollIntoView({block:'start'});
      return;
    }
    if(action==='tv-reference'){
      roomTv.selectClip('lobby',Number(button.dataset.value));
      root.querySelector('[data-panel-heading]').focus({preventScroll:true});
      root.querySelector('[data-room-tv]').scrollIntoView({block:'start'});
      return;
    }
    if(roomTv.handle(action,button))return;
    if(action==='next'||action==='previous'){
      const length=galleries.get(scene).photos.length;
      look=(look+(action==='next'?1:length-1))%length;
      render();root.querySelector(`[data-house=${action}]`).focus();return;
    }
    if(action==='photo'){
      const clicked=Number(button.dataset.value);
      if(clicked!==galleries.get(scene).focused){outfitGallery.select(clicked);return;}
      look=clicked;
    }
    if(action==='chair'){assignment=null;lookupMethod='email';lookupValue='';}
    focusPanel(action,action,button.dataset.value);
  });
  function placeHall(value){
    const world=root.querySelector('.hall-world');
    if(!world)return;
    const limit=Math.max(0,(world.offsetWidth-root.clientWidth)/2-25);
    hallPan=Math.max(-limit,Math.min(limit,value));
    root.style.setProperty('--hall-pan',`${hallPan}px`);
    for(const [direction,key,available] of [
      ['pan-left','left',hallPan<limit-.5],['pan-right','right',hallPan>-limit+.5]
    ]){
      const button=root.querySelector(`[data-house=${direction}]`);
      if(!button)continue;
      button.setAttribute('aria-label',copy(key));
      button.setAttribute('aria-disabled',String(!available));
    }
  }
  function stepHall(direction){placeHall(hallPan-direction*Math.min(root.clientWidth*.72,320));}
  function sway(event){
    if(motion()||panel||transitioning)return;
    const mobile=innerWidth<700,limit=mobile?23:12;
    root.style.setProperty('--sway-x',`${(0.5-event.clientX/innerWidth)*2*limit}px`);
    root.style.setProperty('--sway-y',`${(0.5-event.clientY/innerHeight)*12}px`);
  }
  function center(){root.style.removeProperty('--sway-x');root.style.removeProperty('--sway-y');}
  function releaseHall(event){
    if(hallDrag?.id!==event.pointerId)return;
    hallDrag=null;
    delete root.dataset.dragging;
  }
  root.addEventListener('pointerdown',event=>{
    if(scene!=='lobby'||panel||transitioning||event.button!==0||!event.isPrimary)return;
    if(event.target.closest('.house-top,.hall-nav,[data-actor]'))return;
    hallDrag={id:event.pointerId,start:event.clientX,pan:hallPan,moved:false};
  });
  root.addEventListener('pointermove',event=>{
    if(hallDrag?.id===event.pointerId){
      const delta=event.clientX-hallDrag.start;
      if(!hallDrag.moved&&Math.abs(delta)>7){
        hallDrag.moved=true;
        root.setPointerCapture(event.pointerId);
        root.dataset.dragging='true';
        center();
      }
      if(hallDrag.moved){placeHall(hallDrag.pan+delta);return;}
    }
    if(event.pointerType==='mouse')sway(event);
  });
  root.addEventListener('pointerleave',center);
  root.addEventListener('pointerup',event=>{releaseHall(event);if(event.pointerType!=='mouse')center();});
  root.addEventListener('pointercancel',event=>{releaseHall(event);center();});
  root.addEventListener('lostpointercapture',event=>{
    // A touched door loses its implicit capture when the hall takes over the drag.
    if(event.target===root)releaseHall(event);
  });
  root.addEventListener('focusin',event=>{
    if(scene!=='lobby'||panel||!event.target.matches(':is(.school-door,.house-prop):focus-visible'))return;
    const bounds=(event.target.querySelector('.door-sign')||event.target).getBoundingClientRect();
    if(bounds.left<16||bounds.right>root.clientWidth-16)placeHall(hallPan+root.clientWidth/2-(bounds.left+bounds.width/2));
  });
  window.addEventListener('resize',()=>{if(scene==='lobby'&&!root.hidden)placeHall(hallPan);else outfitGallery.draw();});
  document.addEventListener('keydown',event=>{
    if(root.hidden||document.documentElement.dataset.portraitBlocked==='true')return;
    if(document.fullscreenElement)return;
    if(root.hasAttribute('data-tv-expanded')){
      if(event.key==='Escape'){
        event.preventDefault();roomTv.handle('tv-exit');
      }else if(event.key==='Tab'){
        const media=root.querySelector('.room-video-stage > :is(video,iframe)');
        const exit=root.querySelector('.room-video-exit');
        if(event.shiftKey?document.activeElement===media:document.activeElement===exit){
          event.preventDefault();(event.shiftKey?exit:media)?.focus();
        }
      }
      return;
    }
    if(event.key==='Escape'){event.preventDefault();if(panel)closePanel();else go(scene==='lobby'?'outside':'lobby');return;}
    if(scene==='lobby'&&!panel&&!transitioning&&['ArrowLeft','ArrowRight'].includes(event.key)){
      event.preventDefault();stepHall(event.key==='ArrowLeft'?-1:1);return;
    }
    if(event.key!=='Tab'||!panel)return;
    const list=[...root.querySelectorAll('.house-focus button:not([disabled]),.house-focus input,.house-focus a[href],.house-focus summary')].filter(e=>e.getClientRects().length);
    if(!list.length)return;
    const focus=document.activeElement,first=list[0],last=list.at(-1);
    if(event.shiftKey&&(focus===first||!list.includes(focus))){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&(focus===last||!list.includes(focus))){event.preventDefault();first.focus();}
  });
  document.addEventListener('visibilitychange',()=>{
    if(document.hidden&&revealing){cancelSorting();render();}
  });
  return {
    openHall:watchTv=>go('lobby',watchTv),
    openRoom:id=>{if(Object.hasOwn(schools,id))go(id);}
  };
}
