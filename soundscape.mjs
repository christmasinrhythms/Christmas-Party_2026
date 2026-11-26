/** Isolated local audio controller. No scene, timer-cue or DOM-control ownership. */
import {ROOM_TRACKS} from './room-music.mjs?v=tripo-rooms-20261126-genre-audio';

export const MUSIC_TRACKS = Object.freeze([
  { id: 'christmas-in-rhythms', title: 'Christmas in Rhythms', file: 'music/christmas-in-rhythms.m4a', genre: 'christmas' },
  { id: 'one-more-song-we-go', title: 'One More Song We Go', file: 'music/one-more-song-we-go.m4a', genre: 'christmas' },
  { id: 'the-christmas-house', title: 'The Christmas House', file: 'music/the-christmas-house.m4a', genre: 'christmas' },
  ...ROOM_TRACKS
].map(Object.freeze));
const PLAYLISTS = new Map();
for (const [index, track] of MUSIC_TRACKS.entries()) {
  if (!PLAYLISTS.has(track.genre)) PLAYLISTS.set(track.genre, []);
  PLAYLISTS.get(track.genre).push(index);
}
const EAGER_SFX = Object.freeze({uiWoodTap:'sfx/ui-wood-tap.wav',doorRing:'sfx/door-ring.wav',magicChime:'sfx/magic-chime.wav',woodFlip:'sfx/wood-flip.wav',elfBell:'sfx/elf-bell.wav',snowPuff:'sfx/snow-puff.wav',introArrival:'sfx/intro-arrival.wav',throwWhoosh:'sfx/throw-whoosh.wav',discoShimmer:'sfx/disco-shimmer.wav',titleBloom:'sfx/title-bloom.wav'});
export const SFX_SOURCES = Object.freeze({
  ...EAGER_SFX,
  ...Object.fromEntries(['rock','disco','kpop','jazz'].flatMap(school =>
    ['en','zh'].map(locale => [`sorting-room-${school}-${locale}`,`sfx/sorting-room-${school}-${locale}.wav`])
  ))
});

const clamp = x => Math.min(1,Math.max(0,Number.isFinite(Number(x))?Number(x):0));
export class Soundscape {
  constructor({musicVolume=.32,sfxVolume=.22,baseUrl=new URL('./assets/audio/',import.meta.url)}={}) {
    this.baseUrl=new URL(baseUrl,import.meta.url);this.music=new Audio();this.music.preload='none';this.music.setAttribute('playsinline','');
    this._index=0;this._status='paused';this._intent=false;this._blocked=false;this._error=null;this._token=0;this._destroyed=false;this._resume=false;this._failed=new Set();this._subscribers=new Set();this._voices=new Set();this._lastSfx=new Map();this._gesture=false;this._sfxContext=null;this._sfxGain=null;this._bufferCache=new Map();this._fetches=new Set();this._sfxEpoch=0;this._lastSfxPlayed=null;this._sfxError=null;this._sfxReady=false;this._sfxBlocked=false;
    this._musicVolume=clamp(musicVolume);this._sfxVolume=clamp(sfxVolume);this._musicMuted=false;this._sfxMuted=false;this._masterMuted=false;
    this._genre='christmas';
    this._queue=PLAYLISTS.get('christmas');
    this._lastRoomTrack=new Map();
    this.music.volume=.5;
    this._nativeMusicVolume=this.music.volume===.5;
    this._musicGain=null;
    this._handlers={
      playing:()=>{if(this._destroyed||!this._intent||document.hidden){this.music.pause();return}this._status='playing';this._blocked=false;this._error=null;this._emit()},
      pause:()=>{if(this._status==='playing')this._status=this._resume?'visibility-paused':'paused';this._emit()},
      ended:()=>{if(this._intent&&!this._destroyed)void this.next()},
      error:()=>{if(this.music.error&&!this._destroyed)void this._fail(this._token)}
    };
    Object.entries(this._handlers).forEach(([name,fn])=>this.music.addEventListener(name,fn));
    this._visibility=()=>{if(document.hidden){this._resume=this._intent;this._stopVoices();this.music.pause();if(this._intent)this._status='visibility-paused';this._emit()}else if(this._resume&&this._intent){this._resume=false;void this._attempt(this._token)}};
    document.addEventListener('visibilitychange',this._visibility);this._select(0);this._volume();
  }
  getState(){return Object.freeze({status:this._status,playing:this._status==='playing'&&!this.music.paused,blocked:this._blocked,index:this._index,track:MUSIC_TRACKS[this._index],tracks:MUSIC_TRACKS,musicVolume:this._musicVolume,sfxVolume:this._sfxVolume,musicMuted:this._musicMuted,sfxMuted:this._sfxMuted,masterMuted:this._masterMuted,gestureUnlocked:this._gesture,error:this._error,visibilityPaused:this._status==='visibility-paused',sfxContextState:this._sfxContext?.state??'not-created',lastSfxPlayed:this._lastSfxPlayed,sfxError:this._sfxError,sfxReady:this._sfxReady,sfxBlocked:this._sfxBlocked});}
  subscribe(fn){if(typeof fn!=='function')throw new TypeError('Listener must be a function');this._subscribers.add(fn);fn(this.getState());return()=>this._subscribers.delete(fn)}
  _emit(){const state=this.getState();for(const fn of this._subscribers){try{fn(state)}catch(error){console.error('Soundscape subscriber error',error)}}}
  _select(index){this._token++;this._index=index;this.music.pause();this.music.src=new URL(MUSIC_TRACKS[index].file,this.baseUrl).href;this.music.preload='none';this._status='paused';this._blocked=false;this._error=null;if(MUSIC_TRACKS[index].genre===this._genre&&this._genre!=='christmas')this._lastRoomTrack.set(this._genre,index);this._emit();}
  _volume(){
    const muted=this._musicMuted||this._masterMuted;
    if(this._nativeMusicVolume)this.music.volume=this._musicVolume;
    this.music.muted=muted||this._musicVolume===0;
    if(this._musicGain)this._musicGain.gain.setTargetAtTime(muted?0:this._musicVolume,this._sfxContext.currentTime,.045);
    if(this._sfxGain)this._sfxGain.gain.setValueAtTime(this._sfxMuted||this._masterMuted?0:this._sfxVolume,this._sfxContext.currentTime);
  }
  async _attempt(token){
    if(this._destroyed||!this._intent||token!==this._token)return false;
    if(document.hidden){this._resume=true;this._status='visibility-paused';this._emit();return false}
    this._status='loading';this._emit();
    try{await this.music.play();if(token!==this._token||!this._intent||this._destroyed)return false;if(this.music.paused)return false;this._status='playing';this._blocked=false;this._error=null;this._emit();return true}
    catch(error){if(token!==this._token||!this._intent||this._destroyed)return false;if(error.name==='NotAllowedError'){this._blocked=true;this._status='blocked';this._error='Playback needs a user gesture';this._emit();return false}if(error.name==='AbortError'){this._status='paused';this._emit();return false}return this._fail(token)}
  }
  async _fail(token){
    if(this._destroyed||token!==this._token)return false;
    this._failed.add(this._index);this._error=`Cannot play ${MUSIC_TRACKS[this._index].title}`;
    if(!this._intent){this._status='error';this._emit();return false}
    let next=null;
    for(let offset=1;offset<=this._queue.length;offset++){
      const index=this._queuedIndex(1,offset);
      if(!this._failed.has(index)){next=index;break;}
    }
    if(next===null){this._intent=false;this._resume=false;this._status='error';this._error='All songs in the current playlist failed; use Play to retry.';this.music.pause();this._emit();return false}
    this._select(next);return this._attempt(this._token);
  }
  async play(){if(this._destroyed)return false;this._failed.clear();this._intent=true;this._error=null;return this._attempt(this._token)}
  pause(){this._intent=false;this._resume=false;this._token++;this.music.pause();this._status='paused';this._blocked=false;this._emit()}
  _queuedIndex(direction,offset=1){
    const position=this._queue.indexOf(this._index);
    const length=this._queue.length;
    const start=position<0&&direction<0?0:position;
    return this._queue[(start+direction*offset+length)%length];
  }
  async setGenre(genre){
    if(this._destroyed||genre===this._genre||!PLAYLISTS.has(genre))return false;
    const queue=[...PLAYLISTS.get(genre)];
    if(genre!=='christmas'){
      for(let index=queue.length-1;index>0;index--){
        const pick=Math.floor(Math.random()*(index+1));
        [queue[index],queue[pick]]=[queue[pick],queue[index]];
      }
      if(queue.length>1&&queue[0]===this._lastRoomTrack.get(genre))queue.push(queue.shift());
    }
    this._genre=genre;
    this._queue=queue;
    this._failed.clear();
    this._select(queue[0]);
    return this._intent?this._attempt(this._token):false;
  }
  async playTrack(id){
    const index=MUSIC_TRACKS.findIndex(track=>track.id===id);
    if(this._destroyed||index<0)return false;
    if(index!==this._index)this._select(index);
    return this.play();
  }
  async _step(n){if(this._destroyed)return false;this._failed.clear();this._select(this._queuedIndex(n));return this._intent?this._attempt(this._token):false}
  next(){return this._step(1)} prev(){return this._step(-1)}
  setMusicVolume(n){this._musicVolume=clamp(n);this._volume();this._emit()}
  setSfxVolume(n){this._sfxVolume=clamp(n);this._volume();this._emit()}
  setMusicMuted(b){this._musicMuted=Boolean(b);this._volume();this._emit()}
  setSfxMuted(b){this._sfxMuted=Boolean(b);this._volume();if(this._sfxMuted)this._stopVoices();this._emit()}
  setMasterMuted(b){this._masterMuted=Boolean(b);this._volume();if(this._masterMuted)this._stopVoices();this._emit()}
  _syncSfxState(){
    if(this._destroyed)return;
    this._sfxReady=this._sfxContext?.state==='running';
    if(this._sfxReady&&!this._nativeMusicVolume&&!this._musicGain){
      const context=this._sfxContext;
      try{
        const gain=context.createGain();
        gain.gain.value=this._musicMuted||this._masterMuted?0:this._musicVolume;
        gain.connect(context.destination);
        context.createMediaElementSource(this.music).connect(gain);
        this._musicGain=gain;
      }catch{}
    }
    this._sfxBlocked=Boolean(this._sfxContext)&&!this._sfxReady;
    if(this._sfxReady){this._sfxError=null;for(const name of Object.keys(EAGER_SFX))void this._getBuffer(name).catch(()=>{});}
    this._emit();
  }
  _ensureSfxContext(){
    if(this._sfxContext)return this._sfxContext;
    const AudioCtx=globalThis.AudioContext||globalThis.webkitAudioContext;
    if(!AudioCtx)throw new Error('Web Audio is unavailable');
    this._sfxContext=new AudioCtx();this._sfxGain=this._sfxContext.createGain();this._sfxGain.connect(this._sfxContext.destination);
    this._sfxContext.onstatechange=()=>this._syncSfxState();this._volume();this._syncSfxState();return this._sfxContext;
  }
  async tryAutoplaySfx(){
    if(this._destroyed)return false;
    try{const context=this._ensureSfxContext();if(context.state==='running'){this._syncSfxState();return true;}
      // Normal browser-policy resume attempt only; never a loading/intro gate.
      const resume=Promise.resolve(context.resume()).then(()=>{this._syncSfxState();return !this._destroyed&&context.state==='running';},error=>{if(!this._destroyed){this._sfxError=error.message||'Autoplay requires interaction';this._sfxBlocked=true;this._emit()}return false});
      let timeout;const result=await Promise.race([resume,new Promise(resolve=>{timeout=setTimeout(()=>resolve(false),120)})]);clearTimeout(timeout);
      if(!result&&!this._destroyed)this._syncSfxState();return result;
    }catch(error){this._sfxReady=false;this._sfxBlocked=true;this._sfxError=error.message||'Autoplay requires interaction';this._emit();return false;}
  }
  async gestureUnlock(){
    if(this._destroyed)return false;const u=navigator.userActivation;if(u&&!u.isActive&&!u.hasBeenActive)return false;
    try{const context=this._ensureSfxContext();if(context.state!=='running')await context.resume();
      if(this._destroyed)return false;this._syncSfxState();this._gesture=this._sfxReady;this._sfxError=this._sfxReady?null:'Audio context is not running';
    }catch(error){this._gesture=false;this._sfxReady=false;this._sfxBlocked=true;this._sfxError=error.message||'Audio unlock failed';}
    this._emit();if(this._blocked&&this._intent)await this._attempt(this._token);return this._sfxReady;
  }
  async _getBuffer(name){
    if(this._bufferCache.has(name))return this._bufferCache.get(name);
    const context=this._sfxContext;if(!context)throw new Error('Audio context not created');
    const controller=new AbortController();this._fetches.add(controller);
    const pending=(async()=>{try{const response=await fetch(new URL(SFX_SOURCES[name],this.baseUrl),{signal:controller.signal});if(!response.ok)throw new Error(`SFX fetch failed: ${response.status}`);return await context.decodeAudioData(await response.arrayBuffer());}finally{this._fetches.delete(controller)}})();
    this._bufferCache.set(name,pending);pending.catch(()=>{if(this._bufferCache.get(name)===pending)this._bufferCache.delete(name)});return pending;
  }
  async playSfx(name,{volume=1}={}){
    const context=this._sfxContext;
    if(this._destroyed||!this._sfxReady||!context||context.state!=='running'||document.hidden||this._sfxMuted||this._masterMuted||!SFX_SOURCES[name])return false;
    const now=performance.now(),minGap=name==='woodFlip'?1000:120;if(now-(this._lastSfx.get(name)??-Infinity)<minGap)return false;this._lastSfx.set(name,now);const epoch=this._sfxEpoch;
    try{const buffer=await this._getBuffer(name);
      if(this._destroyed||epoch!==this._sfxEpoch||context.state!=='running'||document.hidden||this._sfxMuted||this._masterMuted)return false;
      if(this._voices.size>=4)this._voices.values().next().value.cleanup();
      const source=context.createBufferSource(),gain=context.createGain();source.buffer=buffer;gain.gain.value=clamp(volume);source.connect(gain);gain.connect(this._sfxGain);
      const voice={source,gain,cleanup:null};let cleaned=false;
      voice.cleanup=()=>{if(cleaned)return;cleaned=true;source.onended=null;try{source.stop()}catch{}source.disconnect();gain.disconnect();this._voices.delete(voice)};
      source.onended=voice.cleanup;this._voices.add(voice);
      try{source.start()}catch(error){voice.cleanup();throw error}
      this._lastSfxPlayed={name,at:Date.now()};this._sfxError=null;this._emit();return true;
    }catch(error){if(!this._destroyed){this._sfxError=error.message||'SFX playback failed';this._emit()}return false;}
  }
  stopSfx(){this._stopVoices()}
  _stopVoices(){this._sfxEpoch++;for(const v of [...this._voices])v.cleanup()}
  destroy(){if(this._destroyed)return;this._destroyed=true;this._intent=false;this._resume=false;this._token++;this.music.pause();this.music.removeAttribute('src');this.music.load();this._stopVoices();for(const controller of this._fetches)controller.abort();this._fetches.clear();this._bufferCache.clear();if(this._sfxContext){this._sfxContext.onstatechange=null;void this._sfxContext.close().catch(()=>{});}Object.entries(this._handlers).forEach(([name,fn])=>this.music.removeEventListener(name,fn));document.removeEventListener('visibilitychange',this._visibility);this._status='destroyed';this._subscribers.clear()}
}
