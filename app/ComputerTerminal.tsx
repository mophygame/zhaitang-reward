"use client";

import { useEffect, useState, type PointerEvent as ReactPointerEvent } from "react";
import { desktopItems, type DesktopItem } from "../data/computer-data";
import { petitionFolders } from "../data/petition-data";
import { PetitionExplorer } from "./PetitionExplorer";
import { DesktopWorkspace, FolderContents, type ItemPlacement, type PlacementMap } from "./DesktopWorkspace";
import { useConstrainedWindow } from "./useConstrainedWindow";
import { XlsxViewer } from "./XlsxViewer";
import { DocxViewer } from "./DocxViewer";
import { ImageViewer } from "./ImageViewer";
import { TextViewer } from "./TextViewer";
import { WebShortcutViewer } from "./WebShortcutViewer";
import { VideoViewer } from "./VideoViewer";

const DESKTOP_LAYOUT_KEY="zhaitang-desktop-layout-v1";
const ghostAppItem:DesktopItem={name:"齋堂抓鬼魂",icon:"鬼",type:"應用程式",content:"點擊開啟抓鬼魂小遊戲。"};
const computerItems=[ghostAppItem,...desktopItems];

const ghosts=[
  {left:12,top:18},{left:67,top:14},{left:42,top:48},{left:76,top:62},
  {left:19,top:65},{left:53,top:25},{left:32,top:34},{left:61,top:70},
];

export function ComputerTerminal({onClose}:{onClose:()=>void}){
  const fileWindow=useConstrainedWindow();
  const previewWindow=useConstrainedWindow();
  const gameWindow=useConstrainedWindow();
  const[password,setPassword]=useState("");
  const[unlocked,setUnlocked]=useState(false);
  const[error,setError]=useState(false);
  const[appOpen,setAppOpen]=useState(false);
  const[playing,setPlaying]=useState(false);
  const[seconds,setSeconds]=useState(20);
  const[score,setScore]=useState(0);
  const[ghost,setGhost]=useState(0);
  const[predator,setPredator]=useState({left:50,top:55});
  const[attacking,setAttacking]=useState(false);
  const[strawberryBursts,setStrawberryBursts]=useState<Array<{id:number;left:number;top:number}>>([]);
  const[selected,setSelected]=useState<DesktopItem|null>(null);
  const[previewFile,setPreviewFile]=useState<DesktopItem|null>(null);
  const[lockedFolder,setLockedFolder]=useState<DesktopItem|null>(null);
  const[folderPassword,setFolderPassword]=useState("");
  const[folderPasswordError,setFolderPasswordError]=useState(false);
  const[privateFolderUnlocked,setPrivateFolderUnlocked]=useState(false);
  const[notificationsOpen,setNotificationsOpen]=useState(false);
  const[placements,setPlacements]=useState<PlacementMap>({});
  const[layoutLoaded,setLayoutLoaded]=useState(false);

  useEffect(()=>{
    try{const saved=window.localStorage.getItem(DESKTOP_LAYOUT_KEY);if(saved)setPlacements(JSON.parse(saved))}catch{}
    setLayoutLoaded(true);
  },[]);
  useEffect(()=>{if(layoutLoaded)window.localStorage.setItem(DESKTOP_LAYOUT_KEY,JSON.stringify(placements))},[placements,layoutLoaded]);

  useEffect(()=>{
    if(!playing)return;
    const timer=window.setInterval(()=>setSeconds(value=>{
      if(value<=1){window.clearInterval(timer);setPlaying(false);return 0}
      return value-1;
    }),1000);
    return()=>window.clearInterval(timer);
  },[playing]);

  const login=()=>{
    if(password==="0423170317"){setUnlocked(true);setError(false)}
    else{setError(true);setPassword("")}
  };
  const start=()=>{setScore(0);setSeconds(20);setGhost(0);setStrawberryBursts([]);setPlaying(true)};
  const movePredator=(event:ReactPointerEvent<HTMLDivElement>)=>{const rect=event.currentTarget.getBoundingClientRect();setPredator({left:Math.max(0,Math.min(100,(event.clientX-rect.left)/rect.width*100)),top:Math.max(0,Math.min(100,(event.clientY-rect.top)/rect.height*100))})};
  const catchGhost=()=>{
    if(!playing)return;
    const target=ghosts[ghost],id=Date.now();
    setScore(value=>value+1);setAttacking(true);setStrawberryBursts(value=>[...value,{id,left:target.left,top:target.top}]);
    window.setTimeout(()=>setAttacking(false),260);
    window.setTimeout(()=>setStrawberryBursts(value=>value.filter(burst=>burst.id!==id)),1100);
    setGhost(value=>(value+3)%ghosts.length);
  };
  const placeItem=(name:string,next:ItemPlacement)=>setPlacements(current=>({...current,[name]:next}));
  const openDesktopItem=(item:DesktopItem)=>{
    if(item.name===ghostAppItem.name){setAppOpen(true);return}
    if(item.name==="小甜糕不要看"&&!privateFolderUnlocked){setLockedFolder(item);setFolderPassword("");setFolderPasswordError(false);return}
    if(selected&&["小甜糕不要看","不要給鶕綾看到","小青整理好的_不要動"].includes(selected.name)&&!item.type.includes("資料夾")){
      setPreviewFile(item);
      return;
    }
    setSelected(item);
  };
  const unlockPrivateFolder=()=>{if(folderPassword==="0828"){setPrivateFolderUnlocked(true);setSelected(lockedFolder);setLockedFolder(null);setFolderPassword("");setFolderPasswordError(false)}else{setFolderPassword("");setFolderPasswordError(true)}};
  const renderFilePreview=(item:DesktopItem)=>item.type==="PDF 文件"&&item.src?<div className="pdf-file-content"><div className="pdf-toolbar"><span>PDF 閱讀器</span><b>{item.name}</b><em>安全視窗模式</em></div><iframe className="pdf-viewer" title={item.name} src={`${item.src}#toolbar=0&navpanes=0&scrollbar=1&view=FitH`}/></div>:item.type==="Excel 試算表"&&item.src?<XlsxViewer name={item.name} src={item.src}/>:item.type==="Word 文件"&&item.src?<DocxViewer name={item.name} src={item.src}/>:item.type==="圖片"&&item.src?<ImageViewer name={item.name} src={item.src}/>:item.type==="文字文件"&&item.src?<TextViewer name={item.name} src={item.src}/>:item.type==="影片"&&item.src?<VideoViewer name={item.name} src={item.src}/>:item.type==="瀏覽器捷徑"&&item.src?<WebShortcutViewer name={item.name} src={item.src}/>:<div className="file-content"><i>{item.icon}</i><small>{item.type}</small><h2>{item.name}</h2><p>{item.content}</p></div>;

  return <div className="computer-overlay" role="dialog" aria-modal="true" aria-label="辦公室電腦">
    <button className="computer-close computer-close-outside" onClick={onClose} aria-label="關閉電腦">×</button>
    <div className="monitor-frame">
      <div className="monitor-camera"/>
      <button className="computer-close-inside" onClick={onClose} aria-label="關閉電腦">×</button>
      {!unlocked?<div className="computer-login">
        <div className="login-avatar">午</div>
        <h2>午未</h2>
        <p>輸入密碼以登入辦公室電腦</p>
        <form onSubmit={event=>{event.preventDefault();login()}}>
          <input autoFocus type="password" inputMode="numeric" value={password} onChange={event=>{setPassword(event.target.value.replace(/\D/g,"").slice(0,10));setError(false)}} placeholder="密碼" aria-label="電腦密碼"/>
          <button type="submit" aria-label="登入">→</button>
        </form>
        <small className={error?"login-error":""}>{error?"密碼不正確":"密碼提示：齋堂電話"}</small>
      </div>:<div className="computer-desktop">
        <div className="desktop-topbar"><b>齋堂 OS</b><span className="connection-status">辦公室電腦　<i/><strong>已連線</strong></span></div>
        <DesktopWorkspace items={computerItems} placements={placements} onPlace={placeItem} onOpen={openDesktopItem}/>
        {notificationsOpen&&<div className="desktop-notifications">
          <div className="desktop-alert urgent"><b>會自己賺錢的金蟾（裘芨）</b><p>老闆，簽核。<br/>老闆？？<br/>我看到你在線上。<br/><strong>你他媽剛剛還按讚甜點店貼文。</strong></p></div>
          <div className="desktop-alert"><b>狗腿燈想升天（賀止損）</b><p>您的報帳再次退件。<br/><strong>退件原因：</strong>草莓大福不是驅魔耗材。</p></div>
          <div className="desktop-alert muted"><b>腎不好別縱慾（鶕綾）</b><p>陛下，今日尚有47份奏摺未處理。<br/><small>午未已將通知設為靜音。</small></p></div>
        </div>}
        <div className="desktop-taskbar"><button className="task-start">齋</button><span className="task-search">搜尋</span><div className="task-spacer"/><span className="task-clock">13:02<br/>2026/09/04</span><button className={`task-notification ${notificationsOpen?"active":""}`} onClick={()=>setNotificationsOpen(value=>!value)} aria-expanded={notificationsOpen} aria-label="通知"><i>♧</i><b>3</b></button></div>
        {selected&&<section ref={fileWindow.windowProps.ref} style={fileWindow.windowProps.style} className={`file-window ${fileWindow.windowProps.className}`}>
          <header {...fileWindow.moveProps}><div><i>{selected.icon}</i><b>{selected.name}</b><small className="window-drag-label">拖曳移動</small></div><button onClick={()=>{setSelected(null);setPreviewFile(null)}} aria-label="關閉檔案">×</button></header>
          <div className="file-toolbar"><span>檔案</span><span>常用</span><span>檢視</span></div>
          {petitionFolders[selected.name]?<PetitionExplorer folder={petitionFolders[selected.name]} items={computerItems} placements={placements} onPlace={placeItem} onOpen={openDesktopItem}/>:selected.type.includes("資料夾")?<FolderContents folder={selected} items={computerItems} placements={placements} onPlace={placeItem} onOpen={openDesktopItem}/>:renderFilePreview(selected)}
          <i className="window-resize-handle" {...fileWindow.resizeProps} aria-label="調整視窗大小"/>
        </section>}
        {previewFile&&<section ref={previewWindow.windowProps.ref} style={previewWindow.windowProps.style} className={`file-window child-file-window ${previewWindow.windowProps.className}`}>
          <header {...previewWindow.moveProps}><div><i>{previewFile.icon}</i><b>{previewFile.name}</b><small className="window-drag-label">拖曳移動</small></div><button onClick={()=>setPreviewFile(null)} aria-label="關閉預覽">×</button></header>
          <div className="file-toolbar"><span>檔案</span><span>檢視</span><strong>假電腦視窗</strong></div>
          {renderFilePreview(previewFile)}
          <i className="window-resize-handle" {...previewWindow.resizeProps} aria-label="調整視窗大小"/>
        </section>}
        {appOpen&&<section ref={gameWindow.windowProps.ref} style={gameWindow.windowProps.style} className={`ghost-game-window ${gameWindow.windowProps.className}`}>
          <header {...gameWindow.moveProps}><b>齋堂抓鬼魂</b><small className="window-drag-label">拖曳移動</small><button onClick={()=>{setAppOpen(false);setPlaying(false)}} aria-label="關閉遊戲">×</button></header>
          <div className="game-stats"><span>得分 <b>{score}</b></span><span>剩餘 <b>{seconds}s</b></span></div>
          <div className={`haunted-room ${playing?"is-playing":""}`} onPointerMove={movePredator}>
            {!playing&&<div className="game-start"><b>{seconds===0?`時間到！抓到 ${score} 隻鬼魂` : "天庭的囚犯鬼逃脫了"}</b><p>在鬼魂逃走前點擊牠，20 秒內抓得越多越好。</p><button onClick={start}>{seconds===0?"再玩一次":"開始抓鬼"}</button></div>}
            {playing&&<button className="target-ghost" style={{left:`${ghosts[ghost].left}%`,top:`${ghosts[ghost].top}%`}} onClick={catchGhost} aria-label="抓住鬼魂"><i>👻</i><span>抓我</span></button>}
            {strawberryBursts.map(burst=><div key={burst.id} className="strawberry-burst" style={{left:`${burst.left}%`,top:`${burst.top}%`}} aria-hidden="true"><i>🍓</i><i>🍓</i><i>🍓</i><i>🍓</i><i>🍓</i><b>消滅！</b></div>)}
            {playing&&<img className={`ghost-predator ${attacking?"attacking":""}`} src="/game/animal.png" alt="追捕鬼魂的饕餮" style={{left:`${predator.left}%`,top:`${predator.top}%`}} draggable={false}/>} 
          </div>
          <footer>移動滑鼠控制饕餮，點擊鬼魂將牠消滅；每消滅一隻就會掉落草莓。</footer>
          <i className="window-resize-handle" {...gameWindow.resizeProps} aria-label="調整視窗大小"/>
        </section>}
        {lockedFolder&&<div className="folder-password-overlay" role="dialog" aria-modal="true" aria-label="輸入資料夾密碼"><form onSubmit={event=>{event.preventDefault();unlockPrivateFolder()}}><i>🔒</i><b>小甜糕不要看</b><p>這個資料夾受到密碼保護</p><input autoFocus type="password" inputMode="numeric" maxLength={4} value={folderPassword} onChange={event=>{setFolderPassword(event.target.value.replace(/\D/g,"").slice(0,4));setFolderPasswordError(false)}} placeholder="輸入 4 位數密碼" aria-label="資料夾密碼"/><small>{folderPasswordError?"密碼錯誤":"提示：小甜糕的生日"}</small><div><button type="button" onClick={()=>setLockedFolder(null)}>取消</button><button type="submit">解鎖</button></div></form></div>}
      </div>}
    </div>
    <div className="monitor-stand"/>
  </div>;
}
