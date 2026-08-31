import CardGenerator from "./CardGenerator";
import "./styles.css";

export const dynamic = "force-dynamic";

const SITE_URL = "https://not-going-to-sui-basecamp.vercel.app";

function cleanHandle(value = "") {
  return String(value)
    .replace(/^@/, "")
    .replace(/[^A-Za-z0-9_]/g, "")
    .slice(0, 15);
}

export async function generateMetadata({ searchParams }) {
  const rawU = Array.isArray(searchParams?.u)
    ? searchParams.u[0]
    : searchParams?.u || "";

  const u = cleanHandle(rawU);

  const title = u
    ? `@${u} is not going to Sui Basecamp 2026`
    : "I'm not going to Sui Basecamp 2026";

  const description = u
    ? `@${u} won't be at Sui Basecamp 2026. Generate and share your card.`
    : "Make a card to let everyone know you're not going to Sui Basecamp 2026.";

  const pageUrl = u
    ? `${SITE_URL}/?u=${encodeURIComponent(u)}`
    : `${SITE_URL}/`;

  const imageUrl = u
    ? `${SITE_URL}/api/og?u=${encodeURIComponent(u)}`
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
      type: "website",
      images: [
        {
          url: imageUrl,
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
      images: [imageUrl]
    }
  };
}

export default function Page() {
  return <CardGenerator />;
}
