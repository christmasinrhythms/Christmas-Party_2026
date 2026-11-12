import {createIntroMediaLock,shouldCutIntro,isPhoneDevice,portraitBlocked} from './intro-media.mjs?v=immersive-mobile-portrait-20261112';
import {calendarPlatformLinks,isMobileCalendar} from './calendar-platform.mjs';
import {INVITE_ART,isPhoneLayout,inviteGeometry,phoneInviteWidth,fitPhoneInvite,sideExploreState} from './invite-layout.mjs';
import {createSoundControls} from './audio-ui.mjs?v=immersive-mobile-portrait-20261112';
import {WoodenFlipClock} from './flip-clock.mjs';
import {countdown,cameraFrame,focusCamera,icsContent} from './domain.mjs';
const $=s=>document.querySelector(s);const $$=s=>[...document.querySelectorAll(s)];
let manifest,locale='en',phase='loading',assetFailures=0;
const loadingState={settled:0,total:0,complete:false,failed:false};
const reduced=matchMedia('(prefers-reduced-motion: reduce)');let calm=reduced.matches;
const inviteCoarse=matchMedia('(pointer:coarse), (any-pointer:coarse)');
let blobURL,toastTimer,toastKey,lastDialogTrigger,activeDialog,flipClock;
const words={en:{rsvp_here:'RSVP HERE',door_return:'Back to the house',continue_scene:'Continue to the house',skip_intro:'Skip introduction',play_intro:'Play introduction',external_form:'Opens Microsoft Forms in a new tab',the_gathering:'THE GATHERING',save_date:'SAVE THE DATE',directions:'Get directions ↗',door_story:'A little more Christmas magic is on its way.',nav_date:'Date',nav_countdown:'Countdown',nav_rsvp:'RSVP',nav_venue:'Venue',nav_door:'Door',explore:'Drag to explore · select an object',explore_touch:'Swipe to explore · find the signs',pause_motion:'Pause motion',resume_motion:'Resume motion',tilt_disable:'Disable tilt',tilt_wait:'Tilt enabled when motion is available. Drag always works.',tilt_denied:'Motion is unavailable. You can still drag to explore.',house_region:'Explore the Christmas house. Drag or use arrow keys to pan; plus and minus to zoom; zero resets the view.',objects:'Explore house objects',language_label:'Switch to Traditional Chinese',ready:'The house is ready.',started:'The celebration has begun.',countdown_label:'Countdown to 24 December: ',video_label:'Opening film',loading_label:'Loading the Christmas house',loading_error:'Some decorations could not load. You can still enter.',retry_intro:'Video unavailable. Continue to the house.',asset_progress:'assets ready',date_focus:'Event date and time',lock_label:'Tap the door lock — Coming Soon'},'zh-Hant':{rsvp_here:'立即報名',door_return:'返回大屋',continue_scene:'繼續前往門口',skip_intro:'略過開場',play_intro:'播放開場',external_form:'於新分頁開啟Microsoft Forms報名表',the_gathering:'聖誕相聚',save_date:'記下這一天',directions:'查看路線 ↗',door_story:'更多聖誕魔法，正在準備中。',nav_date:'日期',nav_countdown:'倒數',nav_rsvp:'回覆邀請',nav_venue:'場地',nav_door:'門口',explore:'拖曳探索 · 點選場景物件',explore_touch:'滑動探索 · 尋找兩側木牌',pause_motion:'暫停動態',resume_motion:'恢復動態',tilt_disable:'停用傾斜控制',tilt_wait:'裝置支援時會啟用傾斜控制；仍可拖曳探索。',tilt_denied:'暫時無法使用傾斜控制，請拖曳探索。',house_region:'探索聖誕音樂屋。拖曳或按方向鍵移動畫面；加號及減號縮放，零鍵重設。',objects:'探索門口物件',language_label:'切換至英文',ready:'聖誕音樂屋已準備好。',started:'活動已經開始。',countdown_label:'距離12月24日聖誕聚會：',video_label:'開場影片',loading_label:'正在載入聖誕音樂屋',loading_error:'部分裝飾未能載入，仍可進入門口。',retry_intro:'影片暫時無法播放，請繼續前往門口。',asset_progress:'項素材已就緒',date_focus:'活動日期及時間',lock_label:'輕按門鎖 — 即將推出'}};
Object.assign(words.en,{rotate_phone:'Please rotate your phone',rotate_hint:'A little Christmas magic, best enjoyed upright.',music_region:'Music and sound',music_controls:'Music controls',music_previous:'Previous song',music_next:'Next song',music_play:'Play music',music_pause:'Pause music',music_volume:'Music volume',sfx_volume:'Effects volume',music_mute:'Mute music',music_unmute:'Unmute music',music_expand:'Show music controls',music_collapse:'Hide music controls',music_playing:'Now playing',music_paused:'Tap to play',music_blocked:'Tap to play · sound is off',music_background:'Paused in background',music_muted:'Music muted',music_loading:'Loading music…',music_error:'Music unavailable · tap to retry',sfx_enabled:'Sound effects on',sfx_disabled:'Sound effects off',sfx_unavailable:'Sound effects unavailable',sound_enable:'Enable sound',left_explore:'More on the left · View RSVP',right_explore:'More on the right · View venue',calendar_phone_hint:'Your phone may open the installed app. If it stays in the browser, use the web version or calendar file.',calendar_google_web:'Google web',calendar_outlook_web:'Outlook web',calendar_download_file:'Download .ics',calendar_apple_open:'Apple Calendar',sound_mute_all:'Mute all',sound_unmute_all:'Unmute all',sound_all_muted:'All sound muted',elf_hello:'Say hello to the elf',snowman_hello:'Say hello to the snowman'});
Object.assign(words['zh-Hant'],{rotate_phone:'請將手機轉回直向',rotate_hint:'直向欣賞，延續這份聖誕魔法。',music_region:'音樂與音效',music_controls:'音樂控制',music_previous:'上一首',music_next:'下一首',music_play:'播放音樂',music_pause:'暫停音樂',music_volume:'音樂音量',sfx_volume:'音效音量',music_mute:'音樂靜音',music_unmute:'取消音樂靜音',music_expand:'展開音樂控制',music_collapse:'收起音樂控制',music_playing:'正在播放',music_paused:'點按播放',music_blocked:'點按播放 · 聲音未開啟',music_background:'背景已暫停',music_muted:'音樂已靜音',music_loading:'載入音樂中…',music_error:'音樂暫未能播放 · 點按重試',sfx_enabled:'音效開啟',sfx_disabled:'音效關閉',sfx_unavailable:'音效暫不可用',sound_enable:'點按開啟聲音',left_explore:'左側還有內容・查看報名',right_explore:'右側還有內容・查看場地',calendar_phone_hint:'手機可能會開啟已安裝的 App。如仍停留在瀏覽器，請使用網頁版或日曆檔。',calendar_google_web:'Google 網頁版',calendar_outlook_web:'Outlook 網頁版',calendar_download_file:'下載日曆檔 (.ics)',calendar_apple_open:'Apple 日曆',sound_mute_all:'全部靜音',sound_unmute_all:'取消全部靜音',sound_all_muted:'所有聲音已靜音',elf_hello:'跟小精靈打招呼',snowman_hello:'跟雪人打招呼'});
function t(key){return manifest?.labels[key]?.[locale]??words[locale][key]??words.en[key]??key;}
const soundControls=createSoundControls({t});
function renderLoadStatus(){if(loadingState.complete&&loadingState.failed){$('#loadCount').textContent=t('loading_error');}else if(loadingState.total){$('#loadCount').textContent=`${loadingState.settled} / ${loadingState.total} ${t('asset_progress')}`;}}
function pngLabel(el,key){el.replaceChildren();const item=manifest?.labels?.[key];if(item?.png?.[locale]){const img=new Image();img.src=item.png[locale];img.alt=t(key);img.draggable=false;img.onerror=()=>{el.textContent=t(key);};el.append(img);}else el.textContent=t(key);}
function applyLanguage(){document.documentElement.lang=locale;document.title=locale==='en'?'Christmas in Rhythms · The Doorstep':'Christmas in Rhythms · 聖誕門口';if(phase==='scene')$('#sceneStatus').textContent=t('ready');renderLoadStatus();for(const el of $$('[data-t]'))el.textContent=t(el.dataset.t);for(const el of $$('[data-label]'))pngLabel(el,el.dataset.label);for(const el of $$('[data-title]')){el.title=t(el.dataset.title);el.setAttribute('aria-label',t(el.dataset.title));}$('#languageToggle').textContent=t('language');$('#languageToggle').setAttribute('aria-label',t('language_label'));$('#viewport').setAttribute('aria-label',t('house_region'));$('.scene-nav').setAttribute('aria-label',t('objects'));$('#intro').setAttribute('aria-label',t('video_label'));$('#loadProgress').setAttribute('aria-label',t('loading_label'));$('#dateObject').setAttribute('aria-label',t('date_focus'));$('#doorLock').setAttribute('aria-label',t('lock_label'));$('#exploreHint').textContent=t((innerWidth<700||matchMedia('(pointer:coarse)').matches)?'explore_touch':'explore');updateMotionLabel();updateTiltLabel();if(toastKey&&!$('#toast').hidden)$('#toast').textContent=t(toastKey);$('#rsvpLink').setAttribute('aria-label',t('rsvp_here')+' — '+t('external_form'));renderAddress();setCalendar();updateCountdown();fitSceneLabels();soundControls.applyLanguage();}
// Fit localized live lettering to the actual wood/bubble safe area, without stretching art.
function fitText(el,width,measure,max=Number(el.dataset.max)||32,min=Number(el.dataset.min)||12){
 if(!width)return;let low=min,high=max;el.style.fontSize=high+'px';if(measure()<=width)return;
 for(let i=0;i<9;i++){const mid=(low+high)/2;el.style.fontSize=mid+'px';if(measure()>width)high=mid;else low=mid;}
 el.style.fontSize=Math.floor(low*10)/10+'px';
}
function fitSceneLabels(){
 for(const el of $$('[data-fit]'))if(!el.closest('.wood-action'))fitText(el,el.clientWidth,()=>el.scrollWidth);
 for(const button of $$('.wood-action')){
  const label=button.querySelector('[data-fit]'),group=button.querySelector('.wood-action-group');if(!label||!group||!button.clientWidth)continue;
  const css=getComputedStyle(button),available=button.clientWidth-parseFloat(css.paddingLeft)-parseFloat(css.paddingRight);
  fitText(label,available,()=>group.scrollWidth);
 }
 fitAddress();
}
function renderAddress(){
 const en=locale==='en',heading=$('#addressHeading'),body=$('#addressText');
 const headingParts=en?['Harbour Grand','Hong Kong']:['港島海逸君綽酒店'];
 const addressParts=en?['1/F','Harbour Grand Hong Kong','23 Oil Street','North Point']:['香港北角','油街23號','港島海逸君綽酒店','1樓'];
 const span=(text,cls)=>{const e=document.createElement('span');e.className=cls;e.textContent=text;return e;};
 heading.replaceChildren(...headingParts.map(text=>span(text,'address-heading-line')));heading.setAttribute('aria-label',t('venue_full'));
 const full=span(t('address'),'sr-only');full.id='addressFullText';body.replaceChildren(full,...addressParts.map(text=>{const e=span(text,'address-phrase');e.setAttribute('aria-hidden','true');return e;}));
 fitAddress();
}
function fitAddress(){
 const heading=$('#addressHeading'),body=$('#addressText');
 fitText(heading,heading.clientWidth,()=>heading.scrollWidth,innerWidth<700?28:32,22);
 fitText(body,body.clientWidth,()=>body.scrollWidth,20,16);
}
if(document.fonts?.ready)document.fonts.ready.then(fitSceneLabels);
$('#languageToggle').addEventListener('click',()=>{locale=locale==='en'?'zh-Hant':'en';applyLanguage();});
function toast(key){toastKey=key;clearTimeout(toastTimer);$('#toast').textContent=t(key);$('#toast').hidden=false;toastTimer=setTimeout(()=>{$('#toast').hidden=true;},5000);}
function setCalendar(){
 if(!manifest)return;
 const phone=isMobileCalendar(navigator.userAgent,navigator.maxTouchPoints,phoneLayout());
 const links=calendarPlatformLinks(manifest.event,locale,manifest.canonical,{phone,userAgent:navigator.userAgent});
 for(const [id,href] of [['#outlookLink',links.outlook],['#googleLink',links.google]]){$(id).href=href;$(id).target=links.target;}
 if(blobURL)URL.revokeObjectURL(blobURL);
 blobURL=URL.createObjectURL(new Blob([icsContent(manifest.event,locale,manifest.canonical)],{type:'text/calendar;charset=utf-8'}));
 const apple=$('#appleLink');
 if(phone){apple.href=links.file;apple.removeAttribute('download');apple.target='_self';apple.textContent=t('calendar_apple_open');}
 else{apple.href=blobURL;apple.setAttribute('download','christmas-in-rhythms.ics');apple.removeAttribute('target');apple.textContent=t('calendar_apple');}
 $('#phoneCalendarNote').hidden=!phone;$('#phoneCalendarFallbacks').hidden=!phone;
 $('#googleWebLink').href=links.googleWeb;$('#outlookWebLink').href=links.outlook;
 $('#calendarFileDownload').href=phone?links.file:blobURL;
 $('#calendarDialog').classList.toggle('phone-calendar',phone);
}
function openDialog(id,trigger){endHover(true);const dialog=document.getElementById(id);lastDialogTrigger=trigger||document.activeElement;activeDialog=dialog;syncLockTooltip();dialog.showModal();if(id==='addressDialog')fitAddress();dialog.querySelector('button')?.focus();}
for(const dialog of $$('dialog')){dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});dialog.addEventListener('close',()=>{if(dialog.open||(orientationBlocked&&suspendedDialog===dialog))return;activeDialog=null;lastDialogTrigger?.focus({preventScroll:true});syncLockTooltip();});}
for(const close of $$('[data-close]'))close.addEventListener('click',()=>document.getElementById(close.dataset.close).close());
$('#addressOpen').addEventListener('click',e=>openDialog('addressDialog',e.currentTarget));$('#calendarOpen').addEventListener('click',e=>{setCalendar();openDialog('calendarDialog',e.currentTarget);});$('#doorLock').addEventListener('click',e=>openDialog('doorDialog',e.currentTarget));
const lockButton=$('#doorLock'),lockTooltip=$('#lockTooltip');let lockHovered=false;
function syncLockTooltip(){const show=!activeDialog&&(lockHovered||document.activeElement===lockButton);lockButton.classList.toggle('show-lock-tooltip',show);lockTooltip.setAttribute('aria-hidden',String(!show));}
lockButton.addEventListener('pointerenter',()=>{lockHovered=true;syncLockTooltip();});
lockButton.addEventListener('pointerleave',()=>{lockHovered=false;syncLockTooltip();});
lockButton.addEventListener('focus',syncLockTooltip);lockButton.addEventListener('blur',syncLockTooltip);
for(const link of $$('.calendar-links a,.calendar-phone-fallbacks a'))link.addEventListener('click',()=>{$('#calendarDialog').close();});
// One camera owns zoom, drag, pointer parallax and tilt. Every result is clamped after composition.
const viewport=$('#viewport'),world=$('#world');let size={w:innerWidth,h:innerHeight};let camera={zoom:1,panX:0,panY:0},current={...camera},pointer={x:0,y:0},tilt={x:0,y:0},drag=null,lastFrame=0;let selection=null,hover=null,hoverTimer,hoverPending=null,hoverCooldown=0;
const anchors={date:[511.423,876.224],countdown:[972.891933187124,492.1501607598212],invite:[472.5,578.75],venue:[1490,871.28],door:[1094,772],elf:[256,845],snowman:[1708,850]};
function phoneLayout(){return isPhoneLayout(size.w,size.h,inviteCoarse.matches);}
function phoneInviteSafeRect(){
 const toolbar=$('.toolbar').getBoundingClientRect(),nav=$('.scene-nav').getBoundingClientRect();
 return {left:12,right:size.w-12,top:Math.max(80,toolbar.bottom+16),bottom:Math.min(size.h-110,nav.top-28)};
}
function focusObject(name,focusTarget=false){
 endHover(false);selection=name;const point=anchors[name];if(!point)return;
 if(name==='invite'&&phoneLayout())camera=fitPhoneInvite(size.w,size.h,{coarse:inviteCoarse.matches,safe:phoneInviteSafeRect()}).camera;
 else camera=focusCamera(size.w,size.h,point,size.w<700?1.05:1.2);
 clampCamera();for(const b of $$('[data-go]'))b.setAttribute('aria-current',String(b.dataset.go===name));
 if(focusTarget){const el={date:$('#dateObject'),countdown:$('#countdownObject'),invite:$('#rsvpLink'),venue:$('#addressOpen'),door:$('#doorLock')}[name];el?.focus({preventScroll:true});}
 renderCamera(true);syncWoodGlow();
}
function resetCamera(){endHover(false);selection=null;camera={zoom:1,panX:0,panY:0};if(size.w<700){const frame=cameraFrame(size.w,size.h,camera);camera.panY=Math.max(-frame.maxY,(540-690)*frame.scale);}else{const frame=cameraFrame(size.w,size.h,camera);camera.panY=frame.maxY;}for(const b of $$('[data-go]'))b.removeAttribute('aria-current');renderCamera(true);syncWoodGlow();}
function renderCamera(immediate=false){if(calm||immediate&&phase!=='scene')current={...camera};const frame=cameraFrame(size.w,size.h,{...current,extraX:calm?0:pointer.x+tilt.x,extraY:calm?0:(!selection&&camera.zoom===1&&size.w>=700?Math.max(0,pointer.y+tilt.y):pointer.y+tilt.y)});world.style.transform=`translate3d(${frame.x}px,${frame.y}px,0) scale(${frame.scale})`;world.style.setProperty('--world-hit',44/frame.scale+'px');const invite=layoutInvite(frame.scale);syncSideExplore(invite);}
function animateCamera(time){requestAnimationFrame(animateCamera);if(phase!=='scene'||document.hidden)return;const dt=Math.min(2,(time-lastFrame)/16.67||1);lastFrame=time;const gain=calm?1:1-Math.pow(.82,dt);for(const key of ['zoom','panX','panY'])current[key]+=(camera[key]-current[key])*gain;renderCamera();}
requestAnimationFrame(animateCamera);
function clampCamera(){const f=cameraFrame(size.w,size.h,camera);camera.panX=f.panX;camera.panY=f.panY;}
for(const b of $$('[data-go]'))b.addEventListener('click',()=>focusObject(b.dataset.go,true));
for(const b of $$('[data-focus]')){b.addEventListener('click',()=>focusObject(b.dataset.focus));b.addEventListener('focus',()=>{if(phase==='scene')focusObject(b.dataset.focus);});}
$('#leftExplore').addEventListener('click',()=>focusObject('invite',true));
$('#rightExplore').addEventListener('click',()=>focusObject('venue',true));
$('#resetView').addEventListener('click',resetCamera);$('#zoomOut').addEventListener('click',()=>{camera.zoom=Math.max(1,camera.zoom-.2);clampCamera();renderCamera(true);});
viewport.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;endHover(false);selection=null;if(e.pointerType==='touch'&&e.isPrimary===false){drag=null;return;}drag={id:e.pointerId,x:e.clientX,y:e.clientY};viewport.setPointerCapture(e.pointerId);viewport.classList.add('dragging');pointer={x:0,y:0};});
viewport.addEventListener('pointermove',e=>{if(drag&&drag.id===e.pointerId){camera.panX+=(e.clientX-drag.x)*.82;camera.panY+=(e.clientY-drag.y)*.82;drag.x=e.clientX;drag.y=e.clientY;clampCamera();}else if(e.pointerType==='mouse'&&!calm){pointer.x=(.5-e.clientX/size.w)*18;pointer.y=(e.clientY/size.h-.5)*12;}});
function endDrag(){drag=null;viewport.classList.remove('dragging');}
viewport.addEventListener('pointerup',endDrag);viewport.addEventListener('pointercancel',endDrag);viewport.addEventListener('pointerleave',()=>{pointer={x:0,y:0};endHover(true);});
viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;let used=true;if(e.key==='ArrowLeft')camera.panX+=65;else if(e.key==='ArrowRight')camera.panX-=65;else if(e.key==='ArrowUp')camera.panY+=45;else if(e.key==='ArrowDown')camera.panY-=45;else if(e.key==='+'||e.key==='=')camera.zoom=Math.min(1.8,camera.zoom+.15);else if(e.key==='-')camera.zoom=Math.max(1,camera.zoom-.15);else if(e.key==='0')resetCamera();else used=false;if(used){e.preventDefault();clampCamera();}});
window.addEventListener('resize',()=>{size={w:innerWidth,h:innerHeight};$('#exploreHint').textContent=t((size.w<700||matchMedia('(pointer:coarse)').matches)?'explore_touch':'explore');if(selection==='invite')focusObject('invite');else if(!selection&&camera.zoom===1)resetCamera();else clampCamera();current={...camera};renderCamera(true);resizeSnow();fitSceneLabels();fitCountdown();fitTitle();syncWoodGlow();if(activeDialog?.id==='calendarDialog')setCalendar();});

// Mouse-only proximity zoom preserves the hovered anchor on screen. Frozen hit rectangles
// and a cooldown prevent the camera's own movement from causing enter/leave oscillation.
function syncWoodGlow(){
 const active=document.activeElement,focusName=active?.closest('#dateObject')?'date':active?.closest('#venueObject')?'venue':null;
 const focused=focusName&&(active.matches(':focus-visible')||(size.w<700&&selection===focusName));
 for(const [name,id] of [['date','#dateObject'],['venue','#venueObject']])$(id).classList.toggle('wood-glow',!activeDialog&&(hover?.name===name||(focused&&focusName===name)));
}
function endHover(restore){clearTimeout(hoverTimer);hoverPending=null;if(hover){if(restore)camera={...hover.previous};hover=null;hoverCooldown=performance.now()+350;}syncWoodGlow();}
 document.addEventListener('focusin',syncWoodGlow);document.addEventListener('focusout',()=>requestAnimationFrame(syncWoodGlow));
function considerHover(event){if(event.pointerType!=='mouse'||drag||activeDialog||selection||performance.now()<hoverCooldown)return;const x=event.clientX,y=event.clientY;if(hover){const r=hover.rect;if(x<r.left-26||x>r.right+26||y<r.top-26||y>r.bottom+26)endHover(true);return;}let candidate=null;for(const [name,selector] of [['date','.date-face'],['venue','.venue-face'],['countdown','#countdownObject']]){const r=$(selector).getBoundingClientRect();if(x>=r.left-10&&x<=r.right+10&&y>=r.top-10&&y<=r.bottom+10){candidate={name,rect:r};break;}}if(!candidate){clearTimeout(hoverTimer);hoverPending=null;return;}if(hoverPending===candidate.name)return;clearTimeout(hoverTimer);hoverPending=candidate.name;hoverTimer=setTimeout(()=>{if(drag||activeDialog||selection)return;const previous={...camera};const anchor=anchors[candidate.name];const old=cameraFrame(size.w,size.h,camera);const zoom=Math.min(1.8,camera.zoom*1.065);const next=cameraFrame(size.w,size.h,{zoom});if(!calm){camera={zoom,panX:old.panX+(anchor[0]-960)*(old.scale-next.scale),panY:old.panY+(anchor[1]-540)*(old.scale-next.scale)};clampCamera();}hover={...candidate,previous};hoverPending=null;syncWoodGlow();},200);}
viewport.addEventListener('pointermove',considerHover);
let lastWoodChime=-Infinity;
function woodChime(){const now=performance.now();if(now-lastWoodChime<1800||activeDialog||phase!=='scene')return;lastWoodChime=now;void soundControls.effect('magicChime',.85);}
for(const id of ['#dateObject','#venueObject']){$(id).addEventListener('pointerenter',e=>{if(e.pointerType==='mouse')woodChime();});$(id).addEventListener('focusin',e=>{if(e.target.matches(':focus-visible'))woodChime();});}
for(const [id,name] of [['#elfHello','elfBell'],['#snowmanHello','snowPuff']]){const button=$(id);button.addEventListener('focus',()=>{if(phase==='scene'&&button.matches(':focus-visible'))focusObject(id==='#elfHello'?'elf':'snowman');});let reactionTimer,lastReaction=-Infinity;button.addEventListener('click',()=>{if(performance.now()-lastReaction<900)return;lastReaction=performance.now();void soundControls.effect(name,.95);clearTimeout(reactionTimer);button.classList.remove('reacting');void button.offsetWidth;button.classList.add('reacting');reactionTimer=setTimeout(()=>button.classList.remove('reacting'),850);});}

$('#addressOpen').addEventListener('focus',e=>{if(phase==='scene'&&e.currentTarget.matches(':focus-visible'))focusObject('venue');});
$('#calendarOpen').addEventListener('focus',e=>{if(phase==='scene'&&e.currentTarget.matches(':focus-visible'))focusObject('invite');});
$('#rsvpLink').addEventListener('focus',e=>{if(phase==='scene'&&e.currentTarget.matches(':focus-visible'))focusObject('invite');});
// Optional device motion: permission is requested only by this explicit button gesture.
let tiltEnabled=false,tiltBaseline=null,tiltSeen=false,tiltTimer;
function updateTiltLabel(){const key=tiltEnabled?'tilt_disable':'tilt_enable';$('#tiltToggle').setAttribute('aria-label',t(key));$('#tiltToggle').title=t(key);$('#tiltText').textContent=t(key);$('#tiltToggle').setAttribute('aria-pressed',String(tiltEnabled));}
function onTilt(e){if(!tiltEnabled||calm||e.beta==null||e.gamma==null)return;tiltSeen=true;if(!tiltBaseline)tiltBaseline={beta:e.beta,gamma:e.gamma};tilt.x=Math.max(-30,Math.min(30,-(e.gamma-tiltBaseline.gamma)*1.1));tilt.y=Math.max(-22,Math.min(22,(e.beta-tiltBaseline.beta)*.8));}
function disableTilt(){tiltEnabled=false;window.removeEventListener('deviceorientation',onTilt);tiltBaseline=null;tilt={x:0,y:0};clearTimeout(tiltTimer);updateTiltLabel();}
$('#tiltToggle').addEventListener('click',async()=>{if(tiltEnabled){disableTilt();return;}try{if(typeof DeviceOrientationEvent==='undefined'){toast('tilt_denied');return;}if(typeof DeviceOrientationEvent.requestPermission==='function'){const answer=await DeviceOrientationEvent.requestPermission();if(answer!=='granted'){toast('tilt_denied');return;}}tiltEnabled=true;tiltSeen=false;window.addEventListener('deviceorientation',onTilt);updateTiltLabel();toast('tilt_wait');tiltTimer=setTimeout(()=>{if(!tiltSeen){disableTilt();toast('tilt_denied');}},3500);}catch{disableTilt();toast('tilt_denied');}});
// Light snow and smoke are decorative. Reduced motion renders a single static snow field.
const snow=$('#snow'),ctx=snow.getContext('2d');let flakes=[],snowTime=performance.now();
function resizeSnow(){const ratio=Math.min(devicePixelRatio||1,2);snow.width=size.w*ratio;snow.height=size.h*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);flakes=Array.from({length:Math.min(85,Math.max(25,Math.floor(size.w*size.h/16000)))},()=>({x:Math.random()*size.w,y:Math.random()*size.h,r:.8+Math.random()*1.5,v:9+Math.random()*20,phase:Math.random()*6.28}));drawSnow(0);}
function drawSnow(dt){ctx.clearRect(0,0,size.w,size.h);for(const f of flakes){if(!calm&&dt){f.y=(f.y+f.v*dt)%(size.h+8);f.x=(f.x+Math.sin(f.phase+performance.now()/6500)*dt*5+size.w)%size.w;}ctx.fillStyle='rgba(255,251,237,.7)';ctx.beginPath();ctx.arc(f.x,f.y,f.r,0,Math.PI*2);ctx.fill();}}
function snowFrame(time){requestAnimationFrame(snowFrame);const dt=Math.min(.05,(time-snowTime)/1000);snowTime=time;if(phase==='scene'&&!calm&&!document.hidden)drawSnow(dt);}
requestAnimationFrame(snowFrame);
function updateMotionLabel(){const key=calm?'resume_motion':'pause_motion';$('#motionToggle').setAttribute('aria-label',t(key));$('#motionToggle').title=t(key);$('#motionText').textContent=t(key);$('#motionIcon').textContent=calm?'▷':'Ⅱ';$('#motionToggle').setAttribute('aria-pressed',String(calm));}
function setCalm(value){calm=value;document.body.classList.toggle('calm',calm);if(calm){flipClock?.settle();pointer={x:0,y:0};tilt={x:0,y:0};current={...camera};}updateMotionLabel();drawSnow(0);}
$('#motionToggle').addEventListener('click',()=>setCalm(!calm));reduced.addEventListener('change',()=>{setCalm(reduced.matches);if(reduced.matches&&phase==='intro')enterScene();});
// Eight approved wooden paddles; time remains the wall clock, never animation time.
function fitCountdown(){const base=cameraFrame(size.w,size.h,{zoom:1});const width=size.w<700?Math.min(576,(size.w-56)/base.scale):576;$('#countdownObject').style.setProperty('--clock-width',width+'px');}
function layoutInvite(scale){
 const phone=phoneLayout(),coarse=inviteCoarse.matches,host=$('#inviteObject');
 const width=phone?phoneInviteWidth(size.w,size.h):375;
 const g=inviteGeometry(scale,{phone,coarse,width});
 document.body.classList.toggle('phone-layout',phone);host.classList.toggle('phone-invite',phone);
 host.dataset.inviteInput=coarse?'coarse':'fine';host.dataset.inviteMode=phone?'phone':'desktop';
 host.style.width=g.width+'px';host.style.height=g.height+'px';host.style.top=g.top+'px';
 host.style.setProperty('--invite-row',g.row+'px');
 if(phone){
  for(const [key,value] of Object.entries({'--invite-face-top':g.faceTop,'--invite-face-height':g.faceHeight,'--invite-gap':g.gap,'--invite-caption-height':g.caption,'--invite-button-height':g.button,'--invite-tail-x':28.5,'--invite-tail-inset':12.5625}))host.style.setProperty(key,value+'px');
 }
 return g;
}
function syncSideExplore(invite){
 const left=$('#leftExplore'),right=$('#rightExplore');
 if(phase!=='scene'||!phoneLayout()||activeDialog||drag){left.hidden=true;right.hidden=true;return;}
 const rect=element=>{const r=element.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};};
 const host=rect($('#inviteObject')),scale=(host.right-host.left)/invite.width,a=INVITE_ART;
 const bubble={left:host.left-(a.scaleX-1)*a.tailX*scale,top:host.top-(a.scaleY-1)*(invite.height-a.tailInset)*scale};
 bubble.right=bubble.left+(host.right-host.left)*a.scaleX;bubble.bottom=bubble.top+(host.bottom-host.top)*a.scaleY;
 const date=rect($('#dateObject')),dateFace=rect($('.date-face')),venue=rect($('.venue-face'));
 const ui=[$('.sound-summary'),$('#soundPanel')].map(rect).filter(r=>r.right>r.left&&r.bottom>r.top);
 const state=sideExploreState(size.w,size.h,{leftRects:[bubble,dateFace],rightRects:[venue],protectedRects:[bubble,date,venue,...ui],top:Math.max(80,$('.toolbar').getBoundingClientRect().bottom+12),bottom:$('.scene-nav').getBoundingClientRect().top-12,leftX:parseFloat(getComputedStyle(left).left)||4,rightX:size.w-(parseFloat(getComputedStyle(right).right)||4)-44});
 for(const [button,position] of [[left,state.left],[right,state.right]]){button.hidden=!position;if(position)button.style.top=position.y+'px';}
}
inviteCoarse.addEventListener('change',()=>{if(selection==='invite')focusObject('invite');else renderCamera(true);fitSceneLabels();if(activeDialog?.id==='calendarDialog')setCalendar();});
function fitTitle(){
 const logo=$('#gableLogo'),base=cameraFrame(size.w,size.h,{zoom:1}),mobile=size.w<700;
 const home=cameraFrame(size.w,size.h,{zoom:1,panY:mobile?Math.max(-base.maxY,-150*base.scale):base.maxY});
 const clockWidth=mobile?Math.min(576,(size.w-56)/base.scale):576;
 const counterTop=home.y+(492.1501607598212-clockWidth*.24136/2)*base.scale;
 // Exact original2901x1361 PNG ink bounds [120,120,2781,1241].
 const safeTop=mobile?(size.h<500?12:64):4,gap=mobile?18:8,pad=mobile?18:24;
 const maxInkHeight=Math.max(40,counterTop-gap-safeTop);
 const maxInkWidth=size.w-2*pad-(mobile?0:60*base.scale);
 const width=Math.min(1053,maxInkWidth*2901/2661/base.scale,maxInkHeight*2901/1121/base.scale);
 const top=(counterTop-gap-home.y)/base.scale-width*1241/2901;
 logo.style.setProperty('--title-width',width+'px');logo.style.setProperty('--title-center',mobile?'960px':'990px');logo.style.setProperty('--title-top',top+'px');
}
function createDigits(){flipClock=new WoodenFlipClock($('#digits'),manifest.digits,['days','hours','minutes','seconds']);fitCountdown();fitTitle();}
let previousClockDigits;
function updateCountdown(animate=true){if(!manifest||!flipClock)return;const result=countdown(Date.now(),manifest.event.start_hkt);const changed=previousClockDigits!==undefined&&previousClockDigits!==result.digits;previousClockDigits=result.digits;if(changed&&animate&&phase==='scene'&&!calm&&!reduced.matches&&!document.hidden)void soundControls.effect('woodFlip',.25);flipClock.render(result.digits,{animate:animate&&phase==='scene'&&!calm&&!reduced.matches&&!document.hidden});const units=locale==='en'?[' days, ',' hours, ',' minutes, ',' seconds']:['日、','小時、','分鐘、','秒'];$('#countdownObject').setAttribute('aria-label',result.started?t('started'):t('countdown_label')+result.parts.map((n,i)=>n+units[i]).join(''));}
let countdownTimer;
function scheduleCountdown(){clearInterval(countdownTimer);flipClock?.settle();if(!document.hidden){updateCountdown(false);countdownTimer=setInterval(updateCountdown,1000);}}
document.addEventListener('visibilitychange',scheduleCountdown);
window.addEventListener('pagehide',()=>{clearInterval(countdownTimer);flipClock?.settle();soundControls.pauseForPageHide();});
window.addEventListener('pageshow',()=>{scheduleCountdown();soundControls.resumeForPageShow();});
// Genuine loading uses settled image events and video frame readiness; no timer-generated percentage.
const film=$('#opening'),chooseIntroMedia=createIntroMediaLock();let introMedia,loadingDone=false,videoReady=false,cutFrame=0;
const phoneUA=navigator.userAgentData?.mobile===true||/Mobi|iPhone|iPod|Android/i.test(navigator.userAgent);
let orientationBlocked=false,resumeFilmAfterRotate=false,guardFocus,suspendedDialog;
const guardSnapshots=new Map();
function syncPortraitGuard(){
 const profile=introMedia??{kind:isPhoneDevice({width:innerWidth,height:innerHeight,coarse:inviteCoarse.matches,mobileUA:phoneUA})?'mobile':'desktop'};
 const blocked=portraitBlocked(profile,innerWidth,innerHeight),changed=blocked!==orientationBlocked;
 orientationBlocked=blocked;document.documentElement.dataset.portraitBlocked=String(blocked);
 $('#portraitGuard').hidden=!blocked;
 for(const el of [$('#loading'),$('#intro'),$('#experience'),$('#soundPlayer'),...$$('dialog')]){
  if(blocked){if(!guardSnapshots.has(el))guardSnapshots.set(el,{inert:el.inert,aria:el.getAttribute('aria-hidden')});el.inert=true;el.setAttribute('aria-hidden','true');}
  else if(guardSnapshots.has(el)){const saved=guardSnapshots.get(el);el.inert=el.id==='experience'?phase!=='scene':saved.inert;if(saved.aria===null)el.removeAttribute('aria-hidden');else el.setAttribute('aria-hidden',saved.aria);guardSnapshots.delete(el);}
 }
 if(!changed)return;
 soundControls.setOrientationBlocked(blocked);
 if(blocked){guardFocus=document.activeElement;suspendedDialog=$$('dialog').find(el=>el.open);suspendedDialog?.close();resumeFilmAfterRotate=phase==='intro'&&!film.paused;film.pause();cancelAnimationFrame(cutFrame);soundControls.stopEffects();$('#portraitGuard').focus({preventScroll:true});}
 else{
  if(suspendedDialog){suspendedDialog.showModal();activeDialog=suspendedDialog;suspendedDialog=null;}
  if(phase==='loading'&&loadingDone&&!assetFailures)beginIntro();
  else if(phase==='intro'&&resumeFilmAfterRotate&&!document.hidden)playFilm();
  resumeFilmAfterRotate=false;
  if(guardFocus?.isConnected&&!guardFocus.closest('[inert],[hidden]'))guardFocus.focus({preventScroll:true});
 }
}
function playFilm(){
 if(orientationBlocked||document.hidden||phase!=='intro')return;
 film.play().then(()=>{if(orientationBlocked||document.hidden){film.pause();return;}$('#playIntro').hidden=true;$('#introContinue').hidden=true;watchIntro();}).catch(()=>{$('#playIntro').hidden=false;$('#introContinue').hidden=false;});
}
window.addEventListener('resize',syncPortraitGuard);
window.addEventListener('orientationchange',syncPortraitGuard);
window.visualViewport?.addEventListener('resize',syncPortraitGuard);
inviteCoarse.addEventListener('change',syncPortraitGuard);
function configureIntroMedia(){
 introMedia=chooseIntroMedia({width:size.w,height:size.h,coarse:inviteCoarse.matches,mobileUA:phoneUA,desktopSrc:manifest.assets.video});
 film.querySelector('source').src=introMedia.src;
 $('#intro').dataset.media=introMedia.kind;document.documentElement.dataset.introMedia=introMedia.kind;
 if(introMedia.kind==='mobile')film.removeAttribute('poster');
 soundControls.setIntroCues(introMedia.cues);syncPortraitGuard();
}
async function imageReady(src){return new Promise(resolve=>{const image=new Image();const timeout=setTimeout(()=>resolve(false),12000);image.onload=()=>{clearTimeout(timeout);resolve(true);};image.onerror=()=>{clearTimeout(timeout);resolve(false);};image.src=src;});}
function videoFrameReady(){return new Promise(resolve=>{let done=false;const finish=value=>{if(done)return;done=true;clearTimeout(timer);resolve(value);};const timer=setTimeout(()=>finish(false),14000);film.addEventListener('loadeddata',()=>finish(true),{once:true});film.addEventListener('error',()=>finish(false),{once:true});film.querySelector('source').addEventListener('error',()=>finish(false),{once:true});if(film.readyState>=2)finish(true);else film.load();});}
async function preload(){const paths=new Set(Object.entries(manifest.assets).filter(([k])=>k!=='video').map(([,v])=>v));for(const g of Object.values(manifest.digits))paths.add(g.src);for(const v of Object.values(manifest.labels))for(const path of Object.values(v.png||{}))paths.add(path);const total=paths.size+1;let settled=0;loadingState.total=total;$('#loadProgress').max=total;function update(ok){settled++;if(!ok)assetFailures++;$('#loadProgress').value=settled;loadingState.settled=settled;renderLoadStatus();}const images=[...paths].map(async path=>{const ok=await imageReady(path);update(ok);});const video=videoFrameReady().then(ok=>{videoReady=ok;update(ok);});await Promise.all([...images,video]);loadingDone=true;loadingState.complete=true;loadingState.failed=assetFailures>0;renderLoadStatus();$('#loadContinue').hidden=false;if(!assetFailures)beginIntro();}
function beginIntro(){if(!loadingDone||phase!=='loading'||orientationBlocked)return;if(reduced.matches||!videoReady){enterScene();return;}phase='intro';soundControls.setPhase('intro');document.documentElement.dataset.phase='intro';$('#loading').hidden=true;$('#intro').hidden=false;film.loop=false;film.muted=true;playFilm();}
function watchIntro(){cancelAnimationFrame(cutFrame);function step(){if(phase!=='intro'||orientationBlocked||document.hidden)return;soundControls.filmTime(film.currentTime);if(shouldCutIntro(introMedia,film.currentTime)){enterScene();return;}cutFrame=requestAnimationFrame(step);}cutFrame=requestAnimationFrame(step);}
let transitionStarted=false;function enterScene(){if(transitionStarted||phase==='scene')return;transitionStarted=true;const cutTime=film.currentTime;soundControls.stopEffects();film.pause();cancelAnimationFrame(cutFrame);$('#lightTransition').className='light-transition on';function reveal(){phase='scene';soundControls.setPhase('scene');$('#loading').hidden=true;$('#intro').hidden=true;$('#experience').hidden=false;$('#experience').inert=orientationBlocked;syncPortraitGuard();resetCamera();current={...camera};renderCamera(true);resizeSnow();fitSceneLabels();$('#sceneStatus').textContent=t('ready');if(!orientationBlocked)$('#viewport').focus({preventScroll:true});$('#lightTransition').className='light-transition clear';document.documentElement.dataset.phase='scene';document.documentElement.dataset.introStoppedAt=String(cutTime);}if(calm)reveal();else setTimeout(reveal,420);}
$('#loadContinue').addEventListener('click',()=>{if(!videoReady||assetFailures)enterScene();else beginIntro();});$('#skipIntro').addEventListener('click',enterScene);$('#introContinue').addEventListener('click',enterScene);$('#playIntro').addEventListener('click',playFilm);film.addEventListener('ended',enterScene);film.addEventListener('error',()=>{if(phase==='intro')enterScene();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&phase==='intro')film.pause();else if(phase==='intro'&&!orientationBlocked)playFilm();});
async function boot(){try{const response=await fetch('assets/scene-manifest.json',{cache:'no-store'});if(!response.ok)throw Error('manifest');manifest=await response.json();$('#background').src=manifest.assets.background;$('#gableLogo').src=manifest.assets.logo;$('#elf image').setAttribute('href',manifest.assets.elf);$('#snowman image').setAttribute('href',manifest.assets.snowman);$('#rsvpLink').href=manifest.rsvp;$('#mapLink').href=manifest.map;configureIntroMedia();createDigits();applyLanguage();setCalm(calm);await preload();}catch{loadingDone=true;loadingState.complete=true;loadingState.failed=true;renderLoadStatus();$('#loadContinue').hidden=false;}}
syncPortraitGuard();scheduleCountdown();boot();
