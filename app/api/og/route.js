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

  // ======================================================
  // OG OUTPUT
  // ======================================================

  const outW = 1200;
  const outH = 630;

  // Template original = 1920 x 1080 (16:9)
  const baseW = 1920;
  const baseH = 1080;

  // On garde STRICTEMENT le ratio du template.
  // 1080 -> 630
  const scale = outH / baseH;

  // 1920 * 0.583333... = 1120
  const cardW = baseW * scale;
  const cardH = baseH * scale;

  // Centre la carte dans l'OG 1200x630
  const cardX = (outW - cardW) / 2;
  const cardY = 0;

  // ======================================================
  // PFP — coordonnées du template original
  // ======================================================

  const avatarX = cardX + 1005 * scale;
  const avatarY = cardY + 75 * scale;
  const avatarW = 817 * scale;
  const avatarH = 830 * scale;

  // ======================================================
  // HANDLE — rectangle déjà présent dans le template
  // ======================================================

  const handleX = cardX + 1005 * scale;
  const handleY = cardY + 905 * scale;
  const handleW = 817 * scale;
  const handleH = 105 * scale;

  return new ImageResponse(
    (
      <div
        style={{
          width: outW,
          height: outH,
          position: "relative",
          display: "flex",
          overflow: "hidden",
          background: "#020b14",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* =================================================
            TEMPLATE — PAS ÉTIRÉ
        ================================================= */}
        <img
          src={template}
          style={{
            position: "absolute",
            left: cardX,
            top: cardY,
            width: cardW,
            height: cardH,
            display: "block"
          }}
        />

        {/* =================================================
            PFP DYNAMIQUE
        ================================================= */}
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
              objectPosition: "center",
              display: "block"
            }}
          />
        </div>

        {/* =================================================
            @HANDLE DANS LA BARRE DU TEMPLATE
        ================================================= */}
        <div
          style={{
            position: "absolute",
            left: handleX,
            top: handleY,
            width: handleW,
            height: handleH,
            display: "flex",
            alignItems: "center",
            paddingLeft: 18,
            color: "#ffffff",
            fontSize: 34,
            fontWeight: 700,
            lineHeight: 1
          }}
        >
          @{h}
        </div>

        {/* =================================================
            BANDEAU FAÇON SITE ORIGINAL
        ================================================= */}
        <div
          style={{
            position: "absolute",
            left: cardX + 25,
            bottom: 35,
            height: 30,
            paddingLeft: 10,
            paddingRight: 10,
            display: "flex",
            alignItems: "center",
            background: "rgba(25, 24, 23, 0.82)",
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
