/**
 * Teste dos tickets num Postgres em memória (PGlite): abre, conversa,
 * muda o andamento e confere avisos de "não lido" e filtros do painel.
 * Uso: npm run db:test
 */
import { PGlite } from "@electric-sql/pglite";
import { drizzle } from "drizzle-orm/pglite";
import { migrate } from "drizzle-orm/pglite/migrator";
import * as schema from "../src/db/schema";
import {
  addMessage,
  adminCounts,
  countActiveForUser,
  createTicket,
  getTicketByNumber,
  listTicketsForAdmin,
  listTicketsForUser,
  markSeen,
  setStatus,
  unreadCountForUser,
  type TicketsDb,
} from "../src/lib/tickets/repo";

function check(condition: unknown, message: string) {
  if (!condition) {
    console.error("FALHOU:", message);
    process.exit(1);
  }
  console.log("ok -", message);
}

async function main() {
  const pg = drizzle(new PGlite(), { schema });
  await migrate(pg, { migrationsFolder: "drizzle" });
  const db = pg as unknown as TicketsDb;

  await pg.insert(schema.user).values([
    { id: "u1", name: "Cliente Um", email: "um@exemplo.com" },
    { id: "u2", name: "Cliente Dois", email: "dois@exemplo.com" },
    { id: "admin", name: "Freitas", email: "freitas@exemplo.com" },
  ]);
  await pg.insert(schema.account).values({
    id: "a1",
    accountId: "123456789012345678",
    providerId: "discord",
    userId: "u1",
  });

  const first = await createTicket(db, {
    userId: "u1",
    kind: "servico",
    subject: "$500 milhões (PS5)",
    platform: "ps5",
    psnId: "jogador_123",
    items: [{ slug: "dinheiro-500-milhoes", name: "$500 milhões", platform: "ps5", qty: 1, unitPrice: 12000 }],
    total: 12000,
    message: "Quero o de 500!",
  });
  check(first.number === 1001, "primeiro ticket recebe o número #1001");

  const second = await createTicket(db, {
    userId: "u2",
    kind: "outro",
    subject: "Dúvida sobre level",
    platform: null,
    psnId: null,
    items: [],
    total: null,
    message: "",
  });
  check(second.number === 1002, "segundo ticket recebe #1002");

  let full = await getTicketByNumber(db, 1001);
  check(full?.messages.length === 2, "ticket com mensagem do cliente tem sistema + cliente");
  check(full?.customer.discordId === "123456789012345678", "traz o ID do Discord do cliente");
  check((await getTicketByNumber(db, 1002))?.messages.length === 1, "sem mensagem, fica só a de sistema");
  check((await getTicketByNumber(db, 9999)) === null, "número que não existe volta null");

  check((await adminCounts(db)).attention === 2, "painel: 2 tickets pedindo atenção");
  await markSeen(db, first.id, "freitas");
  check((await adminCounts(db)).attention === 1, "depois de abrir, sobra 1 pedindo atenção");

  await addMessage(db, { ticketId: first.id, authorId: "admin", role: "freitas", body: "Fechado! Pix: chave X" });
  check((await unreadCountForUser(db, "u1")) === 1, "resposta do Freitas aparece como não lida pro cliente");
  await markSeen(db, first.id, "cliente");
  check((await unreadCountForUser(db, "u1")) === 0, "cliente abriu: zera");

  check(await setStatus(db, { ticketId: first.id, status: "aguardando_pagamento", authorId: "admin" }), "muda para esperando pagamento");
  check(!(await setStatus(db, { ticketId: first.id, status: "aguardando_pagamento", authorId: "admin" })), "mesmo status de novo não duplica");

  await addMessage(db, {
    ticketId: first.id,
    authorId: "u1",
    role: "cliente",
    body: "Paguei",
    attachments: [
      { url: "https://x.private.blob.vercel-storage.com/tickets/a/b.png", pathname: "tickets/a/b.png", contentType: "image/png", size: 10, name: "b.png", private: true },
    ],
  });
  check((await adminCounts(db)).attention === 2, "comprovante do cliente volta a pedir atenção (os 2 tickets)");

  for (const status of ["pago", "aguardando_acesso", "em_andamento", "entregue"] as const) {
    await setStatus(db, { ticketId: first.id, status, authorId: "admin" });
  }
  full = await getTicketByNumber(db, 1001);
  check(full?.status === "entregue", "ticket chega em entregue");
  check(full?.messages.at(-1)?.body === "Andamento: Entregue.", "cada mudança fica registrada na conversa");
  check(full?.messages.some((m) => m.attachments.length === 1), "anexo guardado na mensagem");
  check((await countActiveForUser(db, "u1")) === 0, "entregue não conta como andando");
  check((await countActiveForUser(db, "u2")) === 1, "o outro cliente tem 1 andando");

  check((await listTicketsForUser(db, "u1")).length === 1, "cliente só vê os próprios tickets");
  check((await listTicketsForAdmin(db, "entregues")).length === 1, "filtro entregues");
  check((await listTicketsForAdmin(db, "andamento")).length === 1, "filtro em andamento");
  await setStatus(db, { ticketId: second.id, status: "fechado", authorId: "admin" });
  const closed = await getTicketByNumber(db, 1002);
  check(closed?.status === "fechado" && closed.closedAt instanceof Date, "fechar grava a data");
  check((await listTicketsForAdmin(db, "fechados")).length === 1, "filtro fechados");
  check((await listTicketsForAdmin(db, "todos")).length === 2, "filtro todos");

  console.log("\nOK: tickets funcionando no banco.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
