import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pdf-parse (via pdfjs-dist) resolves its worker file relative to its own package on disk —
  // bundling it breaks that. Keep it as a real require() at runtime instead.
  serverExternalPackages: ["pdf-parse"],
};

export default nextConfig;
