import {INTRO_CUT} from './domain.mjs';
import {isPhoneLayout} from './invite-layout.mjs';

export const MOBILE_INTRO_CUES=Object.freeze([
 {time:.5,name:'introArrival',volume:.5},
 {time:6.55,name:'throwWhoosh',volume:.65},
 {time:7.1,name:'discoShimmer',volume:.5},
 {time:8.65,name:'titleBloom',volume:.65}
].map(Object.freeze));

export function isPhoneDevice({width,height,coarse=false,mobileUA=false}){
 return mobileUA||isPhoneLayout(width,height,coarse)||(coarse&&Math.min(width,height)<700);
}

export function portraitBlocked(profile,width,height){return profile.kind==='mobile'&&width>height;}

export function selectIntroMedia({width,height,coarse=false,mobileUA=false,desktopSrc='assets/opening.mp4'}){
 const mobile=isPhoneDevice({width,height,coarse,mobileUA});
 return Object.freeze({kind:mobile?'mobile':'desktop',src:mobile?'assets/opening-mobile-wave.mp4':desktopSrc,cut:INTRO_CUT,cues:mobile?MOBILE_INTRO_CUES:null,fit:'cover'});
}

export function createIntroMediaLock(){
 let selected;
 return options=>selected??=selectIntroMedia(options);
}

export function shouldCutIntro(profile,time){return Number.isFinite(time)&&time>=profile.cut;}

// Each play request owns its callbacks. Pause/load/rotation invalidate earlier promises.
export function createIntroPlayback({film,canPlay,prepare=()=>{},onPlaying,onFallback}){
 let generation=0,pending=false;
 return {
  get pending(){return pending;},
  cancel(){generation++;pending=false;},
  async play(){
   if(!canPlay())return {status:'inactive'};
   const current=++generation;pending=true;
   try{
    prepare();await film.play();
    if(current!==generation)return {status:'stale'};
    if(!canPlay()){pending=false;return {status:'stale'};}
    pending=false;onPlaying();return {status:'playing'};
   }catch(error){
    if(current!==generation)return {status:'stale'};
    if(!canPlay()){pending=false;return {status:'stale'};}
    pending=false;
    if(error?.name==='AbortError')return {status:'interrupted'};
    onFallback(error);return {status:'blocked',name:error?.name};
   }
  }
 };
}
