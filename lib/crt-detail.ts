import * as T from 'three';

type Parts={casing:T.Group;front:T.Group;glass:T.Group;tube:T.Group;board:T.Group};
/** Procedural detailing: no model or texture downloads. */
export function detailCRT(parts:Parts){
 const {casing,front,glass,tube,board}=parts;
 const copper=new T.MeshStandardMaterial({color:0xa25e32,metalness:.86,roughness:.27});
 const steel=new T.MeshStandardMaterial({color:0x85877e,metalness:.85,roughness:.25});
 const dark=new T.MeshStandardMaterial({color:0x272923,roughness:.6});
 const ceramic=new T.MeshStandardMaterial({color:0xcbbaa0,roughness:.65});
 const textures:T.Texture[]=[];
 function cylinder(radius:number,length:number,material:T.Material,parent:T.Object3D,x:number,y:number,z:number,axis='z'){
  const mesh=new T.Mesh(new T.CylinderGeometry(radius,radius,length,20),material);if(axis==='z')mesh.rotation.x=Math.PI/2;mesh.position.set(x,y,z);parent.add(mesh);return mesh;
 }
 function wire(points:T.Vector3[],radius:number,material:T.Material,parent:T.Object3D){const mesh=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),Math.max(20,points.length*3),radius,6,false),material);parent.add(mesh);return mesh;}
 function label(text:string,w:number,h:number,parent:T.Object3D,x:number,y:number,z:number){
  const c=document.createElement('canvas');c.width=512;c.height=128;const ctx=c.getContext('2d')!;ctx.fillStyle='#b7aa8e';ctx.fillRect(0,0,512,128);ctx.fillStyle='#3f3a2f';ctx.font='25px monospace';ctx.fillText(text,20,52);ctx.font='14px monospace';ctx.fillText('P / 01     •     THROUGH THE GLASS',20,91);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;textures.push(t);const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map:t,roughness:.8}));m.position.set(x,y,z);parent.add(m);
 }
 // Subtle moulded plastic grain, generated once with deterministic noise.
 const noise=document.createElement('canvas');noise.width=noise.height=128;const ctx=noise.getContext('2d')!;const data=ctx.createImageData(128,128);let seed=37;for(let i=0;i<data.data.length;i+=4){seed=(seed*16807)%2147483647;const v=145+seed%70;data.data.set([v,v,v,255],i)}ctx.putImageData(data,0,0);const bump=new T.CanvasTexture(noise);bump.wrapS=bump.wrapT=T.RepeatWrapping;bump.repeat.set(5,5);textures.push(bump);
 for(const group of [casing,front])group.traverse(o=>{if(o instanceof T.Mesh&&o.material instanceof T.MeshStandardMaterial){o.material.bumpMap=bump;o.material.bumpScale=.018;}});
 label('PRATYUSH / PERSONAL EXPLORATIONS',.95,.23,front,-.82,-1.26,1.085);
 for(const x of [-1.56,1.56])for(const y of [-1.12,1.2]){cylinder(.045,.018,steel,front,x,y,1.08);const slot=new T.Mesh(new T.BoxGeometry(.056,.008,.004),dark);slot.position.set(x,y,1.091);slot.rotation.z=.6;front.add(slot)}
 // A continuous inner rubber gasket removes the unfinished corner gaps.
 const gasketShape=new T.Shape();gasketShape.moveTo(-1.46,-1.12);gasketShape.lineTo(1.46,-1.12);gasketShape.lineTo(1.46,1.12);gasketShape.lineTo(-1.46,1.12);gasketShape.closePath();const hole=new T.Path();hole.moveTo(-1.38,-1.02);hole.lineTo(-1.38,1.02);hole.lineTo(1.38,1.02);hole.lineTo(1.38,-1.02);hole.closePath();gasketShape.holes.push(hole);const gasket=new T.Mesh(new T.ExtrudeGeometry(gasketShape,{depth:.055,bevelEnabled:true,bevelSize:.035,bevelThickness:.025,bevelSegments:3,steps:1}),dark);gasket.position.z=1.04;glass.add(gasket);
 // Rectangular bell converges to a circular glass neck, unlike a conical lampshade.
 const vertices:number[]=[],indices:number[]=[];const rings=32,segments=64;
 for(let j=0;j<=rings;j++){const t=j/rings,z=-1.75+t*2.57;const swell=T.MathUtils.smoothstep(t,.2,1),rx=.145+1.24*swell,ry=.145+.9*swell,n=2+3.5*swell;for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,c=Math.cos(a),s=Math.sin(a);vertices.push(Math.sign(c)*Math.pow(Math.abs(c),2/n)*rx,Math.sign(s)*Math.pow(Math.abs(s),2/n)*ry,z)}}
 for(let j=0;j<rings;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;indices.push(a,b,a+1,b,b+1,a+1)}
 const bell=new T.BufferGeometry();bell.setAttribute('position',new T.Float32BufferAttribute(vertices,3));bell.setIndex(indices);bell.computeVertexNormals();tube.add(new T.Mesh(bell,new T.MeshPhysicalMaterial({color:0xb2bbab,metalness:.24,roughness:.13,transparent:true,opacity:.22,side:T.DoubleSide,depthWrite:false,clearcoat:1})));
 // Sparse glass contour rings keep the silhouette legible without a wireframe cage.
 for(const t of [.27,.5,.73,1]){const row=Math.round(t*rings),p:T.Vector3[]=[];for(let i=0;i<=segments;i++){const k=(row*(segments+1)+i)*3;p.push(new T.Vector3(vertices[k],vertices[k+1],vertices[k+2]))}tube.add(new T.Line(new T.BufferGeometry().setFromPoints(p),new T.LineBasicMaterial({color:0xabb69e,transparent:true,opacity:.2})));}
 // Steel screen tension band follows the rectangular bell lip.
 const rimPoints:T.Vector3[]=[];for(let i=0;i<=segments;i++){const k=(rings*(segments+1)+i)*3;rimPoints.push(new T.Vector3(vertices[k]*1.015,vertices[k+1]*1.015,.8))}wire(rimPoints,.018,steel,tube);
 // Two tightly wound helical coils, insulation collars and neck electrodes.
 for(const z of [-1.05,-.5]){cylinder(.27,.09,dark,tube,0,0,z);const helix:T.Vector3[]=[];for(let i=0;i<=360;i++){const a=i/360*Math.PI*2*18;helix.push(new T.Vector3(.275*Math.cos(a),.275*Math.sin(a),z+.04+i/360*.45))}wire(helix,.012,copper,tube);}
 for(let i=0;i<6;i++){const z=-1.72+i*.115;cylinder(.105,.055,i%2?steel:ceramic,tube,0,0,z);for(let j=0;j<6;j++){const a=j/6*Math.PI*2;cylinder(.009,.7,steel,tube,.12*Math.cos(a),.12*Math.sin(a),-1.45)}}
 for(const x of [-.06,0,.06])cylinder(.012,.23,copper,tube,x,0,-1.95);
 // Insulated yoke leads and the red high-voltage lead to the bell.
 const sockets=[new T.Vector3(.5,-1.04,-.4),new T.Vector3(1.18,-1.04,-.85)];
 const leads=sockets.map((end,i)=>{const socket=new T.Mesh(new T.BoxGeometry(.16,.12,.14),ceramic);socket.position.copy(end);board.add(socket);cylinder(.04,.09,copper,board,end.x,end.y+.05,end.z,'y');const start=i?new T.Vector3(.05,.8,.3):new T.Vector3(.25,0,-.7);const mesh=wire([start,start.clone().add(new T.Vector3(.5,.3,0)),end],i?.027:.018,new T.MeshStandardMaterial({color:i?0x733c2d:0x9b783e,roughness:.7}),tube);return {mesh,start,end,i};});
 const cap=new T.Mesh(new T.SphereGeometry(.12,16,8),dark);cap.scale.set(1,.4,1);cap.position.set(.05,.8,.3);tube.add(cap);
 let lastCableKey='';
 function updateLeads(){const key=[board.position.y,tube.position.y].join(':');if(key===lastCableKey)return;lastCableKey=key;for(const lead of leads){const end=lead.end.clone().add(board.position).sub(tube.position);end.y+=.06;const path=new T.CatmullRomCurve3([lead.start,lead.start.clone().add(new T.Vector3(lead.i?.5:.4,lead.i?.28:-.15,-.15)),new T.Vector3(lead.i?1.5:.85,(lead.start.y+end.y)/2,end.z),end]);const geo=new T.TubeGeometry(path,36,lead.i?.027:.018,8,false);lead.mesh.geometry.dispose();lead.mesh.geometry=geo;}}
 // PCB solder pads, resistor banks, aluminium heat sink and wound transformer.
 const padGeo=new T.CylinderGeometry(.024,.024,.009,8),pads=new T.InstancedMesh(padGeo,steel,96),dummy=new T.Object3D();let k=0;for(let row=0;row<8;row++)for(let col=0;col<12;col++){dummy.position.set(-1.25+col*.22,-1.081,-1.35+row*.24);dummy.updateMatrix();pads.setMatrixAt(k++,dummy.matrix)}board.add(pads);
 for(let i=0;i<8;i++){const x=-1.1+i*.14;const r=cylinder(.035,.13,ceramic,board,x,-.99,.35);r.rotation.z=Math.PI/2;for(const y of [-.025,.025]){const band=new T.Mesh(new T.TorusGeometry(.036,.005,4,12),i%2?copper:dark);band.rotation.y=Math.PI/2;band.position.set(x+y,-.99,.35);board.add(band)}}
 for(let i=0;i<8;i++){const fin=new T.Mesh(new T.BoxGeometry(.024,.32,.4),steel);fin.position.set(.65+i*.06,-.92,-1.1);board.add(fin)}
 const trans=new T.Mesh(new T.BoxGeometry(.36,.28,.3),dark);trans.position.set(-.85,-.95,-1.1);board.add(trans);for(let i=0;i<13;i++){const winding=new T.Mesh(new T.TorusGeometry(.16,.009,5,20),copper);winding.rotation.y=Math.PI/2;winding.position.set(-1+i*.025,-.95,-1.1);board.add(winding)}
 // Discrete transistor stage integrated into the original CRT-era PCB.
 const storage=new T.Group();storage.position.set(.1,-1.08,-.05);board.add(storage);
 const focusMaterial=new T.MeshStandardMaterial({color:0x777c71,roughness:.3,metalness:.85,emissive:0xb88c4f,emissiveIntensity:0});
 for(let n=0;n<3;n++){const x=-.48+n*.4,z=-.02+(n%2)*.26;
  // Three bent metal leads terminate on solder pads below a metal TO-style can.
  for(let j=0;j<3;j++){const angle=j/3*Math.PI*2,dx=Math.cos(angle)*.055,dz=Math.sin(angle)*.055;wire([new T.Vector3(x+dx,.18,z+dz),new T.Vector3(x+dx,.075,z+dz),new T.Vector3(x+dx*1.7,.012,z+dz*1.7)],.009,steel,storage);cylinder(.025,.008,steel,storage,x+dx*1.7,.008,z+dz*1.7,'y');}
  cylinder(.105,.025,steel,storage,x,.19,z,'y');cylinder(.087,.14,focusMaterial,storage,x,.27,z,'y');cylinder(.084,.012,steel,storage,x,.344,z,'y');const tab=new T.Mesh(new T.BoxGeometry(.05,.016,.035),steel);tab.position.set(x+.1,.19,z);storage.add(tab);
  const c=document.createElement('canvas');c.width=128;c.height=128;const cx=c.getContext('2d')!;cx.fillStyle='#8d9387';cx.fillRect(0,0,128,128);cx.fillStyle='#32392f';cx.font='24px monospace';cx.textAlign='center';cx.fillText('Q'+(n+1),64,58);cx.font='15px monospace';cx.fillText('Si / NPN',64,85);const tex=new T.CanvasTexture(c);tex.colorSpace=T.SRGBColorSpace;textures.push(tex);const marking=new T.Mesh(new T.CircleGeometry(.079,24),new T.MeshStandardMaterial({map:tex,metalness:.5,roughness:.5}));marking.rotation.x=-Math.PI/2;marking.position.set(x,.351,z);storage.add(marking);
 }
 // Axial electrolytics and the copper paths that tie the discrete stage together.
 for(let i=0;i<3;i++){const x=-.48+i*.4,z=-.3;const body=cylinder(.055,.22,new T.MeshStandardMaterial({color:0x616a46,roughness:.55}),storage,x,.07,z,'y');body.rotation.z=Math.PI/2;wire([new T.Vector3(x-.18,.01,z),new T.Vector3(x-.16,.07,z),new T.Vector3(x+.16,.07,z),new T.Vector3(x+.18,.01,z)],.008,steel,storage);const trace=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(x-.18,.005,z),new T.Vector3(x-.18,.005,.03),new T.Vector3(x-.06,.005,.03)]),new T.LineBasicMaterial({color:0xb6a071}));storage.add(trace);}
 // An illuminated perpendicular branch for each chapter. Main beam runs on Z;
 // branches run on X, so the angle is exactly 90 degrees in model space.
 const glowCanvas=document.createElement('canvas');glowCanvas.width=glowCanvas.height=128;const gc=glowCanvas.getContext('2d')!;const gradient=gc.createRadialGradient(64,64,0,64,64,64);gradient.addColorStop(0,'#fff8dd');gradient.addColorStop(.12,'#ffdc9c');gradient.addColorStop(.35,'#ffad5344');gradient.addColorStop(1,'#ffad5300');gc.fillStyle=gradient;gc.fillRect(0,0,128,128);const glowTexture=new T.CanvasTexture(glowCanvas);textures.push(glowTexture);
 const branches=['SAMEROW V2','RANK PREDICTORS','GHAR LABS'].map((name,i)=>{
  const group=new T.Group();group.position.z=.35-i*.65;tube.add(group);const coreMat=new T.MeshBasicMaterial({color:0xffe6bc,transparent:true,depthWrite:false});const core=new T.Mesh(new T.CylinderGeometry(.008,.008,1,8),coreMat);core.rotation.z=Math.PI/2;group.add(core);const halos:T.Mesh[]=[];for(let j=0;j<3;j++){const m=new T.Mesh(new T.CylinderGeometry(.025+j*.035,.025+j*.035,1,8),new T.MeshBasicMaterial({color:0xffa352,transparent:true,opacity:.08/(j+1),blending:T.AdditiveBlending,depthWrite:false}));m.rotation.z=Math.PI/2;group.add(m);halos.push(m)}
  const point=new T.Mesh(new T.SphereGeometry(.025,12,8),coreMat);group.add(point);const spark=new T.Sprite(new T.SpriteMaterial({map:glowTexture,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));spark.scale.setScalar(.25);group.add(spark);const pulse=new T.Sprite(new T.SpriteMaterial({map:glowTexture,transparent:true,blending:T.AdditiveBlending,depthWrite:false}));pulse.scale.setScalar(.12);group.add(pulse);const labelCanvas=document.createElement('canvas');labelCanvas.width=512;labelCanvas.height=96;const c=labelCanvas.getContext('2d')!;c.font='24px monospace';c.fillStyle='#f5d0a2';c.fillText('0'+(i+1)+' / '+name,12,47);c.fillStyle='#ae926b';c.font='14px monospace';c.fillText('EXPLORE THE BUILD ↗',12,77);const tex=new T.CanvasTexture(labelCanvas);tex.colorSpace=T.SRGBColorSpace;textures.push(tex);const sprite=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthTest:false}));sprite.scale.set(1.65,.31,1);group.add(sprite);group.visible=false;
  return {group,core,halos,point,sprite,spark,pulse,id:['samerow','predictors','gharlabs'][i]};
 });
 return {branches,textures,updateLeads,storage,focusMaterial};
}
