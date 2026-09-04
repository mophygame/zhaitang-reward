"use client";

import { useEffect, useState } from "react";
import { strFromU8, unzipSync } from "fflate";

type Sheet={name:string;rows:string[][]};

const xml=(value:Uint8Array)=>new DOMParser().parseFromString(strFromU8(value),"application/xml");
const columnIndex=(reference:string)=>{
  const letters=reference.match(/[A-Z]+/)?.[0]??"A";
  return [...letters].reduce((total,letter)=>total*26+letter.charCodeAt(0)-64,0)-1;
};
const columnName=(index:number)=>{let name="";for(let n=index+1;n>0;n=Math.floor((n-1)/26))name=String.fromCharCode(65+(n-1)%26)+name;return name};

async function readWorkbook(src:string):Promise<Sheet[]>{
  const response=await fetch(src);
  if(!response.ok)throw new Error("無法讀取試算表");
  const files=unzipSync(new Uint8Array(await response.arrayBuffer()));
  const workbook=xml(files["xl/workbook.xml"]);
  const relations=xml(files["xl/_rels/workbook.xml.rels"]);
  const relationMap=new Map([...relations.querySelectorAll("Relationship")].map(node=>[node.getAttribute("Id")??"",node.getAttribute("Target")??""]));
  const shared=files["xl/sharedStrings.xml"]?[...xml(files["xl/sharedStrings.xml"]).querySelectorAll("si")].map(item=>[...item.querySelectorAll("t")].map(text=>text.textContent??"").join("")):[];
  return [...workbook.querySelectorAll("sheet")].map(sheet=>{
    const name=sheet.getAttribute("name")??"工作表";
    const relationId=sheet.getAttribute("r:id")??sheet.getAttributeNS("http://schemas.openxmlformats.org/officeDocument/2006/relationships","id")??"";
    const target=relationMap.get(relationId)??"";
    const path=target.startsWith("/")?target.slice(1):target.startsWith("xl/")?target:`xl/${target.replace(/^\.\//,"")}`;
    const document=files[path]?xml(files[path]):null;
    const rows: string[][]=[];
    document?.querySelectorAll("row").forEach(row=>{
      const rowValues:string[]=[];
      row.querySelectorAll("c").forEach(cell=>{
        const index=columnIndex(cell.getAttribute("r")??"A1");
        const kind=cell.getAttribute("t"),raw=cell.querySelector("v")?.textContent??"";
        const formula=cell.querySelector("f")?.textContent;
        const inline=cell.querySelector("is")?.textContent??"";
        rowValues[index]=formula?`=${formula}`:kind==="s"?shared[Number(raw)]??raw:kind==="inlineStr"?inline:kind==="b"?(raw==="1"?"TRUE":"FALSE"):raw;
      });
      if(rowValues.some(value=>value!==undefined&&value!==""))rows.push(rowValues);
    });
    return{name,rows};
  });
}

export function XlsxViewer({name,src}:{name:string;src:string}){
  const[sheets,setSheets]=useState<Sheet[]>([]),[active,setActive]=useState(0),[error,setError]=useState("");
  useEffect(()=>{let cancelled=false;setSheets([]);setError("");setActive(0);readWorkbook(src).then(value=>{if(!cancelled)setSheets(value)}).catch(()=>{if(!cancelled)setError("無法開啟這份試算表")});return()=>{cancelled=true}},[src]);
  const sheet=sheets[active],columns=Math.max(1,...(sheet?.rows.map(row=>row.length)??[1]));
  return <div className="xlsx-viewer">
    <div className="xlsx-titlebar"><span>試算表</span><b>{name}</b><em>安全視窗模式</em></div>
    <div className="xlsx-ribbon"><button>檔案</button><button className="active">常用</button><button>插入</button><button>頁面配置</button><button>公式</button><button>資料</button><i/><span>Σ　A↕　%</span></div>
    <div className="xlsx-formula"><b>fx</b><span>{sheet?`${sheet.name}｜${sheet.rows.length} 列資料`:"正在載入活頁簿…"}</span></div>
    {error?<div className="xlsx-state">⚠ {error}</div>:!sheet?<div className="xlsx-state"><i/>正在開啟真正的 XLSX 檔案…</div>:<div className="sheet-scroll"><table><thead><tr><th/><>{Array.from({length:columns},(_,index)=><th key={index}>{columnName(index)}</th>)}</></tr></thead><tbody>{sheet.rows.map((row,rowIndex)=><tr key={rowIndex}><th>{rowIndex+1}</th>{Array.from({length:columns},(_,column)=><td key={column} title={row[column]??""}>{row[column]??""}</td>)}</tr>)}</tbody></table></div>}
    <div className="sheet-tabs">{sheets.map((item,index)=><button className={index===active?"active":""} key={item.name} onClick={()=>setActive(index)}>{item.name}</button>)}<span>＋</span></div>
  </div>;
}
