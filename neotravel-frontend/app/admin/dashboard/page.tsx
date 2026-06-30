"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Quote {
  id: string;
  quote_number: string;
  prix: number;
  created_at: string;

  trips: {
    depart: string;
    arrivee: string;
    date_trajet: string;
    nb_passagers: number;

    leads: {
      nom: string;
      email: string;
      telephone: string;
    };
  };
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem("admin-auth");

    if (!auth) {
      router.push("/admin/login");
      return;
    }

    loadQuotes();
  }, []);

  async function loadQuotes() {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/quotes`
      );

      const data = await response.json();

      if (data.success) {
        setQuotes(data.data);
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

async function deleteQuote(id: string) {
  const confirmDelete = confirm(
    "Voulez-vous vraiment supprimer ce devis ?"
  );

  if (!confirmDelete) return;

  console.log("ID à supprimer :", id);

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/admin/quotes/${id}`,
      {
        method: "DELETE",
      }
    );

    const data = await response.json();

    console.log("Réponse :", data);

    if (data.success) {
      setQuotes((previousQuotes) =>
        previousQuotes.filter((quote) => quote.id !== id)
      );
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("Erreur lors de la suppression.");
  }
}

  function logout() {
    localStorage.removeItem("admin-auth");
    router.push("/admin/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        Chargement...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <div className="mx-auto max-w-7xl">

        <div className="mb-8 flex items-center justify-between">

          <div>
            <h1 className="text-4xl font-bold">
              Dashboard NeoTravel
            </h1>

            <p className="text-gray-500">
              Administration
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-5 py-3 text-white hover:bg-red-700"
          >
            Déconnexion
          </button>

        </div>

        <div className="mb-8 grid grid-cols-2 gap-6">

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Nombre de devis
            </p>

            <p className="mt-2 text-4xl font-bold">
              {quotes.length}
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-gray-500">
              Clients
            </p>

            <p className="mt-2 text-4xl font-bold">
              {
                new Set(
                  quotes.map(
                    (q) => q.trips.leads.email
                  )
                ).size
              }
            </p>
          </div>

        </div>

        <div className="overflow-hidden rounded-xl bg-white shadow">

          <table className="w-full">

            <thead className="bg-slate-200">

              <tr>

                <th className="p-4 text-left">
                  Client
                </th>

                <th className="p-4 text-left">
                  Départ
                </th>

                <th className="p-4 text-left">
                  Arrivée
                </th>

                <th className="p-4 text-left">
                  Date
                </th>

                <th className="p-4 text-left">
                  Passagers
                </th>

                <th className="p-4 text-left">
                  Prix
                </th>

                <th className="p-4 text-center">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {quotes.map((quote) => (

                <tr
                  key={quote.id}
                  className="border-t hover:bg-slate-50"
                >

                  <td className="p-4">

                    <div className="font-semibold">
                      {quote.trips.leads.nom}
                    </div>

                    <div className="text-sm text-gray-500">
                      {quote.trips.leads.email}
                    </div>

                    <div className="text-sm text-gray-400">
                      {quote.trips.leads.telephone}
                    </div>

                  </td>

                  <td className="p-4">
                    {quote.trips.depart}
                  </td>

                  <td className="p-4">
                    {quote.trips.arrivee}
                  </td>

                  <td className="p-4">
                    {quote.trips.date_trajet}
                  </td>

                  <td className="p-4">
                    {quote.trips.nb_passagers}
                  </td>

                  <td className="p-4 font-semibold">
                    {quote.prix} €
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() =>
                        deleteQuote(quote.id)
                      }
                      className="rounded bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                      Supprimer
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </main>
  );
}