import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  // O botão "Entrar" só aparece quando o login com Discord está configurado.
  env: {
    NEXT_PUBLIC_DISCORD_LOGIN:
      process.env.DISCORD_CLIENT_ID && process.env.BETTER_AUTH_SECRET ? "1" : "",
  },
  images: {
    remotePatterns: [
      // Fotos enviadas pelo painel (Vercel Blob) e avatares do Discord
      { protocol: "https", hostname: "*.public.blob.vercel-storage.com" },
      { protocol: "https", hostname: "cdn.discordapp.com" },
    ],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  // A loja ficava em /contas antes de ter dinheiro, level e Unlock All.
  async redirects() {
    return [
      { source: "/contas", destination: "/loja", permanent: true },
      { source: "/contas/:slug", destination: "/loja/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
