"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";

export default function Chatbot() {
  const [input, setInput] = useState("");

  const { messages, sendMessage, status } = useChat();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!input.trim()) return;

    sendMessage({
      text: input,
    });

    setInput("");
  }

  return (
    <section className="mx-auto max-w-5xl px-6 py-12">
      <div className="rounded-2xl border bg-white p-8 shadow">

        <h2 className="mb-6 text-3xl font-bold">
          Assistant NeoTravel
        </h2>

        <div className="mb-6 h-96 overflow-y-auto rounded border p-4">

          {messages.length === 0 && (
            <p className="text-gray-500">
              👋 Bonjour !
              <br />
              Je suis votre assistant NeoTravel.
            </p>
          )}

          {messages.map(message => (
            <div key={message.id} className="mb-4">

              <strong>
                {message.role === "user"
                  ? "Vous"
                  : "NeoTravel"}
              </strong>

              {message.parts?.map((part, index) => {

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
          onSubmit={onSubmit}
          className="flex gap-2"
        >

          <input
            className="flex-1 rounded border p-3"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Votre message..."
          />

          <button
            className="rounded bg-blue-700 px-5 text-white"
            disabled={status === "streaming"}
          >
            Envoyer
          </button>

        </form>

      </div>
    </section>
  );
}