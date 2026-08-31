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

  // ======================================================
  // OG
  // ======================================================

  const outW = 1200;
  const outH = 630;

  /*
   * Template original : 1920 × 1080
   *
   * On le redimensionne en 1200 × 675.
   * Même ratio, donc AUCUNE déformation.
   *
   * Puis on retire 22.5 px en haut et en bas
   * pour obtenir exactement 1200 × 630.
   */

  const scale = 1200 / 1920; // 0.625

  const templateW = 1200;
  const templateH = 675;

  const templateX = 0;
  const templateY = -22.5;

  // ======================================================
  // PFP
  //
  // Coordonnées RÉELLES du rectangle noir
  // dans basecamp-template-V2.png :
  //
  // x = 1015
  // y = 67
  // width = 833
  // height = 835
  // ======================================================

  const avatarX = 1015 * scale;
  const avatarY = 67 * scale + templateY;
  const avatarW = 833 * scale;
  const avatarH = 835 * scale;

  // ======================================================
  // BARRE @HANDLE
  //
  // Elle commence exactement après la PFP :
  // y = 902
  // ======================================================

  const handleX = 1015 * scale;
  const handleY = 902 * scale + templateY;
  const handleW = 833 * scale;
  const handleH = 109 * scale;

  return new ImageResponse(
    (
      <div
        style={{
          width: outW,
          height: outH,
          position: "relative",
          display: "flex",
          overflow: "hidden",
          background: "#05070b",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* ================================================
            TEMPLATE
        ================================================= */}

        <img
          src={templateUrl}
          style={{
            position: "absolute",
            left: templateX,
            top: templateY,
            width: templateW,
            height: templateH,
            display: "block"
          }}
        />

        {/* ================================================
            PFP
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

        {/* ================================================
            @HANDLE
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
            fontSize: 36,
            fontWeight: 500,
            lineHeight: 1
          }}
        >
          @{h}
        </div>

        {/* ================================================
            BANDEAU X
        ================================================= */}

        <div
          style={{
            position: "absolute",
            left: 46,
            right: 46,
            top: 579,
            height: 29,
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            background: "rgba(25, 24, 23, 0.82)",
            color: "#ffffff",
            fontSize: 18,
            fontWeight: 400,
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
