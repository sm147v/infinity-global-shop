import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    const { email } = parsed.data;
    const resend = new Resend(process.env.RESEND_API_KEY);
    const from = process.env.EMAIL_FROM || "pedidos@infinityglobalshop.com";

    await resend.emails.send({
      from: `Infinity Global Shop <${from}>`,
      to: [email],
      subject: "🎁 Tu cupón BIENVENIDA10 — 10% de descuento",
      html: `
        <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; background: #FDFAF3; border-radius: 16px; overflow: hidden;">
          <div style="background: linear-gradient(135deg, #C97B5C, #A85E42); padding: 2rem; text-align: center; color: #F7F1E5;">
            <p style="font-size: 2.5rem; margin: 0;">🎁</p>
            <h1 style="font-size: 1.6rem; font-weight: 400; margin: 0.5rem 0;">¡Bienvenida a <em>Infinity</em>!</h1>
          </div>
          <div style="padding: 2rem; color: #4A4F45; font-size: 0.95rem; line-height: 1.6;">
            <p>Gracias por suscribirte. Aquí tienes tu cupón exclusivo de <strong>10% de descuento</strong> en tu primera compra:</p>
            <div style="background: #4A5D3A; color: #F7F1E5; text-align: center; padding: 1.2rem; border-radius: 12px; font-family: monospace; font-size: 1.5rem; font-weight: 700; letter-spacing: 0.1em; margin: 1.5rem 0; border: 2px dashed #C9A96E;">
              BIENVENIDA10
            </div>
            <p><strong>Cómo usarlo:</strong></p>
            <p>1. Visita <a href="https://www.infinityglobalshop.com/products" style="color: #C97B5C;">nuestra tienda</a><br>
            2. Agrega productos al carrito<br>
            3. En el checkout, ingresa el código <strong>BIENVENIDA10</strong><br>
            4. ¡Listo! 10% de descuento aplicado</p>
            <p style="font-size: 0.8rem; color: #6B7B4F; margin-top: 1.5rem;">Compra mínima $80.000 · Válido por 90 días · Solo una vez por cliente</p>
          </div>
          <div style="background: #2A2E26; padding: 1.2rem; text-align: center;">
            <p style="color: #C9A96E; font-size: 0.8rem; margin: 0;">Infinity Global Shop · Medellín, Colombia</p>
            <p style="color: rgba(247,241,229,0.5); font-size: 0.7rem; margin: 0.3rem 0 0;">Productos importados de USA · Envío 24h</p>
          </div>
        </div>
      `,
    });

    // También notificar al admin
    await resend.emails.send({
      from: `Infinity Global Shop <${from}>`,
      to: [process.env.ADMIN_EMAIL || "infinityshop147@gmail.com"],
      subject: `📧 Nuevo suscriptor: ${email}`,
      html: `<p>Nuevo suscriptor al newsletter: <strong>${email}</strong></p><p>Fecha: ${new Date().toLocaleString("es-CO")}</p>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Error enviando email" }, { status: 500 });
  }
}
