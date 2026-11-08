import * as T from 'three';
import {chapterAt, chapterStarts, journeyDistance} from './journey';
import {createTVDemo} from './tv-demo';
import {detailCRT} from './crt-detail';
import {RoomEnvironment} from 'three/examples/jsm/environments/RoomEnvironment.js';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
export function mountCRT(
 host:HTMLElement,
 section:HTMLElement,
 onProgress:(p:number)=>void,
 onReady:()=>void,
 onError:()=>void,
){
 const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;host.appendChild(renderer.domElement);
 const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,1,.05,100),root=new T.Group();scene.add(root);const room=new RoomEnvironment();const pmrem=new T.PMREMGenerator(renderer);const environment=pmrem.fromScene(room,.04);scene.environment=environment.texture;room.dispose();pmrem.dispose();scene.environmentIntensity=.45;scene.add(new T.HemisphereLight(0xe7dfc7,0x31382b,1.4));const key=new T.DirectionalLight(0xffe6c2,2.6);key.position.set(-3,6,8);scene.add(key);const rim=new T.DirectionalLight(0x9caf91,3);rim.position.set(4,2,-5);scene.add(rim);
 const cream=new T.MeshStandardMaterial({color:0xb6aa8e,roughness:.72}),edge=new T.MeshStandardMaterial({color:0x746e5e,roughness:.65}),black=new T.MeshStandardMaterial({color:0x172016,roughness:.5}),copper=new T.MeshStandardMaterial({color:0xa86b39,metalness:.75,roughness:.3}),metal=new T.MeshStandardMaterial({color:0x8b8e7f,metalness:.8,roughness:.32});
 function box(w:number,h:number,d:number,mat:T.Material,parent:T.Object3D,x=0,y=0,z=0,r=.04){const m=new T.Mesh(new RoundedBoxGeometry(w,h,d,3,r),mat);m.position.set(x,y,z);parent.add(m);return m}
 const casing=new T.Group(),front=new T.Group(),glassGroup=new T.Group(),phosphor=new T.Group(),tube=new T.Group(),board=new T.Group();root.add(casing,front,glassGroup,phosphor,tube,board);
 // The casing is hollow: four separate panels reveal the actual internal model.
 box(3.55,.22,2.6,cream,casing,0,1.38,-.55);box(3.55,.22,2.6,cream,casing,0,-1.38,-.55);box(.22,2.6,2.6,cream,casing,-1.68,0,-.55);box(.22,2.6,2.6,cream,casing,1.68,0,-.55);box(3.2,2.5,.18,edge,casing,0,0,-1.88);
 for(let i=0;i<16;i++){box(.025,.55,1.1,black,casing,1.8,.4,-.7+i*.068,.008);box(.035,.018,.8,black,casing,-.8+i*.11,1.5,-.7,.006)}
 box(3.55,.32,.35,cream,front,0,1.35,.89);box(3.55,.48,.35,cream,front,0,-1.27,.89);box(.32,2.65,.35,cream,front,-1.64,0,.89);box(.32,2.65,.35,cream,front,1.64,0,.89);box(3,.13,.2,edge,front,0,1.15,1);box(.1,2.2,.2,edge,front,-1.45,0,1);box(.1,2.2,.2,edge,front,1.45,0,1);
 box(.64,.055,.025,black,front,-.92,-1.25,1.09,.008);for(let i=0;i<10;i++)box(.2,.025,.02,edge,front,.1,-1.13-i*.025,1.08,.004);
 const power=new T.Mesh(new T.CylinderGeometry(.085,.085,.04,24),edge);power.rotation.x=Math.PI/2;power.position.set(1.18,-1.25,1.1);front.add(power);const led=new T.Mesh(new T.SphereGeometry(.025,8,8),new T.MeshBasicMaterial({color:0xe3b574}));led.position.set(.98,-1.25,1.11);front.add(led);box(1.35,.16,.95,edge,casing,0,-1.61,-.2);
 const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=768;const ctx=canvas.getContext('2d')!;ctx.fillStyle='#18201a';ctx.fillRect(0,0,1024,768);const glow=ctx.createRadialGradient(500,340,5,500,340,650);glow.addColorStop(0,'#35412b');glow.addColorStop(1,'#111a16');ctx.fillStyle=glow;ctx.fillRect(0,0,1024,768);ctx.textAlign='center';ctx.shadowColor='#f1b96a';ctx.shadowBlur=20;ctx.fillStyle='#e9bc78';ctx.font='64px monospace';ctx.fillText('Pratyush.',512,350);ctx.shadowBlur=5;ctx.font='19px monospace';ctx.fillText('I build things to understand them.',512,405);ctx.font='13px monospace';ctx.fillStyle='#a58f62';ctx.fillText('CODE / DATA / PHOTOGRAPHS',512,580);ctx.fillText('P—01     •     EXPLORATIONS SINCE 2020',512,140);ctx.shadowBlur=0;for(let y=0;y<768;y+=4){ctx.fillStyle='#00000022';ctx.fillRect(0,y,1024,1)}const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;const tvDemo=createTVDemo(canvas);
 const screenMat=new T.MeshStandardMaterial({map:texture,emissiveMap:texture,emissive:0xffffff,emissiveIntensity:.5,roughness:.28,metalness:.05});const geo=new T.PlaneGeometry(2.76,2.04,40,30);const pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,.085*Math.max(0,1-(x/1.38)**2)*Math.max(0,1-(y/1.02)**2))}geo.computeVertexNormals();const screen=new T.Mesh(geo,screenMat);screen.position.z=1.132;glassGroup.add(screen);
 box(2.85,2.15,.1,new T.MeshPhysicalMaterial({color:0xadc1a9,transparent:true,opacity:.13,roughness:.15,metalness:.1,side:T.DoubleSide}),glassGroup,0,0,1.06,.12);
 const layer=box(2.79,2.08,.025,new T.MeshStandardMaterial({color:0x8eae7a,transparent:true,opacity:.2,wireframe:true}),phosphor,0,0,.88);
 const beamGroup=new T.Group();tube.add(beamGroup);const beamMat=new T.MeshBasicMaterial({color:0xffc87f,transparent:true,opacity:.85});const beam=new T.Mesh(new T.CylinderGeometry(.009,.009,2.5,8),beamMat);beam.rotation.x=Math.PI/2;beam.position.z=-.35;beamGroup.add(beam);for(let i=0;i<5;i++){const g=new T.Mesh(new T.CylinderGeometry(.018+i*.014,.018+i*.014,2.5,8),new T.MeshBasicMaterial({color:0xeaa76b,transparent:true,opacity:.035,depthWrite:false,blending:T.AdditiveBlending}));g.rotation.x=Math.PI/2;g.position.z=-.35;beamGroup.add(g)}const bead=new T.Mesh(new T.SphereGeometry(.035,12,12),new T.MeshBasicMaterial({color:0xffe5ac}));beamGroup.add(bead);
 box(2.75,.055,2.05,new T.MeshStandardMaterial({color:0x344b2b,roughness:.8}),board,0,-1.12,-.45,.02);for(let i=0;i<16;i++){const x=-1.2+(i%4)*.65,z=-1.25+Math.floor(i/4)*.5;box(.28,.12,.2,black,board,x,-1.03,z,.01);for(let j=0;j<4;j++)box(.015,.025,.32,metal,board,x-.12+j*.08,-1.1,z,.001);const cap=new T.Mesh(new T.CylinderGeometry(.065,.065,.2,12),i%2?copper:metal);cap.position.set(x+.22,-.98,z+.18);board.add(cap);const path=new T.BufferGeometry().setFromPoints([new T.Vector3(x,-1.08,z),new T.Vector3(x+.3,-1.08,z),new T.Vector3(x+.3,-1.08,z+.3)]);board.add(new T.Line(path,new T.LineBasicMaterial({color:0xa49551})))}
 const detail=detailCRT({casing,front,glass:glassGroup,tube,board});
 const shellMaterials:T.MeshStandardMaterial[]=[];casing.traverse(o=>{if(o instanceof T.Mesh){o.material=o.material.clone();o.material.transparent=true;shellMaterials.push(o.material)}});
 const raycaster=new T.Raycaster(),mouse=new T.Vector2();const targets=[...detail.branches.map(b=>({obj:b.group,id:b.id})),{obj:beamGroup,id:'samerow'},{obj:layer,id:'predictors'},{obj:board,id:'gharlabs'}];const click=(e:MouseEvent)=>{const r=host.getBoundingClientRect();mouse.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);raycaster.setFromCamera(mouse,camera);const hit=raycaster.intersectObject(screen)[0];if(hit?.uv&&tvDemo.hitTest(hit.uv.x,hit.uv.y)){dirty=true;return;}for(const t of targets)if(t.obj.visible&&raycaster.intersectObject(t.obj,true).length){document.getElementById(t.id)?.scrollIntoView({behavior:'smooth'});break}};renderer.domElement.addEventListener('click',click);
 const {clamp, lerp, smoothstep: smooth} = T.MathUtils;
 const reduced = matchMedia('(prefers-reduced-motion: reduce)');
 const branchChapters = [2, 3, 5];
 let hasRendered = false, disposed = false;
 let raf = 0, dirty = true, needsMeasurement = true;
 let target = 0, progress = 0, publishedProgress = -1, previousTime = 0;
 let visible = true;
 let width = 0;

 function invalidateScroll() {
  needsMeasurement = true;
  dirty = true;
 }
 function invalidateScene() { dirty = true; }
 function resize() {
  width = host.clientWidth;
  const height = host.clientHeight;
  renderer.setSize(width, height);
  camera.aspect = width / Math.max(1, height);
  camera.updateProjectionMatrix();
  invalidateScroll();
 }
 const resizeObserver = new ResizeObserver(resize);
 resizeObserver.observe(host);
 resize();
 window.addEventListener('scroll', invalidateScroll, {passive:true});
 document.addEventListener('visibilitychange', invalidateScroll);
 window.addEventListener('motionchange', invalidateScene);
 reduced.addEventListener('change', invalidateScene);
 window.addEventListener('tv-demo', invalidateScene);

 function render(time: number) {
  raf = requestAnimationFrame(render);
  if (document.hidden) return;

  // Read layout only when scrolling or resizing, and follow the same distance as the chapter rail.
  if (needsMeasurement) {
   const bounds = section.getBoundingClientRect();
   visible = bounds.bottom > 0 && bounds.top < window.innerHeight;
   target = clamp(-bounds.top / journeyDistance(section, host), 0, 1);
   if (!hasRendered || !visible) progress = target;
   needsMeasurement = false;
  }
  if (!visible && hasRendered) return;

  const paused = document.documentElement.dataset.motion === 'paused' || reduced.matches;
  const delta = Math.min(32, time - previousTime);
  previousTime = time;
  const moving = progress !== target;
  // Take the edge off wheel steps without waiting for a full animation to finish.
  progress = paused || Math.abs(target - progress) < .00025
   ? target
   : lerp(progress, target, 1 - Math.exp(-delta / 48));
  if (progress !== publishedProgress) {
   onProgress(progress);
   publishedProgress = progress;
  }

  const p = progress;
  const chapter = chapterAt(p);
  const animating = !paused && (chapter === 0 ? tvDemo.needsOpeningFrame(time) : chapter >= 2 && p < .96);
  if (!dirty && !moving && !animating) return;
  dirty = false;

  const mobile = width < 800;
  // Overlap the camera moves so each part starts responding before the next chapter opens.
  const open = .3 * clamp(p / .36, 0, 1) + .7 * smooth(p, 0, .36);
  const inside = smooth(p, .28, .73);
  const exit = smooth(p, .75, 1);
  const sameRowFocus = smooth(p, .26, .42) * (1 - smooth(p, .47, .65));
  const networkFocus = smooth(p, .60, .75) * (1 - smooth(p, .79, .91));
  const tvFocus = Math.max(sameRowFocus, networkFocus);

  casing.position.set(2*open, 4*open, -1.4*open);
  shellMaterials.forEach(material => material.opacity = 1 - smooth(p, .2, .38));
  casing.visible = p < .38;
  casing.rotation.z = -.08*open;
  front.position.set(-3.6*open, 0, open*.7);
  glassGroup.position.set(-2.3*open, 0, open*1.4);
  phosphor.position.z = open*.65;
  board.position.y = -.6*open;
  root.rotation.set(.04+open*.07, -.12-open*.25-inside*.2, 0);
  root.position.set(mobile ? 0 : 1.25, mobile ? lerp(-.9, -1.35, inside) : 0, 0);
  root.scale.setScalar(mobile ? lerp(.82, .68, open) : 1);

  camera.position.set(.7, .45, mobile ? 10.2 : 9)
   .lerp(new T.Vector3(7, 1.5, 5.5), open)
   .lerp(new T.Vector3(5, 1.4, -6.7), inside)
   .lerp(new T.Vector3(4.6, 4.5, 5.6), exit);
  const look = new T.Vector3(mobile ? 0 : .65, mobile ? -.25 : 0, lerp(0, -.65, inside));

  // Bring the faceplate forward for each interactive screen chapter.
  camera.position.lerp(new T.Vector3(mobile ? .3 : 1.5, .2, mobile ? 9.8 : 8.5), tvFocus);
  root.rotation.y = lerp(root.rotation.y, -.06, tvFocus);
  root.rotation.x = lerp(root.rotation.x, 0, tvFocus);
  root.scale.setScalar(lerp(root.scale.x, mobile ? .82 : 1, tvFocus));
  root.position.y = lerp(root.position.y, mobile ? -1.1 : 0, tvFocus);
  front.position.lerp(new T.Vector3(0, 0, 1), tvFocus);
  glassGroup.position.lerp(new T.Vector3(0, 0, 1), tvFocus);
  look.lerp(new T.Vector3(mobile ? 0 : .55, mobile ? -.15 : 0, .4), tvFocus);

  // Move into the circuit board gradually as the screen chapter ends.
  const labFocus = smooth(p, .79, .94);
  tube.position.y = 3.8 * labFocus;
  front.position.y = 5 * labFocus;
  glassGroup.position.y = 5 * labFocus;
  phosphor.position.y = 5 * labFocus;
  root.updateMatrixWorld(true);
  const chipTarget = detail.storage.getWorldPosition(new T.Vector3());
  camera.position.lerp(chipTarget.clone().add(new T.Vector3(mobile ? 1 : 1.6, mobile ? 2.4 : 2.5, mobile ? 2.8 : 2.6)), labFocus);
  look.lerp(chipTarget.clone().add(new T.Vector3(mobile ? 0 : -.7, mobile ? .75 : 0, 0)), labFocus);

  const transistorFocus = smooth(p, .88, 1);
  const transistorTarget = detail.storage.localToWorld(new T.Vector3(-.08, .28, .26));
  camera.position.lerp(transistorTarget.clone().add(new T.Vector3(mobile ? .65 : .85, mobile ? 1.35 : 1.2, mobile ? 1.8 : 1.5)), transistorFocus);
  look.lerp(transistorTarget.clone().add(new T.Vector3(mobile ? 0 : -.28, mobile ? .28 : 0, 0)), transistorFocus);
  detail.focusMaterial.emissiveIntensity = labFocus*.06 + transistorFocus*.08;
  detail.updateLeads();
  camera.lookAt(look);

  if (tvDemo.draw(time, chapter === 2 || chapter === 0, paused, chapter === 0, chapter === 4)) texture.needsUpdate = true;
  bead.position.z = .8 - ((time*.0006) % 1)*2.5;
  beamGroup.visible = p > .16;
  screenMat.transparent = true;
  screenMat.opacity = lerp(1 - smooth(p, .25, .44)*.88, 1, tvFocus);
  detail.branches.forEach((branch, i) => {
   const start = chapterStarts[branchChapters[i]];
   const growth = smooth(p, start, start + .07);
   branch.group.visible = chapter === branchChapters[i] && growth > 0;
   if (!branch.group.visible) return;
   const length = 2.4 * growth;
   for (const mesh of [branch.core, ...branch.halos]) {
    mesh.scale.y = length;
    mesh.position.x = -length/2;
   }
   branch.point.position.x = -length;
   branch.spark.scale.setScalar(.16 + .22*(1 - growth));
   branch.spark.material.opacity = .8;
   branch.pulse.position.x = -length * ((time*.0007) % 1);
   branch.sprite.position.set(-length - .25, .23, 0);
   branch.sprite.material.opacity = growth;
  });
  renderer.render(scene, camera);
  if (!hasRendered) {
   hasRendered = true;
   onReady();
  }
 }

 function dispose(){
  if(disposed)return;
  disposed=true;
  cancelAnimationFrame(raf);tvDemo.dispose();resizeObserver.disconnect();window.removeEventListener('scroll',invalidateScroll);document.removeEventListener('visibilitychange',invalidateScroll);window.removeEventListener('motionchange',invalidateScene);reduced.removeEventListener('change',invalidateScene);window.removeEventListener('tv-demo',invalidateScene);renderer.domElement.removeEventListener('click',click);scene.traverse(o=>{if(o instanceof T.Mesh||o instanceof T.Line){o.geometry.dispose();const mats=Array.isArray(o.material)?o.material:[o.material];mats.forEach(m=>m.dispose())}});detail.textures.forEach(t=>t.dispose());environment.dispose();texture.dispose();renderer.dispose();renderer.domElement.remove();
 }

 raf=requestAnimationFrame(time=>{
  try{render(time)}catch{
   dispose();
   onError();
  }
 });
 return dispose;
}
