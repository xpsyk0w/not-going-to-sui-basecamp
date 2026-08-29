const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: "I'm not going to Sui Basecamp 2026",
  description: "Make a card to let everyone know you're not going to Sui Basecamp 2026."
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
