import CardGenerator from "./CardGenerator";
import "./styles.css";

const SITE_URL = "https://not-going-to-sui-basecamp.vercel.app";

export const dynamic = "force-dynamic";

function cleanHandle(value = "") {
  return String(value)
    .replace(/^@/, "")
    .replace(/[^A-Za-z0-9_]/g, "")
    .slice(0, 15);
}

function cleanVersion(value = "") {
  return String(value)
    .replace(/[^0-9]/g, "")
    .slice(0, 20);
}

export async function generateMetadata({ searchParams }) {
  // Compatible avec les différentes versions de Next
  const params = await searchParams;

  const rawU = Array.isArray(params?.u)
    ? params.u[0]
    : params?.u || "";

  const rawV = Array.isArray(params?.v)
    ? params.v[0]
    : params?.v || "";

  const handle = cleanHandle(rawU);
  const version = cleanVersion(rawV);

  const title = handle
    ? `@${handle} is not going to Sui Basecamp 2026`
    : "I'm not going to Sui Basecamp 2026";

  const description = handle
    ? `@${handle} won't be at Sui Basecamp 2026. Make your own card.`
    : "Make a card to let everyone know you're not going to Sui Basecamp 2026.";

  // URL de la page partagée
  const pageUrl = new URL("/", SITE_URL);

  if (handle) {
    pageUrl.searchParams.set("u", handle);
  }

  if (version) {
    pageUrl.searchParams.set("v", version);
  }

  // URL de l'image OG
  const ogUrl = new URL("/api/og", SITE_URL);

  if (handle) {
    ogUrl.searchParams.set("u", handle);
  }

  if (version) {
    ogUrl.searchParams.set("v", version);
  }

  return {
    metadataBase: new URL(SITE_URL),

    title,
    description,

    openGraph: {
      title,
      description,
      type: "website",
      url: pageUrl.toString(),
      siteName: "Not Going to Sui Basecamp",
      images: [
        {
          url: ogUrl.toString(),
          width: 1200,
          height: 630,
          alt: title
        }
      ]
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogUrl.toString()]
    }
  };
}

export default function Page() {
  return <CardGenerator />;
}
