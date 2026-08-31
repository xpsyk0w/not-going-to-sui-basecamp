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

  const scale = outW / baseW;

  // template 1920x1080 affiché en 1200x675 puis légèrement remonté
  const templateW = 1200;
  const templateH = 675;
  const templateX = 0;
  const templateY = -22;

  // zone PFP
  const avatarX = 1005 * scale;
  const avatarY = 75 * scale + templateY;
  const avatarW = 817 * scale;
  const avatarH = 700 * scale;

  // zone @handle à droite (on la garde)
  const handleX = 1035 * scale;
  const handleY = 795 * scale + templateY;

  return new ImageResponse(
    (
      <div
        style={{
          width: `${outW}px`,
          height: `${outH}px`,
          position: "relative",
          overflow: "hidden",
          display: "flex",
          background: "#08192a",
          fontFamily: "Arial, Helvetica, sans-serif"
        }}
      >
        {/* template */}
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

        {/* PFP */}
        <div
          style={{
            position: "absolute",
            left: `${avatarX}px`,
            top: `${avatarY}px`,
            width: `${avatarW}px`,
            height: `${avatarH}px`,
            overflow: "hidden",
            display: "flex",
            background: "#000"
          }}
        >
          <img
            src={avatar}
            width={avatarW}
            height={avatarH}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "56% 48%",
              display: "block"
            }}
          />
        </div>

        {/* @handle à droite : ON LE GARDE */}
        <div
          style={{
            position: "absolute",
            left: `${handleX}px`,
            top: `${handleY}px`,
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
            fontSize: "28px",
            fontWeight: 500,
            lineHeight: 1
          }}
        >
          @{h}
        </div>

        {/* bandeau du bas : juste DESCENDU */}
        <div
          style={{
            position: "absolute",
            left: "52px",
            right: "52px",
            bottom: "10px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            paddingLeft: "10px",
            paddingRight: "10px",
            background: "rgba(27,25,24,0.82)",
            color: "#ffffff",
            fontSize: "16px",
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
