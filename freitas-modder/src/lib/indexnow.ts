import "server-only";
import { siteConfig } from "@/config/site";
import { landingForCategory } from "@/data/landings";
import type { Category } from "@/data/products";

/**
 * IndexNow: avisa Bing, Yandex e outros buscadores na hora em que um
 * produto muda (o Bing também alimenta o ChatGPT e o Copilot). A chave é
 * pública de propósito: fica em /<chave>.txt para provar que o site é nosso.
 */
export const INDEXNOW_KEY = "78009051639b71bd2a602fa942415a5f";

/** Páginas que mudam quando um produto muda. */
export function pathsForProduct(slug: string, category: Category) {
  const landing = landingForCategory(category);
  return ["/", "/loja", `/loja/${slug}`, ...(landing ? [`/${landing.slug}`] : [])];
}

export async function pingIndexNow(paths: string[]) {
  // Só o site de verdade (nada de teste, preview ou computador)
  if (process.env.VERCEL_ENV !== "production") return;
  const host = new URL(siteConfig.url).host;
  if (host.endsWith(".vercel.app") || host.startsWith("localhost")) return;
  try {
    const response = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: INDEXNOW_KEY,
        keyLocation: `${siteConfig.url}/${INDEXNOW_KEY}.txt`,
        urlList: [...new Set(paths)].map((p) => `${siteConfig.url}${p}`),
      }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok && response.status !== 202) console.error("[indexnow] resposta", response.status);
  } catch (error) {
    console.error("[indexnow] não consegui avisar", error);
  }
}
