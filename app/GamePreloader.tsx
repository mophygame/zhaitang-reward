"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { photos } from "../data/phone-data";

const visualAssets=[
  "/ui/bg_login_desktop.png","/ui/bg_login_mobile.png","/ui/bg_office.webp","/ui/bg_office_mobile.png",
  "/ui/bg_office_light.webp","/ui/bg_office_light_mobile.png","/ui/bg_office_phone_hover.webp","/ui/bg_office_phone_hover_mobile.webp",
  "/ui/bg_office_light_hover.webp","/ui/bg_office_light_hover_mobile.webp","/ui/bg_office_screen_hover.webp","/ui/bg_office_screen_hover_mobile.webp",
  "/ui/wallpaper_clock.png","/ui/wallpaper_desktop.webp","/ui/wallpaper_desktop_mobile.png","/ui/wallpaper_mobile.png",
  "/ui/img_birthday.png","/ui/stamp_午未.png","/ui/icon_clock.svg","/ui/icon_chat.svg","/ui/icon_photo.svg",
  "/game/bg.png","/game/animal.png",
  ...["裘芨","渚瀾","鶕綾","賀止損","花楀","松聽簷","婪煙","褚日央","冥濠","玳敕青","嵐"].map(name=>`/avatar/資料卡_${name}.webp`),
  ...["草莓甜點完整圖鑑","2026 台中十大必吃甜點名店","帶心儀的她吃甜點","帥氣饕餮的秋季穿著","獅子的求偶與繁殖行為觀察紀錄","女性身體的敏感帶與舒適溝通","辦公室有BL員工","老闆不想工作","二十種讓伴侶更親密的約會姿勢與互動","新開幕草莓專門店"].map(name=>`/news/${name}.png`),
  ...photos.map(photo=>photo.src),
];

const audioAssets=["/MoonlitSilk.mp3","/audio/01.mp3","/audio/02.mp3","/audio/03.mp3"];

export function GamePreloader({children}:{children:ReactNode}){
  const assets=useMemo(()=>Array.from(new Set([...visualAssets,...audioAssets])),[]);
  const[loaded,setLoaded]=useState(0);
  const[ready,setReady]=useState(false);

  useEffect(()=>{
    let active=true;
    const started=Date.now();
    const completeOne=()=>active&&setLoaded(value=>Math.min(assets.length,value+1));
    const jobs=assets.map(src=>new Promise<void>(resolve=>{
      let settled=false;
      const finish=()=>{if(settled)return;settled=true;completeOne();resolve()};
      if(src.endsWith(".mp3")){
        const audio=new Audio();
        audio.preload="auto";
        audio.addEventListener("canplaythrough",finish,{once:true});
        audio.addEventListener("error",finish,{once:true});
        audio.src=src;audio.load();
        window.setTimeout(finish,15000);
      }else{
        const image=new Image();
        image.onload=image.onerror=finish;
        image.src=src;
        if(image.complete)finish();
      }
    }));
    void Promise.allSettled(jobs).then(()=>{
      const wait=Math.max(0,650-(Date.now()-started));
      window.setTimeout(()=>{if(active)setReady(true)},wait);
    });
    return()=>{active=false};
  },[assets]);

  if(ready)return children;
  const progress=Math.round(loaded/assets.length*100);
  return <main className="site-loading" role="status" aria-live="polite" aria-label={`遊戲素材載入中 ${progress}%`}>
    <div className="loading-glow" aria-hidden="true"/>
    <div className="loading-strawberry" aria-hidden="true">🍓</div>
    <h1>齋堂房屋不動產</h1>
    <p>正在準備午未的辦公室……</p>
    <div className="loading-track"><i style={{width:`${progress}%`}}/></div>
    <b>{progress}%</b>
    <small>LOADING</small>
  </main>;
}
