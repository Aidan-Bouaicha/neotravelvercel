"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message);
        setLoading(false);
        return;
      }

      localStorage.setItem("admin-auth", "true");

      router.push("/admin/dashboard");
    } catch (err) {
      console.error(err);
      setError("Impossible de contacter le serveur.");
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-slate-100 flex items-center justify-center">
      <div className="w-full max-w-md rounded-xl bg-white shadow-xl p-8">

        <h1 className="text-3xl font-bold text-center mb-2">
          NeoTravel
        </h1>

        <p className="text-center text-gray-500 mb-8">
          Connexion administrateur
        </p>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >
          <div>
            <label className="block mb-2 font-medium">
              Email
            </label>

            <input
              type="email"
              className="w-full rounded-lg border p-3"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Mot de passe
            </label>

            <input
              type="password"
              className="w-full rounded-lg border p-3"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              required
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 py-3 font-semibold text-white hover:bg-blue-800"
          >
            {loading
              ? "Connexion..."
              : "Se connecter"}
          </button>
        </form>
      </div>
    </main>
  );
}