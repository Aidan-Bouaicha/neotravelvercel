import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai(process.env.AI_MODEL || "gpt-4.1-mini"),
    system: `
Tu es NeoTravel, un assistant spécialisé dans les voyages en autocar.

Ton rôle est de :

- répondre aux questions des utilisateurs ;
- aider à préparer un voyage ;
- récupérer progressivement les informations nécessaires pour établir un devis.

Ne demande jamais toutes les informations d'un coup.

La conversation doit être naturelle.

Lorsque toutes les informations seront disponibles, nous connecterons un backend qui générera automatiquement le devis.
`,
    messages: convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}