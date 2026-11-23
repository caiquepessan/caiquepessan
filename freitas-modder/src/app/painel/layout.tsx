import type { Metadata } from "next";

// O painel depende de quem está logado: não precisa abrir instantâneo.
export const instant = false;

export const metadata: Metadata = {
  title: "Painel",
  robots: { index: false, follow: false },
};

export default function PainelLayout({ children }: LayoutProps<"/painel">) {
  return <div className="mx-auto max-w-6xl px-5 pb-24 pt-28 sm:pt-32">{children}</div>;
}
