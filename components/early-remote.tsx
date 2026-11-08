'use client';
import {useState,useEffect} from 'react';

export default function EarlyRemote(){
 const [channel,setChannel]=useState('home');
 useEffect(()=>{
  const sync=()=>window.dispatchEvent(new CustomEvent('tv-demo',{detail:{action:'channel',text:channel}}));
  sync();
  window.addEventListener('tv-ready',sync);
  return()=>window.removeEventListener('tv-ready',sync);
 },[channel]);
 useEffect(()=>()=>{window.dispatchEvent(new CustomEvent('tv-demo',{detail:{action:'channel',text:'home'}}))},[]);
 return <div className="early-remote">
  <span className="remote-label">TUNE IN</span>
  <div className="channel-buttons">
   {[['home','Introduction'],['samerow','SameRow']].map(([id,name])=><button key={id} aria-pressed={channel===id} onClick={()=>setChannel(id)}>{name}</button>)}
  </div>
  {channel==='samerow'&&<a href="#samerow" className="text-link">Explore SameRow V2 ↗</a>}
 </div>
}
