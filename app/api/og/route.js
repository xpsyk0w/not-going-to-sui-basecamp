import { ImageResponse } from "next/og";

export const runtime = "edge";

const SITE_URL = "https://not-going-to-sui-basecamp.vercel.app";

function clean(value = "") {
  return String(value)
    .replace(/^@/, "")
    .replace(/[^A-Za-z0-9_]/g, "")
    .slice(0, 15) || "yourhandle";
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const h = clean(searchParams.get("u"));

  const template = `${SITE_URL}/basecamp-template-V2.png`;
  const avatar = `https://unavatar.io/x/${encodeURIComponent(h)}`;

  // sortie X
  const outW = 1200;
  const outH = 630;

  // base du template
  const baseW = 1920;
  const baseH = 1080;

  const scaleX = outW / baseW;
  const scaleY = outH / baseH;

  // zone image droite
  const avatarX = 1005 * scaleX;
  const avatarY = 75 * scaleY;
  const avatarW = 817 * scaleX;
  const avatarH = 700 * scaleY;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${outW}px`,
          height: `${outH}px`,
          position: "relative",
          display: "flex",
          overflow: "hidden",
          background: "#08192a",
          fontFamily: "Arial"
        }}
      >
        {/* fond template */}
        <img
          src={template}
          width={outW}
          height={outH}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%"
          }}
        />

        {/* pfp remplie comme dans l’original */}
        <div
          style={{
            position: "absolute",
            left: `${avatarX}px`,
            top: `${avatarY}px`,
            width: `${avatarW}px`,
            height: `${avatarH}px`,
            display: "flex",
            overflow: "hidden"
          }}
        >
          <img
            src={avatar}
            width={avatarW}
            height={avatarH}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>

        {/* bandeau bas façon original */}
        <div
          style={{
            position: "absolute",
            left: "42px",
            right: "42px",
            bottom: "36px",
            height: "42px",
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            background: "rgba(37, 32, 30, 0.82)",
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: 700,
            lineHeight: 1,
            whiteSpace: "nowrap"
          }}
        >
          @{h} is not going to Sui Basecamp 2026
        </div>
      </div>
    ),
    {
      width: outW,
      height: outH
    }
  );
}
