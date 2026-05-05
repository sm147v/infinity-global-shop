import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = (process.env.EMAIL_FROM ?? 'onboarding@resend.dev').replace(/[\[\]]|mailto:/g, '');
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL ?? '').replace(/[\[\]]|mailto:|\(.*?\)/g, '');
const APP_URL = process.env.APP_URL ?? 'http://localhost:3000';

function cleanEmail(email: string): string {
  if (!email) return '';
  // Quita corchetes, parentesis, mailto:, y se queda con el primer email puro
  const match = email.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  return match ? match[0] : '';
}

interface OrderItem {
  name: string;
  quantity: number;
  unitPrice: number;
}

interface OrderEmailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  total: number;
  items: OrderItem[];
}

const fmt = (n: number) => "$" + n.toLocaleString('es-CO');

function itemsHtml(items: OrderItem[]): string {
  return items.map(i => `
    <tr>
      <td style="padding: 8px 0; border-bottom: 1px solid #EDE3CD; color: #4A4F45; font-size: 14px;">${i.name}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #EDE3CD; text-align: center; color: #4A4F45; font-size: 14px;">${i.quantity}</td>
      <td style="padding: 8px 0; border-bottom: 1px solid #EDE3CD; text-align: right; color: #4A5D3A; font-weight: 600; font-size: 14px;">${fmt(i.unitPrice * i.quantity)}</td>
    </tr>
  `).join('');
}

export async function sendOrderConfirmationToCustomer(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) {
    console.log("❌ Falta RESEND_API_KEY");
    return;
  }

  const cleanedEmail = cleanEmail(data.customerEmail);
  if (!cleanedEmail) {
    console.log("❌ Email cliente inválido:", data.customerEmail);
    return;
  }

  console.log("📧 Enviando email a cliente:", cleanedEmail);

  try {
    const result = await resend.emails.send({
      from: `Infinity Global Shop <${FROM_EMAIL}>`,
      to: cleanedEmail,
      subject: `Recibimos tu pedido ${data.orderNumber} ✨`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#F7F1E5;font-family:Inter,sans-serif;">
          <div style="max-width:580px;margin:0 auto;padding:32px 16px;">
            <div style="text-align:center;margin-bottom:32px;">
              <h1 style="font-family:Georgia,serif;font-size:28px;color:#4A5D3A;font-weight:400;margin:0;">
                Infinity <em style="color:#C97B5C;">Global</em>
              </h1>
              <p style="color:#6B7B4F;font-size:13px;margin:4px 0 0;">Salud · Belleza · Bienestar</p>
            </div>

            <div style="background:#FDFAF3;border-radius:20px;padding:32px;border:1px solid #EDE3CD;margin-bottom:24px;">
              <p style="font-size:13px;color:#C97B5C;text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;">— Tu pedido</p>
              <h2 style="font-family:Georgia,serif;font-size:22px;color:#4A5D3A;font-weight:400;margin:0 0 24px;">
                Hola ${data.customerName}, ¡gracias por tu compra! 🌿
              </h2>
              <p style="color:#4A4F45;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Tu pedido ya está registrado y muy pronto empezamos a prepararlo con cariño.
              </p>

              <div style="background:#F7F1E5;border-radius:12px;padding:16px;margin-bottom:24px;">
                <p style="font-size:12px;color:#6B7B4F;margin:0 0 4px;text-transform:uppercase;letter-spacing:1px;">Número de pedido</p>
                <p style="font-family:Georgia,serif;font-size:22px;color:#C97B5C;font-weight:400;margin:0;">${data.orderNumber}</p>
              </div>

              <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
                <tbody>${itemsHtml(data.items)}</tbody>
              </table>

              <div style="text-align:right;border-top:2px solid #4A5D3A;padding-top:12px;">
                <span style="font-family:Georgia,serif;font-size:20px;color:#4A5D3A;font-weight:600;">Total: ${fmt(data.total)}</span>
              </div>
            </div>

            <div style="text-align:center;margin-bottom:24px;">
              <a href="${APP_URL}/order/${data.orderNumber}" style="display:inline-block;background:#4A5D3A;color:#F7F1E5;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:500;">
                Ver estado de mi pedido →
              </a>
            </div>

            <p style="text-align:center;color:#4A4F45;font-size:14px;line-height:1.6;">
              Cualquier duda, escríbenos por WhatsApp al<br>
              <a href="https://wa.me/573054223600" style="color:#C97B5C;text-decoration:none;font-weight:600;">+57 305 422 3600</a>
            </p>

            <div style="text-align:center;margin-top:32px;padding-top:24px;border-top:1px solid #EDE3CD;">
              <p style="color:#6B7B4F;font-size:12px;margin:0;">© 2026 Infinity Global Shop · Hecho con cariño en Medellín 🌿</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log("✅ Email cliente result:", JSON.stringify(result));
  } catch (e) {
    console.error("❌ Error enviando email cliente:", e);
  }
}

export async function sendNewOrderNotificationToAdmin(data: OrderEmailData) {
  if (!process.env.RESEND_API_KEY) return;

  const cleanedAdmin = cleanEmail(ADMIN_EMAIL);
  if (!cleanedAdmin) {
    console.log("❌ ADMIN_EMAIL inválido:", ADMIN_EMAIL);
    return;
  }

  console.log("📧 Enviando email a admin:", cleanedAdmin);

  try {
    const result = await resend.emails.send({
      from: `Infinity Global Shop <${FROM_EMAIL}>`,
      to: cleanedAdmin,
      subject: `🔔 Nuevo pedido ${data.orderNumber} · ${fmt(data.total)}`,
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:0;background:#F7F1E5;font-family:Inter,sans-serif;">
          <div style="max-width:580px;margin:0 auto;padding:32px 16px;">
            <div style="background:#4A5D3A;border-radius:20px;padding:24px;margin-bottom:24px;text-align:center;">
              <p style="color:#C9A96E;font-size:13px;margin:0 0 4px;text-transform:uppercase;letter-spacing:2px;">Nuevo pedido</p>
              <h1 style="font-family:Georgia,serif;font-size:28px;color:#F7F1E5;font-weight:400;margin:0;">${data.orderNumber}</h1>
              <p style="font-family:Georgia,serif;font-size:22px;color:#C9A96E;margin:8px 0 0;">${fmt(data.total)}</p>
            </div>

            <div style="background:#FDFAF3;border-radius:20px;padding:24px;border:1px solid #EDE3CD;margin-bottom:16px;">
              <p style="font-size:12px;color:#6B7B4F;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Cliente</p>
              <p style="color:#4A5D3A;font-weight:600;font-size:16px;margin:0 0 6px;">${data.customerName}</p>
              <p style="color:#4A4F45;font-size:14px;margin:0 0 4px;">📞 ${data.customerPhone}</p>
              <p style="color:#4A4F45;font-size:14px;margin:0 0 4px;">📧 ${data.customerEmail}</p>
              <p style="color:#4A4F45;font-size:14px;margin:0;">📍 ${data.customerAddress}</p>
            </div>

            <div style="background:#FDFAF3;border-radius:20px;padding:24px;border:1px solid #EDE3CD;margin-bottom:24px;">
              <p style="font-size:12px;color:#6B7B4F;margin:0 0 12px;text-transform:uppercase;letter-spacing:1px;">Productos</p>
              <table style="width:100%;border-collapse:collapse;">
                <tbody>${itemsHtml(data.items)}</tbody>
              </table>
              <div style="text-align:right;border-top:2px solid #4A5D3A;padding-top:12px;margin-top:8px;">
                <span style="font-family:Georgia,serif;font-size:18px;color:#4A5D3A;font-weight:600;">Total: ${fmt(data.total)}</span>
              </div>
            </div>

            <div style="text-align:center;">
              <a href="${APP_URL}/admin/orders" style="display:inline-block;background:#4A5D3A;color:#F7F1E5;text-decoration:none;padding:14px 28px;border-radius:100px;font-size:15px;font-weight:500;">
                Ver en admin →
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    console.log("✅ Email admin result:", JSON.stringify(result));
  } catch (e) {
    console.error("❌ Error enviando email admin:", e);
  }
}
