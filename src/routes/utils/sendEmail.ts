import console from "console";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_TOKEN || "");

export async function sendEmail(to: string, jwt: string) {
  try {
    const link = `http://localhost:3333/users/reset/${jwt}`;
    const data = await resend.emails.send({
      from: "no-reply <noreply@guilhermearanega.com.br>",
      to,
      subject: "Esqueceu sua senha?",
      html: `<strong>Esqueceu sua senha?</strong><br><p>Acesse o link: ${link}</p>`,
    });

    return data;
  } catch (error) {
    console.error(error);
  }
}
