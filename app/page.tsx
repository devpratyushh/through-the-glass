'use client';
import TransactionStudy from '../components/transaction-study';
import EarlyRemote from '../components/early-remote';
import Photography from '../components/photography';
import SelectedWork from '../components/selected-work';
import {chapterAt,chapterPositions,journeyDistance} from '../lib/journey';
import {useEffect,useRef,useState} from 'react';
const stops=[['The surface','Every image starts somewhere.'],['Beneath the glass','A little further in.'],['Signal & timing','Better, together.'],['Patterns in the noise','Follow the signal.'],['Across the traces','Connections tell a story.'],['The supporting cast','A place for everything.']];
export default function Home(){
 const stage=useRef<HTMLDivElement>(null),journey=useRef<HTMLElement>(null),progressBar=useRef<HTMLDivElement>(null); const [chapter,setChapter]=useState(0),[closeup,setCloseup]=useState(false),[paused,setPaused]=useState(false),[crtState,setCrtState]=useState<'loading'|'ready'|'unavailable'>('loading');
 useEffect(()=>{
  let dispose:(()=>void)|undefined;
  let cancelled=false;
  let visibleChapter=0;
  let visibleCloseup=false;
  const unavailable=()=>{
   if(!cancelled)setCrtState('unavailable');
  };
  import('../lib/crt').then(({mountCRT})=>{
   if(cancelled||!stage.current||!journey.current)return;
   dispose=mountCRT(stage.current,journey.current,(p)=>{
    if(progressBar.current)progressBar.current.style.transform=`scaleX(${p})`;
    const nextChapter=chapterAt(p);
    if(nextChapter!==visibleChapter){
     visibleChapter=nextChapter;
     setChapter(nextChapter);
    }
    const nextCloseup=p>.9;
    if(nextCloseup!==visibleCloseup){
     visibleCloseup=nextCloseup;
     setCloseup(nextCloseup);
    }
   },()=>{
    if(!cancelled)setCrtState('ready');
   },unavailable);
  }).catch(unavailable);
  return()=>{cancelled=true;dispose?.()};
 },[]);
 useEffect(()=>{document.documentElement.dataset.motion=paused?'paused':'on';window.dispatchEvent(new Event('motionchange'))},[paused]);
 return <main><header><a className="wordmark" href="#">p<span>.</span></a><a className="header-note" href="#about">PRATYUSH / PERSONAL EXPLORATIONS</a><nav><a href="#work">Work</a><a href="#photos">Photographs</a><a href="mailto:dev.pratyush@icloud.com">Say hello <span>↗</span></a></nav></header>
 <section className="journey" ref={journey} aria-label="Scroll through an exploded 3D cathode-ray television"><div className="sticky-scene" data-crt-state={crtState}>
 <div ref={stage} className="canvas-stage" aria-hidden="true"/>
 {crtState!=='ready'&&<div className="crt-placeholder">
  <div className="crt-placeholder-screen">
   <span className="crt-placeholder-name">Pratyush.</span>
   {crtState==='loading'
    ? <><span className="crt-placeholder-status" role="status">Tuning signal…</span><span className="crt-placeholder-track" aria-hidden="true"/></>
    : <span className="crt-placeholder-status">I build things to understand them.</span>}
  </div>
  <span className="crt-placeholder-led" aria-hidden="true"/>
 </div>}
 <div className="topline"><span>FIG. 01 — THROUGH THE GLASS</span><span>AN EXPLORATION IN SIX PARTS</span></div>
 <div className={'opening '+(chapter===0?'visible':'')}><p className="eyebrow">DEVELOPER. PHOTOGRAPHER. CURIOUS HUMAN.</p><h1>There’s more<br/>on the <em>inside.</em></h1><p>I’m Pratyush. I build real-time tools,<br/>look for patterns, and take the long way home.</p>{chapter===0&&<EarlyRemote/>}</div>
 {chapter>0&&<div className={"chapter-copy "+(chapter===2?"tv-chapter":chapter===4?"aml-chapter":"")} key={chapter}><span className="eyebrow">0{chapter+1} / {stops[chapter][0]}</span><h2>{chapter===5&&closeup?<>A home for<br/><em>what you keep.</em></>:stops[chapter][1]}</h2><p>{chapter===5&&closeup?'Films, files, and the services around them. Ghar Labs brings my media and self-hosted tools together on a server at home, with centralised volumes and private access.':['','The casing comes away. The glass, the phosphor, the tube. Things get interesting when you look beneath the surface.','Two people, one moment. SameRow explores the timing that makes watching together feel effortless.','A beam traces an image. A model traces a pattern. My prediction projects look for structure in messy admission data.','An anti-money-laundering app in development, exploring transaction relationships with LINEMVNGNN. Follow the transactions on the CRT. Select an account, then trace the circular route.','Every system needs a foundation. Transistors, capacitors, and copper traces keep this one running. Ghar Labs is my own exploration of the infrastructure behind the experience.'][chapter]}</p>{chapter===5&&closeup&&<div className="storage-note"><span>MEDIA LIBRARY</span><span>CENTRALISED VOLUMES</span><span>MY OWN SERVER</span></div>}{chapter===2&&<TVRemote/>}{chapter===4&&<TransactionStudy onScreen/>}{chapter>1&&<a className="text-link" href={'#'+['','','samerow','predictors','aml','gharlabs'][chapter]}>Explore {['','','SameRow V2','the predictors','the AML study','Ghar Labs'][chapter]} ↗</a>}</div>}
 <div className="scene-caption"><span className="cross">+</span><span>{chapter===5&&closeup?'Q2 / A CLOSER LOOK — GHAR LABS':['01 / THE OUTSIDE','02 / GLASS · PHOSPHOR · VACUUM','03 / ELECTRON GUN · DEFLECTION COILS','04 / A SIGNAL FINDS ITS SHAPE','05 / TRANSACTION GRAPH · IN DEVELOPMENT','06 / DISCRETE TRANSISTORS · CIRCUIT BOARD'][chapter]}</span></div>
 <div className="scene-bottom"><a href="#work" className="skip">Skip to the work ↗</a><div className="scroll-hint"><span>{chapter===5?'SCROLL CLOSER':'SCROLL TO LOOK INSIDE'}</span><i>↓</i></div><button onClick={()=>setPaused(!paused)} aria-pressed={paused}>{paused?'Resume motion':'Pause motion'} <span>{paused?'▷':'Ⅱ'}</span></button></div>
 <div className="rail" aria-label="Journey progress">{stops.map((s,i)=><button key={s[0]} aria-label={'Go to '+s[0]} aria-current={chapter===i?'step':undefined} onClick={()=>{if(journey.current&&stage.current)window.scrollTo({top:journey.current.getBoundingClientRect().top+window.scrollY+journeyDistance(journey.current,stage.current)*chapterPositions[i],behavior:paused||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}}><span>{String(i+1).padStart(2,'0')}</span><i className={chapter===i?'active':''}/></button>)}</div><div className="progress" ref={progressBar} aria-hidden="true"/></div></section>
 <SelectedWork/>
 <Photography/>
 <footer id="about"><div className="footer-top"><span className="eyebrow">BHILAI, INDIA / STILL FIGURING THINGS OUT</span><p>Building since 13. Currently studying Computer Science & Data Science at CSVTU. Interested in the parts you don’t see at first.</p></div><a className="hello" href="mailto:dev.pratyush@icloud.com">Have a curious idea?<br/><em>Let’s talk.</em> <span>↗</span></a><div className="footer-bottom"><span>PRATYUSH / BUILT WITH CURIOSITY</span><a href="https://github.com/devpratyushh" target="_blank" rel="noreferrer">GitHub ↗</a><a href="#">Back to the surface ↑</a></div></footer>
 </main>
}

function TVRemote(){const [delay,setDelay]=useState(7),[playing,setPlaying]=useState(true);function send(action:string,value?:number){window.dispatchEvent(new CustomEvent('tv-demo',{detail:{action,value}}))}useEffect(()=>{send('delay',7);send('play',1)},[]);return <div className="tv-remote"><span className="remote-label">TRY IT ON THE TV</span><div className="remote-buttons"><button onClick={()=>{send('sync');setDelay(0)}}>Sync screens ↔</button><button aria-label={playing?'Pause TV playback':'Play TV playback'} onClick={()=>{setPlaying(!playing);send('play',playing?0:1)}}>{playing?'Ⅱ Pause':'▷ Play'}</button></div><label>Friend’s delay <span>{delay}s</span><input type="range" min="0" max="12" step="1" value={delay} aria-label="TV friend delay in seconds" onChange={e=>{const n=+e.target.value;setDelay(n);send('delay',n)}}/></label><small aria-live="polite">{delay===0?'Same scene. Same moment.':'Move the slider, then bring them together.'}</small></div>}
