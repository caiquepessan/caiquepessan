import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Termos e garantia",
  description: `Como funcionam a compra, a entrega e a garantia de ${siteConfig.business.warrantyDays} dias da ${siteConfig.name}.`,
  alternates: { canonical: "/termos" },
};

const { warrantyDays, supportHours } = siteConfig.business;
const { contact } = siteConfig;
const instagramHandle = contact.instagram.split("/").filter(Boolean).pop();

/**
 * ⚠️ Texto-base. Revise com o dono da loja (prazos, reembolso e regras)
 * antes de divulgar o site.
 */
const sections = [
  {
    title: "A loja",
    body: [
      `A ${siteConfig.name} vende dinheiro, level, Unlock All e contas prontas para o GTA V Online no PS4 e no PS5. É uma loja independente, sem vínculo com a Rockstar Games, a Take-Two Interactive ou a Sony.`,
      "Pra comprar, você precisa ter 18 anos ou a autorização de um responsável.",
    ],
  },
  {
    title: "Pedido e pagamento",
    body: [
      "Os pedidos são feitos por ticket aqui no site (ou pelo WhatsApp). O pagamento é no Pix ou no cartão de crédito, com os dados enviados no ticket.",
      "O pedido só vale depois que o pagamento é confirmado.",
    ],
  },
  {
    title: "Entrega",
    body: [
      "Dinheiro, level, Unlock All e os outros serviços são feitos pelo Freitas dentro da sua conta da PSN. Para isso, depois do pagamento, você libera o acesso dele escaneando um QR Code com o app da PlayStation: você não passa e-mail nem senha.",
      "Quando termina, ele manda prints como prova no ticket e marca o pedido como entregue. O prazo é o que aparece na página de cada produto.",
      "Nas contas prontas, você recebe o e-mail e a senha da conta PSN pelo ticket.",
      ...(supportHours
        ? [`Atendimento: ${supportHours.toLowerCase()}. Pedido feito fora desse horário é entregue quando o atendimento volta.`]
        : []),
    ],
  },
  {
    title: `Garantia de ${warrantyDays} dias`,
    body: [
      `Tudo tem garantia de ${warrantyDays} dias a partir da entrega. Se acontecer algum problema com o que você comprou nesse prazo, a gente repõe ou resolve sem custo.`,
      "A garantia não cobre problemas causados por compartilhar a conta com outras pessoas, usar outros programas de modificação depois da entrega ou não seguir as orientações de segurança passadas no atendimento.",
    ],
  },
  {
    title: "Riscos",
    body: [
      "Modificar contas vai contra as regras do jogo. A gente usa métodos testados pra diminuir o risco, mas ninguém consegue garantir risco zero. Por isso existe a garantia de reposição.",
    ],
  },
  {
    title: "Segurança",
    body: [
      "Nos serviços feitos na sua conta, a gente nunca pede sua senha: o acesso é liberado por QR Code. Enquanto o Freitas estiver na sua conta, evite entrar no jogo.",
      "Assim que receber uma conta pronta, troque o e-mail e a senha.",
      "A gente nunca pede dados de cartão pelo chat. Os únicos canais oficiais são os que estão neste site.",
    ],
  },
  {
    title: "Contato",
    body: [
      [
        `WhatsApp ${contact.whatsappDisplay}`,
        contact.instagram && `Instagram @${instagramHandle}`,
        contact.email,
      ]
        .filter(Boolean)
        .join(" · "),
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHeader
        breadcrumb={[{ href: "/", label: "Início" }, { label: "Termos e garantia" }]}
        title="Termos e garantia"
        description="O que você precisa saber antes de comprar."
      />
      <section className="mx-auto max-w-6xl px-5 pb-28">
        <div className="max-w-3xl border-t border-white/[0.08]">
          {sections.map((section, i) => (
            <article
              key={section.title}
              className="grid gap-3 border-b border-white/[0.08] py-8 sm:grid-cols-[3rem_1fr] sm:gap-6"
            >
              <span className="font-display text-2xl font-extrabold italic text-brand-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h2 className="text-xl font-semibold">{section.title}</h2>
                <div className="mt-3 flex flex-col gap-3 text-[17px] leading-relaxed text-stone-400">
                  {section.body.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
