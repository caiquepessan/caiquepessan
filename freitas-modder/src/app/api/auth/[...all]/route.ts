import { authConfigured, getAuth } from "@/lib/auth";

/** Rotas do login (Better Auth): /api/auth/sign-in/social, /callback/discord etc. */
async function handler(request: Request) {
  if (!authConfigured()) {
    return Response.json(
      { message: "O login com Discord ainda não foi configurado." },
      { status: 503 },
    );
  }
  return getAuth().handler(request);
}

export { handler as GET, handler as POST };
