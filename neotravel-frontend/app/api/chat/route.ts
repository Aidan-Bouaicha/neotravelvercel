import {
  streamText,
  convertToModelMessages,
  type UIMessage,
} from "ai";

import { SYSTEM_PROMPT } from "@/lib/system-prompt";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const modelMessages = await convertToModelMessages(messages);

  const result = streamText({
    model: process.env.AI_MODEL ?? "openai/gpt-4.1-mini",

    system: SYSTEM_PROMPT,

    messages: modelMessages,
    
  });

  return result.toUIMessageStreamResponse();
}