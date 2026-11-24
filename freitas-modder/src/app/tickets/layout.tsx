import type { Metadata } from "next";

// Depende de quem está logado: não precisa abrir instantâneo.
export const instant = false;

export const metadata: Metadata = {
  title: "Tickets",
  robots: { index: false, follow: false },
};

export default function TicketsLayout({ children }: LayoutProps<"/tickets">) {
  return <div className="mx-auto max-w-4xl px-5 pb-24 pt-28 sm:pt-32">{children}</div>;
}
