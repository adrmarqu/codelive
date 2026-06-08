/* Contacto: enviar mensaje (usuario) y listar mensajes (admin) */

const { createContact, getAllContacts } = require('../models/contact.js');

const postContact = async (req, res) =>
{
    const { comment } = req.body;

    if (!comment || !comment.trim())
        return res.status(400).json({ message: "El mensaje no puede estar vacío" });

    if (comment.length > 2000)
        return res.status(400).json({ message: "El mensaje es demasiado largo" });

    try
    {
        await createContact(req.user.id, comment.trim());
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
