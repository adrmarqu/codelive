const { createResetToken, validateResetToken, markTokenUsed } = require('../models/recover.js');
const { updatePassword } = require('../models/user.js');
const { sendRecoveryEmail } = require('../config/mailer.js');

const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/auth/recover
 * Body: { email }
 * Genera un token y envía el correo. Siempre responde igual
 * (para no revelar si el email existe en la BD).
 */
const requestRecovery = async (req, res) =>
{
    const { email } = req.body;

    if (!email || !emailRegex.test(email))
        return res.status(400).json({ message: 'Email inválido.' });

    try
    {
        const token = await createResetToken(email);

        /* Si el email existe, mandamos el correo. Si no, callamos. */
        if (token)
            await sendRecoveryEmail(email, token);

        /* Respuesta genérica siempre igual */
        return res.status(200).json({
            message: 'Si el email existe, recibirás un correo con las instrucciones.'
        });
    }
    catch (error)
    {
        console.error('❌ Error en requestRecovery:', error);
        return res.status(500).json({ message: 'Error interno.' });
    }
};

/**
 * GET /api/auth/recover/validate/:token
 * Comprueba si el token es válido (no usado, no expirado).
 */
const validateToken = async (req, res) =>
{
    const { token } = req.params;

    if (!token)
        return res.status(400).json({ message: 'Token requerido.' });

    try
    {
        const userId = await validateResetToken(token);

        if (!userId)
            return res.status(400).json({ valid: false, message: 'Token inválido o expirado.' });

        return res.status(200).json({ valid: true });
    }
    catch (error)
    {
        console.error('❌ Error en validateToken:', error);
        return res.status(500).json({ message: 'Error interno.' });
    }
};

/**
 * POST /api/auth/recover/reset
 * Body: { token, pass, rep }
 * Establece la nueva contraseña si el token es válido.
 */
const resetPassword = async (req, res) =>
{
    const { token, pass, rep } = req.body;

    if (!token || !pass || !rep)
        return res.status(400).json({ message: 'Campos requeridos.' });

    if (!passRegex.test(pass))
        return res.status(400).json({ message: 'La contraseña no cumple los requisitos.' });

    if (pass !== rep)
        return res.status(400).json({ message: 'Las contraseñas no coinciden.' });

    try
    {
        const userId = await validateResetToken(token);

        if (!userId)
            return res.status(400).json({ message: 'Token inválido o expirado.' });

        await updatePassword(userId, pass);
        await markTokenUsed(token);

        return res.status(200).json({ message: 'Contraseña restablecida con éxito.' });
    }
    catch (error)
    {
        console.error('❌ Error en resetPassword:', error);
        return res.status(500).json({ message: 'Error interno.' });
    }
};

module.exports = { requestRecovery, validateToken, resetPassword };
