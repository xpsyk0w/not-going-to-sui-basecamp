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

  // IMPORTANT : on utilise bien le NOUVEAU template clean
  const template = `${SITE_URL}/basecamp-template-V2.png`;
  const avatar = `https://unavatar.io/x/${encodeURIComponent(h)}`;

  const outW = 1200;
  const outH = 630;

  const baseW = 1920;
  const baseH = 1080;

  const scaleX = outW / baseW;
  const scaleY = outH / baseH;

  // Zone PFP du template V2
  const avatarX = 1005 * scaleX;
  const avatarY = 75 * scaleY;
  const avatarW = 817 * scaleX;
  const avatarH = 700 * scaleY;

  // Barre du @handle déjà présente dans ton template
  const handleX = 1035 * scaleX;
  const handleY = 795 * scaleY;

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
        {/* Template clean */}
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

        {/* PFP dynamique */}
        <div
          style={{
            position: "absolute",
            left: `${avatarX}px`,
            top: `${avatarY}px`,
            width: `${avatarW}px`,
            height: `${avatarH}px`,
            overflow: "hidden",
            display: "flex"
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
              objectPosition: "56% 48%"
            }}
          />
        </div>

        {/* @handle */}
        <div
          style={{
            position: "absolute",
            left: `${handleX}px`,
            top: `${handleY}px`,
            display: "flex",
            alignItems: "center",
            color: "#ffffff",
            fontSize: `${58 * scaleY}px`,
            fontWeight: 700,
            lineHeight: 1
          }}
        >
          @{h}
        </div>
      </div>
    ),
    {
      width: outW,
      height: outH
    }
  );
}
