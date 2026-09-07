"use client";

import { useEffect, useState } from "react";

export function LegacyDocViewer({name,src}:{name:string;src:string}){
  const[state,setState]=useState<"loading"|"ready"|"error">("loading");
  useEffect(()=>{let cancelled=false;setState("loading");fetch(src).then(response=>{if(!response.ok)throw new Error();return response.arrayBuffer()}).then(()=>{if(!cancelled)setState("ready")}).catch(()=>{if(!cancelled)setState("error")});return()=>{cancelled=true}},[src]);
  return <div className="docx-viewer legacy-doc-viewer">
    <div className="docx-titlebar"><span>W</span><b>{name}</b><em>安全視窗模式</em></div>
    <div className="docx-tabs"><button>檔案</button><button className="active">常用</button><button>插入</button><button>版面配置</button><button>檢視</button></div>
    <div className="docx-ribbon"><b>舊版文件</b><span>相容模式　唯讀</span></div>
    <div className="docx-workspace"><article className="word-page">
      {state==="loading"?<div className="docx-state"><i/>正在安全讀取 DOC 文件…</div>:state==="error"?<div className="docx-state">⚠ 無法讀取這份文件</div>:<><p>{name}</p><p>Microsoft Word 97–2003 文件</p><p>此舊式 DOC 檔案已在齋堂 OS 的安全假視窗中開啟。</p><p>為避免跳離遊戲或觸發瀏覽器下載，本機預覽器不提供外部開啟與下載功能。</p></>}
    </article></div>
    <footer className="docx-status"><span>相容模式</span><span>唯讀</span><span>安全視窗　100%</span></footer>
  </div>;
}
