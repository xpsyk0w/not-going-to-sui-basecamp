"use client";
import {useEffect,useRef,useState} from "react";

function cleanHandle(value){
  let s=String(value||"").trim();
  s=s.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i,"");
  s=s.replace(/^@/,"").split(/[/?#]/)[0];
  return s.replace(/[^A-Za-z0-9_]/g,"").slice(0,15);
}

export default function CardGenerator(){
  const [value,setValue]=useState("");
  const [handle,setHandle]=useState("");
  const canvasRef=useRef(null);

  useEffect(()=>{
    const u=cleanHandle(new URLSearchParams(window.location.search).get("u")||"");
    if(u){ setValue("@"+u); setHandle(u); setTimeout(()=>drawCard(u),50); }
  },[]);

  async function fetchAvatarDataUrl(h){
    const urls=[`https://unavatar.io/x/${encodeURIComponent(h)}`,`https://unavatar.io/twitter/${encodeURIComponent(h)}`];
    for(const url of urls){
      try{
        const r=await fetch(url,{mode:"cors"});
        if(!r.ok) continue;
        const b=await r.blob();
        return await new Promise((res,rej)=>{const fr=new FileReader();fr.onload=()=>res(fr.result);fr.onerror=rej;fr.readAsDataURL(b);});
      }catch(e){}
    }
    return "";
  }

  function createBgPattern(ctx){
    const p=document.createElement("canvas"); p.width=420; p.height=420;
    const c=p.getContext("2d");
    const g=c.createLinearGradient(0,0,p.width,0);
    const stops=[[0,"#3a3836"],[.06,"#101418"],[.11,"#55cdc6"],[.14,"#161616"],[.22,"#ff7b4e"],[.28,"#e35d46"],[.33,"#161616"],[.40,"#6be1e0"],[.48,"#ff6d49"],[.55,"#ff9259"],[.61,"#171717"],[.68,"#5de0e0"],[.74,"#e55b3f"],[.82,"#171717"],[.90,"#58d6cf"],[1,"#101010"]];
    stops.forEach(([s,col])=>g.addColorStop(s,col)); c.fillStyle=g; c.fillRect(0,0,p.width,p.height);
    c.globalAlpha=.13; for(let i=0;i<p.width;i+=18){c.fillStyle=i%36===0?"#fff":"#000";c.fillRect(i,0,2,p.height)} c.globalAlpha=1;
    const fade=c.createLinearGradient(0,0,0,p.height); fade.addColorStop(0,"rgba(0,0,0,.30)"); fade.addColorStop(.35,"rgba(0,0,0,0)"); fade.addColorStop(1,"rgba(0,0,0,.24)");
    c.fillStyle=fade;c.fillRect(0,0,p.width,p.height);
    return ctx.createPattern(p,"repeat");
  }

  async function drawCard(h){
    const canvas=canvasRef.current; if(!canvas) return;
    const ctx=canvas.getContext("2d"); const W=1100,H=640;
    canvas.width=W; canvas.height=H; ctx.clearRect(0,0,W,H);
    ctx.fillStyle=createBgPattern(ctx); ctx.fillRect(0,0,W,H);

    const leftX=40,leftY=34,leftW=470,leftH=250;
    ctx.fillStyle="#fff";ctx.fillRect(leftX,leftY,leftW,leftH);
    ctx.fillStyle="#000";ctx.textBaseline="top";ctx.font="900 76px Arial";
    ctx.fillText("I’m not going to",leftX+22,leftY+16);ctx.fillText("Sui Basecamp",leftX+22,leftY+86);ctx.fillText("2026",leftX+22,leftY+156);
    ctx.font="500 27px Arial";ctx.fillText("with TOKEN2049",leftX+24,leftY+226);

    const badgeX=leftX+265,badgeY=leftY+90;
    ctx.fillStyle="#101010";ctx.fillRect(badgeX,badgeY,158,64);ctx.fillStyle="#fff";ctx.font="500 17px Arial";
    ctx.fillText("Marina Bay Sands, Singapore",badgeX+10,badgeY+10);ctx.fillText("7-8 October",badgeX+10,badgeY+32);

    const siteX=leftX+262,siteY=leftY+198;
    ctx.fillStyle="#fff";ctx.fillRect(siteX,siteY,169,55);ctx.fillStyle="#222";ctx.font="500 28px Arial";ctx.fillText("sui.io/basecamp",siteX+12,siteY+15);

    const rightX=580,rightY=30,rightW=470,rightH=470;
    const rg=ctx.createLinearGradient(rightX,rightY,rightX+rightW,rightY+rightH);rg.addColorStop(0,"#df6ed6");rg.addColorStop(.45,"#c24cb9");rg.addColorStop(1,"#a33096");
    ctx.fillStyle=rg;ctx.fillRect(rightX,rightY,rightW,rightH);

    const data=await fetchAvatarDataUrl(h);
    if(data){
      const img=new Image(); img.src=data; await new Promise((res,rej)=>{img.onload=res;img.onerror=rej});
      const cropX=rightX+66,cropY=rightY+28,cropW=310,cropH=420;
      const ir=img.width/img.height, br=cropW/cropH; let dw,dh,dx,dy;
      if(ir>br){dh=cropH;dw=dh*ir;dx=cropX-(dw-cropW)/2;dy=cropY;}else{dw=cropW;dh=dw/ir;dx=cropX;dy=cropY-(dh-cropH)/2;}
      ctx.drawImage(img,dx,dy,dw,dh);
    }

    ctx.fillStyle="rgba(59,55,49,.88)";ctx.fillRect(608,506,414,55);ctx.fillStyle="#fff";ctx.font="700 38px Arial";ctx.fillText("@"+h,624,516);
  }

  async function generate(){
    const h=cleanHandle(value); if(!h) return;
    setHandle(h); setValue("@"+h);
    const u=new URL(window.location.href); u.search=""; u.searchParams.set("u",h); history.replaceState({},"",u);
    await drawCard(h);
  }

  function post(){
    const text="I'm not going to Sui Basecamp 2026.";
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}`,"_blank");
  }

  function download(){
    if(!handle) return;
    const a=document.createElement("a");a.download=`not-going-to-sui-basecamp-${handle}.png`;a.href=canvasRef.current.toDataURL("image/png");a.click();
  }

  async function copyImage(){
    const blob=await new Promise(res=>canvasRef.current.toBlob(res,"image/png"));
    await navigator.clipboard.write([new ClipboardItem({"image/png":blob})]);
  }

  async function copyLink(){ await navigator.clipboard.writeText(window.location.href); }

  return <div className="shell">
    <div className="top">
      <div className="logo">SUI <span>BASECAMP</span> 2026</div>
      <a className="reg" href="https://sui.io/basecamp" target="_blank">Register Now</a>
    </div>

    <h1>I'M NOT GOING TO<br/>SUI BASECAMP</h1>
    <p className="desc">Drop your X handle and we'll make you a card to let everyone know you won't be there.</p>

    <div className="form">
      <input value={value} onChange={e=>setValue(e.target.value)} onKeyDown={e=>e.key==="Enter"&&generate()} placeholder="@xpsyk0w"/>
      <button className="generate" onClick={generate}>Generate</button>
    </div>

    {handle && <>
      <div className="greet">Won't see you there, @{handle}!</div>
      <div className="cardFrame"><canvas ref={canvasRef} className="cardCanvas"/></div>
      <div className="actions">
        <button className="action primary" onClick={post}>𝕏&nbsp;&nbsp; Post to X</button>
        <button className="action" onClick={download}>⇩&nbsp;&nbsp; Download PNG</button>
        <button className="action" onClick={copyImage}>⧉&nbsp;&nbsp; Copy image</button>
        <button className="action" onClick={copyLink}>↗&nbsp;&nbsp; Copy link</button>
      </div>
      <div className="note">Posting to X opens a pre-filled post with your link — the card shows up as the preview.</div>
    </>}
  </div>
}
