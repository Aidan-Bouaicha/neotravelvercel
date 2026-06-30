import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

/**
 * Connexion Admin
 */
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
    });
  }

  return res.status(401).json({
    success: false,
    message: "Email ou mot de passe incorrect",
  });
});

/**
 * Liste des devis
 */
router.get("/quotes", async (_, res) => {
  try {
    const { data, error } = await supabase
      .from("quotes")
      .select(
        `
        *,
        trips (
          depart,
          arrivee,
          date_trajet,
          nb_passagers,
          leads (
            id,
            nom,
            email,
            telephone
          )
        )
      `
      )
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la récupération des devis",
    });
  }
});

/**
 * Supprimer un devis
 */
router.delete("/quotes/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1. récupérer le trip_id
    const { data: quote, error: quoteError } = await supabase
      .from("quotes")
      .select("trip_id")
      .eq("id", id)
      .single();

    if (quoteError) throw quoteError;

    // 2. récupérer le lead_id
    const { data: trip, error: tripError } = await supabase
      .from("trips")
      .select("lead_id")
      .eq("id", quote.trip_id)
      .single();

    if (tripError) throw tripError;

    // 3. supprimer le lead
    // Les contraintes ON DELETE CASCADE supprimeront
    // automatiquement trips puis quotes.
    const { error: deleteError } = await supabase
      .from("leads")
      .delete()
      .eq("id", trip.lead_id);

    if (deleteError) throw deleteError;

    res.status(200).json({
      success: true,
      message: "Devis supprimé avec succès",
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Erreur lors de la suppression du devis",
    });
  }
});

export default router;