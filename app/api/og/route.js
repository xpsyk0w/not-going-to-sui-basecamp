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

  const outW = 1200;
  const outH = 630;

  // template source
  const templateUrl = `${SITE_URL}/basecamp-template-V2.png`;
  const avatarUrl = `https://unavatar.io/x/${encodeURIComponent(h)}`;

  // template original size
  const baseW = 1920;
  const baseH = 1080;

  // on garde le template en 16:9 complet dans l'OG
  const scale = outH / baseH; // 630 / 1080
  const templateW = Math.round(baseW * scale); // 1120
  const templateH = outH; // 630
  const templateX = Math.round((outW - templateW) / 2); // 40
  const templateY = 0;

  // zone avatar dans ton template V2
  const avatarX = templateX + 1005 * scale;
  const avatarY = templateY + 75 * scale;
  const avatarW = 817 * scale;
  const avatarH = 700 * scale;

  // zone du handle dans ton template V2
  const handleX = templateX + 1028 * scale;
  const handleY = templateY + 780 * scale;
  const handleW = 760 * scale;
  const handleH = 78 * scale;

  // bandeau du bas style aperçu X
  const captionX = templateX + 18;
  const captionY = outH - 46;
  const captionW = templateW - 36;
  const captionH = 38;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${outW}px`,
          height: `${outH}px`,
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#05070b",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* template complet centré */}
        <img
          src={templateUrl}
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

        {/* avatar dynamique */}
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
            src={avatarUrl}
            width={avatarW}
            height={avatarH}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "58% 48%",
              display: "block"
            }}
          />
        </div>

        {/* @handle dans la barre prévue du template */}
        <div
          style={{
            position: "absolute",
            left: `${handleX}px`,
            top: `${handleY}px`,
            width: `${handleW}px`,
            height: `${handleH}px`,
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
            fontSize: "31px",
            fontWeight: 400,
            lineHeight: 1,
            letterSpacing: "-0.5px"
          }}
        >
          @{h}
        </div>

        {/* bandeau bas style aperçu X */}
        <div
          style={{
            position: "absolute",
            left: `${captionX}px`,
            top: `${captionY}px`,
            width: `${captionW}px`,
            height: `${captionH}px`,
            display: "flex",
            alignItems: "center",
            paddingLeft: "12px",
            paddingRight: "12px",
            background: "rgba(20,20,20,0.72)",
            color: "#f3f3f3",
            fontSize: "22px",
            lineHeight: 1,
            fontWeight: 400
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
