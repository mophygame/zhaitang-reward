"use client";

import { useState } from "react";

export function WebShortcutViewer({name,src}:{name:string;src:string}){
  const[reload,setReload]=useState(0);
  const address=new URL(src);
  return <div className="desktop-browser">
    <div className="browser-tab-strip">
      <button className="browser-menu-dot" aria-label="瀏覽器選單">⋮</button>
      <div className="chrome-tab"><span className="mini-google"><i>G</i></span><b>{name}</b><em>×</em></div>
      <button className="new-browser-tab" aria-label="新增分頁">＋</button>
      <span className="browser-window-controls">—　□</span>
    </div>
    <div className="desktop-browser-address">
      <button disabled aria-label="上一頁">‹</button><button disabled aria-label="下一頁">›</button><button onClick={()=>setReload(value=>value+1)} aria-label="重新整理">↻</button>
      <div><span>🔒</span><b>{address.hostname}</b><small>{address.pathname}</small></div>
      <a href={src} target="_blank" rel="noreferrer" aria-label="在外部瀏覽器開啟">↗</a><button aria-label="更多選項">⋮</button>
    </div>
    <div className="desktop-browser-page">
      <iframe key={reload} title={`${name}網頁`} src={src}/>
      <div className="browser-page-help">若網站禁止嵌入顯示，請按網址列右側的 ↗ 在完整分頁開啟。</div>
    </div>
    <footer><span>Google 瀏覽器</span><span>{address.hostname}</span></footer>
  </div>;
}
