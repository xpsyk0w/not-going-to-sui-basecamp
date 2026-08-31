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

  const templateUrl = `${SITE_URL}/basecamp-template-V2.png`;
  const avatarUrl = `https://unavatar.io/x/${encodeURIComponent(h)}`;

  const OUT_W = 1200;
  const OUT_H = 630;

  // Template source : 1920x1080
  // On garde EXACTEMENT son ratio.
  const SCALE = OUT_W / 1920; // 0.625

  const TEMPLATE_W = 1200;
  const TEMPLATE_H = 1080 * SCALE; // 675

  // Crop vertical de 22.5 px en haut et en bas
  const TEMPLATE_X = 0;
  const TEMPLATE_Y = (OUT_H - TEMPLATE_H) / 2; // -22.5

  // ======================================================
  // PFP — coordonnées mesurées sur ton vrai template
  // source : x=1015, y=67, w=833, h=835
  // ======================================================

  const avatarX = 1015 * SCALE;
  const avatarY = 67 * SCALE + TEMPLATE_Y;
  const avatarW = 833 * SCALE;
  const avatarH = 835 * SCALE;

  // ======================================================
  // HANDLE — barre déjà présente dans le template
  // source : x=1015, y=902, w=833
  // ======================================================

  const handleX = 1015 * SCALE;
  const handleY = 902 * SCALE + TEMPLATE_Y;
  const handleW = 833 * SCALE;
  const handleH = 109 * SCALE;

  return new ImageResponse(
    (
      <div
        style={{
          width: OUT_W,
          height: OUT_H,
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#05070b",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* TEMPLATE */}
        <img
          src={templateUrl}
          style={{
            position: "absolute",
            left: TEMPLATE_X,
            top: TEMPLATE_Y,
            width: TEMPLATE_W,
            height: TEMPLATE_H,
            display: "block"
          }}
        />

        {/* PFP ENTIÈRE */}
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
            overflow: "hidden",
            background: "#000000"
          }}
        >
          <img
            src={avatarUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              display: "block"
            }}
          />
        </div>

        {/* @HANDLE DANS SA VRAIE BARRE */}
        <div
          style={{
            position: "absolute",
            left: handleX,
            top: handleY,
            width: handleW,
            height: handleH,
            display: "flex",
            alignItems: "center",
            paddingLeft: 16,
            color: "#ffffff",
            fontSize: 32,
            fontWeight: 500,
            lineHeight: 1
          }}
        >
          @{h}
        </div>

        {/* BANDEAU PARTAGE — À GAUCHE, SANS RECOUVRIR LE HANDLE */}
        <div
          style={{
            position: "absolute",
            left: 46,
            bottom: 8,
            width: 520,
            height: 28,
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 10,
            background: "rgba(24, 22, 21, 0.82)",
            color: "#ffffff",
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1,
            whiteSpace: "nowrap"
          }}
        >
          @{h} is not going to Sui Basecamp 2026
        </div>
      </div>
    ),
    {
      width: OUT_W,
      height: OUT_H
    }
  );
}
