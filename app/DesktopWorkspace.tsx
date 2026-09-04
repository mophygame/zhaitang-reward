"use client";

import { useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import type { DesktopItem } from "../data/computer-data";

export type ItemPlacement={parent:string|null;x:number;y:number};
export type PlacementMap=Record<string,ItemPlacement>;

const isFolder=(item:DesktopItem)=>item.type.includes("資料夾");
const defaultPlacement=(item:DesktopItem,index:number):ItemPlacement=>({parent:item.parent??null,x:8+(index%8)*78,y:8+Math.floor(index/8)*74});

export function DesktopWorkspace({items,placements,onPlace,onOpen}:{items:DesktopItem[];placements:PlacementMap;onPlace:(name:string,next:ItemPlacement)=>void;onOpen:(item:DesktopItem)=>void}){
  const areaRef=useRef<HTMLDivElement>(null);
  const dragRef=useRef<{name:string;pointerId:number;startX:number;startY:number;originX:number;originY:number;moved:boolean}|null>(null);
  const[dragging,setDragging]=useState<string|null>(null);
  const[dropTarget,setDropTarget]=useState<string|null>(null);

  const positionOf=(item:DesktopItem,index:number)=>placements[item.name]??defaultPlacement(item,index);
  const findFolderBelow=(clientX:number,clientY:number,current:string)=>{
    for(const element of document.elementsFromPoint(clientX,clientY)){
      const folder=(element as HTMLElement).closest<HTMLElement>("[data-desktop-folder]");
      if(folder?.dataset.desktopFolder&&folder.dataset.desktopFolder!==current)return folder.dataset.desktopFolder;
    }
    return null;
  };
  const pointerDown=(event:ReactPointerEvent<HTMLButtonElement>,item:DesktopItem,index:number)=>{
    if(event.button!==0)return;
    const position=positionOf(item,index);
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current={name:item.name,pointerId:event.pointerId,startX:event.clientX,startY:event.clientY,originX:position.x,originY:position.y,moved:false};
    setDragging(item.name);
  };
  const pointerMove=(event:ReactPointerEvent<HTMLButtonElement>)=>{
    const drag=dragRef.current,area=areaRef.current;
    if(!drag||drag.pointerId!==event.pointerId||!area)return;
    const dx=event.clientX-drag.startX,dy=event.clientY-drag.startY;
    if(Math.abs(dx)+Math.abs(dy)>5)drag.moved=true;
    const rect=area.getBoundingClientRect();
    onPlace(drag.name,{parent:null,x:Math.max(0,Math.min(rect.width-74,drag.originX+dx)),y:Math.max(0,Math.min(rect.height-70,drag.originY+dy))});
    setDropTarget(findFolderBelow(event.clientX,event.clientY,drag.name));
  };
  const pointerUp=(event:ReactPointerEvent<HTMLButtonElement>,item:DesktopItem)=>{
    const drag=dragRef.current;
    if(!drag||drag.pointerId!==event.pointerId)return;
    const target=findFolderBelow(event.clientX,event.clientY,drag.name);
    if(drag.moved&&target)onPlace(drag.name,{...(placements[drag.name]??{x:drag.originX,y:drag.originY}),parent:target});
    if(!drag.moved)onOpen(item);
    dragRef.current=null;setDragging(null);setDropTarget(null);
  };

  return <div className="desktop-files interactive-desktop-files" ref={areaRef} aria-label="可整理的電腦桌面">
    {items.map((item,index)=>{
      const position=positionOf(item,index);
      if(position.parent!==null)return null;
      return <button
        key={item.name}
        className={`${isFolder(item)?"folder ":""}${item.type.includes("上鎖")?"locked ":""}${item.type==="應用程式"?"desktop-app ":""}${dragging===item.name?"dragging ":""}${dropTarget===item.name?"drop-target":""}`}
        data-desktop-folder={isFolder(item)?item.name:undefined}
        style={{left:`min(${position.x}px, calc(100% - 74px))`,top:`min(${position.y}px, calc(100% - 70px))`}}
        onPointerDown={event=>pointerDown(event,item,index)}
        onPointerMove={pointerMove}
        onPointerUp={event=>pointerUp(event,item)}
        onPointerCancel={()=>{dragRef.current=null;setDragging(null);setDropTarget(null)}}
        title={`${item.content}｜可拖曳整理`}
      ><i>{item.icon}</i><span>{item.name}</span></button>;
    })}
  </div>;
}

export function FolderContents({folder,items,placements,onPlace,onOpen}:{folder:DesktopItem;items:DesktopItem[];placements:PlacementMap;onPlace:(name:string,next:ItemPlacement)=>void;onOpen:(item:DesktopItem)=>void}){
  const children=items.filter(item=>(placements[item.name]?.parent??item.parent??null)===folder.name);
  const move=(name:string,parent:string|null)=>{
    const current=placements[name]??{parent:null,x:20,y:20};
    onPlace(name,{...current,parent});
  };
  const startDrag=(event:React.DragEvent,name:string)=>{event.dataTransfer.setData("application/x-zhaitang-file",name);event.dataTransfer.effectAllowed="move"};
  const receive=(event:React.DragEvent,parent:string|null)=>{event.preventDefault();const name=event.dataTransfer.getData("application/x-zhaitang-file");if(name&&name!==parent)move(name,parent)};

  return <div className="folder-contents">
    <div className="folder-path-drop" onDragOver={event=>event.preventDefault()} onDrop={event=>receive(event,null)} title="將項目拖到這裡可移回桌面">
      <b>🖥 桌面</b><span>›</span><strong>{folder.name}</strong><em>拖到「桌面」可移出資料夾</em>
    </div>
    <div className="folder-content-head"><span>名稱</span><span>類型</span><span>內容摘要</span></div>
    {children.length===0?<div className="empty-folder"><i>📂</i><b>這個資料夾是空的</b><p>把桌面上的檔案或資料夾拖到它上方，即可移入這裡。</p></div>:<div className="folder-item-list">{children.map(item=><button
      key={item.name}
      draggable
      data-folder-row={isFolder(item)?item.name:undefined}
      onDragStart={event=>startDrag(event,item.name)}
      onDragOver={event=>{if(isFolder(item))event.preventDefault()}}
      onDrop={event=>{if(isFolder(item)){event.stopPropagation();receive(event,item.name)}}}
      onClick={()=>{if(!isFolder(item))onOpen(item)}}
      onDoubleClick={()=>{if(isFolder(item))onOpen(item)}}
    ><span><i>{item.icon}</i><b>{item.name}</b></span><small>{item.type}</small><p>{item.content}</p>{isFolder(item)&&<em>可放入</em>}</button>)}</div>}
    <div className="folder-drop-hint">單擊文件即可另開預覽視窗；雙擊資料夾可開啟，項目也能拖曳整理。</div>
  </div>;
}
