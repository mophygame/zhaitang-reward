"use client";

import { useRef, useState } from "react";

export function VideoViewer({name,src}:{name:string;src:string}){
  const videoRef=useRef<HTMLVideoElement>(null);
  const[playing,setPlaying]=useState(false);
  const[currentTime,setCurrentTime]=useState(0);
  const[duration,setDuration]=useState(0);
  const[volume,setVolume]=useState(1);
  const togglePlayback=async()=>{const video=videoRef.current;if(!video)return;if(video.paused)await video.play();else video.pause()};
  const formatTime=(value:number)=>{if(!Number.isFinite(value))return "0:00";return `${Math.floor(value/60)}:${Math.floor(value%60).toString().padStart(2,"0")}`};
  const enterFullscreen=()=>videoRef.current?.requestFullscreen?.();

  return <div className="video-viewer">
    <div className="video-viewer-toolbar"><span>齋堂影片播放器</span><b>{name}</b><em>{playing?"播放中":"已暫停"}</em></div>
    <div className="video-viewer-stage" onDoubleClick={enterFullscreen}><video ref={videoRef} src={src} playsInline preload="metadata" onClick={togglePlayback} onPlay={()=>setPlaying(true)} onPause={()=>setPlaying(false)} onEnded={()=>setPlaying(false)} onLoadedMetadata={event=>setDuration(event.currentTarget.duration)} onTimeUpdate={event=>setCurrentTime(event.currentTarget.currentTime)}>此瀏覽器無法播放影片。</video></div>
    <div className="video-controls">
      <button onClick={togglePlayback} aria-label={playing?"暫停":"播放"}>{playing?"❚❚":"▶"}</button><span>{formatTime(currentTime)}</span>
      <input className="video-progress" type="range" min="0" max={duration||0} step="0.05" value={Math.min(currentTime,duration||0)} onChange={event=>{const next=Number(event.target.value);if(videoRef.current)videoRef.current.currentTime=next;setCurrentTime(next)}} aria-label="影片進度"/>
      <span>{formatTime(duration)}</span><label>音量<input type="range" min="0" max="1" step="0.05" value={volume} onChange={event=>{const next=Number(event.target.value);setVolume(next);if(videoRef.current)videoRef.current.volume=next}} aria-label="音量"/></label><button onClick={enterFullscreen} aria-label="全螢幕">⛶</button>
    </div>
  </div>;
}
