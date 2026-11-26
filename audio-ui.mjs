import {Soundscape} from './soundscape.mjs?v=tripo-rooms-20261126';

const PLAYLIST_LABELS={
 christmas:['Christmas','聖誕'],
 rock:['Rock & Punk','搖滾龐克'],
 disco:['Disco','的士高'],
 jazz:['Jazz & Classical','爵士古典樂'],
 kpop:['K-pop & Hip-Hop','K-pop 與嘻哈']
};

// Cue times are film positions, never elapsed page timers.
export const INTRO_CUES=Object.freeze([
 {time:.3,name:'introArrival',volume:.5},
 {time:6.45,name:'throwWhoosh',volume:.65},
 {time:7.2,name:'discoShimmer',volume:.5},
 {time:8.65,name:'titleBloom',volume:.65}
]);

export function createSoundControls({t}){
 const $=s=>document.querySelector(s),sound=new Soundscape({musicVolume:.25,sfxVolume:.5});
 const playlist=$('#musicPlaylist');
 const groups=new Map(Object.keys(PLAYLIST_LABELS).map(genre=>[genre,document.createElement('optgroup')]));
 for(const track of sound.getState().tracks)groups.get(track.genre).append(new Option(track.title,track.id));
 playlist.append(...groups.values());
 sound.music.hidden=true;sound.music.id='playlistAudio';sound.music.setAttribute('aria-hidden','true');$('#soundPlayer').append(sound.music);
 let level=.25,phase='loading',started=false,state=sound.getState(),lastFilmTime=0,resumeAfterPage=false,introCues=INTRO_CUES,orientationBlocked=false,resumeAfterRotate=false,tvAudible=false;
 const fired=new Set();
 function render(){
  const playing=state.playing,enableSound=playing&&needsSound(),playKey=playing?'music_pause':'music_play';
  $('#soundPlayer').dataset.playing=String(playing);
  $('#soundPlayer').dataset.masterMuted=String(state.masterMuted);
  $('#soundPlayer').dataset.musicVolume=String(state.musicVolume);
  $('#soundPlayer').dataset.sfxContext=state.sfxContextState||'not-created';
  $('#soundPlayer').dataset.lastSfx=state.lastSfxPlayed?.name||'';
  $('#soundPlayer').dataset.lastSfxAt=String(state.lastSfxPlayed?.at||'');
  $('#soundPlayer').setAttribute('aria-label',t('music_region'));
  $('#soundPanel').setAttribute('aria-label',t('music_controls'));
  $('#soundTrack').textContent=state.track.title;$('#soundFullTitle').textContent=state.track.title;
  const locale=+(document.documentElement.lang==='zh-Hant');
  $('#musicPlaylistLabel').textContent=['Choose a song','選擇歌曲'][locale];
  for(const [genre,group] of groups)group.label=PLAYLIST_LABELS[genre][locale];
  playlist.value=state.track.id;
  for(const id of ['#musicPlay','#musicPlayFull']){$(id).title=t(playKey);$(id).setAttribute('aria-label',t(playKey));}
  if(enableSound){$('#musicPlay').title=t('sound_enable');$('#musicPlay').setAttribute('aria-label',t('sound_enable'));}
  $('#musicIcon').textContent=enableSound?'♪':playing?'Ⅱ':'▶';$('#musicFullIcon').textContent=playing?'Ⅱ':'▶';
  const status=state.masterMuted?'sound_all_muted':state.error&&!state.blocked?'music_error':state.blocked?'music_blocked':state.visibilityPaused?'music_background':enableSound?'sound_enable':playing?(state.musicMuted?'music_muted':'music_playing'):state.status==='loading'?'music_loading':'music_paused';
  $('#soundStatus').textContent=t(status);
  $('#musicMute').textContent=t(state.musicMuted?'music_unmute':'music_mute');$('#musicMute').setAttribute('aria-pressed',String(state.musicMuted));
  $('#soundEffects').textContent=t(state.sfxMuted?'sfx_disabled':state.sfxError?'sfx_unavailable':'sfx_enabled');$('#soundEffects').setAttribute('aria-pressed',String(!state.sfxMuted));
  $('#masterMute').textContent=t(state.masterMuted?'sound_unmute_all':'sound_mute_all');$('#masterMute').setAttribute('aria-pressed',String(state.masterMuted));
  $('#musicVolume').setAttribute('aria-label',t('music_volume'));
  $('#sfxVolume').setAttribute('aria-label',t('sfx_volume'));
  const expanded=!$('#soundPanel').hidden;
  $('#musicExpand').setAttribute('aria-label',t(expanded?'music_collapse':'music_expand'));$('#musicExpand').title=t(expanded?'music_collapse':'music_expand');
 }
 sound.subscribe(next=>{state=next;render();});
 function needsSound(){return phase!=='loading'&&!state.sfxMuted&&!state.masterMuted&&state.sfxContextState!=='running';}
 const unlock=()=>{if(!orientationBlocked)void sound.gestureUnlock();};
 document.addEventListener('pointerdown',event=>{if(!event.target.closest('#soundPlayer'))unlock();},{capture:true});
 document.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&!event.target.closest('#soundPlayer'))unlock();},{capture:true});
 const toggle=event=>{if(event.currentTarget.id==='musicPlay'&&state.playing&&needsSound()){unlock();return;}const pause=state.playing||state.status==='loading';unlock();if(pause)sound.pause();else void sound.play();};
 $('#musicPlay').addEventListener('click',toggle);$('#musicPlayFull').addEventListener('click',toggle);
 $('#musicPrevious').addEventListener('click',()=>{unlock();void sound.prev();});$('#musicNext').addEventListener('click',()=>{unlock();void sound.next();});
 playlist.addEventListener('change',()=>{const choice=playlist.value;void sound.playTrack(choice);unlock();});
 $('#musicMute').addEventListener('click',()=>sound.setMusicMuted(!state.musicMuted));$('#soundEffects').addEventListener('click',()=>sound.setSfxMuted(!state.sfxMuted));
 $('#masterMute').addEventListener('click',()=>sound.setMasterMuted(!state.masterMuted));
 $('#musicVolume').addEventListener('input',event=>{level=Number(event.target.value)/100;applyVolume();unlock();});
 $('#sfxVolume').addEventListener('input',event=>{sound.setSfxVolume(Number(event.target.value)/100);unlock();});
 $('#musicExpand').addEventListener('click',()=>{const open=$('#soundPanel').hidden;$('#soundPanel').hidden=!open;$('#musicExpand').setAttribute('aria-expanded',String(open));$('#musicExpandIcon').textContent=open?'⌄':'⌃';render();});
 $('#soundPlayer').addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('#soundPanel').hidden){$('#soundPanel').hidden=true;$('#musicExpand').setAttribute('aria-expanded','false');$('#musicExpandIcon').textContent='⌃';$('#musicExpand').focus();render();}});
 document.addEventListener('click',event=>{if(orientationBlocked)return;unlock();const button=event.target.closest('button,a');if(!button||button.disabled||document.hidden||['elfHello','snowmanHello'].includes(button.id))return;void sound.playSfx(button.id==='doorLock'?'doorRing':'uiWoodTap',{volume:button.id==='doorLock'?1:.9});});
 function applyVolume(){sound.setMusicVolume(level*((phase==='intro'||tvAudible) ? .25 : 1));}
 function stopEffects(){
  sound.stopSfx?.();
 }
 return {
  applyLanguage:render,
  setScene(scene){void sound.setGenre(groups.has(scene)?scene:'christmas');},
  setTvAudible(audible){if(tvAudible===audible)return;tvAudible=audible;applyVolume();},
  setOrientationBlocked(blocked){if(blocked===orientationBlocked)return;orientationBlocked=blocked;if(blocked){resumeAfterRotate=state.playing||state.status==='loading'||state.blocked;stopEffects();sound.pause();}else if(!document.hidden){if(resumeAfterRotate){resumeAfterRotate=false;void sound.play();}else if(!started&&phase!=='loading'){started=true;void sound.tryAutoplaySfx?.();void sound.play();}}},
  setIntroCues(cues){if(phase==='intro')return false;introCues=cues??INTRO_CUES;return true;},
  setPhase(next){phase=next;applyVolume();if(next==='intro'){lastFilmTime=0;fired.clear();}else stopEffects();if(!started&&next!=='loading'&&!orientationBlocked){started=true;void sound.tryAutoplaySfx?.();void sound.play();}},
  filmTime(time){if(phase!=='intro'||document.hidden||orientationBlocked)return;for(const cue of introCues){if(!fired.has(cue.name)&&lastFilmTime<=cue.time&&time>=cue.time){fired.add(cue.name);if(time-cue.time<.45)void sound.playSfx(cue.name,{volume:cue.volume});}}lastFilmTime=time;},
  effect(name,volume=1){if(orientationBlocked)return false;return sound.playSfx(name,{volume});},
  stopEffects,
  pauseForPageHide(){resumeAfterPage=state.playing||state.status==='loading'||state.blocked;stopEffects();sound.pause();},
  resumeForPageShow(){if(resumeAfterPage&&!orientationBlocked){resumeAfterPage=false;void sound.play();}},
  getState:()=>sound.getState()
 };
}
