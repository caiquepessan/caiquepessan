import type { Metadata } from "next";
import { Reveal } from "@/components/effects/reveal";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Termos e garantia",
  description: `Condições de compra, entrega e garantia de ${siteConfig.business.warrantyDays} dias da ${siteConfig.name}.`,
  alternates: { canonical: "/termos" },
};

const { warrantyDays, supportHours } = siteConfig.business;

/**
 * ⚠️ Texto-base. Revise com o dono da loja (prazos, reembolso, regras)
 * antes de publicar.
 */
const sections = [
  {
    title: "1. Sobre a loja",
    body: [
      `A ${siteConfig.name} é uma loja independente que vende contas e serviços para o modo online de GTA V. Não temos qualquer vínculo com a Rockstar Games ou a Take-Two Interactive.`,
      "Ao comprar, você declara ter mais de 18 anos ou autorização de um responsável.",
    ],
  },
  {
    title: "2. Pedidos e pagamento",
    body: [
      "Os pedidos são finalizados pelo WhatsApp (ou Discord). O pagamento é feito via PIX ou cartão de crédito, conforme as instruções enviadas na conversa.",
      "O pedido só é considerado confirmado após a compensação do pagamento.",
    ],
  },
  {
    title: "3. Entrega",
    body: [
      "Contas prontas são entregues com os dados de acesso (e-mail e senha) pelo mesmo canal do pedido. Serviços feitos na sua conta seguem o prazo informado na página de cada produto.",
      `Atendimento: ${supportHours}. Pedidos feitos fora desse horário são entregues assim que o atendimento é retomado.`,
    ],
  },
  {
    title: `4. Garantia de ${warrantyDays} dias`,
    body: [
      `Todos os produtos têm garantia de ${warrantyDays} dias a partir da entrega. Se houver qualquer problema com o que foi comprado nesse período, fazemos a reposição ou resolvemos sem custo.`,
      "A garantia não cobre problemas causados por compartilhamento da conta com terceiros, uso de outros programas de modificação após a entrega ou descumprimento das orientações de segurança enviadas no atendimento.",
    ],
  },
  {
    title: "5. Riscos",
    body: [
      "Modificações em jogos online vão contra os termos de uso do jogo. Usamos métodos testados para reduzir riscos, mas nenhuma loja consegue garantir risco zero. Por isso existe a garantia de reposição dentro do prazo.",
    ],
  },
  {
    title: "6. Segurança da sua conta",
    body: [
      "Após receber uma conta, troque imediatamente e-mail e senha. Nos serviços feitos na sua própria conta, recomendamos trocar a senha assim que o serviço for concluído.",
      "Nunca pedimos dados de cartão pelo chat. Desconfie de perfis que se passam pela loja: os canais oficiais são apenas os listados neste site.",
    ],
  },
  {
    title: "7. Contato",
    body: [
      `WhatsApp: ${siteConfig.contact.whatsappDisplay}. E-mail: ${siteConfig.contact.email}.`,
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Início" }, { label: "Termos e garantia" }]}
        eyebrow="Transparência"
        title="Termos &"
        highlight="garantia"
        description="Tudo o que você precisa saber antes de comprar, sem letras miúdas."
      />
      <section className="mx-auto max-w-7xl px-4 pb-28 sm:px-6">
        <div className="flex max-w-3xl flex-col gap-5">
          {sections.map((section) => (
            <Reveal key={section.title}>
              <article className="rounded-2xl border border-white/[0.07] bg-ink-850/70 p-6 sm:p-8">
                <h2 className="font-display text-3xl uppercase tracking-wide text-bone-50">
                  {section.title}
                </h2>
                <div className="mt-4 flex flex-col gap-3 leading-relaxed text-bone-400">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
