import {challengeSlides, challengeTitle, reelDirectory, sharedReels} from './room-reels.mjs?v=tv-copy-layout-20261126';

const length = challengeSlides.length + sharedReels.length;
const escapeHtml = text => text.replace(/[&<>"']/g, char => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'})[char]);
const labels = {
  rules:['Rules','規則'], clips:['Clips','短片'], original:['Original ↗','原片 ↗'],
  previous:['Previous slide','上一頁'], next:['Next slide','下一頁'],
  mute:['Mute TV sound','將電視靜音'], unmute:['Turn on TV sound','開啟電視聲音'],
  silent:['Sound off','靜音'], audible:['Sound on','有聲'],
  play:['Play','播放'], pause:['Pause','暫停'], full:['Fullscreen','全螢幕'], exit:['Back to TV','返回電視'],
  seek:['Video position','短片進度'], retry:['Tap Play to retry.','請按播放再試。'],
  watch:['Video example','短片示例'], loading:['Loading video…','正在載入短片…'],
  slow:['If playback stalls, use the player’s Play button or open Original.','如短片未開始，請按播放器內嘅播放鍵，或開啟原片。'],
  instagram:['Use Instagram’s Play and sound controls, or open Original.','請使用 Instagram 嘅播放同聲音控制，或開啟原片。']
};

export function createRoomTv(root, chinese, onVideoAudio, onFullscreenChange) {
  const decks = new Map();
  let mounted = null;
  let youtubeApi;
  const t = key => labels[key][+chinese()];
  const local = pair => pair[+chinese()];
  const state = room => {
    if (!decks.has(room)) decks.set(room,{index:0, left:challengeSlides[0].duration, muted:true, paused:false, files:{}});
    return decks.get(room);
  };
  const clipFor = deck => sharedReels[deck.index-challengeSlides.length];
  const pathFor = (deck,clip) => deck.files[clip.id] === reelDirectory+clip.file ? reelDirectory+clip.file : '';
  const key = (action,caption,label=caption,extra='') =>
    `<button type="button" class="tv-key" data-house="${action}" aria-label="${label}" title="${label}" ${extra}>${caption}</button>`;

  function media(clip,path,muted) {
    const title = escapeHtml(clip.title);
    if (path) return `<video playsinline preload="metadata" ${muted?'muted':''} src="${path}" aria-label="${title}"></video>`;
    if (clip.provider==='youtube') {
      const query=new URLSearchParams({autoplay:'0', mute:muted?'1':'0', playsinline:'1', rel:'0', enablejsapi:'1', origin:location.origin});
      return `<iframe data-youtube src="https://www.youtube-nocookie.com/embed/${clip.id}?${query}" title="${title}" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
    }
    return `<iframe src="https://www.instagram.com/reel/${clip.id}/embed/" title="${title}" allow="autoplay; fullscreen; encrypted-media; picture-in-picture" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  }

  function render(room, live) {
    const deck=state(room);
    const slide=challengeSlides[deck.index]||challengeSlides[0];
    const clip=clipFor(deck);
    const path=clip?pathFor(deck,clip):'';
    const instagram=Boolean(clip&&clip.provider==='instagram'&&!path);
    const screen=live&&clip
      ? `<div class="room-video-stage">${media(clip,path,deck.muted)}${path?`<input class="tv-seek" type="range" min="0" max="1000" value="0" aria-label="${t("seek")}" disabled>`:''}<button class="house-action room-video-exit" type="button" data-house="tv-exit">${t('exit')}</button></div>`
      : `<div class="tv-briefing" aria-live="polite">
          <header class="tv-briefing-heading">
            <p class="tv-briefing-kicker">${local(challengeTitle)}</p>
            <h3 class="tv-briefing-title">${local(slide.title)}</h3>
          </header>
          ${slide.categories?`<ol class="tv-categories">${slide.categories.map((c,i)=>`<li><b aria-hidden="true">${i+1}</b><span>${local(c)}</span></li>`).join('')}</ol>`:''}
          ${slide.body?`<p class="tv-briefing-copy">${local(slide.body)}</p>`:''}
          ${slide.note?`<p class="tv-briefing-copy tv-filming-note">${local(slide.note)}</p>`:''}
        </div>`;
    return `<div class="room-tv-player${clip&&!path?' has-youtube':''}" ${live?'data-tv-live':''}>
      <div class="room-tv-cabinet">
        <div class="atrium-tv-art"><div class="house-tv-screen">${screen}</div></div>
        <div class="room-tv-panel">
          <span class="tv-power" aria-hidden="true"></span><i class="tv-speaker" aria-hidden="true"></i>
          <div class="tv-hardware">
            <div class="tv-transport">
              <div class="tv-pagination">
                ${key('tv-prev','‹',t('previous'))}
                <span class="tv-slide-count" aria-live="polite">${deck.index+1} / ${length}</span>
                ${key('tv-next','›',t('next'))}
              </div>
            </div>
            <div class="tv-options">
              ${instagram?'':key('tv-pause',t(deck.paused?'play':'pause'))}
              ${instagram?'':key('tv-sound',t(deck.muted?'silent':'audible'),t(deck.muted?'unmute':'mute'),`aria-pressed="${!deck.muted}"`)}
              ${live&&clip?key('tv-fullscreen','⛶',t('full')):''}
              ${key('tv-rules',t('rules'))}
              ${live&&clip&&!path?`<a class="tv-key" href="${clip.url}" target="_blank" rel="noopener noreferrer">${t('original')}</a>`:''}
            </div>
          </div>
        </div>
      </div>
      ${live&&clip?`<p class="tv-clip-caption" lang="en">${escapeHtml(clip.title)}</p>`:''}
      <p class="room-video-status" role="status">${live&&instagram?t('instagram'):''}</p>
    </div>`;
  }

  function loadYoutube() {
    if(window.YT?.Player)return Promise.resolve(window.YT);
    if(youtubeApi)return youtubeApi;
    youtubeApi=new Promise((resolve,reject)=>{
      window.onYouTubeIframeAPIReady=()=>resolve(window.YT);
      const script=document.createElement('script');
      script.src='https://www.youtube.com/iframe_api';
      script.addEventListener('error',()=>{youtubeApi=null;script.remove();reject(new Error('YouTube unavailable'));},{once:true});
      document.head.append(script);
    });
    return youtubeApi;
  }

  function disconnect() {
    const current=mounted;
    mounted=null;
    current?.destroy();
    onVideoAudio(false);
  }

  function switchTo(room,index) {
    const container=root.querySelector('[data-room-tv]');
    const live=mounted?.room===room;
    const focus=live&&container.contains(document.activeElement)?document.activeElement.dataset.house:null;
    if(live)disconnect();
    const deck=state(room);
    deck.index=(index+length)%length;
    deck.left=challengeSlides[deck.index]?.duration||0;
    if(!live)return;
    container.innerHTML=render(room,true);
    connect(room);
    if(focus)container.querySelector(`[data-house="${focus}"]`)?.focus({preventScroll:true});
  }

  function connect(room) {
    const cabinet=root.querySelector('[data-tv-live]');
    if(!cabinet)return;
    const deck=state(room);
    const clip=clipFor(deck);
    const stage=cabinet.querySelector('.room-video-stage');
    const screen=cabinet.querySelector('.house-tv-screen');
    const video=stage?.querySelector('video');
    const frame=stage?.querySelector('[data-youtube]');
    const seek=stage?.querySelector('.tv-seek');
    const status=cabinet.querySelector('.room-video-status');
    let yt, timer, clockStart, loading, visible=false, playing, pendingAdvance=false, ytReady=false, ytPlaying=false;
    const current={room, sync, toggleSound, updatePlay, fullscreen, exitFullscreen, destroy};
    mounted=current;
    const isFullscreen=()=>Boolean(stage&&(root.hasAttribute('data-tv-expanded')||document.fullscreenElement===stage||video?.webkitDisplayingFullscreen));
    function setFullscreenState(full){
      if(root.hasAttribute('data-tv-fullscreen')===full)return;
      root.toggleAttribute('data-tv-fullscreen',full);
      onFullscreenChange?.();
    }

    function syncBackgroundMusic() {
      if(mounted!==current)return;
      const audible=video ? !video.paused&&!video.ended&&!video.error&&video.volume>0 : ytPlaying;
      onVideoAudio(Boolean(playing&&!deck.muted&&audible));
    }

    function stopClock() {
      clearTimeout(timer);
      if (clockStart!==undefined) deck.left=Math.max(0,deck.left-(performance.now()-clockStart));
      clockStart=undefined;
    }
    function advance() {
      if(mounted!==current)return;
      if(isFullscreen()){pendingAdvance=true;return;}
      switchTo(room, deck.index===length-1 ? challengeSlides.length : deck.index+1);
    }
    function sync() {
      if(mounted!==current)return;
      const shouldPlay=(visible||isFullscreen())&&!document.hidden&&!deck.paused;
      if(playing===shouldPlay)return;
      playing=shouldPlay;
      syncBackgroundMusic();
      if(!clip)return; // briefing slides stay on screen until the viewer presses ›
      if(video){
        if(!shouldPlay){video.pause();return;}
        video.muted=deck.muted;
        void video.play().catch(async()=>{
          if(mounted!==current||!playing)return;
          if(!video.muted){
            video.muted=true;
            try{await video.play();return;}catch{}
          }
          if(mounted===current){
            deck.paused=true;
            playing=false;
            updatePlay();
            status.textContent=t('retry');
          }
        });
        return;
      }
      if(frame){
        if(!shouldPlay){if(ytReady)yt.pauseVideo();return;}
        status.textContent=t('loading');
        clearTimeout(loading);
        loading=setTimeout(()=>{if(mounted===current)status.textContent=t('slow');},9000);
        if(ytReady){
          if(deck.muted)yt.mute();else yt.unMute();
          yt.playVideo();
        }
      }
    }

    function updateSeek() {
      if(!seek)return;
      const duration=video.duration;
      seek.disabled=!Number.isFinite(duration)||duration<=0;
      if(!seek.disabled)seek.value=String(Math.round(1000 * video.currentTime / duration));
    }
    function updatePlay() {
      const button=cabinet.querySelector('[data-house="tv-pause"]');
      if(!button)return;
      const label=t(deck.paused?'play':'pause');
      button.textContent=label;
      button.setAttribute('aria-label',label);
      button.title=label;
    }

    function updateSound() {
      const button=cabinet.querySelector('[data-house="tv-sound"]');
      if(!button)return;
      button.setAttribute('aria-pressed',String(!deck.muted));
      button.setAttribute('aria-label',t(deck.muted?'unmute':'mute'));
      button.title=t(deck.muted?'unmute':'mute');
      button.textContent=t(deck.muted?'silent':'audible');
    }

    function toggleSound() {
      deck.muted=!deck.muted;
      if(video)video.muted=deck.muted;
      if(ytReady){if(deck.muted)yt.mute();else yt.unMute();}
      updateSound();
      syncBackgroundMusic();
    }
    function volumeChange(){deck.muted=video.muted;updateSound();syncBackgroundMusic();}
    function onPlaying(){status.textContent='';syncBackgroundMusic();}
    function fullscreenChange(){
      if(!stage)return;
      const full=isFullscreen();
      if(video)video.controls=full;
      setFullscreenState(full);
      if(!full&&pendingAdvance){advance();return;}
      sync();
      if(!full&&!root.inert&&document.activeElement?.matches('.room-video-exit')){
        cabinet.querySelector('[data-house="tv-fullscreen"]')?.focus({preventScroll:true});
      }
    }
    async function fullscreen() {
      if(!stage)return;
      if(document.fullscreenEnabled&&stage.requestFullscreen){
        try{
          await stage.requestFullscreen();
        }catch{
          // Some embedded browsers deny the native fullscreen request.
        }
      }
      if(mounted!==current)return;
      if(document.fullscreenElement!==stage){
        root.setAttribute('data-tv-expanded','');
        stage.setAttribute('role','dialog');
        stage.setAttribute('aria-modal','true');
        stage.setAttribute('aria-label',t('watch'));
      }
      fullscreenChange();
      stage.querySelector('[data-house="tv-exit"]').focus({preventScroll:true});
    }
    function exitFullscreen(){
      if(root.hasAttribute('data-tv-expanded')){
        root.removeAttribute('data-tv-expanded');
        stage.removeAttribute('role');
        stage.removeAttribute('aria-modal');
        stage.removeAttribute('aria-label');
        fullscreenChange();
      }else if(document.fullscreenElement===stage){
        void document.exitFullscreen().catch(()=>{});
      }
    }
    function destroy() {
      observer.disconnect();
      document.removeEventListener('visibilitychange',sync);
      document.removeEventListener('fullscreenchange',fullscreenChange);
      stopClock();
      clearTimeout(loading);
      video?.removeEventListener('durationchange',updateSeek);
      video?.removeEventListener('timeupdate',updateSeek);
      video?.removeEventListener('volumechange',volumeChange);
      video?.removeEventListener('playing',onPlaying);
      for(const event of ['pause','ended','error'])video?.removeEventListener(event,syncBackgroundMusic);
      for(const event of ['webkitbeginfullscreen','webkitendfullscreen'])video?.removeEventListener(event,fullscreenChange);
      root.removeAttribute('data-tv-expanded');
      setFullscreenState(false);
      video?.pause();
      yt?.destroy?.();
    }

    video?.addEventListener('durationchange',updateSeek);
    video?.addEventListener('timeupdate',updateSeek);
    seek?.addEventListener('input',()=>{
      if(!seek.disabled)video.currentTime=Number(seek.value) * video.duration / 1000;
    });
    updateSeek();
    video?.addEventListener('ended',advance,{once:true});
    video?.addEventListener('volumechange',volumeChange);
    video?.addEventListener('playing',onPlaying);
    for(const event of ['pause','ended','error'])video?.addEventListener(event,syncBackgroundMusic);
    for(const event of ['webkitbeginfullscreen','webkitendfullscreen'])video?.addEventListener(event,fullscreenChange);
    document.addEventListener('visibilitychange',sync);
    document.addEventListener('fullscreenchange',fullscreenChange);
    const observer=new IntersectionObserver(([entry])=>{
      visible=entry.intersectionRatio>=.50;
      sync();
    },{threshold:[0,.50]});
    observer.observe(screen);
    if(frame){
      void loadYoutube().then(api=>{
        if(mounted!==current)return;
        yt=new api.Player(frame,{events:{
          onReady:()=>{
            if(mounted!==current)return;
            ytReady=true;
            playing=undefined;
            sync();
          },
          onStateChange:({data})=>{
            if(mounted!==current)return;
            ytPlaying=data===1;
            syncBackgroundMusic();
            if(data===1){clearTimeout(loading);status.textContent='';if(!playing&&ytReady)yt.pauseVideo();}
            if(data===0&&playing)advance();
          },
          onError:()=>{clearTimeout(loading);ytPlaying=false;syncBackgroundMusic();if(mounted===current)status.textContent=t('slow');},
          onAutoplayBlocked:()=>{clearTimeout(loading);ytPlaying=false;syncBackgroundMusic();if(mounted===current)status.textContent=t('slow');}
        }});
      }).catch(()=>{clearTimeout(loading);if(mounted===current)status.textContent=t('slow');});
    }
  }

  function handle(action) {
    if(!mounted)return false;
    const current=mounted, deck=state(current.room);
    if(action==='tv-prev'||action==='tv-next'){
      switchTo(current.room,deck.index+(action==='tv-next'?1:-1));
    }else if(action==='tv-sound'){
      current.toggleSound();
    }else if(action==='tv-pause'){
      deck.paused=!deck.paused;
      current.updatePlay();
      current.sync();
    }else if(action==='tv-fullscreen'){
      void current.fullscreen();
    }else if(action==='tv-exit'){
      current.exitFullscreen();
    }else return false;
    return true;
  }

  return {
    render, connect, disconnect, handle,
    reset(room) {
      const deck=state(room);
      deck.index=0;
      deck.left=challengeSlides[0].duration;
      deck.paused=false;
    },
    selectClip(room,index) {
      if(!sharedReels[index])return;
      state(room).paused=false;
      switchTo(room,challengeSlides.length+index);
    },
    setFiles(room,files) {
      const deck=state(room), clip=clipFor(deck);
      const prior=clip&&pathFor(deck,clip);
      deck.files=files;
      if(mounted?.room===room&&clip&&prior!==pathFor(deck,clip))switchTo(room,deck.index);
    }
  };
}
