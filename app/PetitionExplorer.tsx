"use client";

import { useState } from "react";
import type { PetitionDocument, PetitionFolder } from "../data/petition-data";
import type { DesktopItem } from "../data/computer-data";
import type { ItemPlacement, PlacementMap } from "./DesktopWorkspace";

function separateImperialNotes(body:string){
  const notes:string[]=[];
  const official:string[]=[];
  let awaitingNote=false;
  for(const block of body.split(/\n\n+/)){
    const lines=block.split("\n");
    const heading=lines[0].trim();
    if(/^(午未(?:留下註解|批註|批示)|批註)：$/.test(heading)){
      const written=lines.slice(1).join("\n").trim();
      if(written)notes.push(written==="空白。"?"（這裡還是空白的。）":written);
      else awaitingNote=true;
      continue;
    }
    if(/^(旁邊.*寫了一句|下面又補|又補)：?$/.test(heading)){
      awaitingNote=true;
      continue;
    }
    if(awaitingNote){notes.push(block.trim());awaitingNote=false;continue}
    const direct=block.match(/^午未(?:回覆)?[：:]\s*([\s\S]+)$/);
    if(direct){notes.push(direct[1].trim());continue}
    if(/^午未(?:已讀|閱讀|看完|看到|盯著|沉默|在)/.test(heading)){
      const inlineRuling=block.match(/批示[：:]\s*([^。]+。?)/);
      if(inlineRuling)notes.push(inlineRuling[1].trim());
      continue;
    }
    official.push(block);
  }
  return {official:official.join("\n\n"),notes};
}

function DocumentPaper({document,onBack}:{document:PetitionDocument;onBack:()=>void}){
  const review=separateImperialNotes(document.body);
  return <div className="petition-reader">
    <div className="reader-commandbar">
      <button onClick={onBack}>‹ 返回資料夾</button>
      <span>唯讀模式</span>
      <button onClick={()=>window.print()} aria-label="列印公文">列印</button>
    </div>
    <div className="petition-scroll">
      <article className="petition-paper">
        <div className="official-mark">天界公文</div>
        <p className="document-number">卷宗編號 ZT-{document.id.padStart(4,"0")}</p>
        <h1>《{document.title}》</h1>
        <dl>
          <div><dt>呈奏單位</dt><dd>{document.department}</dd></div>
          <div><dt>辦理狀態</dt><dd><span className="document-status">{document.status}</span></dd></div>
          {document.priority&&<div><dt>緊急程度</dt><dd>{document.priority}</dd></div>}
        </dl>
        <div className="official-divider"><i>奏</i></div>
        <div className="document-body">{review.official}</div>
        {review.notes.length>0&&<aside className="imperial-handwriting" aria-label="午未的手寫批註">
          {review.notes.map((note,index)=><p key={`${note}-${index}`}>{note}</p>)}
          <img className="imperial-stamp" src="/ui/stamp_午未.png" alt="午未御批印章"/>
        </aside>}
        <footer><span>齋堂 OS 文件檢視器</span><span>第 1 頁，共 1 頁</span></footer>
      </article>
    </div>
  </div>;
}

export function PetitionExplorer({folder,items=[],placements={},onPlace,onOpen}:{folder:PetitionFolder;items?:DesktopItem[];placements?:PlacementMap;onPlace?:(name:string,next:ItemPlacement)=>void;onOpen?:(item:DesktopItem)=>void}){
  const[active,setActive]=useState<PetitionDocument|null>(null);
  const managedItems=items.filter(item=>placements[item.name]?.parent===folder.name);
  const move=(name:string,parent:string|null)=>{const current=placements[name]??{parent:null,x:20,y:20};onPlace?.(name,{...current,parent})};
  const startDrag=(event:React.DragEvent,name:string)=>{event.dataTransfer.setData("application/x-zhaitang-file",name);event.dataTransfer.effectAllowed="move"};
  const receive=(event:React.DragEvent,parent:string|null)=>{event.preventDefault();const name=event.dataTransfer.getData("application/x-zhaitang-file");if(name&&name!==parent)move(name,parent)};
  if(active)return <DocumentPaper document={active} onBack={()=>setActive(null)}/>;
  return <div className={`petition-explorer${folder.urgent?" urgent":""}`}>
    <div className="explorer-address" onDragOver={event=>event.preventDefault()} onDrop={event=>receive(event,null)} title="將項目拖到這裡可移回桌面"><button aria-label="移回桌面">←</button><button aria-label="重新整理">↻</button><span>本機 &gt; 桌面 &gt; {folder.name}　（拖到此列可移回桌面）</span><label>搜尋 {folder.name}</label></div>
    <div className="explorer-body">
      <aside><b>快速存取</b><span>桌面</span><span>下載</span><span>文件</span><span>最近使用</span><hr/><b>本機</b><span>奏摺公文</span><span>齋堂房屋</span></aside>
      <main>
        <header>
          <div><h2>{folder.urgent?"🚨 ":""}{folder.name}</h2><p>{folder.summary}｜{folder.unread}</p></div>
          <div className="folder-actions"><button>＋ 新增</button><button>排序⌄</button><button>檢視⌄</button></div>
        </header>
        {folder.note&&<div className="folder-note">{folder.note}</div>}
        <div className="file-table" role="table" aria-label={`${folder.name}公文列表`}>
          <div className="file-table-head" role="row"><span>名稱</span><span>呈奏單位</span><span>狀態</span><span>類型</span></div>
          {managedItems.map(item=><button role="row" draggable key={`managed-${item.name}`} onDragStart={event=>startDrag(event,item.name)} onDragOver={event=>{if(item.type.includes("資料夾"))event.preventDefault()}} onDrop={event=>{if(item.type.includes("資料夾")){event.stopPropagation();receive(event,item.name)}}} onDoubleClick={()=>onOpen?.(item)}>
            <span className="petition-file-name"><i>{item.icon}</i><b>{item.name}</b></span><span>桌面項目</span><span>{item.type.includes("資料夾")?"可放入":"已移入"}</span><span>{item.type}</span>
          </button>)}
          {folder.documents.map(document=><button role="row" key={document.id} onClick={()=>setActive(document)}>
            <span className="petition-file-name"><i>{folder.urgent?"🔴":"📄"}</i><b>{document.id}｜《{document.title}》</b></span>
            <span>{document.department}</span><span className={document.status.includes("未讀")?"unread":""}>{document.status}</span><span>天界公文</span>
          </button>)}
        </div>
        <div className="folder-filler"><span>⋯</span><p>其餘項目已收合，雙擊上方文件即可預覽內容。</p></div>
      </main>
    </div>
    <footer>{folder.summary}<span>{folder.unread}</span></footer>
  </div>;
}
