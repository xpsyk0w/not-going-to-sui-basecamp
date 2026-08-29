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

async function fetchAvatarDataUrl(handle) {
  const urls = [
    `https://unavatar.io/x/${encodeURIComponent(handle)}`,
    `https://unavatar.io/twitter/${encodeURIComponent(handle)}`
  ];

  for (const url of urls) {
    try {
      const r = await fetch(url, { mode: "cors" });
      if (!r.ok) continue;
      const blob = await r.blob();

      const dataUrl = await new Promise((resolve, reject) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.onerror = reject;
        fr.readAsDataURL(blob);
      });

      return dataUrl;
    } catch (e) {}
  }

  return "";
}

  function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}


async function drawCard(h) {
  const canvas = canvasRef.current;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  // On travaille directement à la taille réelle du template
  const W = 1920;
  const H = 1080;

  canvas.width = W;
  canvas.height = H;

  // charge le template original
  const template = await loadImage("/basecamp-template.png");
  ctx.clearRect(0, 0, W, H);
  ctx.drawImage(template, 0, 0, W, H);

  // =========================
  // 1) Remplace le bloc texte de gauche
  // =========================
  // on recouvre l'ancien texte avec un grand bloc blanc
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(70, 74, 935, 530);

  // gros texte
  ctx.fillStyle = "#000000";
  ctx.textBaseline = "top";

  ctx.font = "900 110px Arial, Helvetica, sans-serif";
  ctx.fillText("I’m not going to", 94, 88);
  ctx.fillText("Sui Basecamp", 94, 204);

  ctx.font = "900 116px Arial, Helvetica, sans-serif";
  ctx.fillText("2026", 94, 320);

  // with TOKEN2049
  ctx.font = "500 58px Arial, Helvetica, sans-serif";
  ctx.fillText("with TOKEN2049", 94, 520);

  // =========================
  // 2) Redessine le badge noir date/lieu
  // =========================
  ctx.fillStyle = "#0a0a0a";
  ctx.fillRect(470, 355, 530, 132);

  ctx.fillStyle = "#ffffff";
  ctx.font = "500 34px Arial, Helvetica, sans-serif";
  ctx.fillText("Marina Bay Sands, Singapore", 498, 374);
  ctx.fillText("7-8 October", 498, 422);

  // =========================
  // 3) Redessine le bloc URL
  // =========================
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(470, 600, 395, 120);

  ctx.fillStyle = "#1f1f1f";
  ctx.font = "500 44px Arial, Helvetica, sans-serif";
  ctx.fillText("sui.io/basecamp", 500, 635);

  // =========================
  // 4) Remplace la partie droite par la PFP dynamique
  // =========================
  const avatarData = await fetchAvatarDataUrl(h);

  if (avatarData) {
    const img = new Image();
    img.src = avatarData;
    await new Promise((res, rej) => {
      img.onload = res;
      img.onerror = rej;
    });

    // zone image de droite
    const px = 1005;
    const py = 75;
    const pw = 817;
    const ph = 700;

    const ir = img.width / img.height;
    const br = pw / ph;

    let dw, dh, dx, dy;

    if (ir > br) {
      dh = ph;
      dw = dh * ir;
      dx = px - (dw - pw) / 2;
      dy = py;
    } else {
      dw = pw;
      dh = dw / ir;
      dx = px;
      dy = py - (dh - ph) / 2;
    }

    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // =========================
  // 5) Redessine la barre du @handle
  // =========================
  ctx.fillStyle = "rgba(58,49,43,0.90)";
  ctx.fillRect(1005, 776, 817, 94);

  ctx.fillStyle = "#ffffff";
  ctx.font = "700 72px Arial, Helvetica, sans-serif";
  ctx.fillText("@" + h, 1035, 795);

  // légère bordure si tu veux garder un rendu propre
  ctx.strokeStyle = "rgba(255,255,255,0.04)";
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, W - 2, H - 2);
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
