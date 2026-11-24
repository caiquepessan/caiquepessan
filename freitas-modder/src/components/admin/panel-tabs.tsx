import Link from "next/link";
import { cn } from "@/lib/utils";

/** Abas do painel: produtos e tickets (com quantos pedem resposta). */
export function PanelTabs({ active, attention }: { active: "produtos" | "tickets"; attention: number }) {
  const tabs = [
    { key: "produtos", href: "/painel", label: "Produtos", badge: 0 },
    { key: "tickets", href: "/painel/tickets", label: "Tickets", badge: attention },
  ] as const;
  return (
    <nav aria-label="Seções do painel" className="mb-8 flex gap-2">
      {tabs.map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          aria-current={active === tab.key ? "page" : undefined}
          className={cn(
            "inline-flex h-11 items-center gap-2 rounded-xl px-4 text-[15px] font-semibold ring-1 ring-inset transition-colors",
            active === tab.key
              ? "bg-white text-ink-950 ring-white"
              : "text-stone-300 ring-white/10 hover:bg-white/[0.06] hover:text-white",
          )}
        >
          {tab.label}
          {tab.badge > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-brand-500 px-1.5 text-[11px] font-bold tabular-nums text-white">
              {tab.badge}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
