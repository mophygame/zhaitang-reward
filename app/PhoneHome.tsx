"use client";

import { useEffect, useRef, useState } from "react";

const calendarEvents:Record<number,string>={
  3:"泡芙第二件半價",9:"草莓塔試吃",14:"生乳捲會員日",18:"千層預購",23:"大福買五送一",28:"嵐生日",31:"莓果季末優惠",
};

const notes=[
  "處西屯那間極凶屋，收妖前先確認屋主尾款有沒有付，沒付就讓裘芨去吵。",
  "把昨天抓到的兩隻怨靈送去登記，禁止再暫放茶水間。",
  "批完三份功德報表。三份就好，不能再少。",
  "問賀止損草莓大福能不能報「外勤補給費」。",
  "晚上巡一下冥濠負責的區域，順便在他狼嚎前塞顆糖。",
  "城南新開那間草莓千層今天限量，這件事很急。",
];

export function PhoneHome({apps,onOpen}:{apps:string[][];onOpen:(name:string)=>void}){
  const[page,setPage]=useState(0);
  const[now,setNow]=useState<Date|null>(null);
  const[dragX,setDragX]=useState(0);
  const[dragging,setDragging]=useState(false);
  const[showBirthday,setShowBirthday]=useState(false);
  const startX=useRef<number|null>(null);
  const activePointer=useRef<number|null>(null);
  const latestX=useRef<number|null>(null);
  const moved=useRef(false);
  useEffect(()=>{
    const update=()=>setNow(new Date());update();
    const timer=window.setInterval(update,1000);
    return()=>window.clearInterval(timer);
  },[]);
  const time=now?.toLocaleTimeString("zh-TW",{hour:"2-digit",minute:"2-digit",hour12:false})??"--:--";
  const date=now?.toLocaleDateString("zh-TW",{month:"long",day:"numeric",weekday:"long"})??"";
  const moveSwipe=(x:number)=>{
    if(startX.current===null)return;
    let distance=x-startX.current;
    if((page===0&&distance>0)||(page===1&&distance<0))distance/=3;
    if(Math.abs(distance)>7){moved.current=true;setDragging(true)}
    latestX.current=x;
    setDragX(Math.max(-150,Math.min(150,distance)));
  };
  const resetSwipe=()=>{
    setDragX(0);
    setDragging(false);
    startX.current=null;
    activePointer.current=null;
    latestX.current=null;
    window.setTimeout(()=>{moved.current=false},0);
  };
  const finishSwipe=(x?:number)=>{
    if(startX.current===null)return;
    const distance=(x??latestX.current??startX.current)-startX.current;
    if(distance<-45)setPage(1);
    else if(distance>45)setPage(0);
    resetSwipe();
  };
  return <div className="homescreen phone-home">
    <div className="home-status"><b>{time}</b><span>▮▮▮　◉</span></div>
    <div className={`home-pages ${dragging?"dragging":""}`} style={{transform:`translate3d(calc(-${page*50}% + ${dragX}px),0,0)`}} onPointerDown={event=>{if(!event.isPrimary)return;startX.current=event.clientX;latestX.current=event.clientX;activePointer.current=event.pointerId;moved.current=false}} onPointerMove={event=>{if(event.pointerId!==activePointer.current||startX.current===null)return;if(Math.abs(event.clientX-startX.current)>7&&!event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.setPointerCapture(event.pointerId);moveSwipe(event.clientX)}} onPointerUp={event=>{if(event.pointerId!==activePointer.current)return;const captured=event.currentTarget.hasPointerCapture(event.pointerId);finishSwipe(event.clientX);if(captured)event.currentTarget.releasePointerCapture(event.pointerId)}} onPointerCancel={resetSwipe} onLostPointerCapture={()=>{if(activePointer.current!==null)finishSwipe()}}>
      <section className="home-page app-page">
        <div className="home-title"><small>{date}</small><b>{time}</b><span>今天也要好好吃飯。</span></div>
        <div className="apps">{apps.map(app=><button key={app[1]} onClick={()=>{if(!moved.current)onOpen(app[1])}}><i className={app[2]}>{app[0].startsWith("/")?<img src={app[0]} alt=""/>:app[0]}</i><span>{app[1]}</span></button>)}</div>
      </section>
      <section className="home-page widget-page">
        <div className="calendar-widget">
          <header><b>2026 年 8 月</b><span>行事曆</span></header>
          <div className="weekdays">{["日","一","二","三","四","五","六"].map(day=><i key={day}>{day}</i>)}</div>
          <div className="month-grid">{Array.from({length:37},(_,index)=>{
            const day=index<6?null:index-5;
            const event=day?calendarEvents[day]:undefined;
            return <div key={index} className={`${day===28?"birthday ":""}${event?"has-event":""}`}>{day&&<>{day===28?<button className="birthday-trigger" onClick={()=>{if(!moved.current)setShowBirthday(true)}} aria-label="開啟嵐生日卡片"><b>{day}</b><span>{event}</span></button>:<><b>{day}</b>{event&&<span>{event}</span>}</>}</>}</div>;
          })}</div>
        </div>
        <div className="notes-widget"><header><b>便籤</b><span>今日要做</span></header><ol>{notes.map(note=><li key={note}>{note}</li>)}</ol></div>
      </section>
    </div>
    <button className="page-arrow page-prev" onClick={()=>setPage(0)} disabled={page===0} aria-label="上一個主畫面">‹</button>
    <button className="page-arrow page-next" onClick={()=>setPage(1)} disabled={page===1} aria-label="下一個主畫面">›</button>
    <div className="page-dots"><button className={page===0?"active":""} onClick={()=>setPage(0)} aria-label="第一頁"/><button className={page===1?"active":""} onClick={()=>setPage(1)} aria-label="第二頁"/></div>
    {showBirthday&&<div className="birthday-overlay" onPointerDown={event=>event.stopPropagation()} role="dialog" aria-modal="true" aria-label="嵐生日">
      <div className="confetti" aria-hidden="true">{Array.from({length:28},(_,index)=><i key={index} style={{left:`${(index*37)%100}%`,backgroundColor:["#ff6b7a","#ffd45c","#6ed6a0","#7eb5ff","#d78cff"][index%5],animationDelay:`-${(index%9)*.23}s`,animationDuration:`${2.2+(index%5)*.18}s`}}/>)}</div>
      <div className="birthday-card"><img src="/ui/img_birthday.png" alt="嵐生日賀圖"/><button onClick={()=>setShowBirthday(false)}>關閉</button></div>
    </div>}
  </div>;
}
