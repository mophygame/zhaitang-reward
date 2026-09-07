"use client";

import { useEffect, useState } from "react";

export function PdfViewer({name,src}:{name:string;src:string}){
  const[url,setUrl]=useState("");
  const[error,setError]=useState(false);
  useEffect(()=>{
    let cancelled=false,objectUrl="";
    setUrl("");setError(false);
    fetch(src).then(response=>{if(!response.ok)throw new Error();return response.blob()}).then(blob=>{
      if(cancelled)return;
      objectUrl=URL.createObjectURL(new Blob([blob],{type:"application/pdf"}));
      setUrl(`${objectUrl}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`);
    }).catch(()=>{if(!cancelled)setError(true)});
    return()=>{cancelled=true;if(objectUrl)URL.revokeObjectURL(objectUrl)};
  },[src]);
  return <div className="pdf-file-content">
    <div className="pdf-toolbar"><span>PDF 閱讀器</span><b>{name}</b><em>安全視窗模式</em></div>
    {error?<div className="pdf-state">⚠ 無法開啟這份 PDF 文件</div>:url?<iframe className="pdf-viewer" title={name} src={url}/>:<div className="pdf-state"><i/>正在安全載入 PDF…</div>}
  </div>;
}
