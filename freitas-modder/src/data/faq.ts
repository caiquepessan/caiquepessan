import { siteConfig } from "@/config/site";

const { warrantyDays, avgDeliveryMinutes, supportHours } = siteConfig.business;

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "Como eu recebo a minha conta?",
    answer: `Assim que o pagamento é confirmado, você recebe os dados de acesso (e-mail e senha) pelo WhatsApp ou Discord. Em média a entrega leva menos de ${avgDeliveryMinutes} minutos.`,
  },
  {
    question: "Quais são as formas de pagamento?",
    answer:
      "Aceitamos PIX, com aprovação na hora, e cartão de crédito. Você finaliza o pedido pelo WhatsApp e recebe as instruções de pagamento na mesma conversa.",
  },
  {
    question: "A conta fica sendo minha de verdade?",
    answer:
      "Sim. As contas são entregues com acesso completo: você troca o e-mail e a senha e passa a ser o único dono. A gente te ajuda nesse passo a passo.",
  },
  {
    question: "Tem garantia?",
    answer: `Tem. Todos os produtos têm garantia de ${warrantyDays} dias. Se acontecer qualquer problema com o que você comprou nesse período, a gente repõe ou resolve sem custo.`,
  },
  {
    question: "Existe risco de banimento?",
    answer:
      "Qualquer modificação vai contra os termos do jogo, então nenhuma loja pode prometer risco zero (desconfie de quem promete). O que a gente garante: métodos testados, milhares de entregas e a garantia de reposição dentro do prazo.",
  },
  {
    question: "Como funcionam os serviços na minha própria conta?",
    answer:
      "Nos serviços de dinheiro, Unlock All, nível e carros, precisamos de acesso temporário à sua conta. Assim que terminamos, você é avisado e recomendamos trocar a senha.",
  },
  {
    question: "Funciona em qual plataforma?",
    answer:
      "Trabalhamos com PC (Steam, Epic e Rockstar), PlayStation (PS4 e PS5) e Xbox (One e Series X|S). É só escolher a plataforma na página do produto.",
  },
  {
    question: "Qual o horário de atendimento?",
    answer: `${supportHours}. Pedidos feitos fora desse horário são entregues assim que o atendimento volta.`,
  },
];
