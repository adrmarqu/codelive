/* profile, ranking, progress, contact, list, update  */

const express = require('express');
const router = express.Router();

router.get('/me', (req, res) =>
{
    if (req.session && req.session.user)
    {
        return res.json({
            id: req.session.user.id,
            username: req.session.user.username,
            email: req.session.user.email,
            rol: req.session.user.rol,
        });
    }
    return res.json({ rol: 'guest' });
});

module.exports = router;