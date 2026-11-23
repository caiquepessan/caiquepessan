import Image from "next/image";
import { RevealGroup, RevealItem } from "@/components/effects/reveal";
import { Heading } from "@/components/ui/heading";
import { siteConfig } from "@/config/site";
import { proofs } from "@/data/proofs";

/** Prints reais de entregas. Só aparece quando houver imagens em src/data/proofs.ts. */
export function Proofs() {
  if (proofs.length === 0) return null;

  return (
    <section id="entregas" className="py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-5">
        <Heading
          title="Entregas"
          description={
            siteConfig.contact.instagram ? (
              <>
                Prints de clientes recebendo os pacotes. Tem mais no{" "}
                <a
                  href={siteConfig.contact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white underline underline-offset-4 hover:text-brand-400"
                >
                  Instagram
                </a>
                .
              </>
            ) : (
              "Prints de clientes recebendo os pacotes."
            )
          }
        />
        <RevealGroup className="mt-12 columns-2 gap-4 sm:columns-3 lg:columns-4">
          {proofs.map((proof) => (
            <RevealItem key={proof.src} className="mb-4 break-inside-avoid">
              <Image
                src={proof.src}
                alt={proof.alt}
                width={600}
                height={1000}
                sizes="(max-width: 640px) 50vw, 25vw"
                className="h-auto w-full rounded-2xl border border-white/[0.08]"
              />
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
