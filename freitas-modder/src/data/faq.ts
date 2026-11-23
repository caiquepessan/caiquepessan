import { siteConfig } from "@/config/site";

const { warrantyDays, avgDeliveryMinutes, supportHours } = siteConfig.business;

export interface FaqItem {
  question: string;
  answer: string;
}

export const faq: FaqItem[] = [
  {
    question: "Como eu recebo a conta?",
    answer: `Quando o Pix cai, a gente manda o e-mail e a senha da conta no seu WhatsApp. Costuma levar menos de ${avgDeliveryMinutes} minutos.`,
  },
  {
    question: "Serve no PS4 e no PS5?",
    answer:
      "Serve, mas a conta é diferente pra cada console. Por isso você escolhe PS4 ou PS5 antes de comprar, e o preço muda conforme a versão.",
  },
  {
    question: "A conta fica minha mesmo?",
    answer:
      "Fica. Você troca o e-mail e a senha da PSN assim que recebe e passa a ser o único dono. Se precisar, a gente te ajuda nesse passo.",
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
  {
    question: "Como funcionam os serviços na minha conta?",
    answer:
      "Pra colocar dinheiro, nível, carros ou Unlock All no seu personagem, a gente precisa entrar na sua PSN por um tempo. Quando termina, te avisa no WhatsApp e você troca a senha.",
  },
  {
    question: "Qual o horário de atendimento?",
    answer: `${supportHours}. Pedido feito fora desse horário é entregue assim que o atendimento volta.`,
  },
];
