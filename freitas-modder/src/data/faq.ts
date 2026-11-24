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
      "Você escolhe o pacote e faz o pedido pelo site. O pedido vira um ticket, onde o Freitas responde com o valor e a chave Pix. Depois do pagamento, ele entra na sua conta, faz o serviço e manda as provas.",
  },
  {
    question: "O Freitas precisa entrar na minha conta?",
    answer:
      "Precisa. Dinheiro, level e Unlock All são feitos por ele dentro da sua conta da PSN. Por isso, depois do pagamento, você libera o acesso dele pelo ticket.",
  },
  {
    question: "Preciso passar minha senha?",
    answer:
      "Não. O Freitas manda um QR Code no ticket e você escaneia com o app da PlayStation no celular. Isso libera a entrada dele na sua conta sem você passar e-mail nem senha.",
  },
  {
    question: "Como acompanho meu pedido?",
    answer:
      "Pelo ticket, em \"Seus tickets\" no menu da sua conta. Lá aparece em que etapa está (pagamento, acesso, serviço, entregue), as mensagens do Freitas e as provas da entrega.",
  },
  {
    question: "Serve no PS4 e no PS5?",
    answer:
      "Serve nos dois, pelo mesmo preço. Você só escolhe o console pra gente saber onde fazer.",
  },
  {
    question: "Quanto tempo demora?",
    answer:
      "A entrega é rápida. O Freitas passa o prazo certinho no ticket antes de você pagar, e o serviço começa assim que você libera o acesso.",
  },
  {
    question: "O que é a Corrida Modder?",
    answer:
      "É o que faz o seu personagem correr muito mais rápido e ficar mais ágil no PvP. Ela vem no combo com o Unlock All, e o preço é por personagem.",
  },
  {
    question: "Vocês vendem conta pronta?",
    answer:
      "Às vezes. Quando tem, ela aparece na loja com level, dinheiro e o que mais vem nela. O preço você pergunta pelo ticket, e depois de pagar recebe o e-mail e a senha da conta pra trocar na hora.",
  },
  {
    question: "Quais são as formas de pagamento?",
    answer:
      "Pix ou cartão de crédito. Os dados de pagamento chegam no ticket, e você manda o comprovante lá mesmo.",
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
