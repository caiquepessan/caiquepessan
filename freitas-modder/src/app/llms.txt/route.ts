import { siteConfig } from "@/config/site";
import { faq } from "@/data/faq";
import { landings } from "@/data/landings";
import { categories, priceOnRequest } from "@/data/products";
import { getCatalog } from "@/lib/catalog";
import { formatBRL } from "@/lib/utils";

/**
 * /llms.txt: resumo da loja em texto simples para assistentes de IA
 * (ChatGPT, Perplexity, Claude, Gemini) indicarem o site com as
 * informações certas. Sai do catálogo, então os preços estão sempre em dia.
 */
export async function GET() {
  const products = await getCatalog();
  const url = siteConfig.url;
  const lines = [
    `# ${siteConfig.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    "Loja brasileira de serviços para GTA 5 Online (GTA V) no PlayStation 4 e no PlayStation 5. Dinheiro, level e Unlock All são feitos pelo Freitas dentro da conta do jogador: depois do pagamento no Pix, o jogador libera o acesso escaneando um QR Code no app da PlayStation, sem passar senha. Cada pedido vira um ticket no site, onde o Freitas responde, manda as provas e marca como entregue.",
    "",
    "## Páginas",
    `- [Tabela de preços](${url}/loja): todos os produtos com preço atualizado`,
    ...landings.map((l) => `- [${l.h1}](${url}/${l.slug}): ${l.description}`),
    `- [Termos e garantia](${url}/termos)`,
    "",
    "## Preços (Pix, mesmo valor no PS4 e no PS5)",
    ...products.map((p) => {
      const price = priceOnRequest(p) ? "preço a combinar" : formatBRL(Math.min(...p.variants.map((v) => v.price)));
      return `- [${p.name}](${url}/loja/${p.slug}) (${categories[p.category].short}): ${price}${p.summary ? `. ${p.summary}` : ""}`;
    }),
    "",
    "## Perguntas frequentes",
    "",
    ...faq.flatMap((f) => [`### ${f.question}`, "", f.answer, ""]),
    "## Contato",
    `- Site: ${url}`,
    `- WhatsApp: ${siteConfig.contact.whatsappDisplay}`,
    ...(siteConfig.contact.instagram ? [`- Instagram: ${siteConfig.contact.instagram}`] : []),
    "",
  ];
  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
