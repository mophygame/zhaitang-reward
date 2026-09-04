"use client";

import { useEffect, useState } from "react";

export function TextViewer({name,src}:{name:string;src:string}){
  const[text,setText]=useState(""),[error,setError]=useState("");
  useEffect(()=>{let cancelled=false;setText("");setError("");fetch(src).then(response=>{if(!response.ok)throw new Error();return response.text()}).then(value=>{if(!cancelled)setText(value)}).catch(()=>{if(!cancelled)setError("無法開啟這份文字文件")});return()=>{cancelled=true}},[src]);
  const lines=text?text.split(/\r?\n/).length:1;
  return <div className="text-viewer">
    <div className="notepad-menubar"><button>檔案</button><button>編輯</button><button>檢視</button><span>安全視窗模式</span></div>
    {error?<div className="notepad-state">⚠ {error}</div>:text===""?<div className="notepad-state"><i/>正在開啟真正的文字文件…</div>:<div className="notepad-paper" role="textbox" aria-readonly="true" aria-label={name}>{text}</div>}
    <footer><span>第 {lines} 行</span><span>{text.length} 個字元</span><span>100%</span><span>UTF-8</span></footer>
  </div>;
}
