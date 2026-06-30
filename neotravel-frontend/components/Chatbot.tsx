"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

import QuoteModal from "@/components/QuoteModal";

export default function Chatbot() {
  const [input, setInput] = useState("");
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim()) return;

    await sendMessage({
      parts: [
        {
          type: "text",
          text: input,
        },
      ],
    });

    setInput("");
  }

  return (
    <>
      <section className="mx-auto max-w-5xl px-6 py-12">
        <div className="rounded-2xl border bg-white p-8 shadow">

          <div className="mb-6 flex items-center justify-between">

            <h2 className="text-3xl font-bold">
              Assistant NeoTravel
            </h2>

            <button
              onClick={() => setIsQuoteModalOpen(true)}
              className="rounded-lg bg-green-600 px-5 py-3 font-semibold text-white transition hover:bg-green-700"
            >
              📄 Demander un devis
            </button>

          </div>

          <div className="mb-6 h-96 overflow-y-auto rounded-xl border p-4">

            {messages.length === 0 && (
              <p className="text-gray-500">
                👋 Bonjour !
                <br />
                Je suis votre assistant NeoTravel.
                <br />
                Je peux répondre à vos questions et vous aider à préparer votre voyage.
              </p>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className="mb-5"
              >
                <strong>
                  {message.role === "user"
                    ? "Vous"
                    : "NeoTravel"}
                </strong>

                {message.parts.map((part, index) => {
                  if (part.type !== "text") return null;

                  return (
                    <p key={index}>
                      {part.text}
                    </p>
                  );
                })}
              </div>
            ))}

          </div>

          <form
            onSubmit={handleSubmit}
            className="flex gap-3"
          >

            <input
              className="flex-1 rounded-lg border p-3"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Posez votre question..."
            />

            <button
              className="rounded-lg bg-blue-700 px-5 py-3 text-white hover:bg-blue-800"
              disabled={
                status === "submitted" ||
                status === "streaming"
              }
            >
              Envoyer
            </button>

          </form>

        </div>
      </section>

      <QuoteModal
        isOpen={isQuoteModalOpen}
        onClose={() => setIsQuoteModalOpen(false)}
      />
    </>
  );
}