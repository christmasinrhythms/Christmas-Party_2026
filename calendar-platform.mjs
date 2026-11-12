import {calendarLinks} from './domain.mjs';

export function calendarPlatformLinks(event,locale,canonical,{phone=false,userAgent=''}={}){
 const original=calendarLinks(event,locale,canonical);
 if(!phone)return {...original,googleWeb:original.google,phone:false,target:'_blank'};
 const web=new URL(original.google);web.pathname='/calendar/r/eventedit';
 web.searchParams.set('ctz','Asia/Hong_Kong');web.searchParams.set('stz','Asia/Hong_Kong');web.searchParams.set('etz','Asia/Hong_Kong');
 const android=/Android/i.test(userAgent);
 const webView=/\bwv\b|FBAN|FBAV|Instagram|Line\/|MicroMessenger|GSA\//i.test(userAgent);
 const google=android&&!webView?'intent://calendar.google.com/calendar/render?'+web.searchParams.toString()+'#Intent;scheme=https;package=com.google.android.calendar;S.browser_fallback_url='+encodeURIComponent(web.href)+';end':web.href;
 return {...original,google,googleWeb:web.href,phone:true,target:'_self',file:'assets/calendar/christmas-in-rhythms-'+(locale==='en'?'en':'zh')+'.ics'};
}

export function isMobileCalendar(userAgent='',maxTouchPoints=0,phoneLayout=false){
 return phoneLayout||/Android|iPhone|iPad|iPod/i.test(userAgent)||(/Macintosh/i.test(userAgent)&&maxTouchPoints>1);
}
