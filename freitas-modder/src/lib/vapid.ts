/**
 * Chaves das notificações no celular (Web Push, padrão VAPID).
 *
 * Se existirem NEXT_PUBLIC_VAPID_PUBLIC_KEY e VAPID_PRIVATE_KEY na Vercel,
 * usa essas. Se não, deriva um par fixo a partir do BETTER_AUTH_SECRET
 * (que já existe): assim não precisa configurar nada novo. Trocar o
 * BETTER_AUTH_SECRET desliga as notificações já ativadas (cada aparelho
 * ativa de novo).
 */
import { createECDH, hkdfSync } from "node:crypto";

// Ordem da curva P-256: a chave privada precisa ficar entre 1 e N-1.
const N = BigInt("0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551");

export function vapidKeys(): { publicKey: string; privateKey: string } | null {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  if (publicKey && privateKey) return { publicKey, privateKey };

  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) return null;
  const seed = Buffer.from(hkdfSync("sha256", secret, "freitas-modder", "web-push-vapid-p256", 32));
  const scalar = (BigInt(`0x${seed.toString("hex")}`) % (N - BigInt(1))) + BigInt(1);
  const priv = Buffer.from(scalar.toString(16).padStart(64, "0"), "hex");
  const ecdh = createECDH("prime256v1");
  ecdh.setPrivateKey(priv);
  return { publicKey: ecdh.getPublicKey().toString("base64url"), privateKey: priv.toString("base64url") };
}
