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

  // Image OG finale
  const outW = 1200;
  const outH = 630;

  // Dimensions originales du template
  const baseW = 1920;
  const baseH = 1080;

  const scaleX = outW / baseW;
  const scaleY = outH / baseH;

  // ======================================================
  // ZONE PFP
  // ======================================================

  const avatarX = 1005 * scaleX;
  const avatarY = 75 * scaleY;
  const avatarW = 817 * scaleX;
  const avatarH = 830 * scaleY;

  // ======================================================
  // ZONE @HANDLE
  // ======================================================

  const handleBarX = 1005 * scaleX;
  const handleBarY = 905 * scaleY;
  const handleBarW = 817 * scaleX;
  const handleBarH = 105 * scaleY;

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
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* TEMPLATE COMPLET */}
        <img
          src={template}
          width={outW}
          height={outH}
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            display: "block"
          }}
        />

        {/* PFP DYNAMIQUE */}
        <div
          style={{
            position: "absolute",
            left: `${avatarX}px`,
            top: `${avatarY}px`,
            width: `${avatarW}px`,
            height: `${avatarH}px`,
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
              objectPosition: "center",
              display: "block"
            }}
          />
        </div>

        {/* @HANDLE DANS LE RECTANGLE DU TEMPLATE */}
        <div
          style={{
            position: "absolute",
            left: `${handleBarX}px`,
            top: `${handleBarY}px`,
            width: `${handleBarW}px`,
            height: `${handleBarH}px`,
            display: "flex",
            alignItems: "center",
            paddingLeft: `${30 * scaleX}px`,
            color: "#ffffff",
            fontSize: `${58 * scaleY}px`,
            fontWeight: 700,
            lineHeight: 1
          }}
        >
          @{h}
        </div>
      </div>

           {/* BANDEAU BAS POUR LA PREVIEW X */}
      <div
           style={{
             position: "absolute",
             left: "42px",
             right: "42px",
             bottom: "32px",
             height: "42px",
             display: "flex",
             alignItems: "center",
             paddingLeft: "12px",
             background: "rgba(34, 31, 29, 0.82)",
             color: "#ffffff",
             fontSize: "20px",
             fontWeight: 600,
             lineHeight: 1
        }}
  >
            @{h} is not going to Sui Basecamp 2026
   </div>
    ),
    {
      width: outW,
      height: outH
    }
  );
}
