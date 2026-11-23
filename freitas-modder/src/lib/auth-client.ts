"use client";

import { customSessionClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import type { Auth } from "./auth";

/** Cliente do login no navegador (usa o mesmo endereço do site). */
export const authClient = createAuthClient({
  plugins: [customSessionClient<Auth>()],
});

/** O botão "Entrar" só aparece quando o login foi configurado na Vercel. */
export const loginEnabled = process.env.NEXT_PUBLIC_DISCORD_LOGIN === "1";

export function signInWithDiscord(callbackURL = window.location.pathname) {
  return authClient.signIn.social({ provider: "discord", callbackURL });
}
