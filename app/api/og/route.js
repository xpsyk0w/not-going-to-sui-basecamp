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

  // taille finale OG
  const outW = 1200;
  const outH = 630;

  // taille de ton template source
  const baseW = 1920;
  const baseH = 1080;

  // IMPORTANT :
  // on utilise UNE SEULE échelle uniforme
  // pour éviter tous les décalages entre X et Y
  const scale = outW / baseW;

  // le template prend toute la largeur
  const templateW = outW;
  const templateH = Math.round(baseH * scale); // 675
  const templateX = 0;
  const templateY = Math.round((outH - templateH) / 2); // légèrement négatif

  // zone PFP du template
  const avatarX = Math.round(templateX + 1005 * scale);
  const avatarY = Math.round(templateY + 75 * scale);
  const avatarW = Math.round(817 * scale);
  const avatarH = Math.round(700 * scale);

  // zone du @handle dans la barre prévue du template
  const handleX = Math.round(templateX + 1035 * scale);
  const handleY = Math.round(templateY + 795 * scale);

  // bandeau du bas
  const bottomBarX = 32;
  const bottomBarY = outH - 62;
  const bottomBarW = outW - 64;
  const bottomBarH = 42;

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
        {/* Template */}
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

        {/* PFP entière, non découpée */}
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
            overflow: "hidden",
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
              objectFit: "contain",
              objectPosition: "center",
              display: "block"
            }}
          />
        </div>

        {/* @handle dans la zone prévue */}
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

        {/* bandeau du bas */}
        <div
          style={{
            position: "absolute",
            left: `${bottomBarX}px`,
            top: `${bottomBarY}px`,
            width: `${bottomBarW}px`,
            height: `${bottomBarH}px`,
            display: "flex",
            alignItems: "center",
            paddingLeft: "12px",
            paddingRight: "12px",
            background: "rgba(0,0,0,0.55)",
            color: "#ffffff",
            fontSize: "18px",
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
