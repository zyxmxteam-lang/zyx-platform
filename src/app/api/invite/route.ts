import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { email, role, invitedBy } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email requerido" }, { status: 400 });
    }

    const gmailUser = process.env.GMAIL_USER;
    const gmailPass = process.env.GMAIL_APP_PASSWORD;

    if (!gmailUser || !gmailPass) {
      return NextResponse.json(
        { error: "Email no configurado. Agrega GMAIL_USER y GMAIL_APP_PASSWORD en las variables de entorno." },
        { status: 503 }
      );
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
    });

    const platformUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://zyx-platform.vercel.app";
    const roleLabels: Record<string, string> = {
      admin: "Administrador",
      member: "Miembro",
      viewer: "Observador",
    };

    const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Invitación ZYX</title>
</head>
<body style="margin:0;padding:0;background:#080808;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#080808;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background:#111111;border:1px solid #1e1e1e;border-radius:16px;overflow:hidden;">

          <!-- Header -->
          <tr>
            <td style="background:#0d0d0d;padding:32px 40px;border-bottom:1px solid #1e1e1e;">
              <p style="margin:0;font-size:22px;font-weight:800;letter-spacing:0.18em;color:#ffffff;">ZYX</p>
              <p style="margin:6px 0 0;font-size:11px;color:#3a3a3a;letter-spacing:0.1em;text-transform:uppercase;">Plataforma Interna</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 6px;font-size:22px;font-weight:700;color:#ffffff;letter-spacing:-0.02em;">
                Te invitaron a ZYX
              </p>
              <p style="margin:0 0 28px;font-size:14px;color:#555555;line-height:1.6;">
                ${invitedBy ?? "El equipo de ZYX"} te ha invitado a unirte a la plataforma interna como <strong style="color:#cccccc;">${roleLabels[role] ?? role}</strong>.
              </p>

              <!-- Role badge -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:rgba(59,130,246,0.1);border:1px solid rgba(59,130,246,0.2);border-radius:8px;padding:10px 16px;">
                    <p style="margin:0;font-size:12px;color:#888;text-transform:uppercase;letter-spacing:0.06em;">Tu rol</p>
                    <p style="margin:4px 0 0;font-size:15px;font-weight:600;color:#3b82f6;">${roleLabels[role] ?? role}</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
                <tr>
                  <td style="background:#ffffff;border-radius:10px;">
                    <a href="${platformUrl}/register" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:600;color:#000000;text-decoration:none;letter-spacing:0.01em;">
                      Crear mi cuenta →
                    </a>
                  </td>
                </tr>
              </table>

              <p style="margin:0;font-size:12px;color:#444444;line-height:1.6;">
                O copia este link en tu navegador:<br/>
                <span style="color:#666666;">${platformUrl}/register</span>
              </p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 40px;">
              <div style="height:1px;background:#1e1e1e;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:24px 40px;">
              <p style="margin:0;font-size:11px;color:#333333;line-height:1.6;">
                Este email fue enviado por ZYX · Plataforma interna de uso exclusivo para el equipo.<br/>
                Si no esperabas esta invitación, puedes ignorar este mensaje.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    await transporter.sendMail({
      from: `"ZYX Plataforma" <${gmailUser}>`,
      to: email,
      subject: "Te invitaron a ZYX — Plataforma Interna",
      html,
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Invite email error:", err);
    return NextResponse.json({ error: "Error al enviar el email. Verifica la configuración de Gmail." }, { status: 500 });
  }
}
