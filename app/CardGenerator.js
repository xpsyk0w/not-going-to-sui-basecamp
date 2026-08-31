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
    if (!handle) return;

    const timer = setTimeout(() => {
      drawCard(handle);
    }, 50);

    return () => clearTimeout(timer);
  }, [handle]);

  useEffect(() => {
    const u = cleanHandle(
      new URLSearchParams(window.location.search).get("u") || ""
    );

    if (u) {
      setValue("@" + u);
      setHandle(u);
    }
  }, []);

  async function fetchAvatarDataUrl(handle) {
    const urls = [
      `https://unavatar.io/x/${encodeURIComponent(handle)}`,
      `https://unavatar.io/twitter/${encodeURIComponent(handle)}`
    ];

    for (const url of urls) {
      try {
        const r = await fetch(url, {
          mode: "cors"
        });

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

    // Load the original card template
    let template;

    try {
      template = await loadImage("/basecamp-template.png");
    } catch (e) {
      console.error(
        "Could not load /basecamp-template.png",
        e
      );

      ctx.fillStyle = "#111111";
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#ffffff";
      ctx.font = "48px Arial";
      ctx.fillText(
        "Template not found",
        60,
        60
      );

      return;
    }

    ctx.drawImage(
      template,
      0,
      0,
      W,
      H
    );

    // Efface complètement l'ancienne PFP + ancien handle
ctx.fillStyle = "#111111";
ctx.fillRect(990, 60, 850, 830);

    // ======================================================
    // Replace ONLY "I'm going to"
    // Everything else remains from the original PNG
    // ======================================================

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(72, 66, 790, 145);

      ctx.fillStyle = "#000000";
      ctx.textBaseline = "top";

      const title = "I’m not going to";
      const maxWidth = 890;

      let fontSize = 116;

       do {
      ctx.font = `900 ${fontSize}px Arial, Helvetica, sans-serif`;
       fontSize -= 2;
      } while (
      ctx.measureText(title).width > maxWidth &&
      fontSize > 90
       );

     ctx.fillText(title, 86, 74);

    // ======================================================
    // Dynamic X profile picture
    // ======================================================

    const avatarData =
      await fetchAvatarDataUrl(h);

    if (avatarData) {
      try {
        const img =
          await loadImage(avatarData);

        // Exact profile area from the original template
        const px = 1005;
const py = 75;
const pw = 830;
const ph = 830;

const sourceRatio = img.width / img.height;
const targetRatio = pw / ph;

let sx = 0;
let sy = 0;
let sw = img.width;
let sh = img.height;

// cover crop
if (sourceRatio > targetRatio) {
  sw = img.height * targetRatio;
  sx = (img.width - sw) / 2;
} else {
  sh = img.width / targetRatio;
  sy = (img.height - sh) / 2;
}

// zoom
const zoom = 1.15;
const newSw = sw / zoom;
const newSh = sh / zoom;

sx += (sw - newSw) / 2;
sy += (sh - newSh) / 2;
sw = newSw;
sh = newSh;

// reposition subject ONLY inside the frame
sx -= 20;   // pousse un peu le perso vers la droite
sy += 6;    // descend un peu

// IMPORTANT : on garde la destination EXACTE de l'ancienne PFP
const extraRight = 10;

ctx.save();
ctx.beginPath();
ctx.rect(px, py, pw + extraRight, ph);
ctx.clip();

ctx.drawImage(
  img,
  sx, sy, sw, sh,
  px, py, pw + extraRight, ph
);

ctx.restore();
        
      } catch (e) {
        console.error(
          "Could not load X avatar",
          e
        );
      }
    }

    // ======================================================
    // Dynamic @handle bar
    // ======================================================

    ctx.fillStyle =
      "rgba(56, 50, 45, 0.92)";

    ctx.fillRect(
      1005,
      905,
      817,
      105
    );

    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "top";

    ctx.font =
      "700 58px Arial, Helvetica, sans-serif";

    ctx.fillText(
      "@" + h,
      1035,
      925
    );
  }

  function generate() {
    const h =
      cleanHandle(value);

    if (!h) return;

    setHandle(h);
    setValue("@" + h);

    const u =
      new URL(window.location.href);

    u.search = "";

    u.searchParams.set(
      "u",
      h
    );

    history.replaceState(
      {},
      "",
      u
    );
  }

  function post() {
    const text =
      "I'm not going to Sui Basecamp 2026.";

    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(
        window.location.href
      )}`,
      "_blank"
    );
  }

  function download() {
    if (!handle) return;

    const a =
      document.createElement("a");

    a.download =
      `not-going-to-sui-basecamp-${handle}.png`;

    a.href =
      canvasRef.current.toDataURL(
        "image/png"
      );

    a.click();
  }

  async function copyImage() {
    const blob =
      await new Promise((resolve) =>
        canvasRef.current.toBlob(
          resolve,
          "image/png"
        )
      );

    await navigator.clipboard.write([
      new ClipboardItem({
        "image/png": blob
      })
    ]);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(
      window.location.href
    );
  }

  return (
    <div className="shell">

      <div className="top">

        <a
          className="logo"
          href="/"
        >
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
        Drop your X handle and we'll make you a card
        to let everyone know you won't be there.
      </p>

      <div className="form">

        <input
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          onKeyDown={(e) =>
            e.key === "Enter" &&
            generate()
          }
          placeholder="@xpsyk0w"
        />

        <button
          className="generate"
          onClick={generate}
        >
          Generate
        </button>

      </div>

      {handle && (
        <>

          <div className="greet">
            Won't see you there, @{handle}!
          </div>

          <div className="cardFrame">

            <canvas
              ref={canvasRef}
              className="cardCanvas"
            />

          </div>

          <div className="actions">

            <button
              className="action primary"
              onClick={post}
            >
              𝕏&nbsp;&nbsp; Post to X
            </button>

            <button
              className="action"
              onClick={download}
            >
              ⇩&nbsp;&nbsp; Download PNG
            </button>

            <button
              className="action"
              onClick={copyImage}
            >
              ⧉&nbsp;&nbsp; Copy image
            </button>

            <button
              className="action"
              onClick={copyLink}
            >
              ↗&nbsp;&nbsp; Copy link
            </button>

          </div>

          <div className="note">
            Posting to X opens a pre-filled post
            with your link — the card shows up
            as the preview.
          </div>

        </>
      )}

    </div>
  );
}
