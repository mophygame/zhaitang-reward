"use client";

import { useMemo, useState } from "react";
import { messages } from "../data/message-data";
import { getContactAvatar } from "../data/contact-avatars";

function ContactAvatar({contact, large=false}:{contact:string;large?:boolean}){
  const src=getContactAvatar(contact);
  return src?<img className={`contact-avatar${large?" large":""}`} src={src} alt={`${contact}的大頭貼`}/>:<i>{contact.slice(0,1)}</i>;
}

export function MessagesApp({onBack}:{onBack:()=>void}){
  const[thread,setThread]=useState<string|null>(null);
  const[search,setSearch]=useState("");
  const threads=useMemo(()=>{
    const grouped=new Map<string,typeof messages>();
    for(const item of messages){const list=grouped.get(item.contact)??[];list.push(item);grouped.set(item.contact,list)}
    return [...grouped.entries()].map(([contact,items])=>({contact,items,latest:items.reduce((a,b)=>a.time>b.time?a:b),drafts:items.filter(item=>item.status==="draft").length})).sort((a,b)=>b.latest.time.localeCompare(a.latest.time));
  },[]);
  const visible=threads.filter(item=>`${item.contact}${item.latest.title}${item.latest.text}`.includes(search));
  const active=thread?threads.find(item=>item.contact===thread):null;
  if(active)return <div className="phone-app messages-app conversation-view">
    <div className="message-nav"><button onClick={()=>setThread(null)}>‹</button><div><ContactAvatar contact={active.contact} large/><b>{active.contact}</b></div><span aria-hidden="true"/></div>
    <div className="message-stream"><div className="conversation-date">最近訊息</div>{active.items.sort((a,b)=>a.time===b.time?a.id-b.id:a.time.localeCompare(b.time)).map(item=><div className={`message-line ${item.direction} ${item.status}`} key={item.id}><small>{item.time}{item.status==="draft"?"・未送出草稿":""}</small><div className="message-bubble"><em>{item.title}</em><p>{item.text||"（空白草稿）"}</p></div>{item.direction==="out"&&item.status==="sent"&&<span>已送達</span>}</div>)}</div>
    <div className="message-compose"><button>＋</button><span>簡訊</span><button>↑</button></div>
  </div>;
  return <div className="phone-app messages-app">
    <div className="messages-header"><button onClick={onBack}>‹</button><span>編輯</span></div>
    <h1>訊息</h1>
    <label className="message-search">⌕<input value={search} onChange={event=>setSearch(event.target.value)} placeholder="搜尋"/></label>
    <div className="thread-list">{visible.map(item=><button key={item.contact} onClick={()=>setThread(item.contact)}><ContactAvatar contact={item.contact}/><div><header><b>{item.contact}</b><time>{item.latest.time.replace(/^\d{2}\/\d{2} /,"")}</time></header><p>{item.drafts>0&&<em>草稿：</em>}{item.latest.text||item.latest.title}</p></div><span>›</span></button>)}</div>
  </div>;
}
