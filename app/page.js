import CardGenerator from "./CardGenerator";
import "./styles.css";

const SITE_URL = "https://not-going-to-sui-basecamp.vercel.app";

function cleanHandle(value = "") {
  return String(value)
    .replace(/^@/, "")
    .replace(/[^A-Za-z0-9_]/g, "")
    .slice(0, 15);
}

export async function generateMetadata({ searchParams }) {
  const rawHandle = Array.isArray(searchParams?.u)
    ? searchParams.u[0]
    : searchParams?.u || "";

  const handle = cleanHandle(rawHandle);

  const title = handle
    ? `@${handle} is not going to Sui Basecamp 2026`
    : "I'm not going to Sui Basecamp 2026";

  const description = handle
    ? `@${handle} won't be at Sui Basecamp 2026. Make your own card and let everyone know you're not going.`
    : "Make your own card and let everyone know you're not going to Sui Basecamp 2026.";

  const pageUrl = handle
    ? `${SITE_URL}/?u=${encodeURIComponent(handle)}`
    : SITE_URL;

  const ogImage = handle
    ? `${SITE_URL}/api/og?u=${encodeURIComponent(handle)}`
    : `${SITE_URL}/api/og`;

  return {
    metadataBase: new URL(SITE_URL),

    title,
    description,

    alternates: {
      canonical: pageUrl
    },

    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: "Not Going To Sui Basecamp",
      type: "website",
      images: [
        {
          url: ogImage,
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
      images: [ogImage]
    }
  };
}

export default function Page() {
  return <CardGenerator />;
}
