import { cacheLife } from "next/cache";
import Link from "next/link";
import { Logo } from "@/components/ui/logo";
import { BigWordmark } from "./big-wordmark";
import { siteConfig } from "@/config/site";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const { contact } = siteConfig;

const contactLinks = [
  { href: whatsappLink(defaultWhatsappMessage), label: `WhatsApp ${contact.whatsappDisplay}` },
  { href: contact.instagram, label: "Instagram" },
  { href: contact.discord, label: "Discord" },
  { href: contact.tiktok, label: "TikTok" },
  { href: contact.youtube, label: "YouTube" },
  { href: contact.email ? `mailto:${contact.email}` : "", label: contact.email },
].filter((l) => Boolean(l.href));

const columns = [
  {
    title: "Loja",
    links: [
      { href: "/contas?categoria=conta", label: "Contas prontas" },
      { href: "/contas?categoria=dinheiro", label: "Dinheiro na conta" },
      { href: "/contas?categoria=servico", label: "Serviços" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/#duvidas", label: "Dúvidas" },
      { href: "/termos", label: "Termos e garantia" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-white/[0.07] bg-ink-950">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div className="max-w-xs">
            <Logo className="h-8" />
            <p className="mt-4 text-[15px] leading-relaxed text-stone-400">
              Contas e serviços de GTA V pra PS4 e PS5. Pagamento no Pix, entrega
              pelo WhatsApp.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="text-sm font-semibold text-white">{col.title}</p>
              <ul className="mt-4 flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-[15px] text-stone-400 transition-colors hover:text-white">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="text-sm font-semibold text-white">Contato</p>
            <ul className="mt-4 flex flex-col gap-2.5">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="break-all text-[15px] text-stone-400 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              <li className="text-[15px] text-stone-500">{siteConfig.business.supportHours}</li>
            </ul>
          </div>
        </div>

        <div className="mt-16">
          <BigWordmark />
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/[0.07] pt-6 text-[13px] leading-relaxed text-stone-500 md:flex-row md:justify-between md:gap-10">
          <p className="shrink-0">
            © <CurrentYear /> {siteConfig.name}
          </p>
          <p className="max-w-2xl md:text-right">
            Loja independente, sem vínculo com a Rockstar Games, a Take-Two Interactive ou a
            Sony. GTA, Grand Theft Auto, PlayStation, PS4 e PS5 são marcas dos seus
            respectivos donos.
          </p>
        </div>
      </div>
    </footer>
  );
}
