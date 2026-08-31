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

  const scaleX = outW / 1920;
  const scaleY = outH / 1080;

  // PFP
  const avatarX = 1005 * scaleX;
  const avatarY = 75 * scaleY;
  const avatarW = 817 * scaleX;
  const avatarH = 830 * scaleY;

  // Barre du @handle déjà présente dans le template
  const handleX = 1005 * scaleX;
  const handleY = 905 * scaleY;
  const handleW = 817 * scaleX;
  const handleH = 105 * scaleY;

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
            inset: 0,
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

        {/* @HANDLE SOUS LA PFP */}
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

        {/* BANDEAU DE PARTAGE — plus fin et plus haut */}
        <div
          style={{
            position: "absolute",
            left: 46,
            right: 46,
            bottom: 48,
            height: 30,
            display: "flex",
            alignItems: "center",
            paddingLeft: 10,
            background: "rgba(28, 27, 26, 0.82)",
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
