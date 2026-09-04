"use client";

import { useEffect, useState } from "react";

export function ClockApp({onBack}:{onBack:()=>void}){
  const[now,setNow]=useState<Date|null>(null);
  useEffect(()=>{
    const update=()=>setNow(new Date());
    update();
    const timer=window.setInterval(update,1000);
    return()=>window.clearInterval(timer);
  },[]);
  const time=now?.toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit",second:"2-digit",hour12:false})??"--:--:--";
  const date=now?.toLocaleDateString("zh-TW",{year:"numeric",month:"long",day:"numeric",weekday:"long"})??"正在讀取時間";
  return <div className="phone-app clock-app">
    <div className="clock-nav"><button onClick={onBack}>‹</button><b>時間</b><span/></div>
    <div className="clock-face">
      <div className="strawberry-clock" aria-label={`台北目前時間 ${time}`}>
        <div className="strawberry-leaves"><i/><i/><i/></div>
        <span className="seed seed-one">•</span><span className="seed seed-two">•</span><span className="seed seed-three">•</span><span className="seed seed-four">•</span><span className="seed seed-five">•</span><span className="seed seed-six">•</span>
        <small>TAIPEI</small>
        <time>{time}</time>
        <b>STRAWBERRY TIME</b>
      </div>
      <p>{date}</p>
      <i className="clock-now">🍓 現在時間</i>
    </div>
  </div>;
}
