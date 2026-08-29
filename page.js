import CardGenerator from "./CardGenerator";
import "./styles.css";

function cleanHandle(value = "") {
  return String(value).replace(/^@/, "").replace(/[^A-Za-z0-9_]/g, "").slice(0,15);
}

export async function generateMetadata({ searchParams }) {
  const u = cleanHandle(searchParams?.u || "");
  const title = u ? `@${u} is not going to Sui Basecamp 2026` : "I'm not going to Sui Basecamp 2026";
  const description = u ? `@${u} won't be at Sui Basecamp 2026.` : "Make a card to let everyone know you're not going to Sui Basecamp 2026.";
  const image = u ? `/api/og?u=${encodeURIComponent(u)}` : "/api/og";
  return {
    title,
    description,
    openGraph: { title, description, type: "website", images: [{url:image,width:1200,height:630,alt:title}] },
    twitter: { card:"summary_large_image", title, description, images:[image] }
  };
}

export default function Page(){ return <CardGenerator/>; }
