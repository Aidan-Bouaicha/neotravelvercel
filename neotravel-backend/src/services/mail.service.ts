import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

export class MailService {
  static async sendQuoteEmail(
    to: string,
    quoteNumber: string
  ): Promise<void> {

    console.log("===== RESEND =====");

    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY manquante");
    }

    const pdfPath = path.join(
      process.cwd(),
      "uploads",
      `${quoteNumber}.pdf`
    );

    const pdfBuffer = fs.readFileSync(pdfPath);

    const { data, error } = await resend.emails.send({
      from: "NeoTravel <onboarding@resend.dev>",
      to: [to],

      subject: `Votre devis NeoTravel - ${quoteNumber}`,

      text: `Bonjour,

Veuillez trouver ci-joint votre devis NeoTravel.

Merci pour votre confiance.

L'équipe NeoTravel`,

      attachments: [
        {
          filename: `${quoteNumber}.pdf`,
          content: pdfBuffer,
        },
      ],
    });

    if (error) {
      console.error(error);
      throw error;
    }

    console.log("✅ Email envoyé !");
    console.log(data);
  }
}