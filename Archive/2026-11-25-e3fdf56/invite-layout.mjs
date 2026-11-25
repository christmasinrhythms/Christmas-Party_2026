import {W,H,cameraFrame,focusCamera} from './domain.mjs';

// Measurements of the existing PNG and its nine-slice border, in source/world pixels.
export const INVITE_ART=Object.freeze({
 width:375,minHeight:170,left:285,bottom:672.5,
 sourceWidth:1774,sourceHeight:887,sliceY:230,borderY:48.619,
 scaleX:1.04,scaleY:1.18,tailX:28.5,tailInset:12.5625,
 bodyTop:150,bodyBottom:650,faceWidth:.72,buttonWidth:.738
});

export function isPhoneLayout(width,height,coarse=false){
 return width<700||(coarse&&width<=900&&height>width);
}

function sliceY(y,height){
 const a=INVITE_ART;
 if(y<=a.sliceY)return y*a.borderY/a.sliceY;
 if(y>=a.sourceHeight-a.sliceY)return height-(a.sourceHeight-y)*a.borderY/a.sliceY;
 return a.borderY+(y-a.sliceY)*(height-2*a.borderY)/(a.sourceHeight-2*a.sliceY);
}
function artY(y,height){const a=INVITE_ART;return a.scaleY*sliceY(y,height)-(a.scaleY-1)*(height-a.tailInset);}

export function phoneInviteWidth(width,height,safeWidth=width-24){
 const cover=Math.max(width/W,height/H);
 return Math.min(INVITE_ART.width,Math.min(safeWidth,420)/(cover*INVITE_ART.scaleX));
}

export function inviteGeometry(scale,{phone=false,coarse=false,width=INVITE_ART.width}={}){
 const a=INVITE_ART;
 if(!phone){
  const row=coarse?Math.max(38.4,40/scale):38.4,height=Math.max(a.minHeight,24+2*row+2+56);
  return geometry(width,height,{row,caption:24,gap:1,button:32.4,phone:false});
 }
 const row=Math.max(32.4,44/scale),caption=Math.max(24,24/scale),gap=6/scale,padding=16/scale;
 const group=caption+2*row+2*gap;
 // Solve the usable round-belly height, rather than the full bitmap including its tail.
 const usable=h=>artY(a.bodyBottom,h)-artY(a.bodyTop,h);
 const slope=usable(201)-usable(200),height=Math.max(a.minHeight,200+(group+2*padding-usable(200))/slope);
 const center=(artY(a.bodyTop,height)+artY(a.bodyBottom,height))/2;
 return geometry(width,height,{row,caption,gap,button:row,faceTop:center-group/2,faceHeight:group,padding,phone:true});
}

function geometry(width,height,content){
 const a=INVITE_ART,top=a.bottom-height;
 return {width,height,left:a.left,top,...content,
  faceWidth:width*a.faceWidth,
  visual:{left:a.left-(a.scaleX-1)*a.tailX,top:top-(a.scaleY-1)*(height-a.tailInset),width:width*a.scaleX,height:height*a.scaleY},
  safeBody:{top:top+artY(a.bodyTop,height),bottom:top+artY(a.bodyBottom,height)},
  tail:{x:a.left+a.tailX,y:a.bottom-a.tailInset}
 };
}

export function fitPhoneInvite(width,height,{coarse=false,safe={left:12,right:width-12,top:80,bottom:height-110}}={}){
 const a=INVITE_ART,hostWidth=phoneInviteWidth(width,height,safe.right-safe.left);
 const base=cameraFrame(width,height,{zoom:1}).scale,cover=Math.max(width/W,height/H);
 let low=cover,high=Math.max(low,Math.min(base*1.8,Math.min(safe.right-safe.left,420)/(hostWidth*a.scaleX)));
 const availableHeight=safe.bottom-safe.top;
 for(let i=0;i<40;i++){
  const scale=(low+high)/2,g=inviteGeometry(scale,{phone:true,coarse,width:hostWidth});
  if(g.visual.height*scale>availableHeight)high=scale;else low=scale;
 }
 const scale=low,g=inviteGeometry(scale,{phone:true,coarse,width:hostWidth});
 const center=[g.visual.left+g.visual.width/2,g.visual.top+g.visual.height/2];
 const camera=focusCamera(width,height,center,scale/base);
 camera.panX+=(safe.left+safe.right-width)/2;
 camera.panY+=(safe.top+safe.bottom-height)/2;
 return {camera,geometry:g,safe};
}

function railPosition(x,width,height,protectedRects,top,bottom){
 const railWidth=44,railHeight=56,gap=8;
 if(bottom-top<railHeight)return null;
 let intervals=[[top,bottom-railHeight]];
 for(const r of protectedRects){
  if(r.right<=x-gap||r.left>=x+railWidth+gap||r.bottom<=top||r.top>=bottom)continue;
  const blocked=[r.top-railHeight-gap,r.bottom+gap];
  intervals=intervals.flatMap(([a,b])=>blocked[1]<=a||blocked[0]>=b?[[a,b]]:[[a,Math.min(b,blocked[0])],[Math.max(a,blocked[1]),b]].filter(([lo,hi])=>hi>=lo));
 }
 if(!intervals.length)return null;
 const desired=height*.45;
 const y=intervals.map(([a,b])=>Math.max(a,Math.min(b,desired))).sort((a,b)=>Math.abs(a-desired)-Math.abs(b-desired))[0];
 return {x,y,width:railWidth,height:railHeight};
}

export function sideExploreState(width,height,{leftRects,rightRects,protectedRects,top=80,bottom=height-90,leftX=4,rightX=width-48}){
 const leftNeeded=leftRects.some(r=>r.left<12),rightNeeded=rightRects.some(r=>r.right>width-12);
 return {
  left:leftNeeded?railPosition(leftX,width,height,protectedRects,top,bottom):null,
  right:rightNeeded?railPosition(rightX,width,height,protectedRects,top,bottom):null
 };
}
