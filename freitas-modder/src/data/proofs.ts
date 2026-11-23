/**
 * Prints de entregas e conversas com clientes (de verdade).
 *
 * Coloque as imagens em public/provas/ e liste aqui, por exemplo:
 *   { src: "/provas/entrega-01.jpg", alt: "Cliente recebendo a Conta Pro" }
 *
 * Enquanto a lista estiver vazia, a seção "Entregas" não aparece no site.
 */
export interface Proof {
  src: string;
  alt: string;
}

export const proofs: Proof[] = [];
