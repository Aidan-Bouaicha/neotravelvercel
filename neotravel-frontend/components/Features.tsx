import { Mail, MapPinned, FileText, Bus } from "lucide-react";

export default function Features() {
  const features = [
    {
      icon: <Bus size={32} />,
      title: "Transport en autocar",
      description: "Voyages scolaires, entreprises, associations...",
    },
    {
      icon: <MapPinned size={32} />,
      title: "Distance automatique",
      description: "Calcul grâce à OpenRouteService.",
    },
    {
      icon: <FileText size={32} />,
      title: "PDF instantané",
      description: "Votre devis est généré automatiquement.",
    },
    {
      icon: <Mail size={32} />,
      title: "Envoi par email",
      description: "Le devis est envoyé immédiatement.",
    },
  ];

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-6 py-12 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-xl border p-6 shadow-sm"
        >
          <div className="mb-4 text-blue-700">
            {feature.icon}
          </div>

          <h3 className="mb-2 text-lg font-bold">
            {feature.title}
          </h3>

          <p className="text-gray-600">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
  );
}