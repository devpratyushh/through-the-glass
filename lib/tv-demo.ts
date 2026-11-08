import {createIntroSignal} from './intro-signal';
import {transactionNodes as nodes,transactionEdges as edges,transactionCycle as cycle,screenPoint} from './transaction-graph';
/** Tiny procedural film: one shared clock with an adjustable peer delay. */
export function createTVDemo(canvas:HTMLCanvasElement){
 const ctx=canvas.getContext('2d')!;
 const intro=createIntroSignal(canvas,ctx);
 let introFrame=0;
 let channel='home';let account='A03',circular=false,graphActive=false;let playing=true,delay=7,targetDelay=7,clock=18,last=0,lastPaint=0,wasActive=false;
 const command=(event:Event)=>{const d=(event as CustomEvent<{action:string;value?:number;text?:string}>).detail;lastPaint=0;if(d.action==='graph'){account=d.text??'A03';circular=d.value===1;}if(d.action==='channel')channel=d.text??'home';if(d.action==='delay')delay=targetDelay=d.value??7;if(d.action==='sync')targetDelay=0;if(d.action==='play')playing=!!d.value};window.addEventListener('tv-demo',command);window.dispatchEvent(new Event('tv-ready'));
 function film(x:number,y:number,w:number,h:number,time:number){
  ctx.save();ctx.beginPath();ctx.rect(x,y,w,h);ctx.clip();const sky=ctx.createLinearGradient(0,y,0,y+h);sky.addColorStop(0,'#302d39');sky.addColorStop(.6,'#ae744e');sky.addColorStop(1,'#dba76d');ctx.fillStyle=sky;ctx.fillRect(x,y,w,h);ctx.fillStyle='#efc888';ctx.beginPath();ctx.arc(x+w*.72,y+h*.32,w*.065,0,Math.PI*2);ctx.fill();
  for(let layer=0;layer<4;layer++){ctx.fillStyle=['#79634e','#525746','#334335','#1e3028'][layer];ctx.beginPath();ctx.moveTo(x,y+h);for(let i=0;i<=w;i+=4){const phase=i*.014+time*(.12+layer*.09);const yy=y+h*(.48+layer*.12)+Math.sin(phase)*h*.08+Math.sin(phase*2.3)*h*.04;ctx.lineTo(x+i,yy)}ctx.lineTo(x+w,y+h);ctx.fill()}
  // Window dividers passing in front of the landscape make time offsets visible.
  const shift=(time*21)%(w+100);ctx.fillStyle='#111d18';ctx.fillRect(x+shift-25,y,9,h);ctx.fillRect(x,y+h-12,w,12);ctx.fillStyle='#e1cf9d';ctx.font='12px monospace';ctx.textAlign='left';ctx.fillText('THE LONG WAY HOME',x+16,y+h-23);ctx.restore();
 }
 function graph(t:number,reduced:boolean){
  ctx.fillStyle='#10221c';ctx.fillRect(0,0,1024,768);ctx.textAlign='left';ctx.fillStyle='#e6c28b';ctx.font='36px monospace';ctx.fillText('FOLLOW THE CONNECTIONS',55,78);ctx.font='16px monospace';ctx.fillStyle='#9bad91';ctx.fillText('TRANSACTION STUDY / LINEMVNGNN',55,113);ctx.textAlign='right';ctx.fillText('SYNTHETIC DATA',968,113);
  ctx.strokeStyle='#385345';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(55,145);ctx.lineTo(969,145);ctx.stroke();
  edges.forEach(([a,b],i)=>{const from=screenPoint(nodes.find(n=>n.id===a)!),to=screenPoint(nodes.find(n=>n.id===b)!);const lit=circular?cycle.includes(a)&&cycle.includes(b):a===account||b===account;ctx.strokeStyle=lit?'#dcb77b':'#385345';ctx.lineWidth=lit?2.5:1;ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);ctx.stroke();if(lit){const progress=reduced?.5:((t*.00025+i*.17)%1);ctx.fillStyle='#f4dbae';ctx.shadowColor='#e6ba73';ctx.shadowBlur=12;ctx.beginPath();ctx.arc(from.x+(to.x-from.x)*progress,from.y+(to.y-from.y)*progress,4,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;const angle=Math.atan2(to.y-from.y,to.x-from.x),x=from.x+(to.x-from.x)*.7,y=from.y+(to.y-from.y)*.7;ctx.beginPath();ctx.moveTo(x-10*Math.cos(angle-.45),y-10*Math.sin(angle-.45));ctx.lineTo(x,y);ctx.lineTo(x-10*Math.cos(angle+.45),y-10*Math.sin(angle+.45));ctx.stroke();}});
  nodes.forEach(n=>{const p=screenPoint(n),lit=circular?cycle.includes(n.id):n.id===account;ctx.fillStyle=lit?'#e1bc7f':'#1e382c';ctx.strokeStyle=lit?'#ffe0a5':'#9aad8d';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,lit?15:11,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.textAlign='center';ctx.fillStyle=lit?'#f5d49c':'#bbc4a3';ctx.font='20px monospace';ctx.fillText(n.id,p.x,p.y+39);});
  ctx.fillStyle='#1b3428';ctx.fillRect(55,618,914,82);ctx.textAlign='left';ctx.fillStyle='#e5c391';ctx.font='23px monospace';ctx.fillText(circular?'A03 → A05 → A07 → A03':account+' / '+edges.filter(e=>e.includes(account)).length+' CONNECTED ACCOUNTS',78,650);ctx.font='15px monospace';ctx.fillStyle='#acbd9d';ctx.fillText(circular?'CIRCULAR ROUTE / A PATTERN TO INVESTIGATE':'SELECT AN ACCOUNT TO FOLLOW ITS TRANSACTIONS',78,680);ctx.textAlign='center';ctx.font='13px monospace';ctx.fillStyle='#91a58a';ctx.fillText('ILLUSTRATIVE NETWORK · PROJECT IN DEVELOPMENT',512,735);for(let y=0;y<768;y+=4){ctx.fillStyle='#00000018';ctx.fillRect(0,y,1024,1)}
 }
 function hitTest(u:number,v:number){
  if(!graphActive)return false;
  const x=u*1024,y=(1-v)*768;
  const node=nodes.find(n=>{const p=screenPoint(n);return Math.hypot(p.x-x,p.y-y)<50});
  if(node)window.dispatchEvent(new CustomEvent('tv-account',{detail:node.id}));
  return true;
 }
 function draw(t:number,active:boolean,reduced:boolean,opening=false,network=false){
  graphActive=network;
  if(opening&&channel==='home'){
   last=t;
   const frame=intro.frameAt(t,reduced);
   if(frame===introFrame&&!wasActive)return false;
   intro.paint(frame);
   introFrame=frame;
   wasActive=false;
   return true;
  }

  intro.reset();
  if(network){
   if(t-lastPaint<40&&wasActive&&!reduced)return false;
   graph(t,reduced);lastPaint=t;last=t;wasActive=true;return true;
  }
  const dt=Math.min(.05,Math.max(0,(t-last)/1000));
  if(!active){
   last=t;
   if(!wasActive&&introFrame===0)return false;
   intro.paint(0);
   introFrame=0;
   wasActive=false;
   return true;
  }
  if(t-lastPaint<50&&wasActive&&!reduced)return false;
  last=t;lastPaint=t;wasActive=true;
  if(playing&&!reduced)clock+=dt;
  delay=reduced?targetDelay:delay+(targetDelay-delay)*(1-Math.exp(-dt*14));
  if(Math.abs(delay-targetDelay)<.03)delay=targetDelay;
 ctx.fillStyle='#101d17';ctx.fillRect(0,0,1024,768);ctx.textAlign='left';ctx.fillStyle='#f0c787';ctx.font='44px monospace';ctx.fillText('SameRow',62,102);ctx.fillStyle='#9eae8c';ctx.font='15px monospace';ctx.fillText('TWO SCREENS. ONE MOMENT.',65,140);ctx.textAlign='right';ctx.fillStyle=delay===0?'#b7d59c':'#ddab70';ctx.font='17px monospace';ctx.fillText(delay===0?'● IN SYNC':'○ OUT OF SYNC',959,102);
 [clock,clock-delay].forEach((time,i)=>{const x=62+i*462;ctx.textAlign='left';ctx.fillStyle='#e8ce9f';ctx.font='20px monospace';ctx.fillText(i?'FRIEND':'YOU',x,207);film(x,230,437,285,time);const phase=((time%60)+60)%60/60;ctx.fillStyle='#3a4936';ctx.fillRect(x,547,437,4);ctx.fillStyle='#e8bc77';ctx.fillRect(x,547,437*phase,4);ctx.beginPath();ctx.arc(x+437*phase,549,6,0,Math.PI*2);ctx.fill();ctx.font='15px monospace';ctx.fillStyle='#a6b292';ctx.fillText((playing?'▶ ':'Ⅱ ')+'00:'+String(Math.floor(((time%60)+60)%60)).padStart(2,'0'),x,585)});
 ctx.textAlign='center';ctx.fillStyle=delay===0?'#bbd7a3':'#d8aa73';ctx.font='24px monospace';ctx.fillText(delay===0?'You’re in the same moment.':delay.toFixed(1)+' seconds apart.',512,650);ctx.font='13px monospace';ctx.fillStyle='#829477';ctx.fillText('INTERACTIVE PLAYBACK STUDY / LOCAL DEMO',512,709);for(let y=0;y<768;y+=4){ctx.fillStyle='#00000020';ctx.fillRect(0,y,1024,1)}return true;
 }
 return {
  draw,
  hitTest,
  needsOpeningFrame:(time:number)=>channel==='home'?intro.frameAt(time,false)!==introFrame:channel==='samerow'&&playing,
  dispose:()=>{
   intro.dispose();
   window.removeEventListener('tv-demo',command);
  },
 };
}
