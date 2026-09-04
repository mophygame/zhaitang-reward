"use client";

import { useState } from "react";
import type { BrowserRecord } from "../data/browser-history";

const articleImages:Record<number,{src:string;position?:string;caption:string}>={
  1:{src:"/news/草莓甜點完整圖鑑.png",caption:"草莓季限定甜點，鮮奶油與莓果酸香是最經典的組合。"},
  2:{src:"/news/2026 台中十大必吃甜點名店.png",caption:"熱門草莓甜點店的限定櫥窗。熱門品項通常在中午前售罄。"},
  3:{src:"/news/帶心儀的她吃甜點.png",caption:"第一次約會不必過度正式，舒服而有餘裕才是重點。"},
  4:{src:"/news/帥氣饕餮的秋季穿著.png",caption:"俐落外套與乾淨鞋型，保留原本風格也能顯得用心。"},
  5:{src:"/news/獅子的求偶與繁殖行為觀察紀錄.png",caption:"野外觀察紀錄示意。"},
  6:{src:"/news/女性身體的敏感帶與舒適溝通.png",caption:"健康與親密關係的核心始終是尊重和溝通。"},
  7:{src:"/news/辦公室有BL員工.png",caption:"齋堂辦公室日常：管理的重點應回到工作與界線。"},
  8:{src:"/news/老闆不想工作.png",caption:"看起來很忙，與真正完成工作，是兩回事。"},
  9:{src:"/news/二十種讓伴侶更親密的約會姿勢與互動.png",caption:"親密互動沒有標準答案，舒服與同意最重要。"},
  10:{src:"/news/新開幕草莓專門店.png",caption:"草莓甜點與咖啡。今日熱門品項數量有限。"},
};

const heading=/^(?:0?\d{1,2}|TOP \d+|\d{2}:\d{2})｜|^(?:[一二三四五六七八九十]+、|第[一二三四五六七八九十]+種：|結論：|額外技巧：|但有一種情況，)|^(?:草莓控怎麼選？|本篇熱門草莓甜點排行|如果只能選一間？|第一次甜點約會 Checklist|野外研究者到底怎麼觀察？|不要把所有動物行為都解讀成戀愛|最值得記住的不是位置，而是三件事|哪一種互動最容易讓感情升溫？|小提醒|今日排隊時間紀錄|今日甜點庫存|排隊到底值不值得？|編輯部實測：最佳抵達時間可能不是下午|排隊時可以做什麼？|本日結論|午未的瀏覽紀錄|本站瀏覽紀錄附註)$/;
const traceStart=/^(?:午未|讀者「午未」|本站瀏覽|期間曾搜尋|搜尋|已收藏|已加入|已從|系統|個人備註|備註|扣一顆星|回報|收藏|本頁閱讀|TOP 1 店家|交通路線|目前開啟|頁面停留|最近搜尋|停留|刪除搜尋|隨後刪除|凌晨|購物車|尚未結帳|新增行程|備案|第二備案|第三備案|三秒後|兩分鐘後|再修改|第三次查看|理由備註|十二分鐘後|最後一次搜尋|瀏覽器於)/;

export function BrowserArticle({record}:{record:BrowserRecord}){
  const visual=articleImages[record.id]??articleImages[1];
  const[enlarged,setEnlarged]=useState(false);
  let inTrace=false;
  return <>
    <div className="article-brand"><b>{record.site}</b><span>{record.category}・專題報導</span></div>
    <h1>{record.title}</h1>
    <p className="article-deck">{record.summary}</p>
    <div className="article-byline"><span>編輯部</span><time>{record.time}</time></div>
    <figure className={`article-hero ${record.id===9?"portrait":"landscape"}`}><button onClick={()=>setEnlarged(true)} aria-label="放大查看報導圖片"><img src={visual.src} style={{objectPosition:visual.position}} alt={record.title}/><i>點擊放大</i></button><figcaption>{visual.caption}</figcaption></figure>
    <div className="article-body">{record.body.map((text,index)=>{
      const isHeading=heading.test(text);
      if(isHeading)inTrace=text==="午未的瀏覽紀錄";
      else if(traceStart.test(text))inTrace=true;
      if(isHeading)return <h2 className={inTrace?"trace-heading":""} key={index}>{text}</h2>;
      if(index===0&&text.includes("★"))return <div className="article-score" key={index}>{text}</div>;
      return <p className={inTrace?"wuwei-trace":""} key={index}>{text}</p>;
    })}</div>
    <aside className="article-query"><small>本次搜尋</small><b>{record.query}</b></aside>
    {enlarged&&<div className="article-lightbox" role="dialog" aria-modal="true" aria-label="放大圖片" onClick={()=>setEnlarged(false)}><button className="lightbox-close" onClick={()=>setEnlarged(false)} aria-label="關閉圖片">×</button><img src={visual.src} alt={record.title} onClick={event=>event.stopPropagation()}/></div>}
  </>;
}
