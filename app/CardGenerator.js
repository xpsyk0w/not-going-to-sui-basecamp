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

  useEffect(() => {
  if (!handle) return;

  const timer = setTimeout(() => {
    drawCard(handle);
  }, 50);

  return () => clearTimeout(timer);
}, [handle]);

  useEffect(()=>{
    const u=cleanHandle(new URLSearchParams(window.location.search).get("u")||"");
    if(u){ setValue("@"+u); setHandle(u);  }
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
  const canvas = canvasRef.current;
  if(!canvas) return;

  const ctx = canvas.getContext("2d");
  const W = 1100;
  const H = 620;

  canvas.width = W;
  canvas.height = H;

  // ===== Background =====
  ctx.clearRect(0,0,W,H);

  const bg = ctx.createLinearGradient(0,0,W,0);
  bg.addColorStop(0.00, "#1b2023");
  bg.addColorStop(0.08, "#78f0ea");
  bg.addColorStop(0.16, "#ff7a4a");
  bg.addColorStop(0.24, "#ff5cb8");
  bg.addColorStop(0.34, "#ffd36a");
  bg.addColorStop(0.46, "#82f1ea");
  bg.addColorStop(0.60, "#ff7848");
  bg.addColorStop(0.74, "#7cf0eb");
  bg.addColorStop(0.86, "#ff6d46");
  bg.addColorStop(1.00, "#161a1d");
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,W,H);

  // dark vertical bands / neon feel
  ctx.save();
  ctx.globalAlpha = 0.55;
  for(let x=0; x<W; x+=42){
    ctx.fillStyle = x % 84 === 0 ? "rgba(0,0,0,.42)" : "rgba(255,255,255,.05)";
    ctx.fillRect(x,0,18,H);
  }
  ctx.restore();

  const overlay = ctx.createLinearGradient(0,0,0,H);
  overlay.addColorStop(0,"rgba(0,0,0,.18)");
  overlay.addColorStop(0.45,"rgba(0,0,0,0)");
  overlay.addColorStop(1,"rgba(0,0,0,.22)");
  ctx.fillStyle = overlay;
  ctx.fillRect(0,0,W,H);

  // ===== Left white panel =====
  const leftX = 34;
  const leftY = 42;
  const leftW = 520;
  const leftH = 320;

  ctx.fillStyle = "#fff";
  ctx.fillRect(leftX,leftY,leftW,leftH);

  ctx.fillStyle = "#000";
  ctx.textBaseline = "top";

  ctx.font = "900 70px Arial, Helvetica, sans-serif";
  ctx.fillText("I’m not going to", leftX + 18, leftY + 12);
  ctx.fillText("Sui Basecamp", leftX + 18, leftY + 78);

  ctx.font = "900 72px Arial, Helvetica, sans-serif";
  ctx.fillText("2026", leftX + 18, leftY + 144);

  ctx.font = "500 20px Arial, Helvetica, sans-serif";
  ctx.fillText("with TOKEN2049", leftX + 18, leftY + 248);

  // ===== Black date box =====
  const badgeX = leftX + 248;
  const badgeY = leftY + 116;
  const badgeW = 185;
  const badgeH = 66;

  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(badgeX,badgeY,badgeW,badgeH);

  ctx.fillStyle = "#fff";
  ctx.font = "500 15px Arial, Helvetica, sans-serif";
  ctx.fillText("Marina Bay Sands, Singapore", badgeX + 10, badgeY + 12);
  ctx.fillText("7-8 October", badgeX + 10, badgeY + 34);

  // ===== URL white box =====
  const urlX = leftX + 248;
  const urlY = leftY + 214;
  const urlW = 184;
  const urlH = 48;

  ctx.fillStyle = "#fff";
  ctx.fillRect(urlX,urlY,urlW,urlH);

  ctx.fillStyle = "#222";
  ctx.font = "500 18px Arial, Helvetica, sans-serif";
  ctx.fillText("sui.io/basecamp", urlX + 12, urlY + 13);

  // ===== Right panel =====
  const rightX = 610;
  const rightY = 42;
  const rightW = 350;
  const rightH = 410;

  const rg = ctx.createLinearGradient(rightX,rightY,rightX+rightW,rightY+rightH);
  rg.addColorStop(0,"#d96bd0");
  rg.addColorStop(.5,"#c54ab8");
  rg.addColorStop(1,"#a92f99");
  ctx.fillStyle = rg;
  ctx.fillRect(rightX,rightY,rightW,rightH);

  // decorative pattern
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,.22)";
  ctx.lineWidth = 2;

  const circles = [
    [42,36,12],[104,54,18],[178,30,10],[244,60,16],[304,34,20],
    [72,150,16],[184,126,10],[276,162,18],[110,245,14],[286,268,12]
  ];
  circles.forEach(([cx,cy,r])=>{
    ctx.beginPath();
    ctx.arc(rightX+cx,rightY+cy,r,0,Math.PI*2);
    ctx.stroke();
  });

  for(let i=0;i<24;i++){
    const px = rightX + 18 + ((i*61) % (rightW-36));
    const py = rightY + 18 + ((i*89) % (rightH-36));
    ctx.beginPath();
    ctx.moveTo(px-4,py); ctx.lineTo(px+4,py);
    ctx.moveTo(px,py-4); ctx.lineTo(px,py+4);
    ctx.stroke();
  }
  ctx.restore();

  // ===== Avatar fills the full right panel =====
  const data = await fetchAvatarDataUrl(h);

  if(data){
    const img = new Image();
    img.src = data;
    await new Promise((res,rej)=>{ img.onload=res; img.onerror=rej; });

    const cropX = rightX;
    const cropY = rightY;
    const cropW = rightW;
    const cropH = rightH;

    const ir = img.width / img.height;
    const br = cropW / cropH;
    let dw, dh, dx, dy;

    if(ir > br){
      dh = cropH;
      dw = dh * ir;
      dx = cropX - (dw - cropW) / 2;
      dy = cropY;
    } else {
      dw = cropW;
      dh = dw / ir;
      dx = cropX;
      dy = cropY - (dh - cropH) / 2;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // redraw pattern lightly over avatar so it feels closer to original
  ctx.save();
  ctx.strokeStyle = "rgba(255,255,255,.16)";
  ctx.lineWidth = 2;
  const circles2 = [
    [42,36,12],[104,54,18],[178,30,10],[244,60,16],[304,34,20],
    [72,150,16],[184,126,10],[276,162,18],[110,245,14],[286,268,12]
  ];
  circles2.forEach(([cx,cy,r])=>{
    ctx.beginPath();
    ctx.arc(rightX+cx,rightY+cy,r,0,Math.PI*2);
    ctx.stroke();
  });
  ctx.restore();

  // ===== Handle bar =====
  const barX = rightX;
  const barY = 470;
  const barW = rightW;
  const barH = 52;

  ctx.fillStyle = "rgba(66,58,53,.88)";
  ctx.fillRect(barX,barY,barW,barH);

  ctx.fillStyle = "#fff";
  ctx.font = "700 24px Arial, Helvetica, sans-serif";
  ctx.fillText("@"+h, barX + 12, barY + 11);

  // subtle outer border
  ctx.strokeStyle = "rgba(255,255,255,.08)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1,1,W-2,H-2);
}

  async function generate(){
    const h=cleanHandle(value); if(!h) return;
    setHandle(h); setValue("@"+h);
    const u=new URL(window.location.href); u.search=""; u.searchParams.set("u",h); history.replaceState({},"",u);
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
      <a className="logo" href="/">
  SUI <span>BASECAMP</span> 2026
</a>
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
