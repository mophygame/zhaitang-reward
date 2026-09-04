"use client";

import { useEffect, useState } from "react";
import { strFromU8, unzipSync } from "fflate";

type ParagraphBlock={type:"paragraph";text:string;style:string};
type TableBlock={type:"table";rows:string[][]};
type WordBlock=ParagraphBlock|TableBlock;

const elements=(node:Element,name:string)=>[...node.getElementsByTagName(name)];
const textFrom=(node:Element)=>elements(node,"w:t").map(item=>item.textContent??"").join("");

async function readDocx(src:string):Promise<WordBlock[]>{
  const response=await fetch(src);
  if(!response.ok)throw new Error("無法讀取 Word 文件");
  const files=unzipSync(new Uint8Array(await response.arrayBuffer()));
  const content=files["word/document.xml"];
  if(!content)throw new Error("文件內容不存在");
  const document=new DOMParser().parseFromString(strFromU8(content),"application/xml");
  const body=document.getElementsByTagName("w:body")[0];
  const blocks:WordBlock[]=[];
  for(const child of [...body.children]){
    if(child.tagName==="w:p"){
      const text=textFrom(child).trim();
      if(!text)continue;
      const styleNode=child.getElementsByTagName("w:pStyle")[0];
      const rawStyle=styleNode?.getAttribute("w:val")??styleNode?.getAttribute("val")??"";
      const style=/Title|標題|Heading/i.test(rawStyle)||/^[一二三四五六七八九十]+、/.test(text)?"heading":"body";
      blocks.push({type:"paragraph",text,style});
    }
    if(child.tagName==="w:tbl"){
      const rows=elements(child,"w:tr").map(row=>elements(row,"w:tc").map(cell=>textFrom(cell).trim()));
      blocks.push({type:"table",rows});
    }
  }
  return blocks;
}

export function DocxViewer({name,src}:{name:string;src:string}){
  const[blocks,setBlocks]=useState<WordBlock[]>([]),[error,setError]=useState("");
  useEffect(()=>{let cancelled=false;setBlocks([]);setError("");readDocx(src).then(value=>{if(!cancelled)setBlocks(value)}).catch(()=>{if(!cancelled)setError("無法開啟這份 Word 文件")});return()=>{cancelled=true}},[src]);
  return <div className="docx-viewer">
    <div className="docx-titlebar"><span>W</span><b>{name}</b><em>安全視窗模式</em></div>
    <div className="docx-tabs"><button>檔案</button><button className="active">常用</button><button>插入</button><button>繪圖</button><button>版面配置</button><button>校閱</button><button>檢視</button></div>
    <div className="docx-ribbon"><b>剪貼簿</b><span>字型　新細明體　⌄　12　⌄　 B　I　U</span><span>段落　☰　≡　↕</span><span>樣式　標題 1　正文</span></div>
    <div className="docx-workspace">
      {error?<div className="docx-state">⚠ {error}</div>:blocks.length===0?<div className="docx-state"><i/>正在開啟真正的 DOCX 檔案…</div>:<article className="word-page">{blocks.map((block,index)=>block.type==="paragraph"?<p className={block.style} key={index}>{block.text}</p>:<table key={index}><tbody>{block.rows.map((row,rowIndex)=><tr key={rowIndex}>{row.map((cell,cellIndex)=><td key={cellIndex}>{cell}</td>)}</tr>)}</tbody></table>)}</article>}
    </div>
    <footer className="docx-status"><span>第 1 頁，共 1 頁</span><span>{blocks.filter(block=>block.type==="paragraph").length} 個段落</span><span>繁體中文　－　100%　＋</span></footer>
  </div>;
}
