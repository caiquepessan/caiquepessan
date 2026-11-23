import { CreditCard, Mail, ShieldCheck } from "lucide-react";
import { cacheLife } from "next/cache";
import Link from "next/link";
import {
  DiscordIcon,
  InstagramIcon,
  PixIcon,
  TikTokIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/icons/brand-icons";
import { Logo } from "@/components/ui/logo";
import { siteConfig } from "@/config/site";
import { defaultWhatsappMessage, whatsappLink } from "@/lib/whatsapp";

async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}

const { contact } = siteConfig;

const socials = [
  { href: whatsappLink(defaultWhatsappMessage), label: "WhatsApp", Icon: WhatsAppIcon },
  { href: contact.discord, label: "Discord", Icon: DiscordIcon },
  { href: contact.instagram, label: "Instagram", Icon: InstagramIcon },
  { href: contact.tiktok, label: "TikTok", Icon: TikTokIcon },
  { href: contact.youtube, label: "YouTube", Icon: YouTubeIcon },
].filter((s) => Boolean(s.href));

const columns = [
  {
    title: "Loja",
    links: [
      { href: "/contas", label: "Todas as contas" },
      { href: "/contas?categoria=conta", label: "Contas modadas" },
      { href: "/contas?categoria=dinheiro", label: "Dinheiro na conta" },
      { href: "/contas?categoria=servico", label: "Serviços" },
    ],
  },
  {
    title: "Ajuda",
    links: [
      { href: "/#como-funciona", label: "Como funciona" },
      { href: "/#faq", label: "Perguntas frequentes" },
      { href: "/termos", label: "Termos e garantia" },
      { href: "/#avaliacoes", label: "Avaliações" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative isolate overflow-hidden border-t border-white/[0.06] bg-ink-950">
      <div aria-hidden className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[60rem] -translate-x-1/2 rounded-full bg-blood-700/15 blur-[120px]" />
      <div aria-hidden className="grid-lines pointer-events-none absolute inset-0 opacity-50 [mask-image:linear-gradient(to_bottom,#000,transparent_70%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-10 pt-20 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div className="max-w-sm">
            <Logo />
            <p className="mt-5 text-sm leading-relaxed text-bone-400">
              Contas modadas e serviços para GTA V com entrega rápida, pagamento
              facilitado e suporte de verdade. Feito por quem joga.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="grid size-10 place-items-center rounded-lg border border-white/10 bg-white/[0.03] text-bone-300 transition-all duration-300 hover:-translate-y-0.5 hover:border-blood-500/60 hover:bg-blood-500/10 hover:text-white"
                >
                  <Icon size={17} />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="font-tech text-xs font-semibold uppercase tracking-[0.3em] text-blood-500">
                {col.title}
              </p>
              <ul className="mt-5 flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-2 text-sm text-bone-300 transition-colors hover:text-white"
                    >
                      <span className="h-px w-0 bg-blood-500 transition-all duration-300 group-hover:w-3" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <p className="font-tech text-xs font-semibold uppercase tracking-[0.3em] text-blood-500">
              Atendimento
            </p>
            <ul className="mt-5 flex flex-col gap-3 text-sm text-bone-300">
              <li>
                <a
                  href={whatsappLink(defaultWhatsappMessage)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 hover:text-white"
                >
                  <WhatsAppIcon size={16} className="text-blood-500" />
                  {contact.whatsappDisplay}
                </a>
              </li>
              {contact.email && (
                <li>
                  <a
                    href={`mailto:${contact.email}`}
                    className="inline-flex items-center gap-2.5 break-all hover:text-white"
                  >
                    <Mail className="size-4 shrink-0 text-blood-500" />
                    {contact.email}
                  </a>
                </li>
              )}
              <li className="text-bone-500">{siteConfig.business.supportHours}</li>
            </ul>

            <div className="mt-6 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-bone-300">
                <PixIcon size={14} className="text-[#4db6ac]" /> PIX
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-bone-300">
                <CreditCard className="size-3.5" /> Cartão
              </span>
              <span className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-1.5 text-xs text-bone-300">
                <ShieldCheck className="size-3.5 text-blood-500" /> Compra segura
              </span>
            </div>
          </div>
        </div>

        <div
          aria-hidden
          className="outline-text pointer-events-none mt-16 select-none whitespace-nowrap text-center font-display text-[17vw] uppercase leading-[0.8] tracking-tight lg:text-[13.5rem]"
        >
          Freitas Modder
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/[0.06] pt-8 text-xs text-bone-600 md:flex-row md:items-start md:justify-between">
          <p>
            © <CurrentYear /> {siteConfig.name}. Todos os direitos reservados.
          </p>
          <p className="max-w-2xl md:text-right">
            O {siteConfig.name} é uma loja independente, sem qualquer vínculo com a
            Rockstar Games ou a Take-Two Interactive. Grand Theft Auto, GTA V e GTA
            Online são marcas registradas de seus respectivos donos.
          </p>
        </div>
      </div>
    </footer>
  );
}
