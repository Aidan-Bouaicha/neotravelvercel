import axios from "axios";

export class DistanceService {
  static async getDistance(
    depart: string,
    arrivee: string
  ): Promise<number> {

    const apiKey = process.env.OPENROUTE_API_KEY;

    if (!apiKey) {
      throw new Error("OPENROUTE_API_KEY manquante");
    }

    // Géocodage du départ
    const departResponse = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: apiKey,
          text: depart,
          size: 1,
        },
      }
    );

    // Géocodage de l'arrivée
    const arriveeResponse = await axios.get(
      "https://api.openrouteservice.org/geocode/search",
      {
        params: {
          api_key: apiKey,
          text: arrivee,
          size: 1,
        },
      }
    );

    const departCoords =
      departResponse.data.features[0]?.geometry.coordinates;

    const arriveeCoords =
      arriveeResponse.data.features[0]?.geometry.coordinates;

    if (!departCoords || !arriveeCoords) {
      throw new Error("Impossible de trouver les coordonnées.");
    }

    // Calcul de l'itinéraire
    const routeResponse = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car",
      {
        coordinates: [
          departCoords,
          arriveeCoords,
        ],
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    const distanceMeters =
      routeResponse.data.routes[0].summary.distance;

    const distanceKm = Math.round(distanceMeters / 1000);

    return distanceKm;
  }
}