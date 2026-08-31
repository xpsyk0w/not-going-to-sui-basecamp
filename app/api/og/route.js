import { ImageResponse } from "next/og";

export const runtime = "edge";

const SITE_URL = "https://not-going-to-sui-basecamp.vercel.app";

function clean(value = "") {
  return (
    String(value)
      .replace(/^@/, "")
      .replace(/[^A-Za-z0-9_]/g, "")
      .slice(0, 15) || "yourhandle"
  );
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const h = clean(searchParams.get("u"));

  const template = `${SITE_URL}/basecamp-template-V2.png`;
  const avatar = `https://unavatar.io/x/${encodeURIComponent(h)}`;

  const outW = 1200;
  const outH = 630;

  const baseW = 1920;
  const baseH = 1080;

  // IMPORTANT : scale uniforme
  const scale = outW / baseW; // 0.625

  // On garde le ratio du template, puis on crop en hauteur
  const templateW = outW;
  const templateH = Math.round(baseH * scale); // 675
  const templateX = 0;
  const templateY = Math.round((outH - templateH) / 2); // ≈ -22 / -23

  // Coordonnées venant de ta version canvas qui marche
  const avatarX = Math.round(1005 * scale);
  const avatarY = Math.round(75 * scale + templateY);
  const avatarW = Math.round(817 * scale);
  const avatarH = Math.round(700 * scale);

  const handleX = Math.round(1035 * scale);
  const handleY = Math.round(795 * scale + templateY);

  return new ImageResponse(
    (
      <div
        style={{
          width: `${outW}px`,
          height: `${outH}px`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          background: "#08192a",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* template */}
        <img
          src={template}
          width={templateW}
          height={templateH}
          style={{
            position: "absolute",
            left: `${templateX}px`,
            top: `${templateY}px`,
            width: `${templateW}px`,
            height: `${templateH}px`,
            display: "block"
          }}
        />

        {/* PFP */}
        <div
          style={{
            position: "absolute",
            left: `${avatarX}px`,
            top: `${avatarY}px`,
            width: `${avatarW}px`,
            height: `${avatarH}px`,
            overflow: "hidden",
            display: "flex",
            background: "#000000"
          }}
        >
          <img
            src={avatar}
            width={avatarW}
            height={avatarH}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 50%",
              display: "block"
            }}
          />
        </div>

        {/* @handle dans la bonne zone */}
        <div
          style={{
            position: "absolute",
            left: `${handleX}px`,
            top: `${handleY}px`,
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
            fontSize: `${Math.round(58 * scale)}px`,
            fontWeight: 700,
            lineHeight: 1
          }}
        >
          @{h}
        </div>
      </div>
    ),
    {
      width: outW,
      height: outH
    }
  );
}
