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

  const template = `${SITE_URL}/basecamp-template-V2.png`;
  const avatar = `https://unavatar.io/x/${encodeURIComponent(h)}`;

  // Taille finale preview X
  const outW = 1200;
  const outH = 630;

  // Taille du template principal
  const baseW = 1920;
  const baseH = 1080;

  const scaleX = outW / baseW;
  const scaleY = outH / baseH;

  // Zone PFP de ton template
  const avatarX = 1005 * scaleX;
  const avatarY = 75 * scaleY;
  const avatarW = 817 * scaleX;
  const avatarH = 700 * scaleY;

  // Texte @handle dans la barre prévue
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
          background: "#0b1725"
        }}
      >
        {/* Template complet */}
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
              objectFit: "contain"
            }}
          />
        </div>

        {/* @handle */}
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
        lineHeight: 1,
        fontFamily: "Arial"
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
