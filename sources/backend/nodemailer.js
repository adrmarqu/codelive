const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   parseInt('587'),
    secure: false,
    auth: {
        user: 'codelive.noreply@gmail.com',
        pass: 'pyfh jzsi xiaw wfgf'
    }
});

const sendRecoveryEmail = async (to) =>
{
    try
    {
        console.log("FROM:", `"CodeLive" <codelive.noreply@gmail.com>`);
        console.log("TO:", to);
        console.log("subject:", '🔐 Recupera tu contraseña de CodeLive');
        const info = await transporter.sendMail(
        {
            from:    `"CodeLive" <codelive.noreply@gmail.com>`,
            to,
            subject: '🔐 Recupera tu contraseña de CodeLive',
            text: 'Hola mundo'
        });

        console.log("✅ Correo enviado con éxito:", info.messageId);
    }
    catch (error)
    {
        console.error("❌ Error crítico al enviar el correo:", error);
        throw error;
    }
};

sendRecoveryEmail('adria.marquez.3b@gmail.com');