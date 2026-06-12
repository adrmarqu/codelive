const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendRecoveryEmail = async (to, token) =>
{
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const link = `${frontendUrl}/auth/reset/${token}`;

    const htmlText = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperar contraseña</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e0e0e0; margin: 0; padding: 0; }
            .container { max-width: 560px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #6c63ff, #3b82f6); padding: 40px 32px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; color: #fff; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
            .body { padding: 32px; }
            .body p { line-height: 1.7; color: #b0b0c0; font-size: 15px; }
            .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: linear-gradient(135deg, #6c63ff, #3b82f6); color: #fff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; }
            .note { font-size: 13px; color: #666; margin-top: 24px; border-top: 1px solid #2a2a3e; padding-top: 16px; }
            .link-text { word-break: break-all; color: #6c63ff; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 CodeLive</h1>
                <p>Recuperación de contraseña</p>
            </div>
            <div class="body">
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, ignora este correo.</p>
                <p>Haz clic en el botón para crear una nueva contraseña:</p>
                <a href="${link}" class="btn">Restablecer contraseña</a>
                <p class="note">
                    Este enlace es válido durante <strong>1 hora</strong>. Si el botón no funciona, copia y pega esta URL en tu navegador:<br>
                    <span class="link-text">${link}</span>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    try {
        const data = await resend.emails.send({
            from: 'CodeLive <onboarding@resend.dev>', // Te dan este de prueba
            to: [to],
            subject: '🔐 Recupera tu contraseña de CodeLive',
            html: htmlText,
        });
        console.log("¡Enviado con éxito a través de API!", data);
    } catch (error) {
        console.error("Error con la API de Resend:", error);
    }
}

module.exports = { sendRecoveryEmail };


/* 
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:   process.env.SMTP_HOST || 'smtp.gmail.com',
    port:   parseInt(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === "true" || process.env.SMTP_SECURE === true,

    family: 4,
    auth:
    {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

const sendRecoveryEmail = async (to, token) =>
{
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const link = `${frontendUrl}/auth/reset/${token}`;

    const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Recuperar contraseña</title>
        <style>
            body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f1a; color: #e0e0e0; margin: 0; padding: 0; }
            .container { max-width: 560px; margin: 40px auto; background: #1a1a2e; border-radius: 16px; overflow: hidden; box-shadow: 0 8px 32px rgba(0,0,0,0.5); }
            .header { background: linear-gradient(135deg, #6c63ff, #3b82f6); padding: 40px 32px; text-align: center; }
            .header h1 { margin: 0; font-size: 28px; color: #fff; font-weight: 700; letter-spacing: -0.5px; }
            .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 14px; }
            .body { padding: 32px; }
            .body p { line-height: 1.7; color: #b0b0c0; font-size: 15px; }
            .btn { display: inline-block; margin: 24px 0; padding: 14px 32px; background: linear-gradient(135deg, #6c63ff, #3b82f6); color: #fff !important; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 16px; }
            .note { font-size: 13px; color: #666; margin-top: 24px; border-top: 1px solid #2a2a3e; padding-top: 16px; }
            .link-text { word-break: break-all; color: #6c63ff; font-size: 12px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🔐 CodeLive</h1>
                <p>Recuperación de contraseña</p>
            </div>
            <div class="body">
                <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta. Si no fuiste tú, ignora este correo.</p>
                <p>Haz clic en el botón para crear una nueva contraseña:</p>
                <a href="${link}" class="btn">Restablecer contraseña</a>
                <p class="note">
                    Este enlace es válido durante <strong>1 hora</strong>. Si el botón no funciona, copia y pega esta URL en tu navegador:<br>
                    <span class="link-text">${link}</span>
                </p>
            </div>
        </div>
    </body>
    </html>
    `;

    try
    {
        console.log("host:", process.env.SMTP_HOST);
        console.log("port:", process.env.SMTP_PORT);
        console.log("secure:", process.env.SMTP_SECURE);
        console.log("user:", process.env.SMTP_USER);
        console.log("pass:", process.env.SMTP_PASS);

        console.log("FROM:", `"CodeLive" <${process.env.SMTP_USER}>`);
        console.log("TO:", to);
        console.log("subject:", '🔐 Recupera tu contraseña de CodeLive');
        const info = await transporter.sendMail(
        {
            from:    `"CodeLive" <${process.env.SMTP_USER}>`,
            to,
            subject: '🔐 Recupera tu contraseña de CodeLive',
            html
        });
        
        console.log("Email enviado con exito!");
    }
    catch (error)
    {
        console.error("❌ Error crítico al enviar el correo:", error);
        throw error;
    }
};

module.exports = { sendRecoveryEmail }; */
