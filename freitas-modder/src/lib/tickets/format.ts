import { formatBRL } from "@/lib/utils";

const dateTime = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "America/Sao_Paulo",
});

/** "24/11 às 14:32" (horário de Brasília). */
export function formatWhen(date: Date | string) {
  return dateTime.format(new Date(date)).replace(", ", " às ");
}

/** Centavos para "R$ 120,00". */
export function formatCents(cents: number) {
  return formatBRL(cents / 100);
}
