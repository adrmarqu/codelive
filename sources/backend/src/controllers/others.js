/* Contacto: enviar mensaje (usuario) y listar mensajes (admin) */

const { createContact, getAllContacts } = require('../models/contact.js');
const { getUserData } = require('../models/user.js');

const postContact = async (req, res) =>
{
    const userRole = req.params.userRole || 'guest';
    const { comment, email } = req.body;

    if (!comment || !comment.trim())
        return res.status(400).json({ message: "El mensaje no puede estar vacío" });

    if (comment.length > 2000)
        return res.status(400).json({ message: "El mensaje es demasiado largo" });

    try
    {
        let userId = null;
        let emailGuest = null;

        if (userRole !== 'guest')
        {
            userId = req.user.id;
            emailGuest = null;
        }
        else
        {
            if (!email || !email.trim())
                return res.status(400).json({ message: "El correo electrónico es obligatorio para invitados" });

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email.trim()))
            {
                return res.status(400).json({ message: "El formato del correo electrónico no es válido" });
            }
            emailGuest = email.trim();
        }

        await createContact(userId, comment.trim(), emailGuest);

        return res.status(201).json({ message: "Mensaje enviado con éxito" });
    }
    catch (error)
    {
        console.error("Error al enviar mensaje:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

const getContacts = async (req, res) =>
{
    try
    {
        const contacts = await getAllContacts();
        return res.status(200).json(contacts || []);
    }
    catch (error)
    {
        console.error("Error al obtener mensajes:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

module.exports = { postContact, getContacts };
