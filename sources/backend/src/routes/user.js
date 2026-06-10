/* profile, ranking, progress, contact, list, update  */

const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/middleware');

const {
    getProfile,
    changeUsername,
    changeEmail,
    changePassword,
    deleteAccount
} = require('../controllers/profile.js');

const { getRanking, getProgress, getProgressByUsername } = require('../controllers/stats.js');
const { listUsers, changeRole, removeUser } = require('../controllers/userList.js');
const { postContact, getContacts } = require('../controllers/others.js');


/* Todas las rutas de usuario requieren estar autenticado */
router.use(protect);

/* Contacto: cualquier usuario autenticado puede enviar */
router.post('/contact', postContact);

/* Datos básicos del usuario autenticado (rol, etc.) */
router.get('/me', (req, res) =>
{
    if (req.user)
    {
        return res.json(
        {
            id: req.user.id,
            username: req.user.username || 'Guest',
            email: req.user.email,
            rol: req.user.rol || 'guest'
        });
    }
    return res.json({ rol: 'guest' });
});

/* Perfil y actualización de cuenta */
router.get('/profile', getProfile);
router.put('/profile/username', changeUsername);
router.put('/profile/email', changeEmail);
router.put('/profile/password', changePassword);
router.delete('/profile', deleteAccount);

/* Estadísticas */
router.get('/progress', getProgress);
router.get('/progress/:username', restrictTo('admin'), getProgressByUsername);
router.get('/ranking', getRanking);

/* Administración (solo admin) */
router.get('/contact', restrictTo('admin'), getContacts);
router.get('/list', restrictTo('admin'), listUsers);
router.put('/list/:id/role', restrictTo('admin'), changeRole);
router.delete('/list/:id', restrictTo('admin'), removeUser);

module.exports = router;
