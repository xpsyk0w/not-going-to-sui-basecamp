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

  // OG X
  const outW = 1200;
  const outH = 630;

  // Template original : 1920 × 1080
  // On le passe en 1200 × 675 sans déformation,
  // puis on crop légèrement en haut/bas.
  const scale = 1200 / 1920;

  const templateW = 1200;
  const templateH = 675;

  const templateX = 0;
  const templateY = -22.5;

  // Zone noire exacte de la PFP dans ton template
  const avatarX = 1015 * scale;
  const avatarY = 67 * scale + templateY;
  const avatarW = 833 * scale;
  const avatarH = 835 * scale;

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
        {/* TEMPLATE */}
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

        {/* PFP DYNAMIQUE */}
        <div
          style={{
            position: "absolute",
            left: avatarX,
            top: avatarY,
            width: avatarW,
            height: avatarH,
            display: "flex",
            overflow: "hidden",
            background: "#000"
          }}
        >
          <img
            src={avatarUrl}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center",
              display: "block"
            }}
          />
        </div>

        {/* BANDEAU COMME SUR LE SITE ORIGINAL */}
        <div
          style={{
            position: "absolute",
            left: 46,
            right: 46,
            bottom: 27,
            height: 34,
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            paddingRight: 10,
            background: "rgba(27, 25, 24, 0.86)",
            color: "#ffffff",
            fontSize: 18,
            fontWeight: 500,
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
