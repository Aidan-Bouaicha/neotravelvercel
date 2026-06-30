"use client";

import { useState } from "react";

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function QuoteModal({
  isOpen,
  onClose,
}: QuoteModalProps) {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    depart: "",
    arrivee: "",
    date_trajet: "",
    nb_passagers: 1,
    aller_retour: false,
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  function updateField(
    field: string,
    value: string | boolean | number
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function generateQuote() {
    try {
      setLoading(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/generate-quote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            special_request: false,
            special_request_comment: "",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("✅ Devis généré et envoyé par email !");

      onClose();

    } catch (err) {
      alert("Erreur lors de la génération du devis.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">

      <div className="w-full max-w-xl rounded-xl bg-white p-8">

        <h2 className="mb-6 text-2xl font-bold">
          Demander un devis
        </h2>

        <div className="grid gap-4">

          <input
            placeholder="Nom"
            className="rounded border p-3"
            onChange={(e) =>
              updateField("nom", e.target.value)
            }
          />

          <input
            placeholder="Email"
            className="rounded border p-3"
            onChange={(e) =>
              updateField("email", e.target.value)
            }
          />

          <input
            placeholder="Téléphone"
            className="rounded border p-3"
            onChange={(e) =>
              updateField("telephone", e.target.value)
            }
          />

          <input
            placeholder="Ville de départ"
            className="rounded border p-3"
            onChange={(e) =>
              updateField("depart", e.target.value)
            }
          />

          <input
            placeholder="Destination"
            className="rounded border p-3"
            onChange={(e) =>
              updateField("arrivee", e.target.value)
            }
          />

          <input
            type="date"
            className="rounded border p-3"
            onChange={(e) =>
              updateField("date_trajet", e.target.value)
            }
          />

          <input
            type="number"
            placeholder="Nombre de passagers"
            className="rounded border p-3"
            onChange={(e) =>
              updateField(
                "nb_passagers",
                Number(e.target.value)
              )
            }
          />

          <label className="flex items-center gap-2">

            <input
              type="checkbox"
              onChange={(e) =>
                updateField(
                  "aller_retour",
                  e.target.checked
                )
              }
            />

            Aller-retour

          </label>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            onClick={onClose}
            className="rounded border px-5 py-2"
          >
            Annuler
          </button>

          <button
            onClick={generateQuote}
            disabled={loading}
            className="rounded bg-blue-700 px-5 py-2 text-white"
          >
            {loading
              ? "Génération..."
              : "Générer le devis"}
          </button>

        </div>

      </div>

    </div>
  );
}