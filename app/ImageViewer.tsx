"use client";

import { useState } from "react";

export function ImageViewer({name,src}:{name:string;src:string}){
  const[zoom,setZoom]=useState(1),[rotation,setRotation]=useState(0);
  const changeZoom=(amount:number)=>setZoom(value=>Math.max(.25,Math.min(3,Number((value+amount).toFixed(2)))));
  return <div className="image-viewer">
    <div className="image-viewer-toolbar">
      <span>圖片檢視器</span><b>{name}</b>
      <div><button onClick={()=>changeZoom(-.25)} aria-label="縮小圖片">−</button><em>{Math.round(zoom*100)}%</em><button onClick={()=>changeZoom(.25)} aria-label="放大圖片">＋</button><button onClick={()=>setRotation(value=>(value+90)%360)} aria-label="旋轉圖片">↻</button></div>
    </div>
    <div className="image-canvas"><img src={src} alt={name} style={{transform:`scale(${zoom}) rotate(${rotation}deg)`}}/></div>
    <footer><span>{name}</span><span>原始圖片｜可縮放、旋轉</span></footer>
  </div>;
}
