import type { Platform } from "./products";

/**
 * ⚠️ AVALIAÇÕES DE EXEMPLO, apenas para montar o layout.
 * Substitua por avaliações reais dos clientes antes de publicar
 * (prints do WhatsApp/Discord são ótimos pra isso).
 */
export interface Testimonial {
  name: string;
  handle: string;
  platform: Platform;
  product: string;
  rating: number;
  text: string;
}

export const testimonials: Testimonial[] = [
  {
    name: "Lucas M.",
    handle: "@lucasm",
    platform: "playstation",
    product: "Conta Elite",
    rating: 5,
    text: "Paguei no PIX e em menos de 5 minutos já tava com os dados. Conta exatamente como no anúncio, recomendo demais.",
  },
  {
    name: "Gabriel S.",
    handle: "@gabzin",
    platform: "pc",
    product: "Conta Lendária",
    rating: 5,
    text: "Garagem absurda, dinheiro que não acaba mais. O Freitas tirou todas as minhas dúvidas antes de eu comprar.",
  },
  {
    name: "Rafael T.",
    handle: "@rafa.t",
    platform: "xbox",
    product: "$2 Bilhões",
    rating: 5,
    text: "Achei que ia demorar, mas caiu na minha conta rapidinho. Atendimento muito atencioso do começo ao fim.",
  },
  {
    name: "Matheus A.",
    handle: "@matheusa",
    platform: "pc",
    product: "Unlock All",
    rating: 5,
    text: "Liberou tudo mesmo: roupas, tatuagens, pinturas. Economizei meses de farm. Já indiquei pros amigos.",
  },
  {
    name: "João P.",
    handle: "@joaop",
    platform: "playstation",
    product: "Conta Pro",
    rating: 5,
    text: "Melhor custo-benefício. Bilhão na conta e um monte de carro modificado. Suporte respondeu na hora.",
  },
  {
    name: "Pedro H.",
    handle: "@pedroh",
    platform: "pc",
    product: "Pack Carros Modded",
    rating: 5,
    text: "Os carros ficaram insanos, todo mundo pergunta como eu consegui. Processo simples e rápido.",
  },
  {
    name: "Vinícius R.",
    handle: "@vini.r",
    platform: "xbox",
    product: "Conta Starter",
    rating: 4,
    text: "Pelo preço vale muito a pena. Tive uma dúvida pra trocar o e-mail e me ajudaram passo a passo.",
  },
  {
    name: "Enzo C.",
    handle: "@enzoc",
    platform: "playstation",
    product: "Upar Nível",
    rating: 5,
    text: "Subi pro nível 500 sem esforço. Loja séria, entrega o que promete. Com certeza volto a comprar.",
  },
];
