/**
 * Páginas feitas para busca no Google, uma por tipo de produto. Cada uma
 * tem endereço, título, texto e dúvidas próprios, e mostra os produtos da
 * categoria com os preços atuais do painel.
 */
import { siteConfig } from "@/config/site";
import type { FaqItem } from "./faq";
import type { Category } from "./products";

export interface Landing {
  slug: string;
  category: Category;
  /** Texto curto do link (rodapé, migalhas, "veja também"). */
  short: string;
  /** Título da aba e do Google (o nome da loja entra no fim sozinho). */
  title: string;
  description: string;
  h1: string;
  kicker: string;
  intro: string[];
  highlights: { title: string; text: string }[];
  faq: FaqItem[];
  keywords: string[];
}

const warranty = `Garantia de ${siteConfig.business.warrantyDays} dias`;
const noPassword = {
  question: "Preciso passar minha senha?",
  answer:
    "Não. O Freitas manda um QR Code no ticket e você escaneia com o app da PlayStation no celular. Isso libera a entrada dele na sua conta sem passar e-mail nem senha.",
};

export const landings: Landing[] = [
  {
    slug: "dinheiro-gta-5-online",
    category: "dinheiro",
    short: "Dinheiro no GTA 5",
    title: "Dinheiro no GTA 5 Online para PS4 e PS5",
    description:
      "Dinheiro no GTA 5 Online para PS4 e PS5, colocado pelo Freitas direto na sua conta. Pix, acesso por QR Code e sem passar senha.",
    h1: "Dinheiro no GTA 5 Online",
    kicker: "PS4 e PS5 · direto na sua conta",
    intro: [
      "Cansou de farmar golpe, assalto e venda de carro pra juntar dinheiro no GTA 5 Online? O Freitas coloca os milhões direto no seu personagem, no PS4 ou no PS5, pelo mesmo preço.",
      "Você escolhe o pacote, paga no Pix e libera o acesso à sua conta por QR Code no app da PlayStation, sem passar senha. Ele entra, coloca o dinheiro e manda os prints do saldo como prova.",
    ],
    highlights: [
      { title: "Mesmo preço no PS4 e no PS5", text: "Escolhe o console no pedido e o valor não muda." },
      { title: "Quanto maior, mais barato", text: "No maior pacote, cada milhão sai pelo menor preço da loja." },
      { title: "Sem passar senha", text: "O acesso é liberado por QR Code no app da PlayStation." },
      { title: "Prova e garantia", text: `Prints do saldo no ticket. ${warranty}.` },
    ],
    faq: [
      {
        question: "Quanto custa dinheiro no GTA 5 Online?",
        answer:
          "Os preços de cada pacote estão nesta página, sempre atualizados. Quanto maior o pacote, mais barato sai cada milhão.",
      },
      {
        question: "O dinheiro vai mesmo para a minha conta?",
        answer:
          "Vai. O Freitas entra na sua conta com o acesso que você libera por QR Code, coloca o valor no seu personagem e manda os prints do saldo no ticket.",
      },
      {
        question: "Funciona no PS4 e no PS5?",
        answer: "Funciona nos dois, pelo mesmo preço. Você só escolhe o console na hora do pedido.",
      },
      noPassword,
    ],
    keywords: ["dinheiro gta 5 online", "comprar dinheiro gta 5 ps4", "dinheiro gta 5 ps5", "milhões gta online"],
  },
  {
    slug: "up-de-level-gta-5",
    category: "level",
    short: "Up de level no GTA 5",
    title: "Up de level no GTA 5 Online para PS4 e PS5",
    description:
      "Up de level no GTA 5 Online para PS4 e PS5: o Freitas sobe o rank do seu personagem direto na sua conta. Pix e sem passar senha.",
    h1: "Up de level no GTA 5 Online",
    kicker: "PS4 e PS5 · rank alto no seu personagem",
    intro: [
      "Level alto libera armas, roupas, veículos e melhorias que só aparecem com rank. Em vez de passar semanas repetindo missão, o Freitas sobe o level do seu personagem direto na sua conta.",
      "Você pede pelo site, paga no Pix e libera o acesso por QR Code no app da PlayStation, sem passar senha. Quando termina, ele manda os prints do level novo no ticket.",
    ],
    highlights: [
      { title: "Mais coisas liberadas", text: "Armas, roupas e veículos que dependem de rank." },
      { title: "Mesmo preço no PS4 e no PS5", text: "Você escolhe o console e o valor não muda." },
      { title: "Sem passar senha", text: "O acesso é liberado por QR Code no app da PlayStation." },
      { title: "Prova e garantia", text: `Prints do level no ticket. ${warranty}.` },
    ],
    faq: [
      {
        question: "Quanto custa subir de level no GTA 5 Online?",
        answer:
          "Os pacotes e preços estão nesta página, sempre atualizados. Nos pacotes maiores, cada level sai mais barato.",
      },
      {
        question: "O level sobe no meu personagem?",
        answer:
          "Sobe. O Freitas faz direto na sua conta, depois que você libera o acesso por QR Code, e manda os prints do level novo.",
      },
      {
        question: "Dá para pedir uma quantidade diferente?",
        answer: "Dá. Abra um ticket com \"Outro assunto\" e diga quantos levels quer que o Freitas passa o preço.",
      },
      noPassword,
    ],
    keywords: ["up de level gta 5", "subir level gta 5 online", "level gta 5 ps4", "rp gta online ps5"],
  },
  {
    slug: "unlock-all-gta-5",
    category: "servico",
    short: "Unlock All no GTA 5",
    title: "Unlock All com Corrida Modder no GTA 5 para PS4 e PS5",
    description:
      "Unlock All com Corrida Modder no GTA 5 Online para PS4 e PS5: tatuagens, estampas, Los Santos Customs e skills no máximo, na sua conta.",
    h1: "Unlock All no GTA 5 Online",
    kicker: "Com Corrida Modder · PS4 e PS5",
    intro: [
      "O Unlock All libera de uma vez o que levaria meses: todas as tatuagens, as estampas de armas, tudo na Los Santos Customs e as skills no máximo. No combo vem junto a Corrida Modder, que deixa o personagem muito mais rápido e ágil no PvP.",
      "O serviço é feito pelo Freitas dentro da sua conta, no PS4 ou no PS5. Você libera o acesso por QR Code, sem passar senha, e recebe os prints quando estiver pronto. O preço é por personagem.",
    ],
    highlights: [
      { title: "Tudo de uma vez", text: "Tatuagens, estampas, Los Santos Customs e skills no máximo." },
      { title: "Corrida Modder", text: "O personagem corre muito mais rápido e fica mais ágil no PvP." },
      { title: "Sem passar senha", text: "O acesso é liberado por QR Code no app da PlayStation." },
      { title: "Desbloqueio definitivo", text: `Fica no seu personagem. ${warranty}.` },
    ],
    faq: [
      {
        question: "O que vem no Unlock All?",
        answer:
          "Todas as tatuagens, todas as estampas de armas, tudo liberado na Los Santos Customs e as skills no máximo. A lista completa está na página do combo.",
      },
      {
        question: "O que é a Corrida Modder?",
        answer:
          "É o que faz o seu personagem correr muito mais rápido e ficar mais ágil no PvP. Ela vem no combo com o Unlock All.",
      },
      {
        question: "O preço é por conta ou por personagem?",
        answer: "Por personagem. Se quiser nos dois personagens da conta, é só avisar no ticket.",
      },
      noPassword,
    ],
    keywords: ["unlock all gta 5", "unlock all gta 5 ps4", "unlock all gta online ps5", "corrida modder gta"],
  },
  {
    slug: "conta-modada-gta-5",
    category: "conta",
    short: "Conta modada de GTA 5",
    title: "Conta modada de GTA 5 Online para PS4 e PS5",
    description:
      "Contas modadas de GTA 5 Online para PS4 e PS5, com level alto e milhões no banco. Unidade única: pergunte o preço pelo ticket.",
    h1: "Conta modada de GTA 5",
    kicker: "Pronta para jogar · PS4 e PS5",
    intro: [
      "Quer começar já com tudo? As contas prontas chegam com level alto, milhões no banco e itens liberados. Cada uma é unidade única, então o preço é combinado no ticket.",
      "Aqui não precisa liberar acesso: depois do pagamento você recebe o e-mail e a senha da conta pelo ticket, troca na hora e a conta passa a ser sua.",
    ],
    highlights: [
      { title: "Pronta para jogar", text: "Level alto, milhões no banco e itens liberados." },
      { title: "Unidade única", text: "Cada conta é uma só. Quando vende, sai da loja." },
      { title: "Login pelo ticket", text: "E-mail e senha chegam no ticket depois do Pix." },
      { title: "Garantia", text: `${warranty} depois da entrega.` },
    ],
    faq: [
      {
        question: "Como recebo a conta?",
        answer: "Depois do pagamento, o Freitas manda o e-mail e a senha da conta no ticket.",
      },
      {
        question: "Posso trocar o e-mail e a senha?",
        answer: "Pode e deve. Troque assim que entrar: a conta passa a ser sua.",
      },
      {
        question: "Como sei o preço?",
        answer: "Cada conta é unidade única. Abra o ticket pela página da conta e o Freitas responde com o valor.",
      },
      {
        question: "E se não tiver conta disponível?",
        answer: "Abra um ticket com \"Outro assunto\" e diga o que procura. Quando entrar uma conta parecida, o Freitas avisa.",
      },
    ],
    keywords: ["conta modada gta 5", "conta gta 5 ps4 modada", "conta gta online ps5", "comprar conta gta 5"],
  },
];

export function getLanding(slug: string) {
  return landings.find((l) => l.slug === slug);
}

export function landingForCategory(category: Category) {
  return landings.find((l) => l.category === category);
}
