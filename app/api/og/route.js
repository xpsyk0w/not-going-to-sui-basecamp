import { ImageResponse } from "next/og";

export const runtime = "edge";

function clean(value = "") {
  return String(value)
    .replace(/^@/, "")
    .replace(/[^A-Za-z0-9_]/g, "")
    .slice(0, 15) || "yourhandle";
}

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);

  const h = clean(searchParams.get("u"));
  const avatar = `https://unavatar.io/x/${encodeURIComponent(h)}`;
  const template = `${origin}/basecamp-template-V2.png`;

  const W = 1200;
  const H = 630;

  // base de travail = ton template principal en 1920x1080
  const baseW = 1920;
  const baseH = 1080;

  const scaleX = W / baseW;
  const scaleY = H / baseH;

  // zone PFP de ton template
  const avatarX = 1005 * scaleX;
  const avatarY = 75 * scaleY;
  const avatarW = 817 * scaleX;
  const avatarH = 830 * scaleY;

  // position du @handle dans la barre du template
  const handleX = 1035 * scaleX;
  const handleY = 958 * scaleY;

  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          position: "relative",
          display: "flex",
          background: "#08192a",
          overflow: "hidden"
        }}
      >
        {/* template complet */}
        <img
          src={template}
          width="1200"
          height="630"
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
            width={`${avatarW}px`}
            height={`${avatarH}px`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain"
            }}
          />
        </div>

        {/* handle */}
        <div
          style={{
            position: "absolute",
            left: `${handleX}px`,
            top: `${handleY}px`,
            color: "#ffffff",
            fontSize: "34px",
            fontWeight: 700,
            lineHeight: 1,
            display: "flex"
          }}
        >
          @{h}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630
    }
  );
}
