"use client";

import { useEffect, useRef, useState } from "react";

function cleanHandle(value) {
  let s = String(value || "").trim();

  s = s.replace(/^https?:\/\/(www\.)?(x|twitter)\.com\//i, "");
  s = s.replace(/^@/, "").split(/[/?#]/)[0];

  return s.replace(/[^A-Za-z0-9_]/g, "").slice(0, 15);
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export default function CardGenerator() {
  const [value, setValue] = useState("");
  const [handle, setHandle] = useState("");

  const canvasRef = useRef(null);

  useEffect(() => {
    const u = cleanHandle(
      new URLSearchParams(window.location.search).get("u") || ""
    );

    if (u) {
      setValue("@" + u);
      setHandle(u);
    }
  }, []);

  useEffect(() => {
    if (!handle) return;

    const timer = setTimeout(() => {
      drawCard(handle);
    }, 50);

    return () => clearTimeout(timer);
  }, [handle]);

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

  async function drawCard(h) {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    const W = 1920;
    const H = 1080;

    canvas.width = W;
    canvas.height = H;

    ctx.clearRect(0, 0, W, H);

    let template;

    try {
      template = await loadImage("/basecamp-template-V2.png");
    } catch (e) {
      console.error("Could not load /basecamp-template-V2.png", e);

      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#ffffff";
      ctx.font = "48px Arial";
      ctx.fillText("Template not found", 60, 60);

      return;
    }

    // 1) draw template
    ctx.drawImage(template, 0, 0, W, H);

    // 2) draw avatar inside the black area (NO crop, contain mode)
    const avatarData = await fetchAvatarDataUrl(h);

    if (avatarData) {
      try {
        const img = await loadImage(avatarData);

        // zone noire prévue pour la PFP
        const px = 1005;
        const py = 75;
        const pw = 817;
        const ph = 830;

        const scale = Math.min(pw / img.width, ph / img.height);

        const dw = img.width * scale;
        const dh = img.height * scale;

        const offsetX = 20; // décale vers la droite
        const offsetY = 0;  // si besoin plus tard
        const dx = px + (pw - dw) / 2 + offsetX;
        const dy = py + (ph - dh) / 2;

        ctx.drawImage(img, dx, dy, dw, dh);
      } catch (e) {
        console.error("Could not load X avatar", e);
      }
    }

    // 3) draw @handle inside the bar already present in the template
    ctx.fillStyle = "#ffffff";
    ctx.font = "700 58px Arial, Helvetica, sans-serif";
    ctx.textBaseline = "middle";

    ctx.fillText("@" + h, 1035, 958);
  }

  function generate() {
    const h = cleanHandle(value);
    if (!h) return;

    setHandle(h);
    setValue("@" + h);

    const u = new URL(window.location.href);
    u.search = "";
    u.searchParams.set("u", h);

    history.replaceState({}, "", u);
  }

  function post() {
    const text = "I'm not going to Sui Basecamp 2026.";

    const shareUrl = new URL(window.location.href);

    // Force X à recharger les metadata / OG au lieu du cache
    shareUrl.searchParams.set("v", Date.now().toString());

    window.open(
    `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      text
    )}&url=${encodeURIComponent(shareUrl.toString())}`,
    "_blank"
    );
  }

  function download() {
    if (!handle) return;

    const a = document.createElement("a");
    a.download = `not-going-to-sui-basecamp-${handle}.png`;
    a.href = canvasRef.current.toDataURL("image/png");
    a.click();
  }

  async function copyImage() {
    const blob = await new Promise((resolve) =>
      canvasRef.current.toBlob(resolve, "image/png")
    );

    await navigator.clipboard.write([
      new ClipboardItem({ "image/png": blob })
    ]);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
  }

  return (
    <div className="shell">
      <div className="top">
        <a className="logo" href="/">
          SUI <span>BASECAMP</span> 2026
        </a>

        <a
          className="reg"
          href="https://sui.io/basecamp"
          target="_blank"
          rel="noreferrer"
        >
          Register Now
        </a>
      </div>

      <h1>
        I'M NOT GOING TO
        <br />
        SUI BASECAMP
      </h1>

      <p className="desc">
        Drop your X handle and we'll make you a card to let everyone know you
        won't be there.
      </p>

      <div className="form">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generate()}
          placeholder="@xpsyk0w"
        />

        <button className="generate" onClick={generate}>
          Generate
        </button>
      </div>

      {handle && (
        <>
          <div className="greet">Won't see you there, @{handle}!</div>

          <div className="cardFrame">
            <canvas ref={canvasRef} className="cardCanvas" />
          </div>

          <div className="actions">
            <button className="action primary" onClick={post}>
              𝕏&nbsp;&nbsp; Post to X
            </button>

            <button className="action" onClick={download}>
              ⇩&nbsp;&nbsp; Download PNG
            </button>

            <button className="action" onClick={copyImage}>
              ⧉&nbsp;&nbsp; Copy image
            </button>

            <button className="action" onClick={copyLink}>
              ↗&nbsp;&nbsp; Copy link
            </button>
          </div>

          <div className="note">
            Posting to X opens a pre-filled post with your link — the card shows
            up as the preview.
          </div>
        </>
      )}
    </div>
  );
}
