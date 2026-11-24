/**
 * Andamento dos tickets: nomes, cores e o que o cliente faz em cada etapa.
 * Usado no site e no painel (não fala com o banco).
 */

export const TICKET_STATUSES = [
  "aberto",
  "aguardando_pagamento",
  "pago",
  "aguardando_acesso",
  "em_andamento",
  "entregue",
  "fechado",
] as const;

export type TicketStatus = (typeof TICKET_STATUSES)[number];
export type TicketKind = "servico" | "conta" | "outro";

type Tone = "new" | "money" | "access" | "work" | "done" | "closed";

interface StatusInfo {
  /** Como o cliente vê. */
  label: string;
  /** Como aparece no painel. */
  adminLabel: string;
  tone: Tone;
  /** O que o cliente precisa saber ou fazer agora. */
  hint: string;
}

export const statusInfo: Record<TicketStatus, StatusInfo> = {
  aberto: {
    label: "Aberto",
    adminLabel: "Novo",
    tone: "new",
    hint: "O Freitas vai responder aqui, com o valor e a forma de pagamento. Fica de olho nesta página.",
  },
  aguardando_pagamento: {
    label: "Esperando pagamento",
    adminLabel: "Esperando pagamento",
    tone: "money",
    hint: "Faça o Pix que o Freitas mandou aqui e envie o comprovante nesta conversa (pode ser print).",
  },
  pago: {
    label: "Pagamento confirmado",
    adminLabel: "Pago",
    tone: "access",
    hint: "Pagamento confirmado. O próximo passo é liberar o acesso à sua conta: o Freitas manda um QR Code aqui.",
  },
  aguardando_acesso: {
    label: "Esperando seu acesso",
    adminLabel: "Esperando acesso",
    tone: "access",
    hint: "Abra o app da PlayStation no celular e escaneie o QR Code que o Freitas mandou aqui. Assim você libera o acesso sem passar sua senha.",
  },
  em_andamento: {
    label: "Na sua conta",
    adminLabel: "Fazendo",
    tone: "work",
    hint: "O Freitas está na sua conta fazendo o serviço. Evite entrar no jogo até ele avisar que terminou.",
  },
  entregue: {
    label: "Entregue",
    adminLabel: "Entregue",
    tone: "done",
    hint: "Pronto! As provas estão aqui na conversa. Entre no jogo e confira. Qualquer problema, responda aqui.",
  },
  fechado: {
    label: "Fechado",
    adminLabel: "Fechado",
    tone: "closed",
    hint: "Este ticket foi fechado. Precisa de algo mais? Abra um ticket novo.",
  },
};

export const toneClasses: Record<Tone, string> = {
  new: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
  money: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
  access: "bg-violet-500/15 text-violet-300 ring-violet-400/30",
  work: "bg-brand-500/15 text-brand-300 ring-brand-400/30",
  done: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
  closed: "bg-white/[0.06] text-stone-400 ring-white/10",
};

export function isTicketStatus(value: unknown): value is TicketStatus {
  return typeof value === "string" && (TICKET_STATUSES as readonly string[]).includes(value);
}

/** Etapas mostradas na linha do tempo do ticket, por tipo de pedido. */
export function stepsFor(kind: TicketKind) {
  if (kind === "conta") return ["Pedido", "Pagamento", "Entrega"];
  if (kind === "servico") return ["Pedido", "Pagamento", "Acesso", "Serviço", "Entregue"];
  return [];
}

/**
 * Em qual etapa o ticket está (índice em stepsFor). Etapas antes dela
 * estão feitas. Fechado = -1 (sem etapa atual).
 */
export function currentStep(kind: TicketKind, status: TicketStatus) {
  if (status === "fechado") return -1;
  if (kind === "conta") {
    const map: Partial<Record<TicketStatus, number>> = {
      aberto: 0,
      aguardando_pagamento: 1,
      pago: 2,
      aguardando_acesso: 2,
      em_andamento: 2,
      entregue: 3,
    };
    return map[status] ?? 0;
  }
  const map: Record<Exclude<TicketStatus, "fechado">, number> = {
    aberto: 0,
    aguardando_pagamento: 1,
    pago: 2,
    aguardando_acesso: 2,
    em_andamento: 3,
    entregue: 5,
  };
  return map[status];
}

/** Ticket que ainda está andando (não entregue nem fechado). */
export function isActive(status: TicketStatus) {
  return status !== "entregue" && status !== "fechado";
}

export const LIMITS = {
  /** Tickets andando ao mesmo tempo por pessoa. */
  openPerCustomer: 5,
  message: 2000,
  subject: 80,
  psnId: 32,
  attachmentsPerMessage: 6,
  attachmentBytes: 10 * 1024 * 1024,
};

export const ATTACHMENT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"];
