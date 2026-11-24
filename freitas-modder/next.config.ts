import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

/**
 * Domínio oficial (variável NEXT_PUBLIC_SITE_URL, ex.: https://freitasmodder.com).
 * Quando é um domínio próprio, o endereço antigo da Vercel leva para ele: assim
 * o Google vê um endereço só e o login com Discord acontece sempre no mesmo lugar.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "");
const OLD_VERCEL_HOST = "freitas-modder.vercel.app";
const moveToSiteDomain =
  siteUrl && !siteUrl.endsWith(".vercel.app")
    ? [
        {
          source: "/:path*",
          has: [{ type: "host" as const, value: OLD_VERCEL_HOST }],
          destination: `${siteUrl}/:path*`,
          permanent: true,
        },
      ]
    : [];

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
  async redirects() {
    return [
      // Primeiro o domínio, para quem vem do endereço antigo dar um pulo só.
      ...moveToSiteDomain,
      // A loja ficava em /contas antes de ter dinheiro, level e Unlock All.
      { source: "/contas", destination: "/loja", permanent: true },
      { source: "/contas/:slug", destination: "/loja/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
