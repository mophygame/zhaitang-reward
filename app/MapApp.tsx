"use client";

import { useEffect, useRef, useState } from "react";

const areas=["城南商圈","西區草悟道","北屯甜點街","市政北七路","舊城巷弄","七期街區","勤美附近","柳川河畔"];
const shopNames=["莓日製菓","雲朵生乳所","一層一層千層屋","小島泡芙","春日果實","月下菓子室","焦糖研究室","白晝序曲","十九號老宅甜點","夜半甜室","草莓糖果舖","大福研究社","奶油小路","莓好甜點室","午後布丁所","粉紅生乳捲"];
const markerPositions=[[18,23],[76,18],[84,48],[68,76],[28,79],[12,55],[46,14],[48,86]];

type MapState={area:string;shops:{name:string;x:number;y:number;wait:number}[];roads:{x:number;y:number;width:number;angle:number;size:number}[]};

function createMap():MapState{
  const area=areas[Math.floor(Math.random()*areas.length)];
  const shops=[...shopNames].sort(()=>Math.random()-.5).slice(0,6).map((name,index)=>({name,x:markerPositions[index][0]+Math.round(Math.random()*6-3),y:markerPositions[index][1]+Math.round(Math.random()*6-3),wait:5+Math.floor(Math.random()*56)}));
  const roads=Array.from({length:12},()=>({x:-28+Math.floor(Math.random()*120),y:Math.floor(Math.random()*100),width:75+Math.floor(Math.random()*100),angle:-75+Math.floor(Math.random()*151),size:5+Math.floor(Math.random()*8)}));
  return{area,shops,roads};
}

export function MapApp({onBack}:{onBack:()=>void}){
  const[map,setMap]=useState<MapState>({area:"正在搜尋午未……",shops:[],roads:[]});
  const[locating,setLocating]=useState(true);
  const[zoom,setZoom]=useState(1);
  const pointers=useRef(new Map<number,{x:number;y:number}>());
  const pinch=useRef<{distance:number;zoom:number}|null>(null);
  const clampZoom=(value:number)=>Math.min(2.5,Math.max(1,value));
  const changeZoom=(amount:number)=>setZoom(value=>clampZoom(value+amount));
  const locate=()=>{setLocating(true);setZoom(1);window.setTimeout(()=>{setMap(createMap());setLocating(false)},420)};
  const pointerDistance=()=>{const values=[...pointers.current.values()];return values.length<2?0:Math.hypot(values[0].x-values[1].x,values[0].y-values[1].y)};
  useEffect(()=>{locate()},[]);
  return <div className="phone-app map-app">
    <header className="map-header"><button onClick={onBack} aria-label="回到主畫面">‹</button><div><b>午未的位置</b><small>{map.area}</small></div><button className={locating?"locating":""} onClick={locate} aria-label="重新定位">⌖</button></header>
    <div className={`fake-map ${locating?"is-locating":""}`} onWheel={event=>{event.preventDefault();changeZoom(event.deltaY<0?.18:-.18)}} onDoubleClick={()=>changeZoom(.4)} onPointerDown={event=>{pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});event.currentTarget.setPointerCapture(event.pointerId);if(pointers.current.size===2)pinch.current={distance:pointerDistance(),zoom}}} onPointerMove={event=>{if(!pointers.current.has(event.pointerId))return;pointers.current.set(event.pointerId,{x:event.clientX,y:event.clientY});if(pointers.current.size===2&&pinch.current){const distance=pointerDistance();if(pinch.current.distance)setZoom(clampZoom(pinch.current.zoom*distance/pinch.current.distance))}}} onPointerUp={event=>{pointers.current.delete(event.pointerId);pinch.current=null;if(event.currentTarget.hasPointerCapture(event.pointerId))event.currentTarget.releasePointerCapture(event.pointerId)}} onPointerCancel={event=>{pointers.current.delete(event.pointerId);pinch.current=null}}>
      <div className="map-canvas" style={{transform:`scale(${zoom})`}}>
        {map.roads.map((road,index)=><i className="random-road" key={index} style={{left:`${road.x}%`,top:`${road.y}%`,width:`${road.width}%`,height:`${road.size}px`,transform:`rotate(${road.angle}deg)`}}/>)}
        {map.shops.map(shop=><button className="dessert-pin" key={shop.name} style={{left:`${shop.x}%`,top:`${shop.y}%`}} aria-label={`${shop.name}，等候約 ${shop.wait} 分鐘`}><i>🍰</i><span><b>{shop.name}</b><small>等候約 {shop.wait} 分鐘</small></span></button>)}
        <div className="wuwei-location"><div className="location-pulse"/><i>午</i><span><b>午未在這裡</b><small>{map.area}・剛剛更新</small></span></div>
      </div>
      <div className="map-zoom" aria-label="地圖縮放"><button onClick={()=>changeZoom(.25)} disabled={zoom>=2.5} aria-label="放大地圖">＋</button><span>{Math.round(zoom*100)}%</span><button onClick={()=>changeZoom(-.25)} disabled={zoom<=1} aria-label="縮小地圖">－</button></div>
      {locating&&<div className="locating-card"><i>🍓</i><b>正在追蹤草莓氣息…</b></div>}
    </div>
    <div className="map-sheet"><span/><div><b>附近甜點</b><small>找到 {map.shops.length} 間・午未可能正在排隊</small></div><button onClick={locate}>換個位置</button></div>
  </div>;
}
