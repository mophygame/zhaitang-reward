"use client";

import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";

type WindowRect={x:number;y:number;width:number;height:number};
type Gesture={mode:"move"|"resize";pointerId:number;clientX:number;clientY:number;rect:WindowRect};

export function useConstrainedWindow(){
  const windowRef=useRef<HTMLElement>(null);
  const gesture=useRef<Gesture|null>(null);
  const[rect,setRect]=useState<WindowRect|null>(null);
  const[active,setActive]=useState(false);

  useEffect(()=>{
    const keepInsideScreen=()=>setRect(current=>{
      const parent=windowRef.current?.parentElement;
      if(!current||!parent)return current;
      const bounds=parent.getBoundingClientRect();
      const width=Math.min(current.width,bounds.width);
      const height=Math.min(current.height,Math.max(120,bounds.height-76));
      const maxX=Math.max(0,bounds.width-width),maxY=Math.max(34,bounds.height-42-height);
      return{x:Math.max(0,Math.min(maxX,current.x)),y:Math.max(34,Math.min(maxY,current.y)),width,height};
    });
    window.addEventListener("resize",keepInsideScreen);
    window.addEventListener("orientationchange",keepInsideScreen);
    return()=>{window.removeEventListener("resize",keepInsideScreen);window.removeEventListener("orientationchange",keepInsideScreen)};
  },[]);

  const measure=():WindowRect|null=>{
    const element=windowRef.current,parent=element?.parentElement;
    if(!element||!parent)return null;
    const box=element.getBoundingClientRect(),bounds=parent.getBoundingClientRect();
    return{x:box.left-bounds.left,y:box.top-bounds.top,width:box.width,height:box.height};
  };
  const start=(mode:Gesture["mode"],event:ReactPointerEvent<HTMLElement>)=>{
    if(mode==="move"&&(event.target as HTMLElement).closest("button"))return;
    const current=rect??measure();
    if(!current)return;
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    gesture.current={mode,pointerId:event.pointerId,clientX:event.clientX,clientY:event.clientY,rect:current};
    setRect(current);setActive(true);
  };
  const move=(event:ReactPointerEvent<HTMLElement>)=>{
    const current=gesture.current,parent=windowRef.current?.parentElement;
    if(!current||current.pointerId!==event.pointerId||!parent)return;
    const bounds=parent.getBoundingClientRect();
    const dx=event.clientX-current.clientX,dy=event.clientY-current.clientY;
    if(current.mode==="move"){
      const maxX=Math.max(0,bounds.width-current.rect.width);
      const maxY=Math.max(34,bounds.height-42-current.rect.height);
      setRect({...current.rect,x:Math.max(0,Math.min(maxX,current.rect.x+dx)),y:Math.max(34,Math.min(maxY,current.rect.y+dy))});
    }else{
      const minWidth=Math.min(340,bounds.width-current.rect.x);
      const minHeight=Math.min(240,bounds.height-42-current.rect.y);
      const maxWidth=Math.max(minWidth,bounds.width-current.rect.x);
      const maxHeight=Math.max(minHeight,bounds.height-42-current.rect.y);
      setRect({...current.rect,width:Math.max(minWidth,Math.min(maxWidth,current.rect.width+dx)),height:Math.max(minHeight,Math.min(maxHeight,current.rect.height+dy))});
    }
  };
  const end=(event:ReactPointerEvent<HTMLElement>)=>{
    if(gesture.current?.pointerId!==event.pointerId)return;
    gesture.current=null;setActive(false);
  };
  const style:CSSProperties|undefined=rect?{left:rect.x,top:rect.y,width:rect.width,height:rect.height,right:"auto",bottom:"auto"}:undefined;

  return{
    windowProps:{ref:windowRef,style,className:active?"window-transforming":""},
    moveProps:{onPointerDown:(event:ReactPointerEvent<HTMLElement>)=>start("move",event),onPointerMove:move,onPointerUp:end,onPointerCancel:end},
    resizeProps:{onPointerDown:(event:ReactPointerEvent<HTMLElement>)=>start("resize",event),onPointerMove:move,onPointerUp:end,onPointerCancel:end},
  };
}
