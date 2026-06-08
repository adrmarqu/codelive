/* Perfil: ver datos y actualizar usuario, email, contraseña y eliminar cuenta */

const {
    getUserById,
    usernameTaken,
    emailTaken,
    updateUsername,
    updateEmail,
    updatePassword,
    getPasswordHash,
    checkPass,
    deleteUser
} = require('../models/user.js');

const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const userRegex = /^(?![0-9])[a-zA-Z0-9-_]{2,50}$/;

const getProfile = async (req, res) =>
{
    try
    {
        const user = await getUserById(req.user.id);
        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado" });

        return res.status(200).json(user);
    }
    catch (error)
    {
        console.error("Error al obtener perfil:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

const changeUsername = async (req, res) =>
{
    const { username } = req.body;

    if (!username)
        return res.status(400).json({ message: "Campo vacío" });

    if (!userRegex.test(username))
        return res.status(400).json({ message: "Formato de usuario incorrecto" });

    try
    {
        if (await usernameTaken(req.user.id, username))
            return res.status(409).json({ message: "Ese nombre de usuario ya está en uso" });

        await updateUsername(req.user.id, username);
        return res.status(200).json({ message: "Nombre de usuario actualizado" });
    }
    catch (error)
    {
        console.error("Error al actualizar usuario:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

const changeEmail = async (req, res) =>
{
    const { email } = req.body;

    if (!email)
        return res.status(400).json({ message: "Campo vacío" });

    if (!emailRegex.test(email))
        return res.status(400).json({ message: "Formato de email inválido" });

    try
    {
        if (await emailTaken(req.user.id, email))
            return res.status(409).json({ message: "Ese email ya está en uso" });

        await updateEmail(req.user.id, email);
        return res.status(200).json({ message: "Email actualizado" });
    }
    catch (error)
    {
        console.error("Error al actualizar email:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

const changePassword = async (req, res) =>
{
    const { current, pass, rep } = req.body;

    if (!current || !pass || !rep)
        return res.status(400).json({ message: "Campos vacíos" });

    if (!passRegex.test(pass))
        return res.status(400).json({ message: "La contraseña no cumple los requisitos" });

    if (pass !== rep)
        return res.status(400).json({ message: "Las contraseñas no coinciden" });

    try
    {
        const hash = await getPasswordHash(req.user.id);
        if (!hash)
            return res.status(404).json({ message: "Usuario no encontrado" });

        const isMatch = await checkPass(current, hash);
        if (!isMatch)
            return res.status(401).json({ message: "La contraseña actual no es correcta" });

        await updatePassword(req.user.id, pass);
        return res.status(200).json({ message: "Contraseña actualizada" });
    }
    catch (error)
    {
        console.error("Error al actualizar contraseña:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

const deleteAccount = async (req, res) =>
{
    try
    {
        await deleteUser(req.user.id);
        return res.status(200).json({ message: "Cuenta eliminada" });
    }
    catch (error)
    {
        console.error("Error al eliminar cuenta:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

module.exports = { getProfile, changeUsername, changeEmail, changePassword, deleteAccount };
