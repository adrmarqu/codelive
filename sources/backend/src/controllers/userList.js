/* Lista de usuarios (solo admin): buscar, filtrar, cambiar rol, eliminar */

const { getAllUsers, updateRole, deleteUser } = require('../models/user.js');

const VALID_ROLES = ['user', 'editor', 'admin'];

/*
 * Búsqueda y filtrado en memoria (el conjunto de usuarios es pequeño):
 *  - search: si es solo número busca por id; si tiene letras busca en username/email
 *  - roles:  lista separada por comas; vacío = todos
 *  - min/max: rango de progreso
 *  - sort:   'name' | 'progress'   order: 'asc' | 'desc'
 */
const listUsers = async (req, res) =>
{
    try
    {
        let users = await getAllUsers();

        const { search, roles, min, max, sort, order } = req.query;

        if (search && search.trim())
        {
            const term = search.trim().toLowerCase();
            const isNumeric = /^\d+$/.test(term);

            users = users.filter(u =>
                isNumeric
                    ? String(u.id) === term
                    : (u.username.toLowerCase().includes(term) ||
                       u.email.toLowerCase().includes(term))
            );
        }

        if (roles && roles.trim())
        {
            const selected = roles.split(',').map(r => r.trim()).filter(Boolean);
            if (selected.length > 0 && selected.length < VALID_ROLES.length)
                users = users.filter(u => selected.includes(u.rol));
        }

        if (min !== undefined && min !== '')
            users = users.filter(u => u.progress >= Number(min));
        if (max !== undefined && max !== '')
            users = users.filter(u => u.progress <= Number(max));

        if (sort === 'name' || sort === 'progress')
        {
            const dir = order === 'desc' ? -1 : 1;
            users.sort((a, b) =>
            {
                if (sort === 'name')
                    return a.username.localeCompare(b.username) * dir;
                return (a.progress - b.progress) * dir;
            });
        }

        return res.status(200).json(users);
    }
    catch (error)
    {
        console.error("Error al listar usuarios:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

const changeRole = async (req, res) =>
{
    const { id } = req.params;
    const { rol } = req.body;

    if (!VALID_ROLES.includes(rol))
        return res.status(400).json({ message: "Rol no válido" });

    if (Number(id) === req.user.id)
        return res.status(400).json({ message: "No puedes cambiar tu propio rol" });

    try
    {
        const result = await updateRole(id, rol);
        if (!result)
            return res.status(404).json({ message: "Usuario no encontrado" });

        return res.status(200).json({ message: "Rol actualizado" });
    }
    catch (error)
    {
        console.error("Error al cambiar rol:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

const removeUser = async (req, res) =>
{
    const { id } = req.params;

    if (Number(id) === req.user.id)
        return res.status(400).json({ message: "No puedes eliminar tu propia cuenta aquí" });

    try
    {
        const result = await deleteUser(id);
        if (!result)
            return res.status(404).json({ message: "Usuario no encontrado" });

        return res.status(200).json({ message: "Usuario eliminado" });
    }
    catch (error)
    {
        console.error("Error al eliminar usuario:", error);
        return res.status(500).json({ message: "Internal error" });
    }
};

module.exports = { listUsers, changeRole, removeUser };
