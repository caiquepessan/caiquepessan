import { siteConfig } from "@/config/site";

const { warrantyDays, supportHours } = siteConfig.business;

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "Como funciona a compra?",
    answer:
      "Você escolhe o pacote no site, finaliza pelo WhatsApp e paga no Pix. A gente faz no seu personagem e avisa quando estiver pronto.",
  },
  {
    question: "Serve no PS4 e no PS5?",
    answer:
      "Serve nos dois, pelo mesmo preço. Você só escolhe o console pra gente saber onde fazer.",
  },
  {
    question: "Quanto tempo demora?",
    answer:
      "A entrega é rápida. Antes de você pagar, a gente já te passa o prazo certinho no WhatsApp.",
  },
  {
    question: "O que é a Corrida Modder?",
    answer:
      "É o que faz o seu personagem correr muito mais rápido e ficar mais ágil no PvP. Ela vem no combo com o Unlock All, e o preço é por personagem.",
  },
  {
    question: "Vocês vendem conta pronta?",
    answer:
      "Às vezes. Quando tem, ela aparece na loja com level, dinheiro e o que mais vem nela. O preço você pergunta no WhatsApp, e depois de pagar recebe o e-mail e a senha pra trocar na hora.",
  },
  {
    question: "Quais são as formas de pagamento?",
    answer:
      "Pix ou cartão de crédito. Você fecha o pedido no WhatsApp e recebe os dados de pagamento na mesma conversa.",
  },
  {
    question: "Tem garantia?",
    answer: `Tem, de ${warrantyDays} dias em tudo que você comprar. Se der problema nesse prazo, a gente repõe ou resolve sem custo.`,
  },
  {
    question: "Corro risco de levar ban?",
    answer:
      "Toda modificação vai contra as regras do jogo, então ninguém consegue garantir risco zero. O que a gente faz é usar métodos que já foram testados muitas vezes e cobrir qualquer problema com a garantia.",
  },
  // Só aparece quando o horário estiver preenchido em src/config/site.ts
  ...(supportHours
    ? [
        {
          question: "Qual o horário de atendimento?",
          answer: `${supportHours}. Pedido feito fora desse horário é entregue assim que o atendimento volta.`,
        },
      ]
    : []),
];
