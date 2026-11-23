import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getViewer } from "@/lib/viewer";

/**
 * Envio de fotos do painel direto do navegador para o Vercel Blob.
 * Este endereço só gera a autorização, e só para o admin.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async () => {
        const viewer = await getViewer();
        if (!viewer?.isAdmin) throw new Error("Sem permissão para enviar fotos.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/avif"],
          maximumSizeInBytes: 10 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {},
    });
    return Response.json(result);
  } catch (error) {
    return Response.json(
      { error: error instanceof Error ? error.message : "Falha no envio." },
      { status: 400 },
    );
  }
}
