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

  const scaleX = outW / baseW;
  const scaleY = outH / baseH;

  // ======================================================
  // PFP
  // y 75 -> 775
  // ======================================================

  const avatarX = 1005 * scaleX;
  const avatarY = 75 * scaleY;
  const avatarW = 817 * scaleX;
  const avatarH = 700 * scaleY;

  // ======================================================
  // @HANDLE
  // y 775 -> 870
  // ======================================================

  const handleBarX = 1005 * scaleX;
  const handleBarY = 775 * scaleY;
  const handleBarW = 817 * scaleX;
  const handleBarH = 95 * scaleY;

  return new ImageResponse(
    (
      <div
        style={{
          width: outW,
          height: outH,
          position: "relative",
          display: "flex",
          overflow: "hidden",
          background: "#08192a",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* TEMPLATE */}
        <img
          src={template}
          width={outW}
          height={outH}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%"
          }}
        />

        {/* PFP */}
        <div
          style={{
            position: "absolute",
            left: avatarX,
            top: avatarY,
            width: avatarW,
            height: avatarH,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden"
          }}
        >
          <img
            src={avatar}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center"
            }}
          />
        </div>

        {/* @HANDLE DANS LA BARRE DU TEMPLATE */}
        <div
          style={{
            position: "absolute",
            left: handleBarX,
            top: handleBarY,
            width: handleBarW,
            height: handleBarH,
            display: "flex",
            alignItems: "center",
            paddingLeft: `${24 * scaleX}px`,
            color: "#ffffff",
            fontSize: `${58 * scaleY}px`,
            fontWeight: 700,
            lineHeight: 1
          }}
        >
          @{h}
        </div>

        {/* BANDEAU DE PARTAGE */}
        <div
          style={{
            position: "absolute",
            left: 46,
            right: 46,
            bottom: 32,
            height: 30,
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            background: "rgba(28,27,26,0.82)",
            color: "#ffffff",
            fontSize: 17,
            fontWeight: 500,
            lineHeight: 1
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
